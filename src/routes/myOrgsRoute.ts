import express from "express";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq, and } from "drizzle-orm";
import * as schema from "../db/schema";
import bcrypt from "bcryptjs";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle({ client: sql });

const router = express.Router();
const SALT_ROUNDS = 10;


// ---- Create a new org -----
router.post("/organizations", async (req, res) => {
  const {
    org_name, org_code, org_password, body, visibility, is_business,
    creator_id, business_name, website_url, industry, contact_email, logo_url,
  } = req.body;

  try {
    // Check if org_code already exists
    const existing = await db
      .select()
      .from(schema.organizations)
      .where(eq(schema.organizations.org_code, org_code));

    if (existing.length > 0) {
      return res.status(409).json({ error: "Organization code already exists" });
    }

    // Hash password if provided
    const hashedOrgPassword = org_password
      ? await bcrypt.hash(org_password, SALT_ROUNDS)
      : null;

    // Insert organization
    const [org] = await db
      .insert(schema.organizations)
      .values({
        org_name,
        org_code,
        org_password: hashedOrgPassword ?? "",
        body,
        visibility,
        is_business,
        creator_id,
        created_at: new Date(),
      })
      .returning({ org_id: schema.organizations.org_id });

    const org_id = org.org_id;

    // Add creator as admin member
    await db.insert(schema.organization_members).values({
      org_id,
      user_id: creator_id,
      role: "admin",
      joined_at: new Date(),
    });

    return res.status(200).json({ message: "Organization created", org_id });

  } catch (error) {
    console.error("Create org error:", error);
    return res.status(500).json({ error: "Failed to create organization" });
  }
});
//------------------------------

// ---- Get organizations the user belongs to ----
router.get("/users/:userId/organizations", async (req, res) => {
  const userId = parseInt(req.params.userId);
  if (!userId) return res.status(400).json({ error: "Invalid user ID" });

  try {
    const userOrgs = await db
      .select({
        orgId: schema.organizations.org_id,
        orgName: schema.organizations.org_name,
        type: schema.organizations.is_business,
        description: schema.organizations.body,
        industry: schema.business_details.industry,
        role: schema.organization_members.role,
      })
      .from(schema.organization_members)
      .innerJoin(
        schema.organizations,
        eq(schema.organization_members.org_id, schema.organizations.org_id)
      )
      .leftJoin(
        schema.business_details,
        eq(schema.organizations.org_id, schema.business_details.org_id)
      )
      .where(eq(schema.organization_members.user_id, userId));

    // Convert is_business to "business"/"personal"
    const formatted = userOrgs.map((org) => ({
      ...org,
      type: org.type ? "business" : "personal",
    }));

    res.status(200).json(formatted);
  } catch (error) {
    console.error("Fetch user orgs error:", error);
    res.status(500).json({ error: "Failed to fetch user organizations" });
  }
});
//------------------------------

// ---- search organization by code ----
router.get("/organizations/code/:orgCode", async (req, res) => {
  const orgCode = req.params.orgCode.trim();

  try {
    const org = await db
      .select({
        orgId: schema.organizations.org_id,
        orgName: schema.organizations.org_name,
        visibility: schema.organizations.visibility,
        isBusiness: schema.organizations.is_business,
      })
      .from(schema.organizations)
      .where(eq(schema.organizations.org_code, orgCode))
      .limit(1);

    if (org.length === 0) {
      return res.status(404).json({ error: "Organization not found" });
    }

    res.json(org[0]);
  } catch (error) {
    console.error("Error fetching organization by code:", error);
    res.status(500).json({ error: "Server error" });
  }
});
//------------------------------

//---- join for private org ----
router.post("/organizations/join", async (req, res) => {
  const { user_id, org_code, org_password } = req.body;

  // Step 1: Validate input
 if (!user_id || !org_code || (org_password === undefined && req.body.org_password !== "")) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  try {
    // Step 2: Find org by code and join business details if available
    const orgs = await db
      .select()
      .from(schema.organizations)
      .leftJoin(
        schema.business_details,
        eq(schema.organizations.org_id, schema.business_details.org_id)
      )
      .where(eq(schema.organizations.org_code, org_code));

    if (orgs.length === 0) {
      return res.status(404).json({ error: "Organization not found." });
    }

    const org = orgs[0];

    // Step 3: Check password if private org
    if (org.organizations.visibility === "private") {
      const isMatch = await bcrypt.compare(org_password, org.organizations.org_password);
      if (!isMatch) {
        return res.status(401).json({ error: "Incorrect organization password." });
      } 
    }

    // Step 4: Prevent duplicate membership
    const existing = await db
      .select()
      .from(schema.organization_members)
      .where(
        and(
          eq(schema.organization_members.org_id, org.organizations.org_id),
          eq(schema.organization_members.user_id, Number(user_id))
        )
      );

    if (existing.length > 0) {
      return res.status(400).json({ error: "You're already a member of this org.." });
    }

    // Step 5: Add user to organization
    await db.insert(schema.organization_members).values({
      org_id: org.organizations.org_id,
      user_id: Number(user_id),
      role: "member",
      joined_at: new Date(),
    });

    // Step 6: Return minimal info
    return res.status(200).json({
      orgId: org.organizations.org_id,
      orgName: org.organizations.org_name,
      type: org.organizations.is_business ? "business" : "personal",
      industry: org.business_details?.industry || null,
    });

  } catch (error) {
    console.error("Join org error:", error);
    return res.status(500).json({ error: "Failed to join organization." });
  }
});
//------------------------------

export default router;


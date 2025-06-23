import express from "express";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq, and } from "drizzle-orm";
import * as schema from "../db/schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle({ client: sql });

const router = express.Router();

// --- Fetch all public orgs---
 router.get("/organizations", async (req, res) => {
  try {
    const orgs = await db
      .select({
        org_id: schema.organizations.org_id,
        org_name: schema.organizations.org_name,
        org_code: schema.organizations.org_code,
        body: schema.organizations.body,
        visibility: schema.organizations.visibility,
        is_business: schema.organizations.is_business,
      })
      .from(schema.organizations)
      .where(eq(schema.organizations.visibility, "public"));

    res.status(200).json(orgs);
  } catch (error) {
    console.error("Fetch orgs error:", error);
    res.status(500).json({ error: "Failed to fetch organizations" });
  }
});

export default router;
import express from "express";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq, and } from "drizzle-orm";
import * as schema from "../db/schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle({ client: sql });

const router = express.Router();

// --- Fetch org's tasks ---
router.get("/organizations/:orgId/tasks", async (req, res) => {
  const { orgId } = req.params;

  try {
    const tasks = await db
      .select({
        task_id: schema.task.task_id,
        task_title: schema.task.task_title,
        task_status: schema.task.taskStatus,
        assignee_id: schema.task_assignees.user_id,
        assignee_name: schema.users.name,
      })
      .from(schema.task)
      .leftJoin(schema.task_assignees, eq(schema.task.task_id, schema.task_assignees.task_id)) //include tasks with no assignee.
      .leftJoin(schema.users, eq(schema.task_assignees.user_id, schema.users.user_id))
      .where(eq(schema.task.org_id, parseInt(orgId)));

    res.json(tasks);
  } catch (error) {
    console.error("Failed to fetch org tasks", error);
    res.status(500).json({ error: "Failed to fetch org tasks" });
  }
});

// --- Update status of task for org (done - todo) ---
router.put("/update-task-status/:id", async (req, res) => {
  const taskId = Number(req.params.id);
  const { status } = req.body;

  if (!["todo", "done"].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  try {
    await db.update(schema.task)
      .set({ taskStatus: status })
      .where(eq(schema.task.task_id, taskId));

    res.json({ success: true });
  } catch (error) {
    console.error("Failed to update task status", error);
    res.status(500).json({ error: "Failed to update status" });
  }
});


// ---- Get members to be assigned to ----
router.get("/organizations/:orgId/members", async (req, res) => {
  const orgId = Number(req.params.orgId);
  if (isNaN(orgId)) return res.status(400).json({ error: "Invalid org ID" });

  try {
    const members = await db
      .select({
        user_id: schema.organization_members.user_id,
        name: schema.users.name,
      })
      .from(schema.organization_members)
      .innerJoin(schema.users, eq(schema.organization_members.user_id, schema.users.user_id))
      .where(eq(schema.organization_members.org_id, orgId));

    res.json(members);
  } catch (error) {
    console.error("Error fetching org members:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// ---- Add tasks for org ----
router.post("/org-tasks", async (req, res) => {
  const { title, description = "", org_id, creator_id, assignee_id } = req.body;

  if (!title || !org_id || !creator_id) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const created_at = new Date();

    // Insert task into task table 
    const [newTask] = await db.insert(schema.task).values({
      task_title: title,
      task_description: description,
      org_id,
      creator_id: parseInt(creator_id),
      created_at,
    }).returning();

    // Insert into task_assignees
    if (assignee_id) {
      await db.insert(schema.task_assignees).values({
        org_id,
        task_id: newTask.task_id,
        user_id: parseInt(assignee_id),
        assigned_at: new Date(),
      });
    }
    return res.status(201).json(newTask);
  } catch (error) {
    console.error("Error creating org task:", error);
    return res.status(500).json({ error: "Failed to create task" });
  }
});

// ---- Update tasks for org ----
router.put("/update-task-org/:taskId", async (req, res) => {
  const { taskId } = req.params;
  const { title, assigneeId, orgId } = req.body;

  if (!title || isNaN(Number(orgId))) {
    return res.status(400).json({ error: "Missing or invalid title/orgId" });
  }

  try {
    // 1. Update title
    await db.update(schema.task)
      .set({ task_title: title })
      .where(eq(schema.task.task_id, Number(taskId)));

    // 2. Remove old assignments
    await db.delete(schema.task_assignees)
      .where(
        and(
          eq(schema.task_assignees.task_id, Number(taskId)),
          eq(schema.task_assignees.org_id, Number(orgId))
        )
      );

    // 3. Insert new assignment only if assigneeId is valid
    if (assigneeId && !isNaN(Number(assigneeId))) {
      await db.insert(schema.task_assignees).values({
        task_id: Number(taskId),
        org_id: Number(orgId),
        user_id: Number(assigneeId),
        assigned_at: new Date(),
      });
    }

    // 4. Return updated task with assignee name
    const updatedTask = await db
      .select({
        task_id: schema.task.task_id,
        task_title: schema.task.task_title,
        assignee_name: schema.users.name,
      })
      .from(schema.task)
      .leftJoin(schema.task_assignees, eq(schema.task.task_id, schema.task_assignees.task_id))
      .leftJoin(schema.users, eq(schema.users.user_id, schema.task_assignees.user_id))
      .where(eq(schema.task.task_id, Number(taskId)))
      .limit(1);

    return res.json(updatedTask[0]); // ✅ All good
  } catch (err) {
    console.error("Failed to update task", err);
    res.status(500).json({ error: "Failed to update task" });
  }
});

export default router;
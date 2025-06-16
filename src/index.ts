/*
first to run it (npx tsx src/index.ts )
then open another termanl (npx ngrok http 3000)
then change forwarding .env( EXPO_PUBLIC_API_URL)
run the project 
 */

import "dotenv/config";
import express from "express";
import cors from "cors";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import * as schema from "./db/schema";
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;
const sql = neon(process.env.DATABASE_URL!);
const db = drizzle({ client: sql });

const app = express();
app.use(cors());
app.use(express.json());

// === SIGNUP ===
app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    await db.insert(schema.users).values({
      name,
      email,
      password: hashedPassword,
      created_at: new Date(),
    });

    res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Failed to register user" });
  }
});

// === LOGIN ===
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, email));

    if (!user || user.length === 0) {
      return res.status(401).json({ error: "User not found" });
    }

    const match = await bcrypt.compare(password, user[0].password);
    if (!match) {
      return res.status(401).json({ error: "Invalid password" });
    }

    res.status(200).json({
      user_id: user[0].user_id,
      name: user[0].name,
      email: user[0].email,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

// === ADD TASK ===
app.post("/add-task", async (req, res) => {
  const { title, description, creator_id } = req.body;

  try {
    await db.insert(schema.task).values({
      task_title: title,
      task_description: description || "",
      created_at: new Date(),
      creator_id,
    });

    res.status(200).json({ message: "Task created" });
  } catch (error) {
    console.error("Task error:", error);
    res.status(500).json({ error: "Failed to create task" });
  }
});

// ✅ === GET TASKS BY USER ===
app.get("/tasks/:id", async (req, res) => {
  const userId = parseInt(req.params.id);
  if (!userId) return res.status(400).json({ error: "Invalid user ID" });

  try {
    const tasks = await db
      .select()
      .from(schema.task)
      .where(eq(schema.task.creator_id, userId));

    res.status(200).json(tasks);
  } catch (error) {
    console.error("Fetch tasks error:", error);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// === SERVER START ===
app.listen(3000, () => {
  console.log("✅ Server running on port 3000");
});

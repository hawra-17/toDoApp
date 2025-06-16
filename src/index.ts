/*
first to run it (npx tsx src/index.ts )
then open another termanl (npx ngrok http 3000)
then change forwarding on restOfLogin , signUp  & index of (tabs) 
*/

import "dotenv/config";
import express from "express";
import cors from "cors";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { users } from "./db/schema";
import { eq } from "drizzle-orm";
import * as schema from "./db/schema";
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;
const sql = neon(process.env.DATABASE_URL!);
const db = drizzle({ client: sql });

const app = express();
app.use(cors());
app.use(express.json());

// === /signup route ===
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

//login

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await db.select().from(users).where(eq(users.email, email));

    if (user.length === 0) {
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

// add-task route (need fix  )
app.post("/add-task", async (req, res) => {
  const { title, description, creator_id } = req.body;

  try {
    await db.insert(schema.task).values({
      task_title: title,
      task_description: description || "",
      created_at: new Date(),
      creator_id: creator_id,
    });

    res.status(200).json({ message: "Task created" });
  } catch (error) {
    console.error("Task error:", error);
    res.status(500).json({ error: "Failed to create task" });
  }
});

// === Startup ===
app.listen(3000, () => {
  console.log("✅ Server running on port 3000");
});

// To run the file >> npx tsx src/index.ts

import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { defineConfig } from 'drizzle-kit';
import * as schema from './db/schema';
import bcrypt from 'bcryptjs';

// Connect Drizzle ORM to the database
const sql = neon(process.env.DATABASE_URL!);
const db = drizzle({ client: sql });

const SALT_ROUNDS = 10; // For hashing

type NewUser = {
  email: string;
  name: string;
  password: string; 
};


// QUERIES: 
export async function addUser(user: NewUser) {
  // 1. Hash the password
  const hashedPassword = await bcrypt.hash(user.password, SALT_ROUNDS);

  // 2. Prepare user data 
  const userData = {
    email: user.email,
    name: user.name,
    password: hashedPassword,
    created_at: new Date(),
  };

  // 3. Insert into DB
  await db.insert(schema.users).values(userData);

  console.log('User added successfully!');
}

/* U can add new user this way: */

/*
addUser({
  name: "Zahra",
  email: "z@example.com",
  password: "Z123@",
});
*/

async function main() {

  // Fetch users (will be deleted)
  const users = await db.select().from(schema.users);
  console.log('Stored users:', users);

}

main();
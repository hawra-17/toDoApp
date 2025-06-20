// DB Schema
import {
  pgTable,
  serial,
  integer,
  varchar,
  text,
  timestamp,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";

// Define enums:
export const taskStatusEnum = pgEnum("taskStatus", ["todo", "done"]);
export const visibilityEnum = pgEnum("visibility", ["public", "private"]);
export const industryEnum = pgEnum("industry", [
  "Tech",
  "Retail",
  "Health",
  "Finance",
  "Education",
  "Other",
]);
export const roleEnum = pgEnum("role", ["admin", "member"]);

// Define Tables:
// (1. user)
export const users = pgTable("users", {
  user_id: serial("user_id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name").notNull(),
  password: text("password").notNull(),
  created_at: timestamp("created_at").notNull(),
});

// (2. organizations)
export const organizations = pgTable("organizations", {
  org_id: serial("org_id").primaryKey(),
  org_code: varchar("org_code").notNull().unique(),
  org_name: varchar("org_name").notNull(),
  org_password: varchar("org_password").notNull(),
  body: text("body").notNull(),
  visibility: visibilityEnum("visibility").notNull(),
  is_business: boolean("is_business").notNull().default(false),
  creator_id: integer("creator_id")
    .notNull()
    .references(() => users.user_id),
  created_at: timestamp("created_at").notNull(),
});

// (3. business_details)
export const business_details = pgTable("business_details", {
  org_id: integer("org_id")
    .primaryKey()
    .references(() => organizations.org_id),
  business_name: varchar("business_name").notNull(),
  website_url: varchar("website_url"),
  industry: industryEnum("industry"),
  contact_email: varchar("contact_email", { length: 255 }),
  logo_url: varchar("logo_url", { length: 255 }),
});

// (4. task)
export const task = pgTable("task", {
  task_id: serial("task_id").primaryKey(),
  task_title: varchar("task_title").notNull(),
  task_description: text("task_description").notNull(),
  duedate: timestamp("duedate"),
  taskStatus: taskStatusEnum("status").notNull().default("todo"),
  created_at: timestamp("created_at").notNull(),
  last_edit: timestamp("last_edit"),
  org_id: integer("org_id").references(() => organizations.org_id),
  creator_id: integer("creator_id")
    .notNull()
    .references(() => users.user_id),
});

// (5. task_assignees)
export const task_assignees = pgTable(
  "task_assignees",
  {
    org_id: integer("org_id")
      .notNull()
      .references(() => organizations.org_id),
    task_id: integer("task_id")
      .notNull()
      .references(() => task.task_id),
    user_id: integer("user_id")
      .notNull()
      .references(() => users.user_id),
    assigned_at: timestamp("assigned_at").notNull(),
  },
  (table) => ({
    // Composite primary key (task_id, user_id)
    pk: [table.task_id, table.user_id],
  })
);

// (6. organization_members)
export const organization_members = pgTable(
  "organization_members",
  {
    org_id: integer("org_id")
      .notNull()
      .references(() => organizations.org_id),
    user_id: integer("user_id")
      .notNull()
      .references(() => users.user_id),
    role: roleEnum("role").notNull(),
    joined_at: timestamp("joined_at").notNull(),
  },
  (table) => ({
    // Composite primary key (org_id, user_id)
    pk: [table.org_id, table.user_id],
  })
);

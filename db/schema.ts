import { pgTable, text, integer, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  username: text("username").unique().notNull(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const educationalContent = pgTable("educational_content", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  subject: text("subject").notNull(), // physics, biology, chemistry, math
  prompt: text("prompt").notNull(),
  animationConfig: jsonb("animation_config").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  createdBy: integer("created_by").references(() => users.id),
  isPublic: boolean("is_public").default(true).notNull(),
});

export const userProgress = pgTable("user_progress", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id").references(() => users.id).notNull(),
  contentId: integer("content_id").references(() => educationalContent.id).notNull(),
  completed: boolean("completed").default(false).notNull(),
  lastInteraction: timestamp("last_interaction").defaultNow().notNull(),
  notes: text("notes"),
  feedback: integer("feedback").default(0), // Rating 1-5
});

// Schema types for users
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = z.infer<typeof selectUserSchema>;

// Schema types for educational content
export const insertEducationalContentSchema = createInsertSchema(educationalContent);
export const selectEducationalContentSchema = createSelectSchema(educationalContent);
export type InsertEducationalContent = z.infer<typeof insertEducationalContentSchema>;
export type EducationalContent = z.infer<typeof selectEducationalContentSchema>;

// Schema types for user progress
export const insertUserProgressSchema = createInsertSchema(userProgress);
export const selectUserProgressSchema = createSelectSchema(userProgress);
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type UserProgress = z.infer<typeof selectUserProgressSchema>;

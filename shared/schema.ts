import { pgTable, text, serial, integer, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  age: integer("age"),
  height: real("height"),
  weight: real("weight"),
  weeklyWorkoutGoal: integer("weekly_workout_goal").default(4),
  targetWeight: real("target_weight"),
  primaryGoal: text("primary_goal").default("general"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const workouts = pgTable("workouts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  type: text("type").notNull(),
  name: text("name").notNull(),
  date: text("date").notNull(), // YYYY-MM-DD format
  time: text("time").notNull(), // HH:MM format
  duration: integer("duration").notNull(), // minutes
  distance: real("distance"), // miles or reps
  calories: integer("calories"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  password: true,
  firstName: true,
  lastName: true,
  age: true,
  height: true,
  weight: true,
  weeklyWorkoutGoal: true,
  targetWeight: true,
  primaryGoal: true,
}).extend({
  email: z.string().email("Please enter a valid email address"),
});

export const insertWorkoutSchema = createInsertSchema(workouts).pick({
  userId: true,
  type: true,
  name: true,
  date: true,
  time: true,
  duration: true,
  distance: true,
  calories: true,
  notes: true,
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const signupSchema = insertUserSchema.extend({
  password: z.string().min(6),
  email: z.string().email("Please enter a valid email address"),
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Workout = typeof workouts.$inferSelect;
export type InsertWorkout = z.infer<typeof insertWorkoutSchema>;
export type LoginData = z.infer<typeof loginSchema>;
export type SignupData = z.infer<typeof signupSchema>;

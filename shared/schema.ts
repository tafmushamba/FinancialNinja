import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User Schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  email: text("email"),
  userLevel: text("user_level").default("Level 1 Investor"),
  financialLiteracyScore: integer("financial_literacy_score").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  settings: json("settings").$type<{
    darkMode: boolean;
    animations: boolean;
    soundEffects: boolean;
    learningDifficulty: 'beginner' | 'intermediate' | 'advanced';
    notifications: {
      email: boolean;
      push: boolean;
      learningReminders: boolean;
      budgetAlerts: boolean;
    };
  }>().default({
    darkMode: true,
    animations: true,
    soundEffects: false,
    learningDifficulty: 'intermediate',
    notifications: {
      email: true,
      push: true,
      learningReminders: true,
      budgetAlerts: true
    }
  }),
});

// Learning Module Schema
export const learningModules = pgTable("learning_modules", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  accentColor: text("accent_color").notNull(),
  totalLessons: integer("total_lessons").notNull(),
  difficulty: text("difficulty").notNull(),
  duration: text("duration").notNull(),
  topics: json("topics").$type<string[]>().default([]),
  prerequisites: json("prerequisites").$type<number[]>().default([]),
  order: integer("order").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Lesson Schema
export const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  moduleId: integer("module_id").notNull().references(() => learningModules.id),
  title: text("title").notNull(),
  content: text("content").notNull(),
  order: integer("order").notNull(),
  duration: integer("duration").notNull(), // in minutes
  quizId: integer("quiz_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User Progress Schema
export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  moduleId: integer("module_id").notNull().references(() => learningModules.id),
  lessonsCompleted: integer("lessons_completed").default(0),
  lastLessonId: integer("last_lesson_id"),
  completed: boolean("completed").default(false),
  percentageComplete: integer("percentage_complete").default(0),
  startedAt: timestamp("started_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

// Achievement Schema
export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  color: text("color").notNull(),
  requirement: text("requirement").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// User Achievement Schema
export const userAchievements = pgTable("user_achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  achievementId: integer("achievement_id").notNull().references(() => achievements.id),
  unlockedAt: timestamp("unlocked_at").defaultNow(),
});

// Financial Account Schema
export const financialAccounts = pgTable("financial_accounts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  type: text("type").notNull(),
  balance: integer("balance").notNull(),
  currency: text("currency").default("USD"),
  isConnected: boolean("is_connected").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Transaction Schema
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  accountId: integer("account_id").notNull().references(() => financialAccounts.id),
  amount: integer("amount").notNull(),
  description: text("description").notNull(),
  category: text("category"),
  date: timestamp("date").defaultNow(),
  isExpense: boolean("is_expense").default(true),
});

// Budget Schema
export const budgets = pgTable("budgets", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  category: text("category").notNull(),
  limit: integer("limit").notNull(),
  period: text("period").default("monthly"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// AI Assistant Message Schema
export const assistantMessages = pgTable("assistant_messages", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  sender: text("sender").notNull(), // 'user' or 'assistant'
  timestamp: timestamp("timestamp").defaultNow(),
});

// Insert Schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  firstName: true,
  lastName: true,
  email: true,
});

export const insertLearningModuleSchema = createInsertSchema(learningModules).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertLessonSchema = createInsertSchema(lessons).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserProgressSchema = createInsertSchema(userProgress).omit({
  id: true,
  startedAt: true,
  completedAt: true,
});

export const insertAchievementSchema = createInsertSchema(achievements).omit({
  id: true,
  createdAt: true,
});

export const insertUserAchievementSchema = createInsertSchema(userAchievements).omit({
  id: true,
  unlockedAt: true,
});

export const insertFinancialAccountSchema = createInsertSchema(financialAccounts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
});

export const insertBudgetSchema = createInsertSchema(budgets).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAssistantMessageSchema = createInsertSchema(assistantMessages).omit({
  id: true,
  timestamp: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertLearningModule = z.infer<typeof insertLearningModuleSchema>;
export type LearningModule = typeof learningModules.$inferSelect;

export type InsertLesson = z.infer<typeof insertLessonSchema>;
export type Lesson = typeof lessons.$inferSelect;

export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type UserProgress = typeof userProgress.$inferSelect;

export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
export type Achievement = typeof achievements.$inferSelect;

export type InsertUserAchievement = z.infer<typeof insertUserAchievementSchema>;
export type UserAchievement = typeof userAchievements.$inferSelect;

export type InsertFinancialAccount = z.infer<typeof insertFinancialAccountSchema>;
export type FinancialAccount = typeof financialAccounts.$inferSelect;

export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;

export type InsertBudget = z.infer<typeof insertBudgetSchema>;
export type Budget = typeof budgets.$inferSelect;

export type InsertAssistantMessage = z.infer<typeof insertAssistantMessageSchema>;
export type AssistantMessage = typeof assistantMessages.$inferSelect;

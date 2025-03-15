import { pgTable, text, serial, integer, boolean, timestamp, json, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User Schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("firstName"),
  lastName: text("lastName"),
  email: text("email"),
  userLevel: text("userLevel").default("Level 1 Investor"),
  financialLiteracyScore: integer("financialLiteracyScore").default(0),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
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
  accentColor: text("accentColor").notNull(),
  totalLessons: integer("totalLessons").notNull(),
  difficulty: text("difficulty").notNull(),
  duration: text("duration").notNull(),
  topics: json("topics").$type<string[]>().default([]),
  prerequisites: json("prerequisites").$type<number[]>().default([]),
  order: integer("order").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

// Lesson Schema
export const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  moduleId: integer("moduleId").notNull().references(() => learningModules.id),
  title: text("title").notNull(),
  content: text("content").notNull(),
  order: integer("order").notNull(),
  duration: integer("duration").notNull(), // in minutes
  quizId: integer("quizId"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

// User Progress Schema
export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull().references(() => users.id),
  moduleId: integer("moduleId").notNull().references(() => learningModules.id),
  lessonsCompleted: integer("lessonsCompleted").default(0),
  lastLessonId: integer("lastLessonId"),
  completed: boolean("completed").default(false),
  percentageComplete: integer("percentageComplete").default(0),
  startedAt: timestamp("startedAt").defaultNow(),
  completedAt: timestamp("completedAt"),
});

// Achievement Schema
export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  color: text("color").notNull(),
  requirement: text("requirement").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
});

// User Achievement Schema
export const userAchievements = pgTable("user_achievements", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull().references(() => users.id),
  achievementId: integer("achievementId").notNull().references(() => achievements.id),
  unlockedAt: timestamp("unlockedAt").defaultNow(),
});

// Financial Account Schema
export const financialAccounts = pgTable("financial_accounts", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull().references(() => users.id),
  name: text("name").notNull(),
  type: text("type").notNull(),
  balance: integer("balance").notNull(),
  currency: text("currency").default("USD"),
  isConnected: boolean("isConnected").default(false),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

// Transaction Schema
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  accountId: integer("accountId").notNull().references(() => financialAccounts.id),
  amount: integer("amount").notNull(),
  description: text("description").notNull(),
  category: text("category"),
  date: timestamp("date").defaultNow(),
  isExpense: boolean("isExpense").default(true),
});

// Budget Schema
export const budgets = pgTable("budgets", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull().references(() => users.id),
  category: text("category").notNull(),
  limit: integer("limit").notNull(),
  period: text("period").default("monthly"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

// Quiz Schema
export const quizzes = pgTable("quizzes", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  lessonId: integer("lessonId").references(() => lessons.id),
  passingScore: integer("passingScore").default(70),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

// Quiz Question Schema
export const quizQuestions = pgTable("quiz_questions", {
  id: serial("id").primaryKey(),
  quizId: integer("quizId").notNull().references(() => quizzes.id),
  text: text("text").notNull(),
  type: text("type").notNull(), // 'multiple-choice', 'true-false', 'matching'
  points: integer("points").default(1),
  order: integer("order").notNull(),
  explanation: text("explanation"),
  options: jsonb("options").$type<{
    id: string;
    text: string;
    isCorrect: boolean;
  }[]>(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

// Quiz Attempt Schema
export const quizAttempts = pgTable("quiz_attempts", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull().references(() => users.id),
  quizId: integer("quizId").notNull().references(() => quizzes.id),
  score: integer("score").notNull(),
  passed: boolean("passed").notNull(),
  timeTaken: integer("timeTaken"), // in seconds
  startedAt: timestamp("startedAt").defaultNow(),
  completedAt: timestamp("completedAt"),
});

// Quiz Answer Schema
export const quizAnswers = pgTable("quiz_answers", {
  id: serial("id").primaryKey(),
  attemptId: integer("attemptId").notNull().references(() => quizAttempts.id),
  questionId: integer("questionId").notNull().references(() => quizQuestions.id),
  selectedOptions: jsonb("selectedOptions").$type<string[]>(), // Array of option IDs
  isCorrect: boolean("isCorrect").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
});

// AI Assistant Message Schema
export const assistantMessages = pgTable("assistant_messages", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull().references(() => users.id),
  content: text("content").notNull(),
  sender: text("sender").notNull(), // 'user' or 'assistant'
  timestamp: timestamp("timestamp").defaultNow(),
});

// Forum Categories Schema
export const forumCategories = pgTable("forum_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").default("message-circle"),
  slug: text("slug").notNull().unique(),
  order: integer("order").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

// Forum Topics Schema
export const forumTopics = pgTable("forum_topics", {
  id: serial("id").primaryKey(),
  categoryId: integer("categoryId").notNull().references(() => forumCategories.id),
  userId: integer("userId").notNull().references(() => users.id),
  title: text("title").notNull(),
  content: text("content").notNull(),
  isPinned: boolean("isPinned").default(false),
  isLocked: boolean("isLocked").default(false),
  views: integer("views").default(0),
  slug: text("slug").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
  lastPostAt: timestamp("lastPostAt").defaultNow(),
});

// Forum Posts Schema
export const forumPosts = pgTable("forum_posts", {
  id: serial("id").primaryKey(),
  topicId: integer("topicId").notNull().references(() => forumTopics.id),
  userId: integer("userId").notNull().references(() => users.id),
  content: text("content").notNull(),
  isEdited: boolean("isEdited").default(false),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

// Forum Reactions Schema
export const forumReactions = pgTable("forum_reactions", {
  id: serial("id").primaryKey(),
  postId: integer("postId").notNull().references(() => forumPosts.id),
  userId: integer("userId").notNull().references(() => users.id),
  reactionType: text("reactionType").notNull(), // 'like', 'helpful', 'insightful', etc.
  createdAt: timestamp("createdAt").defaultNow(),
});

// Certificates Schema
export const certificates = pgTable("certificates", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  moduleId: integer("moduleId").references(() => learningModules.id),
  imageUrl: text("imageUrl"),
  issueDate: timestamp("issueDate").defaultNow(),
  expiryDate: timestamp("expiryDate"),
  verificationCode: text("verificationCode").notNull().unique(),
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

export const insertQuizSchema = createInsertSchema(quizzes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertQuizQuestionSchema = createInsertSchema(quizQuestions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertQuizAttemptSchema = createInsertSchema(quizAttempts).omit({
  id: true,
  startedAt: true,
  completedAt: true,
});

export const insertQuizAnswerSchema = createInsertSchema(quizAnswers).omit({
  id: true,
  createdAt: true,
});

export const insertAssistantMessageSchema = createInsertSchema(assistantMessages).omit({
  id: true,
  timestamp: true,
});

export const insertForumCategorySchema = createInsertSchema(forumCategories).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertForumTopicSchema = createInsertSchema(forumTopics).omit({
  id: true,
  views: true,
  createdAt: true,
  updatedAt: true,
  lastPostAt: true,
});

export const insertForumPostSchema = createInsertSchema(forumPosts).omit({
  id: true,
  isEdited: true,
  createdAt: true,
  updatedAt: true,
});

export const insertForumReactionSchema = createInsertSchema(forumReactions).omit({
  id: true,
  createdAt: true,
});

export const insertCertificateSchema = createInsertSchema(certificates).omit({
  id: true,
  issueDate: true,
  expiryDate: true,
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

export type InsertQuiz = z.infer<typeof insertQuizSchema>;
export type Quiz = typeof quizzes.$inferSelect;

export type InsertQuizQuestion = z.infer<typeof insertQuizQuestionSchema>;
export type QuizQuestion = typeof quizQuestions.$inferSelect;

export type InsertQuizAttempt = z.infer<typeof insertQuizAttemptSchema>;
export type QuizAttempt = typeof quizAttempts.$inferSelect;

export type InsertQuizAnswer = z.infer<typeof insertQuizAnswerSchema>;
export type QuizAnswer = typeof quizAnswers.$inferSelect;

export type InsertAssistantMessage = z.infer<typeof insertAssistantMessageSchema>;
export type AssistantMessage = typeof assistantMessages.$inferSelect;

import { 
  users, type User, type InsertUser,
  learningModules, type LearningModule, type InsertLearningModule,
  lessons, type Lesson, type InsertLesson,
  userProgress, type UserProgress, type InsertUserProgress,
  achievements, type Achievement, type InsertAchievement,
  userAchievements, type UserAchievement, type InsertUserAchievement,
  financialAccounts, type FinancialAccount, type InsertFinancialAccount,
  transactions, type Transaction, type InsertTransaction,
  budgets, type Budget, type InsertBudget,
  quizzes, type Quiz, type InsertQuiz,
  quizQuestions, type QuizQuestion, type InsertQuizQuestion,
  quizAttempts, type QuizAttempt, type InsertQuizAttempt,
  quizAnswers, type QuizAnswer, type InsertQuizAnswer,
  assistantMessages, type AssistantMessage, type InsertAssistantMessage,
  forumCategories, type ForumCategory, type InsertForumCategory,
  forumTopics, type ForumTopic, type InsertForumTopic,
  forumPosts, type ForumPost, type InsertForumPost,
  forumReactions, type ForumReaction, type InsertForumReaction,
  certificates, type Certificate, type InsertCertificate
} from "@shared/schema";
import { mockModules } from "./data/modules";
import { mockAchievements } from "./data/achievements";
import { mockUser } from "./data/users";
import { mockLessons } from "./data/lessons";
import { mockForumCategories, mockForumTopics, mockForumPosts } from "./data/forum-seed";
import pg from 'pg';
const { Pool } = pg;
import { drizzle } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  
  // Learning module methods
  getLearningModules(): Promise<LearningModule[]>;
  getLearningModule(id: number): Promise<LearningModule | undefined>;
  createLearningModule(module: InsertLearningModule): Promise<LearningModule>;
  
  // Lesson methods
  getLessons(moduleId: number): Promise<Lesson[]>;
  getLesson(id: number): Promise<Lesson | undefined>;
  createLesson(lesson: InsertLesson): Promise<Lesson>;
  
  // User progress methods
  getUserProgress(userId: number): Promise<UserProgress[]>;
  getUserModuleProgress(userId: number, moduleId: number): Promise<UserProgress | undefined>;
  createUserProgress(progress: InsertUserProgress): Promise<UserProgress>;
  updateUserProgress(id: number, progress: Partial<UserProgress>): Promise<UserProgress | undefined>;
  
  // Achievement methods
  getAchievements(): Promise<Achievement[]>;
  getAchievement(id: number): Promise<Achievement | undefined>;
  createAchievement(achievement: InsertAchievement): Promise<Achievement>;
  
  // User achievement methods
  getUserAchievements(userId: number): Promise<UserAchievement[]>;
  getUserAchievement(userId: number, achievementId: number): Promise<UserAchievement | undefined>;
  createUserAchievement(userAchievement: InsertUserAchievement): Promise<UserAchievement>;
  
  // Financial account methods
  getFinancialAccounts(userId: number): Promise<FinancialAccount[]>;
  getFinancialAccount(id: number): Promise<FinancialAccount | undefined>;
  createFinancialAccount(account: InsertFinancialAccount): Promise<FinancialAccount>;
  updateFinancialAccount(id: number, account: Partial<FinancialAccount>): Promise<FinancialAccount | undefined>;
  
  // Transaction methods
  getTransactions(accountId: number): Promise<Transaction[]>;
  getTransaction(id: number): Promise<Transaction | undefined>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  
  // Budget methods
  getBudgets(userId: number): Promise<Budget[]>;
  getBudget(id: number): Promise<Budget | undefined>;
  createBudget(budget: InsertBudget): Promise<Budget>;
  updateBudget(id: number, budget: Partial<Budget>): Promise<Budget | undefined>;
  
  // Quiz methods
  getQuizzes(): Promise<Quiz[]>;
  getQuizzesByLesson(lessonId: number): Promise<Quiz[]>;
  getQuiz(id: number): Promise<Quiz | undefined>;
  createQuiz(quiz: InsertQuiz): Promise<Quiz>;
  updateQuiz(id: number, quiz: Partial<Quiz>): Promise<Quiz | undefined>;
  
  // Quiz question methods
  getQuizQuestions(quizId: number): Promise<QuizQuestion[]>;
  getQuizQuestion(id: number): Promise<QuizQuestion | undefined>;
  createQuizQuestion(question: InsertQuizQuestion): Promise<QuizQuestion>;
  updateQuizQuestion(id: number, question: Partial<QuizQuestion>): Promise<QuizQuestion | undefined>;
  
  // Quiz attempt methods
  getQuizAttempts(quizId: number, userId: number): Promise<QuizAttempt[]>;
  getQuizAttempt(id: number): Promise<QuizAttempt | undefined>;
  createQuizAttempt(attempt: InsertQuizAttempt): Promise<QuizAttempt>;
  updateQuizAttempt(id: number, attempt: Partial<QuizAttempt>): Promise<QuizAttempt | undefined>;
  
  // Quiz answer methods
  getQuizAnswers(attemptId: number): Promise<QuizAnswer[]>;
  getQuizAnswer(id: number): Promise<QuizAnswer | undefined>;
  createQuizAnswer(answer: InsertQuizAnswer): Promise<QuizAnswer>;
  
  // Assistant message methods
  getAssistantMessages(userId: number): Promise<AssistantMessage[]>;
  createAssistantMessage(message: InsertAssistantMessage): Promise<AssistantMessage>;
  
  // Forum category methods
  getForumCategories(): Promise<ForumCategory[]>;
  getForumCategory(id: number): Promise<ForumCategory | undefined>;
  createForumCategory(category: InsertForumCategory): Promise<ForumCategory>;
  updateForumCategory(id: number, category: Partial<ForumCategory>): Promise<ForumCategory | undefined>;
  
  // Forum topic methods
  getForumTopics(categoryId: number): Promise<ForumTopic[]>;
  getRecentForumTopics(limit?: number): Promise<ForumTopic[]>;
  getForumTopic(id: number): Promise<ForumTopic | undefined>;
  getForumTopicBySlug(slug: string): Promise<ForumTopic | undefined>;
  createForumTopic(topic: InsertForumTopic): Promise<ForumTopic>;
  updateForumTopic(id: number, topic: Partial<ForumTopic>): Promise<ForumTopic | undefined>;
  incrementTopicViews(id: number): Promise<ForumTopic | undefined>;
  
  // Forum post methods
  getForumPosts(topicId: number): Promise<ForumPost[]>;
  getForumPost(id: number): Promise<ForumPost | undefined>;
  createForumPost(post: InsertForumPost): Promise<ForumPost>;
  updateForumPost(id: number, post: Partial<ForumPost>): Promise<ForumPost | undefined>;
  
  // Forum reaction methods
  getForumReactions(postId: number): Promise<ForumReaction[]>;
  getUserForumReaction(postId: number, userId: number): Promise<ForumReaction | undefined>;
  createForumReaction(reaction: InsertForumReaction): Promise<ForumReaction>;
  deleteForumReaction(id: number): Promise<boolean>;
  
  // Certificate methods
  getUserCertificates(userId: number): Promise<Certificate[]>;
  getCertificate(id: number): Promise<Certificate | undefined>;
  getCertificateByVerificationCode(code: string): Promise<Certificate | undefined>;
  createCertificate(certificate: InsertCertificate): Promise<Certificate>;
}

// Add these interfaces for rewards
interface UserPoints {
  userId: string;
  earned: number;
  lastUpdated: Date;
}

interface Reward {
  id: string;
  title: string;
  brand: string;
  value: string;
  pointsRequired: number;
  imageUrl: string;
  category: string;
}

interface RewardTransaction {
  id: string;
  userId: string;
  rewardId: string;
  rewardTitle: string;
  rewardValue: string;
  pointsSpent: number;
  redeemedAt: Date;
  status: 'pending' | 'fulfilled' | 'failed';
  code?: string;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private learningModules: Map<number, LearningModule>;
  private lessons: Map<number, Lesson>;
  private userProgress: Map<number, UserProgress>;
  private achievements: Map<number, Achievement>;
  private userAchievements: Map<number, UserAchievement>;
  private financialAccounts: Map<number, FinancialAccount>;
  private transactions: Map<number, Transaction>;
  private budgets: Map<number, Budget>;
  private quizzes: Map<number, Quiz>;
  private quizQuestions: Map<number, QuizQuestion>;
  private quizAttempts: Map<number, QuizAttempt>;
  private quizAnswers: Map<number, QuizAnswer>;
  private assistantMessages: Map<number, AssistantMessage>;
  private forumCategories: Map<number, ForumCategory>;
  private forumTopics: Map<number, ForumTopic>;
  private forumPosts: Map<number, ForumPost>;
  private forumReactions: Map<number, ForumReaction>;
  private certificates: Map<number, Certificate>;
  
  private userCurrentId: number;
  private learningModuleCurrentId: number;
  private lessonCurrentId: number;
  private userProgressCurrentId: number;
  private achievementCurrentId: number;
  private userAchievementCurrentId: number;
  private financialAccountCurrentId: number;
  private transactionCurrentId: number;
  private budgetCurrentId: number;
  private quizCurrentId: number;
  private quizQuestionCurrentId: number;
  private quizAttemptCurrentId: number;
  private quizAnswerCurrentId: number;
  private assistantMessageCurrentId: number;
  private forumCategoryCurrentId: number;
  private forumTopicCurrentId: number;
  private forumPostCurrentId: number;
  private forumReactionCurrentId: number;
  private certificateCurrentId: number;

  constructor() {
    this.users = new Map();
    this.learningModules = new Map();
    this.lessons = new Map();
    this.userProgress = new Map();
    this.achievements = new Map();
    this.userAchievements = new Map();
    this.financialAccounts = new Map();
    this.transactions = new Map();
    this.budgets = new Map();
    this.quizzes = new Map();
    this.quizQuestions = new Map();
    this.quizAttempts = new Map();
    this.quizAnswers = new Map();
    this.assistantMessages = new Map();
    this.forumCategories = new Map();
    this.forumTopics = new Map();
    this.forumPosts = new Map();
    this.forumReactions = new Map();
    this.certificates = new Map();
    
    this.userCurrentId = 1;
    this.learningModuleCurrentId = 1;
    this.lessonCurrentId = 1;
    this.userProgressCurrentId = 1;
    this.achievementCurrentId = 1;
    this.userAchievementCurrentId = 1;
    this.financialAccountCurrentId = 1;
    this.transactionCurrentId = 1;
    this.budgetCurrentId = 1;
    this.quizCurrentId = 2; // Starting from 2 since we'll add a sample quiz with ID 1
    this.quizQuestionCurrentId = 6; // Starting from 6 since we'll add 5 sample questions
    this.quizAttemptCurrentId = 1;
    this.quizAnswerCurrentId = 1;
    this.assistantMessageCurrentId = 1;
    this.forumCategoryCurrentId = 1;
    this.forumTopicCurrentId = 1;
    this.forumPostCurrentId = 1;
    this.forumReactionCurrentId = 1;
    this.certificateCurrentId = 1;
    
    // Seed initial data
    this.seedData();
  }
  
  private seedData() {
    // Add mock user
    this.users.set(1, { ...mockUser, id: 1 });
    
    // Add mock learning modules
    mockModules.forEach((module, index) => {
      const moduleId = index + 1;
      this.learningModules.set(moduleId, { ...module, id: moduleId });
      
      // Add user progress for these modules
      if (moduleId <= 3) {
        const progress: UserProgress = {
          id: moduleId,
          userId: 1,
          moduleId,
          lessonsCompleted: moduleId === 1 ? 7 : moduleId === 2 ? 3 : 0,
          lastLessonId: moduleId === 1 ? 7 : moduleId === 2 ? 3 : null,
          completed: false,
          percentageComplete: moduleId === 1 ? 65 : moduleId === 2 ? 35 : 0,
          startedAt: new Date(),
          completedAt: null
        };
        this.userProgress.set(moduleId, progress);
      }
    });
    
    // Add mock lessons
    mockLessons.forEach((lesson) => {
      this.lessons.set(lesson.id, { ...lesson });
      
      // Update lessonCurrentId to be higher than the highest lesson ID
      if (lesson.id >= this.lessonCurrentId) {
        this.lessonCurrentId = lesson.id + 1;
      }
    });
    
    // Add mock achievements
    mockAchievements.forEach((achievement, index) => {
      const achievementId = index + 1;
      this.achievements.set(achievementId, { ...achievement, id: achievementId });
      
      // Add unlocked achievements for the user
      if (achievementId <= 3) {
        const userAchievement: UserAchievement = {
          id: achievementId,
          userId: 1,
          achievementId,
          unlockedAt: new Date(Date.now() - (achievementId * 24 * 60 * 60 * 1000))
        };
        this.userAchievements.set(achievementId, userAchievement);
      }
    });
    
    // Add mock welcome message for the assistant
    this.assistantMessages.set(1, {
      id: 1,
      userId: 1,
      content: "Hi there! I'm your financial literacy assistant. What financial topic would you like to learn about today?",
      sender: "assistant",
      timestamp: new Date()
    });
    
    // Add forum categories
    mockForumCategories.forEach(categoryData => {
      const category = {
        id: categoryData.id || this.forumCategoryCurrentId++,
        name: categoryData.name || "",
        description: categoryData.description || "",
        slug: categoryData.slug || "",
        icon: categoryData.icon || null,
        order: categoryData.order || 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      this.forumCategories.set(category.id, category);
      if (category.id >= this.forumCategoryCurrentId) {
        this.forumCategoryCurrentId = category.id + 1;
      }
    });
    
    // Add forum topics and posts
    mockForumTopics.forEach(topicData => {
      const topic = {
        id: topicData.id || this.forumTopicCurrentId++,
        title: topicData.title || "",
        content: topicData.content || "",
        slug: topicData.slug || "",
        userId: topicData.userId || 1,
        categoryId: topicData.categoryId || 1,
        isPinned: topicData.isPinned || false,
        isLocked: topicData.isLocked || false,
        views: topicData.views || 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastPostAt: new Date()
      };
      
      this.forumTopics.set(topic.id, topic);
      if (topic.id >= this.forumTopicCurrentId) {
        this.forumTopicCurrentId = topic.id + 1;
      }
    });
    
    // Add forum posts
    mockForumPosts.forEach(postData => {
      const post = {
        id: postData.id || this.forumPostCurrentId++,
        content: postData.content || "",
        userId: postData.userId || 1,
        topicId: postData.topicId || 1,
        isEdited: postData.isEdited || false,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      this.forumPosts.set(post.id, post);
      if (post.id >= this.forumPostCurrentId) {
        this.forumPostCurrentId = post.id + 1;
      }
    });
    
    // Add a sample quiz for the first lesson
    const quizId = 1;
    this.quizzes.set(quizId, {
      id: quizId,
      title: "Investment Basics Quiz",
      description: "Test your knowledge of basic investment concepts covered in this lesson.",
      lessonId: 1, // Link to the first lesson
      passingScore: 70,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    // Add sample quiz questions
    const questions = [
      {
        id: 1,
        quizId: quizId,
        text: "Which of the following best describes a stock?",
        type: "multiple-choice",
        points: 2,
        order: 1,
        explanation: "A stock represents ownership in a company, making you a partial owner of the business.",
        options: [
          { id: "a", text: "A loan given to a company", isCorrect: false },
          { id: "b", text: "Ownership in a company", isCorrect: true },
          { id: "c", text: "A guarantee of fixed returns", isCorrect: false },
          { id: "d", text: "A type of bank account", isCorrect: false }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        quizId: quizId,
        text: "What is compound interest?",
        type: "multiple-choice",
        points: 2,
        order: 2,
        explanation: "Compound interest is calculated on both the initial principal and the accumulated interest, leading to exponential growth.",
        options: [
          { id: "a", text: "Interest calculated only on the principal amount", isCorrect: false },
          { id: "b", text: "Interest calculated on both principal and accumulated interest", isCorrect: true },
          { id: "c", text: "A fixed interest rate that never changes", isCorrect: false },
          { id: "d", text: "Interest paid directly to your bank account", isCorrect: false }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        quizId: quizId,
        text: "Diversification in investing helps to:",
        type: "multiple-choice",
        points: 2,
        order: 3,
        explanation: "Diversification spreads risk across different assets, reducing the impact of poor performance from any single investment.",
        options: [
          { id: "a", text: "Guarantee higher returns", isCorrect: false },
          { id: "b", text: "Eliminate all investment risk", isCorrect: false },
          { id: "c", text: "Reduce risk by spreading investments across different assets", isCorrect: true },
          { id: "d", text: "Avoid paying taxes on investments", isCorrect: false }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 4,
        quizId: quizId,
        text: "In the UK, an ISA (Individual Savings Account) is beneficial primarily because:",
        type: "multiple-choice",
        points: 2,
        order: 4,
        explanation: "ISAs provide tax advantages as you don't pay tax on the interest, dividends, or capital gains earned within the account.",
        options: [
          { id: "a", text: "It offers the highest interest rates in the market", isCorrect: false },
          { id: "b", text: "It provides tax advantages on your savings and investments", isCorrect: true },
          { id: "c", text: "It is insured by the government for unlimited amounts", isCorrect: false },
          { id: "d", text: "It allows unlimited contributions per tax year", isCorrect: false }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 5,
        quizId: quizId,
        text: "True or False: Higher potential returns usually come with higher risk.",
        type: "true-false",
        points: 1,
        order: 5,
        explanation: "This is a fundamental principle of investing. Investments that offer higher potential returns typically involve taking on more risk.",
        options: [
          { id: "a", text: "True", isCorrect: true },
          { id: "b", text: "False", isCorrect: false }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    questions.forEach(question => {
      this.quizQuestions.set(question.id, question);
      if (question.id >= this.quizQuestionCurrentId) {
        this.quizQuestionCurrentId = question.id + 1;
      }
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { 
      ...insertUser, 
      id,
      userLevel: "Level 1 Investor",
      financialLiteracyScore: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      settings: {
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
      }
    };
    this.users.set(id, user);
    return user;
  }
  
  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  // Learning module methods
  async getLearningModules(): Promise<LearningModule[]> {
    return Array.from(this.learningModules.values());
  }
  
  async getLearningModule(id: number): Promise<LearningModule | undefined> {
    return this.learningModules.get(id);
  }
  
  async createLearningModule(module: InsertLearningModule): Promise<LearningModule> {
    const id = this.learningModuleCurrentId++;
    const newModule: LearningModule = { ...module, id };
    this.learningModules.set(id, newModule);
    return newModule;
  }
  
  // Lesson methods
  async getLessons(moduleId: number): Promise<Lesson[]> {
    return Array.from(this.lessons.values()).filter(
      (lesson) => lesson.moduleId === moduleId
    );
  }
  
  async getLesson(id: number): Promise<Lesson | undefined> {
    return this.lessons.get(id);
  }
  
  async createLesson(lesson: InsertLesson): Promise<Lesson> {
    const id = this.lessonCurrentId++;
    const newLesson: Lesson = { ...lesson, id };
    this.lessons.set(id, newLesson);
    return newLesson;
  }
  
  // User progress methods
  async getUserProgress(userId: number): Promise<UserProgress[]> {
    return Array.from(this.userProgress.values()).filter(
      (progress) => progress.userId === userId
    );
  }
  
  async getUserModuleProgress(userId: number, moduleId: number): Promise<UserProgress | undefined> {
    return Array.from(this.userProgress.values()).find(
      (progress) => progress.userId === userId && progress.moduleId === moduleId
    );
  }
  
  async createUserProgress(progress: InsertUserProgress): Promise<UserProgress> {
    const id = this.userProgressCurrentId++;
    const newProgress: UserProgress = { 
      ...progress,
      id,
      startedAt: new Date(),
      completedAt: null
    };
    this.userProgress.set(id, newProgress);
    return newProgress;
  }
  
  async updateUserProgress(id: number, progressData: Partial<UserProgress>): Promise<UserProgress | undefined> {
    const progress = this.userProgress.get(id);
    if (!progress) return undefined;
    
    const updatedProgress = { ...progress, ...progressData };
    
    // If it's being marked as completed, set the completedAt date
    if (progressData.completed && !progress.completed) {
      updatedProgress.completedAt = new Date();
    }
    
    this.userProgress.set(id, updatedProgress);
    return updatedProgress;
  }
  
  // Achievement methods
  async getAchievements(): Promise<Achievement[]> {
    return Array.from(this.achievements.values());
  }
  
  async getAchievement(id: number): Promise<Achievement | undefined> {
    return this.achievements.get(id);
  }
  
  async createAchievement(achievement: InsertAchievement): Promise<Achievement> {
    const id = this.achievementCurrentId++;
    const newAchievement: Achievement = { ...achievement, id };
    this.achievements.set(id, newAchievement);
    return newAchievement;
  }
  
  // User achievement methods
  async getUserAchievements(userId: number): Promise<UserAchievement[]> {
    return Array.from(this.userAchievements.values()).filter(
      (userAchievement) => userAchievement.userId === userId
    );
  }
  
  async getUserAchievement(userId: number, achievementId: number): Promise<UserAchievement | undefined> {
    return Array.from(this.userAchievements.values()).find(
      (userAchievement) => userAchievement.userId === userId && userAchievement.achievementId === achievementId
    );
  }
  
  async createUserAchievement(userAchievement: InsertUserAchievement): Promise<UserAchievement> {
    const id = this.userAchievementCurrentId++;
    const newUserAchievement: UserAchievement = { 
      ...userAchievement,
      id,
      unlockedAt: new Date()
    };
    this.userAchievements.set(id, newUserAchievement);
    return newUserAchievement;
  }
  
  // Financial account methods
  async getFinancialAccounts(userId: number): Promise<FinancialAccount[]> {
    return Array.from(this.financialAccounts.values()).filter(
      (account) => account.userId === userId
    );
  }
  
  async getFinancialAccount(id: number): Promise<FinancialAccount | undefined> {
    return this.financialAccounts.get(id);
  }
  
  async createFinancialAccount(account: InsertFinancialAccount): Promise<FinancialAccount> {
    const id = this.financialAccountCurrentId++;
    const newAccount: FinancialAccount = { 
      ...account,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.financialAccounts.set(id, newAccount);
    return newAccount;
  }
  
  async updateFinancialAccount(id: number, accountData: Partial<FinancialAccount>): Promise<FinancialAccount | undefined> {
    const account = this.financialAccounts.get(id);
    if (!account) return undefined;
    
    const updatedAccount = { 
      ...account,
      ...accountData,
      updatedAt: new Date()
    };
    this.financialAccounts.set(id, updatedAccount);
    return updatedAccount;
  }
  
  // Transaction methods
  async getTransactions(accountId: number): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).filter(
      (transaction) => transaction.accountId === accountId
    );
  }
  
  async getTransaction(id: number): Promise<Transaction | undefined> {
    return this.transactions.get(id);
  }
  
  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const id = this.transactionCurrentId++;
    const newTransaction: Transaction = { ...transaction, id };
    this.transactions.set(id, newTransaction);
    return newTransaction;
  }
  
  // Budget methods
  async getBudgets(userId: number): Promise<Budget[]> {
    return Array.from(this.budgets.values()).filter(
      (budget) => budget.userId === userId
    );
  }
  
  async getBudget(id: number): Promise<Budget | undefined> {
    return this.budgets.get(id);
  }
  
  async createBudget(budget: InsertBudget): Promise<Budget> {
    const id = this.budgetCurrentId++;
    const newBudget: Budget = { 
      ...budget,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.budgets.set(id, newBudget);
    return newBudget;
  }
  
  async updateBudget(id: number, budgetData: Partial<Budget>): Promise<Budget | undefined> {
    const budget = this.budgets.get(id);
    if (!budget) return undefined;
    
    const updatedBudget = { 
      ...budget,
      ...budgetData,
      updatedAt: new Date()
    };
    this.budgets.set(id, updatedBudget);
    return updatedBudget;
  }
  
  // Quiz methods
  async getQuizzes(): Promise<Quiz[]> {
    return Array.from(this.quizzes.values());
  }
  
  async getQuizzesByLesson(lessonId: number): Promise<Quiz[]> {
    return Array.from(this.quizzes.values()).filter(
      (quiz) => quiz.lessonId === lessonId
    );
  }
  
  async getQuiz(id: number): Promise<Quiz | undefined> {
    return this.quizzes.get(id);
  }
  
  async createQuiz(quiz: InsertQuiz): Promise<Quiz> {
    const id = this.quizCurrentId++;
    const newQuiz: Quiz = { 
      ...quiz, 
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.quizzes.set(id, newQuiz);
    return newQuiz;
  }
  
  async updateQuiz(id: number, quizData: Partial<Quiz>): Promise<Quiz | undefined> {
    const quiz = this.quizzes.get(id);
    if (!quiz) return undefined;
    
    const updatedQuiz = { 
      ...quiz,
      ...quizData,
      updatedAt: new Date()
    };
    this.quizzes.set(id, updatedQuiz);
    return updatedQuiz;
  }
  
  // Quiz question methods
  async getQuizQuestions(quizId: number): Promise<QuizQuestion[]> {
    return Array.from(this.quizQuestions.values())
      .filter((question) => question.quizId === quizId)
      .sort((a, b) => a.order - b.order);
  }
  
  async getQuizQuestion(id: number): Promise<QuizQuestion | undefined> {
    return this.quizQuestions.get(id);
  }
  
  async createQuizQuestion(question: InsertQuizQuestion): Promise<QuizQuestion> {
    const id = this.quizQuestionCurrentId++;
    const newQuestion: QuizQuestion = { 
      ...question, 
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.quizQuestions.set(id, newQuestion);
    return newQuestion;
  }
  
  async updateQuizQuestion(id: number, questionData: Partial<QuizQuestion>): Promise<QuizQuestion | undefined> {
    const question = this.quizQuestions.get(id);
    if (!question) return undefined;
    
    const updatedQuestion = { 
      ...question,
      ...questionData,
      updatedAt: new Date()
    };
    this.quizQuestions.set(id, updatedQuestion);
    return updatedQuestion;
  }
  
  // Quiz attempt methods
  async getQuizAttempts(quizId: number, userId: number): Promise<QuizAttempt[]> {
    return Array.from(this.quizAttempts.values())
      .filter((attempt) => attempt.quizId === quizId && attempt.userId === userId)
      .sort((a, b) => {
        if (!a.startedAt || !b.startedAt) return 0;
        return b.startedAt.getTime() - a.startedAt.getTime();
      });
  }
  
  async getQuizAttempt(id: number): Promise<QuizAttempt | undefined> {
    return this.quizAttempts.get(id);
  }
  
  async createQuizAttempt(attempt: InsertQuizAttempt): Promise<QuizAttempt> {
    const id = this.quizAttemptCurrentId++;
    const newAttempt: QuizAttempt = { 
      ...attempt, 
      id,
      startedAt: new Date(),
      completedAt: null
    };
    this.quizAttempts.set(id, newAttempt);
    return newAttempt;
  }
  
  async updateQuizAttempt(id: number, attemptData: Partial<QuizAttempt>): Promise<QuizAttempt | undefined> {
    const attempt = this.quizAttempts.get(id);
    if (!attempt) return undefined;
    
    const updatedAttempt = { 
      ...attempt,
      ...attemptData
    };
    
    // If it's being marked as complete, set the completedAt date
    if (attemptData.score !== undefined && !attempt.completedAt) {
      updatedAttempt.completedAt = new Date();
    }
    
    this.quizAttempts.set(id, updatedAttempt);
    return updatedAttempt;
  }
  
  // Quiz answer methods
  async getQuizAnswers(attemptId: number): Promise<QuizAnswer[]> {
    return Array.from(this.quizAnswers.values())
      .filter((answer) => answer.attemptId === attemptId);
  }
  
  async getQuizAnswer(id: number): Promise<QuizAnswer | undefined> {
    return this.quizAnswers.get(id);
  }
  
  async createQuizAnswer(answer: InsertQuizAnswer): Promise<QuizAnswer> {
    const id = this.quizAnswerCurrentId++;
    const newAnswer: QuizAnswer = { 
      ...answer, 
      id,
      createdAt: new Date()
    };
    this.quizAnswers.set(id, newAnswer);
    return newAnswer;
  }
  
  // Assistant message methods
  async getAssistantMessages(userId: number): Promise<AssistantMessage[]> {
    return Array.from(this.assistantMessages.values()).filter(
      (message) => message.userId === userId
    );
  }
  
  async createAssistantMessage(message: InsertAssistantMessage): Promise<AssistantMessage> {
    const id = this.assistantMessageCurrentId++;
    const newMessage: AssistantMessage = { 
      ...message,
      id,
      timestamp: new Date()
    };
    this.assistantMessages.set(id, newMessage);
    return newMessage;
  }
  
  // Forum category methods
  async getForumCategories(): Promise<ForumCategory[]> {
    return Array.from(this.forumCategories.values());
  }
  
  async getForumCategory(id: number): Promise<ForumCategory | undefined> {
    return this.forumCategories.get(id);
  }
  
  async createForumCategory(category: InsertForumCategory): Promise<ForumCategory> {
    const id = this.forumCategoryCurrentId++;
    const newCategory: ForumCategory = { 
      ...category,
      id,
      topicCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.forumCategories.set(id, newCategory);
    return newCategory;
  }
  
  async updateForumCategory(id: number, categoryData: Partial<ForumCategory>): Promise<ForumCategory | undefined> {
    const category = this.forumCategories.get(id);
    if (!category) return undefined;
    
    const updatedCategory = { 
      ...category,
      ...categoryData,
      updatedAt: new Date()
    };
    this.forumCategories.set(id, updatedCategory);
    return updatedCategory;
  }
  
  // Forum topic methods
  async getForumTopics(categoryId: number): Promise<ForumTopic[]> {
    return Array.from(this.forumTopics.values()).filter(
      (topic) => topic.categoryId === categoryId
    );
  }
  
  async getRecentForumTopics(limit?: number): Promise<ForumTopic[]> {
    const topics = Array.from(this.forumTopics.values())
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
    
    return limit ? topics.slice(0, limit) : topics;
  }
  
  async getForumTopic(id: number): Promise<ForumTopic | undefined> {
    return this.forumTopics.get(id);
  }
  
  async getForumTopicBySlug(slug: string): Promise<ForumTopic | undefined> {
    return Array.from(this.forumTopics.values()).find(
      (topic) => topic.slug === slug
    );
  }
  
  async createForumTopic(topic: InsertForumTopic): Promise<ForumTopic> {
    const id = this.forumTopicCurrentId++;
    const newTopic: ForumTopic = { 
      ...topic,
      id,
      views: 0,
      postCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.forumTopics.set(id, newTopic);
    
    // Increment topic count on the category
    const category = this.forumCategories.get(topic.categoryId);
    if (category) {
      category.topicCount += 1;
      this.forumCategories.set(category.id, category);
    }
    
    return newTopic;
  }
  
  async updateForumTopic(id: number, topicData: Partial<ForumTopic>): Promise<ForumTopic | undefined> {
    const topic = this.forumTopics.get(id);
    if (!topic) return undefined;
    
    const updatedTopic = { 
      ...topic,
      ...topicData,
      updatedAt: new Date()
    };
    this.forumTopics.set(id, updatedTopic);
    return updatedTopic;
  }
  
  async incrementTopicViews(id: number): Promise<ForumTopic | undefined> {
    const topic = this.forumTopics.get(id);
    if (!topic) return undefined;
    
    const updatedTopic = { 
      ...topic,
      views: topic.views + 1
    };
    this.forumTopics.set(id, updatedTopic);
    return updatedTopic;
  }
  
  // Forum post methods
  async getForumPosts(topicId: number): Promise<ForumPost[]> {
    return Array.from(this.forumPosts.values())
      .filter(post => post.topicId === topicId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }
  
  async getForumPost(id: number): Promise<ForumPost | undefined> {
    return this.forumPosts.get(id);
  }
  
  async createForumPost(post: InsertForumPost): Promise<ForumPost> {
    const id = this.forumPostCurrentId++;
    const newPost: ForumPost = { 
      ...post,
      id,
      reactionCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.forumPosts.set(id, newPost);
    
    // Increment post count on the topic
    const topic = this.forumTopics.get(post.topicId);
    if (topic) {
      topic.postCount += 1;
      topic.updatedAt = new Date(); // Update the last activity time
      this.forumTopics.set(topic.id, topic);
    }
    
    return newPost;
  }
  
  async updateForumPost(id: number, postData: Partial<ForumPost>): Promise<ForumPost | undefined> {
    const post = this.forumPosts.get(id);
    if (!post) return undefined;
    
    const updatedPost = { 
      ...post,
      ...postData,
      updatedAt: new Date()
    };
    this.forumPosts.set(id, updatedPost);
    return updatedPost;
  }
  
  // Forum reaction methods
  async getForumReactions(postId: number): Promise<ForumReaction[]> {
    return Array.from(this.forumReactions.values())
      .filter(reaction => reaction.postId === postId);
  }
  
  async getUserForumReaction(postId: number, userId: number): Promise<ForumReaction | undefined> {
    return Array.from(this.forumReactions.values())
      .find(reaction => reaction.postId === postId && reaction.userId === userId);
  }
  
  async createForumReaction(reaction: InsertForumReaction): Promise<ForumReaction> {
    // Check if the user already reacted to this post
    const existingReaction = await this.getUserForumReaction(reaction.postId, reaction.userId);
    if (existingReaction) {
      return existingReaction;
    }
    
    const id = this.forumReactionCurrentId++;
    const newReaction: ForumReaction = { 
      ...reaction,
      id,
      createdAt: new Date()
    };
    this.forumReactions.set(id, newReaction);
    
    // Increment reaction count on the post
    const post = this.forumPosts.get(reaction.postId);
    if (post) {
      post.reactionCount += 1;
      this.forumPosts.set(post.id, post);
    }
    
    return newReaction;
  }
  
  async deleteForumReaction(id: number): Promise<boolean> {
    const reaction = this.forumReactions.get(id);
    if (!reaction) return false;
    
    this.forumReactions.delete(id);
    
    // Decrement reaction count on the post
    const post = this.forumPosts.get(reaction.postId);
    if (post) {
      post.reactionCount = Math.max(0, post.reactionCount - 1);
      this.forumPosts.set(post.id, post);
    }
    
    return true;
  }
  
  // Certificate methods
  async getUserCertificates(userId: number): Promise<Certificate[]> {
    return Array.from(this.certificates.values())
      .filter(certificate => certificate.userId === userId)
      .sort((a, b) => b.issuedAt.getTime() - a.issuedAt.getTime());
  }
  
  async getCertificate(id: number): Promise<Certificate | undefined> {
    return this.certificates.get(id);
  }
  
  async getCertificateByVerificationCode(code: string): Promise<Certificate | undefined> {
    return Array.from(this.certificates.values())
      .find(certificate => certificate.verificationCode === code);
  }
  
  async createCertificate(certificate: InsertCertificate): Promise<Certificate> {
    const id = this.certificateCurrentId++;
    
    // Generate a unique verification code
    const verificationCode = Math.random().toString(36).substring(2, 10).toUpperCase();
    
    const newCertificate: Certificate = { 
      ...certificate,
      id,
      verificationCode,
      issuedAt: new Date()
    };
    this.certificates.set(id, newCertificate);
    return newCertificate;
  }

  // Mock data for rewards
  private rewards: Reward[] = [
    {
      id: 'r1',
      title: 'Coffee Shop Gift Card',
      brand: 'Starbucks',
      value: '$5',
      pointsRequired: 500,
      imageUrl: 'https://logo.clearbit.com/starbucks.com',
      category: 'dining'
    },
    {
      id: 'r2',
      title: 'Online Shopping Gift Card',
      brand: 'Amazon',
      value: '$10',
      pointsRequired: 1000,
      imageUrl: 'https://logo.clearbit.com/amazon.com',
      category: 'shopping'
    },
    {
      id: 'r3',
      title: 'Music Streaming Gift Card',
      brand: 'Spotify',
      value: '$10',
      pointsRequired: 1000,
      imageUrl: 'https://logo.clearbit.com/spotify.com',
      category: 'entertainment'
    },
    {
      id: 'r4',
      title: 'Movie Ticket Gift Card',
      brand: 'AMC Theatres',
      value: '$15',
      pointsRequired: 1500,
      imageUrl: 'https://logo.clearbit.com/amctheatres.com',
      category: 'entertainment'
    },
    {
      id: 'r5',
      title: 'Fast Food Gift Card',
      brand: 'McDonald\'s',
      value: '$5',
      pointsRequired: 500,
      imageUrl: 'https://logo.clearbit.com/mcdonalds.com',
      category: 'dining'
    },
    {
      id: 'r6',
      title: 'Electronics Store Gift Card',
      brand: 'Best Buy',
      value: '$25',
      pointsRequired: 2500,
      imageUrl: 'https://logo.clearbit.com/bestbuy.com',
      category: 'shopping'
    }
  ];

  private userPoints: UserPoints[] = [];
  private rewardTransactions: RewardTransaction[] = [];

  async getUserPoints(userId: string): Promise<UserPoints> {
    let userPoints = this.userPoints.find(points => points.userId === userId);
    
    if (!userPoints) {
      // Calculate points from user's progress
      const userProgress = await this.getUserProgress(userId);
      const completedModules = userProgress.filter(progress => progress.completed);
      const lessonsCompleted = userProgress.reduce((total, progress) => total + progress.lessonsCompleted, 0);
      
      // Assign points: 50 per completed module + 10 per completed lesson
      const earnedPoints = (completedModules.length * 50) + (lessonsCompleted * 10);
      
      userPoints = {
        userId,
        earned: earnedPoints,
        lastUpdated: new Date()
      };
      
      this.userPoints.push(userPoints);
    }
    
    return userPoints;
  }

  async getAvailableRewards(): Promise<Reward[]> {
    return [...this.rewards];
  }

  async getRewardById(rewardId: string): Promise<Reward | undefined> {
    return this.rewards.find(reward => reward.id === rewardId);
  }

  async getUserRewardTransactions(userId: string): Promise<RewardTransaction[]> {
    return this.rewardTransactions.filter(transaction => transaction.userId === userId);
  }

  async createRewardTransaction(userId: string, reward: Reward): Promise<RewardTransaction> {
    // Generate a random code for the gift card
    const code = Math.random().toString(36).substring(2, 10).toUpperCase();
    
    const transaction: RewardTransaction = {
      id: `tx_${Date.now()}`,
      userId,
      rewardId: reward.id,
      rewardTitle: reward.title,
      rewardValue: reward.value,
      pointsSpent: reward.pointsRequired,
      redeemedAt: new Date(),
      status: 'fulfilled',
      code
    };
    
    this.rewardTransactions.push(transaction);
    
    return transaction;
  }
}

export class PostgresStorage implements IStorage {
  private db: ReturnType<typeof drizzle>;
  
  constructor() {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
    this.db = drizzle(pool);
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await this.db.insert(users).values({
      ...user,
      firstName: user.firstName || null,
      lastName: user.lastName || null,
      email: user.email || null,
      userLevel: "Level 1 Investor",
      financialLiteracyScore: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      settings: {
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
      }
    }).returning();
    return result[0];
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const result = await this.db.update(users)
      .set({ ...userData, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return result[0];
  }

  // The rest of the storage methods will use the in-memory implementation for now
  // We'll focus just on the user authentication part

  // Learning module methods
  async getLearningModules(): Promise<LearningModule[]> {
    const memStorage = new MemStorage();
    return memStorage.getLearningModules();
  }
  
  async getLearningModule(id: number): Promise<LearningModule | undefined> {
    const memStorage = new MemStorage();
    return memStorage.getLearningModule(id);
  }
  
  async createLearningModule(module: InsertLearningModule): Promise<LearningModule> {
    const memStorage = new MemStorage();
    return memStorage.createLearningModule(module);
  }
  
  // Lesson methods
  async getLessons(moduleId: number): Promise<Lesson[]> {
    const memStorage = new MemStorage();
    return memStorage.getLessons(moduleId);
  }
  
  async getLesson(id: number): Promise<Lesson | undefined> {
    const memStorage = new MemStorage();
    return memStorage.getLesson(id);
  }
  
  async createLesson(lesson: InsertLesson): Promise<Lesson> {
    const memStorage = new MemStorage();
    return memStorage.createLesson(lesson);
  }
  
  // User progress methods
  async getUserProgress(userId: number): Promise<UserProgress[]> {
    const memStorage = new MemStorage();
    return memStorage.getUserProgress(userId);
  }
  
  async getUserModuleProgress(userId: number, moduleId: number): Promise<UserProgress | undefined> {
    const memStorage = new MemStorage();
    return memStorage.getUserModuleProgress(userId, moduleId);
  }
  
  async createUserProgress(progress: InsertUserProgress): Promise<UserProgress> {
    const memStorage = new MemStorage();
    return memStorage.createUserProgress(progress);
  }
  
  async updateUserProgress(id: number, progress: Partial<UserProgress>): Promise<UserProgress | undefined> {
    const memStorage = new MemStorage();
    return memStorage.updateUserProgress(id, progress);
  }
  
  // Achievement methods
  async getAchievements(): Promise<Achievement[]> {
    const memStorage = new MemStorage();
    return memStorage.getAchievements();
  }
  
  async getAchievement(id: number): Promise<Achievement | undefined> {
    const memStorage = new MemStorage();
    return memStorage.getAchievement(id);
  }
  
  async createAchievement(achievement: InsertAchievement): Promise<Achievement> {
    const memStorage = new MemStorage();
    return memStorage.createAchievement(achievement);
  }
  
  // User achievement methods
  async getUserAchievements(userId: number): Promise<UserAchievement[]> {
    const memStorage = new MemStorage();
    return memStorage.getUserAchievements(userId);
  }
  
  async getUserAchievement(userId: number, achievementId: number): Promise<UserAchievement | undefined> {
    const memStorage = new MemStorage();
    return memStorage.getUserAchievement(userId, achievementId);
  }
  
  async createUserAchievement(userAchievement: InsertUserAchievement): Promise<UserAchievement> {
    const memStorage = new MemStorage();
    return memStorage.createUserAchievement(userAchievement);
  }
  
  // Financial account methods
  async getFinancialAccounts(userId: number): Promise<FinancialAccount[]> {
    const memStorage = new MemStorage();
    return memStorage.getFinancialAccounts(userId);
  }
  
  async getFinancialAccount(id: number): Promise<FinancialAccount | undefined> {
    const memStorage = new MemStorage();
    return memStorage.getFinancialAccount(id);
  }
  
  async createFinancialAccount(account: InsertFinancialAccount): Promise<FinancialAccount> {
    const memStorage = new MemStorage();
    return memStorage.createFinancialAccount(account);
  }
  
  async updateFinancialAccount(id: number, account: Partial<FinancialAccount>): Promise<FinancialAccount | undefined> {
    const memStorage = new MemStorage();
    return memStorage.updateFinancialAccount(id, account);
  }
  
  // Transaction methods
  async getTransactions(accountId: number): Promise<Transaction[]> {
    const memStorage = new MemStorage();
    return memStorage.getTransactions(accountId);
  }
  
  async getTransaction(id: number): Promise<Transaction | undefined> {
    const memStorage = new MemStorage();
    return memStorage.getTransaction(id);
  }
  
  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const memStorage = new MemStorage();
    return memStorage.createTransaction(transaction);
  }
  
  // Budget methods
  async getBudgets(userId: number): Promise<Budget[]> {
    const memStorage = new MemStorage();
    return memStorage.getBudgets(userId);
  }
  
  async getBudget(id: number): Promise<Budget | undefined> {
    const memStorage = new MemStorage();
    return memStorage.getBudget(id);
  }
  
  async createBudget(budget: InsertBudget): Promise<Budget> {
    const memStorage = new MemStorage();
    return memStorage.createBudget(budget);
  }
  
  async updateBudget(id: number, budget: Partial<Budget>): Promise<Budget | undefined> {
    const memStorage = new MemStorage();
    return memStorage.updateBudget(id, budget);
  }
  
  // Quiz methods
  async getQuizzes(): Promise<Quiz[]> {
    const memStorage = new MemStorage();
    return memStorage.getQuizzes();
  }
  
  async getQuizzesByLesson(lessonId: number): Promise<Quiz[]> {
    const memStorage = new MemStorage();
    return memStorage.getQuizzesByLesson(lessonId);
  }
  
  async getQuiz(id: number): Promise<Quiz | undefined> {
    const memStorage = new MemStorage();
    return memStorage.getQuiz(id);
  }
  
  async createQuiz(quiz: InsertQuiz): Promise<Quiz> {
    const memStorage = new MemStorage();
    return memStorage.createQuiz(quiz);
  }
  
  async updateQuiz(id: number, quiz: Partial<Quiz>): Promise<Quiz | undefined> {
    const memStorage = new MemStorage();
    return memStorage.updateQuiz(id, quiz);
  }
  
  // Quiz question methods
  async getQuizQuestions(quizId: number): Promise<QuizQuestion[]> {
    const memStorage = new MemStorage();
    return memStorage.getQuizQuestions(quizId);
  }
  
  async getQuizQuestion(id: number): Promise<QuizQuestion | undefined> {
    const memStorage = new MemStorage();
    return memStorage.getQuizQuestion(id);
  }
  
  async createQuizQuestion(question: InsertQuizQuestion): Promise<QuizQuestion> {
    const memStorage = new MemStorage();
    return memStorage.createQuizQuestion(question);
  }
  
  async updateQuizQuestion(id: number, question: Partial<QuizQuestion>): Promise<QuizQuestion | undefined> {
    const memStorage = new MemStorage();
    return memStorage.updateQuizQuestion(id, question);
  }
  
  // Forum category methods
  async getForumCategories(): Promise<ForumCategory[]> {
    const memStorage = new MemStorage();
    return memStorage.getForumCategories();
  }
  
  async getForumCategory(id: number): Promise<ForumCategory | undefined> {
    const memStorage = new MemStorage();
    return memStorage.getForumCategory(id);
  }
  
  async createForumCategory(category: InsertForumCategory): Promise<ForumCategory> {
    const memStorage = new MemStorage();
    return memStorage.createForumCategory(category);
  }
  
  async updateForumCategory(id: number, category: Partial<ForumCategory>): Promise<ForumCategory | undefined> {
    const memStorage = new MemStorage();
    return memStorage.updateForumCategory(id, category);
  }
  
  // Forum topic methods
  async getForumTopics(categoryId: number): Promise<ForumTopic[]> {
    const memStorage = new MemStorage();
    return memStorage.getForumTopics(categoryId);
  }
  
  async getRecentForumTopics(limit?: number): Promise<ForumTopic[]> {
    const memStorage = new MemStorage();
    return memStorage.getRecentForumTopics(limit);
  }
  
  async getForumTopic(id: number): Promise<ForumTopic | undefined> {
    const memStorage = new MemStorage();
    return memStorage.getForumTopic(id);
  }
  
  async getForumTopicBySlug(slug: string): Promise<ForumTopic | undefined> {
    const memStorage = new MemStorage();
    return memStorage.getForumTopicBySlug(slug);
  }
  
  async createForumTopic(topic: InsertForumTopic): Promise<ForumTopic> {
    const memStorage = new MemStorage();
    return memStorage.createForumTopic(topic);
  }
  
  async updateForumTopic(id: number, topic: Partial<ForumTopic>): Promise<ForumTopic | undefined> {
    const memStorage = new MemStorage();
    return memStorage.updateForumTopic(id, topic);
  }
  
  async incrementTopicViews(id: number): Promise<ForumTopic | undefined> {
    const memStorage = new MemStorage();
    return memStorage.incrementTopicViews(id);
  }
  
  // Quiz attempt methods
  async getQuizAttempts(quizId: number, userId: number): Promise<QuizAttempt[]> {
    const memStorage = new MemStorage();
    return memStorage.getQuizAttempts(quizId, userId);
  }
  
  async getQuizAttempt(id: number): Promise<QuizAttempt | undefined> {
    const memStorage = new MemStorage();
    return memStorage.getQuizAttempt(id);
  }
  
  async createQuizAttempt(attempt: InsertQuizAttempt): Promise<QuizAttempt> {
    const memStorage = new MemStorage();
    return memStorage.createQuizAttempt(attempt);
  }
  
  async updateQuizAttempt(id: number, attempt: Partial<QuizAttempt>): Promise<QuizAttempt | undefined> {
    const memStorage = new MemStorage();
    return memStorage.updateQuizAttempt(id, attempt);
  }
  
  // Quiz answer methods
  async getQuizAnswers(attemptId: number): Promise<QuizAnswer[]> {
    const memStorage = new MemStorage();
    return memStorage.getQuizAnswers(attemptId);
  }
  
  async getQuizAnswer(id: number): Promise<QuizAnswer | undefined> {
    const memStorage = new MemStorage();
    return memStorage.getQuizAnswer(id);
  }
  
  async createQuizAnswer(answer: InsertQuizAnswer): Promise<QuizAnswer> {
    const memStorage = new MemStorage();
    return memStorage.createQuizAnswer(answer);
  }
  
  // Assistant message methods
  async getAssistantMessages(userId: number): Promise<AssistantMessage[]> {
    const memStorage = new MemStorage();
    return memStorage.getAssistantMessages(userId);
  }
  
  async createAssistantMessage(message: InsertAssistantMessage): Promise<AssistantMessage> {
    const memStorage = new MemStorage();
    return memStorage.createAssistantMessage(message);
  }
  
  // Forum post methods
  async getForumPosts(topicId: number): Promise<ForumPost[]> {
    const memStorage = new MemStorage();
    return memStorage.getForumPosts(topicId);
  }
  
  async getForumPost(id: number): Promise<ForumPost | undefined> {
    const memStorage = new MemStorage();
    return memStorage.getForumPost(id);
  }
  
  async createForumPost(post: InsertForumPost): Promise<ForumPost> {
    const memStorage = new MemStorage();
    return memStorage.createForumPost(post);
  }
  
  async updateForumPost(id: number, post: Partial<ForumPost>): Promise<ForumPost | undefined> {
    const memStorage = new MemStorage();
    return memStorage.updateForumPost(id, post);
  }
  
  // Forum reaction methods
  async getForumReactions(postId: number): Promise<ForumReaction[]> {
    const memStorage = new MemStorage();
    return memStorage.getForumReactions(postId);
  }
  
  async getUserForumReaction(postId: number, userId: number): Promise<ForumReaction | undefined> {
    const memStorage = new MemStorage();
    return memStorage.getUserForumReaction(postId, userId);
  }
  
  async createForumReaction(reaction: InsertForumReaction): Promise<ForumReaction> {
    const memStorage = new MemStorage();
    return memStorage.createForumReaction(reaction);
  }
  
  async deleteForumReaction(id: number): Promise<boolean> {
    const memStorage = new MemStorage();
    return memStorage.deleteForumReaction(id);
  }
  
  // Certificate methods
  async getUserCertificates(userId: number): Promise<Certificate[]> {
    const memStorage = new MemStorage();
    return memStorage.getUserCertificates(userId);
  }
  
  async getCertificate(id: number): Promise<Certificate | undefined> {
    const memStorage = new MemStorage();
    return memStorage.getCertificate(id);
  }
  
  async getCertificateByVerificationCode(code: string): Promise<Certificate | undefined> {
    const memStorage = new MemStorage();
    return memStorage.getCertificateByVerificationCode(code);
  }
  
  async createCertificate(certificate: InsertCertificate): Promise<Certificate> {
    const memStorage = new MemStorage();
    return memStorage.createCertificate(certificate);
  }
}

// Use PostgreSQL storage when DATABASE_URL is available, otherwise fallback to MemStorage
export const storage = process.env.DATABASE_URL 
  ? new PostgresStorage() 
  : new MemStorage();

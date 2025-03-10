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
  assistantMessages, type AssistantMessage, type InsertAssistantMessage
} from "@shared/schema";
import { mockModules } from "./data/modules";
import { mockAchievements } from "./data/achievements";
import { mockUser } from "./data/users";
import { mockLessons } from "./data/lessons";

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
    
    this.userCurrentId = 1;
    this.learningModuleCurrentId = 1;
    this.lessonCurrentId = 1;
    this.userProgressCurrentId = 1;
    this.achievementCurrentId = 1;
    this.userAchievementCurrentId = 1;
    this.financialAccountCurrentId = 1;
    this.transactionCurrentId = 1;
    this.budgetCurrentId = 1;
    this.quizCurrentId = 1;
    this.quizQuestionCurrentId = 1;
    this.quizAttemptCurrentId = 1;
    this.quizAnswerCurrentId = 1;
    this.assistantMessageCurrentId = 1;
    
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
    const user: User = { ...insertUser, id };
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
}

export const storage = new MemStorage();

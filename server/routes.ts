import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateFinancialInsight } from "./services/mistral";
import { formatCurrency } from "@/lib/utils";
import { mockFinancialInsights } from "./data/insights";
import { User } from "../shared/schema";

import {
  startGame,
  initializeFinancialTwin,
  processFinancialDecision,
  concludeGameSession,
  FinancialGameData
} from './services/financial-game';

export async function registerRoutes(app: Express, isAuthenticated?: (req: Request, res: Response, next: NextFunction) => void): Promise<Server> {
  // Get current user profile
  app.get("/api/user/profile", isAuthenticated!, async (req: Request, res: Response) => {
    try {
      const user = req.user as User;
      
      // Return only needed fields for frontend
      res.json({
        id: user.id,
        username: user.username,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        userLevel: user.userLevel
      });
    } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get user stats for dashboard
  app.get("/api/user/stats", isAuthenticated!, async (req: Request, res: Response) => {
    try {
      const user = req.user as User;
      const userId = user.id;
      
      const allModules = await storage.getLearningModules();
      const userProgress = await storage.getUserProgress(userId);
      const achievements = await storage.getUserAchievements(userId);
      
      const modulesCompleted = userProgress.filter(progress => progress.completed).length;
      const totalModules = allModules.length;
      
      res.json({
        financialLiteracyScore: user.financialLiteracyScore,
        modulesCompleted,
        totalModules,
        badgesEarned: achievements.length,
        lastAssessment: "5 days ago",
        scoreImprovement: 12
      });
    } catch (error) {
      console.error("Error fetching user stats:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get learning modules for dashboard
  app.get("/api/learning/modules", isAuthenticated!, async (req: Request, res: Response) => {
    try {
      const user = req.user as User;
      const userId = user.id;
      const allModules = await storage.getLearningModules();
      
      // Get first 3 modules for dashboard
      const dashboardModules = allModules.slice(0, 3);
      
      const modules = await Promise.all(
        dashboardModules.map(async module => {
          const progress = await storage.getUserModuleProgress(userId, module.id);
          
          return {
            id: module.id,
            title: module.title,
            description: module.description,
            icon: module.icon,
            accentColor: module.accentColor,
            status: module.id === 3 ? "locked" : "in-progress",
            progress: progress?.percentageComplete || 0,
            lessonsCompleted: progress?.lessonsCompleted || 0,
            totalLessons: module.totalLessons,
            timeRemaining: module.id === 1 ? 20 : 45 // Minutes remaining
          };
        })
      );
      
      res.json({ modules });
    } catch (error) {
      console.error("Error fetching learning modules:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get all learning modules
  app.get("/api/learning/all-modules", isAuthenticated!, async (req: Request, res: Response) => {
    try {
      const user = req.user as User;
      const userId = user.id;
      const allModules = await storage.getLearningModules();
      
      const modules = await Promise.all(
        allModules.map(async module => {
          const progress = await storage.getUserModuleProgress(userId, module.id);
          const isCompleted = progress?.completed || false;
          
          // Set status based on prerequisites and completion
          let status = "in-progress";
          if (module.prerequisites.length > 0) {
            // Check if all prerequisites are completed
            const prereqsCompleted = await Promise.all(
              module.prerequisites.map(async prereqId => {
                const prereqProgress = await storage.getUserModuleProgress(userId, prereqId);
                return prereqProgress?.completed || false;
              })
            );
            
            if (!prereqsCompleted.every(completed => completed)) {
              status = "locked";
            }
          }
          
          if (isCompleted) {
            status = "completed";
          }
          
          return {
            id: module.id,
            title: module.title,
            description: module.description,
            icon: module.icon,
            accentColor: module.accentColor,
            status,
            progress: progress?.percentageComplete || 0,
            lessonsCompleted: progress?.lessonsCompleted || 0,
            totalLessons: module.totalLessons,
            timeRemaining: module.id === 1 ? 20 : module.id === 2 ? 45 : 60, // Minutes remaining
            duration: module.duration,
            difficulty: module.difficulty,
            topics: module.topics
          };
        })
      );
      
      res.json({ modules });
    } catch (error) {
      console.error("Error fetching all learning modules:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get lessons for a specific module
  app.get("/api/learning/modules/:moduleId/lessons", isAuthenticated!, async (req: Request, res: Response) => {
    try {
      const moduleId = parseInt(req.params.moduleId, 10);
      if (isNaN(moduleId)) {
        return res.status(400).json({ message: "Invalid module ID" });
      }
      
      const module = await storage.getLearningModule(moduleId);
      if (!module) {
        return res.status(404).json({ message: "Module not found" });
      }
      
      const lessons = await storage.getLessons(moduleId);
      
      // Sort lessons by order property
      const sortedLessons = lessons.sort((a, b) => a.order - b.order);
      
      // Return lessons with just the data needed for the lesson list
      const lessonList = sortedLessons.map(lesson => ({
        id: lesson.id,
        moduleId: lesson.moduleId,
        title: lesson.title,
        order: lesson.order,
        duration: lesson.duration
      }));
      
      res.json({ 
        moduleTitle: module.title,
        moduleDescription: module.description,
        accentColor: module.accentColor,
        lessons: lessonList 
      });
    } catch (error) {
      console.error("Error fetching module lessons:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get a specific lesson
  app.get("/api/learning/lessons/:lessonId", isAuthenticated!, async (req: Request, res: Response) => {
    try {
      const lessonId = parseInt(req.params.lessonId, 10);
      if (isNaN(lessonId)) {
        return res.status(400).json({ message: "Invalid lesson ID" });
      }
      
      const lesson = await storage.getLesson(lessonId);
      if (!lesson) {
        return res.status(404).json({ message: "Lesson not found" });
      }
      
      const module = await storage.getLearningModule(lesson.moduleId);
      if (!module) {
        return res.status(404).json({ message: "Module not found" });
      }
      
      // Get all lessons for this module to determine next/previous lessons
      const moduleLessons = await storage.getLessons(lesson.moduleId);
      const sortedLessons = moduleLessons.sort((a, b) => a.order - b.order);
      
      const currentIndex = sortedLessons.findIndex(l => l.id === lessonId);
      const prevLesson = currentIndex > 0 ? sortedLessons[currentIndex - 1] : null;
      const nextLesson = currentIndex < sortedLessons.length - 1 ? sortedLessons[currentIndex + 1] : null;
      
      res.json({
        lesson: {
          id: lesson.id,
          moduleId: lesson.moduleId,
          title: lesson.title,
          content: lesson.content,
          order: lesson.order,
          duration: lesson.duration,
          quizId: lesson.quizId
        },
        module: {
          id: module.id,
          title: module.title,
          accentColor: module.accentColor
        },
        navigation: {
          prev: prevLesson ? { id: prevLesson.id, title: prevLesson.title } : null,
          next: nextLesson ? { id: nextLesson.id, title: nextLesson.title } : null
        }
      });
    } catch (error) {
      console.error("Error fetching lesson:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get financial overview
  app.get("/api/finance/overview", isAuthenticated!, async (req: Request, res: Response) => {
    try {
      const user = req.user as User;
      const userId = user.id;
      const accounts = await storage.getFinancialAccounts(userId);
      
      const connected = accounts.length > 0;
      
      // Default spending categories
      const categories = [
        { name: "Food & Dining", percentage: 30, icon: "fa-utensils", color: "neon-green" },
        { name: "Housing", percentage: 40, icon: "fa-home", color: "neon-cyan" },
        { name: "Transportation", percentage: 15, icon: "fa-car", color: "neon-purple" }
      ];
      
      res.json({
        connected,
        totalBalance: formatCurrency(accounts.reduce((sum, acc) => sum + acc.balance, 0) / 100),
        categories
      });
    } catch (error) {
      console.error("Error fetching financial overview:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get financial insights
  app.get("/api/finance/insights", isAuthenticated!, async (req: Request, res: Response) => {
    try {
      // Get insights from OpenAI
      // For now, using mock insights
      res.json({ insights: mockFinancialInsights });
    } catch (error) {
      console.error("Error fetching financial insights:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get detailed financial data
  app.get("/api/finance/details", isAuthenticated!, async (req: Request, res: Response) => {
    try {
      const user = req.user as User;
      const userId = user.id;
      const accounts = await storage.getFinancialAccounts(userId);
      const budgets = await storage.getBudgets(userId);
      
      const connected = accounts.length > 0;
      const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
      
      // Mock values for demo purpose
      const mockData = {
        connected,
        totalBalance: formatCurrency(totalBalance / 100),
        monthlyIncome: "$3,500.00",
        monthlyExpenses: "$2,800.00",
        savingsRate: "20%",
        topCategories: [
          { name: "Housing", amount: "$1,200.00", percentage: 40, icon: "fa-home", color: "neon-cyan" },
          { name: "Food", amount: "$600.00", percentage: 20, icon: "fa-utensils", color: "neon-green" },
          { name: "Transportation", amount: "$400.00", percentage: 15, icon: "fa-car", color: "neon-purple" }
        ],
        budgets: [
          { 
            category: "Food & Dining", 
            spent: "$550", 
            limit: "$600", 
            percentage: 92, 
            status: "under", 
            remainingAmount: "$50"
          },
          { 
            category: "Entertainment", 
            spent: "$200", 
            limit: "$150", 
            percentage: 133, 
            status: "over", 
            overAmount: "$50" 
          },
          { 
            category: "Transportation", 
            spent: "$350", 
            limit: "$400", 
            percentage: 88, 
            status: "under", 
            remainingAmount: "$50"
          }
        ]
      };
      
      res.json(mockData);
    } catch (error) {
      console.error("Error fetching financial details:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get learning recommendations
  app.get("/api/learning/recommendations", isAuthenticated!, async (req: Request, res: Response) => {
    try {
      const recommendations = [
        {
          title: "Understanding Market Volatility",
          type: "15 minute lesson",
          icon: "fa-play-circle",
          color: "neon-green"
        },
        {
          title: "Create Your Emergency Fund",
          type: "Interactive exercise",
          icon: "fa-tasks",
          color: "neon-cyan"
        },
        {
          title: "Investment Basics Quiz",
          type: "Test your knowledge",
          icon: "fa-question-circle",
          color: "neon-purple"
        }
      ];
      
      res.json({ recommendations });
    } catch (error) {
      console.error("Error fetching learning recommendations:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get user achievements
  app.get("/api/user/achievements", isAuthenticated!, async (req: Request, res: Response) => {
    try {
      const user = req.user as User;
      const userId = user.id;
      const userAchievements = await storage.getUserAchievements(userId);
      const allAchievements = await storage.getAchievements();
      
      // Get the achievement details for each user achievement
      const achievements = await Promise.all(
        userAchievements.map(async userAchievement => {
          const achievement = await storage.getAchievement(userAchievement.achievementId);
          if (!achievement) return null;
          
          return {
            id: achievement.id,
            title: achievement.title,
            description: achievement.description,
            icon: achievement.icon,
            color: achievement.color,
            unlockedAt: userAchievement.unlockedAt
          };
        })
      );
      
      // Filter out null values and return the first 3 for dashboard
      const dashboardAchievements = achievements
        .filter(Boolean)
        .slice(0, 3)
        .map(achievement => ({
          ...achievement,
          date: achievement.unlockedAt.toLocaleString()
        }));
      
      res.json({ achievements: dashboardAchievements });
    } catch (error) {
      console.error("Error fetching user achievements:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get all user achievements
  app.get("/api/user/all-achievements", isAuthenticated!, async (req: Request, res: Response) => {
    try {
      const user = req.user as User;
      const userId = user.id;
      const userAchievements = await storage.getUserAchievements(userId);
      const allAchievements = await storage.getAchievements();
      
      // Map achievements to include unlock status
      const achievements = allAchievements.map(achievement => {
        const userAchievement = userAchievements.find(ua => ua.achievementId === achievement.id);
        const unlocked = !!userAchievement;
        
        return {
          id: achievement.id,
          title: achievement.title,
          description: achievement.description,
          icon: achievement.icon,
          color: achievement.color,
          requirement: achievement.requirement,
          unlocked,
          date: userAchievement ? new Date(userAchievement.unlockedAt).toLocaleDateString() : null
        };
      });
      
      res.json({
        achievements,
        unlocked: userAchievements.length,
        locked: allAchievements.length - userAchievements.length,
        progress: Math.round((userAchievements.length / allAchievements.length) * 100)
      });
    } catch (error) {
      console.error("Error fetching all user achievements:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get assistant messages for dashboard preview
  app.get("/api/assistant/messages", isAuthenticated!, async (req: Request, res: Response) => {
    try {
      const user = req.user as User;
      const userId = user.id;
      const allMessages = await storage.getAssistantMessages(userId);
      
      // Get the last 5 messages for the dashboard
      const messages = allMessages
        .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
        .slice(-5)
        .map(message => ({
          sender: message.sender,
          content: message.content
        }));
      
      res.json({ messages });
    } catch (error) {
      console.error("Error fetching assistant messages:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get all assistant messages
  app.get("/api/assistant/all-messages", isAuthenticated!, async (req: Request, res: Response) => {
    try {
      const user = req.user as User;
      const userId = user.id;
      const allMessages = await storage.getAssistantMessages(userId);
      
      // Format messages with timestamp
      const messages = allMessages
        .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
        .map(message => ({
          sender: message.sender,
          content: message.content,
          timestamp: message.timestamp.toLocaleTimeString()
        }));
      
      res.json({ messages });
    } catch (error) {
      console.error("Error fetching all assistant messages:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Check if Mistral API is configured
  app.get("/api/assistant/api-status", (req: Request, res: Response) => {
    const hasApiKey = !!process.env.MISTRAL_API_KEY;
    res.json({ 
      configured: hasApiKey,
      message: hasApiKey 
        ? "Mistral AI is configured and ready to use"
        : "Mistral AI API key is not configured. Please set the MISTRAL_API_KEY environment variable."
    });
  });
  
  // Set environment variable - ONLY for development use
  app.post("/api/setenv", (req: Request, res: Response) => {
    try {
      const { key, value } = req.body;
      
      // Only allow setting specific keys
      if (key !== "MISTRAL_API_KEY") {
        return res.status(403).json({ message: "Setting this environment variable is not allowed" });
      }
      
      // Set the environment variable
      process.env[key] = value;
      
      res.json({ success: true, message: `Environment variable ${key} set successfully` });
    } catch (error) {
      console.error("Error setting environment variable:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Send message to assistant
  app.post("/api/assistant/message", isAuthenticated!, async (req: Request, res: Response) => {
    try {
      const { message } = req.body;
      const user = req.user as User;
      const userId = user.id;
      
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ message: "Message is required" });
      }
      
      // Check if API key is configured
      if (!process.env.MISTRAL_API_KEY) {
        return res.status(403).json({ 
          message: "Mistral AI API key is not configured",
          needsApiKey: true
        });
      }
      
      // Store user message
      await storage.createAssistantMessage({
        userId,
        content: message,
        sender: "user"
      });
      
      // Generate response using Mistral
      const aiResponse = await generateFinancialInsight(message);
      
      // Store AI response
      const assistantMessage = await storage.createAssistantMessage({
        userId,
        content: aiResponse,
        sender: "assistant"
      });
      
      res.json({ success: true, message: assistantMessage });
    } catch (error) {
      console.error("Error sending message to assistant:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Quiz routes
  
  // Get quizzes for a lesson
  app.get("/api/quizzes/lesson/:lessonId", isAuthenticated!, async (req: Request, res: Response) => {
    try {
      const lessonId = parseInt(req.params.lessonId);
      
      if (isNaN(lessonId)) {
        return res.status(400).json({ message: "Invalid lesson ID" });
      }
      
      const quizzes = await storage.getQuizzesByLesson(lessonId);
      res.json({ quizzes });
    } catch (error) {
      console.error("Error fetching quizzes:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get a specific quiz with its questions
  app.get("/api/quizzes/:quizId", isAuthenticated!, async (req: Request, res: Response) => {
    try {
      const quizId = parseInt(req.params.quizId);
      
      if (isNaN(quizId)) {
        return res.status(400).json({ message: "Invalid quiz ID" });
      }
      
      const quiz = await storage.getQuiz(quizId);
      
      if (!quiz) {
        return res.status(404).json({ message: "Quiz not found" });
      }
      
      const questions = await storage.getQuizQuestions(quizId);
      
      res.json({ 
        quiz,
        questions
      });
    } catch (error) {
      console.error("Error fetching quiz:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Submit a quiz attempt
  app.post("/api/quizzes/:quizId/attempt", isAuthenticated!, async (req: Request, res: Response) => {
    try {
      const user = req.user as User;
      const userId = user.id;
      const quizId = parseInt(req.params.quizId);
      
      if (isNaN(quizId)) {
        return res.status(400).json({ message: "Invalid quiz ID" });
      }
      
      const { answers, timeTaken } = req.body;
      
      if (!Array.isArray(answers)) {
        return res.status(400).json({ message: "Answers must be an array" });
      }
      
      const quiz = await storage.getQuiz(quizId);
      
      if (!quiz) {
        return res.status(404).json({ message: "Quiz not found" });
      }
      
      const questions = await storage.getQuizQuestions(quizId);
      
      // Create attempt
      const attempt = await storage.createQuizAttempt({
        userId,
        quizId,
        score: 0, // Will be calculated below
        passed: false, // Will be calculated below
        timeTaken
      });
      
      let totalPoints = 0;
      let earnedPoints = 0;
      
      // Process each answer and build feedback
      const feedback: { [questionId: number]: { correct: boolean; explanation: string } } = {};
      
      for (const answer of answers) {
        const question = questions.find(q => q.id === answer.questionId);
        
        if (!question) {
          continue;
        }
        
        let isCorrect = false;
        totalPoints += question.points || 1;
        
        // Evaluate correctness based on question type
        if (question.type === 'multiple-choice' || question.type === 'true-false') {
          const correctOptions = question.options?.filter(opt => opt.isCorrect).map(opt => opt.id) || [];
          const selectedOptions = answer.selectedOptions || [];
          
          // For multiple-choice, the answer is correct if they selected all correct options and no incorrect ones
          isCorrect = 
            selectedOptions.length === correctOptions.length && 
            selectedOptions.every(id => correctOptions.includes(id));
            
          if (isCorrect) {
            earnedPoints += question.points || 1;
          }
        }
        
        // Save the answer
        await storage.createQuizAnswer({
          attemptId: attempt.id,
          questionId: question.id,
          selectedOptions: answer.selectedOptions || [],
          isCorrect
        });
        
        // Add to feedback
        feedback[question.id] = {
          correct: isCorrect,
          explanation: question.explanation || 'No explanation provided.'
        };
      }
      
      // Calculate score as a percentage
      const scorePercentage = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
      const passed = scorePercentage >= (quiz.passingScore || 70);
      
      // Update attempt with score
      const updatedAttempt = await storage.updateQuizAttempt(attempt.id, {
        score: scorePercentage,
        passed
      });
      
      res.json({ 
        score: scorePercentage,
        passed,
        feedback,
        attemptId: attempt.id
      });
    } catch (error) {
      console.error("Error submitting quiz attempt:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get quiz attempts for a user
  app.get("/api/quizzes/:quizId/attempts", isAuthenticated!, async (req: Request, res: Response) => {
    try {
      const user = req.user as User;
      const userId = user.id;
      const quizId = parseInt(req.params.quizId);
      
      if (isNaN(quizId)) {
        return res.status(400).json({ message: "Invalid quiz ID" });
      }
      
      const attempts = await storage.getQuizAttempts(quizId, userId);
      res.json({ attempts });
    } catch (error) {
      console.error("Error fetching quiz attempts:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get details of a specific quiz attempt
  app.get("/api/quiz-attempts/:attemptId", isAuthenticated!, async (req: Request, res: Response) => {
    try {
      const attemptId = parseInt(req.params.attemptId);
      
      if (isNaN(attemptId)) {
        return res.status(400).json({ message: "Invalid attempt ID" });
      }
      
      const attempt = await storage.getQuizAttempt(attemptId);
      
      if (!attempt) {
        return res.status(404).json({ message: "Attempt not found" });
      }
      
      const answers = await storage.getQuizAnswers(attemptId);
      const quiz = await storage.getQuiz(attempt.quizId);
      const questions = await storage.getQuizQuestions(attempt.quizId);
      
      res.json({ 
        attempt,
        answers,
        quiz,
        questions
      });
    } catch (error) {
      console.error("Error fetching quiz attempt details:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // ===== Financial Game API Routes =====

  // Start a new game session with player name and career choice
  app.post("/api/financial-game/start", async (req: Request, res: Response) => {
    try {
      const { playerName, careerChoice } = req.body;
      
      if (!playerName || !careerChoice) {
        return res.status(400).json({ message: "Player name and career choice are required" });
      }
      
      const result = await startGame(playerName, careerChoice);
      
      res.json(result);
    } catch (error) {
      console.error("Error starting financial game:", error);
      res.status(500).json({ message: "Internal server error", error: `${error}` });
    }
  });
  
  // Initialize the financial twin with career path
  app.post("/api/financial-game/initialize", async (req: Request, res: Response) => {
    try {
      const { careerPath } = req.body;
      
      if (!careerPath) {
        return res.status(400).json({ message: "Career path is required" });
      }
      
      const result = await initializeFinancialTwin(careerPath);
      
      res.json(result);
    } catch (error) {
      console.error("Error initializing financial twin:", error);
      res.status(500).json({ message: "Internal server error", error: `${error}` });
    }
  });
  
  // Process financial decision
  app.post("/api/financial-game/process-decision", async (req: Request, res: Response) => {
    try {
      const { 
        careerPath, 
        income, 
        expenses, 
        savings, 
        debt, 
        financialDecision,
        nextStep 
      } = req.body;
      
      if (!careerPath || income === undefined || expenses === undefined || 
          savings === undefined || debt === undefined || !financialDecision || !nextStep) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      const result = await processFinancialDecision(
        careerPath, 
        income, 
        expenses, 
        savings, 
        debt, 
        financialDecision, 
        nextStep
      );
      
      res.json(result);
    } catch (error) {
      console.error("Error processing financial decision:", error);
      res.status(500).json({ message: "Internal server error", error: `${error}` });
    }
  });
  
  // Conclude game session
  app.post("/api/financial-game/conclude", async (req: Request, res: Response) => {
    try {
      const { 
        playerName, 
        careerPath, 
        xpEarned, 
        level, 
        achievements, 
        financialDecision 
      } = req.body;
      
      if (!playerName || !careerPath || xpEarned === undefined || 
          level === undefined || !achievements || !financialDecision) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      const result = await concludeGameSession(
        playerName, 
        careerPath, 
        xpEarned, 
        level, 
        achievements, 
        financialDecision
      );
      
      res.json(result);
    } catch (error) {
      console.error("Error concluding game session:", error);
      res.status(500).json({ message: "Internal server error", error: `${error}` });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}

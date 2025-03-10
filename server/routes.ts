import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateFinancialInsight } from "./services/mistral";
import { formatCurrency } from "@/lib/utils";
import { mockFinancialInsights } from "./data/insights";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get current user profile
  app.get("/api/user/profile", async (req: Request, res: Response) => {
    try {
      // In a real app, we'd get the userId from the session
      const userId = 1; // Mock user ID
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Return only needed fields for frontend
      res.json({
        id: user.id,
        username: user.username,
        firstName: user.firstName || "John",
        lastName: user.lastName || "Smith",
        email: user.email || "john.smith@example.com",
        userLevel: user.userLevel
      });
    } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get user stats for dashboard
  app.get("/api/user/stats", async (req: Request, res: Response) => {
    try {
      const userId = 1; // Mock user ID
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
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
  app.get("/api/learning/modules", async (req: Request, res: Response) => {
    try {
      const allModules = await storage.getLearningModules();
      const userId = 1; // Mock user ID
      
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
  app.get("/api/learning/all-modules", async (req: Request, res: Response) => {
    try {
      const allModules = await storage.getLearningModules();
      const userId = 1; // Mock user ID
      
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
  
  // Get financial overview
  app.get("/api/finance/overview", async (req: Request, res: Response) => {
    try {
      const userId = 1; // Mock user ID
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
  app.get("/api/finance/insights", async (req: Request, res: Response) => {
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
  app.get("/api/finance/details", async (req: Request, res: Response) => {
    try {
      const userId = 1; // Mock user ID
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
  app.get("/api/learning/recommendations", async (req: Request, res: Response) => {
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
  app.get("/api/user/achievements", async (req: Request, res: Response) => {
    try {
      const userId = 1; // Mock user ID
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
  app.get("/api/user/all-achievements", async (req: Request, res: Response) => {
    try {
      const userId = 1; // Mock user ID
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
  app.get("/api/assistant/messages", async (req: Request, res: Response) => {
    try {
      const userId = 1; // Mock user ID
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
  app.get("/api/assistant/all-messages", async (req: Request, res: Response) => {
    try {
      const userId = 1; // Mock user ID
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
  
  // Send message to assistant
  app.post("/api/assistant/message", async (req: Request, res: Response) => {
    try {
      const { message } = req.body;
      const userId = 1; // Mock user ID
      
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ message: "Message is required" });
      }
      
      // Store user message
      await storage.createAssistantMessage({
        userId,
        content: message,
        sender: "user"
      });
      
      // Generate response using OpenAI
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

  const httpServer = createServer(app);

  return httpServer;
}

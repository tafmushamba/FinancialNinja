import { User } from "@shared/schema";

export const mockUser: User = {
  id: 1,
  username: "johnsmith",
  password: "hashedpassword", // This would be properly hashed in a real app
  firstName: "John",
  lastName: "Smith",
  email: "john.smith@example.com",
  userLevel: "Level 3 Investor",
  financialLiteracyScore: 72,
  createdAt: new Date(),
  updatedAt: new Date(),
  settings: {
    darkMode: true,
    animations: true,
    soundEffects: false,
    learningDifficulty: "intermediate",
    notifications: {
      email: true,
      push: true,
      learningReminders: true,
      budgetAlerts: true
    }
  }
};

import { LearningModule } from "@shared/schema";

export const mockModules: LearningModule[] = [
  {
    id: 1,
    title: "Investment Basics",
    description: "Learn the fundamentals of investing and building wealth over time.",
    icon: "fas fa-chart-line",
    accentColor: "neon-green",
    totalLessons: 12,
    difficulty: "Beginner",
    duration: "2 hours",
    topics: ["Stocks", "Bonds", "Mutual Funds", "Risk Management"],
    prerequisites: [],
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 2,
    title: "Budgeting Fundamentals",
    description: "Master the art of budgeting and take control of your finances.",
    icon: "fas fa-wallet",
    accentColor: "neon-cyan",
    totalLessons: 10,
    difficulty: "Beginner",
    duration: "1.5 hours",
    topics: ["Income Tracking", "Expense Categories", "Saving Goals", "Budget Tools"],
    prerequisites: [],
    order: 2,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 3,
    title: "Risk Management",
    description: "Learn to identify, assess, and mitigate financial risks effectively.",
    icon: "fas fa-shield-alt",
    accentColor: "neon-purple",
    totalLessons: 8,
    difficulty: "Intermediate",
    duration: "1.5 hours",
    topics: ["Insurance", "Emergency Funds", "Diversification", "Risk Assessment"],
    prerequisites: [1], // Requires Investment Basics
    order: 3,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 4,
    title: "Retirement Planning",
    description: "Plan for a secure and comfortable retirement through smart strategies.",
    icon: "fas fa-umbrella-beach",
    accentColor: "neon-yellow",
    totalLessons: 10,
    difficulty: "Intermediate",
    duration: "2 hours",
    topics: ["401(k) Plans", "IRAs", "Social Security", "Retirement Income"],
    prerequisites: [1, 2], // Requires Investment Basics and Budgeting Fundamentals
    order: 4,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 5,
    title: "Credit Management",
    description: "Understand credit scores, reports, and strategies to build good credit.",
    icon: "fas fa-credit-card",
    accentColor: "neon-red",
    totalLessons: 8,
    difficulty: "Beginner",
    duration: "1.5 hours",
    topics: ["Credit Scores", "Credit Reports", "Debt Management", "Credit Cards"],
    prerequisites: [],
    order: 5,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 6,
    title: "Tax Strategies",
    description: "Optimize your tax situation with effective planning and strategies.",
    icon: "fas fa-file-invoice-dollar",
    accentColor: "neon-green",
    totalLessons: 10,
    difficulty: "Advanced",
    duration: "2.5 hours",
    topics: ["Income Tax", "Tax Deductions", "Tax Credits", "Tax-Advantaged Accounts"],
    prerequisites: [1, 2], // Requires Investment Basics and Budgeting Fundamentals
    order: 6,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 7,
    title: "Real Estate Investing",
    description: "Explore opportunities and strategies in real estate investments.",
    icon: "fas fa-home",
    accentColor: "neon-cyan",
    totalLessons: 12,
    difficulty: "Advanced",
    duration: "3 hours",
    topics: ["Rental Properties", "REITs", "Flipping Houses", "Commercial Real Estate"],
    prerequisites: [1, 3], // Requires Investment Basics and Risk Management
    order: 7,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

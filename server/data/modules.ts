import { LearningModule } from "@shared/schema";

export const mockModules: LearningModule[] = [
  {
    id: 1,
    title: "UK Investing Essentials",
    description: "Learn the fundamentals of investing in the UK market and building long-term wealth.",
    icon: "fas fa-chart-line",
    accentColor: "neon-green",
    totalLessons: 12,
    difficulty: "Beginner",
    duration: "2.5 hours",
    topics: ["ISAs", "Stocks & Shares", "UK Funds", "Risk Management", "Compound Interest"],
    prerequisites: [],
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 2,
    title: "UK Budgeting Fundamentals",
    description: "Master the art of budgeting and take control of your finances in the UK economy.",
    icon: "fas fa-wallet",
    accentColor: "neon-cyan",
    totalLessons: 10,
    difficulty: "Beginner",
    duration: "1.5 hours",
    topics: ["Income Tracking", "UK Expenses", "Saving Goals", "Budget Methods", "Financial Planning"],
    prerequisites: [],
    order: 2,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 3,
    title: "UK Risk Management",
    description: "Learn to identify, assess, and mitigate financial risks for UK residents.",
    icon: "fas fa-shield-alt",
    accentColor: "neon-purple",
    totalLessons: 8,
    difficulty: "Intermediate",
    duration: "1.5 hours",
    topics: ["UK Insurance", "Emergency Funds", "Diversification", "Risk Assessment", "Financial Protection"],
    prerequisites: [1], // Requires Investment Basics
    order: 5,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 4,
    title: "UK Retirement Planning",
    description: "Plan for a secure retirement with UK pensions, savings, and investment strategies.",
    icon: "fas fa-umbrella-beach",
    accentColor: "neon-yellow",
    totalLessons: 10,
    difficulty: "Intermediate",
    duration: "2 hours",
    topics: ["UK State Pension", "Workplace Pensions", "SIPPs", "Retirement Income", "Later Life Planning"],
    prerequisites: [1, 2], // Requires Investment Basics and Budgeting Fundamentals
    order: 8,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 5,
    title: "UK Credit Management",
    description: "Understand UK credit scores, reports, and strategies to build and maintain good credit.",
    icon: "fas fa-credit-card",
    accentColor: "neon-red",
    totalLessons: 8,
    difficulty: "Beginner",
    duration: "1.5 hours",
    topics: ["UK Credit Scores", "Credit Reports", "Credit Cards", "Loans", "Borrowing Responsibly"],
    prerequisites: [],
    order: 6,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 6,
    title: "UK Tax Essentials",
    description: "Navigate the UK tax system including income tax, National Insurance, and tax-efficient strategies.",
    icon: "fas fa-file-invoice-dollar",
    accentColor: "neon-green",
    totalLessons: 10,
    difficulty: "Intermediate",
    duration: "2 hours",
    topics: ["Income Tax", "National Insurance", "Council Tax", "VAT", "Tax-Efficient Saving"],
    prerequisites: [2], // Requires Budgeting Fundamentals
    order: 7,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 7,
    title: "UK Property & Mortgages",
    description: "Understand the UK property market, mortgages, and home buying process.",
    icon: "fas fa-home",
    accentColor: "neon-cyan",
    totalLessons: 10,
    difficulty: "Intermediate",
    duration: "2 hours",
    topics: ["UK Mortgages", "House Buying Process", "Property Costs", "Help to Buy", "Renting vs Buying"],
    prerequisites: [1, 5], // Requires Investment Basics and Credit Management
    order: 9,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 8,
    title: "UK Savings Strategies",
    description: "Learn effective saving techniques and understand UK savings products and accounts.",
    icon: "fas fa-piggy-bank",
    accentColor: "neon-blue",
    totalLessons: 8,
    difficulty: "Beginner",
    duration: "1.5 hours",
    topics: ["Emergency Funds", "Savings Accounts", "ISAs", "Premium Bonds", "Saving Habits"],
    prerequisites: [],
    order: 3,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 9,
    title: "UK Debt Management",
    description: "Strategies for managing and reducing debts, understanding UK debt solutions, and avoiding debt traps.",
    icon: "fas fa-hand-holding-usd",
    accentColor: "neon-orange",
    totalLessons: 8,
    difficulty: "Beginner",
    duration: "1.5 hours",
    topics: ["Debt Repayment Strategies", "UK Debt Solutions", "Interest Management", "Debt Consolidation", "Avoiding Debt Traps"],
    prerequisites: [5], // Requires Credit Management
    order: 4,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 10,
    title: "Financial Planning for Young Adults",
    description: "Essential financial knowledge for UK young adults starting their financial journey.",
    icon: "fas fa-graduation-cap",
    accentColor: "neon-pink",
    totalLessons: 10,
    difficulty: "Beginner",
    duration: "2 hours",
    topics: ["Student Finance", "First Job Finances", "Money Management", "Building Credit", "Renting"],
    prerequisites: [],
    order: 10,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

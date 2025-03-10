import { Achievement } from "@shared/schema";

export const mockAchievements: Achievement[] = [
  {
    id: 1,
    title: "Budget Master",
    description: "Completed all budgeting fundamentals",
    icon: "fa-award",
    color: "neon-green",
    requirement: "Complete the Budgeting Fundamentals module",
    createdAt: new Date()
  },
  {
    id: 2,
    title: "5-Day Streak",
    description: "Logged in for 5 consecutive days",
    icon: "fa-star",
    color: "neon-cyan",
    requirement: "Log in to FinByte for 5 consecutive days",
    createdAt: new Date()
  },
  {
    id: 3,
    title: "Quiz Champion",
    description: "Scored 100% on Investment Basics quiz",
    icon: "fa-certificate",
    color: "neon-purple",
    requirement: "Score 100% on the Investment Basics module quiz",
    createdAt: new Date()
  },
  {
    id: 4,
    title: "Financial Explorer",
    description: "Completed your first learning module",
    icon: "fa-compass",
    color: "neon-yellow",
    requirement: "Complete any learning module",
    createdAt: new Date()
  },
  {
    id: 5,
    title: "Saving Savvy",
    description: "Set up your first savings goal",
    icon: "fa-piggy-bank",
    color: "neon-green",
    requirement: "Create a savings goal in the Finance Tracker",
    createdAt: new Date()
  },
  {
    id: 6,
    title: "Investment Initiate",
    description: "Completed the Investment Basics module",
    icon: "fa-chart-line",
    color: "neon-purple",
    requirement: "Complete the Investment Basics module",
    createdAt: new Date()
  },
  {
    id: 7,
    title: "Risk Ranger",
    description: "Completed the Risk Management module",
    icon: "fa-shield-alt",
    color: "neon-red",
    requirement: "Complete the Risk Management module",
    createdAt: new Date()
  },
  {
    id: 8,
    title: "Budget Builder",
    description: "Created your first budget",
    icon: "fa-tasks",
    color: "neon-cyan",
    requirement: "Create a budget in the Finance Tracker",
    createdAt: new Date()
  },
  {
    id: 9,
    title: "AI Explorer",
    description: "Asked 10 questions to the AI assistant",
    icon: "fa-robot",
    color: "neon-green",
    requirement: "Ask at least 10 questions to the Financial AI Assistant",
    createdAt: new Date()
  }
];

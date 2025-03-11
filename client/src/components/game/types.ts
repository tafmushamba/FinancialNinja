// Types for financial game components

export interface DecisionOption {
  value: string;
  label: string;
  description: string;
  impact?: {
    savings: number;
    debt: number;
    income: number;
    expenses: number;
  };
}

export interface FinancialAchievement {
  id: string;
  title: string;
  description: string;
  unlockedAt?: Date;
}

export interface FinancialMetricsType {
  income: number;
  expenses: number;
  savings: number;
  debt: number;
  monthlyBalance?: number;
  debtToIncomeRatio?: number;
  savingsRatio?: number;
}

export interface GameStateType {
  stage: 'welcome' | 'initialization' | 'making_decisions' | 'conclusion';
  playerName: string;
  careerPath: string;
  income: number;
  expenses: number;
  savings: number;
  debt: number;
  xpEarned: number;
  level: number;
  achievements: string[];
  message: string | null;
  isLoading: boolean;
  roundCount: number;
  nextStep: 'continue' | 'conclude';
  decisionOptions?: DecisionOption[];
}
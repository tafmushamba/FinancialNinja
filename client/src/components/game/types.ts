import { ReactNode } from 'react';

export interface DecisionOption {
  value: string;
  label: string;
  description: string;
  icon?: ReactNode;
  impact: {
    savings: number;
    debt: number;
    income: number;
    expenses: number;
  };
}
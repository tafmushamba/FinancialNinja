import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, PiggyBank, ArrowUpDown, BarChart3, Shield, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';

interface DecisionOption {
  value: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  impact: {
    savings: number;
    debt: number;
    income: number;
    expenses: number;
  };
}

interface DecisionCardsProps {
  onSelect: (option: string) => void;
  selectedOption: string | null;
  disabled: boolean;
}

export function DecisionCards({ onSelect, selectedOption, disabled }: DecisionCardsProps) {
  // Define the financial decision options with their impacts
  const options: DecisionOption[] = [
    {
      value: 'savings_focus',
      label: 'Focus on Savings',
      description: 'Prioritize building your savings account and emergency fund',
      icon: <PiggyBank className="h-6 w-6 text-amber-500" />,
      impact: {
        savings: 15,
        debt: 0,
        income: 0,
        expenses: -5
      }
    },
    {
      value: 'debt_payment',
      label: 'Pay Down Debt',
      description: 'Accelerate debt payments to reduce interest costs',
      icon: <CreditCard className="h-6 w-6 text-blue-500" />,
      impact: {
        savings: -5,
        debt: -20,
        income: 0,
        expenses: 0
      }
    },
    {
      value: 'balanced_approach',
      label: 'Balanced Approach',
      description: 'Maintain a balanced strategy for savings and debt reduction',
      icon: <ArrowUpDown className="h-6 w-6 text-purple-500" />,
      impact: {
        savings: 5,
        debt: -10,
        income: 0, 
        expenses: -5
      }
    },
    {
      value: 'investment',
      label: 'Invest for Growth',
      description: 'Put your money into investments for long-term growth',
      icon: <BarChart3 className="h-6 w-6 text-green-500" />,
      impact: {
        savings: -10,
        debt: 0,
        income: 5,
        expenses: 0
      }
    },
    {
      value: 'emergency_fund',
      label: 'Build Emergency Fund',
      description: 'Establish a safety net for unexpected expenses',
      icon: <Shield className="h-6 w-6 text-red-500" />,
      impact: {
        savings: 20,
        debt: 0,
        income: 0,
        expenses: -10
      }
    },
    {
      value: 'budget_optimization',
      label: 'Optimize Budget',
      description: 'Refine your budget to reduce expenses and increase savings',
      icon: <Wallet className="h-6 w-6 text-sky-500" />,
      impact: {
        savings: 10,
        debt: -5,
        income: 0,
        expenses: -15
      }
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {options.map((option, index) => (
        <motion.div
          key={option.value}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card 
            className={`cursor-pointer transition-all hover:shadow-md hover:border-primary/50 ${
              selectedOption === option.value ? 'border-2 border-primary' : ''
            } ${disabled ? 'opacity-60 pointer-events-none' : ''}`}
            onClick={() => !disabled && onSelect(option.value)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center space-x-2">
                {option.icon}
                <CardTitle className="text-base">{option.label}</CardTitle>
              </div>
              <CardDescription>{option.description}</CardDescription>
            </CardHeader>
            <CardContent className="pt-0 text-sm">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span>Savings Impact:</span>
                  <span className={option.impact.savings > 0 ? 'text-green-600' : option.impact.savings < 0 ? 'text-red-600' : ''}>
                    {option.impact.savings > 0 ? '+' : ''}{option.impact.savings}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Debt Impact:</span>
                  <span className={option.impact.debt < 0 ? 'text-green-600' : option.impact.debt > 0 ? 'text-red-600' : ''}>
                    {option.impact.debt > 0 ? '+' : ''}{option.impact.debt}%
                  </span>
                </div>
                {option.impact.income !== 0 && (
                  <div className="flex items-center justify-between">
                    <span>Income Impact:</span>
                    <span className={option.impact.income > 0 ? 'text-green-600' : 'text-red-600'}>
                      {option.impact.income > 0 ? '+' : ''}{option.impact.income}%
                    </span>
                  </div>
                )}
                {option.impact.expenses !== 0 && (
                  <div className="flex items-center justify-between">
                    <span>Expenses Impact:</span>
                    <span className={option.impact.expenses < 0 ? 'text-green-600' : 'text-red-600'}>
                      {option.impact.expenses > 0 ? '+' : ''}{option.impact.expenses}%
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
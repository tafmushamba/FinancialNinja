import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  CreditCard, PiggyBank, ArrowUpDown, BarChart3, Shield, Wallet, 
  Plane, Home, Coffee, Users, TrendingDown, Globe, Sparkles, 
  PartyPopper, DollarSign
} from 'lucide-react';
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
  scenario?: string | undefined;
}

export function DecisionCards({ onSelect, selectedOption, disabled, scenario }: DecisionCardsProps) {
  // Detect scenarios from message content
  const isSpringBreakScenario = scenario?.toLowerCase().includes('spring break');
  const isUnexpectedExpenseScenario = scenario?.toLowerCase().includes('unexpected') || scenario?.toLowerCase().includes('emergency');
  const isInvestmentScenario = scenario?.toLowerCase().includes('investment') || scenario?.toLowerCase().includes('stock market');
  
  // Different sets of options based on scenario
  const springBreakOptions: DecisionOption[] = [
    {
      value: 'skip_trip',
      label: 'Skip the Trip',
      description: 'Focus on your financial goals instead of spending on the trip',
      icon: <Home className="h-6 w-6 text-blue-500" />,
      impact: {
        savings: 10,
        debt: -5,
        income: 0,
        expenses: -15
      }
    },
    {
      value: 'budget_travel',
      label: 'Budget Travel Options',
      description: 'Go on the trip but find ways to minimize costs',
      icon: <Plane className="h-6 w-6 text-amber-500" />,
      impact: {
        savings: -5,
        debt: 5,
        income: 0,
        expenses: 10
      }
    },
    {
      value: 'side_hustle',
      label: 'Earn Extra Money',
      description: 'Take on a temporary side job to pay for the trip',
      icon: <DollarSign className="h-6 w-6 text-green-500" />,
      impact: {
        savings: 0,
        debt: 0,
        income: 15,
        expenses: 5
      }
    },
    {
      value: 'split_costs',
      label: 'Split Costs with Friends',
      description: 'Coordinate with friends to share expenses and reduce individual costs',
      icon: <Users className="h-6 w-6 text-purple-500" />,
      impact: {
        savings: -5,
        debt: 0,
        income: 0,
        expenses: 5
      }
    }
  ];

  const unexpectedExpenseOptions: DecisionOption[] = [
    {
      value: 'use_emergency_fund',
      label: 'Use Emergency Fund',
      description: 'This is what your emergency fund was built for',
      icon: <Shield className="h-6 w-6 text-red-500" />,
      impact: {
        savings: -15,
        debt: 0,
        income: 0,
        expenses: 0
      }
    },
    {
      value: 'temporary_credit',
      label: 'Use Credit Card',
      description: 'Cover the expense with credit and pay it off gradually',
      icon: <CreditCard className="h-6 w-6 text-blue-500" />,
      impact: {
        savings: 0,
        debt: 10,
        income: 0,
        expenses: 5
      }
    },
    {
      value: 'reduce_expenses',
      label: 'Cut Other Expenses',
      description: 'Temporarily reduce discretionary spending to cover this cost',
      icon: <TrendingDown className="h-6 w-6 text-purple-500" />,
      impact: {
        savings: -5,
        debt: 0,
        income: 0,
        expenses: -10
      }
    },
    {
      value: 'ask_for_help',
      label: 'Ask for Help',
      description: 'Reach out to family or friends for temporary assistance',
      icon: <Users className="h-6 w-6 text-sky-500" />,
      impact: {
        savings: 0,
        debt: 0,
        income: 5,
        expenses: 0
      }
    }
  ];

  const investmentOptions: DecisionOption[] = [
    {
      value: 'conservative_investment',
      label: 'Conservative Investment',
      description: 'Lower risk, stable but modest returns',
      icon: <Shield className="h-6 w-6 text-blue-500" />,
      impact: {
        savings: -5,
        debt: 0,
        income: 3,
        expenses: 0
      }
    },
    {
      value: 'balanced_portfolio',
      label: 'Balanced Portfolio',
      description: 'Mix of stocks and bonds for moderate growth with some stability',
      icon: <ArrowUpDown className="h-6 w-6 text-purple-500" />,
      impact: {
        savings: -10,
        debt: 0,
        income: 7,
        expenses: 0
      }
    },
    {
      value: 'aggressive_growth',
      label: 'Aggressive Growth',
      description: 'Higher risk stocks and funds for potential higher returns',
      icon: <BarChart3 className="h-6 w-6 text-red-500" />,
      impact: {
        savings: -15,
        debt: 0,
        income: 12,
        expenses: 0
      }
    },
    {
      value: 'real_estate',
      label: 'Real Estate Investment',
      description: 'Invest in property or REITs for steady income and appreciation',
      icon: <Home className="h-6 w-6 text-green-500" />,
      impact: {
        savings: -20,
        debt: 10,
        income: 10,
        expenses: 5
      }
    }
  ];
  
  // Default options if no specific scenario is detected
  const defaultOptions: DecisionOption[] = [
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
  
  // Select the appropriate options based on the detected scenario
  let options: DecisionOption[] = defaultOptions;
  
  if (isSpringBreakScenario) {
    options = springBreakOptions;
  } else if (isUnexpectedExpenseScenario) {
    options = unexpectedExpenseOptions;
  } else if (isInvestmentScenario) {
    options = investmentOptions;
  }

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
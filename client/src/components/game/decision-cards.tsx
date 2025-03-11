import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  CreditCard, 
  Scale, 
  LineChart, 
  Landmark, 
  BarChart3 
} from 'lucide-react';

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
  // Define the decision options with descriptions and visual metadata
  const decisions: DecisionOption[] = [
    { 
      value: 'savings_focus', 
      label: 'Focus on Savings', 
      description: 'Prioritize growing your emergency fund and long-term savings.',
      icon: <PiggyBank className="h-6 w-6 text-blue-500" />,
      impact: { savings: 3, debt: 0, income: 0, expenses: -1 }
    },
    { 
      value: 'debt_payment', 
      label: 'Pay Down Debt', 
      description: 'Accelerate debt repayment to reduce interest costs.',
      icon: <CreditCard className="h-6 w-6 text-red-500" />,
      impact: { savings: -1, debt: -3, income: 0, expenses: 0 }
    },
    { 
      value: 'balanced_approach', 
      label: 'Balanced Approach', 
      description: 'Maintain a healthy balance between savings and debt reduction.',
      icon: <Scale className="h-6 w-6 text-purple-500" />,
      impact: { savings: 1, debt: -1, income: 0, expenses: 0 }
    },
    { 
      value: 'investment', 
      label: 'Invest for Growth', 
      description: 'Put money into investments that could grow your wealth over time.',
      icon: <TrendingUp className="h-6 w-6 text-green-500" />,
      impact: { savings: -2, debt: 0, income: 2, expenses: 0 }
    },
    { 
      value: 'emergency_fund', 
      label: 'Build Emergency Fund', 
      description: 'Create a financial safety net for unexpected expenses.',
      icon: <Landmark className="h-6 w-6 text-amber-500" />,
      impact: { savings: 2, debt: 0, income: 0, expenses: -1 }
    },
    { 
      value: 'budget_optimization', 
      label: 'Optimize Budget', 
      description: 'Review and reduce unnecessary expenses.',
      icon: <BarChart3 className="h-6 w-6 text-indigo-500" />,
      impact: { savings: 1, debt: 0, income: 0, expenses: -2 }
    }
  ];
  
  // Impact icon component
  const ImpactIndicator = ({ value }: { value: number }) => {
    if (value === 0) return null;
    
    const color = value > 0 ? 'text-green-500' : 'text-red-500';
    const indicator = Array(Math.abs(value)).fill(value > 0 ? '+' : '-').join('');
    
    return <span className={`text-xs font-bold ${color}`}>{indicator}</span>;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      {decisions.map((decision) => (
        <motion.div
          key={decision.value}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`
            cursor-pointer rounded-lg border p-4 shadow-sm transition-colors
            ${selectedOption === decision.value 
              ? 'border-primary bg-primary/5' 
              : 'border-border bg-background hover:border-primary/50'}
            ${disabled ? 'opacity-50 pointer-events-none' : ''}
          `}
          onClick={() => !disabled && onSelect(decision.value)}
        >
          <div className="flex items-start space-x-4">
            <div className="p-2 rounded-full bg-background">
              {decision.icon}
            </div>
            <div className="flex-1">
              <h3 className="font-medium mb-1">{decision.label}</h3>
              <p className="text-sm text-muted-foreground mb-3">{decision.description}</p>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center justify-between">
                  <span>Savings</span>
                  <ImpactIndicator value={decision.impact.savings} />
                </div>
                <div className="flex items-center justify-between">
                  <span>Debt</span>
                  <ImpactIndicator value={decision.impact.debt} />
                </div>
                <div className="flex items-center justify-between">
                  <span>Income</span>
                  <ImpactIndicator value={decision.impact.income} />
                </div>
                <div className="flex items-center justify-between">
                  <span>Expenses</span>
                  <ImpactIndicator value={decision.impact.expenses} />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function PiggyBank(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.7-1 2-2h2v-4h-2c0-1-.5-1.5-1-2V5z" />
      <path d="M2 9v1c0 1.1.9 2 2 2h1" />
      <path d="M16 11h0" />
    </svg>
  );
}
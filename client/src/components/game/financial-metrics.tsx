import React from 'react';
import { Card } from '@/components/ui/card';
import { PoundSterling, TrendingUp, TrendingDown, CreditCard, Wallet, Landmark } from 'lucide-react';

export interface FinancialMetricsType {
  income: number;
  expenses: number;
  savings: number;
  debt: number;
  monthlyBalance?: number;
  debtToIncomeRatio?: number;
  savingsRatio?: number;
}

interface FinancialMetricsProps {
  metrics: FinancialMetricsType;
}

export function FinancialMetrics({ metrics }: FinancialMetricsProps) {
  const {
    income,
    expenses,
    savings,
    debt,
    monthlyBalance = income - expenses,
    debtToIncomeRatio = debt / (income * 12) * 100,
    savingsRatio = (savings / income) * 100
  } = metrics;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="space-y-4">
        <MetricCard
          title="Monthly Income"
          value={`£${income.toLocaleString()}`}
          icon={<PoundSterling className="text-green-500" />}
          className="border-l-4 border-green-500"
        />
        <MetricCard
          title="Monthly Expenses"
          value={`£${expenses.toLocaleString()}`}
          icon={<Wallet className="text-orange-500" />}
          className="border-l-4 border-orange-500"
        />
      </div>
      
      <div className="space-y-4">
        <MetricCard
          title="Current Savings"
          value={`£${savings.toLocaleString()}`}
          icon={<Landmark className="text-blue-500" />}
          className="border-l-4 border-blue-500"
        />
        <MetricCard
          title="Current Debt"
          value={`£${debt.toLocaleString()}`}
          icon={<CreditCard className="text-red-500" />}
          className="border-l-4 border-red-500"
        />
      </div>
      
      <div className="space-y-4">
        <MetricCard
          title="Monthly Balance"
          value={`£${monthlyBalance.toLocaleString()}`}
          icon={monthlyBalance >= 0 ? 
            <TrendingUp className="text-green-500" /> : 
            <TrendingDown className="text-red-500" />
          }
          className={`border-l-4 ${monthlyBalance >= 0 ? 'border-green-500' : 'border-red-500'}`}
        />
        <div className="grid grid-cols-2 gap-4">
          <MetricCard
            title="Debt-to-Income"
            value={`${debtToIncomeRatio.toFixed(1)}%`}
            icon={<CreditCard className="text-gray-500" />}
            className="border-l-4 border-gray-500"
          />
          <MetricCard
            title="Savings Ratio"
            value={`${savingsRatio.toFixed(1)}%`}
            icon={<Landmark className="text-gray-500" />}
            className="border-l-4 border-gray-500"
          />
        </div>
      </div>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  className?: string;
}

function MetricCard({ title, value, icon, className = '' }: MetricCardProps) {
  return (
    <Card className={`p-4 ${className}`}>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-xl font-bold">{value}</p>
        </div>
        <div className="h-10 w-10 rounded-full bg-background flex items-center justify-center">
          {icon}
        </div>
      </div>
    </Card>
  );
}
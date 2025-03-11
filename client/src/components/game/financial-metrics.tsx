import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import {
  BarChart3,
  CreditCard,
  DollarSign,
  Landmark,
  TrendingDown,
  TrendingUp,
  Wallet
} from 'lucide-react';

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
    debtToIncomeRatio = income > 0 ? debt / income : 0,
    savingsRatio = income > 0 ? savings / income : 0
  } = metrics;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
      <MetricCard
        title="Monthly Income"
        value={formatCurrency(income)}
        icon={<DollarSign className="h-5 w-5" />}
        className="bg-green-50 dark:bg-green-900/20"
      />
      
      <MetricCard
        title="Monthly Expenses"
        value={formatCurrency(expenses)}
        icon={<CreditCard className="h-5 w-5" />}
        className="bg-red-50 dark:bg-red-900/20"
      />
      
      <MetricCard
        title="Savings"
        value={formatCurrency(savings)}
        icon={<Landmark className="h-5 w-5" />}
        className="bg-blue-50 dark:bg-blue-900/20"
      />
      
      <MetricCard
        title="Debt"
        value={formatCurrency(debt)}
        icon={<BarChart3 className="h-5 w-5" />}
        className="bg-amber-50 dark:bg-amber-900/20"
      />
      
      <MetricCard
        title="Monthly Balance"
        value={formatCurrency(monthlyBalance)}
        icon={monthlyBalance >= 0 ? 
          <TrendingUp className="h-5 w-5 text-green-500" /> : 
          <TrendingDown className="h-5 w-5 text-red-500" />}
        className={monthlyBalance >= 0 ? 
          "bg-green-50 dark:bg-green-900/20" : 
          "bg-red-50 dark:bg-red-900/20"}
      />
      
      <MetricCard
        title="Debt-to-Income Ratio"
        value={`${(debtToIncomeRatio * 100).toFixed(1)}%`}
        icon={<Wallet className="h-5 w-5" />}
        className={debtToIncomeRatio < 0.3 ? 
          "bg-green-50 dark:bg-green-900/20" : 
          debtToIncomeRatio < 0.5 ? 
            "bg-amber-50 dark:bg-amber-900/20" : 
            "bg-red-50 dark:bg-red-900/20"}
      />
      
      <MetricCard
        title="Savings Ratio"
        value={`${(savingsRatio * 100).toFixed(1)}%`}
        icon={<Landmark className="h-5 w-5" />}
        className={savingsRatio > 0.2 ? 
          "bg-green-50 dark:bg-green-900/20" : 
          savingsRatio > 0.1 ? 
            "bg-amber-50 dark:bg-amber-900/20" : 
            "bg-blue-50 dark:bg-blue-900/20"}
      />
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
    <Card className={`${className} border-none`}>
      <CardContent className="flex flex-col p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-muted-foreground">{title}</span>
          <div className="rounded-full bg-background p-1">{icon}</div>
        </div>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}
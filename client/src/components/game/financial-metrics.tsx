import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { PoundSterling, TrendingDown, TrendingUp, Wallet } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

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
  const monthlyBalance = metrics.monthlyBalance !== undefined ? 
    metrics.monthlyBalance : 
    metrics.income - metrics.expenses;
  
  const debtToIncomeRatio = metrics.debtToIncomeRatio !== undefined ? 
    metrics.debtToIncomeRatio : 
    metrics.income > 0 ? (metrics.debt / metrics.income) * 100 : 0;
  
  const savingsRatio = metrics.savingsRatio !== undefined ? 
    metrics.savingsRatio : 
    metrics.income > 0 ? (metrics.savings / metrics.income) * 100 : 0;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
      <Card className="bg-background border-2 border-primary/10">
        <CardContent className="p-4">
          <div className="grid grid-cols-2 gap-2">
            <MetricCard
              title="Monthly Income"
              value={formatCurrency(metrics.income)}
              icon={<PoundSterling className="h-4 w-4 text-green-500" />}
              className="bg-green-50 dark:bg-green-950/30"
            />
            <MetricCard
              title="Monthly Expenses"
              value={formatCurrency(metrics.expenses)}
              icon={<TrendingDown className="h-4 w-4 text-red-500" />}
              className="bg-red-50 dark:bg-red-950/30"
            />
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-background border-2 border-primary/10">
        <CardContent className="p-4">
          <div className="grid grid-cols-2 gap-2">
            <MetricCard
              title="Total Savings"
              value={formatCurrency(metrics.savings)}
              icon={<TrendingUp className="h-4 w-4 text-blue-500" />}
              className="bg-blue-50 dark:bg-blue-950/30"
            />
            <MetricCard
              title="Outstanding Debt"
              value={formatCurrency(metrics.debt)}
              icon={<Wallet className="h-4 w-4 text-amber-500" />}
              className="bg-amber-50 dark:bg-amber-950/30"
            />
          </div>
        </CardContent>
      </Card>
      
      <Card className="md:col-span-2 bg-background border-2 border-primary/10">
        <CardContent className="p-4">
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center p-3 rounded-md bg-green-50 dark:bg-green-950/30">
              <div className="text-xs text-muted-foreground mb-1">Monthly Balance</div>
              <div className={`font-medium ${monthlyBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(monthlyBalance)}
              </div>
            </div>
            
            <div className="text-center p-3 rounded-md bg-blue-50 dark:bg-blue-950/30">
              <div className="text-xs text-muted-foreground mb-1">Savings Rate</div>
              <div className="font-medium text-blue-600">
                {savingsRatio.toFixed(1)}%
              </div>
            </div>
            
            <div className="text-center p-3 rounded-md bg-amber-50 dark:bg-amber-950/30">
              <div className="text-xs text-muted-foreground mb-1">Debt-to-Income</div>
              <div className="font-medium text-amber-600">
                {debtToIncomeRatio.toFixed(1)}%
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
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
    <div className={`flex flex-col p-3 rounded-md ${className}`}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-muted-foreground">{title}</span>
        {icon}
      </div>
      <div className="font-medium">{value}</div>
    </div>
  );
}
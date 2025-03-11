import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/lib/utils';
import { PiggyBank, ArrowDownUp, DollarSign, TrendingUp, CreditCard, BarChart3 } from 'lucide-react';

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
  const { income, expenses, savings, debt, monthlyBalance, debtToIncomeRatio, savingsRatio } = metrics;
  
  // Calculate derived metrics if not provided
  const calculatedMonthlyBalance = monthlyBalance || income - expenses;
  const calculatedDebtToIncomeRatio = debtToIncomeRatio || (income > 0 ? debt / (income * 12) : 0);
  const calculatedSavingsRatio = savingsRatio || (income > 0 ? savings / income : 0);
  
  return (
    <Card className="shadow-md">
      <CardContent className="p-4 md:p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          Financial Metrics
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <MetricCard 
            title="Income" 
            value={formatCurrency(income)}
            icon={<DollarSign className="h-5 w-5 text-emerald-500" />}
          />
          
          <MetricCard 
            title="Expenses" 
            value={formatCurrency(expenses)}
            icon={<ArrowDownUp className="h-5 w-5 text-amber-500" />}
          />
          
          <MetricCard 
            title="Savings" 
            value={formatCurrency(savings)}
            icon={<PiggyBank className="h-5 w-5 text-blue-500" />}
            className="col-span-2 md:col-span-1"
          />
          
          <MetricCard 
            title="Debt" 
            value={formatCurrency(debt)}
            icon={<CreditCard className="h-5 w-5 text-red-500" />}
          />
          
          <MetricCard 
            title="Monthly Balance" 
            value={formatCurrency(calculatedMonthlyBalance)}
            icon={<TrendingUp className="h-5 w-5 text-primary" />}
            className={calculatedMonthlyBalance >= 0 ? "text-emerald-600" : "text-red-600"}
          />
        </div>
        
        <Separator className="my-4" />
        
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Debt/Income Ratio</span>
            <span className={`text-lg font-medium ${calculatedDebtToIncomeRatio < 0.36 ? 'text-emerald-600' : 'text-amber-600'}`}>
              {(calculatedDebtToIncomeRatio * 100).toFixed(1)}%
            </span>
          </div>
          
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Savings Ratio</span>
            <span className={`text-lg font-medium ${calculatedSavingsRatio > 0.2 ? 'text-emerald-600' : 'text-amber-600'}`}>
              {(calculatedSavingsRatio * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
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
    <div className={`bg-card rounded-lg border p-3 flex flex-col ${className}`}>
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm text-muted-foreground">{title}</span>
        {icon}
      </div>
      <span className="text-lg font-medium">{value}</span>
    </div>
  );
}
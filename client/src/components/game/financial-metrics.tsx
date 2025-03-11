import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUp, ArrowDown, Coins, Wallet, CreditCard, Receipt } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { motion } from 'framer-motion';

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
  const { income, expenses, savings, debt } = metrics;
  const monthlyBalance = income - expenses;

  // Format metrics for display
  const formattedIncome = formatCurrency(income);
  const formattedExpenses = formatCurrency(expenses);
  const formattedSavings = formatCurrency(savings);
  const formattedDebt = formatCurrency(debt);
  const formattedBalance = formatCurrency(monthlyBalance);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center">
            <Coins className="h-5 w-5 text-primary mr-2" />
            Financial Status
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Monthly Income"
              value={formattedIncome}
              icon={<Wallet className="h-4 w-4 text-emerald-500" />}
              className="bg-emerald-50 dark:bg-emerald-950/30"
            />
            <MetricCard
              title="Monthly Expenses"
              value={formattedExpenses}
              icon={<Receipt className="h-4 w-4 text-red-500" />}
              className="bg-red-50 dark:bg-red-950/30"
            />
            <MetricCard
              title="Total Savings"
              value={formattedSavings}
              icon={<Coins className="h-4 w-4 text-amber-500" />}
              className="bg-amber-50 dark:bg-amber-950/30"
            />
            <MetricCard
              title="Total Debt"
              value={formattedDebt}
              icon={<CreditCard className="h-4 w-4 text-blue-500" />}
              className="bg-blue-50 dark:bg-blue-950/30"
            />
          </div>
          
          <div className="mt-4 p-3 rounded-md flex items-center justify-between text-sm">
            <div className="font-medium">Monthly Balance</div>
            <div className={`flex items-center font-medium ${monthlyBalance >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
              {monthlyBalance >= 0 ? (
                <ArrowUp className="h-4 w-4 mr-1" />
              ) : (
                <ArrowDown className="h-4 w-4 mr-1" />
              )}
              {formattedBalance}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
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
    <div className={`p-3 rounded-md ${className}`}>
      <div className="flex items-center space-x-2 mb-1">
        {icon}
        <span className="text-xs font-medium">{title}</span>
      </div>
      <div className="text-lg font-semibold">{value}</div>
    </div>
  );
}
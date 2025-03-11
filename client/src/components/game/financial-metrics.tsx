import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { ChevronUp, ChevronDown, Minus } from 'lucide-react';

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
    debtToIncomeRatio = debt / (income * 12),
    savingsRatio = income > 0 ? savings / income : 0
  } = metrics;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <MetricCard
        title="Monthly Income"
        value={formatCurrency(income)}
        icon={<ChevronUp className="text-green-500" />}
      />
      
      <MetricCard
        title="Monthly Expenses"
        value={formatCurrency(expenses)}
        icon={<ChevronDown className="text-red-500" />}
      />
      
      <MetricCard
        title="Current Savings"
        value={formatCurrency(savings)}
        icon={savings > 5000 ? <ChevronUp className="text-green-500" /> : <Minus className="text-yellow-500" />}
      />
      
      <MetricCard
        title="Current Debt"
        value={formatCurrency(debt)}
        icon={debt > 10000 ? <ChevronUp className="text-red-500" /> : <Minus className="text-yellow-500" />}
      />
      
      <MetricCard
        title="Monthly Balance"
        value={formatCurrency(monthlyBalance)}
        icon={monthlyBalance > 0 ? <ChevronUp className="text-green-500" /> : <ChevronDown className="text-red-500" />}
      />
      
      <MetricCard
        title="Debt-to-Income Ratio"
        value={`${(debtToIncomeRatio * 100).toFixed(1)}%`}
        icon={debtToIncomeRatio < 0.3 ? <ChevronDown className="text-green-500" /> : <ChevronUp className="text-red-500" />}
      />
      
      <MetricCard
        title="Savings Ratio"
        value={`${(savingsRatio * 100).toFixed(1)}%`}
        icon={savingsRatio > 0.2 ? <ChevronUp className="text-green-500" /> : <Minus className="text-yellow-500" />}
        className="md:col-span-2"
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
    <Card className={className}>
      <CardContent className="flex items-center justify-between p-4">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-semibold">{value}</h3>
        </div>
        <div className="h-8 w-8 flex items-center justify-center rounded-full bg-muted">
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}
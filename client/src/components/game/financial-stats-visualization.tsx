import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Coins, Wallet, PiggyBank, CreditCard } from 'lucide-react';

interface FinancialStatsVisualizationProps {
  income: number;
  expenses: number;
  savings: number;
  debt: number;
  savingsRatio?: number;
  debtToIncomeRatio?: number;
}

export function FinancialStatsVisualization({
  income,
  expenses,
  savings,
  debt,
  savingsRatio = 0,
  debtToIncomeRatio = 0
}: FinancialStatsVisualizationProps) {
  // Prepare data for bar chart
  const barData = [
    { name: 'Income', value: income, fill: '#22c55e' },
    { name: 'Expenses', value: expenses, fill: '#ef4444' },
    { name: 'Savings', value: savings, fill: '#3b82f6' },
    { name: 'Debt', value: debt, fill: '#f97316' }
  ];
  
  // Prepare data for income vs expenses pie chart
  const budgetData = [
    { name: 'Expenses', value: expenses, fill: '#ef4444' },
    { name: 'Remaining', value: Math.max(0, income - expenses), fill: '#22c55e' }
  ];
  
  // Prepare data for debt vs savings ratio
  const ratioData = [
    { name: 'Debt', value: debt, fill: '#f97316' },
    { name: 'Savings', value: savings, fill: '#3b82f6' }
  ];
  
  // Colors for the charts
  const COLORS = ['#ef4444', '#22c55e', '#3b82f6', '#f97316'];

  // Formatter for currency values
  const currencyFormatter = (value: number) => {
    return `£${value.toLocaleString()}`;
  };
  
  // Calculate metrics
  const monthlyBalance = income - expenses;
  const balanceClass = monthlyBalance >= 0 ? 'text-green-500' : 'text-red-500';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full space-y-4"
    >
      {/* Financial highlights cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 shadow-sm">
          <CardHeader className="p-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <Coins className="h-4 w-4 mr-2 text-green-500" />
              Income
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <p className="text-lg font-bold text-green-600 dark:text-green-400">£{income}</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 shadow-sm">
          <CardHeader className="p-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <Wallet className="h-4 w-4 mr-2 text-red-500" />
              Expenses
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <p className="text-lg font-bold text-red-600 dark:text-red-400">£{expenses}</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 shadow-sm">
          <CardHeader className="p-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <PiggyBank className="h-4 w-4 mr-2 text-blue-500" />
              Savings
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">£{savings}</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 shadow-sm">
          <CardHeader className="p-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <CreditCard className="h-4 w-4 mr-2 text-orange-500" />
              Debt
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <p className="text-lg font-bold text-orange-600 dark:text-orange-400">£{debt}</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Monthly balance card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-md">Monthly Balance</CardTitle>
          <CardDescription>The difference between your income and expenses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center">
            <p className={`text-2xl font-bold ${balanceClass}`}>
              {monthlyBalance >= 0 ? '+' : ''}{currencyFormatter(monthlyBalance)}
            </p>
          </div>
        </CardContent>
      </Card>
      
      {/* Financial charts */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-md">Financial Overview</CardTitle>
          <CardDescription>Visual representation of your finances</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview">
            <TabsList className="w-full mb-4">
              <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
              <TabsTrigger value="budget" className="flex-1">Budget</TabsTrigger>
              <TabsTrigger value="ratios" className="flex-1">Savings vs Debt</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={currencyFormatter} />
                    <Tooltip formatter={(value) => currencyFormatter(value as number)} />
                    <Bar dataKey="value" name="Value">
                      {barData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="budget">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={budgetData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {budgetData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => currencyFormatter(value as number)} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="text-center mt-2 text-sm text-muted-foreground">
                {monthlyBalance >= 0 
                  ? `You're saving ${((monthlyBalance / income) * 100).toFixed(0)}% of your income!` 
                  : 'Your expenses exceed your income. Consider cutting costs.'}
              </div>
            </TabsContent>
            
            <TabsContent value="ratios">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={ratioData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {ratioData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => currencyFormatter(value as number)} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="text-center mt-2 text-sm text-muted-foreground">
                {savings > debt 
                  ? 'Great job! Your savings exceed your debt.' 
                  : 'Your debt is higher than your savings. Focus on reducing debt while maintaining emergency savings.'}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
}
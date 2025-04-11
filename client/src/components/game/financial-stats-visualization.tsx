import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend, LineChart, Line } from 'recharts';
import { ChartBarIcon, ArrowUpDown, LineChart } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatCurrency } from '@/lib/utils';

interface FinancialStatsVisualizationProps {
  income: number;
  expenses: number;
  savings: number;
  debt: number;
  savingsRatio?: number;
  debtToIncomeRatio?: number;
  financialHistory?: {
    round: number;
    income: number;
    expenses: number;
    savings: number;
    debt: number;
  }[];
}

export function FinancialStatsVisualization({
  income,
  expenses,
  savings,
  debt,
  savingsRatio = 0,
  debtToIncomeRatio = 0,
  financialHistory = []
}: FinancialStatsVisualizationProps) {
  // Calculate monthly balance
  const monthlyBalance = income - expenses;

  // Format currency numbers for display
  const currencyFormatter = (value: number) => {
    return formatCurrency(value);
  };

  // Prepare data for bar chart
  const barData = [
    { name: 'Income', value: income, fill: '#10b981' },
    { name: 'Expenses', value: expenses, fill: '#ef4444' },
    { name: 'Savings', value: savings, fill: '#f59e0b' },
    { name: 'Debt', value: debt, fill: '#3b82f6' }
  ];

  // Prepare data for budget pie chart
  const budgetData = [
    { name: 'Expenses', value: expenses, fill: '#ef4444' },
    { name: 'Savings', value: monthlyBalance > 0 ? monthlyBalance : 0, fill: '#10b981' }
  ];

  // Prepare data for debt vs savings pie chart 
  const ratioData = [
    { name: 'Savings', value: savings, fill: '#f59e0b' },
    { name: 'Debt', value: debt, fill: '#3b82f6' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center">
            <ChartBarIcon className="h-5 w-5 text-primary mr-2" />
            Financial Metrics Visualization
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="budget">Budget</TabsTrigger>
              <TabsTrigger value="ratios">Debt vs Savings</TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
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
            
            <TabsContent value="trends">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={financialHistory} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="round" label={{ value: 'Round', position: 'insideBottom', offset: -5 }} />
                    <YAxis tickFormatter={currencyFormatter} label={{ value: 'Amount (£)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip formatter={(value) => currencyFormatter(value as number)} />
                    <Legend />
                    <Line type="monotone" dataKey="income" stroke="#10b981" name="Income" />
                    <Line type="monotone" dataKey="expenses" stroke="#ef4444" name="Expenses" />
                    <Line type="monotone" dataKey="savings" stroke="#f59e0b" name="Savings" />
                    <Line type="monotone" dataKey="debt" stroke="#3b82f6" name="Debt" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="text-center mt-2 text-sm text-muted-foreground">
                Track how your financial metrics change over each round of the game.
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
}
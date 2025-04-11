import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { PoundSterling, Home, ShoppingBag, Car, Bus, Coffee, Film, Utensils, Smartphone, Wifi, Umbrella, Gift, DollarSign, PiggyBank, ArrowRight, RefreshCw, Info, LucideIcon, CheckCircle, AlertTriangle, XCircle, ChevronUp, ChevronDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

// Define types for budget categories
interface BudgetCategory {
  id: string;
  name: string;
  description: string;
  value: number;
  recommended: number;
  color?: string;
  icon?: string;
}

// Initial categories
const INITIAL_CATEGORIES: BudgetCategory[] = [
  { id: "housing", name: "Housing", description: "Rent, mortgage, utilities, repairs", value: 35, recommended: 30, color: "#3b82f6", icon: "🏠" },
  { id: "transport", name: "Transportation", description: "Car payment, insurance, fuel, transit", value: 15, recommended: 15, color: "#10b981", icon: "🚗" },
  { id: "food", name: "Food", description: "Groceries, dining out, meal delivery", value: 15, recommended: 15, color: "#f59e0b", icon: "🍔" },
  { id: "savings", name: "Savings", description: "Emergency fund, investments, retirement", value: 10, recommended: 20, color: "#8b5cf6", icon: "💰" },
  { id: "debt", name: "Debt Repayment", description: "Credit cards, loans, other debts", value: 10, recommended: 10, color: "#ef4444", icon: "💳" },
  { id: "personal", name: "Personal", description: "Clothing, entertainment, hobbies", value: 10, recommended: 5, color: "#f97316", icon: "👕" },
  { id: "other", name: "Other", description: "Miscellaneous, gifts, donations", value: 5, recommended: 5, color: "#6b7280", icon: "🎁" },
];

// BudgetCalculator component
export function BudgetCalculator() {
  const [income, setIncome] = useState<number>(2500); // Default monthly income
  const [categories, setCategories] = useState<BudgetCategory[]>(INITIAL_CATEGORIES);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [showRecommendations, setShowRecommendations] = useState<boolean>(false);
  const { toast } = useToast();

  // Calculate remaining percentage and budget health
  const { remainingPercentage, budgetHealth, getBudgetHealthColor, chartData } = useMemo(() => {
    const totalAllocated = categories.reduce((sum, category) => sum + category.value, 0);
    const remaining = 100 - totalAllocated;
    const savingsRate = categories.find(c => c.id === 'savings')?.value || 0;
    const debtRate = categories.find(c => c.id === 'debt')?.value || 0;
    const housingRate = categories.find(c => c.id === 'housing')?.value || 0;
    
    let health: 'good' | 'average' | 'poor' = 'poor';
    let colorClass = 'border-red-500/20 bg-red-500/5 text-red-500';
    
    if (remaining === 0) {
      if (savingsRate >= 15 && debtRate >= 10 && housingRate <= 35) {
        health = 'good';
        colorClass = 'border-green-500/20 bg-green-500/5 text-green-500';
      } else if (savingsRate >= 10 && housingRate <= 40) {
        health = 'average';
        colorClass = 'border-amber-500/20 bg-amber-500/5 text-amber-500';
      }
    }
    
    // Prepare chart data
    const data = categories.map(category => ({
      name: category.name,
      value: category.value,
      color: category.color,
      amount: (category.value / 100) * income
    }));
    
    return { 
      remainingPercentage: remaining, 
      budgetHealth: health, 
      getBudgetHealthColor: () => colorClass,
      chartData: data
    };
  }, [categories, income]);

  // Handle income change
  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setIncome(value >= 0 ? value : 0);
  };

  // Handle category value change
  const handleCategoryChange = (categoryId: string, value: number[]) => {
    const newValue = value[0] !== undefined ? Math.max(0, Math.min(100, Math.round(value[0]))) : 0;
    setCategories(prev => 
      prev.map(cat => 
        cat.id === categoryId ? { ...cat, value: newValue } : cat
      )
    );
    setShowResults(false);
  };

  // Reset to recommended values
  const resetToRecommended = () => {
    setCategories(prev => 
      prev.map(cat => ({ ...cat, value: cat.recommended }))
    );
    setShowResults(false);
    toast({
      title: "Reset to Recommended",
      description: "Budget allocations have been reset to recommended values.",
      variant: "default"
    });
  };

  // Toggle recommendations visibility
  const toggleRecommendations = () => {
    setShowRecommendations(!showRecommendations);
  };

  // Calculate budget
  const calculateBudget = () => {
    if (remainingPercentage !== 0) {
      toast({
        title: "Budget Incomplete",
        description: `Your allocations must total exactly 100%. You have ${Math.abs(remainingPercentage)}% ${remainingPercentage > 0 ? 'unallocated' : 'over-allocated'}. Adjust your categories to reach 100%.`,
        variant: "destructive"
      });
      return;
    }
    
    setShowResults(true);
    
    // Calculate budget health and show toast
    let toastTitle = "";
    let toastDescription = "";
    
    switch (budgetHealth) {
      case 'good':
        toastTitle = "Excellent Budget!";
        toastDescription = "Your budget is well-balanced with a good savings rate. Keep up the great work!";
        break;
      case 'average':
        toastTitle = "Decent Budget";
        toastDescription = "Your budget is reasonable, but consider increasing your savings for better financial health.";
        break;
      case 'poor':
        toastTitle = "Budget Needs Improvement";
        toastDescription = "Consider reducing some expenses to increase your savings and improve your budget health.";
        break;
    }
    
    toast({
      title: toastTitle,
      description: toastDescription,
      variant: budgetHealth === 'poor' ? "destructive" : (budgetHealth === 'average' ? "default" : "default")
    });
  };

  // Get budget recommendations
  const getBudgetRecommendations = () => {
    const savingsRate = categories.find(c => c.id === 'savings')?.value || 0;
    const housingRate = categories.find(c => c.id === 'housing')?.value || 0;
    const debtRate = categories.find(c => c.id === 'debt')?.value || 0;
    const recommendations: string[] = [];
    
    if (savingsRate < 15) {
      recommendations.push("Aim to save at least 15-20% of your income for financial security and future goals.");
    }
    if (housingRate > 35) {
      recommendations.push("Housing costs should ideally be under 30-35% of income. Consider ways to reduce this if possible.");
    }
    if (debtRate < 10 && debtRate > 0) {
      recommendations.push("Try to allocate at least 10% to debt repayment to pay it off faster and save on interest.");
    }
    recommendations.push("Review discretionary spending (personal, entertainment) to find potential savings.");
    recommendations.push("Consider the 50/30/20 rule: 50% needs, 30% wants, 20% savings/debt repayment.");
    
    return recommendations;
  };
  
  return (
    <Card className="w-full shadow-lg border-2">
      <CardHeader className="p-6">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl font-semibold flex items-center">
              <PoundSterling className="mr-2 h-5 w-5 text-primary" />
              Budget Calculator
            </CardTitle>
            <CardDescription>
              Allocate your monthly income across different categories
            </CardDescription>
          </div>
          <Badge 
            variant="secondary"
            className={`${getBudgetHealthColor()} transition-colors cursor-help`}
          >
            Budget Health: {budgetHealth.charAt(0).toUpperCase() + budgetHealth.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          {/* Income Input */}
          <div className="grid gap-2">
            <Label htmlFor="income" className="font-medium flex items-center">
              <DollarSign className="h-4 w-4 mr-1 text-primary" />
              Monthly Income (after tax)
            </Label>
            <div className="flex gap-2">
              <div className="relative">
                <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input 
                  id="income"
                  type="number"
                  value={income}
                  onChange={handleIncomeChange}
                  className="pl-10"
                  min={0}
                />
              </div>
              <Button 
                variant="outline" 
                onClick={resetToRecommended}
                className="gap-1"
                title="Reset to recommended allocations"
              >
                <RefreshCw className="h-4 w-4" />
                Reset
              </Button>
            </div>
          </div>
          
          {/* Budget Categories */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Budget Categories</h3>
              <Badge variant={remainingPercentage === 0 ? "outline" : "destructive"}>
                {remainingPercentage > 0 
                  ? `${remainingPercentage}% Unallocated` 
                  : remainingPercentage < 0 
                    ? `${Math.abs(remainingPercentage)}% Over-allocated` 
                    : "Budget Balanced"}
              </Badge>
            </div>
            
            <div className="space-y-4">
              {categories.map((category) => (
                <div key={category.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="font-medium flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: category.color + '20' }}>
                        <div className="text-xs" style={{ color: category.color }}>{category.icon}</div>
                      </div>
                      <span>{category.name}</span>
                      <Badge variant="outline" className="ml-2 text-xs font-normal">{category.value}%</Badge>
                    </Label>
                    <span className="text-sm font-semibold">
                      £{((category.value / 100) * income).toFixed(0)}
                    </span>
                  </div>
                  <div className="grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-10">
                      <Slider
                        defaultValue={[category.value]}
                        max={100}
                        step={1}
                        onValueChange={(value) => handleCategoryChange(category.id, value)}
                        className="cursor-pointer"
                      />
                    </div>
                    <div className="col-span-2">
                      <Button 
                        variant="ghost" 
                        className="h-8 w-full text-xs" 
                        onClick={() => handleCategoryChange(category.id, [category.recommended])}
                      >
                        {category.recommended}%
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{category.description}</p>
                </div>
              ))}
            </div>
          </div>
          
          <Button 
            onClick={calculateBudget} 
            className="w-full gap-2"
            size="lg"
            variant={remainingPercentage === 0 ? "default" : "secondary"}
            disabled={remainingPercentage !== 0}
          >
            Calculate Budget <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
      
      {showResults && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3 }}
        >
          <CardContent className="pt-0">
            <h3 className="font-medium mb-4">Budget Breakdown</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value, name, props) => [`£${props.payload.amount.toFixed(0)} (${value}%)`, name]}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card className="bg-slate-50 dark:bg-slate-900">
                    <CardContent className="p-4 flex flex-col items-center justify-center">
                      <p className="text-sm text-slate-500 dark:text-slate-400">Total Monthly Income</p>
                      <p className="text-2xl font-bold">£{income.toFixed(0)}</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-slate-50 dark:bg-slate-900">
                    <CardContent className="p-4 flex flex-col items-center justify-center">
                      <p className="text-sm text-slate-500 dark:text-slate-400">Monthly Savings</p>
                      <p className="text-2xl font-bold text-blue-600">
                        £{((categories.find(c => c.id === 'savings')?.value || 0) / 100 * income).toFixed(0)}
                      </p>
                    </CardContent>
                  </Card>
                </div>
                
                <Card className="border border-primary/20">
                  <CardHeader className="py-3 px-4">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-sm font-medium flex items-center">
                        <Info className="h-4 w-4 mr-2 text-primary" />
                        Budget Recommendations
                      </CardTitle>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={toggleRecommendations}
                        className="h-8 w-8 p-0"
                      >
                        {showRecommendations ? '−' : '+'}
                      </Button>
                    </div>
                  </CardHeader>
                  {showRecommendations && (
                    <CardContent className="py-3 px-4">
                      <ul className="space-y-2 text-sm">
                        {getBudgetRecommendations().map((recommendation, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-primary">•</span>
                            <span>{recommendation}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  )}
                </Card>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-2 pt-0">
            <div className="text-sm text-slate-500 dark:text-slate-400 italic mt-2">
              <p>Note: This calculator is for educational purposes only and should not be considered financial advice.</p>
            </div>
          </CardFooter>
        </motion.div>
      )}
    </Card>
  );
}

function getBudgetHealthMessage(budgetHealth: string): string {
  switch (budgetHealth) {
    case 'good':
      return "Your budget is well-balanced with a good savings rate. Keep up the great work!";
    case 'average':
      return "Your budget is reasonable, but consider increasing your savings for better financial health.";
    case 'poor':
      return "Consider reducing some expenses to increase your savings and improve your budget health.";
    default:
      return "";
  }
}
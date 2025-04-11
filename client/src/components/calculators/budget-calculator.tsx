import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { motion } from 'framer-motion';
import { PoundSterling, Home, ShoppingBag, Car, Bus, Coffee, Film, Utensils, Smartphone, 
  Wifi, Umbrella, Gift, DollarSign, PiggyBank, ArrowRight, RefreshCw, Info, LucideIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

// Define budget categories with UK-specific names
interface BudgetCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  recommended: number; // Recommended percentage for this category
  description: string;
  value: number;
}

const INITIAL_CATEGORIES: BudgetCategory[] = [
  { 
    id: 'housing', 
    name: 'Housing & Utilities', 
    icon: <Home className="h-4 w-4" />, 
    color: '#2563EB', 
    recommended: 35,
    description: 'Rent/mortgage, council tax, water, electricity, gas, etc.',
    value: 35
  },
  { 
    id: 'groceries', 
    name: 'Groceries', 
    icon: <ShoppingBag className="h-4 w-4" />, 
    color: '#16A34A', 
    recommended: 15,
    description: 'Food, household supplies, etc.',
    value: 15 
  },
  { 
    id: 'transport', 
    name: 'Transport', 
    icon: <Bus className="h-4 w-4" />, 
    color: '#CA8A04', 
    recommended: 10,
    description: 'Public transport, fuel, car maintenance, insurance, etc.',
    value: 10 
  },
  { 
    id: 'entertainment', 
    name: 'Entertainment', 
    icon: <Film className="h-4 w-4" />, 
    color: '#DC2626', 
    recommended: 10,
    description: 'Eating out, cinema, hobbies, subscriptions, etc.',
    value: 10 
  },
  { 
    id: 'communication', 
    name: 'Communication', 
    icon: <Smartphone className="h-4 w-4" />, 
    color: '#7C3AED', 
    recommended: 5,
    description: 'Mobile phone, internet, etc.',
    value: 5 
  },
  { 
    id: 'insurance', 
    name: 'Insurance', 
    icon: <Umbrella className="h-4 w-4" />, 
    color: '#0891B2', 
    recommended: 5,
    description: 'Health insurance, life insurance, contents insurance, etc.',
    value: 5 
  },
  { 
    id: 'personal', 
    name: 'Personal', 
    icon: <Gift className="h-4 w-4" />, 
    color: '#DB2777', 
    recommended: 5,
    description: 'Clothing, personal care, etc.',
    value: 5 
  },
  { 
    id: 'savings', 
    name: 'Savings & Investments', 
    icon: <PiggyBank className="h-4 w-4" />, 
    color: '#4F46E5', 
    recommended: 15,
    description: 'Emergency fund, ISAs, pension contributions, etc.',
    value: 15 
  }
];

export function BudgetCalculator() {
  const { toast } = useToast();
  const [income, setIncome] = useState<number>(2500); // Default monthly income in GBP
  const [categories, setCategories] = useState<BudgetCategory[]>(INITIAL_CATEGORIES);
  const [remainingPercentage, setRemainingPercentage] = useState<number>(0);
  const [budgetHealth, setBudgetHealth] = useState<'poor' | 'average' | 'good'>('average');
  const [showResults, setShowResults] = useState<boolean>(false);
  const [showRecommendations, setShowRecommendations] = useState<boolean>(false);
  
  // Recalculate remaining percentage whenever categories change
  useEffect(() => {
    const totalAllocated = categories.reduce((sum, category) => sum + category.value, 0);
    const newRemainingPercentage = 100 - totalAllocated;
    setRemainingPercentage(newRemainingPercentage);
    
    // Calculate budget health
    const savingsCategory = categories.find(cat => cat.id === 'savings');
    const savingsPercentage = savingsCategory ? savingsCategory.value : 0;
    const housingCategory = categories.find(cat => cat.id === 'housing');
    const housingPercentage = housingCategory ? housingCategory.value : 0;
    
    if (savingsPercentage >= 20 && housingPercentage <= 30 && newRemainingPercentage >= 0) {
      setBudgetHealth('good');
    } else if (savingsPercentage >= 10 && housingPercentage <= 40 && newRemainingPercentage >= 0) {
      setBudgetHealth('average');
    } else {
      setBudgetHealth('poor');
    }
  }, [categories]);
  
  // Handle slider change
  const handleCategoryChange = (categoryId: string, newValue: number[]) => {
    const updatedCategories = categories.map(category => {
      if (category.id === categoryId) {
        return { ...category, value: newValue[0] };
      }
      return category;
    });
    
    setCategories(updatedCategories);
  };
  
  // Handle income change
  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newIncome = Number(e.target.value);
    if (!isNaN(newIncome) && newIncome >= 0) {
      setIncome(newIncome);
    }
  };
  
  // Reset to recommended allocations
  const resetToRecommended = () => {
    const recommendedCategories = categories.map(category => ({
      ...category,
      value: category.recommended
    }));
    
    setCategories(recommendedCategories);
    toast({
      title: "Budget Reset",
      description: "Your budget has been reset to recommended allocations.",
      variant: "default"
    });
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
  
  // Prepare data for chart
  const chartData = categories.map(category => ({
    name: category.name,
    value: category.value,
    color: category.color,
    amount: (category.value / 100) * income
  }));
  
  // Get budget health color
  const getBudgetHealthColor = () => {
    switch (budgetHealth) {
      case 'good': return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'average': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'poor': return 'bg-red-100 text-red-800 hover:bg-red-200';
      default: return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };
  
  // Generate budget recommendations
  const getBudgetRecommendations = () => {
    const recommendations = [];
    
    // Check savings rate
    const savingsCategory = categories.find(cat => cat.id === 'savings');
    if (savingsCategory && savingsCategory.value < 15) {
      recommendations.push("Consider increasing your savings rate to at least 15-20% of your income for long-term financial health.");
    }
    
    // Check housing costs
    const housingCategory = categories.find(cat => cat.id === 'housing');
    if (housingCategory && housingCategory.value > 40) {
      recommendations.push("Your housing costs are high. The recommended percentage is 30-35% of your income.");
    }
    
    // Check entertainment spending
    const entertainmentCategory = categories.find(cat => cat.id === 'entertainment');
    if (entertainmentCategory && entertainmentCategory.value > 15) {
      recommendations.push("Your entertainment spending is higher than recommended. Consider reducing it to 10-15% of your income.");
    }
    
    // Add a general recommendation if none specific
    if (recommendations.length === 0) {
      recommendations.push("Your budget looks well-balanced! Continue to monitor and adjust as your financial situation changes.");
    }
    
    return recommendations;
  };
  
  const toggleRecommendations = () => {
    setShowRecommendations(!showRecommendations);
  };
  
  return (
    <Card className="w-full shadow-lg border-2">
      <CardHeader className="bg-slate-50 dark:bg-slate-900">
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
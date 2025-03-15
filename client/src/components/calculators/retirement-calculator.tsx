import React, { useState } from 'react';
import { PoundSterling, ArrowRight, RefreshCw, Calendar, LineChart, BarChart4, Briefcase } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatCurrency } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart, 
  Pie,
  Cell
} from 'recharts';

export function RetirementCalculator() {
  // Current state inputs
  const [currentAge, setCurrentAge] = useState<number>(30);
  const [retirementAge, setRetirementAge] = useState<number>(67);
  const [currentSavings, setCurrentSavings] = useState<number>(50000);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(500);
  const [expectedAnnualReturn, setExpectedAnnualReturn] = useState<number>(6);
  const [inflationRate, setInflationRate] = useState<number>(2);
  const [desiredAnnualIncome, setDesiredAnnualIncome] = useState<number>(30000);
  const [stateRetirementAge, setStateRetirementAge] = useState<number>(67);
  const [statePensionWeekly, setStatePensionWeekly] = useState<number>(179.60);
  const [lifeExpectancy, setLifeExpectancy] = useState<number>(85);
  
  // Results
  const [retirementResults, setRetirementResults] = useState<RetirementResult | null>(null);
  
  interface RetirementResult {
    projectedSavings: number;
    incomeFromSavings: number;
    statePensionAnnual: number;
    totalAnnualIncome: number;
    incomeGap: number;
    savingsDepletion: number;
    yearsOfIncome: number;
    projectedBalances: {
      age: number;
      savingsBalance: number;
    }[];
    incomeBreakdown: {
      name: string;
      value: number;
      color: string;
    }[];
  }
  
  const calculateRetirement = () => {
    // Initialize variables for calculation
    let currentBalance = currentSavings;
    const yearsToRetirement = retirementAge - currentAge;
    const annualContribution = monthlyContribution * 12;
    const realReturnRate = (1 + expectedAnnualReturn / 100) / (1 + inflationRate / 100) - 1;
    
    // Calculate future value of savings at retirement
    let projectedSavings = currentBalance;
    const projectedBalances = [{ age: currentAge, savingsBalance: currentBalance }];
    
    for (let i = 1; i <= yearsToRetirement; i++) {
      projectedSavings = projectedSavings * (1 + expectedAnnualReturn / 100) + annualContribution;
      projectedBalances.push({
        age: currentAge + i,
        savingsBalance: projectedSavings
      });
    }
    
    // State pension calculation
    const statePensionYearsBeforeRetirement = Math.max(0, stateRetirementAge - retirementAge);
    const statePensionAnnual = statePensionWeekly * 52;
    
    // Estimated withdrawal rate (4% rule)
    const withdrawalRate = 0.04;
    const incomeFromSavings = projectedSavings * withdrawalRate;
    
    // Calculate total income and any income gap
    const totalAnnualIncome = incomeFromSavings + (statePensionYearsBeforeRetirement <= 0 ? statePensionAnnual : 0);
    const incomeGap = Math.max(0, desiredAnnualIncome - totalAnnualIncome);
    
    // Years until savings depletion (assuming fixed real withdrawals)
    let yearsOfIncome = 0;
    if (incomeFromSavings > 0) {
      const realAnnualWithdrawal = desiredAnnualIncome - (statePensionYearsBeforeRetirement <= 0 ? statePensionAnnual : 0);
      if (realAnnualWithdrawal <= incomeFromSavings) {
        yearsOfIncome = 30; // Effectively indefinite with the 4% rule
      } else {
        let tempBalance = projectedSavings;
        while (tempBalance > 0 && yearsOfIncome < 50) {
          tempBalance = tempBalance * (1 + realReturnRate) - realAnnualWithdrawal;
          yearsOfIncome++;
        }
      }
    }
    
    // Age at which savings are depleted
    const savingsDepletion = retirementAge + yearsOfIncome;
    
    // Income breakdown for pie chart
    const incomeBreakdown = [
      {
        name: 'Income from Savings',
        value: incomeFromSavings,
        color: '#10b981'
      },
      {
        name: 'State Pension',
        value: statePensionYearsBeforeRetirement <= 0 ? statePensionAnnual : 0,
        color: '#3b82f6'
      }
    ];
    
    // If there's an income gap, add it to the breakdown
    if (incomeGap > 0) {
      incomeBreakdown.push({
        name: 'Income Gap',
        value: incomeGap,
        color: '#ef4444'
      });
    }
    
    // Set results
    setRetirementResults({
      projectedSavings,
      incomeFromSavings,
      statePensionAnnual,
      totalAnnualIncome,
      incomeGap,
      savingsDepletion,
      yearsOfIncome,
      projectedBalances,
      incomeBreakdown
    });
  };
  
  const resetForm = () => {
    setCurrentAge(30);
    setRetirementAge(67);
    setCurrentSavings(50000);
    setMonthlyContribution(500);
    setExpectedAnnualReturn(6);
    setInflationRate(2);
    setDesiredAnnualIncome(30000);
    setStateRetirementAge(67);
    setStatePensionWeekly(179.60);
    setLifeExpectancy(85);
    setRetirementResults(null);
  };
  
  return (
    <Tabs defaultValue="calculator" className="w-full">
      <TabsList className="grid grid-cols-2 w-full max-w-md mb-6">
        <TabsTrigger value="calculator" className="flex items-center gap-2">
          <LineChart className="h-4 w-4" />
          <span>Calculator</span>
        </TabsTrigger>
        <TabsTrigger value="assumptions" className="flex items-center gap-2">
          <BarChart4 className="h-4 w-4" />
          <span>Assumptions</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="calculator" className="mt-0 space-y-6">
        {/* Current Situation */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="currentAge" className="font-medium flex items-center">
                <Calendar className="h-4 w-4 mr-1 text-primary" />
                Current Age
              </Label>
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Input
                      id="currentAge"
                      type="number"
                      value={currentAge}
                      onChange={(e) => setCurrentAge(Number(e.target.value))}
                      min={18}
                      max={75}
                    />
                  </div>
                  <span className="font-medium">{currentAge} years old</span>
                </div>
                <Slider
                  value={[currentAge]}
                  min={18}
                  max={75}
                  step={1}
                  onValueChange={(value) => setCurrentAge(value[0])}
                />
                <div className="flex justify-between text-xs text-slate-500">
                  <span>18</span>
                  <span>75</span>
                </div>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="retirementAge" className="font-medium flex items-center">
                <Briefcase className="h-4 w-4 mr-1 text-primary" />
                Retirement Age
              </Label>
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Input
                      id="retirementAge"
                      type="number"
                      value={retirementAge}
                      onChange={(e) => setRetirementAge(Number(e.target.value))}
                      min={Math.max(currentAge + 1, 55)}
                      max={80}
                    />
                  </div>
                  <span className="font-medium">{retirementAge} years old</span>
                </div>
                <Slider
                  value={[retirementAge]}
                  min={Math.max(currentAge + 1, 55)}
                  max={80}
                  step={1}
                  onValueChange={(value) => setRetirementAge(value[0])}
                />
                <div className="flex justify-between text-xs text-slate-500">
                  <span>{Math.max(currentAge + 1, 55)}</span>
                  <span>80</span>
                </div>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="currentSavings" className="font-medium flex items-center">
                <PoundSterling className="h-4 w-4 mr-1 text-primary" />
                Current Retirement Savings
              </Label>
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      id="currentSavings"
                      type="number"
                      value={currentSavings}
                      onChange={(e) => setCurrentSavings(Number(e.target.value))}
                      className="pl-10"
                      min={0}
                      max={1000000}
                    />
                  </div>
                  <span className="font-medium">{formatCurrency(currentSavings)}</span>
                </div>
                <Slider
                  value={[currentSavings]}
                  min={0}
                  max={1000000}
                  step={1000}
                  onValueChange={(value) => setCurrentSavings(value[0])}
                />
                <div className="flex justify-between text-xs text-slate-500">
                  <span>£0</span>
                  <span>£1,000,000</span>
                </div>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="monthlyContribution" className="font-medium flex items-center">
                <PoundSterling className="h-4 w-4 mr-1 text-primary" />
                Monthly Contribution
              </Label>
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      id="monthlyContribution"
                      type="number"
                      value={monthlyContribution}
                      onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                      className="pl-10"
                      min={0}
                      max={5000}
                    />
                  </div>
                  <span className="font-medium">{formatCurrency(monthlyContribution)} / month</span>
                </div>
                <Slider
                  value={[monthlyContribution]}
                  min={0}
                  max={5000}
                  step={50}
                  onValueChange={(value) => setMonthlyContribution(value[0])}
                />
                <div className="flex justify-between text-xs text-slate-500">
                  <span>£0</span>
                  <span>£5,000</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="expectedAnnualReturn" className="font-medium flex items-center">
                <LineChart className="h-4 w-4 mr-1 text-primary" />
                Expected Annual Return (%)
              </Label>
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Input
                      id="expectedAnnualReturn"
                      type="number"
                      value={expectedAnnualReturn}
                      onChange={(e) => setExpectedAnnualReturn(Number(e.target.value))}
                      min={1}
                      max={15}
                      step={0.1}
                    />
                  </div>
                  <span className="font-medium">{expectedAnnualReturn}%</span>
                </div>
                <Slider
                  value={[expectedAnnualReturn]}
                  min={1}
                  max={15}
                  step={0.1}
                  onValueChange={(value) => setExpectedAnnualReturn(value[0])}
                />
                <div className="flex justify-between text-xs text-slate-500">
                  <span>1%</span>
                  <span>15%</span>
                </div>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="inflationRate" className="font-medium flex items-center">
                <BarChart4 className="h-4 w-4 mr-1 text-primary" />
                Inflation Rate (%)
              </Label>
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Input
                      id="inflationRate"
                      type="number"
                      value={inflationRate}
                      onChange={(e) => setInflationRate(Number(e.target.value))}
                      min={0}
                      max={10}
                      step={0.1}
                    />
                  </div>
                  <span className="font-medium">{inflationRate}%</span>
                </div>
                <Slider
                  value={[inflationRate]}
                  min={0}
                  max={10}
                  step={0.1}
                  onValueChange={(value) => setInflationRate(value[0])}
                />
                <div className="flex justify-between text-xs text-slate-500">
                  <span>0%</span>
                  <span>10%</span>
                </div>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="desiredAnnualIncome" className="font-medium flex items-center">
                <PoundSterling className="h-4 w-4 mr-1 text-primary" />
                Desired Annual Retirement Income
              </Label>
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      id="desiredAnnualIncome"
                      type="number"
                      value={desiredAnnualIncome}
                      onChange={(e) => setDesiredAnnualIncome(Number(e.target.value))}
                      className="pl-10"
                      min={0}
                      max={200000}
                    />
                  </div>
                  <span className="font-medium">{formatCurrency(desiredAnnualIncome)} / year</span>
                </div>
                <Slider
                  value={[desiredAnnualIncome]}
                  min={0}
                  max={200000}
                  step={1000}
                  onValueChange={(value) => setDesiredAnnualIncome(value[0])}
                />
                <div className="flex justify-between text-xs text-slate-500">
                  <span>£0</span>
                  <span>£200,000</span>
                </div>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="lifeExpectancy" className="font-medium flex items-center">
                <Calendar className="h-4 w-4 mr-1 text-primary" />
                Life Expectancy
              </Label>
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Input
                      id="lifeExpectancy"
                      type="number"
                      value={lifeExpectancy}
                      onChange={(e) => setLifeExpectancy(Number(e.target.value))}
                      min={Math.max(retirementAge + 1, 70)}
                      max={110}
                    />
                  </div>
                  <span className="font-medium">{lifeExpectancy} years old</span>
                </div>
                <Slider
                  value={[lifeExpectancy]}
                  min={Math.max(retirementAge + 1, 70)}
                  max={110}
                  step={1}
                  onValueChange={(value) => setLifeExpectancy(value[0])}
                />
                <div className="flex justify-between text-xs text-slate-500">
                  <span>{Math.max(retirementAge + 1, 70)}</span>
                  <span>110</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            onClick={calculateRetirement}
            className="flex-1 gap-2"
            size="lg"
          >
            Calculate Retirement <ArrowRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            onClick={resetForm}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" /> Reset
          </Button>
        </div>
        
        {/* Results */}
        {retirementResults && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3 }}
            className="border-t pt-6 mt-6"
          >
            <h3 className="text-xl font-semibold mb-6">Your Retirement Projection</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card className="bg-slate-50 dark:bg-slate-900">
                <CardContent className="p-4 flex flex-col items-center justify-center h-32">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Projected Savings at Retirement</p>
                  <p className="text-2xl font-bold text-primary">{formatCurrency(retirementResults.projectedSavings)}</p>
                  <p className="text-xs text-slate-400">At age {retirementAge}</p>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-50 dark:bg-slate-900">
                <CardContent className="p-4 flex flex-col items-center justify-center h-32">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Annual Retirement Income</p>
                  <p className="text-2xl font-bold">{formatCurrency(retirementResults.totalAnnualIncome)}</p>
                  <p className="text-xs text-slate-400 flex items-center gap-1">
                    {retirementResults.incomeGap > 0 
                      ? <span className="text-red-500 flex items-center gap-1">Gap: {formatCurrency(retirementResults.incomeGap)}</span>
                      : <span className="text-green-500">Meets your goal</span>
                    }
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-50 dark:bg-slate-900">
                <CardContent className="p-4 flex flex-col items-center justify-center h-32">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Years of Income</p>
                  <p className="text-2xl font-bold">{retirementResults.yearsOfIncome}</p>
                  <p className="text-xs text-slate-400">
                    {retirementResults.yearsOfIncome >= 30 
                      ? "Sustainable" 
                      : `Until age ${retirementResults.savingsDepletion}`}
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium">Savings Growth Over Time</h4>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={retirementResults.projectedBalances}
                      margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="age" 
                        label={{ 
                          value: 'Age', 
                          position: 'insideBottomRight', 
                          offset: -10 
                        }} 
                      />
                      <YAxis
                        tickFormatter={(value) => `£${(value / 1000).toFixed(0)}k`}
                        label={{
                          value: 'Savings (£)',
                          angle: -90,
                          position: 'insideLeft',
                        }}
                      />
                      <Tooltip
                        formatter={(value) => [`£${Number(value).toFixed(2)}`, '']}
                        labelFormatter={(label) => `Age ${label}`}
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="savingsBalance"
                        name="Savings Balance"
                        stroke="#10b981"
                        fill="#10b981"
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium">Retirement Income Breakdown</h4>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={retirementResults.incomeBreakdown}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {retirementResults.incomeBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [formatCurrency(Number(value)), '']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-md mt-6">
              <h4 className="text-amber-800 font-medium mb-2 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                </svg>
                Important Disclaimer
              </h4>
              <p className="text-sm text-amber-700">
                This calculator provides estimates based on the information you provide and general assumptions. 
                Actual results may vary based on market conditions, tax changes, and other factors. 
                This tool is for educational purposes only and should not be considered financial advice. 
                We recommend consulting with a qualified financial advisor for personalized retirement planning.
              </p>
            </div>
          </motion.div>
        )}
      </TabsContent>
      
      <TabsContent value="assumptions" className="mt-0 space-y-6">
        <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-6 border">
          <h3 className="text-lg font-semibold mb-4">UK State Pension Assumptions</h3>
          
          <div className="space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="stateRetirementAge" className="font-medium flex items-center">
                <Calendar className="h-4 w-4 mr-1 text-primary" />
                State Pension Age
              </Label>
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Input
                      id="stateRetirementAge"
                      type="number"
                      value={stateRetirementAge}
                      onChange={(e) => setStateRetirementAge(Number(e.target.value))}
                      min={65}
                      max={80}
                    />
                  </div>
                  <span className="font-medium">{stateRetirementAge} years old</span>
                </div>
                <Slider
                  value={[stateRetirementAge]}
                  min={65}
                  max={80}
                  step={1}
                  onValueChange={(value) => setStateRetirementAge(value[0])}
                />
                <div className="flex justify-between text-xs text-slate-500">
                  <span>65</span>
                  <span>80</span>
                </div>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="statePensionWeekly" className="font-medium flex items-center">
                <PoundSterling className="h-4 w-4 mr-1 text-primary" />
                Weekly State Pension Amount
              </Label>
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      id="statePensionWeekly"
                      type="number"
                      value={statePensionWeekly}
                      onChange={(e) => setStatePensionWeekly(Number(e.target.value))}
                      className="pl-10"
                      min={0}
                      max={500}
                      step={0.1}
                    />
                  </div>
                  <span className="font-medium">£{statePensionWeekly.toFixed(2)} / week</span>
                </div>
                <Slider
                  value={[statePensionWeekly]}
                  min={0}
                  max={500}
                  step={1}
                  onValueChange={(value) => setStatePensionWeekly(value[0])}
                />
                <div className="flex justify-between text-xs text-slate-500">
                  <span>£0</span>
                  <span>£500</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                The current UK full State Pension is £179.60 per week (2021/22). You may receive more or less based on your National Insurance contributions.
              </p>
            </div>
          </div>
          
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Calculation Methodology</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">The 4% Rule</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  This calculator uses the generally accepted "4% rule" for sustainable withdrawals, which suggests withdrawing 4% of your savings in the first year of retirement, and then adjusting that amount for inflation in subsequent years.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium">Inflation Adjustment</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  All projections account for your specified inflation rate, showing results in today's money (real terms) rather than future nominal values.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium">Tax Considerations</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  This calculator provides pre-tax estimates. Remember that different retirement income sources (private pensions, ISAs, state pension) have different tax treatments in the UK.
                </p>
              </div>
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
import React, { useState } from 'react';
import { PoundSterling, ArrowRight, RefreshCw, Building, Home, Car, FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { formatCurrency } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export function TaxCalculator() {
  // Income Tax inputs
  const [salaryIncome, setSalaryIncome] = useState<number>(35000);
  const [additionalIncome, setAdditionalIncome] = useState<number>(0);
  const [pensionContribution, setPensionContribution] = useState<number>(5);
  const [studentLoan, setStudentLoan] = useState<boolean>(false);
  const [studentLoanPlan, setStudentLoanPlan] = useState<string>("plan2");
  const [taxYear, setTaxYear] = useState<string>("2023-2024");
  
  // Results
  const [taxResults, setTaxResults] = useState<TaxResult | null>(null);
  
  // Tax brackets for 2023-2024
  const taxBrackets2023 = {
    personal: 12570,
    basic: {
      min: 12571,
      max: 50270,
      rate: 0.2
    },
    higher: {
      min: 50271,
      max: 125140,
      rate: 0.4
    },
    additional: {
      min: 125141,
      max: Infinity,
      rate: 0.45
    }
  };
  
  // National Insurance brackets for 2023-2024
  const niBrackets2023 = {
    primary: {
      min: 12570,
      max: 50270,
      rate: 0.12
    },
    upper: {
      min: 50271,
      max: Infinity,
      rate: 0.02
    }
  };
  
  // Student loan thresholds
  const studentLoanThresholds = {
    plan1: { threshold: 22015, rate: 0.09 },
    plan2: { threshold: 27295, rate: 0.09 },
    plan4: { threshold: 27660, rate: 0.09 },
    postgrad: { threshold: 21000, rate: 0.06 }
  };
  
  interface TaxResult {
    grossIncome: number;
    netIncome: number;
    incomeTax: number;
    nationalInsurance: number;
    studentLoanRepayment: number;
    pensionContribution: number;
    pensionTaxRelief: number;
    effectiveTaxRate: number;
    basicRateTax: number;
    higherRateTax: number;
    additionalRateTax: number;
    takeHomePay: number;
    monthlyTakeHome: number;
    weeklyTakeHome: number;
    taxBreakdown: {
      name: string;
      value: number;
      color: string;
    }[];
    incomeBreakdown: {
      name: string;
      value: number;
      color: string;
    }[];
  }
  
  const calculateTax = () => {
    // Calculate total gross income
    const grossIncome = salaryIncome + additionalIncome;
    
    // Calculate pension contribution amount
    const pensionAmount = grossIncome * (pensionContribution / 100);
    
    // Calculate taxable income after pension
    const taxableIncome = grossIncome - pensionAmount;
    
    // Calculate Income Tax
    let incomeTax = 0;
    let basicRateTax = 0;
    let higherRateTax = 0;
    let additionalRateTax = 0;
    
    if (taxableIncome > taxBrackets2023.personal) {
      // Basic rate tax
      const basicRateAmount = Math.min(taxableIncome, taxBrackets2023.basic.max) - taxBrackets2023.personal;
      if (basicRateAmount > 0) {
        basicRateTax = basicRateAmount * taxBrackets2023.basic.rate;
        incomeTax += basicRateTax;
      }
      
      // Higher rate tax
      const higherRateAmount = Math.min(taxableIncome, taxBrackets2023.higher.max) - taxBrackets2023.basic.max;
      if (higherRateAmount > 0) {
        higherRateTax = higherRateAmount * taxBrackets2023.higher.rate;
        incomeTax += higherRateTax;
      }
      
      // Additional rate tax
      const additionalRateAmount = taxableIncome - taxBrackets2023.higher.max;
      if (additionalRateAmount > 0) {
        additionalRateTax = additionalRateAmount * taxBrackets2023.additional.rate;
        incomeTax += additionalRateTax;
      }
    }
    
    // Calculate National Insurance
    let nationalInsurance = 0;
    if (grossIncome > niBrackets2023.primary.min) {
      // Primary threshold
      const primaryAmount = Math.min(grossIncome, niBrackets2023.primary.max) - niBrackets2023.primary.min;
      if (primaryAmount > 0) {
        nationalInsurance += primaryAmount * niBrackets2023.primary.rate;
      }
      
      // Upper threshold
      const upperAmount = grossIncome - niBrackets2023.primary.max;
      if (upperAmount > 0) {
        nationalInsurance += upperAmount * niBrackets2023.upper.rate;
      }
    }
    
    // Calculate Student Loan repayment
    let studentLoanRepayment = 0;
    if (studentLoan) {
      const loanThreshold = studentLoanThresholds[studentLoanPlan as keyof typeof studentLoanThresholds];
      if (grossIncome > loanThreshold.threshold) {
        studentLoanRepayment = (grossIncome - loanThreshold.threshold) * loanThreshold.rate;
      }
    }
    
    // Calculate Pension Tax Relief
    const pensionTaxRelief = pensionAmount * (taxableIncome > taxBrackets2023.basic.max ? 0.4 : 0.2);
    
    // Calculate take-home pay
    const takeHomePay = grossIncome - incomeTax - nationalInsurance - studentLoanRepayment - pensionAmount;
    
    // Calculate effective tax rate
    const effectiveTaxRate = ((incomeTax + nationalInsurance + studentLoanRepayment) / grossIncome) * 100;
    
    // Create breakdown for charts
    const taxBreakdown = [
      {
        name: 'Income Tax',
        value: incomeTax,
        color: '#ef4444' // red
      },
      {
        name: 'National Insurance',
        value: nationalInsurance,
        color: '#f97316' // orange
      }
    ];
    
    if (studentLoanRepayment > 0) {
      taxBreakdown.push({
        name: 'Student Loan',
        value: studentLoanRepayment,
        color: '#eab308' // yellow
      });
    }
    
    if (pensionAmount > 0) {
      taxBreakdown.push({
        name: 'Pension',
        value: pensionAmount,
        color: '#3b82f6' // blue
      });
    }
    
    const incomeBreakdown = [
      {
        name: 'Take Home Pay',
        value: takeHomePay,
        color: '#10b981' // green
      },
      ...taxBreakdown
    ];
    
    // Set results
    setTaxResults({
      grossIncome,
      netIncome: takeHomePay,
      incomeTax,
      nationalInsurance,
      studentLoanRepayment,
      pensionContribution: pensionAmount,
      pensionTaxRelief,
      effectiveTaxRate,
      basicRateTax,
      higherRateTax,
      additionalRateTax,
      takeHomePay,
      monthlyTakeHome: takeHomePay / 12,
      weeklyTakeHome: takeHomePay / 52,
      taxBreakdown,
      incomeBreakdown
    });
  };
  
  const resetForm = () => {
    setSalaryIncome(35000);
    setAdditionalIncome(0);
    setPensionContribution(5);
    setStudentLoan(false);
    setStudentLoanPlan("plan2");
    setTaxYear("2023-2024");
    setTaxResults(null);
  };
  
  return (
    <Tabs defaultValue="income" className="w-full">
      <TabsList className="grid grid-cols-2 w-full max-w-md mb-6">
        <TabsTrigger value="income" className="flex items-center gap-2">
          <PoundSterling className="h-4 w-4" />
          <span>Income Tax</span>
        </TabsTrigger>
        <TabsTrigger value="more" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          <span>Tax Information</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="income" className="mt-0 space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-6">
            {/* Salary Income */}
            <div className="grid gap-2">
              <Label htmlFor="salaryIncome" className="font-medium flex items-center">
                <Building className="h-4 w-4 mr-1 text-primary" />
                Annual Salary
              </Label>
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      id="salaryIncome"
                      type="number"
                      value={salaryIncome}
                      onChange={(e) => setSalaryIncome(Number(e.target.value))}
                      className="pl-10"
                      min={0}
                      max={1000000}
                    />
                  </div>
                  <span className="font-medium">{formatCurrency(salaryIncome)}</span>
                </div>
                <Slider
                  value={[salaryIncome]}
                  min={0}
                  max={150000}
                  step={1000}
                  onValueChange={(value) => setSalaryIncome(value[0])}
                />
                <div className="flex justify-between text-xs text-slate-500">
                  <span>£0</span>
                  <span>£150,000</span>
                </div>
              </div>
            </div>
            
            {/* Additional Income */}
            <div className="grid gap-2">
              <Label htmlFor="additionalIncome" className="font-medium flex items-center">
                <PoundSterling className="h-4 w-4 mr-1 text-primary" />
                Additional Income
              </Label>
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      id="additionalIncome"
                      type="number"
                      value={additionalIncome}
                      onChange={(e) => setAdditionalIncome(Number(e.target.value))}
                      className="pl-10"
                      min={0}
                    />
                  </div>
                  <span className="font-medium">{formatCurrency(additionalIncome)}</span>
                </div>
                <Slider
                  value={[additionalIncome]}
                  min={0}
                  max={50000}
                  step={500}
                  onValueChange={(value) => setAdditionalIncome(value[0])}
                />
                <div className="flex justify-between text-xs text-slate-500">
                  <span>£0</span>
                  <span>£50,000</span>
                </div>
              </div>
            </div>
            
            {/* Tax Year */}
            <div className="grid gap-2">
              <Label htmlFor="taxYear" className="font-medium flex items-center">
                <FileText className="h-4 w-4 mr-1 text-primary" />
                Tax Year
              </Label>
              <Select 
                value={taxYear} 
                onValueChange={setTaxYear}
              >
                <SelectTrigger id="taxYear">
                  <SelectValue placeholder="Select tax year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2023-2024">2023-2024</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-slate-500">
                Tax rates and thresholds are based on the selected tax year.
              </p>
            </div>
          </div>
          
          <div className="space-y-6">
            {/* Pension Contribution */}
            <div className="grid gap-2">
              <Label htmlFor="pensionContribution" className="font-medium flex items-center">
                <Building className="h-4 w-4 mr-1 text-primary" />
                Pension Contribution (%)
              </Label>
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Input
                      id="pensionContribution"
                      type="number"
                      value={pensionContribution}
                      onChange={(e) => setPensionContribution(Number(e.target.value))}
                      min={0}
                      max={100}
                      step={0.5}
                    />
                  </div>
                  <span className="font-medium">{pensionContribution}%</span>
                </div>
                <Slider
                  value={[pensionContribution]}
                  min={0}
                  max={30}
                  step={0.5}
                  onValueChange={(value) => setPensionContribution(value[0])}
                />
                <div className="flex justify-between text-xs text-slate-500">
                  <span>0%</span>
                  <span>30%</span>
                </div>
              </div>
            </div>
            
            {/* Student Loan */}
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="studentLoan" className="font-medium flex items-center">
                  <FileText className="h-4 w-4 mr-1 text-primary" />
                  Student Loan Repayment
                </Label>
                <Switch
                  id="studentLoan"
                  checked={studentLoan}
                  onCheckedChange={setStudentLoan}
                />
              </div>
              
              {studentLoan && (
                <div className="grid gap-2">
                  <Label htmlFor="studentLoanPlan" className="text-sm text-slate-500">
                    Repayment Plan
                  </Label>
                  <Select 
                    value={studentLoanPlan} 
                    onValueChange={setStudentLoanPlan}
                  >
                    <SelectTrigger id="studentLoanPlan">
                      <SelectValue placeholder="Select plan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="plan1">Plan 1</SelectItem>
                      <SelectItem value="plan2">Plan 2</SelectItem>
                      <SelectItem value="plan4">Plan 4 (Scotland)</SelectItem>
                      <SelectItem value="postgrad">Postgraduate Loan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            onClick={calculateTax}
            className="flex-1 gap-2"
            size="lg"
          >
            Calculate Tax <ArrowRight className="h-4 w-4" />
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
        {taxResults && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3 }}
            className="border-t pt-6 mt-6"
          >
            <h3 className="text-xl font-semibold mb-6">Your UK Tax Summary</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card className="bg-slate-50 dark:bg-slate-900">
                <CardContent className="p-4 flex flex-col items-center justify-center h-32">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Take Home Pay (Annual)</p>
                  <p className="text-2xl font-bold text-primary">{formatCurrency(taxResults.takeHomePay)}</p>
                  <p className="text-xs text-slate-400">After Tax & Deductions</p>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-50 dark:bg-slate-900">
                <CardContent className="p-4 flex flex-col items-center justify-center h-32">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Monthly Pay</p>
                  <p className="text-2xl font-bold">{formatCurrency(taxResults.monthlyTakeHome)}</p>
                  <p className="text-xs text-slate-400">Per Month</p>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-50 dark:bg-slate-900">
                <CardContent className="p-4 flex flex-col items-center justify-center h-32">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Effective Tax Rate</p>
                  <p className="text-2xl font-bold">{taxResults.effectiveTaxRate.toFixed(1)}%</p>
                  <p className="text-xs text-slate-400">
                    Including NI & Student Loan
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium">Income Breakdown</h4>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={taxResults.incomeBreakdown}
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
                        {taxResults.incomeBreakdown.map((entry, index: number) => (
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
              
              <div className="space-y-4">
                <h4 className="font-medium">Tax Breakdown</h4>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={taxResults.taxBreakdown}
                      margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis
                        tickFormatter={(value) => `£${(value / 1000).toFixed(0)}k`}
                      />
                      <Tooltip
                        formatter={(value) => [formatCurrency(Number(value)), '']}
                      />
                      <Legend />
                      {taxResults.taxBreakdown.map((entry, index: number) => (
                        <Bar
                          key={`bar-${index}`}
                          dataKey="value"
                          name={entry.name}
                          fill={entry.color}
                        />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border">
                <h4 className="font-medium mb-3">Income Tax Breakdown</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Personal Allowance (£0 - £12,570)</span>
                    <span className="font-medium">£0</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Basic Rate (£12,571 - £50,270)</span>
                    <span className="font-medium">{formatCurrency(taxResults.basicRateTax)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Higher Rate (£50,271 - £125,140)</span>
                    <span className="font-medium">{formatCurrency(taxResults.higherRateTax)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Additional Rate (over £125,140)</span>
                    <span className="font-medium">{formatCurrency(taxResults.additionalRateTax)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="font-medium">Total Income Tax</span>
                    <span className="font-bold text-primary">{formatCurrency(taxResults.incomeTax)}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border">
                <h4 className="font-medium mb-3">Other Deductions</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600 dark:text-slate-400">National Insurance</span>
                    <span className="font-medium">{formatCurrency(taxResults.nationalInsurance)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Student Loan Repayment</span>
                    <span className="font-medium">{formatCurrency(taxResults.studentLoanRepayment)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Pension Contribution</span>
                    <span className="font-medium">{formatCurrency(taxResults.pensionContribution)}</span>
                  </div>
                  <div className="flex justify-between items-center text-green-600">
                    <span className="text-sm">Pension Tax Relief</span>
                    <span className="font-medium">-{formatCurrency(taxResults.pensionTaxRelief)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="font-medium">Total Deductions</span>
                    <span className="font-bold text-red-500">
                      {formatCurrency(
                        taxResults.incomeTax + 
                        taxResults.nationalInsurance + 
                        taxResults.studentLoanRepayment + 
                        taxResults.pensionContribution
                      )}
                    </span>
                  </div>
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
                This calculator provides estimates based on standard UK tax rates and thresholds for the selected tax year. 
                Your actual tax situation may vary depending on your specific circumstances, reliefs, and allowances. 
                This tool is for educational purposes only and should not be considered tax advice. 
                We recommend consulting with a qualified tax professional for personalized guidance.
              </p>
            </div>
          </motion.div>
        )}
      </TabsContent>
      
      <TabsContent value="more" className="mt-0 space-y-6">
        <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-6 border">
          <h3 className="text-lg font-semibold mb-4">UK Tax Information (2023-2024)</h3>
          
          <div className="space-y-6">
            <div>
              <h4 className="font-medium mb-2">Income Tax Bands</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white dark:bg-slate-800 border rounded-md">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-700">
                      <th className="px-4 py-2 text-left">Band</th>
                      <th className="px-4 py-2 text-left">Taxable Income</th>
                      <th className="px-4 py-2 text-left">Tax Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t">
                      <td className="px-4 py-2">Personal Allowance</td>
                      <td className="px-4 py-2">Up to £12,570</td>
                      <td className="px-4 py-2">0%</td>
                    </tr>
                    <tr className="border-t">
                      <td className="px-4 py-2">Basic Rate</td>
                      <td className="px-4 py-2">£12,571 to £50,270</td>
                      <td className="px-4 py-2">20%</td>
                    </tr>
                    <tr className="border-t">
                      <td className="px-4 py-2">Higher Rate</td>
                      <td className="px-4 py-2">£50,271 to £125,140</td>
                      <td className="px-4 py-2">40%</td>
                    </tr>
                    <tr className="border-t">
                      <td className="px-4 py-2">Additional Rate</td>
                      <td className="px-4 py-2">Over £125,140</td>
                      <td className="px-4 py-2">45%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Your Personal Allowance decreases by £1 for every £2 that your income exceeds £100,000, until it reaches £0.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">National Insurance Contributions</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white dark:bg-slate-800 border rounded-md">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-700">
                      <th className="px-4 py-2 text-left">Class</th>
                      <th className="px-4 py-2 text-left">Earnings Threshold</th>
                      <th className="px-4 py-2 text-left">Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t">
                      <td className="px-4 py-2">Class 1 (Primary)</td>
                      <td className="px-4 py-2">£12,570 to £50,270</td>
                      <td className="px-4 py-2">12%</td>
                    </tr>
                    <tr className="border-t">
                      <td className="px-4 py-2">Class 1 (Upper)</td>
                      <td className="px-4 py-2">Over £50,270</td>
                      <td className="px-4 py-2">2%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Student Loan Repayment Thresholds</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white dark:bg-slate-800 border rounded-md">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-700">
                      <th className="px-4 py-2 text-left">Plan</th>
                      <th className="px-4 py-2 text-left">Annual Threshold</th>
                      <th className="px-4 py-2 text-left">Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t">
                      <td className="px-4 py-2">Plan 1</td>
                      <td className="px-4 py-2">£22,015</td>
                      <td className="px-4 py-2">9%</td>
                    </tr>
                    <tr className="border-t">
                      <td className="px-4 py-2">Plan 2</td>
                      <td className="px-4 py-2">£27,295</td>
                      <td className="px-4 py-2">9%</td>
                    </tr>
                    <tr className="border-t">
                      <td className="px-4 py-2">Plan 4 (Scotland)</td>
                      <td className="px-4 py-2">£27,660</td>
                      <td className="px-4 py-2">9%</td>
                    </tr>
                    <tr className="border-t">
                      <td className="px-4 py-2">Postgraduate Loan</td>
                      <td className="px-4 py-2">£21,000</td>
                      <td className="px-4 py-2">6%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Student loan repayments are calculated as a percentage of your income above the threshold for your loan type.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Pension Tax Relief</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                When you contribute to a pension, you receive tax relief at your highest rate of Income Tax:
              </p>
              <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-400 mt-2 space-y-1">
                <li>Basic rate taxpayers get 20% tax relief</li>
                <li>Higher rate taxpayers get 40% tax relief</li>
                <li>Additional rate taxpayers get 45% tax relief</li>
              </ul>
              <p className="text-xs text-slate-500 mt-2">
                The annual allowance for pension contributions is typically £60,000 (2023-2024), but may be reduced for high earners.
              </p>
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
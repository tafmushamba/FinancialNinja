import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { 
  PoundSterling, 
  Calculator, 
  TrendingUp, 
  CreditCard,
  Home,
  Car,
  Briefcase,
  Landmark,
  LineChart as LineChartIcon,
  Calendar,
  DollarSign,
  BarChart,
  ArrowRight,
  Download,
  RefreshCw
} from 'lucide-react';

// Loan Calculator Functions
const calculateMonthlyPayment = (principal: number, annualRate: number, years: number): number => {
  // Ensure all values are valid numbers
  if (isNaN(principal) || isNaN(annualRate) || isNaN(years) || principal <= 0 || years <= 0) {
    return 0;
  }
  
  const monthlyRate = annualRate / 100 / 12;
  const numberOfPayments = years * 12;
  
  // Using the mortgage formula
  if (monthlyRate === 0) return principal / numberOfPayments;
  
  return (
    (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
  );
};

const calculateLoanBreakdown = (principal: number, annualRate: number, years: number) => {
  // Ensure all values are valid numbers
  if (isNaN(principal) || isNaN(annualRate) || isNaN(years) || principal <= 0 || years <= 0) {
    return {
      monthlyPayment: 0,
      totalPayment: 0,
      totalInterest: 0,
      payments: []
    };
  }
  
  const monthlyPayment = calculateMonthlyPayment(principal, annualRate, years);
  const numberOfPayments = years * 12;
  const payments = [];
  
  let balance = principal;
  let totalInterest = 0;
  
  for (let i = 1; i <= numberOfPayments; i++) {
    const interestPayment = balance * (annualRate / 100 / 12);
    const principalPayment = monthlyPayment - interestPayment;
    
    totalInterest += interestPayment;
    balance -= principalPayment;
    
    payments.push({
      month: i,
      payment: monthlyPayment,
      principalPayment,
      interestPayment,
      totalInterest,
      remainingBalance: Math.max(0, balance),
    });
  }
  
  return {
    monthlyPayment,
    totalPayment: monthlyPayment * numberOfPayments,
    totalInterest,
    payments,
  };
};

// Investment Calculator Functions
const calculateInvestmentGrowth = (
  initialAmount: number,
  monthlyContribution: number,
  annualReturnRate: number,
  years: number,
  isISA: boolean = false,
  taxRate: number = 20
) => {
  // Ensure all values are valid numbers
  if (
    isNaN(initialAmount) || 
    isNaN(monthlyContribution) || 
    isNaN(annualReturnRate) || 
    isNaN(years) || 
    isNaN(taxRate) ||
    initialAmount < 0 || 
    monthlyContribution < 0 || 
    years <= 0
  ) {
    return {
      finalBalance: 0,
      totalContributions: 0,
      totalGains: 0,
      totalTaxPaid: 0,
      growthPoints: []
    };
  }
  
  const monthlyReturnRate = annualReturnRate / 100 / 12;
  const months = years * 12;
  const growthPoints = [];
  
  let balance = initialAmount;
  let totalContributions = initialAmount;
  let totalTaxPaid = 0;
  
  for (let i = 1; i <= months; i++) {
    // Add monthly contribution
    balance += monthlyContribution;
    totalContributions += monthlyContribution;
    
    // Add interest/gains
    const monthlyGain = balance * monthlyReturnRate;
    
    // Calculate tax if not an ISA
    let taxPaid = 0;
    if (!isISA && monthlyGain > 0) {
      // In the UK, Capital Gains Tax applies to gains, not to the entire amount
      taxPaid = monthlyGain * (taxRate / 100);
      totalTaxPaid += taxPaid;
    }
    
    balance += monthlyGain - taxPaid;
    
    // Record data points annually or at key milestones
    if (i % 12 === 0 || i === 1 || i === months) {
      growthPoints.push({
        month: i,
        year: Math.ceil(i / 12),
        balance: balance,
        contributions: totalContributions,
        gains: balance - totalContributions,
        taxPaid: totalTaxPaid
      });
    }
  }
  
  return {
    finalBalance: balance,
    totalContributions,
    totalGains: balance - totalContributions,
    totalTaxPaid,
    growthPoints,
  };
};

// Type definitions
type CalculatorTab = 'loan' | 'investment';
type LoanType = 'mortgage' | 'personal' | 'car' | 'student';
type InvestmentType = 'isa' | 'general' | 'pension';

export function LoanInvestmentCalculator() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<CalculatorTab>('loan');
  
  // Loan calculator state
  const [loanAmount, setLoanAmount] = useState<number>(200000);
  const [loanInterestRate, setLoanInterestRate] = useState<number>(3.5);
  const [loanTerm, setLoanTerm] = useState<number>(25);
  const [loanType, setLoanType] = useState<LoanType>('mortgage');
  const [loanResults, setLoanResults] = useState<any>(null);
  
  // Investment calculator state
  const [initialInvestment, setInitialInvestment] = useState<number>(10000);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(200);
  const [investmentReturnRate, setInvestmentReturnRate] = useState<number>(6);
  const [investmentTerm, setInvestmentTerm] = useState<number>(30);
  const [investmentType, setInvestmentType] = useState<InvestmentType>('isa');
  const [taxRate, setTaxRate] = useState<number>(20);
  const [investmentResults, setInvestmentResults] = useState<any>(null);
  
  // Handle loan calculation
  const calculateLoan = () => {
    console.log('Calculating loan with amount:', loanAmount, 'interest rate:', loanInterestRate, 'term:', loanTerm);
    
    // Ensure values are valid numbers (handle NaN or undefined)
    const amount = isNaN(loanAmount) ? 0 : loanAmount;
    const rate = isNaN(loanInterestRate) ? 0 : loanInterestRate;
    const term = isNaN(loanTerm) ? 0 : loanTerm;
    
    // Validate inputs
    if (amount <= 0) {
      toast({
        title: "Invalid Loan Amount",
        description: "Please enter a valid loan amount greater than zero.",
        variant: "destructive"
      });
      return;
    }
    
    if (rate < 0) {
      toast({
        title: "Invalid Interest Rate",
        description: "Please enter a valid interest rate (0% or higher).",
        variant: "destructive"
      });
      return;
    }
    
    if (term <= 0) {
      toast({
        title: "Invalid Loan Term",
        description: "Please enter a valid loan term greater than zero.",
        variant: "destructive"
      });
      return;
    }
    
    const result = calculateLoanBreakdown(amount, rate, term);
    console.log('Loan calculation result:', result);
    
    // Check if calculation was successful
    if (result.monthlyPayment <= 0) {
      toast({
        title: "Calculation Error",
        description: "There was an error calculating your loan. Please check your inputs.",
        variant: "destructive"
      });
      return;
    }
    
    setLoanResults(result);
    
    toast({
      title: "Loan Calculation Complete",
      description: `Monthly payment: £${result.monthlyPayment.toFixed(2)} | Total interest: £${result.totalInterest.toFixed(2)}`,
      variant: "default"
    });
  };
  
  // Handle investment calculation
  const calculateInvestment = () => {
    console.log('Calculating investment with initial:', initialInvestment, 'monthly:', monthlyContribution, 'rate:', investmentReturnRate, 'term:', investmentTerm, 'type:', investmentType);
    
    // Ensure values are valid numbers (handle NaN or undefined)
    const initial = isNaN(initialInvestment) ? 0 : initialInvestment;
    const monthly = isNaN(monthlyContribution) ? 0 : monthlyContribution;
    const rate = isNaN(investmentReturnRate) ? 0 : investmentReturnRate;
    const term = isNaN(investmentTerm) ? 0 : investmentTerm;
    const tax = isNaN(taxRate) ? 20 : taxRate;
    
    // Validate inputs
    if (initial < 0) {
      toast({
        title: "Invalid Initial Investment",
        description: "Please enter a valid initial investment amount (0 or higher).",
        variant: "destructive"
      });
      return;
    }
    
    if (monthly < 0) {
      toast({
        title: "Invalid Monthly Contribution",
        description: "Please enter a valid monthly contribution amount (0 or higher).",
        variant: "destructive"
      });
      return;
    }
    
    if (rate < 0) {
      toast({
        title: "Invalid Return Rate",
        description: "Please enter a valid return rate (0% or higher).",
        variant: "destructive"
      });
      return;
    }
    
    if (term <= 0) {
      toast({
        title: "Invalid Investment Term",
        description: "Please enter a valid investment term greater than zero.",
        variant: "destructive"
      });
      return;
    }
    
    if (investmentType === 'general' && (tax < 0 || tax > 100)) {
      toast({
        title: "Invalid Tax Rate",
        description: "Please enter a valid tax rate between 0% and 100%.",
        variant: "destructive"
      });
      return;
    }
    
    const isISA = investmentType === 'isa' || investmentType === 'pension';
    const result = calculateInvestmentGrowth(
      initial,
      monthly,
      rate,
      term,
      isISA,
      tax
    );
    console.log('Investment calculation result:', result);
    
    // Check if calculation was successful
    if (!result.growthPoints || result.growthPoints.length === 0) {
      toast({
        title: "Calculation Error",
        description: "There was an error calculating your investment. Please check your inputs.",
        variant: "destructive"
      });
      return;
    }
    
    setInvestmentResults(result);
    
    toast({
      title: "Investment Calculation Complete",
      description: `Final balance: £${result.finalBalance.toFixed(2)} | Total gain: £${result.totalGains.toFixed(2)}`,
      variant: "default"
    });
  };
  
  // Reset forms
  const resetLoanForm = () => {
    // Use defaults based on loan type
    switch (loanType) {
      case 'mortgage':
        setLoanAmount(200000);
        setLoanInterestRate(3.5);
        setLoanTerm(25);
        break;
      case 'personal':
        setLoanAmount(10000);
        setLoanInterestRate(7.9);
        setLoanTerm(5);
        break;
      case 'car':
        setLoanAmount(15000);
        setLoanInterestRate(5.9);
        setLoanTerm(4);
        break;
      case 'student':
        setLoanAmount(40000);
        setLoanInterestRate(2.75);
        setLoanTerm(30);
        break;
    }
    setLoanResults(null);
  };
  
  const resetInvestmentForm = () => {
    // Use defaults based on investment type
    switch (investmentType) {
      case 'isa':
        setInitialInvestment(10000);
        setMonthlyContribution(200);
        setInvestmentReturnRate(6);
        setInvestmentTerm(30);
        break;
      case 'general':
        setInitialInvestment(10000);
        setMonthlyContribution(200);
        setInvestmentReturnRate(6);
        setInvestmentTerm(30);
        setTaxRate(20);
        break;
      case 'pension':
        setInitialInvestment(20000);
        setMonthlyContribution(300);
        setInvestmentReturnRate(5);
        setInvestmentTerm(40);
        break;
    }
    setInvestmentResults(null);
  };
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value as CalculatorTab);
    // Reset results when switching tabs
    if (value === 'loan') {
      setInvestmentResults(null);
    } else {
      setLoanResults(null);
    }
  };
  
  // Update defaults when loan type changes
  useEffect(() => {
    if (loanType) {
      resetLoanForm();
    }
  }, [loanType]);
  
  // Update defaults when investment type changes
  useEffect(() => {
    if (investmentType) {
      resetInvestmentForm();
    }
  }, [investmentType]);
  
  // Format currency for display
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };
  
  // Get appropriate loan icons
  const getLoanTypeIcon = () => {
    switch (loanType) {
      case 'mortgage': return <Home className="h-5 w-5" />;
      case 'personal': return <CreditCard className="h-5 w-5" />;
      case 'car': return <Car className="h-5 w-5" />;
      case 'student': return <Briefcase className="h-5 w-5" />;
      default: return <CreditCard className="h-5 w-5" />;
    }
  };
  
  // Get appropriate investment icons
  const getInvestmentTypeIcon = () => {
    switch (investmentType) {
      case 'isa': return <Landmark className="h-5 w-5" />;
      case 'general': return <TrendingUp className="h-5 w-5" />;
      case 'pension': return <Calendar className="h-5 w-5" />;
      default: return <TrendingUp className="h-5 w-5" />;
    }
  };
  
  // Improve input handlers
  const handleLoanAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    if (rawValue === '') {
      setLoanAmount(0);
      return;
    }
    
    const value = parseFloat(rawValue);
    if (!isNaN(value)) {
      setLoanAmount(value);
    }
  };

  const handleLoanInterestRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    if (rawValue === '') {
      setLoanInterestRate(0);
      return;
    }
    
    const value = parseFloat(rawValue);
    if (!isNaN(value) && value >= 0) {
      setLoanInterestRate(value);
    }
  };

  const handleLoanTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    if (rawValue === '') {
      setLoanTerm(1);
      return;
    }
    
    const value = parseInt(rawValue);
    if (!isNaN(value) && value > 0) {
      setLoanTerm(value);
    }
  };

  const handleInitialInvestmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    if (rawValue === '') {
      setInitialInvestment(0);
      return;
    }
    
    const value = parseFloat(rawValue);
    if (!isNaN(value) && value >= 0) {
      setInitialInvestment(value);
    }
  };

  const handleMonthlyContributionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    if (rawValue === '') {
      setMonthlyContribution(0);
      return;
    }
    
    const value = parseFloat(rawValue);
    if (!isNaN(value) && value >= 0) {
      setMonthlyContribution(value);
    }
  };

  const handleInvestmentReturnRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    if (rawValue === '') {
      setInvestmentReturnRate(0);
      return;
    }
    
    const value = parseFloat(rawValue);
    if (!isNaN(value) && value >= 0) {
      setInvestmentReturnRate(value);
    }
  };

  const handleInvestmentTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    if (rawValue === '') {
      setInvestmentTerm(1);
      return;
    }
    
    const value = parseInt(rawValue);
    if (!isNaN(value) && value > 0) {
      setInvestmentTerm(value);
    }
  };

  const handleTaxRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    if (rawValue === '') {
      setTaxRate(0);
      return;
    }
    
    const value = parseFloat(rawValue);
    if (!isNaN(value) && value >= 0 && value <= 100) {
      setTaxRate(value);
    }
  };
  
  // Slider value change handlers
  const handleLoanAmountSliderChange = (value: number[]) => {
    try {
      if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'number' && !isNaN(value[0])) {
        setLoanAmount(value[0]);
      }
    } catch (error) {
      console.error('Error in loan amount slider:', error);
    }
  };

  const handleLoanInterestRateSliderChange = (value: number[]) => {
    try {
      if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'number' && !isNaN(value[0])) {
        setLoanInterestRate(value[0]);
      }
    } catch (error) {
      console.error('Error in loan interest rate slider:', error);
    }
  };

  const handleLoanTermSliderChange = (value: number[]) => {
    try {
      if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'number' && !isNaN(value[0])) {
        setLoanTerm(Math.round(value[0])); // Ensure it's an integer
      }
    } catch (error) {
      console.error('Error in loan term slider:', error);
    }
  };

  const handleInitialInvestmentSliderChange = (value: number[]) => {
    try {
      if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'number' && !isNaN(value[0])) {
        setInitialInvestment(value[0]);
      }
    } catch (error) {
      console.error('Error in initial investment slider:', error);
    }
  };

  const handleMonthlyContributionSliderChange = (value: number[]) => {
    try {
      if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'number' && !isNaN(value[0])) {
        setMonthlyContribution(value[0]);
      }
    } catch (error) {
      console.error('Error in monthly contribution slider:', error);
    }
  };

  const handleInvestmentReturnRateSliderChange = (value: number[]) => {
    try {
      if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'number' && !isNaN(value[0])) {
        setInvestmentReturnRate(value[0]);
      }
    } catch (error) {
      console.error('Error in investment return rate slider:', error);
    }
  };

  const handleInvestmentTermSliderChange = (value: number[]) => {
    try {
      if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'number' && !isNaN(value[0])) {
        setInvestmentTerm(Math.round(value[0])); // Ensure it's an integer
      }
    } catch (error) {
      console.error('Error in investment term slider:', error);
    }
  };

  const handleTaxRateSliderChange = (value: number[]) => {
    try {
      if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'number' && !isNaN(value[0])) {
        setTaxRate(value[0]);
      }
    } catch (error) {
      console.error('Error in tax rate slider:', error);
    }
  };
  
  return (
    <Card className="w-full shadow-lg border-2">
      <CardHeader className="p-6">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl font-semibold flex items-center">
              <Calculator className="mr-2 h-5 w-5 text-primary" />
              Financial Calculator
            </CardTitle>
            <CardDescription>
              Calculate loan repayments and investment growth over time
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <Tabs 
        defaultValue="loan" 
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <div className="px-6 pt-2">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="loan" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span>Loan Calculator</span>
            </TabsTrigger>
            <TabsTrigger value="investment" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span>Investment Calculator</span>
            </TabsTrigger>
          </TabsList>
        </div>
        
        {/* Loan Calculator Tab */}
        <TabsContent value="loan" className="p-0 m-0">
          <CardContent className="pt-6">
            <div className="space-y-6">
              {/* Loan Type Selection */}
              <div className="grid gap-2">
                <Label htmlFor="loanType" className="font-medium">Loan Type</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <Button
                    type="button"
                    variant={loanType === 'mortgage' ? 'default' : 'outline'}
                    className="flex flex-col items-center justify-center h-20 gap-2"
                    onClick={() => setLoanType('mortgage')}
                  >
                    <Home className="h-5 w-5" />
                    <span className="text-xs">Mortgage</span>
                  </Button>
                  <Button
                    type="button"
                    variant={loanType === 'personal' ? 'default' : 'outline'}
                    className="flex flex-col items-center justify-center h-20 gap-2"
                    onClick={() => setLoanType('personal')}
                  >
                    <CreditCard className="h-5 w-5" />
                    <span className="text-xs">Personal Loan</span>
                  </Button>
                  <Button
                    type="button"
                    variant={loanType === 'car' ? 'default' : 'outline'}
                    className="flex flex-col items-center justify-center h-20 gap-2"
                    onClick={() => setLoanType('car')}
                  >
                    <Car className="h-5 w-5" />
                    <span className="text-xs">Car Loan</span>
                  </Button>
                  <Button
                    type="button"
                    variant={loanType === 'student' ? 'default' : 'outline'}
                    className="flex flex-col items-center justify-center h-20 gap-2"
                    onClick={() => setLoanType('student')}
                  >
                    <Briefcase className="h-5 w-5" />
                    <span className="text-xs">Student Loan</span>
                  </Button>
                </div>
              </div>
              
              {/* Loan Amount */}
              <div className="grid gap-2">
                <Label htmlFor="loanAmount" className="font-medium flex items-center">
                  <PoundSterling className="h-4 w-4 mr-1 text-primary" />
                  Loan Amount
                </Label>
                <div className="space-y-2">
                  <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                      <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Input
                        id="loanAmount"
                        type="number"
                        value={loanAmount}
                        onChange={handleLoanAmountChange}
                        className="pl-10"
                        min={0}
                      />
                    </div>
                    <span className="font-medium">{formatCurrency(loanAmount)}</span>
                  </div>
                  <Slider
                    value={[loanAmount]}
                    min={loanType === 'mortgage' ? 50000 : 1000}
                    max={loanType === 'mortgage' ? 500000 : 50000}
                    step={loanType === 'mortgage' ? 5000 : 500}
                    onValueChange={handleLoanAmountSliderChange}
                  />
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>{formatCurrency(loanType === 'mortgage' ? 50000 : 1000)}</span>
                    <span>{formatCurrency(loanType === 'mortgage' ? 500000 : 50000)}</span>
                  </div>
                </div>
              </div>
              
              {/* Interest Rate */}
              <div className="grid gap-2">
                <Label htmlFor="interestRate" className="font-medium flex items-center">
                  <BarChart className="h-4 w-4 mr-1 text-primary" />
                  Interest Rate (%)
                </Label>
                <div className="space-y-2">
                  <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                      <Input
                        id="interestRate"
                        type="number"
                        value={loanInterestRate}
                        onChange={handleLoanInterestRateChange}
                        min={0}
                        max={30}
                        step={0.1}
                      />
                    </div>
                    <span className="font-medium">{loanInterestRate}%</span>
                  </div>
                  <Slider
                    value={[loanInterestRate]}
                    min={0}
                    max={15}
                    step={0.1}
                    onValueChange={handleLoanInterestRateSliderChange}
                  />
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>0%</span>
                    <span>15%</span>
                  </div>
                </div>
              </div>
              
              {/* Loan Term */}
              <div className="grid gap-2">
                <Label htmlFor="loanTerm" className="font-medium flex items-center">
                  <Calendar className="h-4 w-4 mr-1 text-primary" />
                  Loan Term (years)
                </Label>
                <div className="space-y-2">
                  <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                      <Input
                        id="loanTerm"
                        type="number"
                        value={loanTerm}
                        onChange={handleLoanTermChange}
                        min={1}
                        max={35}
                      />
                    </div>
                    <span className="font-medium">{loanTerm} years</span>
                  </div>
                  <Slider
                    value={[loanTerm]}
                    min={1}
                    max={loanType === 'mortgage' || loanType === 'student' ? 35 : 10}
                    step={1}
                    onValueChange={handleLoanTermSliderChange}
                  />
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>1 year</span>
                    <span>{loanType === 'mortgage' || loanType === 'student' ? '35' : '10'} years</span>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button
                  onClick={calculateLoan}
                  className="flex-1 gap-2"
                  size="lg"
                >
                  Calculate <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={resetLoanForm}
                  className="gap-2"
                >
                  <RefreshCw className="h-4 w-4" /> Reset
                </Button>
              </div>
            </div>
          </CardContent>
          
          {/* Loan Results */}
          {loanResults && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.3 }}
            >
              <CardContent className="border-t pt-6">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-slate-50 dark:bg-slate-900">
                      <CardContent className="p-4 flex flex-col items-center justify-center h-32">
                        <p className="text-sm text-slate-500 dark:text-slate-400">Monthly Payment</p>
                        <p className="text-2xl font-bold">{formatCurrency(loanResults.monthlyPayment)}</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-slate-50 dark:bg-slate-900">
                      <CardContent className="p-4 flex flex-col items-center justify-center h-32">
                        <p className="text-sm text-slate-500 dark:text-slate-400">Total Payments</p>
                        <p className="text-2xl font-bold">{formatCurrency(loanResults.totalPayment)}</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-slate-50 dark:bg-slate-900">
                      <CardContent className="p-4 flex flex-col items-center justify-center h-32">
                        <p className="text-sm text-slate-500 dark:text-slate-400">Total Interest</p>
                        <p className="text-2xl font-bold text-amber-600">{formatCurrency(loanResults.totalInterest)}</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-medium">Payment Breakdown</h3>
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={loanResults.payments.filter((_: any, i: number) => i % 12 === 0 || i === loanResults.payments.length - 1)}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="month" 
                            label={{ 
                              value: 'Months', 
                              position: 'insideBottomRight', 
                              offset: -10 
                            }} 
                          />
                          <YAxis
                            tickFormatter={(value) => `£${(value / 1000).toFixed(0)}k`}
                            label={{
                              value: 'Amount (£)',
                              angle: -90,
                              position: 'insideLeft',
                            }}
                          />
                          <Tooltip
                            formatter={(value) => [`£${Number(value).toFixed(2)}`, '']}
                            labelFormatter={(label) => `Month ${label}`}
                          />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="remainingBalance"
                            name="Remaining Balance"
                            stroke="#ef4444"
                            activeDot={{ r: 8 }}
                          />
                          <Line
                            type="monotone"
                            dataKey="totalInterest"
                            name="Total Interest Paid"
                            stroke="#eab308"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </CardContent>
            </motion.div>
          )}
        </TabsContent>
        
        {/* Investment Calculator Tab */}
        <TabsContent value="investment" className="p-0 m-0">
          <CardContent className="pt-6">
            <div className="space-y-6">
              {/* Investment Type */}
              <div className="grid gap-2">
                <Label htmlFor="investmentType" className="font-medium">Investment Type</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    type="button"
                    variant={investmentType === 'isa' ? 'default' : 'outline'}
                    className="flex flex-col items-center justify-center h-20 gap-2"
                    onClick={() => setInvestmentType('isa')}
                  >
                    <Landmark className="h-5 w-5" />
                    <span className="text-xs">Stocks & Shares ISA</span>
                  </Button>
                  <Button
                    type="button"
                    variant={investmentType === 'general' ? 'default' : 'outline'}
                    className="flex flex-col items-center justify-center h-20 gap-2"
                    onClick={() => setInvestmentType('general')}
                  >
                    <TrendingUp className="h-5 w-5" />
                    <span className="text-xs">General Investment</span>
                  </Button>
                  <Button
                    type="button"
                    variant={investmentType === 'pension' ? 'default' : 'outline'}
                    className="flex flex-col items-center justify-center h-20 gap-2"
                    onClick={() => setInvestmentType('pension')}
                  >
                    <Calendar className="h-5 w-5" />
                    <span className="text-xs">Pension</span>
                  </Button>
                </div>
              </div>
              
              {/* Initial Investment */}
              <div className="grid gap-2">
                <Label htmlFor="initialInvestment" className="font-medium flex items-center">
                  <PoundSterling className="h-4 w-4 mr-1 text-primary" />
                  Initial Investment
                </Label>
                <div className="space-y-2">
                  <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                      <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Input
                        id="initialInvestment"
                        type="number"
                        value={initialInvestment}
                        onChange={handleInitialInvestmentChange}
                        className="pl-10"
                        min={0}
                      />
                    </div>
                    <span className="font-medium">{formatCurrency(initialInvestment)}</span>
                  </div>
                  <Slider
                    value={[initialInvestment]}
                    min={0}
                    max={50000}
                    step={500}
                    onValueChange={handleInitialInvestmentSliderChange}
                  />
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>£0</span>
                    <span>£50,000</span>
                  </div>
                </div>
              </div>
              
              {/* Monthly Contribution */}
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
                        onChange={handleMonthlyContributionChange}
                        className="pl-10"
                        min={0}
                      />
                    </div>
                    <span className="font-medium">{formatCurrency(monthlyContribution)}</span>
                  </div>
                  <Slider
                    value={[monthlyContribution]}
                    min={0}
                    max={1000}
                    step={25}
                    onValueChange={handleMonthlyContributionSliderChange}
                  />
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>£0</span>
                    <span>£1,000</span>
                  </div>
                </div>
              </div>
              
              {/* Annual Return Rate */}
              <div className="grid gap-2">
                <Label htmlFor="investmentReturnRate" className="font-medium flex items-center">
                  <BarChart className="h-4 w-4 mr-1 text-primary" />
                  Annual Return Rate (%)
                </Label>
                <div className="space-y-2">
                  <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                      <Input
                        id="investmentReturnRate"
                        type="number"
                        value={investmentReturnRate}
                        onChange={handleInvestmentReturnRateChange}
                        min={0}
                        max={30}
                        step={0.1}
                      />
                    </div>
                    <span className="font-medium">{investmentReturnRate}%</span>
                  </div>
                  <Slider
                    value={[investmentReturnRate]}
                    min={0}
                    max={12}
                    step={0.1}
                    onValueChange={handleInvestmentReturnRateSliderChange}
                  />
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>0%</span>
                    <span>12%</span>
                  </div>
                </div>
              </div>
              
              {/* Investment Term */}
              <div className="grid gap-2">
                <Label htmlFor="investmentTerm" className="font-medium flex items-center">
                  <Calendar className="h-4 w-4 mr-1 text-primary" />
                  Investment Term (years)
                </Label>
                <div className="space-y-2">
                  <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                      <Input
                        id="investmentTerm"
                        type="number"
                        value={investmentTerm}
                        onChange={handleInvestmentTermChange}
                        min={1}
                        max={50}
                      />
                    </div>
                    <span className="font-medium">{investmentTerm} years</span>
                  </div>
                  <Slider
                    value={[investmentTerm]}
                    min={1}
                    max={50}
                    step={1}
                    onValueChange={handleInvestmentTermSliderChange}
                  />
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>1 year</span>
                    <span>50 years</span>
                  </div>
                </div>
              </div>
              
              {/* Tax Rate (only for general investments) */}
              {investmentType === 'general' && (
                <div className="grid gap-2">
                  <Label htmlFor="taxRate" className="font-medium flex items-center">
                    <DollarSign className="h-4 w-4 mr-1 text-primary" />
                    Capital Gains Tax Rate (%)
                  </Label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-4">
                      <div className="relative flex-1">
                        <Input
                          id="taxRate"
                          type="number"
                          value={taxRate}
                          onChange={handleTaxRateChange}
                          min={0}
                          max={40}
                          step={1}
                        />
                      </div>
                      <span className="font-medium">{taxRate}%</span>
                    </div>
                    <Slider
                      value={[taxRate]}
                      min={0}
                      max={40}
                      step={1}
                      onValueChange={handleTaxRateSliderChange}
                    />
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>0%</span>
                      <span>40%</span>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button
                  onClick={calculateInvestment}
                  className="flex-1 gap-2"
                  size="lg"
                >
                  Calculate <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={resetInvestmentForm}
                  className="gap-2"
                >
                  <RefreshCw className="h-4 w-4" /> Reset
                </Button>
              </div>
            </div>
          </CardContent>
          
          {/* Investment Results */}
          {investmentResults && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.3 }}
            >
              <CardContent className="border-t pt-6">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-slate-50 dark:bg-slate-900">
                      <CardContent className="p-4 flex flex-col items-center justify-center h-32">
                        <p className="text-sm text-slate-500 dark:text-slate-400">Final Balance</p>
                        <p className="text-2xl font-bold">{formatCurrency(investmentResults.finalBalance)}</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-slate-50 dark:bg-slate-900">
                      <CardContent className="p-4 flex flex-col items-center justify-center h-32">
                        <p className="text-sm text-slate-500 dark:text-slate-400">Total Contributions</p>
                        <p className="text-2xl font-bold">{formatCurrency(investmentResults.totalContributions)}</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-slate-50 dark:bg-slate-900">
                      <CardContent className="p-4 flex flex-col items-center justify-center h-32">
                        <p className="text-sm text-slate-500 dark:text-slate-400">Total Growth</p>
                        <p className="text-2xl font-bold text-green-600">{formatCurrency(investmentResults.totalGains)}</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-medium">Investment Growth Over Time</h3>
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={investmentResults.growthPoints}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="year" 
                            label={{ 
                              value: 'Years', 
                              position: 'insideBottomRight', 
                              offset: -10 
                            }} 
                          />
                          <YAxis
                            tickFormatter={(value) => `£${(value / 1000).toFixed(0)}k`}
                            label={{
                              value: 'Amount (£)',
                              angle: -90,
                              position: 'insideLeft',
                            }}
                          />
                          <Tooltip
                            formatter={(value) => [`£${Number(value).toFixed(2)}`, '']}
                            labelFormatter={(label) => `Year ${label}`}
                          />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="balance"
                            name="Balance"
                            stroke="#4f46e5"
                            activeDot={{ r: 8 }}
                          />
                          <Line
                            type="monotone"
                            dataKey="contributions"
                            name="Contributions"
                            stroke="#059669"
                          />
                          <Line
                            type="monotone"
                            dataKey="gains"
                            name="Growth"
                            stroke="#0ea5e9"
                          />
                          {investmentType === 'general' && (
                            <Line
                              type="monotone"
                              dataKey="taxPaid"
                              name="Tax Paid"
                              stroke="#ef4444"
                            />
                          )}
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </CardContent>
            </motion.div>
          )}
        </TabsContent>
      </Tabs>
      
      <CardFooter className="flex justify-between border-t p-6">
        <div className="text-sm text-slate-500 dark:text-slate-400 italic">
          <p>Note: This calculator is for educational purposes only and should not be considered financial advice.</p>
        </div>
      </CardFooter>
    </Card>
  );
}
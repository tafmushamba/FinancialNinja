import React, { useState } from 'react';
import { BudgetCalculator } from '@/components/calculators/budget-calculator';
import { LoanInvestmentCalculator } from '@/components/calculators/loan-investment-calculator';
import { RetirementCalculator } from '@/components/calculators/retirement-calculator';
import { TaxCalculator } from '@/components/calculators/tax-calculator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calculator, PiggyBank, LineChart, CreditCard, Calendar, Building } from 'lucide-react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';

export default function FinancialCalculators() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState('budget');
  
  const handleBack = () => {
    navigate('/dashboard');
  };
  
  // Animation variants for the page content
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 },
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.5,
  };

  return (
    <motion.div 
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="min-h-screen bg-gradient-to-b from-background to-slate-50 dark:from-background dark:to-slate-900/50"
    >
      <div className="container mx-auto px-4 py-12">
        <div className="mb-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3 flex items-center gap-3">
              <img src="/images/mascot.svg" alt="Money Mind Mascot" className="h-10 w-10 md:h-12 md:w-12" />
              Financial Calculators
            </h1>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-3xl"> 
              Interactive tools to plan, simulate scenarios, and make informed financial decisions.
            </p>
          </motion.div>
        </div>
        
        <Tabs 
          defaultValue="budget" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full mb-16"
        >
          <div className="flex justify-center mb-10"> 
            <TabsList className="inline-flex h-auto items-center justify-center rounded-full bg-muted p-1 text-muted-foreground"> 
              <TabsTrigger value="budget" className="inline-flex items-center justify-center whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm">
                <PiggyBank className="h-4 w-4 mr-2" />
                Budget
              </TabsTrigger>
              <TabsTrigger value="loan-investment" className="inline-flex items-center justify-center whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm">
                <LineChart className="h-4 w-4 mr-2" />
                Loan/Invest
              </TabsTrigger>
              <TabsTrigger value="retirement" className="inline-flex items-center justify-center whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm">
                <Calendar className="h-4 w-4 mr-2" />
                Retirement
              </TabsTrigger>
              <TabsTrigger value="tax" className="inline-flex items-center justify-center whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm">
                <Building className="h-4 w-4 mr-2" />
                Tax
              </TabsTrigger>
            </TabsList>
          </div>
          
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="max-w-4xl mx-auto"
          >
            <TabsContent value="budget" className="mt-0">
              <div className="glass rounded-lg shadow-lg p-8 border border-border/20"> 
                <div className="mb-6 flex items-center gap-4"> 
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <PiggyBank className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-grow"> 
                    <h3 className="text-2xl font-bold mb-1">Budget Calculator</h3>
                    <p className="text-slate-600 dark:text-slate-300 text-sm">
                      Allocate income, track spending, visualize expenses. Create a plan.
                    </p>
                  </div>
                </div>
                <BudgetCalculator />
              </div>
            </TabsContent>
            
            <TabsContent value="loan-investment" className="mt-0">
              <div className="glass rounded-lg shadow-lg p-8 border border-border/20">
                <div className="mb-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <LineChart className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-2xl font-bold mb-1">Loan & Investment Calculator</h3>
                    <p className="text-slate-600 dark:text-slate-300 text-sm">
                      Analyze repayments, compare rates, project growth. Understand compounding.
                    </p>
                  </div>
                </div>
                <LoanInvestmentCalculator />
              </div>
            </TabsContent>
             
            <TabsContent value="retirement" className="mt-0">
              <div className="glass rounded-lg shadow-lg p-8 border border-border/20">
                <div className="mb-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-2xl font-bold mb-1">Retirement Calculator</h3>
                    <p className="text-slate-600 dark:text-slate-300 text-sm">
                      Simulate savings growth, estimate income needs, visualize factors.
                    </p>
                  </div>
                </div>
                <RetirementCalculator />
              </div>
            </TabsContent>
             
            <TabsContent value="tax" className="mt-0">
              <div className="glass rounded-lg shadow-lg p-8 border border-border/20">
                <div className="mb-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Building className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-2xl font-bold mb-1">UK Tax Calculator</h3>
                    <p className="text-slate-600 dark:text-slate-300 text-sm">
                      Estimate income tax, NI, student loan, take-home pay. See breakdown.
                    </p>
                  </div>
                </div>
                <TaxCalculator />
              </div>
            </TabsContent>
          </motion.div>
        </Tabs>
        
        <div className="max-w-4xl mx-auto glass rounded-lg p-6 md:p-8 border border-border/20 mt-12"> 
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            Why Use Financial Calculators?
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="space-y-2">
              <h4 className="font-medium">Make Informed Decisions</h4>
              <p className="text-slate-600 dark:text-slate-300 text-sm">
                Understand the long-term impact of financial choices before you make them. See how different scenarios affect your financial future.
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Plan for Goals</h4>
              <p className="text-slate-600 dark:text-slate-300 text-sm">
                Whether saving for a house deposit, planning for retirement, or managing debt, calculators help you create realistic plans.
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Visualize Your Finances</h4>
              <p className="text-slate-600 dark:text-slate-300 text-sm">
                Interactive charts and visuals help you understand complex financial concepts and see patterns in your financial behavior.
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">UK Financial Context</h4>
              <p className="text-slate-600 dark:text-slate-300 text-sm">
                Our calculators are tailored for the UK market, including ISAs, UK tax rates, and other UK-specific financial products.
              </p>
            </div>
          </div>
          
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-4 italic">
            Note: These calculators are for educational purposes only and should not be considered financial advice. Always consult with a qualified financial advisor for personalized recommendations.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
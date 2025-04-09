import React, { useState } from 'react';
import { BudgetCalculator } from '@/components/calculators/budget-calculator';
import { LoanInvestmentCalculator } from '@/components/calculators/loan-investment-calculator';
import { RetirementCalculator } from '@/components/calculators/retirement-calculator';
import { TaxCalculator } from '@/components/calculators/tax-calculator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calculator, PiggyBank, LineChart, CreditCard, Calendar, Building } from 'lucide-react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';

export default function FinancialCalculators() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState('budget');
  
  const handleBack = () => {
    navigate('/');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-slate-50 dark:from-background dark:to-slate-900/50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="mb-4 gap-2 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold tracking-tight mb-2 flex items-center gap-3">
              <img src="/images/mascot.svg" alt="FinancialNinja Mascot" className="h-10 w-10" />
              Financial Calculators
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl">
              Interactive tools to help you plan your finances, simulate different scenarios, and make informed financial decisions.
            </p>
          </motion.div>
        </div>
        
        <Tabs 
          defaultValue="budget" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full mb-16"
        >
          <TabsList className="grid grid-cols-4 w-full max-w-md mb-8">
            <TabsTrigger value="budget" className="flex items-center gap-2">
              <PiggyBank className="h-4 w-4" />
              <span>Budget</span>
            </TabsTrigger>
            <TabsTrigger value="loan-investment" className="flex items-center gap-2">
              <LineChart className="h-4 w-4" />
              <span>Loan/Invest</span>
            </TabsTrigger>
            <TabsTrigger value="retirement" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Retirement</span>
            </TabsTrigger>
            <TabsTrigger value="tax" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              <span>Tax</span>
            </TabsTrigger>
          </TabsList>
          
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <TabsContent value="budget" className="mt-0">
              <div className="space-y-6">
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg border p-8">
                  <div className="mb-6 flex items-start">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4 shrink-0">
                      <PiggyBank className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-2">Budget Calculator</h3>
                      <p className="text-slate-600 dark:text-slate-300">
                        Create a personalised budget by allocating your income across different spending categories. Visualize your spending and get recommendations for improving your financial health.
                      </p>
                    </div>
                  </div>
                  
                  <BudgetCalculator />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="loan-investment" className="mt-0">
              <div className="space-y-6">
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg border p-8">
                  <div className="mb-6 flex items-start">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4 shrink-0">
                      <CreditCard className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-2">Loan & Investment Calculator</h3>
                      <p className="text-slate-600 dark:text-slate-300">
                        Calculate loan repayments, interest costs, and simulate investment growth over time. Compare different scenarios to make informed financial decisions.
                      </p>
                    </div>
                  </div>
                  
                  <LoanInvestmentCalculator />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="retirement" className="mt-0">
              <div className="space-y-6">
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg border p-8">
                  <div className="mb-6 flex items-start">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4 shrink-0">
                      <Calendar className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-2">Retirement Calculator</h3>
                      <p className="text-slate-600 dark:text-slate-300">
                        Plan for your future by simulating retirement savings growth, estimating income needs, and visualizing how different factors affect your retirement readiness.
                      </p>
                    </div>
                  </div>
                  
                  <RetirementCalculator />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="tax" className="mt-0">
              <div className="space-y-6">
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg border p-8">
                  <div className="mb-6 flex items-start">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4 shrink-0">
                      <Building className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-2">UK Tax Calculator</h3>
                      <p className="text-slate-600 dark:text-slate-300">
                        Estimate your income tax, national insurance, student loan repayments, and take-home pay based on your salary and other income sources. See a detailed breakdown of your tax obligations.
                      </p>
                    </div>
                  </div>
                  
                  <TaxCalculator />
                </div>
              </div>
            </TabsContent>
          </motion.div>
        </Tabs>
        
        <div className="max-w-4xl mx-auto bg-slate-100 dark:bg-slate-800/50 rounded-lg p-6 border mt-8">
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
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
    </div>
  );
}
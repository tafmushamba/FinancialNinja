import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Sidebar from '@/components/layout/sidebar';
import MobileNav from '@/components/layout/mobile-nav';
import Header from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import TerminalText from '@/components/ui/terminal-text';

const FinanceTracker: React.FC = () => {
  const { data: financialData, isLoading } = useQuery({
    queryKey: ['/api/finance/details'],
  });

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
        <Header title="Finance Tracker" />
        
        <div className="p-4 md:p-6">
          <section className="mb-8 animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-mono font-bold">
                <TerminalText>Financial Dashboard</TerminalText>
              </h1>
              <Button 
                className="bg-neon-green bg-opacity-20 hover:bg-opacity-30 text-neon-green border-neon-green border-opacity-30"
                variant="outline"
              >
                <i className="fas fa-plus mr-2"></i>
                Connect Account
              </Button>
            </div>
            
            {/* Financial Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card className="bg-dark-800 border-dark-600">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Balance</p>
                      <p className="text-2xl font-bold text-white mt-1">
                        {isLoading ? '$0.00' : financialData?.totalBalance}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-neon-green bg-opacity-20 text-neon-green">
                      <i className="fas fa-wallet"></i>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-dark-800 border-dark-600">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Monthly Income</p>
                      <p className="text-2xl font-bold text-white mt-1">
                        {isLoading ? '$0.00' : financialData?.monthlyIncome}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-neon-cyan bg-opacity-20 text-neon-cyan">
                      <i className="fas fa-arrow-down"></i>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-dark-800 border-dark-600">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Monthly Expenses</p>
                      <p className="text-2xl font-bold text-white mt-1">
                        {isLoading ? '$0.00' : financialData?.monthlyExpenses}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-neon-red bg-opacity-20 text-neon-red">
                      <i className="fas fa-arrow-up"></i>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-dark-800 border-dark-600">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Savings Rate</p>
                      <p className="text-2xl font-bold text-white mt-1">
                        {isLoading ? '0%' : financialData?.savingsRate}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-neon-purple bg-opacity-20 text-neon-purple">
                      <i className="fas fa-piggy-bank"></i>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Main Financial Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Spending Analysis */}
              <Card className="lg:col-span-2 bg-dark-800 border-dark-600">
                <CardHeader>
                  <CardTitle className="font-mono">Spending Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="h-64 flex items-center justify-center">
                      <p className="text-gray-400">Loading spending data...</p>
                    </div>
                  ) : financialData?.connected ? (
                    <div>
                      {/* This would contain the spending chart */}
                      <div className="h-64 bg-dark-700 rounded flex items-center justify-center">
                        <i className="fas fa-chart-bar text-4xl text-neon-green mb-2"></i>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                        {financialData?.topCategories?.map((category: any, index: number) => (
                          <div key={index} className="bg-dark-700 p-3 rounded">
                            <div className="flex items-center">
                              <div className={`w-8 h-8 rounded-full bg-${category.color} bg-opacity-20 flex items-center justify-center mr-3`}>
                                <i className={`fas ${category.icon} text-${category.color}`}></i>
                              </div>
                              <div>
                                <p className="text-sm">{category.name}</p>
                                <p className="text-xs text-gray-400">{category.amount} ({category.percentage}%)</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="h-64 flex flex-col items-center justify-center">
                      <i className="fas fa-link-slash text-4xl text-gray-400 mb-4"></i>
                      <p className="text-gray-400 mb-4">No financial accounts connected</p>
                      <Button 
                        className="bg-neon-green bg-opacity-20 hover:bg-opacity-30 text-neon-green"
                        variant="outline"
                      >
                        Connect Account
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Budget Status */}
              <Card className="bg-dark-800 border-dark-600">
                <CardHeader>
                  <CardTitle className="font-mono">Budget Status</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="text-center py-4">
                      <p className="text-gray-400">Loading budget data...</p>
                    </div>
                  ) : financialData?.connected ? (
                    <div className="space-y-4">
                      {financialData?.budgets?.map((budget: any, index: number) => (
                        <div key={index} className="bg-dark-700 p-4 rounded">
                          <div className="flex justify-between mb-2">
                            <p className="text-sm font-medium">{budget.category}</p>
                            <p className="text-sm">
                              <span className={budget.status === 'over' ? 'text-neon-red' : 'text-neon-green'}>
                                {budget.spent}
                              </span> 
                              <span className="text-gray-400">/ {budget.limit}</span>
                            </p>
                          </div>
                          <div className="w-full bg-dark-600 rounded-full h-2">
                            <div 
                              className={`${
                                budget.status === 'over' ? 'bg-neon-red' : 'bg-neon-green'
                              } h-2 rounded-full`} 
                              style={{ width: `${Math.min(100, budget.percentage)}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-400 mt-1">
                            {budget.status === 'over' 
                              ? `${budget.overAmount} over budget` 
                              : `${budget.remainingAmount} remaining`}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-400">Connect an account to track budgets</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </main>
      
      <MobileNav />
    </div>
  );
};

export default FinanceTracker;

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TerminalText from '@/components/ui/terminal-text';

const FinancialOverview: React.FC = () => {
  const { data: financialData, isLoading } = useQuery({
    queryKey: ['/api/finance/overview'],
  });

  const { data: insightsData, isLoading: insightsLoading } = useQuery({
    queryKey: ['/api/finance/insights'],
  });

  return (
    <section className="mb-8 animate-fadeIn">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-mono font-bold">
          <TerminalText>Financial Overview</TerminalText>
        </h3>
        <Button variant="link" className="text-neon-green text-sm p-0 h-auto">
          <span>Connect Account</span>
          <i className="fas fa-plus ml-1"></i>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Spending Overview */}
        <Card className="lg:col-span-2 bg-dark-800 border-dark-600">
          <CardHeader className="pb-0">
            <CardTitle className="font-mono font-bold text-lg">Monthly Spending Overview</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {/* Chart Placeholder */}
            <div className="h-64 bg-dark-700 rounded flex items-center justify-center">
              {isLoading ? (
                <div className="text-center">
                  <p className="text-gray-400">Loading financial data...</p>
                </div>
              ) : financialData?.connected ? (
                <div className="w-full h-full">
                  {/* Chart would be rendered here */}
                  <div className="text-center">
                    <i className="fas fa-chart-bar text-4xl text-neon-green mb-2"></i>
                    <p className="text-gray-400">Spending chart would render here</p>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <i className="fas fa-chart-bar text-4xl text-neon-green mb-2"></i>
                  <p className="text-gray-400">Connect your accounts to track spending</p>
                  <Button 
                    className="mt-3 bg-neon-green bg-opacity-20 hover:bg-opacity-30 text-neon-green border-neon-green border-opacity-30"
                    variant="outline"
                  >
                    Connect Account
                  </Button>
                </div>
              )}
            </div>
            
            {/* Spending Categories */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              {financialData?.categories?.map((category: any, index: number) => (
                <div key={index} className="bg-dark-700 p-3 rounded">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full bg-${category.color} bg-opacity-20 flex items-center justify-center mr-3`}>
                      <i className={`fas ${category.icon} text-${category.color}`}></i>
                    </div>
                    <div>
                      <p className="text-sm">{category.name}</p>
                      <p className="text-xs text-gray-400">{category.percentage}% of budget</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* AI Financial Insights */}
        <Card className="bg-dark-800 border-dark-600">
          <CardHeader className="pb-0">
            <CardTitle className="font-mono font-bold text-lg">AI Financial Insights</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {insightsLoading ? (
                <div className="text-center py-4">
                  <p className="text-gray-400">Loading insights...</p>
                </div>
              ) : (
                <>
                  {insightsData?.insights?.map((insight: any, index: number) => (
                    <div key={index} className="bg-dark-700 p-4 rounded">
                      <div className="flex items-start">
                        <div className={`w-8 h-8 rounded-full bg-${insight.color} bg-opacity-20 flex items-center justify-center mr-3 mt-1`}>
                          <i className={`fas ${insight.icon} text-${insight.color}`}></i>
                        </div>
                        <div>
                          <h5 className="text-sm font-bold">{insight.title}</h5>
                          <p className="text-xs text-gray-400 mt-1">{insight.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
            
            <Button className="mt-4 w-full bg-dark-700 hover:bg-dark-600 text-white text-sm">
              View All Insights
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default FinancialOverview;

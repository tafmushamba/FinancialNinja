import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { default as TerminalText } from '@/components/ui/terminal-text';

const FinancialOverview: React.FC = () => {
  const { data: financialData, isLoading } = useQuery({
    queryKey: ['/api/finance/overview'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/finance/overview');
        if (!response.ok) {
          throw new Error('Failed to fetch financial overview');
        }
        return response.json();
      } catch (error) {
        console.error('Error fetching financial overview:', error);
        return {
          connected: false,
          categories: [
            { name: 'Housing', percentage: 35, color: 'neon-green', icon: 'fa-home' },
            { name: 'Food', percentage: 20, color: 'neon-cyan', icon: 'fa-utensils' },
            { name: 'Transport', percentage: 15, color: 'neon-purple', icon: 'fa-car' }
          ]
        };
      }
    }
  });

  const { data: insightsData, isLoading: insightsLoading } = useQuery({
    queryKey: ['/api/finance/insights'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/finance/insights');
        if (!response.ok) {
          throw new Error('Failed to fetch financial insights');
        }
        return response.json();
      } catch (error) {
        console.error('Error fetching financial insights:', error);
        return {
          insights: [
            { 
              title: 'Spending Pattern',
              description: 'Your food expenses have increased by 15% this month.',
              color: 'neon-red',
              icon: 'fa-utensils'
            },
            { 
              title: 'Saving Opportunity',
              description: 'You could save $45 monthly by reducing subscription services.',
              color: 'neon-green',
              icon: 'fa-piggy-bank'
            }
          ]
        };
      }
    }
  });

  return (
    <section className="mb-8 animate-fadeIn">
      <div className="flex justify-between items-center mb-4 px-2">
        <h3 className="text-lg font-mono font-bold text-foreground">
          <TerminalText>$ Financial Overview</TerminalText>
        </h3>
        <Button variant="outline" className="text-neon-green text-sm border-neon-green/30 bg-neon-green/10 hover:bg-neon-green/20 transition-colors">
          <span>Connect Account</span>
          <i className="fas fa-plus ml-1 text-xs"></i>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Spending Overview */}
        <Card className="lg:col-span-2 bg-dark-800 border border-dark-600 shadow-lg hover:shadow-neon-green/20 transition-shadow hover:border-neon-green/30 overflow-hidden glow-border">
          <CardHeader className="pb-0">
            <CardTitle className="font-mono font-bold text-lg text-foreground flex items-center">
              <i className="fas fa-chart-bar text-neon-green mr-2"></i>
              Monthly Spending Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {/* Chart Placeholder */}
            <div className="h-64 bg-dark-700 rounded-md flex items-center justify-center overflow-hidden">
              {isLoading ? (
                <div className="text-center">
                  <div className="animate-pulse">
                    <div className="h-4 w-32 bg-dark-600 rounded mb-3 mx-auto"></div>
                    <div className="h-32 w-64 bg-dark-600 rounded mx-auto"></div>
                  </div>
                </div>
              ) : financialData?.connected ? (
                <div className="w-full h-full">
                  {/* Chart would be rendered here */}
                  <div className="text-center">
                    <i className="fas fa-chart-bar text-4xl text-neon-green mb-2 animate-pulse-slow"></i>
                    <p className="text-muted-foreground">Spending chart would render here</p>
                  </div>
                </div>
              ) : (
                <div className="text-center p-6">
                  <i className="fas fa-chart-bar text-4xl text-neon-green mb-3 animate-pulse-slow"></i>
                  <p className="text-muted-foreground mb-4">Connect your accounts to track spending</p>
                  <Button 
                    className="bg-neon-green/20 hover:bg-neon-green/30 text-neon-green border-neon-green/30"
                    variant="outline"
                  >
                    <i className="fas fa-plug mr-2"></i>
                    Connect Account
                  </Button>
                </div>
              )}
            </div>
            
            {/* Spending Categories */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              {financialData?.categories?.map((category: any, index: number) => (
                <div key={index} className="bg-dark-700 p-3 rounded-md border border-dark-600 hover:border-primary/30 transition-colors shadow-md">
                  <div className="flex items-center">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center mr-3 shadow-lg"
                      style={{ 
                        backgroundColor: `hsla(var(--${category.color || 'neon-green'}-hsl) / 0.2)`,
                        boxShadow: `0 0 10px hsla(var(--${category.color || 'neon-green'}-hsl) / 0.3)` 
                      }}
                    >
                      <i 
                        className={`fas ${category.icon}`}
                        style={{ color: `var(--${category.color || 'neon-green'})` }}
                      ></i>
                    </div>
                    <div>
                      <p className="text-sm text-foreground font-semibold">{category.name}</p>
                      <p className="text-xs text-muted-foreground">
                        <span 
                          className="font-semibold" 
                          style={{ color: `var(--${category.color || 'neon-green'})` }}
                        >
                          {category.percentage}%
                        </span> of budget
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* AI Financial Insights */}
        <Card className="bg-dark-800 border border-dark-600 shadow-lg hover:shadow-neon-cyan/20 transition-shadow hover:border-neon-cyan/30 overflow-hidden glow-border">
          <CardHeader className="pb-0">
            <CardTitle className="font-mono font-bold text-lg text-foreground flex items-center">
              <i className="fas fa-robot text-neon-cyan mr-2"></i>
              AI Financial Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {insightsLoading ? (
                <div className="animate-pulse space-y-3">
                  <div className="h-16 bg-dark-700 rounded"></div>
                  <div className="h-16 bg-dark-700 rounded"></div>
                </div>
              ) : (
                <>
                  {insightsData?.insights?.map((insight: any, index: number) => (
                    <div key={index} className="bg-dark-700 p-4 rounded-md border border-dark-600 hover:border-primary/30 transition-colors shadow-md">
                      <div className="flex items-start">
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center mr-3 mt-1 shadow-lg"
                          style={{ 
                            backgroundColor: `hsla(var(--${insight.color || 'neon-green'}-hsl) / 0.2)`,
                            boxShadow: `0 0 10px hsla(var(--${insight.color || 'neon-green'}-hsl) / 0.3)` 
                          }}
                        >
                          <i 
                            className={`fas ${insight.icon}`}
                            style={{ color: `var(--${insight.color || 'neon-green'})` }}
                          ></i>
                        </div>
                        <div>
                          <h5 
                            className="text-sm font-bold" 
                            style={{ color: `var(--${insight.color || 'neon-green'})` }}
                          >
                            {insight.title}
                          </h5>
                          <p className="text-xs text-muted-foreground mt-1">{insight.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
            
            <Button 
              className="mt-6 w-full bg-dark-700 hover:bg-dark-600 text-foreground text-sm border border-neon-cyan/20 hover:border-neon-cyan/40 transition-colors shadow-sm hover:shadow-neon-cyan/20"
              variant="outline"
            >
              <span>View All Insights</span>
              <i className="fas fa-arrow-right ml-2 text-xs text-neon-cyan"></i>
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default FinancialOverview;

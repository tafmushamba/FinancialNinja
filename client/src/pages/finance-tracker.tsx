import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const FinanceTracker: React.FC = () => {
  const { data: financeData, isLoading: financeLoading } = useQuery({
    queryKey: ['/api/finance/overview'],
  });

  const { data: insightsData, isLoading: insightsLoading } = useQuery({
    queryKey: ['/api/finance/insights'],
  });

  return (
    <div className="p-4">
      <section className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-normal text-muted-foreground">Total Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{financeLoading ? 'Loading...' : financeData?.totalBalance || '£0.00'}</div>
              <p className="text-xs text-muted-foreground mt-1">Across all accounts</p>
            </CardContent>
          </Card>
          
          <Card highlight={true}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-normal text-muted-foreground">Monthly Income</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">+{financeLoading ? 'Loading...' : financeData?.monthlyIncome || '£0.00'}</div>
              <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-normal text-muted-foreground">Monthly Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">-{financeLoading ? 'Loading...' : financeData?.monthlyExpenses || '£0.00'}</div>
              <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="accounts" className="w-full">
          <TabsList className="bg-dark-800 border border-dark-600">
            <TabsTrigger value="accounts" className="data-[state=active]:bg-dark-700">Accounts</TabsTrigger>
            <TabsTrigger value="transactions" className="data-[state=active]:bg-dark-700">Transactions</TabsTrigger>
            <TabsTrigger value="budgets" className="data-[state=active]:bg-dark-700">Budgets</TabsTrigger>
            <TabsTrigger value="insights" className="data-[state=active]:bg-dark-700">Insights</TabsTrigger>
          </TabsList>
          
          <TabsContent value="accounts" className="mt-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Your Accounts</CardTitle>
                  <Button className="bg-neon-green text-black hover:bg-opacity-80">
                    <i className="fas fa-plus mr-2"></i> Add Account
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {financeLoading ? (
                  <p>Loading accounts...</p>
                ) : !financeData?.connected ? (
                  <div className="text-center py-8">
                    <div className="mb-4 text-6xl opacity-20">
                      <i className="fas fa-link-slash"></i>
                    </div>
                    <h3 className="text-lg font-medium mb-2">No Connected Accounts</h3>
                    <p className="text-muted-foreground mb-4">
                      Connect your bank accounts to track your finances automatically
                    </p>
                    <Button className="bg-neon-green text-black hover:bg-opacity-80">
                      <i className="fas fa-link mr-2"></i> Connect Bank
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {financeData?.accounts?.map((account) => (
                      <div key={account.id} className="flex justify-between items-center p-4 bg-dark-700 rounded-md glass-card">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                            <i className="fas fa-building text-blue-500"></i>
                          </div>
                          <div>
                            <h4 className="font-medium">{account.name}</h4>
                            <p className="text-xs text-muted-foreground">{account.type}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{account.balance}</p>
                          <p className="text-xs text-muted-foreground">{account.lastUpdated}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="transactions" className="mt-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Recent Transactions</CardTitle>
                  <div className="flex items-center gap-2">
                    <Input 
                      placeholder="Search transactions..." 
                      className="w-60 bg-dark-700 border-dark-600"
                    />
                    <Select defaultValue="all">
                      <SelectTrigger className="w-40 bg-dark-700 border-dark-600">
                        <SelectValue placeholder="Filter by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Transactions</SelectItem>
                        <SelectItem value="income">Income</SelectItem>
                        <SelectItem value="expense">Expenses</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 glass-card glow-border rounded-md">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center mr-3">
                        <i className="fas fa-shopping-cart text-red-500"></i>
                      </div>
                      <div>
                        <h4 className="font-medium">Grocery Store</h4>
                        <p className="text-xs text-muted-foreground">Today • Shopping</p>
                      </div>
                    </div>
                    <p className="font-medium text-red-500">-£42.75</p>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 glass-card glow-border card-highlight rounded-md">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center mr-3">
                        <i className="fas fa-building text-green-500"></i>
                      </div>
                      <div>
                        <h4 className="font-medium">Salary</h4>
                        <p className="text-xs text-muted-foreground">Yesterday • Income</p>
                      </div>
                    </div>
                    <p className="font-medium text-green-500">+£2,450.00</p>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 glass-card glow-border rounded-md">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center mr-3">
                        <i className="fas fa-utensils text-red-500"></i>
                      </div>
                      <div>
                        <h4 className="font-medium">Restaurant</h4>
                        <p className="text-xs text-muted-foreground">3 days ago • Food</p>
                      </div>
                    </div>
                    <p className="font-medium text-red-500">-£28.50</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="budgets" className="mt-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Monthly Budgets</CardTitle>
                  <Button className="bg-neon-green text-black hover:bg-opacity-80">
                    <i className="fas fa-plus mr-2"></i> Create Budget
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-1">
                      <h4 className="font-medium">Groceries</h4>
                      <p className="text-sm">£320 / £400</p>
                    </div>
                    <div className="w-full bg-dark-600 h-2 rounded-full">
                      <div className="bg-amber-500 h-2 rounded-full" style={{ width: '80%' }}></div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">20% remaining</p>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <h4 className="font-medium">Entertainment</h4>
                      <p className="text-sm">£95 / £150</p>
                    </div>
                    <div className="w-full bg-dark-600 h-2 rounded-full">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '63%' }}></div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">37% remaining</p>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <h4 className="font-medium">Dining Out</h4>
                      <p className="text-sm">£210 / £200</p>
                    </div>
                    <div className="w-full bg-dark-600 h-2 rounded-full">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: '105%' }}></div>
                    </div>
                    <p className="text-xs text-red-400 mt-1">Over budget by £10</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="insights" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Financial Insights</CardTitle>
              </CardHeader>
              <CardContent>
                {insightsLoading ? (
                  <p>Loading insights...</p>
                ) : (
                  <div className="space-y-6">
                    {insightsData?.insights?.map((insight, index) => (
                      <div key={index} className="p-4 glass-card glow-border rounded-md">
                        <h4 className="font-medium mb-2">{insight.title}</h4>
                        <p className="text-sm text-muted-foreground mb-4">{insight.description}</p>
                        <div className="flex items-center text-xs text-neon-green">
                          <i className="fas fa-lightbulb mr-2"></i>
                          <span>Potential savings: {insight.potentialSavings}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
};

export default FinanceTracker;
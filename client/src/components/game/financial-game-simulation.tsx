import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { apiRequest } from '@/lib/queryClient';
import { ArrowRight, Calendar, Clock, Landmark, User } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { FinancialMetrics, FinancialMetricsType } from './financial-metrics';
import { GameMessage } from './game-message';
import { AchievementsList } from './achievements-list';

interface FinancialGameSimulationProps {
  career: string;
}

interface GameState {
  stage: 'welcome' | 'initialization' | 'making_decisions' | 'conclusion';
  playerName: string;
  careerPath: string;
  income: number;
  expenses: number;
  savings: number;
  debt: number;
  xpEarned: number;
  level: number;
  achievements: string[];
  message: string | null;
  isLoading: boolean;
  roundCount: number;
  nextStep: 'continue' | 'conclude';
}

export function FinancialGameSimulation({ career }: FinancialGameSimulationProps) {
  const [playerName, setPlayerName] = useState('');
  const [selectedDecision, setSelectedDecision] = useState('');
  const [gameState, setGameState] = useState<GameState>({
    stage: 'welcome',
    playerName: '',
    careerPath: career,
    income: 0,
    expenses: 0,
    savings: 0,
    debt: 0,
    xpEarned: 0,
    level: 1,
    achievements: [],
    message: null,
    isLoading: false,
    roundCount: 0,
    nextStep: 'continue'
  });

  // Financial decisions available to the player
  const financialDecisions = [
    { value: 'savings_focus', label: 'Focus on Savings' },
    { value: 'debt_payment', label: 'Pay Down Debt' },
    { value: 'balanced_approach', label: 'Balanced Approach' },
    { value: 'investment', label: 'Invest for Growth' },
    { value: 'emergency_fund', label: 'Build Emergency Fund' },
    { value: 'budget_optimization', label: 'Optimize Budget' }
  ];

  useEffect(() => {
    // Set career path when component mounts
    setGameState(prev => ({ ...prev, careerPath: career }));
  }, [career]);

  const startGame = async () => {
    if (!playerName) return;
    
    setGameState(prev => ({ 
      ...prev, 
      isLoading: true,
      playerName
    }));
    
    try {
      const response = await apiRequest<any>('/api/financial-game/start', {
        method: 'POST',
        body: JSON.stringify({
          playerName,
          careerChoice: career
        })
      });
      
      setGameState(prev => ({ 
        ...prev, 
        stage: 'initialization',
        message: response.content,
        isLoading: false
      }));
    } catch (error) {
      console.error('Error starting game:', error);
      setGameState(prev => ({ 
        ...prev, 
        message: 'An error occurred while starting the game. Please try again.',
        isLoading: false
      }));
    }
  };

  const initializeGame = async () => {
    setGameState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const response = await apiRequest<any>('/api/financial-game/initialize', {
        method: 'POST',
        body: JSON.stringify({
          careerPath: career
        })
      });
      
      setGameState(prev => ({ 
        ...prev, 
        stage: 'making_decisions',
        message: response.content,
        income: response.income,
        expenses: response.expenses,
        savings: response.savings,
        debt: response.debt,
        xpEarned: response.xp_earned,
        level: response.level,
        achievements: response.achievements || [],
        isLoading: false
      }));
    } catch (error) {
      console.error('Error initializing game:', error);
      setGameState(prev => ({ 
        ...prev, 
        message: 'An error occurred while initializing the game. Please try again.',
        isLoading: false
      }));
    }
  };

  const makeDecision = async () => {
    if (!selectedDecision) return;
    
    const nextStep = gameState.roundCount >= 4 ? 'conclude' : 'continue';
    
    setGameState(prev => ({ 
      ...prev, 
      isLoading: true,
      nextStep
    }));
    
    try {
      const response = await apiRequest<any>('/api/financial-game/process-decision', {
        method: 'POST',
        body: JSON.stringify({
          careerPath: gameState.careerPath,
          income: gameState.income,
          expenses: gameState.expenses,
          savings: gameState.savings,
          debt: gameState.debt,
          financialDecision: selectedDecision,
          nextStep
        })
      });
      
      setGameState(prev => {
        // Check if we should move to conclusion based on the round count
        const newStage = nextStep === 'conclude' ? 'conclusion' : 'making_decisions';
        
        return { 
          ...prev, 
          stage: newStage,
          message: response.content,
          income: response.income || prev.income,
          expenses: response.expenses || prev.expenses,
          savings: response.savings || prev.savings,
          debt: response.debt || prev.debt,
          xpEarned: response.xp_earned || prev.xpEarned,
          level: response.level || prev.level,
          achievements: response.achievements || prev.achievements,
          isLoading: false,
          roundCount: prev.roundCount + 1
        };
      });
      
      // Reset decision selection
      setSelectedDecision('');
      
      // If moving to conclusion, automatically trigger the conclusion
      if (nextStep === 'conclude') {
        concludeGame();
      }
    } catch (error) {
      console.error('Error processing decision:', error);
      setGameState(prev => ({ 
        ...prev, 
        message: 'An error occurred while processing your decision. Please try again.',
        isLoading: false
      }));
    }
  };

  const concludeGame = async () => {
    setGameState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const response = await apiRequest<any>('/api/financial-game/conclude', {
        method: 'POST',
        body: JSON.stringify({
          playerName: gameState.playerName,
          careerPath: gameState.careerPath,
          xpEarned: gameState.xpEarned,
          level: gameState.level,
          achievements: gameState.achievements,
          financialDecision: selectedDecision || 'balanced_approach'
        })
      });
      
      setGameState(prev => ({ 
        ...prev, 
        stage: 'conclusion',
        message: response.content,
        xpEarned: response.final_xp || prev.xpEarned,
        level: response.final_level || prev.level,
        achievements: response.final_achievements || prev.achievements,
        isLoading: false
      }));
    } catch (error) {
      console.error('Error concluding game:', error);
      setGameState(prev => ({ 
        ...prev, 
        message: 'An error occurred while concluding the game. Please try again.',
        isLoading: false
      }));
    }
  };

  const resetGame = () => {
    setPlayerName('');
    setSelectedDecision('');
    setGameState({
      stage: 'welcome',
      playerName: '',
      careerPath: career,
      income: 0,
      expenses: 0,
      savings: 0,
      debt: 0,
      xpEarned: 0,
      level: 1,
      achievements: [],
      message: null,
      isLoading: false,
      roundCount: 0,
      nextStep: 'continue'
    });
  };

  // Prepare financial metrics data for the component
  const financialMetrics: FinancialMetricsType = {
    income: gameState.income,
    expenses: gameState.expenses,
    savings: gameState.savings,
    debt: gameState.debt
  };

  return (
    <div className="flex flex-col space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl">Financial Twin Simulation</CardTitle>
          <CardDescription>
            Make financial decisions and see how they impact your financial health
          </CardDescription>
        </CardHeader>
        <CardContent>
          {gameState.stage === 'welcome' && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 p-4 bg-primary/5 rounded-md">
                <User className="h-5 w-5 text-primary" />
                <div className="text-lg font-medium">
                  Career Path: <span className="text-primary">{career}</span>
                </div>
              </div>
              
              <div className="space-y-4 py-4">
                <h3 className="text-lg font-medium">Enter Your Name to Begin</h3>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="w-full rounded-md border border-input p-2"
                  placeholder="Your name"
                />
                <Button 
                  onClick={startGame}
                  disabled={!playerName || gameState.isLoading}
                  className="w-full"
                >
                  Start Financial Journey
                </Button>
              </div>
            </div>
          )}

          {gameState.stage === 'initialization' && (
            <div className="space-y-4">
              <GameMessage 
                message={gameState.message} 
                isLoading={gameState.isLoading} 
              />
              
              <Button 
                onClick={initializeGame}
                disabled={gameState.isLoading}
                className="w-full"
              >
                Initialize Financial Profile
              </Button>
            </div>
          )}

          {gameState.stage === 'making_decisions' && (
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-4 p-4 bg-primary/5 rounded-md">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-primary" />
                  <div className="font-medium">{gameState.playerName} - {gameState.careerPath}</div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div className="text-sm text-muted-foreground">Round {gameState.roundCount + 1}/5</div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Landmark className="h-4 w-4 text-primary" />
                  <div>
                    <Badge variant="secondary" className="bg-primary/10">
                      Level {gameState.level}
                    </Badge>
                    <span className="ml-2 text-xs text-muted-foreground">
                      {gameState.xpEarned} XP
                    </span>
                  </div>
                </div>
              </div>
              
              <FinancialMetrics metrics={financialMetrics} />
              
              <GameMessage 
                message={gameState.message} 
                isLoading={gameState.isLoading} 
              />
              
              {gameState.achievements.length > 0 && (
                <AchievementsList achievements={gameState.achievements} />
              )}
              
              <Separator />
              
              <div className="space-y-4 pt-2">
                <h3 className="text-lg font-medium">Make a Financial Decision</h3>
                
                <Select
                  value={selectedDecision}
                  onValueChange={setSelectedDecision}
                  disabled={gameState.isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a financial decision..." />
                  </SelectTrigger>
                  <SelectContent>
                    {financialDecisions.map((decision) => (
                      <SelectItem key={decision.value} value={decision.value}>
                        {decision.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Button 
                  onClick={makeDecision}
                  disabled={!selectedDecision || gameState.isLoading}
                  className="w-full"
                >
                  Make Decision <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
          
          {gameState.stage === 'conclusion' && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 p-4 bg-primary/5 rounded-md">
                <User className="h-5 w-5 text-primary" />
                <div className="font-medium">{gameState.playerName} - {gameState.careerPath}</div>
                <Badge variant="outline" className="ml-auto">
                  Level {gameState.level}
                </Badge>
              </div>
              
              <GameMessage 
                message={gameState.message} 
                isLoading={gameState.isLoading} 
              />
              
              {gameState.achievements.length > 0 && (
                <AchievementsList achievements={gameState.achievements} />
              )}
              
              <Button 
                onClick={resetGame}
                className="w-full"
              >
                Play Again
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
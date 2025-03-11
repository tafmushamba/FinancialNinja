import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { apiRequest } from '@/lib/queryClient';
import { motion } from 'framer-motion';
import { 
  ArrowRight, Calendar, Clock, Landmark, User, 
  PlayCircle, Award, DollarSign, PiggyBank
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue
} from "@/components/ui/select";

// Import new visual components
import { GameProgressTracker } from './game-progress-tracker';
import { FinancialStatsVisualization } from './financial-stats-visualization';
import { FinancialMetrics } from './financial-metrics';
import { DecisionCards } from './decision-cards';
import { AchievementsDisplay } from './achievements-display';
import { AnimatedGameMessage } from './animated-game-message';
import { DecisionOption } from './types';
import { careerAvatars } from './avatars';
import { CareerSprite, DecisionSprite } from './sprites';

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
  decisionOptions?: DecisionOption[];
}

export function FinancialGameSimulation({ career }: FinancialGameSimulationProps) {
  const { user } = useAuth();
  const playerName = user ? `${user.firstName || user.username}` : '';
  const [selectedDecision, setSelectedDecision] = useState('');
  const [gameState, setGameState] = useState<GameState>({
    stage: 'welcome',
    playerName: playerName,
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
    nextStep: 'continue',
    decisionOptions: []
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
    // Set career path and player name when component mounts or user changes
    setGameState(prev => ({ 
      ...prev, 
      careerPath: career,
      playerName: playerName
    }));
  }, [career, playerName]);

  const startGame = async () => {
    if (!playerName) return;
    
    console.log('Starting game with player name:', playerName);
    console.log('Career path:', career);

    setGameState(prev => ({ 
      ...prev, 
      isLoading: true,
      playerName
    }));

    try {
      console.log('Sending API request to /api/financial-game/start');
      
      const requestData = {
        playerName,
        careerChoice: career
      };
      console.log('Request data:', requestData);
      
      const response = await apiRequest<any>({
        url: '/api/financial-game/start',
        method: 'POST',
        data: requestData
      });
      
      console.log('Received response:', response);

      setGameState(prev => ({ 
        ...prev, 
        stage: 'initialization',
        message: response.content,
        isLoading: false
      }));
      
      console.log('Game state updated to initialization stage');
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
      console.log('Sending API request to /api/financial-game/initialize');
      
      const response = await apiRequest<any>({
        url: '/api/financial-game/initialize',
        method: 'POST',
        data: {
          careerPath: career,
          acknowledgeStatus: "I understand my initial financial status and am ready to proceed"
        }
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
        decisionOptions: response.decision_options || [],
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
      const response = await apiRequest<any>({
        url: '/api/financial-game/process-decision',
        method: 'POST',
        data: {
          careerPath: gameState.careerPath,
          income: gameState.income,
          expenses: gameState.expenses,
          savings: gameState.savings,
          debt: gameState.debt,
          financialDecision: selectedDecision,
          nextStep
        }
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
          decisionOptions: response.decision_options || [],
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
      const response = await apiRequest<any>({
        url: '/api/financial-game/conclude',
        method: 'POST',
        data: {
          playerName: gameState.playerName,
          careerPath: gameState.careerPath,
          xpEarned: gameState.xpEarned,
          level: gameState.level,
          achievements: gameState.achievements,
          financialDecision: selectedDecision || 'balanced_approach'
        }
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
    setSelectedDecision('');
    setGameState({
      stage: 'welcome',
      playerName: playerName,
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
      nextStep: 'continue',
      decisionOptions: []
    });
  };

  // Prepare financial metrics data for the component
  const financialMetrics = {
    income: gameState.income,
    expenses: gameState.expenses,
    savings: gameState.savings,
    debt: gameState.debt,
    savingsRatio: gameState.income > 0 ? (gameState.savings / gameState.income) : 0,
    debtToIncomeRatio: gameState.income > 0 ? (gameState.debt / gameState.income) : 0
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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              {/* Career Avatar Section */}
              <div className="flex flex-col items-center mb-4">
                {/* Use the new CareerSprite component */}
                <div className="w-32 h-32 mb-2">
                  <CareerSprite career={career} className="w-full h-full" />
                </div>
                <div className="text-xl font-medium text-center">
                  <span className="text-primary">{career}</span> Career Path
                </div>
              </div>

              <div className="space-y-4 py-4">
                <div className="flex items-center space-x-2 p-4 bg-primary/5 rounded-md">
                  <User className="h-5 w-5 text-primary" />
                  <div className="text-lg font-medium">
                    Welcome, <span className="text-primary">{playerName}</span>!
                  </div>
                </div>
                <p className="text-muted-foreground text-center">
                  You'll navigate your financial journey as a {career}. Make decisions to improve your financial well-being 
                  and achieve your goals.
                </p>
                <Button 
                  onClick={startGame}
                  disabled={!playerName || gameState.isLoading}
                  className="w-full"
                >
                  <PlayCircle className="mr-2 h-5 w-5" />
                  Start Financial Journey
                </Button>
              </div>
            </motion.div>
          )}

          {gameState.stage === 'initialization' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <AnimatedGameMessage 
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
            </motion.div>
          )}

          {gameState.stage === 'making_decisions' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* Player info and game progress */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex flex-col md:flex-row gap-2 mb-4 items-center justify-between">
                  <Badge className="capitalize bg-primary text-white">
                    Round {gameState.roundCount + 1} of 5
                  </Badge>
                  <Badge variant="outline" className="bg-primary/10">
                    <Award className="h-4 w-4 mr-1" /> Level {gameState.level} (XP: {gameState.xpEarned})
                  </Badge>
                </div>
              </motion.div>
              
              <GameProgressTracker 
                currentRound={gameState.roundCount + 1}
                totalRounds={5}
                level={gameState.level}
                xp={gameState.xpEarned}
              />

              {/* Financial metrics and visualizations */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <FinancialMetrics metrics={financialMetrics} />
                <FinancialStatsVisualization
                  income={gameState.income}
                  expenses={gameState.expenses}
                  savings={gameState.savings}
                  debt={gameState.debt}
                  savingsRatio={financialMetrics.savingsRatio}
                  debtToIncomeRatio={financialMetrics.debtToIncomeRatio}
                />
              </div>

              {/* Game message */}
              <AnimatedGameMessage 
                message={gameState.message} 
                isLoading={gameState.isLoading} 
              />

              {/* Achievements */}
              {gameState.achievements.length > 0 && (
                <AchievementsDisplay achievements={gameState.achievements} />
              )}

              <Separator />

              {/* Decision making */}
              <div className="space-y-4 pt-2">
                <h3 className="text-lg font-medium flex items-center">
                  <PiggyBank className="mr-2 h-5 w-5 text-primary" />
                  Make a Financial Decision
                </h3>

                <DecisionCards
                  onSelect={setSelectedDecision}
                  selectedOption={selectedDecision}
                  disabled={gameState.isLoading}
                  scenario={gameState.message || undefined}
                  decisionOptions={gameState.decisionOptions}
                />

                <Button 
                  onClick={makeDecision}
                  disabled={!selectedDecision || gameState.isLoading}
                  className="w-full mt-4"
                >
                  Submit Decision <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {gameState.stage === 'conclusion' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between p-4 bg-primary/10 rounded-md">
                <div className="flex items-center space-x-3">
                  {/* Use the new CareerSprite component */}
                  <div className="w-12 h-12">
                    <CareerSprite career={gameState.careerPath} className="w-full h-full" />
                  </div>
                  <div>
                    <div className="font-medium text-lg">{gameState.playerName}</div>
                    <div className="text-sm text-muted-foreground">{gameState.careerPath}</div>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <Badge variant="outline" className="bg-primary/20 mb-1">
                    Level {gameState.level}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {gameState.xpEarned} XP Earned
                  </span>
                </div>
              </div>

              <AnimatedGameMessage 
                message={gameState.message} 
                isLoading={gameState.isLoading}
                type="tip"
              />

              {gameState.achievements.length > 0 && (
                <AchievementsDisplay achievements={gameState.achievements} />
              )}

              <Button 
                onClick={resetGame}
                className="w-full"
              >
                <PlayCircle className="mr-2 h-5 w-5" />
                Play Again
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
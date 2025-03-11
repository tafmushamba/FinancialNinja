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

// Import visual components
import { GameProgressTracker } from './game-progress-tracker';
import { FinancialStatsVisualization } from './financial-stats-visualization';
import { FinancialMetrics } from './financial-metrics';
import { DecisionCards } from './decision-cards';
import { AchievementsDisplay } from './achievements-display';
import { AnimatedGameMessage } from './animated-game-message';
import { DecisionOption } from './types';
import { careerAvatars } from './avatars';
import { CareerSprite, DecisionSprite } from './sprites';

// Import Pokémon-style UI components
import { PokemonGameUI } from './pokemon-game-ui';
import '../../styles/pixel-art.css';

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

  // Track if a decision is being submitted
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Handle continue action for the Pokemon UI
  const handleContinue = () => {
    if (gameState.stage === 'welcome') {
      startGame();
    } else if (gameState.stage === 'initialization') {
      initializeGame();
    } else if (gameState.stage === 'making_decisions') {
      if (selectedDecision) {
        setIsSubmitting(true);
        makeDecision().finally(() => setIsSubmitting(false));
      }
    } else if (gameState.stage === 'conclusion') {
      resetGame();
    }
  };
  
  // Handle decision selection
  const handleDecisionSelect = (decision: string) => {
    setSelectedDecision(decision);
  };

  return (
    <div className="flex flex-col space-y-4">
      {/* Toggle between original UI and Pokemon style UI */}
      <div className="pokemon-game-container">
        <div className="mb-4">
          <h1 className="text-2xl font-pixel text-center mb-2">Financial Adventure</h1>
          <p className="text-center text-muted-foreground mb-4">Navigate your financial journey in the world of money management</p>
        </div>
        
        {/* Pokemon-style Game UI */}
        <PokemonGameUI
          gameState={gameState}
          selectedDecision={selectedDecision}
          onDecisionSelect={handleDecisionSelect}
          onContinue={handleContinue}
          isSubmitting={isSubmitting || gameState.isLoading}
        />
      </div>
    </div>
  );
}
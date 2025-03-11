import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { 
  PixelContainer, 
  DialogBox, 
  BattleStyleDecision, 
  BattleScene,
  GameStats
} from './pokemon-style';
import { 
  getCharacterSprite, 
  getScenarioSprite, 
  getBackgroundByCareer 
} from '@/assets/pixel-sprites';
import { DecisionOption } from './types';

interface PokemonGameUIProps {
  gameState: {
    stage: string;
    playerName: string;
    careerPath: string;
    income: number;
    expenses: number;
    savings: number;
    debt: number;
    xpEarned: number;
    level: number;
    message: string | null;
    isLoading: boolean;
    achievements: string[];
    roundCount: number;
    decisionOptions?: DecisionOption[];
  };
  selectedDecision: string;
  onDecisionSelect: (decision: string) => void;
  onContinue: () => void;
  isSubmitting: boolean;
}

export function PokemonGameUI({
  gameState,
  selectedDecision,
  onDecisionSelect,
  onContinue,
  isSubmitting
}: PokemonGameUIProps) {
  const [dialogKey, setDialogKey] = useState(0);
  const [showDecisions, setShowDecisions] = useState(false);

  // Reset dialog when the message changes
  useEffect(() => {
    setDialogKey(prev => prev + 1);
    setShowDecisions(false);
    const timer = setTimeout(() => {
      setShowDecisions(true);
    }, gameState.message ? gameState.message.length * 30 + 500 : 500);
    
    return () => clearTimeout(timer);
  }, [gameState.message]);

  // Format a financial value for display
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0
    }).format(value);
  };

  // Get an appropriate character based on career path
  const getPlayerCharacter = () => {
    return gameState.careerPath.toLowerCase();
  };

  // Get opponent character based on stage
  const getOpponentCharacter = () => {
    if (gameState.stage === 'making_decisions' && gameState.decisionOptions) {
      const decisionType = gameState.decisionOptions[0]?.value || 'default';
      // Return appropriate advisor type based on the decision context
      if (decisionType.includes('savings') || decisionType.includes('emergency')) {
        return 'advisor';
      } else if (decisionType.includes('debt') || decisionType.includes('loan')) {
        return 'banker';
      } else if (decisionType.includes('invest')) {
        return 'entrepreneur';
      } else {
        return 'advisor';
      }
    }
    return 'advisor';
  };

  // Create player stats for the battle scene
  const playerStats = [
    {
      label: "Savings",
      current: gameState.savings,
      max: gameState.income * 12, // Use yearly income as a reference point
      color: "#4CAF50"
    },
    {
      label: "Financial XP",
      current: gameState.xpEarned,
      max: gameState.level * 100, // Arbitrary max based on level
      color: "#FF9800"
    }
  ];

  // Create opponent/advisor stats for the battle scene
  const opponentStats = [
    {
      label: "Income",
      current: gameState.income,
      max: gameState.income * 1.5, // Arbitrary max for visualization
      color: "#2196F3"
    },
    {
      label: "Expenses",
      current: gameState.expenses,
      max: gameState.income, // Ideal: expenses <= income
      color: "#F44336"
    }
  ];

  // Get the appropriate background based on the career
  const backgroundImage = getBackgroundByCareer(gameState.careerPath);

  // Map decision options to the format expected by BattleStyleDecision
  const mapDecisionOptions = () => {
    if (!gameState.decisionOptions) return [];
    
    return gameState.decisionOptions.map(option => ({
      value: option.value,
      label: option.label,
      description: option.description
    }));
  };

  // Calculate savings-to-income ratio for health bars
  const calculateRatio = (value: number, reference: number) => {
    if (reference <= 0) return 0;
    return Math.min(Math.max(value / reference, 0), 1) * 100;
  };

  // Get a scene message based on the game state
  const getSceneMessage = () => {
    if (gameState.isLoading) {
      return "Thinking...";
    }
    
    if (!gameState.message) {
      if (gameState.stage === 'welcome') {
        return `Welcome, ${gameState.playerName}! Ready to start your financial journey as a ${gameState.careerPath}?`;
      } else if (gameState.stage === 'initialization') {
        return "Let's set up your financial profile...";
      } else if (gameState.stage === 'conclusion') {
        return "Great job completing this financial challenge!";
      } else {
        return "What would you like to do next?";
      }
    }
    
    return gameState.message;
  };

  return (
    <div className="pokemon-game-container">
      <BattleScene
        playerCharacter={getPlayerCharacter()}
        opponentCharacter={getOpponentCharacter()}
        playerStats={playerStats}
        opponentStats={opponentStats}
        backgroundImage={backgroundImage}
        className="rounded-lg overflow-hidden shadow-lg mb-6"
      >
        {/* Dialog box with typewriter effect */}
        <div className="mb-4">
          <DialogBox
            key={dialogKey}
            text={getSceneMessage() || ""}
            speakerName={gameState.stage === 'making_decisions' ? "Financial Advisor" : "Game"}
            onComplete={() => {}}
            className="w-full"
          />
        </div>

        {/* Decision options */}
        {showDecisions && gameState.decisionOptions && gameState.decisionOptions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <BattleStyleDecision
              options={mapDecisionOptions()}
              onSelect={onDecisionSelect}
              disabled={isSubmitting}
              className="w-full"
            />
          </motion.div>
        )}

        {/* Continue button */}
        {showDecisions && (!gameState.decisionOptions || gameState.decisionOptions.length === 0) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex justify-center mt-4"
          >
            <button
              onClick={onContinue}
              disabled={isSubmitting}
              className="px-6 py-3 bg-blue-500 text-white font-pixel rounded-lg disabled:opacity-50 transition-all hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
            >
              {isSubmitting ? "Processing..." : "Continue"}
            </button>
          </motion.div>
        )}

        {/* Submit button for decisions */}
        {showDecisions && selectedDecision && gameState.decisionOptions && gameState.decisionOptions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex justify-center mt-4"
          >
            <button
              onClick={onContinue}
              disabled={isSubmitting || !selectedDecision}
              className="px-6 py-3 bg-green-500 text-white font-pixel rounded-lg disabled:opacity-50 transition-all hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
            >
              {isSubmitting ? "Processing..." : "Confirm Decision"}
            </button>
          </motion.div>
        )}
      </BattleScene>

      {/* Game info panel */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <PixelContainer className="p-4 bg-white">
          <h3 className="font-pixel text-lg mb-3">Financial Status</h3>
          <div className="space-y-2 font-pixel">
            <div className="flex justify-between">
              <span>Income:</span>
              <span>{formatCurrency(gameState.income)}</span>
            </div>
            <div className="flex justify-between">
              <span>Expenses:</span>
              <span>{formatCurrency(gameState.expenses)}</span>
            </div>
            <div className="flex justify-between">
              <span>Savings:</span>
              <span>{formatCurrency(gameState.savings)}</span>
            </div>
            <div className="flex justify-between">
              <span>Debt:</span>
              <span>{formatCurrency(gameState.debt)}</span>
            </div>
          </div>
        </PixelContainer>

        <PixelContainer className="p-4 bg-white">
          <h3 className="font-pixel text-lg mb-3">Game Progress</h3>
          <div className="space-y-2 font-pixel">
            <div className="flex justify-between">
              <span>Level:</span>
              <span>{gameState.level}</span>
            </div>
            <div className="flex justify-between">
              <span>XP Earned:</span>
              <span>{gameState.xpEarned}</span>
            </div>
            <div className="flex justify-between">
              <span>Round:</span>
              <span>{gameState.roundCount}</span>
            </div>
            <div className="flex justify-between">
              <span>Achievements:</span>
              <span>{gameState.achievements.length}</span>
            </div>
          </div>
        </PixelContainer>
      </div>

      {/* Achievements panel (if any) */}
      {gameState.achievements.length > 0 && (
        <PixelContainer className="mt-4 p-4 bg-white">
          <h3 className="font-pixel text-lg mb-3">Achievements</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {gameState.achievements.map((achievement, index) => (
              <div 
                key={index} 
                className="flex items-center space-x-2 p-2 bg-yellow-100 rounded-md"
              >
                <img 
                  src={getScenarioSprite('achievement')}
                  alt="Achievement" 
                  className="w-6 h-6 pixelated" 
                />
                <span className="font-pixel text-xs">{achievement}</span>
              </div>
            ))}
          </div>
        </PixelContainer>
      )}
    </div>
  );
}
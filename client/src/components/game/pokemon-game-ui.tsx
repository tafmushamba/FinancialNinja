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
    <div className="pokemon-game-container p-4 md:p-8 pb-20 md:pb-12 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
            <span className="text-primary font-bold">{gameState.level}</span>
          </div>
          <div className="ml-3">
            <h1 className="text-2xl font-bold text-foreground">
              Financial Adventure
            </h1>
            <p className="text-sm text-muted-foreground">
              Career: {gameState.careerPath} | Round: {gameState.roundCount}
            </p>
          </div>
        </div>
      </motion.div>
      
      <BattleScene
        playerCharacter={getPlayerCharacter()}
        opponentCharacter={getOpponentCharacter()}
        playerStats={playerStats}
        opponentStats={opponentStats}
        backgroundImage={backgroundImage}
        className="rounded-xl overflow-hidden shadow-xl border border-primary/20 mb-6"
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
              className="px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg disabled:opacity-50 transition-all hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2"
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
              className="px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg disabled:opacity-50 transition-all hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 shadow-md"
            >
              {isSubmitting ? "Processing..." : "Confirm Decision"}
            </button>
          </motion.div>
        )}
      </BattleScene>

      {/* Game info panels */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <PixelContainer className="p-4 bg-card/60 backdrop-blur-sm border border-border/50 shadow-md">
            <h3 className="font-pixel text-lg mb-3 text-foreground font-bold flex items-center">
              <span className="w-6 h-6 rounded-full bg-primary/20 inline-flex items-center justify-center mr-2">
                <span className="text-primary text-xs">£</span>
              </span>
              Financial Status
            </h3>
            <div className="space-y-2 font-pixel text-foreground">
              <div className="flex justify-between items-center p-2 rounded-md bg-primary/5">
                <span>Income:</span>
                <span className="font-medium">{formatCurrency(gameState.income)}</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-md bg-primary/5">
                <span>Expenses:</span>
                <span className="font-medium">{formatCurrency(gameState.expenses)}</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-md bg-primary/5">
                <span>Savings:</span>
                <span className="font-medium">{formatCurrency(gameState.savings)}</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-md bg-primary/5">
                <span>Debt:</span>
                <span className="font-medium">{formatCurrency(gameState.debt)}</span>
              </div>
            </div>
          </PixelContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <PixelContainer className="p-4 bg-card/60 backdrop-blur-sm border border-border/50 shadow-md">
            <h3 className="font-pixel text-lg mb-3 text-foreground font-bold flex items-center">
              <span className="w-6 h-6 rounded-full bg-primary/20 inline-flex items-center justify-center mr-2">
                <span className="text-primary text-xs">XP</span>
              </span>
              Game Progress
            </h3>
            <div className="space-y-2 font-pixel text-foreground">
              <div className="flex justify-between items-center p-2 rounded-md bg-primary/5">
                <span>Level:</span>
                <span className="font-medium">{gameState.level}</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-md bg-primary/5">
                <span>XP Earned:</span>
                <span className="font-medium">{gameState.xpEarned}</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-md bg-primary/5">
                <span>Round:</span>
                <span className="font-medium">{gameState.roundCount}</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-md bg-primary/5">
                <span>Achievements:</span>
                <span className="font-medium">{gameState.achievements.length}</span>
              </div>
            </div>
          </PixelContainer>
        </motion.div>
      </div>

      {/* Achievements panel (if any) */}
      {gameState.achievements.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <PixelContainer className="mt-6 p-4 bg-card/60 backdrop-blur-sm border border-border/50 shadow-md">
            <h3 className="font-pixel text-lg mb-3 text-foreground font-bold flex items-center">
              <span className="w-6 h-6 rounded-full bg-yellow-500/20 inline-flex items-center justify-center mr-2">
                <span className="text-yellow-500 text-xs">★</span>
              </span>
              Achievements
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {gameState.achievements.map((achievement, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center space-x-2 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded-md"
                >
                  <img 
                    src={getScenarioSprite('achievement')}
                    alt="Achievement" 
                    className="w-6 h-6 pixelated" 
                  />
                  <span className="font-pixel text-sm text-foreground">{achievement}</span>
                </motion.div>
              ))}
            </div>
          </PixelContainer>
        </motion.div>
      )}
      
      {/* Return to home link */}
      <div className="mt-8 text-center">
        <a 
          href="/" 
          className="inline-flex items-center text-primary hover:text-primary/80 text-sm font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Return to Dashboard
        </a>
      </div>
    </div>
  );
}
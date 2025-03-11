import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { getCharacterSprite, getScenarioSprite } from '@/assets/pixel-sprites';

// Types
interface DialogBoxProps {
  text: string;
  speakerName?: string;
  onComplete?: () => void;
  className?: string;
  typingSpeed?: number;
}

interface BattleStyleDecisionProps {
  options: {
    value: string;
    label: string;
    description: string;
  }[];
  onSelect: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

interface BattleSceneProps {
  playerCharacter: string;
  opponentCharacter: string;
  playerStats: {
    label: string;
    current: number;
    max: number;
    color: string;
  }[];
  opponentStats: {
    label: string;
    current: number;
    max: number;
    color: string;
  }[];
  backgroundImage: string;
  className?: string;
  children?: React.ReactNode;
}

interface PixelContainerProps {
  children: React.ReactNode;
  className?: string;
}

interface GameStatsProps {
  stats: {
    label: string;
    value: string | number;
    color?: string;
  }[];
  className?: string;
}

// Components
export function PixelContainer({ children, className }: PixelContainerProps) {
  return (
    <div className={cn('p-4 border-4 border-gray-800 rounded-lg shadow-md font-pixel', className)}>
      {children}
    </div>
  );
}

export function DialogBox({ 
  text, 
  speakerName, 
  onComplete, 
  className,
  typingSpeed = 30 
}: DialogBoxProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [showCursor, setShowCursor] = useState(true);
  
  // Typing effect
  useEffect(() => {
    if (!text) {
      setDisplayedText('');
      setIsTyping(false);
      return;
    }

    // Format text with proper line breaks for readability
    const formattedText = formatDisplayText(text);
    
    let currentIndex = 0;
    setIsTyping(true);
    setDisplayedText('');
    
    const typingInterval = setInterval(() => {
      if (currentIndex < formattedText.length) {
        setDisplayedText(prev => prev + formattedText.charAt(currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        setIsTyping(false);
        if (onComplete) onComplete();
      }
    }, typingSpeed);
    
    return () => clearInterval(typingInterval);
  }, [text, typingSpeed, onComplete]);
  
  // Cursor blinking effect
  useEffect(() => {
    if (!isTyping) return;
    
    const blinkInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    
    return () => clearInterval(blinkInterval);
  }, [isTyping]);
  
  // Function to break long text into multiple lines for readability
  const formatDisplayText = (text: string) => {
    // If text is short, don't process it
    if (text.length < 80) return text;
    
    // Split text into sentences or at punctuation
    const parts = text.split(/([.!?]+\s+)/);
    let formatted = '';
    let lineLength = 0;
    
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      
      if (lineLength + part.length > 80) {
        formatted += '\n';
        lineLength = 0;
      }
      
      formatted += part;
      lineLength += part.length;
    }
    
    return formatted;
  };

  return (
    <div className={cn('dialog-box font-pixel text-sm', className)}>
      {speakerName && (
        <div className="text-primary font-bold mb-2">{speakerName}:</div>
      )}
      <div className="relative min-h-[60px]">
        {displayedText.split('\n').map((line, index) => (
          <React.Fragment key={index}>
            {line}
            {index < displayedText.split('\n').length - 1 && <br />}
          </React.Fragment>
        ))}
        {isTyping && showCursor && (
          <span className="blinking-cursor ml-1" />
        )}
      </div>
    </div>
  );
}

export function BattleStyleDecision({ 
  options, 
  onSelect, 
  disabled = false,
  className
}: BattleStyleDecisionProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  
  const handleSelect = (value: string) => {
    if (disabled) return;
    setSelectedOption(value);
    onSelect(value);
  };
  
  return (
    <div className={cn('decision-menu', className)}>
      {options.map((option) => (
        <motion.div
          key={option.value}
          className={cn(
            'decision-option',
            selectedOption === option.value && 'selected',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
          whileHover={!disabled ? { x: 5 } : {}}
          onClick={() => handleSelect(option.value)}
        >
          <div className="text-primary font-bold mb-1">{option.label}</div>
          <div className="text-xs text-gray-600">{option.description}</div>
        </motion.div>
      ))}
    </div>
  );
}

export function BattleScene({
  playerCharacter,
  opponentCharacter,
  playerStats,
  opponentStats,
  backgroundImage,
  className,
  children
}: BattleSceneProps) {
  const playerSprite = getCharacterSprite(playerCharacter);
  const opponentSprite = getScenarioSprite(opponentCharacter) || getCharacterSprite(opponentCharacter);
  
  return (
    <div className={cn('battle-screen', className)} style={{ 
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundRepeat: 'repeat' 
    }}>
      <div className="battle-ground">
        {/* Player Area */}
        <div className="player-area">
          <div className="status-box w-36">
            <div className="status-box-header">
              <span className="status-box-name">{playerCharacter}</span>
              <span className="status-box-level">Lv{Math.floor(playerStats[1]?.current / 100) + 1}</span>
            </div>
            {playerStats.map((stat, index) => (
              <div key={index} className="mb-2">
                <div className="text-xs mb-1">{stat.label}</div>
                <div className="health-bar">
                  <div 
                    className="health-bar-fill" 
                    style={{ 
                      width: `${Math.min(Math.max((stat.current / stat.max) * 100, 0), 100)}%`,
                      backgroundColor: stat.color 
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          
          <img 
            src={playerSprite} 
            alt={playerCharacter}
            className="player-sprite pixelated w-16 h-16"
          />
        </div>
        
        {/* Opponent Area */}
        <div className="opponent-area">
          <div className="status-box w-36">
            <div className="status-box-header">
              <span className="status-box-name">{opponentCharacter}</span>
              <span className="status-box-level">Advisor</span>
            </div>
            {opponentStats.map((stat, index) => (
              <div key={index} className="mb-2">
                <div className="text-xs mb-1">{stat.label}</div>
                <div className="health-bar">
                  <div 
                    className="health-bar-fill" 
                    style={{ 
                      width: `${Math.min(Math.max((stat.current / stat.max) * 100, 0), 100)}%`,
                      backgroundColor: stat.color 
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          
          <img 
            src={opponentSprite} 
            alt={opponentCharacter}
            className="opponent-sprite pixelated w-16 h-16"
          />
        </div>
      </div>
      
      {/* Dialog and Decision Area */}
      <div className="battle-text-area p-4">
        {children}
      </div>
    </div>
  );
}

export function GameStats({ stats, className }: GameStatsProps) {
  return (
    <PixelContainer className={cn('bg-white', className)}>
      <div className="grid grid-cols-2 gap-2">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className="p-2 rounded-md" 
            style={{ backgroundColor: stat.color ? `${stat.color}10` : 'transparent' }}
          >
            <div className="text-xs font-bold mb-1">{stat.label}</div>
            <div className="text-lg">{stat.value}</div>
          </div>
        ))}
      </div>
    </PixelContainer>
  );
}

// Animation variants
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } }
};

export const slideUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export const slideIn = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
};

export const popIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 20 } }
};
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// Pixel art styling constants
const PIXEL_SCALE = 4; // Size of each "pixel" in our retro style
const CHAR_DELAY = 30; // Delay between characters when typing text

/**
 * PixelContainer - Base component for pixel art styling
 */
interface PixelContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function PixelContainer({ children, className }: PixelContainerProps) {
  return (
    <div 
      className={cn(
        "pixelated relative overflow-hidden bg-white border-4 border-black", 
        className
      )}
      style={{ 
        imageRendering: 'pixelated',
        boxShadow: `${PIXEL_SCALE}px ${PIXEL_SCALE}px 0 #000`
      }}
    >
      {children}
    </div>
  );
}

/**
 * PixelSprite - Renders a pixel art sprite with pixel art styling
 */
interface PixelSpriteProps {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  scale?: number;
  className?: string;
  animated?: boolean;
  frameCount?: number;
  frameDuration?: number;
}

export function PixelSprite({ 
  src, 
  alt = 'Pixel sprite',
  width = 64, 
  height = 64,
  scale = 1,
  className,
  animated = false,
  frameCount = 1,
  frameDuration = 200
}: PixelSpriteProps) {
  const [currentFrame, setCurrentFrame] = useState(0);
  
  // Animation logic for sprites with multiple frames
  useEffect(() => {
    if (!animated || frameCount <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentFrame(prev => (prev + 1) % frameCount);
    }, frameDuration);
    
    return () => clearInterval(interval);
  }, [animated, frameCount, frameDuration]);

  return (
    <div 
      className={cn("inline-block pixelated", className)}
      style={{ 
        width: width * scale,
        height: height * scale,
        imageRendering: 'pixelated',
      }}
    >
      <img 
        src={src} 
        alt={alt}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          transform: animated && frameCount > 1 ? `translateX(-${currentFrame * 100 / frameCount}%)` : 'none',
        }}
      />
    </div>
  );
}

/**
 * PixelCharacterSprite - A character sprite that can be animated
 */
interface PixelCharacterSpriteProps {
  character: 'player' | 'student' | 'entrepreneur' | 'artist' | 'banker' | 'advisor';
  emotion?: 'neutral' | 'happy' | 'sad' | 'surprised' | 'thinking';
  facing?: 'left' | 'right' | 'front' | 'back';
  animated?: boolean;
  className?: string;
  scale?: number;
}

export function PixelCharacterSprite({
  character,
  emotion = 'neutral',
  facing = 'front',
  animated = true,
  className,
  scale = 1
}: PixelCharacterSpriteProps) {
  // In a real implementation, we would have different sprite sheets for
  // each character, emotion, and facing direction
  // For now, we'll just use placeholder implementation
  
  // This would come from importing actual sprite sheets in a complete implementation
  const characterSprites: Record<string, string> = {
    player: 'https://i.imgur.com/JgfBA2C.png', // Placeholder for player character sprite
    student: 'https://i.imgur.com/eFGSWxZ.png', // Placeholder for student character sprite
    entrepreneur: 'https://i.imgur.com/rLgP8L1.png', // Placeholder for entrepreneur character sprite
    artist: 'https://i.imgur.com/2XvHPJh.png', // Placeholder for artist character sprite
    banker: 'https://i.imgur.com/2tAjuBF.png', // Placeholder for banker character sprite
    advisor: 'https://i.imgur.com/uIQTPSM.png', // Placeholder for financial advisor character sprite
  };
  
  // Get appropriate sprite sheet based on character
  const spriteSheet = characterSprites[character] || characterSprites.player;
  
  return (
    <PixelSprite
      src={spriteSheet}
      alt={`${character} character`}
      width={32}
      height={32}
      scale={scale}
      className={className}
      animated={animated}
      frameCount={4} // Most RPG character sprites have 4 frames per animation
      frameDuration={200}
    />
  );
}

/**
 * DialogBox - Pokémon-style dialog box with typewriter text effect
 */
interface DialogBoxProps {
  text: string;
  speakerName?: string;
  onComplete?: () => void;
  autoAdvance?: boolean;
  advanceDelay?: number;
  className?: string;
  portrait?: React.ReactNode;
}

export function DialogBox({
  text,
  speakerName,
  onComplete,
  autoAdvance = false,
  advanceDelay = 1500,
  className,
  portrait
}: DialogBoxProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Typewriter effect
  useEffect(() => {
    setIsTyping(true);
    setDisplayedText('');
    
    let currentIndex = 0;
    
    const typeNextCharacter = () => {
      if (currentIndex < text.length) {
        setDisplayedText(text.substring(0, currentIndex + 1));
        currentIndex++;
        timeoutRef.current = setTimeout(typeNextCharacter, CHAR_DELAY);
      } else {
        setIsTyping(false);
        
        // Auto advance after specified delay if enabled
        if (autoAdvance && onComplete) {
          timeoutRef.current = setTimeout(onComplete, advanceDelay);
        }
      }
    };
    
    timeoutRef.current = setTimeout(typeNextCharacter, CHAR_DELAY);
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [text, autoAdvance, advanceDelay, onComplete]);
  
  // Complete typing immediately when clicked
  const handleClick = () => {
    if (isTyping) {
      // If still typing, complete the text
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setDisplayedText(text);
      setIsTyping(false);
    } else if (onComplete) {
      // If finished typing, advance to next dialog
      onComplete();
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.2 }}
      className={cn("pixel-dialog", className)}
      onClick={handleClick}
    >
      <PixelContainer className="p-4 pb-8 bg-white border-4 border-black rounded-lg relative">
        {speakerName && (
          <div className="absolute top-0 left-4 -translate-y-1/2 bg-white border-4 border-black px-3 py-1 font-pixel font-bold">
            {speakerName}
          </div>
        )}
        
        <div className="flex">
          {portrait && (
            <div className="mr-4 flex-shrink-0">
              {portrait}
            </div>
          )}
          
          <div className="font-pixel text-lg leading-tight">
            {displayedText}
          </div>
        </div>
        
        {!isTyping && (
          <div className="absolute bottom-2 right-4 animate-bounce">
            <div className="w-0 h-0 border-l-8 border-l-transparent border-t-8 border-t-black border-r-8 border-r-transparent"></div>
          </div>
        )}
      </PixelContainer>
    </motion.div>
  );
}

/**
 * BattleStyleDecision - Presents decisions in a Pokémon battle menu style
 */
interface BattleStyleDecisionProps {
  options: {
    value: string;
    label: string;
    description?: string;
  }[];
  onSelect: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export function BattleStyleDecision({
  options,
  onSelect,
  disabled = false,
  className
}: BattleStyleDecisionProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (disabled) return;
      
      switch (e.key) {
        case 'ArrowUp':
          setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
          break;
        case 'ArrowDown':
          setSelectedIndex(prev => (prev < options.length - 1 ? prev + 1 : prev));
          break;
        case 'Enter':
        case ' ':
          onSelect(options[selectedIndex].value);
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [options, selectedIndex, onSelect, disabled]);
  
  return (
    <PixelContainer className={cn("p-1 bg-white border-4 border-black", className)}>
      <div className="grid grid-cols-2 gap-1">
        {options.map((option, index) => (
          <motion.div
            key={option.value}
            initial={{ scale: 0.95 }}
            animate={{ 
              scale: 1,
              backgroundColor: selectedIndex === index ? '#e0e0ff' : 'white'
            }}
            whileHover={{ backgroundColor: '#e0e0ff' }}
            className={cn(
              "px-3 py-2 cursor-pointer font-pixel relative",
              selectedIndex === index ? "bg-blue-100" : "bg-white",
              disabled ? "opacity-50 pointer-events-none" : ""
            )}
            onClick={() => !disabled && onSelect(option.value)}
            onMouseEnter={() => setSelectedIndex(index)}
          >
            {selectedIndex === index && (
              <div className="absolute left-1 top-1/2 -translate-y-1/2">
                <span className="text-black">▶</span>
              </div>
            )}
            <span className="ml-4">{option.label}</span>
          </motion.div>
        ))}
      </div>
    </PixelContainer>
  );
}

/**
 * CombatLogDisplay - Displays game events in a combat log style
 */
interface CombatLogDisplayProps {
  messages: {
    id: string | number;
    text: string;
    type?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  }[];
  className?: string;
}

export function CombatLogDisplay({
  messages,
  className
}: CombatLogDisplayProps) {
  const getTypeColor = (type = 'default') => {
    switch (type) {
      case 'success': return 'text-green-600';
      case 'warning': return 'text-amber-600';
      case 'danger': return 'text-red-600';
      case 'info': return 'text-blue-600';
      default: return 'text-gray-800';
    }
  };
  
  return (
    <PixelContainer className={cn("p-3 bg-white", className)}>
      <div className="font-pixel text-sm space-y-1">
        <AnimatePresence mode="popLayout">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className={cn("line-clamp-2", getTypeColor(msg.type))}
            >
              {msg.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </PixelContainer>
  );
}

/**
 * GameStats - Displays character stats in a Pokémon-style stat box
 */
interface GameStatsProps {
  stats: {
    label: string;
    current: number;
    max: number;
    color?: string;
  }[];
  className?: string;
}

export function GameStats({
  stats,
  className
}: GameStatsProps) {
  return (
    <PixelContainer className={cn("p-3 bg-white", className)}>
      <div className="space-y-2 font-pixel">
        {stats.map((stat, index) => (
          <div key={index} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>{stat.label}</span>
              <span>{stat.current}/{stat.max}</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-sm overflow-hidden">
              <div 
                className="h-full rounded-sm" 
                style={{ 
                  width: `${(stat.current / stat.max) * 100}%`,
                  backgroundColor: stat.color || '#4ade80'
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </PixelContainer>
  );
}

/**
 * BattleScene - Creates a Pokémon-style battle scene with opponent and player
 */
interface BattleSceneProps {
  playerCharacter: string;
  opponentCharacter: string;
  playerStats: {
    label: string;
    current: number;
    max: number;
    color?: string;
  }[];
  opponentStats: {
    label: string;
    current: number;
    max: number;
    color?: string;
  }[];
  backgroundImage?: string;
  className?: string;
  children?: React.ReactNode;
}

export function BattleScene({
  playerCharacter,
  opponentCharacter,
  playerStats,
  opponentStats,
  backgroundImage = "https://i.imgur.com/JIIWoU5.png", // Default Pokémon-style grass background
  className,
  children
}: BattleSceneProps) {
  return (
    <div 
      className={cn("relative overflow-hidden rounded-lg", className)}
      style={{ 
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        imageRendering: 'pixelated',
      }}
    >
      <div className="p-4">
        {/* Opponent */}
        <div className="flex items-start justify-between mb-8">
          <GameStats 
            stats={opponentStats} 
            className="w-64"
          />
          <div className="mt-4">
            <PixelCharacterSprite 
              character={opponentCharacter as any} 
              scale={3}
            />
          </div>
        </div>
        
        {/* Player */}
        <div className="flex items-end justify-between">
          <div className="mb-4">
            <PixelCharacterSprite 
              character={playerCharacter as any} 
              scale={3}
            />
          </div>
          <GameStats 
            stats={playerStats} 
            className="w-64"
          />
        </div>
        
        {/* Dialog/Actions Section */}
        <div className="mt-4">
          {children}
        </div>
      </div>
    </div>
  );
}
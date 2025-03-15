import React from 'react';

// Import all sprite images
import studentSprite from '../../assets/sprites/student.svg';
import entrepreneurSprite from '../../assets/sprites/entrepreneur.svg';
import artistSprite from '../../assets/sprites/artist.svg';
import bankerSprite from '../../assets/sprites/banker.svg';
import savingsSprite from '../../assets/sprites/savings.svg';
import debtSprite from '../../assets/sprites/debt.svg';
import investmentSprite from '../../assets/sprites/investment.svg';
import budgetSprite from '../../assets/sprites/budget.svg';
import crisisSprite from '../../assets/sprites/crisis.svg';

// Create a default sprite for fallback
const defaultSprite = savingsSprite;

// Career sprites mapping
export const careerSprites: Record<string, string> = {
  Student: studentSprite,
  Entrepreneur: entrepreneurSprite,
  Artist: artistSprite,
  Banker: bankerSprite
};

// Decision sprites mapping
export const decisionSprites: Record<string, string> = {
  savings_focus: savingsSprite,
  debt_payment: debtSprite,
  investment: investmentSprite,
  budget_optimization: budgetSprite,
  emergency_fund: savingsSprite,
  crisis: crisisSprite,
  default: defaultSprite
};

interface SpriteProps {
  spriteSrc: string;
  className?: string;
  alt?: string;
  isPixelated?: boolean;
}

/**
 * Generic Sprite component to render sprite images
 */
export function Sprite({ spriteSrc, className = '', alt = 'Game sprite', isPixelated = false }: SpriteProps) {
  return (
    <img 
      src={spriteSrc} 
      className={className} 
      alt={alt}
      style={{ 
        imageRendering: isPixelated ? 'pixelated' : 'auto',
        objectFit: 'contain',
        filter: isPixelated ? 'none' : 'drop-shadow(0 0 5px rgba(159, 239, 0, 0.3))',
        transition: 'all 0.3s ease'
      }}
    />
  );
}

/**
 * Career Sprite component - renders the avatar for a specific career path
 */
export function CareerSprite({ career, className = '' }: { career: string; className?: string }) {
  const spriteSrc = careerSprites[career] || defaultSprite;
  return (
    <div className="relative flex items-center justify-center w-full h-full">
      <Sprite 
        spriteSrc={spriteSrc} 
        className={`relative z-10 ${className}`} 
        alt={`${career} character`}
      />
    </div>
  );
}

/**
 * Decision Sprite component - renders the sprite for a financial decision or scenario
 */
export function DecisionSprite({ decisionType, className = '' }: { decisionType: string; className?: string }) {
  // Get sprite source based on decision type, with fallback to default
  const spriteSrc = decisionSprites[decisionType] || decisionSprites.default;
  return (
    <div className="relative flex items-center justify-center">
      <div className="absolute inset-0 bg-[#9FEF00]/5 rounded-lg"></div>
      <Sprite 
        spriteSrc={spriteSrc} 
        className={`relative z-10 ${className}`} 
        alt={`${decisionType} scenario`}
      />
    </div>
  );
}

/**
 * Get sprite source for a career
 */
export function getCareerSprite(career: string): string {
  return careerSprites[career] || defaultSprite;
}

/**
 * Get sprite source for a decision type
 */
export function getDecisionSprite(decisionType: string): string {
  return decisionSprites[decisionType] || decisionSprites.default;
}
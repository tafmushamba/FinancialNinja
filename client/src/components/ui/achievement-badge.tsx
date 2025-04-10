import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface AchievementBadgeProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  level?: 'bronze' | 'silver' | 'gold' | 'platinum';
  obtained?: boolean;
  progress?: number; // 0-100
  className?: string;
  onClick?: () => void;
  unlockDate?: Date;
}

export function AchievementBadge({
  title,
  description,
  icon,
  level = 'bronze',
  obtained = false,
  progress = 0,
  className,
  onClick,
  unlockDate
}: AchievementBadgeProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  
  // Define colors based on badge level
  const levelStyles = {
    bronze: {
      bgGradient: 'from-amber-700/20 to-amber-600/20',
      borderColor: 'border-amber-700/30',
      textColor: 'text-amber-500',
      shadowColor: 'shadow-amber-700/10',
      iconBg: 'bg-amber-700/30'
    },
    silver: {
      bgGradient: 'from-slate-400/20 to-slate-300/20',
      borderColor: 'border-slate-400/30',
      textColor: 'text-slate-300',
      shadowColor: 'shadow-slate-400/10',
      iconBg: 'bg-slate-400/30'
    },
    gold: {
      bgGradient: 'from-yellow-600/20 to-yellow-500/20',
      borderColor: 'border-yellow-500/30',
      textColor: 'text-yellow-500',
      shadowColor: 'shadow-yellow-500/10',
      iconBg: 'bg-yellow-600/30'
    },
    platinum: {
      bgGradient: 'from-cyan-500/20 to-cyan-400/20',
      borderColor: 'border-cyan-400/30',
      textColor: 'text-cyan-400',
      shadowColor: 'shadow-cyan-400/10',
      iconBg: 'bg-cyan-500/30'
    }
  };
  
  const handleClick = () => {
    setIsFlipped(!isFlipped);
    if (onClick) onClick();
  };
  
  // Format unlock date
  const formattedDate = unlockDate 
    ? new Intl.DateTimeFormat('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }).format(unlockDate)
    : null;
  
  return (
    <div 
      className={cn(
        'relative perspective w-full max-w-[250px] aspect-square cursor-pointer',
        obtained ? 'opacity-100' : 'opacity-50',
        className
      )}
      onClick={handleClick}
    >
      <div className={cn(
        'absolute inset-0 w-full h-full transition-all duration-700 preserve-3d',
        isFlipped ? 'rotate-y-180' : ''
      )}>
        {/* Front side */}
        <div className={cn(
          'absolute inset-0 backface-hidden rounded-lg p-4 flex flex-col items-center justify-center text-center',
          `bg-gradient-to-br ${levelStyles[level].bgGradient}`,
          `border ${levelStyles[level].borderColor}`,
          'backdrop-blur-sm',
          obtained ? `${levelStyles[level].shadowColor} shadow-lg` : '',
          'transition-all duration-300'
        )}>
          {/* Badge icon */}
          <div className={cn(
            'w-16 h-16 rounded-full flex items-center justify-center mb-3',
            levelStyles[level].iconBg,
            obtained ? 'animate-pulse-slow' : '',
          )}>
            {icon || (
              <svg xmlns="http://www.w3.org/2000/svg" className={cn('w-8 h-8', levelStyles[level].textColor)} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            )}
          </div>
          
          {/* Badge level indicator */}
          <div className={cn(
            'absolute top-2 right-2 text-xs font-bold uppercase',
            levelStyles[level].textColor
          )}>
            {level}
          </div>
          
          {/* Badge title */}
          <h3 className={cn(
            'font-bold text-sm mb-1',
            levelStyles[level].textColor
          )}>
            {title}
          </h3>
          
          {/* Badge short description */}
          <p className="text-xs text-gray-300 mb-3 line-clamp-2">
            {description}
          </p>
          
          {/* Progress bar (if not obtained) */}
          {!obtained && progress > 0 && (
            <div className="w-full mt-auto">
              <div className="w-full h-1.5 bg-dark-700 rounded-full overflow-hidden">
                <div 
                  className={cn(
                    'h-full',
                    levelStyles[level].textColor
                  )}
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-400 mt-1 text-right">{progress}%</p>
            </div>
          )}
          
          {/* Unlock indicator (if obtained) */}
          {obtained && (
            <div className="flex items-center mt-auto">
              <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
              <p className="text-xs text-gray-300">Unlocked {formattedDate ? `on ${formattedDate}` : ''}</p>
            </div>
          )}
          
          {/* Locked indicator (if not obtained and no progress) */}
          {!obtained && progress === 0 && (
            <div className="flex items-center mt-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <p className="text-xs text-gray-500">Locked</p>
            </div>
          )}
          
          {/* Flip indicator */}
          <div className="absolute bottom-2 text-xs text-gray-400 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Tap for details
          </div>
        </div>
        
        {/* Back side */}
        <div className={cn(
          'absolute inset-0 backface-hidden rotate-y-180 rounded-lg p-4',
          `bg-gradient-to-br ${levelStyles[level].bgGradient}`,
          `border ${levelStyles[level].borderColor}`,
          'backdrop-blur-sm',
          obtained ? `${levelStyles[level].shadowColor} shadow-lg` : '',
          'transition-all duration-300',
          'flex flex-col'
        )}>
          <h3 className={cn(
            'font-bold text-sm mb-2',
            levelStyles[level].textColor
          )}>
            {title}
          </h3>
          
          <p className="text-xs text-gray-300 mb-4 flex-grow overflow-y-auto pr-2">
            {description}
          </p>
          
          {/* Requirements section */}
          <div className="mt-auto">
            <h4 className="text-xs font-bold text-gray-300 mb-1">Requirements:</h4>
            <ul className="text-xs text-gray-400 list-disc ml-4 space-y-1">
              <li>Complete the budgeting module</li>
              <li>Save at least £100 in your goals</li>
              <li>Take the financial quiz</li>
            </ul>
          </div>
          
          {/* Rewards section */}
          <div className="mt-3">
            <h4 className="text-xs font-bold text-gray-300 mb-1">Rewards:</h4>
            <p className="text-xs text-gray-400">
              Unlock the advanced investment simulator and earn 50 experience points.
            </p>
          </div>
          
          {/* Flip back indicator */}
          <div className="absolute bottom-2 right-2 text-xs text-gray-400 flex items-center">
            Back
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </div>
        </div>
      </div>
      
      {/* Sparkle effect for obtained badges */}
      {obtained && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/4 w-2 h-2 rounded-full bg-white animate-sparkle-1"></div>
          <div className="absolute top-1/4 right-1/4 w-1.5 h-1.5 rounded-full bg-white animate-sparkle-2"></div>
          <div className="absolute bottom-1/3 left-1/3 w-1 h-1 rounded-full bg-white animate-sparkle-3"></div>
        </div>
      )}
    </div>
  );
}

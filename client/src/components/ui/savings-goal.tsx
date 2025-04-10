import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { DollarSign } from 'lucide-react';
import { Button } from './button';

interface SavingsGoalProps {
  goalName: string;
  targetAmount: number;
  currentAmount: number;
  currency?: string;
  endDate?: Date;
  className?: string;
  onAddSavings?: (amount: number) => void;
  onEdit?: () => void;
  colorScheme?: 'green' | 'cyan' | 'purple';
  icon?: React.ReactNode;
}

export function SavingsGoal({
  goalName,
  targetAmount,
  currentAmount,
  currency = '£',
  endDate,
  className,
  onAddSavings,
  onEdit,
  colorScheme = 'green',
  icon
}: SavingsGoalProps) {
  const [animatedAmount, setAnimatedAmount] = useState(0);
  const [showInput, setShowInput] = useState(false);
  const [inputAmount, setInputAmount] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  
  // Percentage complete
  const percentComplete = Math.min(100, (currentAmount / targetAmount) * 100);
  const remaining = targetAmount - currentAmount;
  
  // Color scheme mapping
  const colorMap = {
    green: {
      primary: 'text-neon-green',
      secondary: 'text-neon-green/70',
      bg: 'bg-neon-green',
      bgLight: 'bg-neon-green/20',
      border: 'border-neon-green/30',
      shadow: 'shadow-neon-green/30',
      glow: 'glow-green-sm'
    },
    cyan: {
      primary: 'text-neon-cyan',
      secondary: 'text-neon-cyan/70',
      bg: 'bg-neon-cyan',
      bgLight: 'bg-neon-cyan/20',
      border: 'border-neon-cyan/30',
      shadow: 'shadow-neon-cyan/30',
      glow: 'glow-cyan-sm'
    },
    purple: {
      primary: 'text-neon-purple',
      secondary: 'text-neon-purple/70',
      bg: 'bg-neon-purple',
      bgLight: 'bg-neon-purple/20',
      border: 'border-neon-purple/30',
      shadow: 'shadow-neon-purple/30',
      glow: 'glow-purple-sm'
    }
  };
  
  // Calculate days remaining if end date provided
  const getDaysRemaining = () => {
    if (!endDate) return null;
    
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };
  
  const daysRemaining = getDaysRemaining();
  
  // Animate current amount when it changes
  useEffect(() => {
    const duration = 1000; // Animation duration in ms
    const startTime = Date.now();
    const startValue = animatedAmount;
    
    const animateValue = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      
      if (elapsed < duration) {
        const progress = elapsed / duration;
        // Easing function for smooth animation
        const easedProgress = progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;
        
        const newValue = startValue + (currentAmount - startValue) * easedProgress;
        setAnimatedAmount(newValue);
        requestAnimationFrame(animateValue);
      } else {
        setAnimatedAmount(currentAmount);
      }
    };
    
    animateValue();
  }, [currentAmount]);
  
  // Handle add savings
  const handleAddSavings = () => {
    if (!inputAmount || isNaN(Number(inputAmount))) return;
    
    const amount = Number(inputAmount);
    if (amount <= 0) return;
    
    if (onAddSavings) {
      onAddSavings(amount);
      setInputAmount('');
      setShowInput(false);
    }
  };
  
  return (
    <div 
      className={cn(
        'relative w-full rounded-lg p-4 backdrop-blur-sm',
        'border border-dark-600/80',
        colorMap[colorScheme].border,
        'bg-dark-800/60',
        'shadow-lg hover:shadow-xl transition-all duration-300',
        isHovered ? colorMap[colorScheme].shadow : '',
        isHovered ? colorMap[colorScheme].glow : '',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Goal Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center">
          <div className={cn(
            'flex items-center justify-center w-8 h-8 rounded-md mr-3',
            colorMap[colorScheme].bgLight
          )}>
            {icon || <DollarSign className={cn('w-4 h-4', colorMap[colorScheme].primary)} />}
          </div>
          <div>
            <h3 className="font-bold text-sm">{goalName}</h3>
            {endDate && (
              <p className={cn(
                'text-xs',
                daysRemaining && daysRemaining < 30 ? 'text-neon-red' : 'text-gray-400'
              )}>
                {daysRemaining !== null ? `${daysRemaining} days remaining` : 'No deadline'}
              </p>
            )}
          </div>
        </div>
        
        {onEdit && (
          <button 
            onClick={onEdit}
            className="text-gray-400 hover:text-white p-1 rounded transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
        )}
      </div>
      
      {/* Progress Bar */}
      <div className="relative w-full h-4 bg-dark-700 rounded-full overflow-hidden mb-2">
        <div 
          className={cn(
            'h-full rounded-full transition-all duration-1000',
            colorMap[colorScheme].bg
          )}
          style={{ width: `${percentComplete}%` }}
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" 
               style={{ 
                 backgroundSize: '200% 100%',
                 backgroundPosition: percentComplete > 95 ? '-100% 0' : '200% 0'
               }}></div>
        </div>
        
        {/* Tick marks */}
        <div className="absolute inset-0 flex justify-between px-1">
          {[25, 50, 75].map(tick => (
            <div 
              key={tick} 
              className="w-px h-full bg-dark-600"
              style={{ left: `${tick}%` }}
            ></div>
          ))}
        </div>
      </div>
      
      {/* Amount details */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <p className={cn('text-sm font-medium', colorMap[colorScheme].primary)}>
            {currency}{animatedAmount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-gray-400">Current</p>
        </div>
        
        <div className="text-right">
          <p className="text-sm font-medium">
            {currency}{targetAmount.toLocaleString()}
          </p>
          <p className="text-xs text-gray-400">Target</p>
        </div>
      </div>
      
      {/* Add savings input */}
      {showInput ? (
        <div className="flex space-x-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">{currency}</span>
            <input
              type="text"
              value={inputAmount}
              onChange={(e) => setInputAmount(e.target.value.replace(/[^0-9.]/g, ''))}
              className={cn(
                'w-full rounded-md border border-dark-600 px-7 py-2 text-sm',
                'bg-dark-800 focus:ring-1',
                `focus:ring-${colorScheme} focus:border-${colorScheme}`,
                'transition-all duration-300'
              )}
              placeholder="0.00"
              autoFocus
            />
          </div>
          <Button 
            onClick={handleAddSavings}
            className={cn(
              colorMap[colorScheme].bgLight,
              colorMap[colorScheme].primary
            )}
            size="sm"
          >
            Add
          </Button>
          <Button 
            onClick={() => {
              setShowInput(false);
              setInputAmount('');
            }}
            variant="ghost"
            size="sm"
          >
            Cancel
          </Button>
        </div>
      ) : (
        <div className="flex space-x-2">
          <Button 
            onClick={() => setShowInput(true)}
            className={cn(
              'flex-1',
              colorMap[colorScheme].bgLight,
              colorMap[colorScheme].primary
            )}
            size="sm"
          >
            Add Savings
          </Button>
          
          {/* Confetti animation when goal reached */}
          {currentAmount >= targetAmount && (
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none z-20">
              <div className="absolute w-full h-full animate-confetti opacity-70"></div>
              <div className={cn(
                'text-lg font-bold px-4 py-2 rounded-md z-10',
                colorMap[colorScheme].primary,
                colorMap[colorScheme].bgLight
              )}>
                Goal Reached! 🎉
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Bottom details */}
      <div className="flex justify-between items-center mt-3">
        <p className="text-xs text-gray-400">
          {remaining > 0 
            ? `${currency}${remaining.toLocaleString()} left to goal` 
            : 'Goal complete!'}
        </p>
        <p className={cn(
          'text-xs font-medium',
          colorMap[colorScheme].primary
        )}>
          {percentComplete.toFixed(0)}%
        </p>
      </div>
    </div>
  );
}

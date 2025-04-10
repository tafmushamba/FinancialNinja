import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle, Circle, LockIcon, ArrowRight } from 'lucide-react';

interface ProgressStep {
  id: string | number;
  title: string;
  description?: string;
  status: 'completed' | 'current' | 'locked';
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  reward?: string;
  icon?: React.ReactNode;
}

interface ProgressPathProps {
  steps: ProgressStep[];
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  animationDelay?: number; // Base delay in ms
  onClick?: (stepId: string | number) => void;
}

export function ProgressPath({
  steps,
  className,
  orientation = 'vertical',
  animationDelay = 100,
  onClick
}: ProgressPathProps) {
  const handleStepClick = (step: ProgressStep) => {
    if (step.status !== 'locked' && onClick) {
      onClick(step.id);
    }
  };
  
  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case 'beginner': return 'text-neon-green';
      case 'intermediate': return 'text-neon-cyan';
      case 'advanced': return 'text-neon-purple';
      default: return 'text-neon-green';
    }
  };
  
  const getIconForStatus = (step: ProgressStep) => {
    if (step.icon) return step.icon;
    
    switch(step.status) {
      case 'completed':
        return <CheckCircle className="w-8 h-8 text-neon-green" />;
      case 'current':
        return <Circle className="w-8 h-8 stroke-2 text-neon-cyan" />;
      case 'locked':
        return <LockIcon className="w-8 h-8 text-gray-500" />;
    }
  };

  return (
    <div className={cn(
      'relative',
      orientation === 'vertical' ? 'flex flex-col' : 'flex flex-row items-start',
      className
    )}>
      {/* Progress line */}
      <div className={cn(
        'absolute z-0 bg-gradient-to-b from-neon-green/30 via-neon-cyan/30 to-neon-purple/30',
        orientation === 'vertical' 
          ? 'left-5 top-0 w-0.5 h-full transform -translate-x-1/2'
          : 'left-0 top-5 w-full h-0.5 transform -translate-y-1/2'
      )}></div>
      
      {/* Steps */}
      {steps.map((step, index) => (
        <div 
          key={step.id}
          className={cn(
            'relative z-10 flex',
            orientation === 'vertical' 
              ? 'items-start mb-10 last:mb-0' 
              : 'flex-col items-center mx-4 first:ml-0 last:mr-0',
            'animate-fadeIn',
            step.status === 'locked' ? 'opacity-50' : 'opacity-100',
            step.status !== 'locked' ? 'cursor-pointer' : 'cursor-not-allowed'
          )}
          style={{ animationDelay: `${index * animationDelay}ms` }}
          onClick={() => handleStepClick(step)}
        >
          {/* Step icon/indicator */}
          <div className={cn(
            'flex items-center justify-center rounded-full',
            'w-10 h-10 z-10 bg-dark-800 border-2',
            step.status === 'completed' ? 'border-neon-green glow-green-sm' : '',
            step.status === 'current' ? 'border-neon-cyan glow-cyan-sm animate-pulse-slow' : '',
            step.status === 'locked' ? 'border-gray-700' : '',
            'transition-all duration-300 transform',
            step.status !== 'locked' ? 'hover:scale-110' : '',
            orientation === 'vertical' ? 'mr-4' : 'mb-4'
          )}>
            {getIconForStatus(step)}
          </div>
          
          {/* Step content */}
          <div className={cn(
            'flex-1',
            orientation === 'vertical' ? 'pt-1' : 'text-center max-w-[120px]'
          )}>
            <div className="flex items-center">
              <h3 className={cn(
                'font-bold text-md mb-1',
                step.status === 'completed' ? 'text-neon-green' : '',
                step.status === 'current' ? 'text-neon-cyan' : '',
                step.status === 'locked' ? 'text-gray-400' : ''
              )}>
                {step.title}
              </h3>
              {step.status === 'current' && (
                <ArrowRight className="w-4 h-4 ml-2 text-neon-cyan animate-bounce-x" />
              )}
            </div>
            
            {step.description && (
              <p className="text-sm text-gray-400 mb-1">{step.description}</p>
            )}
            
            {step.difficulty && (
              <span className={cn(
                'text-xs font-medium',
                getDifficultyColor(step.difficulty)
              )}>
                {step.difficulty.charAt(0).toUpperCase() + step.difficulty.slice(1)}
              </span>
            )}
            
            {step.reward && (
              <div className="mt-2 flex items-center text-xs text-neon-yellow">
                <span className="mr-1">🏆</span> {step.reward}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

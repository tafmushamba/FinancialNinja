import React from 'react';
import { Button, ButtonProps } from './button';
import { cn } from '@/lib/utils';

interface NeonButtonProps extends ButtonProps {
  glowColor?: 'green' | 'cyan' | 'purple' | 'yellow' | 'red';
  hoverEffect?: 'shine' | 'pulse' | 'scale' | 'glow' | 'all';
  showArrow?: boolean;
}

export const NeonButton = React.forwardRef<HTMLButtonElement, NeonButtonProps>(
  ({ 
    children, 
    className, 
    glowColor = 'green', 
    hoverEffect = 'all', 
    showArrow = false,
    ...props 
  }, ref) => {
    // Map color names to CSS variables
    const colorMap = {
      green: {
        bg: 'bg-neon-green/20',
        text: 'text-neon-green',
        border: 'border-neon-green/30',
        hover: 'hover:bg-neon-green/30',
        shadow: 'shadow-neon-green/20',
        glow: 'glow-green'
      },
      cyan: {
        bg: 'bg-neon-cyan/20',
        text: 'text-neon-cyan',
        border: 'border-neon-cyan/30',
        hover: 'hover:bg-neon-cyan/30',
        shadow: 'shadow-neon-cyan/20',
        glow: 'glow-cyan'
      },
      purple: {
        bg: 'bg-neon-purple/20',
        text: 'text-neon-purple',
        border: 'border-neon-purple/30',
        hover: 'hover:bg-neon-purple/30',
        shadow: 'shadow-neon-purple/20',
        glow: 'glow-purple'
      },
      yellow: {
        bg: 'bg-neon-yellow/20',
        text: 'text-neon-yellow',
        border: 'border-neon-yellow/30',
        hover: 'hover:bg-neon-yellow/30',
        shadow: 'shadow-neon-yellow/20',
        glow: 'glow-yellow'
      },
      red: {
        bg: 'bg-neon-red/20',
        text: 'text-neon-red',
        border: 'border-neon-red/30',
        hover: 'hover:bg-neon-red/30',
        shadow: 'shadow-neon-red/20',
        glow: 'glow-red'
      }
    };

    // Construct effect classes based on the hoverEffect prop
    let effectClasses = '';
    
    if (hoverEffect === 'all' || hoverEffect === 'shine') {
      effectClasses += ' animate-shine';
    }
    
    if (hoverEffect === 'all' || hoverEffect === 'pulse') {
      effectClasses += ' hover:animate-pulse-slow';
    }
    
    if (hoverEffect === 'all' || hoverEffect === 'scale') {
      effectClasses += ' transform transition-transform duration-300 hover:scale-105';
    }
    
    if (hoverEffect === 'all' || hoverEffect === 'glow') {
      effectClasses += ` hover:${colorMap[glowColor].glow}`;
    }

    return (
      <Button
        ref={ref}
        className={cn(
          'relative overflow-hidden',
          colorMap[glowColor].bg,
          colorMap[glowColor].text,
          colorMap[glowColor].border,
          colorMap[glowColor].hover,
          `hover:${colorMap[glowColor].shadow}`,
          'transition-all duration-300',
          effectClasses,
          className
        )}
        {...props}
      >
        <span className="relative z-10 flex items-center">
          {children}
          {showArrow && (
            <span className="ml-2 transform translate-x-0 group-hover:translate-x-1 transition-transform duration-300">
              →
            </span>
          )}
        </span>
        <span className="absolute inset-0 overflow-hidden rounded-md">
          <span className="absolute inset-0 opacity-0 hover:opacity-20 bg-gradient-to-r from-transparent via-white to-transparent -translate-x-full hover:translate-x-full transition-all duration-1000 ease-out transform"></span>
        </span>
      </Button>
    );
  }
);

NeonButton.displayName = 'NeonButton';

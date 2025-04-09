
import React from 'react';
import { cn } from '@/lib/utils';

interface MascotProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Mascot({ className, size = 'md' }: MascotProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <img 
      src="/mascot.png" 
      alt="MoneyMind Mascot" 
      className={cn(
        'transition-transform hover:scale-110',
        sizeClasses[size],
        className
      )} 
    />
  );
}

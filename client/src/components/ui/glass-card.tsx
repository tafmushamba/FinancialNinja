import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardFooter, CardProps } from './card';

interface GlassCardProps extends Omit<CardProps, 'ref'> {
  glowColor?: 'green' | 'cyan' | 'purple' | 'yellow' | 'red' | 'none';
  hoverEffect?: 'tilt' | 'float' | 'scale' | 'glow' | 'all' | 'none';
  intensity?: 'light' | 'medium' | 'strong';
  children: React.ReactNode;
  className?: string;
  cardHeader?: React.ReactNode;
  cardFooter?: React.ReactNode;
  cardContentClassName?: string;
  withBlur?: boolean;
}

export function GlassCard({
  glowColor = 'green',
  hoverEffect = 'all',
  intensity = 'medium',
  children,
  className,
  cardHeader,
  cardFooter,
  cardContentClassName,
  withBlur = true,
  ...props
}: GlassCardProps) {
  // Map color names to CSS variables
  const colorMap = {
    green: {
      border: 'hover:border-neon-green/30',
      shadow: 'hover:shadow-neon-green/20',
      glow: 'hover:glow-green',
      highlight: 'rgba(var(--neon-green-rgb), 0.05)'
    },
    cyan: {
      border: 'hover:border-neon-cyan/30',
      shadow: 'hover:shadow-neon-cyan/20',
      glow: 'hover:glow-cyan',
      highlight: 'rgba(var(--neon-cyan-rgb), 0.05)'
    },
    purple: {
      border: 'hover:border-neon-purple/30',
      shadow: 'hover:shadow-neon-purple/20',
      glow: 'hover:glow-purple',
      highlight: 'rgba(var(--neon-purple-rgb), 0.05)'
    },
    yellow: {
      border: 'hover:border-neon-yellow/30',
      shadow: 'hover:shadow-neon-yellow/20',
      glow: 'hover:glow-yellow',
      highlight: 'rgba(var(--neon-yellow-rgb), 0.05)'
    },
    red: {
      border: 'hover:border-neon-red/30',
      shadow: 'hover:shadow-neon-red/20',
      glow: 'hover:glow-red',
      highlight: 'rgba(var(--neon-red-rgb), 0.05)'
    },
    none: {
      border: '',
      shadow: '',
      glow: '',
      highlight: 'rgba(255, 255, 255, 0.03)'
    }
  };

  // Map intensity to opacity levels
  const intensityMap = {
    light: {
      bg: 'bg-dark-800/30',
      backdrop: 'backdrop-blur-sm'
    },
    medium: {
      bg: 'bg-dark-800/50',
      backdrop: 'backdrop-blur'
    },
    strong: {
      bg: 'bg-dark-800/70',
      backdrop: 'backdrop-blur-lg'
    }
  };

  // Construct effect classes based on the hoverEffect prop
  let effectClasses = 'transition-all duration-300 ';
  
  if (hoverEffect === 'all' || hoverEffect === 'tilt') {
    effectClasses += 'tilt-on-hover ';
  }
  
  if (hoverEffect === 'all' || hoverEffect === 'float') {
    effectClasses += 'hover:-translate-y-1 ';
  }
  
  if (hoverEffect === 'all' || hoverEffect === 'scale') {
    effectClasses += 'hover:scale-[1.02] ';
  }
  
  if (hoverEffect === 'all' || hoverEffect === 'glow') {
    effectClasses += `${colorMap[glowColor].glow} `;
  }

  const blurClass = withBlur ? intensityMap[intensity].backdrop : '';

  return (
    <Card 
      className={cn(
        intensityMap[intensity].bg,
        blurClass,
        'border border-dark-600/50',
        colorMap[glowColor].border,
        'shadow-lg',
        colorMap[glowColor].shadow,
        'overflow-hidden',
        'backdrop-saturation-150',
        'cursor-pointer',
        effectClasses,
        className
      )} 
      {...props}
    >
      {cardHeader && <CardHeader>{cardHeader}</CardHeader>}
      <CardContent className={cn('relative z-10', cardContentClassName)}>
        {/* Subtle gradient overlay */}
        <div 
          className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0"
          style={{
            background: `linear-gradient(135deg, transparent 0%, ${colorMap[glowColor].highlight} 50%, transparent 100%)`
          }}
        />
        {children}
      </CardContent>
      {cardFooter && <CardFooter>{cardFooter}</CardFooter>}
    </Card>
  );
}

// Export a simpler version with fewer props for ease of use
export function SimpleGlassCard({
  children,
  className,
  glowColor = 'green',
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  glowColor?: 'green' | 'cyan' | 'purple' | 'yellow' | 'red' | 'none';
}) {
  return (
    <GlassCard
      glowColor={glowColor}
      className={className}
      {...props}
    >
      {children}
    </GlassCard>
  );
}

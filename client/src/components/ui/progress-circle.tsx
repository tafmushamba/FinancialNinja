import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressCircleProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  textClassName?: string;
  showText?: boolean;
}

const ProgressCircle: React.FC<ProgressCircleProps> = ({
  value,
  size = 64,
  strokeWidth = 6,
  className,
  textClassName,
  showText = true
}) => {
  // Ensure value is between 0 and 100
  const percentage = Math.max(0, Math.min(100, value));
  
  // Calculate circle properties
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  return (
    <div className={cn('relative', className)} style={{ width: size, height: size }}>
      <svg className="w-full h-full" viewBox={`0 0 ${size} ${size}`}>
        {/* Background circle */}
        <circle 
          cx={size / 2} 
          cy={size / 2} 
          r={radius}
          stroke="currentColor" 
          strokeWidth={strokeWidth} 
          fill="none"
          className="text-dark-600"
        />
        
        {/* Progress circle */}
        <circle 
          cx={size / 2} 
          cy={size / 2} 
          r={radius}
          stroke="currentColor" 
          strokeWidth={strokeWidth} 
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="text-neon-green rotate-[-90deg] origin-center"
        />
      </svg>
      
      {showText && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn('text-xs font-bold text-neon-green', textClassName)}>
            {percentage}%
          </span>
        </div>
      )}
    </div>
  );
};

export default ProgressCircle;

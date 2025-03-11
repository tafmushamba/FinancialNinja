import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

interface GameProgressTrackerProps {
  currentRound: number;
  totalRounds: number;
  level: number;
  xp: number;
}

export function GameProgressTracker({ currentRound, totalRounds, level, xp }: GameProgressTrackerProps) {
  return (
    <div className="w-full bg-background/50 rounded-lg p-4 mb-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-md font-medium">Game Progress</h3>
        <Badge variant="outline" className="bg-primary/10">Level {level}</Badge>
      </div>
      
      {/* Round progress */}
      <div className="mb-3">
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>Round</span>
          <span>{currentRound} of {totalRounds}</span>
        </div>
        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${(currentRound / totalRounds) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
      
      {/* XP progress */}
      <div>
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>Experience</span>
          <span>{xp} XP</span>
        </div>
        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-amber-500"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((xp / 100) * 100, 100)}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    </div>
  );
}
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface GameProgressTrackerProps {
  currentRound: number;
  totalRounds: number;
  level: number;
  xp: number;
}

export function GameProgressTracker({ currentRound, totalRounds, level, xp }: GameProgressTrackerProps) {
  // Calculate percentage of rounds completed
  const roundProgress = (currentRound / totalRounds) * 100;
  
  // XP required for next level (simple formula)
  const xpForNextLevel = level * 100;
  
  // Calculate XP progress percentage
  const xpProgress = Math.min(100, (xp / xpForNextLevel) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Game Progress</span>
            </div>
            <span className="text-sm text-muted-foreground">
              Round {currentRound} of {totalRounds}
            </span>
          </div>
          
          <div className="space-y-1">
            <Progress value={roundProgress} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span>{Math.round(roundProgress)}%</span>
            </div>
          </div>
          
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Star className="h-4 w-4 text-amber-500" />
              <span className="text-sm font-medium">Level {level}</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {xp} / {xpForNextLevel} XP
            </span>
          </div>
          
          <div className="space-y-1">
            <Progress value={xpProgress} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Level Progress</span>
              <span>{Math.round(xpProgress)}%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
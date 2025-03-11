import React from 'react';
import { Card } from '@/components/ui/card';
import { Award, Star, Trophy, Medal } from 'lucide-react';

interface AchievementsListProps {
  achievements: string[];
}

export function AchievementsList({ achievements }: AchievementsListProps) {
  if (!achievements || achievements.length === 0) {
    return (
      <Card className="p-4 text-center text-muted-foreground">
        <div className="flex flex-col items-center gap-2">
          <Trophy className="h-8 w-8 opacity-50" />
          <p>No achievements unlocked yet. Make financial decisions to earn achievements!</p>
        </div>
      </Card>
    );
  }

  // Get a icon based on achievement name
  const getAchievementIcon = (achievement: string) => {
    if (achievement.includes('Milestone') || achievement.includes('Level')) {
      return <Star className="h-5 w-5 text-yellow-500" />;
    } else if (achievement.includes('Journey') || achievement.includes('Started')) {
      return <Award className="h-5 w-5 text-blue-500" />;
    } else if (achievement.includes('Freedom') || achievement.includes('Completed')) {
      return <Trophy className="h-5 w-5 text-purple-500" />;
    } else {
      return <Medal className="h-5 w-5 text-green-500" />;
    }
  };

  return (
    <Card className="p-4">
      <h3 className="text-lg font-medium mb-3">Achievements Unlocked</h3>
      <div className="space-y-2">
        {achievements.map((achievement, index) => (
          <div 
            key={index} 
            className="flex items-center gap-3 p-2 rounded-md border bg-background/80 hover:bg-background transition-colors"
          >
            {getAchievementIcon(achievement)}
            <span>{achievement}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
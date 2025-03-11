import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy } from 'lucide-react';

interface AchievementsListProps {
  achievements: string[];
}

export function AchievementsList({ achievements }: AchievementsListProps) {
  if (!achievements || achievements.length === 0) {
    return (
      <Card className="my-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl flex items-center">
            <Trophy className="h-5 w-5 mr-2 text-amber-500" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No achievements unlocked yet. Make wise financial decisions to earn achievements!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="my-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center">
          <Trophy className="h-5 w-5 mr-2 text-amber-500" />
          Achievements ({achievements.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {achievements.map((achievement, index) => (
            <Badge 
              key={index} 
              variant="secondary"
              className="py-1.5 px-3 text-sm bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
            >
              {achievement}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
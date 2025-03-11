import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, CheckCircle } from 'lucide-react';

interface AchievementsListProps {
  achievements: string[];
}

export function AchievementsList({ achievements }: AchievementsListProps) {
  if (!achievements || achievements.length === 0) {
    return null;
  }
  
  return (
    <Card className="shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Award className="h-5 w-5 text-amber-500" />
          Achievements Unlocked
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {achievements.map((achievement, index) => (
            <li key={index} className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span>{achievement}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
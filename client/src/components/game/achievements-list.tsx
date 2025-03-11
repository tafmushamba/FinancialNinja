import { Card, CardContent } from '@/components/ui/card';
import { Star, Trophy, Award, TrendingUp, AlertCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface AchievementsListProps {
  achievements: string[];
}

export function AchievementsList({ achievements }: AchievementsListProps) {
  const getAchievementIcon = (achievement: string) => {
    if (achievement.includes('Debt') || achievement.includes('debt')) {
      return <Award className="text-blue-500" />;
    } else if (achievement.includes('Cash Flow') || achievement.includes('Income')) {
      return <TrendingUp className="text-green-500" />;
    } else if (achievement.includes('Saver') || achievement.includes('Savings')) {
      return <Star className="text-amber-500" />;
    } else if (achievement.includes('Crisis') || achievement.includes('Emergency')) {
      return <AlertCircle className="text-red-500" />;
    }
    return <Trophy className="text-purple-500" />;
  };

  return (
    <div className="space-y-4">
      {achievements.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">No achievements unlocked yet. Keep making good financial decisions!</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Achievements Unlocked</h3>
            <div className="space-y-2">
              {achievements.map((achievement, index) => (
                <div key={index}>
                  <div className="flex items-center gap-3 py-2">
                    <div className="h-8 w-8 flex items-center justify-center rounded-full bg-muted">
                      {getAchievementIcon(achievement)}
                    </div>
                    <div>
                      <p className="font-medium">{achievement}</p>
                    </div>
                  </div>
                  {index < achievements.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
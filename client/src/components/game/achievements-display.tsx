import React from 'react';
import { motion } from 'framer-motion';
import { Award, Star, Sparkles, TrendingUp, Gem, Crown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface AchievementsDisplayProps {
  achievements: string[];
}

export function AchievementsDisplay({ achievements }: AchievementsDisplayProps) {
  if (!achievements.length) return null;
  
  // Define achievement icons based on name pattern
  const getAchievementIcon = (name: string) => {
    if (name.includes('Saver')) return <PiggyBank className="h-6 w-6 text-amber-500" />;
    if (name.includes('Investor')) return <TrendingUp className="h-6 w-6 text-green-500" />;
    if (name.includes('Budgeter')) return <BarChart className="h-6 w-6 text-purple-500" />;
    if (name.includes('Milestone')) return <Award className="h-6 w-6 text-blue-500" />;
    if (name.includes('Master')) return <Crown className="h-6 w-6 text-amber-500" />;
    if (name.includes('Level')) return <Star className="h-6 w-6 text-amber-500" />;
    // Default
    return <Sparkles className="h-6 w-6 text-pink-500" />;
  };
  
  // Define achievement backgrounds based on name pattern
  const getAchievementStyle = (name: string) => {
    if (name.includes('Saver')) return 'bg-amber-50 dark:bg-amber-950/30';
    if (name.includes('Investor')) return 'bg-green-50 dark:bg-green-950/30';
    if (name.includes('Budgeter')) return 'bg-purple-50 dark:bg-purple-950/30';
    if (name.includes('Milestone')) return 'bg-blue-50 dark:bg-blue-950/30';
    if (name.includes('Master')) return 'bg-amber-50 dark:bg-amber-950/30';
    if (name.includes('Level')) return 'bg-amber-50 dark:bg-amber-950/30';
    // Default
    return 'bg-pink-50 dark:bg-pink-950/30';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Gem className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-medium">Achievements Unlocked!</h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {achievements.map((achievement, index) => (
          <motion.div
            key={achievement}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card className={`overflow-hidden ${getAchievementStyle(achievement)}`}>
              <CardContent className="p-0">
                <div className="flex items-center p-3">
                  <div className="mr-3">
                    {getAchievementIcon(achievement)}
                  </div>
                  <div>
                    <p className="font-medium">{achievement}</p>
                    <p className="text-xs text-muted-foreground">New achievement unlocked!</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function PiggyBank(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.7-1 2-2h2v-4h-2c0-1-.5-1.5-1-2V5z" />
      <path d="M2 9v1c0 1.1.9 2 2 2h1" />
      <path d="M16 11h0" />
    </svg>
  );
}

function BarChart(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="20" x2="12" y2="10" />
      <line x1="18" y1="20" x2="18" y2="4" />
      <line x1="6" y1="20" x2="6" y2="16" />
    </svg>
  );
}
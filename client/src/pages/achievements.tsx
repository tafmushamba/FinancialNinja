import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Medal, Award, GraduationCap, Calculator, Star } from 'lucide-react';
import { BadgeSystem, BadgeGrid, BadgeDetail, badgeCollection } from '@/components/badges/badge-system';

const Achievements: React.FC = () => {
  const [selectedBadge, setSelectedBadge] = useState(null);
  const { data: achievementsData } = useQuery({
    queryKey: ['/api/user/achievements'],
  });

  const stats = {
    totalAchievements: badgeCollection.length,
    earnedAchievements: badgeCollection.filter(badge => badge.unlocked).length,
    points: badgeCollection.filter(badge => badge.unlocked).reduce((total, badge) => total + badge.points, 0)
  };

  const categoryStats = {
    learning: {
      earned: badgeCollection.filter(b => b.category === 'learning' && b.unlocked).length,
      total: badgeCollection.filter(b => b.category === 'learning').length
    },
    finance: {
      earned: badgeCollection.filter(b => b.category === 'finance' && b.unlocked).length,
      total: badgeCollection.filter(b => b.category === 'finance').length
    },
    special: {
      earned: badgeCollection.filter(b => b.category === 'special' && b.unlocked).length,
      total: badgeCollection.filter(b => b.category === 'special').length
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Achievements</h1>
        <Badge variant="outline" className="text-xl">
          {stats.points} Points
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-500" />
              Total Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">
              {stats.earnedAchievements} / {stats.totalAchievements}
            </div>
            <Progress value={(stats.earnedAchievements / stats.totalAchievements) * 100} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-purple-500" />
              Active Streaks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">3 Days</div>
            <Progress value={60} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Medal className="h-5 w-5 text-blue-500" />
              Next Milestone
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">4 More</div>
            <Progress value={80} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-green-500" />
              Learning
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">
              {categoryStats.learning.earned} / {categoryStats.learning.total}
            </div>
            <Progress value={(categoryStats.learning.earned / categoryStats.learning.total) * 100} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-amber-500" />
              Finance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">
              {categoryStats.finance.earned} / {categoryStats.finance.total}
            </div>
            <Progress value={(categoryStats.finance.earned / categoryStats.finance.total) * 100} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-purple-500" />
              Special
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">
              {categoryStats.special.earned} / {categoryStats.special.total}
            </div>
            <Progress value={(categoryStats.special.earned / categoryStats.special.total) * 100} />
          </CardContent>
        </Card>
      </div>

      <BadgeGrid 
        badges={badgeCollection}
        onBadgeClick={(badge) => setSelectedBadge(badge)}
      />

      {selectedBadge && (
        <BadgeDetail
          badge={selectedBadge}
          onClose={() => setSelectedBadge(null)}
        />
      )}
    </div>
  );
};

export default Achievements;
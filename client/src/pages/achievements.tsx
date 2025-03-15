import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Medal, Award, BookOpen, GraduationCap, Calculator, Gamepad2 } from 'lucide-react';
import { BadgeSystem, BadgeGrid, BadgeDetail, badgeCollection, Badge as BadgeType } from '@/components/badges/badge-system';

const Achievements: React.FC = () => {
  const [selectedBadge, setSelectedBadge] = useState<BadgeType | null>(null);
  const { data: achievementsData, isLoading: achievementsLoading } = useQuery({
    queryKey: ['/api/user/achievements'],
  });
  
  const { data: allAchievementsData, isLoading: allAchievementsLoading } = useQuery({
    queryKey: ['/api/user/all-achievements'],
  });
  
  // Use the local badge collection for now, but this would eventually come from the API
  const unlockedBadges = badgeCollection.filter(badge => badge.unlocked);
  const lockedBadges = badgeCollection.filter(badge => !badge.unlocked);
  
  // Stats from badge collection
  const stats = {
    totalBadges: badgeCollection.length,
    earnedBadges: unlockedBadges.length,
    badgePoints: unlockedBadges.reduce((total, badge) => total + badge.points, 0),
    nextMilestone: 10,
  };

  const completionPercentage = Math.round((stats.earnedBadges / stats.totalBadges) * 100) || 0;
  
  // Badge category stats
  const categoryStats = {
    learning: {
      earned: badgeCollection.filter(b => b.category === 'learning' && b.unlocked).length,
      total: badgeCollection.filter(b => b.category === 'learning').length
    },
    finance: {
      earned: badgeCollection.filter(b => b.category === 'finance' && b.unlocked).length,
      total: badgeCollection.filter(b => b.category === 'finance').length
    },
    achievement: {
      earned: badgeCollection.filter(b => b.category === 'achievement' && b.unlocked).length,
      total: badgeCollection.filter(b => b.category === 'achievement').length
    },
    special: {
      earned: badgeCollection.filter(b => b.category === 'special' && b.unlocked).length,
      total: badgeCollection.filter(b => b.category === 'special').length
    }
  };
  
  // Recent badges, sorted by date
  const recentBadges = [...unlockedBadges].sort((a, b) => {
    if (!a.dateEarned || !b.dateEarned) return 0;
    return b.dateEarned.getTime() - a.dateEarned.getTime();
  }).slice(0, 5);
  
  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Achievements & Badges</h1>
        <p className="text-muted-foreground">
          Track your progress and earn badges by completing financial education activities.
        </p>
      </div>
      
      <section className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-normal text-muted-foreground">Completion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completionPercentage}%</div>
              <Progress value={completionPercentage} className="h-2 mt-2" />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-normal text-muted-foreground">Badges Earned</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.earnedBadges} / {stats.totalBadges}</div>
              <p className="text-xs text-muted-foreground mt-1">Total progress</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-normal text-muted-foreground">Achievement Points</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.badgePoints}</div>
              <p className="text-xs text-muted-foreground mt-1">Total points earned</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-normal text-muted-foreground">Next Milestone</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.nextMilestone - stats.earnedBadges > 0 ? `${stats.nextMilestone - stats.earnedBadges} more` : 'Reached!'}</div>
              <p className="text-xs text-muted-foreground mt-1">To reach next level</p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Badges</TabsTrigger>
            <TabsTrigger value="earned">Earned</TabsTrigger>
            <TabsTrigger value="locked">Locked</TabsTrigger>
            <TabsTrigger value="stats">Stats</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-4">
            <BadgeGrid 
              badges={badgeCollection} 
              onBadgeClick={(badge) => setSelectedBadge(badge)}
            />
          </TabsContent>
          
          <TabsContent value="earned" className="mt-4">
            {unlockedBadges.length === 0 ? (
              <div className="text-center py-12 border rounded-lg">
                <div className="inline-flex h-20 w-20 rounded-full bg-muted/20 items-center justify-center mb-4">
                  <Trophy className="h-10 w-10 text-muted" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No Badges Earned Yet</h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-6">
                  Complete learning modules, take quizzes, and use the app's features to earn your first badges.
                </p>
              </div>
            ) : (
              <BadgeGrid 
                badges={unlockedBadges} 
                onBadgeClick={(badge) => setSelectedBadge(badge)}
                filtering={false}
              />
            )}
          </TabsContent>
          
          <TabsContent value="locked" className="mt-4">
            <BadgeGrid 
              badges={lockedBadges} 
              onBadgeClick={(badge) => setSelectedBadge(badge)}
              filtering={false}
            />
          </TabsContent>
          
          <TabsContent value="stats" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Badge Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-5">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Overall Progress</span>
                        <span>{stats.earnedBadges} / {stats.totalBadges} ({completionPercentage}%)</span>
                      </div>
                      <Progress value={completionPercentage} className="h-2" />
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <div className="flex items-center gap-1">
                            <GraduationCap className="h-4 w-4 text-blue-500" />
                            <span>Learning</span>
                          </div>
                          <span>{categoryStats.learning.earned} / {categoryStats.learning.total}</span>
                        </div>
                        <Progress value={(categoryStats.learning.earned / categoryStats.learning.total) * 100} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <div className="flex items-center gap-1">
                            <Calculator className="h-4 w-4 text-green-500" />
                            <span>Finance</span>
                          </div>
                          <span>{categoryStats.finance.earned} / {categoryStats.finance.total}</span>
                        </div>
                        <Progress value={(categoryStats.finance.earned / categoryStats.finance.total) * 100} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <div className="flex items-center gap-1">
                            <Trophy className="h-4 w-4 text-purple-500" />
                            <span>Achievements</span>
                          </div>
                          <span>{categoryStats.achievement.earned} / {categoryStats.achievement.total}</span>
                        </div>
                        <Progress value={(categoryStats.achievement.earned / categoryStats.achievement.total) * 100} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <div className="flex items-center gap-1">
                            <Award className="h-4 w-4 text-amber-500" />
                            <span>Special</span>
                          </div>
                          <span>{categoryStats.special.earned} / {categoryStats.special.total}</span>
                        </div>
                        <Progress value={(categoryStats.special.earned / categoryStats.special.total) * 100} className="h-2" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Recently Earned</CardTitle>
                </CardHeader>
                <CardContent>
                  {recentBadges.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">You haven't earned any badges yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {recentBadges.map(badge => (
                        <div key={badge.id} className="flex items-center gap-3 p-3 rounded-md hover:bg-muted/10 cursor-pointer transition-colors" onClick={() => setSelectedBadge(badge)}>
                          <div className={`w-12 h-12 rounded-full bg-gradient-to-br from-${badge.color.split('-')[1]}-400 to-${badge.color.split('-')[1]}-600 flex items-center justify-center`}>
                            <div className="text-white w-6 h-6">
                              {badge.icon}
                            </div>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-sm">{badge.name}</h3>
                            <p className="text-xs text-muted-foreground">{badge.description}</p>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {badge.dateEarned?.toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Point History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px] flex items-center justify-center">
                    <div className="text-center">
                      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted/20">
                        <Medal className="h-6 w-6 text-muted" />
                      </div>
                      <h3 className="font-medium">Coming Soon</h3>
                      <p className="text-sm text-muted-foreground">Badge and point history tracking will be available soon!</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </section>
      
      {/* Badge detail modal */}
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
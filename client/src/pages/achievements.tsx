import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Achievements: React.FC = () => {
  const { data: achievementsData, isLoading: achievementsLoading } = useQuery({
    queryKey: ['/api/user/achievements'],
  });
  
  const { data: allAchievementsData, isLoading: allAchievementsLoading } = useQuery({
    queryKey: ['/api/user/all-achievements'],
  });
  
  // Stats from API data
  const stats = {
    totalAchievements: allAchievementsLoading ? '?' : allAchievementsData?.achievements?.length || 0,
    earnedAchievements: achievementsLoading ? 0 : achievementsData?.achievements?.length || 0,
    achievementPoints: achievementsLoading ? 0 : (achievementsData?.achievements?.length || 0) * 50,
    nextMilestone: 10,
  };

  const completionPercentage = Math.round((stats.earnedAchievements / stats.totalAchievements) * 100) || 0;
  
  return (
    <div className="p-4">
      <section className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-dark-800 border-dark-600">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-normal text-muted-foreground">Completion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completionPercentage}%</div>
              <Progress value={completionPercentage} className="h-2 mt-2" />
            </CardContent>
          </Card>
          
          <Card className="bg-dark-800 border-dark-600">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-normal text-muted-foreground">Achievements Earned</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.earnedAchievements} / {stats.totalAchievements}</div>
              <p className="text-xs text-muted-foreground mt-1">Total progress</p>
            </CardContent>
          </Card>
          
          <Card className="bg-dark-800 border-dark-600">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-normal text-muted-foreground">Achievement Points</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.achievementPoints}</div>
              <p className="text-xs text-muted-foreground mt-1">Total points earned</p>
            </CardContent>
          </Card>
          
          <Card className="bg-dark-800 border-dark-600">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-normal text-muted-foreground">Next Milestone</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.nextMilestone - stats.earnedAchievements} more</div>
              <p className="text-xs text-muted-foreground mt-1">To reach next level</p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="earned" className="w-full">
          <TabsList className="bg-dark-800 border border-dark-600">
            <TabsTrigger value="earned" className="data-[state=active]:bg-dark-700">Earned</TabsTrigger>
            <TabsTrigger value="all" className="data-[state=active]:bg-dark-700">All Achievements</TabsTrigger>
            <TabsTrigger value="stats" className="data-[state=active]:bg-dark-700">Stats</TabsTrigger>
          </TabsList>
          
          <TabsContent value="earned" className="mt-4">
            <Card className="bg-dark-800 border-dark-600">
              <CardHeader>
                <CardTitle>Your Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                {achievementsLoading ? (
                  <p>Loading achievements...</p>
                ) : !achievementsData?.achievements?.length ? (
                  <div className="text-center py-8">
                    <div className="mb-4 text-6xl opacity-20">
                      <i className="fas fa-trophy"></i>
                    </div>
                    <h3 className="text-lg font-medium mb-2">No Achievements Yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Complete learning modules and quizzes to earn your first achievement
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {achievementsData?.achievements?.map((achievement) => (
                      <div key={achievement.id} className="bg-dark-700 rounded-md p-4 flex flex-col h-full">
                        <div className="flex items-center gap-3 mb-3">
                          <div 
                            className="w-12 h-12 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: `${achievement.color}20` }}
                          >
                            <i className={`${achievement.icon} text-xl`} style={{ color: achievement.color }}></i>
                          </div>
                          <div>
                            <h3 className="font-medium">{achievement.title}</h3>
                            <Badge className="bg-green-500/20 text-green-500 border border-green-500/30">
                              Unlocked
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3 flex-grow">{achievement.description}</p>
                        <p className="text-xs text-muted-foreground">
                          <i className="fas fa-calendar-alt mr-1"></i> Earned on {new Date(achievement.unlockedAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="all" className="mt-4">
            <Card className="bg-dark-800 border-dark-600">
              <CardHeader>
                <CardTitle>All Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                {allAchievementsLoading ? (
                  <p>Loading achievements...</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {allAchievementsData?.achievements?.map((achievement) => {
                      const isEarned = achievementsData?.achievements?.some(a => a.id === achievement.id);
                      return (
                        <div 
                          key={achievement.id} 
                          className={`${isEarned ? 'bg-dark-700' : 'bg-dark-800 opacity-70'} rounded-md p-4 flex flex-col h-full border border-dark-600`}
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <div 
                              className="w-12 h-12 rounded-full flex items-center justify-center"
                              style={{ backgroundColor: `${achievement.color}20` }}
                            >
                              <i className={`${achievement.icon} text-xl`} style={{ color: achievement.color }}></i>
                            </div>
                            <div>
                              <h3 className="font-medium">{achievement.title}</h3>
                              {isEarned ? (
                                <Badge className="bg-green-500/20 text-green-500 border border-green-500/30">
                                  Unlocked
                                </Badge>
                              ) : (
                                <Badge className="bg-dark-600 text-muted-foreground border border-dark-500">
                                  Locked
                                </Badge>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3 flex-grow">{achievement.description}</p>
                          <p className="text-xs text-muted-foreground">
                            <i className="fas fa-tasks mr-1"></i> {achievement.requirement}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="stats" className="mt-4">
            <Card className="bg-dark-800 border-dark-600">
              <CardHeader>
                <CardTitle>Achievement Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-dark-700 p-4 rounded-md">
                    <h3 className="font-medium mb-2">Achievement Progress</h3>
                    <div className="w-full bg-dark-600 h-2 rounded-full">
                      <div 
                        className="bg-neon-green h-2 rounded-full" 
                        style={{ width: `${completionPercentage}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-1">
                      <p className="text-xs text-muted-foreground">0%</p>
                      <p className="text-xs text-muted-foreground">50%</p>
                      <p className="text-xs text-muted-foreground">100%</p>
                    </div>
                  </div>
                  
                  <div className="bg-dark-700 p-4 rounded-md">
                    <h3 className="font-medium mb-2">Achievement Breakdown</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-1">
                          <h4 className="text-sm">Learning</h4>
                          <p className="text-sm">2/5</p>
                        </div>
                        <div className="w-full bg-dark-600 h-2 rounded-full">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: '40%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <h4 className="text-sm">Finance</h4>
                          <p className="text-sm">1/6</p>
                        </div>
                        <div className="w-full bg-dark-600 h-2 rounded-full">
                          <div className="bg-purple-500 h-2 rounded-full" style={{ width: '16.6%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <h4 className="text-sm">Quizzes</h4>
                          <p className="text-sm">3/4</p>
                        </div>
                        <div className="w-full bg-dark-600 h-2 rounded-full">
                          <div className="bg-amber-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-dark-700 p-4 rounded-md">
                    <h3 className="font-medium mb-3">Recent Unlocks</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-neon-green/20 flex items-center justify-center mr-2">
                            <i className="fas fa-award text-neon-green"></i>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium">Quiz Master</h4>
                            <p className="text-xs text-muted-foreground">Complete 3 quizzes</p>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">3 days ago</p>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center mr-2">
                            <i className="fas fa-book-open text-blue-500"></i>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium">First Lesson</h4>
                            <p className="text-xs text-muted-foreground">Complete your first lesson</p>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">1 week ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
};

export default Achievements;
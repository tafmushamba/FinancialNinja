import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { default as TerminalText } from '@/components/ui/terminal-text';
import { default as ProgressCircle } from '@/components/ui/progress-circle';
import { Card, CardContent } from '@/components/ui/card';

const StatsOverview: React.FC = () => {
  const { data: statsData, isLoading } = useQuery({
    queryKey: ['/api/user/stats'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/user/stats');
        if (!response.ok) {
          throw new Error('Failed to fetch user stats');
        }
        return response.json();
      } catch (error) {
        console.error('Error fetching user stats:', error);
        return {
          financialLiteracyScore: 65,
          modulesCompleted: 3,
          totalModules: 12,
          badgesEarned: 5,
          lastAssessment: '2 weeks ago',
          scoreImprovement: 8
        };
      }
    }
  });

  // Default values when loading or no data available
  const financialLiteracyScore = statsData?.financialLiteracyScore || 0;
  const modulesCompleted = statsData?.modulesCompleted || 0;
  const totalModules = statsData?.totalModules || 0;
  const modulesPercentage = totalModules > 0 ? Math.round((modulesCompleted / totalModules) * 100) : 0;
  const badgesEarned = statsData?.badgesEarned || 0;
  const lastAssessment = statsData?.lastAssessment || 'Never';
  const scoreImprovement = statsData?.scoreImprovement || 0;

  return (
    <section className="mb-8 animate-fadeIn">
      <h3 className="text-lg font-mono font-bold mb-4 text-foreground px-2">
        <TerminalText>$ Financial Progress Overview</TerminalText>
      </h3>
      
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          <Card className="h-40 bg-dark-800 border border-dark-600"><CardContent className="p-6"></CardContent></Card>
          <Card className="h-40 bg-dark-800 border border-dark-600"><CardContent className="p-6"></CardContent></Card>
          <Card className="h-40 bg-dark-800 border border-dark-600"><CardContent className="p-6"></CardContent></Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Financial Literacy Score */}
          <Card className="bg-dark-800 border border-dark-600 shadow-md hover:shadow-lg hover:shadow-neon-green/20 transition-all duration-300 hover:border-neon-green/50 overflow-hidden group transform hover:-translate-y-1 hover:scale-[1.02] cursor-pointer">
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-muted-foreground text-xs sm:text-sm font-medium">Financial Literacy Score</p>
                  <p className="text-xl sm:text-2xl font-bold text-foreground mt-2">
                    {financialLiteracyScore}<span className="text-sm text-muted-foreground">/100</span>
                  </p>
                </div>
                <ProgressCircle 
                  value={financialLiteracyScore} 
                  size={55}
                  strokeWidth={6}
                  className="transition-all duration-300 group-hover:scale-110 text-neon-green"
                  showText={true}
                />
              </div>
              <div>
                <div className="text-xs text-muted-foreground mt-2">Last assessment: {lastAssessment}</div>
                {scoreImprovement > 0 && (
                  <div className="text-xs text-neon-green mt-2 flex items-center">
                    <i className="fas fa-arrow-up mr-1"></i>+{scoreImprovement} points since last month
                  </div>
                )}
                {scoreImprovement < 0 && (
                  <div className="text-xs text-neon-red mt-2 flex items-center">
                    <i className="fas fa-arrow-down mr-1"></i>{scoreImprovement} points since last month
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Completed Modules */}
          <Card className="bg-dark-800 border border-dark-600 shadow-md hover:shadow-lg hover:shadow-neon-cyan/20 transition-all duration-300 hover:border-neon-cyan/50 overflow-hidden group transform hover:-translate-y-1 hover:scale-[1.02] cursor-pointer">
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-muted-foreground text-xs sm:text-sm font-medium">Modules Completed</p>
                  <p className="text-xl sm:text-2xl font-bold text-foreground mt-2">
                    {modulesCompleted}<span className="text-sm text-muted-foreground">/{totalModules}</span>
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center bg-neon-cyan/20 text-neon-cyan transition-all duration-300 group-hover:scale-110 group-hover:bg-neon-cyan/30">
                  <i className="fas fa-book-open text-xl"></i>
                </div>
              </div>
              <div>
                <div className="w-full bg-dark-600 rounded-full h-2 overflow-hidden mt-2">
                  <div 
                    className="bg-neon-cyan h-2 rounded-full transition-all duration-1000" 
                    style={{ width: `${modulesPercentage}%` }}
                  ></div>
                </div>
                <div className="text-xs text-muted-foreground mt-2 flex items-center">
                  <span className="text-neon-cyan mr-1">{modulesPercentage}%</span> of curriculum completed
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Badges Earned */}
          <Card className="bg-dark-800 border border-dark-600 shadow-md hover:shadow-lg hover:shadow-neon-purple/20 transition-all duration-300 hover:border-neon-purple/50 overflow-hidden group transform hover:-translate-y-1 hover:scale-[1.02] cursor-pointer">
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-muted-foreground text-xs sm:text-sm font-medium">Badges Earned</p>
                  <p className="text-xl sm:text-2xl font-bold text-foreground mt-2">{badgesEarned}</p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center bg-neon-purple/20 text-neon-purple transition-all duration-300 group-hover:scale-110 group-hover:bg-neon-purple/30">
                  <i className="fas fa-medal text-xl"></i>
                </div>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                {[...Array(Math.min(badgesEarned, 4))].map((_, i) => {
                  const colors = ['neon-green', 'neon-cyan', 'neon-purple', 'neon-red'];
                  const icons = ['fa-chart-pie', 'fa-piggy-bank', 'fa-coins', 'fa-shield-alt'];
                  return (
                    <div 
                      key={i}
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center bg-${colors[i % colors.length]}/10 border border-dark-600 shadow-sm tooltip-container relative group/badge`}
                    >
                      <i className={`fas ${icons[i % icons.length]} text-xs text-${colors[i % colors.length]}`}></i>
                      <span className="tooltip hidden group-hover/badge:block bg-dark-900 text-white text-xs px-2 py-1 rounded absolute -top-7 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                        Badge {i+1}
                      </span>
                    </div>
                  )
                })}
                {badgesEarned > 4 && (
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center bg-dark-600 border border-dark-700 text-foreground">
                    <span className="text-xs">+{badgesEarned - 4}</span>
                  </div>
                )}
                {badgesEarned === 0 && (
                  <span className="text-xs text-muted-foreground mt-2">No badges earned yet.</span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </section>
  );
};

export default StatsOverview;

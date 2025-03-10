import React from 'react';
import { useQuery } from '@tanstack/react-query';
import TerminalText from '@/components/ui/terminal-text';
import ProgressCircle from '@/components/ui/progress-circle';
import { Card, CardContent } from '@/components/ui/card';

const StatsOverview: React.FC = () => {
  const { data: statsData, isLoading } = useQuery({
    queryKey: ['/api/user/stats'],
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
      <h3 className="text-lg font-mono font-bold mb-4">
        <TerminalText>Financial Progress Overview</TerminalText>
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Financial Literacy Score */}
        <Card className="bg-dark-800 border-dark-600">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Financial Literacy Score</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {financialLiteracyScore}<span className="text-sm text-gray-400">/100</span>
                </p>
              </div>
              <ProgressCircle 
                value={financialLiteracyScore} 
                size={64}
                strokeWidth={6}
              />
            </div>
            <div className="mt-4">
              <div className="text-xs text-gray-400">Last assessment: {lastAssessment}</div>
              {scoreImprovement > 0 && (
                <div className="text-xs text-neon-green mt-1">+{scoreImprovement} points since last month</div>
              )}
              {scoreImprovement < 0 && (
                <div className="text-xs text-neon-red mt-1">{scoreImprovement} points since last month</div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Completed Modules */}
        <Card className="bg-dark-800 border-dark-600">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Modules Completed</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {modulesCompleted}<span className="text-sm text-gray-400">/{totalModules}</span>
                </p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-neon-cyan bg-opacity-20 text-neon-cyan">
                <i className="fas fa-book-open"></i>
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-dark-600 rounded-full h-2">
                <div 
                  className="bg-neon-cyan h-2 rounded-full" 
                  style={{ width: `${modulesPercentage}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-400 mt-1">{modulesPercentage}% of curriculum completed</div>
            </div>
          </CardContent>
        </Card>
        
        {/* Badges Earned */}
        <Card className="bg-dark-800 border-dark-600">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Badges Earned</p>
                <p className="text-2xl font-bold text-white mt-1">{badgesEarned}</p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-neon-purple bg-opacity-20 text-neon-purple">
                <i className="fas fa-medal"></i>
              </div>
            </div>
            <div className="mt-4 flex">
              <div className="flex -space-x-2">
                {isLoading ? (
                  <div className="text-xs text-gray-400">Loading badges...</div>
                ) : (
                  <>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-neon-green bg-opacity-20 border border-dark-800">
                      <i className="fas fa-chart-pie text-xs text-neon-green"></i>
                    </div>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-neon-cyan bg-opacity-20 border border-dark-800">
                      <i className="fas fa-piggy-bank text-xs text-neon-cyan"></i>
                    </div>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-neon-purple bg-opacity-20 border border-dark-800">
                      <i className="fas fa-coins text-xs text-neon-purple"></i>
                    </div>
                    {badgesEarned > 3 && (
                      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-dark-600 border border-dark-800 text-white">
                        <span className="text-xs">+{badgesEarned - 3}</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default StatsOverview;

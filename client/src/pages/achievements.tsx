import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Sidebar from '@/components/layout/sidebar';
import MobileNav from '@/components/layout/mobile-nav';
import Header from '@/components/layout/header';
import { Card, CardContent } from '@/components/ui/card';
import TerminalText from '@/components/ui/terminal-text';

const Achievements: React.FC = () => {
  const { data: allAchievementsData, isLoading } = useQuery({
    queryKey: ['/api/user/all-achievements'],
  });

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
        <Header title="Achievements" />
        
        <div className="p-4 md:p-6">
          <section className="mb-8 animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-mono font-bold">
                <TerminalText>Your Achievements</TerminalText>
              </h1>
              
              <div className="flex items-center space-x-1 bg-dark-800 rounded-lg p-1 border border-dark-600">
                <button className="px-3 py-1 rounded bg-dark-700 text-white text-sm">All</button>
                <button className="px-3 py-1 rounded text-gray-400 hover:text-white text-sm">Unlocked</button>
                <button className="px-3 py-1 rounded text-gray-400 hover:text-white text-sm">Locked</button>
              </div>
            </div>
            
            {/* Achievement Summary */}
            <Card className="bg-dark-800 border-dark-600 mb-6">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <div className="mb-4 md:mb-0">
                    <h2 className="text-xl font-mono font-bold">Achievement Progress</h2>
                    <p className="text-gray-400 mt-1">Keep learning to unlock more achievements!</p>
                  </div>
                  
                  <div className="flex space-x-6 md:space-x-12">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white mb-1">
                        {isLoading ? '0' : allAchievementsData?.unlocked || 0}
                      </div>
                      <p className="text-xs text-gray-400">Unlocked</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white mb-1">
                        {isLoading ? '0' : allAchievementsData?.locked || 0}
                      </div>
                      <p className="text-xs text-gray-400">Locked</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-neon-green mb-1">
                        {isLoading ? '0' : allAchievementsData?.progress || 0}%
                      </div>
                      <p className="text-xs text-gray-400">Completion</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Achievements Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {isLoading ? (
                <div className="col-span-3 text-center py-8">Loading achievements...</div>
              ) : (
                <>
                  {allAchievementsData?.achievements?.map((achievement: any) => (
                    <Card 
                      key={achievement.id}
                      className={`bg-dark-800 border-dark-600 ${achievement.unlocked ? 'hover:shadow-neon-green' : ''} transition-shadow duration-300`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center mb-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                            achievement.unlocked 
                              ? `bg-${achievement.color} bg-opacity-20` 
                              : 'bg-dark-600'
                          }`}>
                            <i className={`fas ${achievement.icon} ${
                              achievement.unlocked ? `text-${achievement.color}` : 'text-gray-500'
                            }`}></i>
                          </div>
                          
                          <div>
                            <h3 className="font-bold">{achievement.title}</h3>
                            <p className="text-xs text-gray-400">{achievement.description}</p>
                          </div>
                        </div>
                        
                        {achievement.unlocked ? (
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-neon-green">
                              <i className="fas fa-check-circle mr-1"></i> Unlocked
                            </span>
                            <span className="text-gray-400">
                              {achievement.date}
                            </span>
                          </div>
                        ) : (
                          <div className="bg-dark-700 rounded p-3 text-sm">
                            <p className="text-gray-400">
                              <i className="fas fa-lock mr-1"></i> 
                              {achievement.requirement}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </>
              )}
            </div>
          </section>
        </div>
      </main>
      
      <MobileNav />
    </div>
  );
};

export default Achievements;

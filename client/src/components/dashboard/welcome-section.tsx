import React from 'react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';

const WelcomeSection: React.FC = () => {
  const { data: userData, isLoading } = useQuery({
    queryKey: ['/api/user/profile'],
  });

  const username = userData?.username || 'User';
  const lessonsCompleted = userData?.stats?.lessonsCompletedThisWeek || 0;

  return (
    <section className="mb-8 animate-fadeIn">
      <div className="bg-dark-800 rounded-lg p-6 border border-dark-600">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div>
            <h1 className="text-2xl font-mono font-bold">
              {isLoading ? 'Loading...' : (
                <>Welcome back, <span className="text-neon-green">{username}</span></>
              )}
            </h1>
            <p className="text-gray-400 mt-2 text-sm md:text-base">
              {isLoading ? 'Loading stats...' : (
                <>You've completed <span className="text-neon-green font-bold">{lessonsCompleted} lessons</span> this week. Keep up the great work!</>
              )}
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button 
              variant="outline" 
              className="bg-neon-green bg-opacity-20 hover:bg-opacity-30 text-neon-green border-neon-green border-opacity-30"
            >
              <i className="fas fa-robot mr-2"></i>
              Start AI Assessment
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WelcomeSection;

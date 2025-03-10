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
    <section className="mb-8 animate-fadeIn px-4">
      <div className="bg-dark-800 p-6 border-b border-dark-600">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div>
            <h1 className="text-2xl font-mono font-bold text-foreground">
              {isLoading ? 'Loading...' : (
                <>Welcome back, <span className="text-neon-green">{username}</span></>
              )}
            </h1>
            <p className="text-muted-foreground mt-2 text-sm md:text-base">
              {isLoading ? 'Loading stats...' : (
                <>You've completed <span className="text-neon-green font-bold">{lessonsCompleted} lessons</span> this week. Keep up the great work!</>
              )}
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button 
              variant="outline" 
              className="bg-neon-green/20 hover:bg-neon-green/30 text-neon-green border-neon-green/30 shadow-md hover:shadow-neon-green/20 transition-all"
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

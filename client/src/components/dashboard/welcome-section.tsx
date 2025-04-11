import React from 'react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'wouter';

const WelcomeSection: React.FC = () => {
  const { user } = useAuth();
  
  const { data: userData, isLoading } = useQuery({
    queryKey: ['/api/user/profile'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/user/profile');
        if (!response.ok) {
          throw new Error('Failed to fetch user profile');
        }
        return response.json();
      } catch (error) {
        console.error('Error fetching user profile:', error);
        // Use user context data as fallback
        return {
          username: user?.username || 'taf',
          firstName: user?.firstName || 'taf',
          lastName: user?.lastName || 'Mushamba',
          stats: {
            lessonsCompletedThisWeek: 3
          }
        };
      }
    },
    enabled: !!user // Only run query when user is available
  });

  // Use user context first, then fallback to fetched data or default values
  const displayName = user?.username || userData?.username || 'taf';
  const fullName = user?.firstName 
    ? `${user.firstName} ${user.lastName || ''}`
    : userData?.firstName 
      ? `${userData.firstName} ${userData.lastName || ''}`
      : 'taf Mushamba';
  const lessonsCompleted = userData?.stats?.lessonsCompletedThisWeek || 0;

  return (
    <section className="mb-8 animate-fadeIn">
      <div className="bg-dark-800 border border-dark-600 rounded-md p-6 shadow-lg hover:shadow-neon-green/20 transition-all duration-300 hover:border-neon-green/30 overflow-hidden glow-border group">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div className="mb-4 md:mb-0">
            <div className="inline-block px-2 py-1 bg-dark-700 rounded-sm font-mono text-xs text-neon-green mb-2 shadow-inner">
              <i className="fas fa-terminal mr-1"></i> Welcome
            </div>
            <h1 className="text-2xl font-mono font-bold text-foreground">
              {isLoading && !user ? 'Loading...' : (
                <>Welcome back, <span className="text-neon-green neon-text animate-pulse-slow">{displayName}</span></>
              )}
            </h1>
            <p className="text-muted-foreground mt-2 text-sm md:text-base">
              {isLoading && !user ? 'Loading stats...' : (
                <>You've completed <span className="text-neon-green font-bold">{lessonsCompleted} lessons</span> this week. 
                <span className="text-neon-green ml-1">Keep up the great work!</span></>
              )}
            </p>
          </div>
          <div className="flex space-x-3">
            <Link href="/ai-assistant">
              <Button 
                variant="outline" 
                className="bg-neon-green/20 hover:bg-neon-green/30 text-neon-green border-neon-green/30 shadow-md hover:shadow-neon-green/20 transition-all duration-300 transform hover:scale-105"
              >
                <i className="fas fa-robot mr-2"></i>
                AI Assistant
              </Button>
            </Link>
            <Link href="/learning-modules">
              <Button 
                variant="outline" 
                className="bg-dark-700 hover:bg-dark-600 text-foreground border-dark-600 shadow-md transition-all duration-300 transform hover:scale-105 hover:border-neon-green/30"
              >
                <i className="fas fa-book mr-2"></i>
                Start Learning
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Stat Box 1: Level */}
          <div className="bg-dark-700 rounded-md p-3 border border-dark-600 shadow-inner flex flex-col items-center text-center transition-all duration-300 hover:bg-dark-600 hover:border-neon-green/30 cursor-pointer group transform hover:-translate-y-1">
            <div className="w-8 h-8 rounded-full bg-neon-green/20 flex items-center justify-center mb-2 transition-all duration-300 group-hover:bg-neon-green/30 group-hover:scale-110">
              <i className="fas fa-trophy text-sm text-neon-green"></i>
            </div>
            <span className="text-sm font-medium text-foreground">Level 1</span>
            <span className="text-xs text-muted-foreground">Investor</span>
          </div>

          {/* Stat Box 2: Points */}
          <div className="bg-dark-700 rounded-md p-3 border border-dark-600 shadow-inner flex flex-col items-center text-center transition-all duration-300 hover:bg-dark-600 hover:border-neon-cyan/30 cursor-pointer group transform hover:-translate-y-1">
            <div className="w-8 h-8 rounded-full bg-neon-cyan/20 flex items-center justify-center mb-2 transition-all duration-300 group-hover:bg-neon-cyan/30 group-hover:scale-110">
              <i className="fas fa-star text-sm text-neon-cyan"></i>
            </div>
            <span className="text-sm font-medium text-foreground">125</span>
            <span className="text-xs text-muted-foreground">Total Points</span>
          </div>

          {/* Stat Box 3: Streak */}
          <div className="bg-dark-700 rounded-md p-3 border border-dark-600 shadow-inner flex flex-col items-center text-center transition-all duration-300 hover:bg-dark-600 hover:border-neon-purple/30 cursor-pointer group transform hover:-translate-y-1">
            <div className="w-8 h-8 rounded-full bg-neon-purple/20 flex items-center justify-center mb-2 transition-all duration-300 group-hover:bg-neon-purple/30 group-hover:scale-110">
              <i className="fas fa-calendar-check text-sm text-neon-purple"></i>
            </div>
            <span className="text-sm font-medium text-foreground">5 Day</span>
            <span className="text-xs text-muted-foreground">Streak</span>
          </div>

          {/* Stat Box 4: Badges */}
          <div className="bg-dark-700 rounded-md p-3 border border-dark-600 shadow-inner flex flex-col items-center text-center transition-all duration-300 hover:bg-dark-600 hover:border-neon-red/30 cursor-pointer group transform hover:-translate-y-1">
            <div className="w-8 h-8 rounded-full bg-neon-red/20 flex items-center justify-center mb-2 transition-all duration-300 group-hover:bg-neon-red/30 group-hover:scale-110">
              <i className="fas fa-medal text-sm text-neon-red"></i>
            </div>
            <span className="text-sm font-medium text-foreground">3</span>
            <span className="text-xs text-muted-foreground">Badges Earned</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WelcomeSection;

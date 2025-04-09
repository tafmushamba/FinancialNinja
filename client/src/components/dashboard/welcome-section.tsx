import React from 'react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'wouter';

const Mascot = ({ size = 'sm' }: { size?: 'sm' | 'md' | 'lg' }) => {
  return (
    <svg
      width={size === 'sm' ? 24 : size === 'md' ? 48 : 72}
      height={size === 'sm' ? 24 : size === 'md' ? 48 : 72}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Replace with actual mascot SVG */}
      <circle cx="12" cy="12" r="10" fill="blue" />
    </svg>
  );
};


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
      <div className="bg-dark-800 border border-dark-600 rounded-md p-6 shadow-lg hover:shadow-neon-green/20 transition-shadow hover:border-neon-green/30 overflow-hidden glow-border">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div className="mb-4 md:mb-0">
            <div className="inline-block px-2 py-1 bg-dark-700 rounded-sm font-mono text-xs text-neon-green mb-2 shadow-inner">
              <i className="fas fa-terminal mr-1"></i> Welcome
            </div>
            <div className="flex items-center gap-3">
              <Mascot size="md" />
              <h1 className="text-2xl font-mono font-bold text-foreground">
                {isLoading && !user ? 'Loading...' : (
                  <>Welcome back, <span className="text-neon-green neon-text animate-pulse-slow">{displayName}</span></>
                )}
              </h1>
            </div>
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
                className="bg-neon-green/20 hover:bg-neon-green/30 text-neon-green border-neon-green/30 shadow-md hover:shadow-neon-green/20 transition-all"
              >
                <i className="fas fa-robot mr-2"></i>
                AI Assistant
              </Button>
            </Link>
            <Link href="/learning-modules">
              <Button 
                variant="outline" 
                className="bg-dark-700 hover:bg-dark-600 text-foreground border-dark-600 shadow-md transition-all"
              >
                <i className="fas fa-book mr-2"></i>
                Start Learning
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="bg-dark-700 rounded-sm p-2 border border-dark-600 shadow-inner flex items-center justify-center md:justify-start">
            <div className="w-6 h-6 rounded-full bg-neon-green/20 flex items-center justify-center mr-2">
              <i className="fas fa-trophy text-xs text-neon-green"></i>
            </div>
            <span className="text-xs text-muted-foreground">Level 1 Investor</span>
          </div>

          <div className="bg-dark-700 rounded-sm p-2 border border-dark-600 shadow-inner flex items-center justify-center md:justify-start">
            <div className="w-6 h-6 rounded-full bg-neon-cyan/20 flex items-center justify-center mr-2">
              <i className="fas fa-star text-xs text-neon-cyan"></i>
            </div>
            <span className="text-xs text-muted-foreground">125 Points Total</span>
          </div>

          <div className="bg-dark-700 rounded-sm p-2 border border-dark-600 shadow-inner flex items-center justify-center md:justify-start">
            <div className="w-6 h-6 rounded-full bg-neon-purple/20 flex items-center justify-center mr-2">
              <i className="fas fa-calendar-check text-xs text-neon-purple"></i>
            </div>
            <span className="text-xs text-muted-foreground">5 Day Streak</span>
          </div>

          <div className="bg-dark-700 rounded-sm p-2 border border-dark-600 shadow-inner flex items-center justify-center md:justify-start">
            <div className="w-6 h-6 rounded-full bg-neon-red/20 flex items-center justify-center mr-2">
              <i className="fas fa-medal text-xs text-neon-red"></i>
            </div>
            <span className="text-xs text-muted-foreground">3 Badges Earned</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WelcomeSection;
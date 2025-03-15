import React from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import TerminalText from '@/components/ui/terminal-text';
import { formatTimeRemaining } from '@/lib/utils';

const LearningModules: React.FC = () => {
  const { data: modulesData, isLoading } = useQuery({
    queryKey: ['/api/learning/modules'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/learning/modules');
        if (!response.ok) {
          throw new Error('Failed to fetch learning modules');
        }
        return response.json();
      } catch (error) {
        console.error('Error fetching learning modules:', error);
        return {
          modules: [
            {
              id: 1,
              title: 'Budgeting Basics',
              description: 'Learn the core principles of creating and maintaining a personal budget.',
              icon: 'fas fa-wallet',
              progress: 65,
              lessonsCompleted: 5,
              totalLessons: 8,
              timeRemaining: 25,
              accentColor: 'neon-green',
              difficulty: 'Beginner',
              status: 'in-progress'
            },
            {
              id: 2,
              title: 'Investment Fundamentals',
              description: 'Understand how to start investing and building wealth for the future.',
              icon: 'fas fa-chart-line',
              progress: 25,
              lessonsCompleted: 2,
              totalLessons: 8,
              timeRemaining: 60,
              accentColor: 'neon-cyan',
              difficulty: 'Intermediate',
              status: 'in-progress'
            },
            {
              id: 3,
              title: 'Advanced Tax Strategies',
              description: 'Optimize your tax planning with advanced strategies for wealth preservation.',
              icon: 'fas fa-file-invoice-dollar',
              accentColor: 'neon-purple',
              difficulty: 'Advanced',
              status: 'locked'
            }
          ]
        };
      }
    }
  });

  return (
    <section className="mb-8 animate-fadeIn px-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-mono font-bold text-foreground">
          <TerminalText>$ Continue Learning</TerminalText>
        </h3>
        <Link href="/learning-modules" className="text-neon-green text-sm hover:underline flex items-center group transition-all">
          View all modules <i className="fas fa-arrow-right ml-1 text-xs group-hover:translate-x-1 transition-transform"></i>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {isLoading ? (
          <div className="col-span-3 bg-dark-800 rounded-md border border-dark-600 p-8 text-center">
            <div className="animate-pulse flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-dark-700"></div>
              <div className="h-4 bg-dark-700 rounded w-1/3 mt-4"></div>
              <div className="h-3 bg-dark-700 rounded w-1/2 mt-2"></div>
              <div className="h-2 bg-dark-700 rounded w-3/4 mt-5"></div>
            </div>
          </div>
        ) : (
          <>
            {modulesData?.modules?.map((module: any) => {
              // Use safe inline style for dynamic classes
              const accentColor = module.accentColor || 'neon-green';
              
              return (
                <Card 
                  key={module.id}
                  className={`bg-dark-800 border border-dark-600 overflow-hidden group hover:border-${accentColor}/40 transition-colors duration-300 hover:shadow-${accentColor}/20 shadow-lg card-highlight`}
                  style={{ '--hover-color': `var(--${accentColor})` } as React.CSSProperties}
                >
                  <div className="h-28 bg-dark-700 relative overflow-hidden">
                    <div 
                      className="absolute inset-0 flex items-center justify-center opacity-20 transition-transform group-hover:scale-125 duration-700" 
                      style={{ color: `var(--${accentColor})` }}
                    >
                      <i className={`${module.icon} text-6xl`}></i>
                    </div>
                    <div 
                      className="absolute bottom-0 left-0 w-full h-1"
                      style={{ backgroundColor: `var(--${accentColor})` }}
                    ></div>
                    <div className="absolute top-3 right-3 px-2 py-1 text-xs font-mono rounded-sm" 
                         style={{ 
                           color: module.status === 'locked' ? 'var(--muted-foreground)' : `var(--${accentColor})`,
                           backgroundColor: module.status === 'locked' ? 'rgba(30, 30, 30, 0.7)' : `hsla(var(--${accentColor}-hsl) / 0.2)`,
                           backdropFilter: 'blur(4px)'
                         }}>
                      {module.status === 'locked' ? (
                        <><i className="fas fa-lock mr-1"></i> Locked</>
                      ) : (
                        <><i className="fas fa-clock mr-1"></i> {formatTimeRemaining(module.timeRemaining)}</>
                      )}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-mono font-bold text-foreground">{module.title}</h4>
                      <span className="text-xs px-1.5 py-0.5 rounded-sm" 
                            style={{ 
                              color: `var(--${accentColor})`,
                              backgroundColor: `hsla(var(--${accentColor}-hsl) / 0.1)`
                            }}>
                        {module.status === 'locked' ? 'LOCKED' : (module.difficulty && typeof module.difficulty === 'string' ? module.difficulty.toUpperCase() : 'IN PROGRESS')}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{module.description}</p>
                    <div className="mt-3">
                      <div className="w-full bg-dark-600 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="h-full transition-all duration-1000 ease-out" 
                          style={{ 
                            width: `${module.progress || 0}%`,
                            backgroundColor: `var(--${accentColor})`,
                            boxShadow: `0 0 8px var(--${accentColor})`
                          }}
                        ></div>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-xs text-muted-foreground">
                          <span style={{ color: `var(--${accentColor})` }}>{module.lessonsCompleted || 0}</span>/{module.totalLessons || 0} lessons
                        </p>
                        <p className="text-xs" style={{ color: `var(--${accentColor})` }}>
                          {module.progress || 0}%
                        </p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button 
                      className="w-full group-hover:shadow-lg transition-all"
                      style={{ 
                        backgroundColor: module.status === 'locked' ? 'transparent' : `hsla(var(--${accentColor}-hsl) / 0.1)`,
                        color: module.status === 'locked' ? 'var(--muted-foreground)' : `var(--${accentColor})`,
                        borderColor: module.status === 'locked' ? 'var(--dark-600)' : `hsla(var(--${accentColor}-hsl) / 0.3)`,
                        boxShadow: module.status === 'locked' ? 'none' : `0 0 5px hsla(var(--${accentColor}-hsl) / 0.3)`
                      }}
                      variant="outline"
                      disabled={module.status === 'locked'}
                    >
                      {module.status === 'locked' ? (
                        <>Unlock</>
                      ) : (
                        <div className="flex items-center justify-center w-full">
                          Continue <i className="fas fa-arrow-right ml-2 text-xs group-hover:translate-x-1 transition-transform"></i>
                        </div>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </>
        )}
      </div>
    </section>
  );
};

export default LearningModules;

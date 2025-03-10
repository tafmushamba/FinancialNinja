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
  });

  return (
    <section className="mb-8 animate-fadeIn">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-mono font-bold text-foreground">
          <TerminalText>Continue Learning</TerminalText>
        </h3>
        <Link href="/learning-modules" className="text-neon-green text-sm hover:underline flex items-center">
          View all modules <i className="fas fa-arrow-right ml-1 text-xs"></i>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <div className="col-span-3 text-center py-8 text-muted-foreground">Loading modules...</div>
        ) : (
          <>
            {modulesData?.modules?.map((module: any) => {
              // Use safe inline style for dynamic classes
              const accentColor = module.accentColor || 'neon-green';
              const statusColor = module.status === 'locked' ? 'text-muted-foreground' : `text-${accentColor}`;
              
              return (
                <Card 
                  key={module.id}
                  className="bg-dark-800 border border-dark-600 overflow-hidden group hover:shadow-md transition-shadow duration-300"
                  style={{ '--hover-color': `var(--${accentColor})` } as React.CSSProperties}
                >
                  <div className="h-32 bg-dark-700 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <i className={`${module.icon} text-5xl opacity-20`} style={{ color: `var(--${accentColor})` }}></i>
                    </div>
                    <div className="absolute top-2 right-2 bg-dark-800 px-2 py-1 rounded-md text-xs border border-dark-600" 
                         style={{ color: module.status === 'locked' ? 'var(--muted-foreground)' : `var(--${accentColor})` }}>
                      {module.status === 'locked' ? (
                        <><i className="fas fa-lock mr-1"></i> Locked</>
                      ) : (
                        <><i className="fas fa-clock mr-1"></i> {formatTimeRemaining(module.timeRemaining)}</>
                      )}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <h4 className="font-mono font-bold text-foreground">{module.title}</h4>
                      <span className="text-xs px-2 py-1 rounded-md" 
                            style={{ 
                              backgroundColor: `hsla(var(--${accentColor}-hsl) / 0.2)`,
                              color: `var(--${accentColor})`
                            }}>
                        {module.difficulty || (module.status === 'locked' ? 'Locked' : 'In Progress')}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm mt-2">{module.description}</p>
                    <div className="mt-3">
                      <div className="w-full bg-dark-600 rounded-full h-1.5">
                        <div 
                          className="h-1.5 rounded-full" 
                          style={{ 
                            width: `${module.progress || 0}%`,
                            backgroundColor: `var(--${accentColor})` 
                          }}
                        ></div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {module.lessonsCompleted || 0}/{module.totalLessons || 0} lessons completed
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button 
                      className="w-full hover:shadow-sm"
                      style={{ 
                        backgroundColor: module.status === 'locked' ? 'var(--dark-700)' : `hsla(var(--${accentColor}-hsl) / 0.2)`,
                        color: module.status === 'locked' ? 'var(--muted-foreground)' : `var(--${accentColor})`,
                        borderColor: module.status === 'locked' ? 'transparent' : `hsla(var(--${accentColor}-hsl) / 0.3)`
                      }}
                      variant={module.status === 'locked' ? 'secondary' : 'outline'}
                      disabled={module.status === 'locked'}
                    >
                      {module.status === 'locked' ? 'Unlock' : 'Continue'}
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

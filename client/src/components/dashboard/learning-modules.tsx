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
        <h3 className="text-lg font-mono font-bold">
          <TerminalText>Continue Learning</TerminalText>
        </h3>
        <Link href="/learning-modules" className="text-neon-green text-sm hover:underline">
          View all modules
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <div className="col-span-3 text-center py-8">Loading modules...</div>
        ) : (
          <>
            {modulesData?.modules?.map((module: any) => (
              <Card 
                key={module.id}
                className={`bg-dark-800 border-dark-600 overflow-hidden group hover:shadow-${module.accentColor} transition-shadow duration-300`}
              >
                <div className="h-32 bg-dark-700 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <i className={`${module.icon} text-5xl text-${module.accentColor} opacity-20`}></i>
                  </div>
                  <div className={`absolute top-2 right-2 bg-dark-800 px-2 py-1 rounded text-xs ${module.status === 'locked' ? 'text-gray-400' : `text-${module.accentColor}`}`}>
                    {module.status === 'locked' ? (
                      <><i className="fas fa-lock mr-1"></i> Locked</>
                    ) : (
                      <><i className="fas fa-clock mr-1"></i> {formatTimeRemaining(module.timeRemaining)}</>
                    )}
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <h4 className="font-mono font-bold">{module.title}</h4>
                    <span className={`bg-${module.accentColor} bg-opacity-20 text-${module.accentColor} text-xs px-2 py-1 rounded`}>
                      {module.status === 'locked' ? 'Locked' : 'In Progress'}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mt-2">{module.description}</p>
                  <div className="mt-3">
                    <div className="w-full bg-dark-600 rounded-full h-1.5">
                      <div 
                        className={`bg-${module.accentColor} h-1.5 rounded-full`} 
                        style={{ width: `${module.progress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {module.lessonsCompleted}/{module.totalLessons} lessons completed
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button 
                    className="w-full bg-dark-700 hover:bg-dark-600 text-white"
                    disabled={module.status === 'locked'}
                  >
                    {module.status === 'locked' ? 'Unlock' : 'Continue'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </>
        )}
      </div>
    </section>
  );
};

export default LearningModules;

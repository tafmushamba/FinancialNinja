import React from 'react';
import { useParams, useLocation, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatTimeRemaining } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Clock, BookOpen } from 'lucide-react';

const ModuleDetailPage: React.FC = () => {
  const { moduleId } = useParams();
  const [, setLocation] = useLocation();

  const { data: moduleData, isLoading } = useQuery({
    queryKey: [`/api/learning/modules/${moduleId}/lessons`],
    enabled: !!moduleId,
  });

  const handleGoBack = () => {
    setLocation("/learning-modules");
  };

  const navigateToLesson = (lessonId: number) => {
    setLocation(`/lesson/${lessonId}`);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <Button 
          variant="ghost" 
          onClick={handleGoBack}
          className="mb-4"
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to all modules
        </Button>
        
        <Card className="mb-6 bg-dark-800 border-dark-600">
          <CardHeader>
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full" />
          </CardHeader>
        </Card>

        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="bg-dark-800 border-dark-600">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-9 w-24" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!moduleData) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <p>Module not found</p>
        <Button onClick={() => setLocation("/learning-modules")} className="mt-4">
          Go to Learning Modules
        </Button>
      </div>
    );
  }

  const { moduleTitle, moduleDescription, accentColor, lessons } = moduleData;

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <Button 
        variant="ghost" 
        onClick={handleGoBack}
        className="mb-4"
      >
        <ChevronLeft className="mr-2 h-4 w-4" /> Back to all modules
      </Button>
      
      <Card className={`mb-6 bg-dark-800 border-${accentColor}`}>
        <CardHeader>
          <CardTitle className={`text-${accentColor} text-2xl`}>{moduleTitle}</CardTitle>
          <CardDescription className="text-gray-400">{moduleDescription}</CardDescription>
        </CardHeader>
      </Card>

      <h2 className="text-xl font-mono mb-4 text-white">Module Lessons</h2>

      <div className="space-y-4">
        {lessons.map((lesson: any, index: number) => (
          <Card key={lesson.id} className={`bg-dark-800 hover:bg-dark-700 transition-colors border-dark-600 hover:border-${accentColor}`}>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <h3 className="font-medium text-white">
                    Lesson {index + 1}: {lesson.title}
                  </h3>
                  <div className="flex items-center text-gray-400 text-sm">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>{formatTimeRemaining(lesson.duration)}</span>
                  </div>
                </div>
                <Button 
                  onClick={() => navigateToLesson(lesson.id)}
                  className={`bg-${accentColor} hover:bg-${accentColor}/80 text-black`}
                  size="sm"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Start
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ModuleDetailPage;
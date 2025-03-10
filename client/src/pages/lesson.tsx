import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatTimeRemaining } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

// Import the styles specific to markdown
import 'github-markdown-css/github-markdown.css';

const LessonPage: React.FC = () => {
  const { lessonId } = useParams();
  const [, setLocation] = useLocation();
  const [darkThemeStylesLoaded, setDarkThemeStylesLoaded] = useState(false);

  const { data: lessonData, isLoading } = useQuery({
    queryKey: [`/api/learning/lessons/${lessonId}`],
    enabled: !!lessonId,
  });

  // Load the dark theme styles to override the GitHub markdown CSS
  useEffect(() => {
    if (!darkThemeStylesLoaded) {
      const style = document.createElement('style');
      style.textContent = `
        .markdown-body {
          color: #e4e4e7;
          background-color: transparent;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
        }
        .markdown-body h1, .markdown-body h2, .markdown-body h3, .markdown-body h4, .markdown-body h5, .markdown-body h6 {
          color: #f4f4f5;
          border-bottom: 1px solid #27272a;
          margin-top: 1.5em;
          margin-bottom: 16px;
          font-weight: 600;
          line-height: 1.25;
        }
        .markdown-body h1 {
          font-size: 2em;
          color: var(--neon-green);
        }
        .markdown-body h2 {
          font-size: 1.5em;
          color: var(--neon-cyan);
        }
        .markdown-body h3 {
          font-size: 1.25em;
          color: var(--neon-purple);
        }
        .markdown-body a {
          color: var(--neon-green);
        }
        .markdown-body a:hover {
          color: #39ff14;
          text-decoration: underline;
        }
        .markdown-body blockquote {
          color: #a1a1aa;
          border-left: 4px solid #3f3f46;
        }
        .markdown-body hr {
          background-color: #3f3f46;
        }
        .markdown-body img {
          background-color: transparent;
        }
        .markdown-body code {
          color: var(--neon-cyan);
          background-color: #18181b;
        }
        .markdown-body pre {
          background-color: #18181b;
          border: 1px solid #27272a;
        }
        .markdown-body table tr {
          background-color: #09090b;
          border-top: 1px solid #27272a;
        }
        .markdown-body table tr:nth-child(2n) {
          background-color: #18181b;
        }
        .markdown-body table th, .markdown-body table td {
          border: 1px solid #27272a;
        }
        .markdown-body ul, .markdown-body ol {
          padding-left: 2em;
        }
        .markdown-body li + li {
          margin-top: 0.25em;
        }
        .markdown-body strong {
          color: var(--neon-green);
        }
      `;
      document.head.appendChild(style);
      setDarkThemeStylesLoaded(true);
    }
  }, [darkThemeStylesLoaded]);

  const handleGoBack = () => {
    if (lessonData?.module) {
      setLocation(`/learning-modules/${lessonData.module.id}`);
    } else {
      setLocation("/learning-modules");
    }
  };

  const navigateToLesson = (id: number) => {
    setLocation(`/lesson/${id}`);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <Button 
          variant="ghost" 
          onClick={handleGoBack}
          className="mb-4"
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to module
        </Button>

        <Card className="mb-4 bg-dark-800 border-dark-600">
          <CardHeader>
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/4" />
          </CardHeader>
        </Card>

        <Card className="bg-dark-800 border-dark-600">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-5/6" />
              <Skeleton className="h-6 w-4/6" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-3/4" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!lessonData) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <p>Lesson not found</p>
        <Button onClick={() => setLocation("/learning-modules")} className="mt-4">
          Go to Learning Modules
        </Button>
      </div>
    );
  }

  const { lesson, module, navigation } = lessonData;
  const accentColor = module?.accentColor || 'neon-green';

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <Button 
        variant="ghost" 
        onClick={handleGoBack}
        className="mb-4"
      >
        <ChevronLeft className="mr-2 h-4 w-4" /> Back to module
      </Button>

      <Card className={`mb-6 bg-dark-800 border-${accentColor}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className={`text-${accentColor} text-2xl`}>{lesson.title}</CardTitle>
              <p className="text-gray-400 mt-1">Module: {module.title}</p>
            </div>
            <div className="flex items-center text-gray-400">
              <Clock className="h-4 w-4 mr-1" />
              <span>{formatTimeRemaining(lesson.duration)}</span>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card className="bg-dark-800 border-dark-600 mb-6">
        <CardContent className="pt-6">
          <div className="markdown-body">
            <ReactMarkdown>{lesson.content}</ReactMarkdown>
          </div>
        </CardContent>
      </Card>

      {lesson.quizId && (
        <div className="mb-6 text-center">
          <Button 
            onClick={() => setLocation(`/quiz/${lesson.quizId}`, { 
              state: { 
                returnUrl: `/lesson/${lessonId}`,
                lessonId: lesson.id
              }
            })}
            className={`border-${accentColor} bg-${accentColor} text-black hover:bg-${accentColor}/90`}
            size="lg"
          >
            Take Quiz
          </Button>
          <p className="text-sm text-gray-400 mt-2">
            Test your knowledge and earn achievements by completing the quiz
          </p>
        </div>
      )}

      <div className="flex justify-between mt-6">
        {navigation.prev ? (
          <Button 
            variant="outline"
            onClick={() => navigateToLesson(navigation.prev.id)}
            className={`border-${accentColor} text-${accentColor} hover:bg-${accentColor} hover:text-black`}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous: {navigation.prev.title}
          </Button>
        ) : (
          <div></div>
        )}

        {navigation.next ? (
          <Button 
            variant="outline"
            onClick={() => navigateToLesson(navigation.next.id)}
            className={`border-${accentColor} text-${accentColor} hover:bg-${accentColor} hover:text-black`}
          >
            Next: {navigation.next.title}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button 
            variant="outline"
            onClick={handleGoBack}
            className={`border-${accentColor} text-${accentColor} hover:bg-${accentColor} hover:text-black`}
          >
            Complete Module
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default LessonPage;
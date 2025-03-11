import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import ReactMarkdown from 'react-markdown';

interface GameMessageProps {
  message: string | null;
  isLoading: boolean;
}

export function GameMessage({ message, isLoading }: GameMessageProps) {
  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-b from-background to-background/50 shadow-md h-full">
      <CardContent className="p-4 md:p-6">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-6 w-4/5" />
          </div>
        ) : (
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            {message ? (
              <div className="whitespace-pre-line">
                <ReactMarkdown>
                  {message}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="whitespace-pre-line">
                Welcome to the Financial Twin game! Enter your name to begin your journey.
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
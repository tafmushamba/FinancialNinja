import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface GameMessageProps {
  message: string | null;
  isLoading: boolean;
}

export function GameMessage({ message, isLoading }: GameMessageProps) {
  if (isLoading) {
    return (
      <Card className="bg-primary-50 dark:bg-primary-900/20 border-primary/20 my-4">
        <CardContent className="p-4 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
          <span>Processing your decision...</span>
        </CardContent>
      </Card>
    );
  }

  if (!message) return null;

  return (
    <Card className="bg-primary-50 dark:bg-primary-900/20 border-primary/20 my-4">
      <CardContent className="p-4">
        <div className="prose prose-sm dark:prose-invert max-w-none">
          {message.split('\n').map((paragraph, i) => (
            <p key={i} className={i === 0 ? 'font-medium text-lg' : ''}>
              {paragraph}
            </p>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
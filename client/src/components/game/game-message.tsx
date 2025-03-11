import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

interface GameMessageProps {
  message: string | null;
  isLoading: boolean;
}

export function GameMessage({ message, isLoading }: GameMessageProps) {
  if (isLoading) {
    return (
      <Card className="border-primary/20 bg-primary/5 overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="mt-1">
              <MessageCircle className="h-5 w-5 text-primary" />
            </div>
            <div className="w-full space-y-2">
              <div className="h-4 bg-muted rounded animate-pulse w-3/4"></div>
              <div className="h-4 bg-muted rounded animate-pulse w-1/2"></div>
              <div className="h-4 bg-muted rounded animate-pulse w-5/6"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!message) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-primary/20 bg-primary/5 overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="mt-1">
              <MessageCircle className="h-5 w-5 text-primary" />
            </div>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown>{message}</ReactMarkdown>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
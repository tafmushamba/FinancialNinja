import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { 
  MessageCircle, AlertCircle, Lightbulb, Info, 
  BellRing, PartyPopper, Zap, TrendingUp, Scale
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface AnimatedGameMessageProps {
  message: string | null;
  isLoading: boolean;
  type?: 'default' | 'alert' | 'tip' | 'event' | 'achievement' | 'crisis' | 'decision';
}

export function AnimatedGameMessage({ 
  message, 
  isLoading, 
  type: explicitType = 'default' 
}: AnimatedGameMessageProps) {
  const [displayMessage, setDisplayMessage] = useState(message);
  const [messageType, setMessageType] = useState(explicitType);

  useEffect(() => {
    if (message) {
      setDisplayMessage(message);
      
      // Auto-detect message type based on content if no explicit type is provided
      if (explicitType === 'default') {
        if (message.toLowerCase().includes('achievement') || 
            message.toLowerCase().includes('congrat') ||
            message.toLowerCase().includes('unlocked') ||
            message.toLowerCase().includes('earned')) {
          setMessageType('achievement');
        } else if (message.toLowerCase().includes('emergency') || 
                  message.toLowerCase().includes('unexpected') ||
                  message.toLowerCase().includes('crisis') ||
                  message.toLowerCase().includes('problem')) {
          setMessageType('crisis');
        } else if (message.toLowerCase().includes('decision') || 
                  message.toLowerCase().includes('options') ||
                  message.toLowerCase().includes('choose') ||
                  message.toLowerCase().includes('what will you do')) {
          setMessageType('decision');
        } else if (message.toLowerCase().includes('tip') || 
                  message.toLowerCase().includes('advice') ||
                  message.toLowerCase().includes('recommend')) {
          setMessageType('tip');
        } else if (message.toLowerCase().includes('event') ||
                  message.toLowerCase().includes('scenario') ||
                  message.toLowerCase().includes('situation')) {
          setMessageType('event');
        } else {
          setMessageType('default');
        }
      } else {
        setMessageType(explicitType);
      }
    }
  }, [message, explicitType]);

  const getIcon = () => {
    switch (messageType) {
      case 'alert':
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      case 'tip':
        return <Lightbulb className="h-5 w-5 text-blue-500" />;
      case 'event':
        return <Info className="h-5 w-5 text-purple-500" />;
      case 'achievement':
        return <PartyPopper className="h-5 w-5 text-amber-500" />;
      case 'crisis':
        return <BellRing className="h-5 w-5 text-red-500" />;
      case 'decision':
        return <Scale className="h-5 w-5 text-green-500" />;
      default:
        return <MessageCircle className="h-5 w-5 text-primary" />;
    }
  };

  const getCardStyle = () => {
    switch (messageType) {
      case 'alert':
        return 'border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30';
      case 'tip':
        return 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30';
      case 'event':
        return 'border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-950/30';
      case 'achievement':
        return 'border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30';
      case 'crisis':
        return 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/30';
      case 'decision':
        return 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/30';
      default:
        return 'border-primary/20 bg-primary/5';
    }
  };

  if (isLoading) {
    return (
      <Card className={`${getCardStyle()} overflow-hidden`}>
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="mt-1">{getIcon()}</div>
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

  if (!displayMessage) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={displayMessage}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
      >
        <Card className={`${getCardStyle()} overflow-hidden`}>
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <div className="mt-1">{getIcon()}</div>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown>{displayMessage}</ReactMarkdown>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
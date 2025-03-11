import React from 'react';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface GameMessageProps {
  message: string | null;
  isLoading: boolean;
}

export function GameMessage({ message, isLoading }: GameMessageProps) {
  // Split the message into paragraphs for better formatting
  const paragraphs = React.useMemo(() => {
    if (!message) return [];
    return message.split('\n').filter(line => line.trim() !== '');
  }, [message]);

  return (
    <Card className="p-6 relative min-h-[250px]">
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Processing your decision...</span>
        </div>
      ) : message ? (
        <div className="space-y-4">
          {paragraphs.map((paragraph, index) => {
            // Check if paragraph is a list item with a dash or bullet
            if (paragraph.trim().startsWith('- ')) {
              return (
                <div key={index} className="ml-4">
                  <span className="text-primary">&bull;</span> {paragraph.replace('- ', '')}
                </div>
              );
            }
            
            // Check if it's a section header (often in all caps or has a colon)
            if (paragraph.includes(':') && !paragraph.includes(': £')) {
              const [header, content] = paragraph.split(':', 2);
              return (
                <div key={index}>
                  <strong className="text-primary font-medium">{header}:</strong>
                  {content}
                </div>
              );
            }
            
            // Regular paragraph
            return <p key={index}>{paragraph}</p>;
          })}
        </div>
      ) : (
        <div className="text-center text-muted-foreground">
          Make your first financial decision to start your journey!
        </div>
      )}
    </Card>
  );
}
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import TerminalText from '@/components/ui/terminal-text';

interface GameMessageProps {
  message: string | null;
  isLoading: boolean;
}

export function GameMessage({ message, isLoading }: GameMessageProps) {
  if (isLoading) {
    return (
      <Card className="p-6">
        <Skeleton className="h-4 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6 mb-2" />
        <Skeleton className="h-4 w-2/3" />
      </Card>
    );
  }

  if (!message) {
    return (
      <Card className="p-6 text-center">
        <p className="text-muted-foreground">Preparing your financial simulation...</p>
      </Card>
    );
  }

  // Clean up the message format
  const formattedMessage = message
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Replace **text** with <strong>text</strong>
    .replace(/\n\n/g, '</p><p>') // Replace double newlines with paragraph breaks
    .replace(/\n/g, '<br />'); // Replace single newlines with <br />

  return (
    <Card className="p-6 prose dark:prose-invert max-w-none">
      <TerminalText typing={false}>
        <div dangerouslySetInnerHTML={{ __html: `<p>${formattedMessage}</p>` }} />
      </TerminalText>
    </Card>
  );
}
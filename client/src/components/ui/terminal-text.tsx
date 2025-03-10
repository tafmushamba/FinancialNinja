import React from 'react';
import { cn } from '@/lib/utils';

interface TerminalTextProps {
  children: React.ReactNode;
  className?: string;
  typing?: boolean;
  delay?: number;
}

const TerminalText: React.FC<TerminalTextProps> = ({ 
  children, 
  className,
  typing = false,
  delay = 30
}) => {
  const [displayText, setDisplayText] = React.useState('');
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const text = React.useMemo(() => {
    if (typeof children === 'string') return children;
    return '';
  }, [children]);

  React.useEffect(() => {
    if (!typing || typeof children !== 'string') return;

    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, delay);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, typing, delay, children]);

  if (!typing) {
    return (
      <span className={cn('terminal-effect', className)}>
        {children}
      </span>
    );
  }

  return (
    <span className={cn('terminal-effect', className)}>
      {displayText}
      {currentIndex < text.length && (
        <span className="animate-pulse">|</span>
      )}
    </span>
  );
};

export default TerminalText;

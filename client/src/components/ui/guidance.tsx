import React from 'react';
import { cn } from '@/lib/utils';
import { Info, AlertCircle, HelpCircle, Lightbulb, AlertTriangle } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';

// Define variants for the guidance component
const guidanceVariants = cva(
  "relative rounded-lg border p-4 shadow-sm",
  {
    variants: {
      variant: {
        info: "bg-blue-950/50 border-blue-500/30 text-blue-50",
        tip: "bg-[#9FEF00]/10 border-[#9FEF00]/30 text-[#9FEF00]",
        warning: "bg-yellow-900/50 border-yellow-500/30 text-yellow-50",
        error: "bg-red-950/50 border-red-500/30 text-red-50",
        help: "bg-purple-950/50 border-purple-500/30 text-purple-50",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  }
);

// Guidance component for providing contextual help, tips, and warnings
export interface GuidanceProps extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof guidanceVariants> {
  title?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  icon?: React.ReactNode;
  showIcon?: boolean;
}

export function Guidance({
  className,
  variant,
  title,
  children,
  dismissible = false,
  onDismiss,
  icon,
  showIcon = true,
  ...props
}: GuidanceProps) {
  // Default icons based on variant
  const getDefaultIcon = () => {
    switch (variant) {
      case 'info':
        return <Info className="h-5 w-5 text-blue-400" />;
      case 'tip':
        return <Lightbulb className="h-5 w-5 text-[#9FEF00]" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-400" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-400" />;
      case 'help':
        return <HelpCircle className="h-5 w-5 text-purple-400" />;
      default:
        return <Info className="h-5 w-5 text-blue-400" />;
    }
  };

  return (
    <div 
      className={cn(
        guidanceVariants({ variant }),
        "backdrop-blur-sm",
        className
      )}
      role={variant === 'error' ? 'alert' : 'status'}
      {...props}
    >
      <div className="flex">
        {showIcon && (
          <div className="flex-shrink-0 mr-3">
            {icon || getDefaultIcon()}
          </div>
        )}
        <div className="flex-1">
          {title && (
            <h3 className={cn(
              "text-sm font-medium mb-1",
              variant === 'tip' && "text-[#9FEF00]",
              variant === 'info' && "text-blue-300",
              variant === 'warning' && "text-yellow-300",
              variant === 'error' && "text-red-300",
              variant === 'help' && "text-purple-300"
            )}>
              {title}
            </h3>
          )}
          <div className={cn(
            "text-sm",
            variant === 'tip' && "text-[#9FEF00]/90",
            variant === 'info' && "text-blue-100/90",
            variant === 'warning' && "text-yellow-100/90",
            variant === 'error' && "text-red-100/90",
            variant === 'help' && "text-purple-100/90"
          )}>
            {children}
          </div>
        </div>
        {dismissible && onDismiss && (
          <button
            type="button"
            className={cn(
              "ml-3 flex-shrink-0 rounded-full p-1 transition-colors",
              variant === 'tip' && "hover:bg-[#9FEF00]/20 text-[#9FEF00]/70 hover:text-[#9FEF00]",
              variant === 'info' && "hover:bg-blue-800 text-blue-300/70 hover:text-blue-100",
              variant === 'warning' && "hover:bg-yellow-800 text-yellow-300/70 hover:text-yellow-100",
              variant === 'error' && "hover:bg-red-800 text-red-300/70 hover:text-red-100",
              variant === 'help' && "hover:bg-purple-800 text-purple-300/70 hover:text-purple-100"
            )}
            onClick={onDismiss}
            aria-label="Dismiss"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      
      {/* Terminal-style glowing effect for tip variant */}
      {variant === 'tip' && (
        <div className="absolute -inset-px rounded-lg opacity-10 blur-sm bg-[#9FEF00]/30 pointer-events-none" />
      )}
    </div>
  );
}

// Tooltip component for providing contextual help on hover
export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  position?: 'top' | 'right' | 'bottom' | 'left';
  className?: string;
  contentClassName?: string;
  delay?: number;
  maxWidth?: string;
}

export function Tooltip({
  content,
  children,
  position = 'top',
  className,
  contentClassName,
  delay = 300,
  maxWidth = '250px',
}: TooltipProps) {
  const [isVisible, setIsVisible] = React.useState(false);
  const [delayHandler, setDelayHandler] = React.useState<NodeJS.Timeout | null>(null);
  
  const showTooltip = () => {
    if (delayHandler) clearTimeout(delayHandler);
    const handler = setTimeout(() => setIsVisible(true), delay);
    setDelayHandler(handler);
  };
  
  const hideTooltip = () => {
    if (delayHandler) clearTimeout(delayHandler);
    setIsVisible(false);
  };
  
  // Position classes
  const positionClasses = {
    top: "bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 mb-2",
    right: "left-full top-1/2 transform -translate-y-1/2 translate-x-2 ml-2",
    bottom: "top-full left-1/2 transform -translate-x-1/2 translate-y-2 mt-2",
    left: "right-full top-1/2 transform -translate-y-1/2 -translate-x-2 mr-2",
  };
  
  // Arrow classes
  const arrowClasses = {
    top: "bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full border-t-black/80 border-l-transparent border-r-transparent border-b-transparent",
    right: "left-0 top-1/2 transform -translate-y-1/2 -translate-x-full border-r-black/80 border-t-transparent border-b-transparent border-l-transparent",
    bottom: "top-0 left-1/2 transform -translate-x-1/2 -translate-y-full border-b-black/80 border-l-transparent border-r-transparent border-t-transparent",
    left: "right-0 top-1/2 transform -translate-y-1/2 translate-x-full border-l-black/80 border-t-transparent border-b-transparent border-r-transparent",
  };
  
  return (
    <div 
      className={cn("relative inline-block", className)}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      
      {isVisible && (
        <div 
          className={cn(
            "absolute z-50 px-3 py-2 text-xs rounded bg-black/80 text-white backdrop-blur-sm shadow-lg border border-white/10",
            positionClasses[position],
            contentClassName
          )}
          style={{ maxWidth }}
          role="tooltip"
        >
          {content}
          <div 
            className={cn(
              "absolute w-0 h-0 border-4",
              arrowClasses[position]
            )}
          />
        </div>
      )}
    </div>
  );
}

// KeyboardShortcut component for displaying keyboard shortcuts
export interface KeyboardShortcutProps {
  keys: string[];
  description?: string;
  className?: string;
}

export function KeyboardShortcut({
  keys,
  description,
  className,
}: KeyboardShortcutProps) {
  return (
    <div className={cn("flex items-center gap-2 text-sm", className)}>
      <div className="flex items-center gap-1">
        {keys.map((key, index) => (
          <React.Fragment key={index}>
            <kbd className="px-2 py-1 text-xs font-mono bg-black/50 border border-[#9FEF00]/30 rounded shadow-sm text-[#9FEF00]">
              {key}
            </kbd>
            {index < keys.length - 1 && <span className="text-[#9FEF00]/50">+</span>}
          </React.Fragment>
        ))}
      </div>
      {description && (
        <span className="text-xs text-white/70">{description}</span>
      )}
    </div>
  );
}

export { guidanceVariants };

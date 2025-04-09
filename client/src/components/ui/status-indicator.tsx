import React from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

// Define variants for the status indicator
const statusIndicatorVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium",
  {
    variants: {
      variant: {
        default: "bg-white/10 text-white",
        success: "bg-[#9FEF00]/10 text-[#9FEF00] border border-[#9FEF00]/20",
        warning: "bg-yellow-900/50 text-yellow-300 border border-yellow-500/20",
        error: "bg-red-900/50 text-red-300 border border-red-500/20",
        info: "bg-blue-900/50 text-blue-300 border border-blue-500/20",
        pending: "bg-purple-900/50 text-purple-300 border border-purple-500/20",
        terminal: "bg-black/50 text-[#9FEF00] border border-[#9FEF00]/20",
      },
      size: {
        sm: "text-[10px] px-1.5 py-0.5",
        md: "text-xs px-2 py-1",
        lg: "text-sm px-2.5 py-1.5",
      },
      animation: {
        none: "",
        pulse: "animate-pulse",
        blink: "animate-[blink_1s_ease-in-out_infinite]",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      animation: "none",
    },
  }
);

// Status dot component
const statusDotVariants = cva(
  "inline-block rounded-full",
  {
    variants: {
      variant: {
        default: "bg-white",
        success: "bg-[#9FEF00]",
        warning: "bg-yellow-400",
        error: "bg-red-500",
        info: "bg-blue-500",
        pending: "bg-purple-500",
        terminal: "bg-[#9FEF00]",
      },
      size: {
        sm: "h-1.5 w-1.5",
        md: "h-2 w-2",
        lg: "h-2.5 w-2.5",
      },
      animation: {
        none: "",
        pulse: "animate-pulse",
        blink: "animate-[blink_1s_ease-in-out_infinite]",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      animation: "none",
    },
  }
);

// Define the StatusIndicator component props
export interface StatusIndicatorProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusIndicatorVariants> {
  showDot?: boolean;
}

// Status indicator component
function StatusIndicator({
  className,
  variant,
  size,
  animation,
  showDot = true,
  children,
  ...props
}: StatusIndicatorProps) {
  return (
    <span
      className={cn(statusIndicatorVariants({ variant, size, animation }), className)}
      {...props}
    >
      {showDot && (
        <span className={cn(statusDotVariants({ variant, size, animation }))} />
      )}
      {children}
    </span>
  );
}

// Define the StatusDot component props
export interface StatusDotProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusDotVariants> {}

// Status dot component (standalone)
function StatusDot({
  className,
  variant,
  size,
  animation,
  ...props
}: StatusDotProps) {
  return (
    <span
      className={cn(statusDotVariants({ variant, size, animation }), className)}
      {...props}
    />
  );
}

// Connection status component
interface ConnectionStatusProps {
  connected: boolean;
  reconnecting?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

function ConnectionStatus({
  connected,
  reconnecting = false,
  className,
  size = "md",
}: ConnectionStatusProps) {
  let variant: "success" | "warning" | "error";
  let text: string;
  let animation: "none" | "pulse" | "blink";
  
  if (reconnecting) {
    variant = "warning";
    text = "Reconnecting...";
    animation = "blink";
  } else if (connected) {
    variant = "success";
    text = "Connected";
    animation = "none";
  } else {
    variant = "error";
    text = "Disconnected";
    animation = "pulse";
  }
  
  return (
    <StatusIndicator
      variant={variant}
      size={size}
      animation={animation}
      className={className}
    >
      {text}
    </StatusIndicator>
  );
}

// API status component
interface ApiStatusProps {
  status: "online" | "degraded" | "offline" | "maintenance";
  className?: string;
  size?: "sm" | "md" | "lg";
}

function ApiStatus({
  status,
  className,
  size = "md",
}: ApiStatusProps) {
  const statusConfig = {
    online: {
      variant: "success" as const,
      text: "API Online",
      animation: "none" as const,
    },
    degraded: {
      variant: "warning" as const,
      text: "API Degraded",
      animation: "none" as const,
    },
    offline: {
      variant: "error" as const,
      text: "API Offline",
      animation: "pulse" as const,
    },
    maintenance: {
      variant: "info" as const,
      text: "API Maintenance",
      animation: "none" as const,
    },
  };
  
  const config = statusConfig[status];
  
  return (
    <StatusIndicator
      variant={config.variant}
      size={size}
      animation={config.animation}
      className={className}
    >
      {config.text}
    </StatusIndicator>
  );
}

// Terminal status component
interface TerminalStatusProps {
  status: "ready" | "processing" | "error" | "waiting";
  className?: string;
  size?: "sm" | "md" | "lg";
  customText?: string;
}

function TerminalStatus({
  status,
  className,
  size = "md",
  customText,
}: TerminalStatusProps) {
  const statusConfig = {
    ready: {
      variant: "terminal" as const,
      text: "Terminal Ready",
      animation: "none" as const,
    },
    processing: {
      variant: "terminal" as const,
      text: "Processing...",
      animation: "blink" as const,
    },
    error: {
      variant: "error" as const,
      text: "Terminal Error",
      animation: "pulse" as const,
    },
    waiting: {
      variant: "pending" as const,
      text: "Waiting...",
      animation: "pulse" as const,
    },
  };
  
  const config = statusConfig[status];
  
  return (
    <StatusIndicator
      variant={config.variant}
      size={size}
      animation={config.animation}
      className={className}
    >
      {customText || config.text}
    </StatusIndicator>
  );
}

export {
  StatusIndicator,
  StatusDot,
  ConnectionStatus,
  ApiStatus,
  TerminalStatus,
  statusIndicatorVariants,
  statusDotVariants,
};

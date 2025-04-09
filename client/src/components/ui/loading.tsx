import React from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

// Define variants for the loading spinner
const spinnerVariants = cva(
  "animate-spin rounded-full border-t-transparent",
  {
    variants: {
      size: {
        xs: "h-3 w-3 border-2",
        sm: "h-4 w-4 border-2",
        md: "h-6 w-6 border-2",
        lg: "h-8 w-8 border-3",
        xl: "h-12 w-12 border-4",
      },
      variant: {
        default: "border-primary/30 border-t-primary",
        secondary: "border-secondary/30 border-t-secondary",
        success: "border-[#9FEF00]/30 border-t-[#9FEF00]",
        destructive: "border-destructive/30 border-t-destructive",
        terminal: "border-[#9FEF00]/30 border-t-[#9FEF00]",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "default",
    },
  }
);

// Loading spinner component
export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof spinnerVariants> {}

export function Spinner({ className, size, variant, ...props }: SpinnerProps) {
  return (
    <div 
      className={cn(spinnerVariants({ size, variant }), className)}
      {...props}
    />
  );
}

// Loading overlay for page or section loading
interface LoadingOverlayProps {
  message?: string;
  fullPage?: boolean;
  transparent?: boolean;
  className?: string;
  spinnerSize?: "xs" | "sm" | "md" | "lg" | "xl";
  spinnerVariant?: "default" | "secondary" | "success" | "destructive" | "terminal";
}

export function LoadingOverlay({
  message = "Loading...",
  fullPage = false,
  transparent = false,
  className,
  spinnerSize = "lg",
  spinnerVariant = "terminal",
}: LoadingOverlayProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center",
      fullPage ? "fixed inset-0 z-50" : "absolute inset-0 z-10",
      transparent ? "bg-black/50 backdrop-blur-sm" : "bg-background/95",
      className
    )}>
      <div className="relative">
        <Spinner size={spinnerSize} variant={spinnerVariant} />
        
        {/* Terminal-style glowing effect */}
        {spinnerVariant === "terminal" && (
          <div className="absolute inset-0 rounded-full blur-md opacity-70 bg-[#9FEF00]/30 animate-pulse" />
        )}
      </div>
      
      {message && (
        <p className={cn(
          "mt-4 text-sm font-mono",
          spinnerVariant === "terminal" ? "text-[#9FEF00]" : "text-foreground"
        )}>
          {message}
        </p>
      )}
    </div>
  );
}

// Inline loading indicator for buttons or small areas
interface InlineLoadingProps {
  message?: string;
  className?: string;
  spinnerSize?: "xs" | "sm" | "md";
  spinnerVariant?: "default" | "secondary" | "success" | "destructive" | "terminal";
}

export function InlineLoading({
  message,
  className,
  spinnerSize = "sm",
  spinnerVariant = "default",
}: InlineLoadingProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Spinner size={spinnerSize} variant={spinnerVariant} />
      {message && <span className="text-xs">{message}</span>}
    </div>
  );
}

// Progress bar for showing determinate progress
interface ProgressBarProps {
  progress: number; // 0-100
  showPercentage?: boolean;
  className?: string;
  height?: "xs" | "sm" | "md" | "lg";
  variant?: "default" | "success" | "destructive" | "terminal";
}

export function ProgressBar({
  progress,
  showPercentage = false,
  className,
  height = "md",
  variant = "terminal",
}: ProgressBarProps) {
  // Ensure progress is between 0-100
  const normalizedProgress = Math.max(0, Math.min(100, progress));
  
  // Map height values to actual classes
  const heightClasses = {
    xs: "h-1",
    sm: "h-2",
    md: "h-3",
    lg: "h-4",
  };
  
  // Map variants to colors
  const variantClasses = {
    default: "bg-primary/20",
    success: "bg-[#9FEF00]/20",
    destructive: "bg-destructive/20",
    terminal: "bg-[#9FEF00]/20",
  };
  
  const progressClasses = {
    default: "bg-primary",
    success: "bg-[#9FEF00]",
    destructive: "bg-destructive",
    terminal: "bg-[#9FEF00]",
  };
  
  return (
    <div className={cn("w-full flex flex-col", className)}>
      <div className={cn(
        "w-full rounded-full overflow-hidden",
        heightClasses[height],
        variantClasses[variant]
      )}>
        <div 
          className={cn(
            "h-full rounded-full transition-all duration-300 ease-in-out",
            progressClasses[variant]
          )}
          style={{ width: `${normalizedProgress}%` }}
        >
          {/* Terminal-style glowing effect for terminal variant */}
          {variant === "terminal" && (
            <div className="h-full w-full bg-[#9FEF00] blur-sm opacity-70" />
          )}
        </div>
      </div>
      
      {showPercentage && (
        <div className="flex justify-end mt-1">
          <span className={cn(
            "text-xs font-mono",
            variant === "terminal" ? "text-[#9FEF00]" : "text-foreground/70"
          )}>
            {normalizedProgress.toFixed(0)}%
          </span>
        </div>
      )}
    </div>
  );
}

// Export all components
export { 
  spinnerVariants,
  LoadingOverlay as Loading
};

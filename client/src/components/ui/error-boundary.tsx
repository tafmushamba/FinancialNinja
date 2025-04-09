import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Error boundary props
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetKeys?: Array<any>;
  className?: string;
}

// Error boundary state
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary component to catch JavaScript errors anywhere in the child component tree,
 * log those errors, and display a fallback UI instead of the component tree that crashed.
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to an error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    
    // Update state with error details
    this.setState({ errorInfo });
    
    // Call onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps): void {
    // Reset error state if resetKeys change
    if (
      this.state.hasError &&
      this.props.resetKeys &&
      prevProps.resetKeys &&
      this.props.resetKeys.some((key, index) => key !== prevProps.resetKeys?.[index])
    ) {
      this.reset();
    }
  }

  // Reset error state
  reset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // If a custom fallback is provided, use it
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div 
          className={cn(
            "rounded-lg border border-red-500/30 bg-black/80 backdrop-blur-sm p-6 flex flex-col items-center justify-center text-center space-y-4",
            this.props.className
          )}
          role="alert"
          aria-live="assertive"
        >
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-900/30 text-red-400">
            <AlertTriangle className="w-8 h-8" />
          </div>
          
          <div className="space-y-2 max-w-md">
            <h2 className="text-xl font-semibold text-white flex items-center justify-center gap-2">
              <Terminal className="w-5 h-5 text-[#9FEF00]" />
              <span>Something went wrong</span>
            </h2>
            
            <p className="text-white/70 text-sm">
              An unexpected error occurred. The development team has been notified.
            </p>
            
            {/* Error details (collapsed by default) */}
            <details className="mt-4 text-left">
              <summary className="text-white/50 text-xs cursor-pointer hover:text-white/70 transition-colors">
                Technical details
              </summary>
              <div className="mt-2 p-2 bg-black/50 border border-white/10 rounded text-xs font-mono text-white/60 overflow-auto max-h-32">
                <p className="text-red-400">{this.state.error?.toString()}</p>
                <pre className="mt-2 whitespace-pre-wrap">
                  {this.state.errorInfo?.componentStack}
                </pre>
              </div>
            </details>
          </div>
          
          <div className="flex gap-3 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={this.reset}
              className="border-[#9FEF00]/30 text-[#9FEF00] hover:bg-[#9FEF00]/10"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try again
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.reload()}
              className="border-white/20 text-white/70 hover:bg-white/5"
            >
              Reload page
            </Button>
          </div>
        </div>
      );
    }

    // When there's no error, render children normally
    return this.props.children;
  }
}

// Component-level error boundary
interface ComponentErrorBoundaryProps extends ErrorBoundaryProps {
  name: string;
}

/**
 * A specialized error boundary for wrapping individual components
 * with a more compact error display
 */
const ComponentErrorBoundary = ({ 
  name, 
  children,
  onError,
  resetKeys,
  className,
  ...props 
}: ComponentErrorBoundaryProps) => {
  return (
    <ErrorBoundary
      onError={onError}
      resetKeys={resetKeys}
      className={className}
      fallback={
        <div 
          className={cn(
            "rounded border border-red-500/30 bg-black/50 p-3 text-sm",
            className
          )}
          role="alert"
        >
          <div className="flex items-center gap-2 text-red-400 mb-2">
            <AlertTriangle className="w-4 h-4" />
            <span className="font-medium">Failed to load {name}</span>
          </div>
          <div className="flex gap-2 mt-2">
            <Button
              variant="outline"
              size="sm"
              className="h-7 px-2 text-xs border-[#9FEF00]/30 text-[#9FEF00] hover:bg-[#9FEF00]/10"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="w-3 h-3 mr-1" />
              Reload
            </Button>
          </div>
        </div>
      }
      {...props}
    >
      {children}
    </ErrorBoundary>
  );
};

// Async boundary for handling async loading states with error handling
interface AsyncBoundaryProps extends Omit<ErrorBoundaryProps, 'fallback'> {
  isLoading?: boolean;
  loadingFallback?: ReactNode;
  errorFallback?: ReactNode;
}

/**
 * A component that combines error boundary with loading state handling
 * for async operations
 */
const AsyncBoundary = ({
  children,
  isLoading = false,
  loadingFallback = null,
  errorFallback,
  onError,
  resetKeys,
  className,
  ...props
}: AsyncBoundaryProps) => {
  return (
    <ErrorBoundary
      onError={onError}
      resetKeys={resetKeys}
      className={className}
      fallback={errorFallback}
      {...props}
    >
      {isLoading ? loadingFallback : children}
    </ErrorBoundary>
  );
};

export { ErrorBoundary, ComponentErrorBoundary, AsyncBoundary };

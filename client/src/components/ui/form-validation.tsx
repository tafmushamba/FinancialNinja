import React from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle, HelpCircle } from 'lucide-react';

// Form field wrapper with validation state
interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  htmlFor?: string;
  description?: string;
  error?: string;
  success?: string;
  required?: boolean;
  optional?: boolean;
  children: React.ReactNode;
}

function FormField({
  label,
  htmlFor,
  description,
  error,
  success,
  required = false,
  optional = false,
  className,
  children,
  ...props
}: FormFieldProps) {
  // Determine validation state
  const hasError = !!error;
  const hasSuccess = !!success && !hasError;
  
  return (
    <div className={cn("space-y-2", className)} {...props}>
      {label && (
        <div className="flex items-center justify-between">
          <label 
            htmlFor={htmlFor}
            className={cn(
              "text-sm font-medium",
              hasError ? "text-red-400" : "text-white/90"
            )}
          >
            {label}
            {required && <span className="ml-1 text-red-400">*</span>}
            {optional && <span className="ml-1 text-white/50 text-xs">(optional)</span>}
          </label>
        </div>
      )}
      
      {description && (
        <p className="text-xs text-white/60">{description}</p>
      )}
      
      <div className="relative">
        {children}
        
        {/* Validation icon */}
        {(hasError || hasSuccess) && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            {hasError && <AlertCircle className="h-4 w-4 text-red-400" />}
            {hasSuccess && <CheckCircle className="h-4 w-4 text-[#9FEF00]" />}
          </div>
        )}
      </div>
      
      {/* Error or success message */}
      {hasError && (
        <p className="text-xs text-red-400 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      )}
      
      {hasSuccess && (
        <p className="text-xs text-[#9FEF00] flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          {success}
        </p>
      )}
    </div>
  );
}

// Password strength indicator
interface PasswordStrengthProps {
  password: string;
  className?: string;
}

function PasswordStrength({ password, className }: PasswordStrengthProps) {
  // Calculate password strength
  const getStrength = (password: string): number => {
    if (!password) return 0;
    
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;
    
    // Character variety checks
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    // Cap at 5
    return Math.min(5, strength);
  };
  
  const strength = getStrength(password);
  
  // Labels and colors based on strength
  const getLabel = (strength: number): string => {
    switch (strength) {
      case 0: return "Very Weak";
      case 1: return "Weak";
      case 2: return "Fair";
      case 3: return "Good";
      case 4: return "Strong";
      case 5: return "Very Strong";
      default: return "";
    }
  };
  
  const getColor = (strength: number): string => {
    switch (strength) {
      case 0: return "bg-red-900/50";
      case 1: return "bg-red-600/50";
      case 2: return "bg-yellow-600/50";
      case 3: return "bg-yellow-500/50";
      case 4: return "bg-[#9FEF00]/50";
      case 5: return "bg-[#9FEF00]/80";
      default: return "bg-transparent";
    }
  };
  
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex gap-1 h-1">
        {[1, 2, 3, 4, 5].map((level) => (
          <div 
            key={level}
            className={cn(
              "h-full flex-1 rounded-sm transition-colors",
              level <= strength ? getColor(strength) : "bg-white/10"
            )}
          />
        ))}
      </div>
      
      {password && (
        <p className={cn(
          "text-xs flex items-center gap-1",
          strength <= 1 ? "text-red-400" : 
          strength <= 3 ? "text-yellow-400" : 
          "text-[#9FEF00]"
        )}>
          {getLabel(strength)}
        </p>
      )}
    </div>
  );
}

// Input character counter
interface CharacterCounterProps {
  value: string;
  maxLength?: number;
  className?: string;
  showWarning?: boolean;
  warningThreshold?: number; // percentage of max length when warning appears
}

function CharacterCounter({
  value,
  maxLength,
  className,
  showWarning = true,
  warningThreshold = 90,
}: CharacterCounterProps) {
  if (!maxLength) return null;
  
  const charCount = value.length;
  const percentage = (charCount / maxLength) * 100;
  const isWarning = showWarning && percentage >= warningThreshold;
  const isExceeding = charCount > maxLength;
  
  return (
    <div className={cn(
      "flex items-center justify-end text-xs",
      isExceeding ? "text-red-400" : 
      isWarning ? "text-yellow-400" : 
      "text-white/50",
      className
    )}>
      <span>{charCount}</span>
      <span className="mx-0.5">/</span>
      <span>{maxLength}</span>
    </div>
  );
}

// Form section with title and description
interface FormSectionProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

function FormSection({
  title,
  description,
  children,
  className,
}: FormSectionProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {(title || description) && (
        <div className="space-y-1">
          {title && (
            <h3 className="text-lg font-medium text-white">{title}</h3>
          )}
          {description && (
            <p className="text-sm text-white/70">{description}</p>
          )}
        </div>
      )}
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}

// Form help tooltip
interface FormHelpProps {
  content: React.ReactNode;
  position?: 'top' | 'right' | 'bottom' | 'left';
  className?: string;
}

function FormHelp({
  content,
  position = 'top',
  className,
}: FormHelpProps) {
  const [isVisible, setIsVisible] = React.useState(false);
  
  // Position classes
  const positionClasses = {
    top: "bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 mb-2",
    right: "left-full top-1/2 transform -translate-y-1/2 translate-x-2 ml-2",
    bottom: "top-full left-1/2 transform -translate-x-1/2 translate-y-2 mt-2",
    left: "right-full top-1/2 transform -translate-y-1/2 -translate-x-2 mr-2",
  };
  
  return (
    <div 
      className={cn("relative inline-block", className)}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      <button
        type="button"
        className="text-white/60 hover:text-white/90 transition-colors"
        aria-label="Help"
      >
        <HelpCircle className="h-4 w-4" />
      </button>
      
      {isVisible && (
        <div 
          className={cn(
            "absolute z-50 w-64 p-3 text-xs rounded bg-black/80 text-white backdrop-blur-sm shadow-lg border border-white/10",
            positionClasses[position]
          )}
          role="tooltip"
        >
          {content}
        </div>
      )}
    </div>
  );
}

export {
  FormField,
  PasswordStrength,
  CharacterCounter,
  FormSection,
  FormHelp,
};

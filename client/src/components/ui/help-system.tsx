import React, { createContext, useContext, useState } from 'react';
import { HelpCircle, X, ChevronRight, ExternalLink, Terminal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Guidance } from '@/components/ui/guidance';
import { Shortcut, ShortcutsList, commonShortcuts } from '@/components/ui/keyboard-shortcuts';

// Help context type
type HelpContextType = {
  openHelp: (sectionId?: string) => void;
  closeHelp: () => void;
  isHelpOpen: boolean;
  currentSection: string | null;
};

// Create help context
const HelpContext = createContext<HelpContextType>({
  openHelp: () => {},
  closeHelp: () => {},
  isHelpOpen: false,
  currentSection: null,
});

// Help provider props
interface HelpProviderProps {
  children: React.ReactNode;
  sections?: HelpSection[];
}

// Help section type
export interface HelpSection {
  id: string;
  title: string;
  description?: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
}

/**
 * Help Provider Component
 * Provides a context for showing contextual help throughout the application
 */
export function HelpProvider({ children, sections = [] }: HelpProviderProps) {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState<string | null>(null);

  // Default sections
  const defaultSections: HelpSection[] = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      description: 'Learn the basics of using FinancialNinja',
      icon: <Terminal className="h-5 w-5 text-[#9FEF00]" />,
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white">Welcome to FinancialNinja</h3>
          <p className="text-white/70">
            FinancialNinja is your personal finance management tool designed to help you track, 
            analyze, and optimize your financial life. Here's how to get started:
          </p>
          
          <div className="space-y-4 mt-6">
            <div className="space-y-2">
              <h4 className="text-md font-medium text-[#9FEF00] flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#9FEF00]/10 text-[#9FEF00] text-sm">1</span>
                Connect Your Accounts
              </h4>
              <p className="text-white/70 pl-8">
                Start by connecting your bank accounts, credit cards, and investment accounts to get a complete picture of your finances.
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-md font-medium text-[#9FEF00] flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#9FEF00]/10 text-[#9FEF00] text-sm">2</span>
                Set Up Your Budget
              </h4>
              <p className="text-white/70 pl-8">
                Create a budget to track your spending by category and set financial goals.
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-md font-medium text-[#9FEF00] flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#9FEF00]/10 text-[#9FEF00] text-sm">3</span>
                Track Your Transactions
              </h4>
              <p className="text-white/70 pl-8">
                Review and categorize your transactions to understand your spending patterns.
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-md font-medium text-[#9FEF00] flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#9FEF00]/10 text-[#9FEF00] text-sm">4</span>
                Analyze Your Finances
              </h4>
              <p className="text-white/70 pl-8">
                Use the dashboard and reports to gain insights into your financial health.
              </p>
            </div>
          </div>
          
          <Guidance
            variant="tip"
            title="Pro Tip"
            className="mt-6"
          >
            Use keyboard shortcuts to navigate quickly. Press <code>?</code> at any time to see available shortcuts.
          </Guidance>
        </div>
      ),
    },
    {
      id: 'keyboard-shortcuts',
      title: 'Keyboard Shortcuts',
      description: 'Learn keyboard shortcuts to boost your productivity',
      content: (
        <div className="space-y-4">
          <p className="text-white/70">
            FinancialNinja supports keyboard shortcuts to help you navigate and perform actions quickly.
          </p>
          
          <ShortcutsList shortcuts={commonShortcuts} />
          
          <Guidance
            variant="info"
            title="Tip"
            className="mt-4"
          >
            Press <Shortcut keys={["?"]} /> anywhere in the application to open this shortcuts reference.
          </Guidance>
        </div>
      ),
    },
    {
      id: 'ai-assistant',
      title: 'AI Assistant',
      description: 'Learn how to use the AI financial assistant',
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white">Using the AI Financial Assistant</h3>
          <p className="text-white/70">
            FinancialNinja includes an AI-powered financial assistant to help you with financial questions and insights.
          </p>
          
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <h4 className="text-md font-medium text-[#9FEF00]">What You Can Ask</h4>
              <ul className="list-disc pl-5 text-white/70 space-y-1">
                <li>Questions about your spending patterns</li>
                <li>Help with budgeting and financial planning</li>
                <li>Explanations of financial terms and concepts</li>
                <li>Recommendations for saving money</li>
                <li>Insights about your investment portfolio</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-md font-medium text-[#9FEF00]">Example Questions</h4>
              <ul className="list-disc pl-5 text-white/70 space-y-1">
                <li>"How much did I spend on dining last month?"</li>
                <li>"What's my current savings rate?"</li>
                <li>"How can I reduce my monthly expenses?"</li>
                <li>"Explain what a Roth IRA is"</li>
                <li>"What's the difference between stocks and bonds?"</li>
              </ul>
            </div>
          </div>
          
          <Guidance
            variant="info"
            title="Privacy Note"
            className="mt-4"
          >
            Your financial data is processed securely. The AI assistant uses the Mistral API with strict privacy controls in place.
          </Guidance>
        </div>
      ),
    },
  ];

  // Combine default sections with custom sections
  const allSections = [...defaultSections, ...sections];

  // Open help dialog with optional section ID
  const openHelp = (sectionId?: string) => {
    if (sectionId) {
      setCurrentSection(sectionId);
    } else if (allSections.length > 0 && !currentSection) {
      setCurrentSection(allSections[0].id);
    }
    setIsHelpOpen(true);
  };

  // Close help dialog
  const closeHelp = () => {
    setIsHelpOpen(false);
  };

  // Find current section object
  const getCurrentSection = () => {
    return allSections.find(section => section.id === currentSection) || null;
  };

  return (
    <HelpContext.Provider value={{ openHelp, closeHelp, isHelpOpen, currentSection }}>
      {children}
      
      <Dialog open={isHelpOpen} onOpenChange={setIsHelpOpen}>
        <DialogContent className="sm:max-w-[900px] p-0 gap-0 bg-black/90 backdrop-blur-md border-white/10">
          <DialogHeader className="p-6 pb-0">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-[#9FEF00]" />
                <span>Help & Documentation</span>
              </DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={closeHelp}
                className="h-8 w-8 text-white/70 hover:text-white"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
          </DialogHeader>
          
          <div className="flex h-[600px] overflow-hidden">
            {/* Sidebar */}
            <div className="w-64 border-r border-white/10 p-4">
              <div className="space-y-1">
                {allSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setCurrentSection(section.id)}
                    className={cn(
                      "w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors",
                      currentSection === section.id
                        ? "bg-[#9FEF00]/10 text-[#9FEF00] border border-[#9FEF00]/20"
                        : "text-white/70 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    {section.icon || <ChevronRight className="h-4 w-4" />}
                    <span>{section.title}</span>
                  </button>
                ))}
              </div>
              
              <div className="mt-8 pt-4 border-t border-white/10">
                <a
                  href="https://docs.financialninja.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 text-sm text-white/70 hover:text-white rounded-md transition-colors hover:bg-white/5"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Full Documentation</span>
                </a>
              </div>
            </div>
            
            {/* Content */}
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full p-6">
                {getCurrentSection()?.content}
              </ScrollArea>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </HelpContext.Provider>
  );
}

// Hook to use help context
export const useHelp = () => {
  const context = useContext(HelpContext);
  
  if (context === undefined) {
    throw new Error('useHelp must be used within a HelpProvider');
  }
  
  return context;
};

// Help button component
interface HelpButtonProps {
  sectionId?: string;
  className?: string;
  variant?: 'icon' | 'text' | 'full';
  size?: 'sm' | 'md' | 'lg';
}

export function HelpButton({
  sectionId,
  className,
  variant = 'icon',
  size = 'md',
}: HelpButtonProps) {
  const { openHelp } = useHelp();
  
  // Size classes
  const sizeClasses = {
    sm: variant === 'icon' ? 'h-7 w-7' : 'h-7 px-2 text-xs',
    md: variant === 'icon' ? 'h-9 w-9' : 'h-9 px-3 text-sm',
    lg: variant === 'icon' ? 'h-10 w-10' : 'h-10 px-4 text-base',
  };
  
  // Render based on variant
  if (variant === 'icon') {
    return (
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => openHelp(sectionId)}
        className={cn(
          "rounded-full text-white/70 hover:text-[#9FEF00] hover:bg-[#9FEF00]/10",
          sizeClasses[size],
          className
        )}
        aria-label="Help"
      >
        <HelpCircle className={cn(
          size === 'sm' ? 'h-4 w-4' : size === 'md' ? 'h-5 w-5' : 'h-6 w-6'
        )} />
      </Button>
    );
  }
  
  if (variant === 'text') {
    return (
      <Button
        type="button"
        variant="ghost"
        onClick={() => openHelp(sectionId)}
        className={cn(
          "text-white/70 hover:text-[#9FEF00] hover:bg-[#9FEF00]/10",
          sizeClasses[size],
          className
        )}
      >
        <HelpCircle className="mr-2 h-4 w-4" />
        Help
      </Button>
    );
  }
  
  return (
    <Button
      type="button"
      variant="outline"
      onClick={() => openHelp(sectionId)}
      className={cn(
        "border-white/10 text-white hover:bg-[#9FEF00]/10 hover:text-[#9FEF00] hover:border-[#9FEF00]/30",
        sizeClasses[size],
        className
      )}
    >
      <HelpCircle className="mr-2 h-4 w-4" />
      Help & Documentation
    </Button>
  );
}

// Contextual help tooltip
interface ContextualHelpProps {
  children: React.ReactNode;
  content: React.ReactNode;
  sectionId?: string;
  position?: 'top' | 'right' | 'bottom' | 'left';
  className?: string;
  iconClassName?: string;
}

export function ContextualHelp({
  children,
  content,
  sectionId,
  position = 'top',
  className,
  iconClassName,
}: ContextualHelpProps) {
  const { openHelp } = useHelp();
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  
  // Position classes
  const positionClasses = {
    top: "bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 mb-2",
    right: "left-full top-1/2 transform -translate-y-1/2 translate-x-2 ml-2",
    bottom: "top-full left-1/2 transform -translate-x-1/2 translate-y-2 mt-2",
    left: "right-full top-1/2 transform -translate-y-1/2 -translate-x-2 mr-2",
  };
  
  return (
    <div className={cn("relative inline-flex items-center group", className)}>
      {children}
      
      <button
        type="button"
        className={cn(
          "ml-1 text-white/40 hover:text-white/70 focus:text-white/70 transition-colors",
          "group-hover:text-white/60",
          iconClassName
        )}
        onMouseEnter={() => setIsTooltipVisible(true)}
        onMouseLeave={() => setIsTooltipVisible(false)}
        onFocus={() => setIsTooltipVisible(true)}
        onBlur={() => setIsTooltipVisible(false)}
        onClick={() => sectionId && openHelp(sectionId)}
        aria-label="Help"
      >
        <HelpCircle className="h-3.5 w-3.5" />
      </button>
      
      {isTooltipVisible && (
        <div 
          className={cn(
            "absolute z-50 w-64 p-3 text-xs rounded bg-black/90 text-white backdrop-blur-sm shadow-lg border border-white/10",
            positionClasses[position]
          )}
          role="tooltip"
        >
          <div className="space-y-2">
            {content}
            
            {sectionId && (
              <button
                type="button"
                onClick={() => openHelp(sectionId)}
                className="mt-2 text-[#9FEF00] hover:underline flex items-center gap-1 text-xs"
              >
                <span>Learn more</span>
                <ChevronRight className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Feature tour step
export interface TourStep {
  id: string;
  title: string;
  content: React.ReactNode;
  targetSelector: string;
  position?: 'top' | 'right' | 'bottom' | 'left';
}

// Feature tour component
interface FeatureTourProps {
  steps: TourStep[];
  isOpen: boolean;
  onClose: () => void;
  currentStep: number;
  onNextStep: () => void;
  onPrevStep: () => void;
  onFinish: () => void;
}

export function FeatureTour({
  steps,
  isOpen,
  onClose,
  currentStep,
  onNextStep,
  onPrevStep,
  onFinish,
}: FeatureTourProps) {
  if (!isOpen) return null;
  
  const step = steps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;
  
  // Position classes
  const positionClasses = {
    top: "bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 mb-2",
    right: "left-full top-1/2 transform -translate-y-1/2 translate-x-2 ml-2",
    bottom: "top-full left-1/2 transform -translate-x-1/2 translate-y-2 mt-2",
    left: "right-full top-1/2 transform -translate-y-1/2 -translate-x-2 mr-2",
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative">
        {/* Tour step */}
        <div 
          className={cn(
            "absolute z-50 w-80 p-4 rounded-lg bg-black/90 text-white backdrop-blur-sm shadow-lg border border-[#9FEF00]/20",
            step.position ? positionClasses[step.position] : positionClasses.bottom
          )}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-[#9FEF00]">{step.title}</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-6 w-6 text-white/50 hover:text-white"
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
            
            <div className="text-xs text-white/80">
              {step.content}
            </div>
            
            <div className="flex items-center justify-between pt-2">
              <div className="text-xs text-white/50">
                Step {currentStep + 1} of {steps.length}
              </div>
              
              <div className="flex gap-2">
                {!isFirstStep && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onPrevStep}
                    className="h-7 px-2 text-xs text-white/70 hover:text-white"
                  >
                    Previous
                  </Button>
                )}
                
                {isLastStep ? (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={onFinish}
                    className="h-7 px-3 text-xs bg-[#9FEF00] text-black hover:bg-[#9FEF00]/90"
                  >
                    Finish
                  </Button>
                ) : (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={onNextStep}
                    className="h-7 px-3 text-xs bg-[#9FEF00] text-black hover:bg-[#9FEF00]/90"
                  >
                    Next
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { HelpContext };

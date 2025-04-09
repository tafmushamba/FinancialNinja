import React from 'react';
import { cn } from '@/lib/utils';
import { 
  Command, 
  Keyboard, 
  MousePointerClick, 
  ArrowUp, 
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Plus,
  Minus,
  X,
  Save,
  Search,
  Undo,
  Redo,
  Copy,
  Clipboard,
  Trash,
  RefreshCw,
  HelpCircle
} from 'lucide-react';

// Keyboard key component
interface KeyProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

function Key({
  children,
  className,
  size = 'md',
  ...props
}: KeyProps) {
  const sizeClasses = {
    sm: 'min-w-[1.5rem] h-6 text-xs px-1',
    md: 'min-w-[1.75rem] h-7 text-sm px-1.5',
    lg: 'min-w-[2rem] h-8 text-base px-2',
  };
  
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center font-mono rounded border border-[#9FEF00]/30 bg-black/50 text-[#9FEF00]',
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

// Keyboard shortcut component
interface ShortcutProps extends React.HTMLAttributes<HTMLDivElement> {
  keys: string[];
  description?: string;
  size?: 'sm' | 'md' | 'lg';
  iconMap?: Record<string, React.ReactNode>;
}

function Shortcut({
  keys,
  description,
  className,
  size = 'md',
  iconMap,
  ...props
}: ShortcutProps) {
  // Default icon map for common keys
  const defaultIconMap: Record<string, React.ReactNode> = {
    'cmd': <Command className="h-3 w-3" />,
    'ctrl': <Keyboard className="h-3 w-3" />,
    'alt': <span className="text-xs">⌥</span>,
    'shift': <span className="text-xs">⇧</span>,
    'enter': <span className="text-xs">↵</span>,
    'tab': <span className="text-xs">↹</span>,
    'esc': <span className="text-xs">⎋</span>,
    'space': <span className="text-xs">␣</span>,
    'up': <ArrowUp className="h-3 w-3" />,
    'down': <ArrowDown className="h-3 w-3" />,
    'left': <ArrowLeft className="h-3 w-3" />,
    'right': <ArrowRight className="h-3 w-3" />,
    '+': <Plus className="h-3 w-3" />,
    '-': <Minus className="h-3 w-3" />,
    'x': <X className="h-3 w-3" />,
    's': <Save className="h-3 w-3" />,
    'f': <Search className="h-3 w-3" />,
    'z': <Undo className="h-3 w-3" />,
    'y': <Redo className="h-3 w-3" />,
    'c': <Copy className="h-3 w-3" />,
    'v': <Clipboard className="h-3 w-3" />,
    'd': <Trash className="h-3 w-3" />,
    'r': <RefreshCw className="h-3 w-3" />,
    '?': <HelpCircle className="h-3 w-3" />,
    'click': <MousePointerClick className="h-3 w-3" />,
  };
  
  // Merge default icon map with custom icon map
  const mergedIconMap = { ...defaultIconMap, ...(iconMap || {}) };
  
  // Format key for display
  const formatKey = (key: string): React.ReactNode => {
    // Check if there's an icon for this key
    if (mergedIconMap[key.toLowerCase()]) {
      return mergedIconMap[key.toLowerCase()];
    }
    
    // Otherwise just return the key text
    return key;
  };
  
  return (
    <div 
      className={cn(
        "flex items-center gap-2",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-1">
        {keys.map((key, index) => (
          <React.Fragment key={index}>
            <Key size={size}>{formatKey(key)}</Key>
            {index < keys.length - 1 && (
              <span className="text-[#9FEF00]/50">+</span>
            )}
          </React.Fragment>
        ))}
      </div>
      
      {description && (
        <span className="text-sm text-white/70">{description}</span>
      )}
    </div>
  );
}

// Keyboard shortcuts help dialog content
interface ShortcutsListProps {
  shortcuts: Array<{
    category: string;
    items: Array<{
      keys: string[];
      description: string;
    }>;
  }>;
  className?: string;
}

function ShortcutsList({
  shortcuts,
  className,
}: ShortcutsListProps) {
  return (
    <div className={cn("space-y-6", className)}>
      {shortcuts.map((category) => (
        <div key={category.category} className="space-y-3">
          <h3 className="text-sm font-medium text-white/90">{category.category}</h3>
          <div className="space-y-2">
            {category.items.map((item, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between py-1 border-b border-white/10"
              >
                <span className="text-sm text-white/70">{item.description}</span>
                <Shortcut keys={item.keys} size="sm" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// Keyboard shortcut tooltip
interface ShortcutTooltipProps {
  keys: string[];
  children: React.ReactNode;
  position?: 'top' | 'right' | 'bottom' | 'left';
  size?: 'sm' | 'md' | 'lg';
}

function ShortcutTooltip({
  keys,
  children,
  position = 'top',
  size = 'sm',
}: ShortcutTooltipProps) {
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
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      
      {isVisible && (
        <div 
          className={cn(
            "absolute z-50 px-2 py-1 rounded bg-black/90 border border-[#9FEF00]/20 backdrop-blur-sm shadow-lg",
            positionClasses[position]
          )}
        >
          <Shortcut keys={keys} size={size} />
        </div>
      )}
    </div>
  );
}

// Common application shortcuts
const commonShortcuts = [
  {
    category: "Navigation",
    items: [
      { keys: ["?"], description: "Show keyboard shortcuts" },
      { keys: ["g", "h"], description: "Go to Home" },
      { keys: ["g", "d"], description: "Go to Dashboard" },
      { keys: ["g", "t"], description: "Go to Transactions" },
      { keys: ["g", "b"], description: "Go to Budget" },
      { keys: ["g", "i"], description: "Go to Investments" },
      { keys: ["g", "s"], description: "Go to Settings" },
    ],
  },
  {
    category: "Actions",
    items: [
      { keys: ["ctrl", "s"], description: "Save changes" },
      { keys: ["ctrl", "n"], description: "New item" },
      { keys: ["ctrl", "f"], description: "Search" },
      { keys: ["esc"], description: "Close modal or cancel" },
      { keys: ["ctrl", "z"], description: "Undo" },
      { keys: ["ctrl", "shift", "z"], description: "Redo" },
    ],
  },
  {
    category: "Data",
    items: [
      { keys: ["r"], description: "Refresh data" },
      { keys: ["ctrl", "e"], description: "Export data" },
      { keys: ["ctrl", "i"], description: "Import data" },
      { keys: ["ctrl", "d"], description: "Delete selected" },
    ],
  },
];

export {
  Key,
  Shortcut,
  ShortcutsList,
  ShortcutTooltip,
  commonShortcuts,
};

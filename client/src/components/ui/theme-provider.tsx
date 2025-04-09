import React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';

// Define theme types
type Theme = 'dark' | 'terminal' | 'system';

// Define theme context type
type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

// Create theme context
const ThemeProviderContext = createContext<ThemeProviderState | undefined>(undefined);

// Theme provider component
export function ThemeProvider({
  children,
  defaultTheme = 'terminal',
  storageKey = 'financial-ninja-ui-theme',
  ...props
}: ThemeProviderProps) {
  // Initialize theme state from localStorage or default
  const [theme, setTheme] = useState<Theme>(() => {
    // Try to get theme from localStorage
    const storedTheme = typeof window !== 'undefined' && localStorage.getItem(storageKey);
    
    // Check if it's a valid theme
    if (storedTheme && (storedTheme === 'dark' || storedTheme === 'terminal' || storedTheme === 'system')) {
      return storedTheme as Theme;
    }
    
    // Otherwise use default theme
    return defaultTheme;
  });

  // Update localStorage when theme changes
  useEffect(() => {
    localStorage.setItem(storageKey, theme);
    
    // Apply theme to document
    const root = window.document.documentElement;
    
    // Remove all theme classes
    root.classList.remove('dark', 'terminal');
    
    // Add appropriate theme class
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      if (systemTheme === 'dark') {
        root.classList.add('dark');
      }
    } else {
      root.classList.add(theme);
    }
    
    // Add terminal-specific styles
    if (theme === 'terminal') {
      // Add terminal-specific CSS variables
      root.style.setProperty('--terminal-green', '#9FEF00');
      root.style.setProperty('--terminal-green-dim', 'rgba(159, 239, 0, 0.5)');
      root.style.setProperty('--terminal-background', '#0D1117');
      root.style.setProperty('--terminal-foreground', '#F0F6FC');
      
      // Apply terminal-specific font
      root.style.fontFamily = "'JetBrains Mono', monospace";
      
      // Add terminal cursor style
      const style = document.createElement('style');
      style.id = 'terminal-cursor-style';
      style.innerHTML = `
        * {
          cursor: default;
        }
        a, button, [role="button"], input, select, textarea {
          cursor: pointer;
        }
        input, textarea {
          caret-color: var(--terminal-green);
        }
        ::selection {
          background-color: var(--terminal-green-dim);
          color: white;
        }
      `;
      
      // Remove existing style if it exists
      const existingStyle = document.getElementById('terminal-cursor-style');
      if (existingStyle) {
        existingStyle.remove();
      }
      
      // Add the style to the document
      document.head.appendChild(style);
    } else {
      // Remove terminal-specific styles
      const terminalStyle = document.getElementById('terminal-cursor-style');
      if (terminalStyle) {
        terminalStyle.remove();
      }
      
      // Reset terminal-specific CSS variables
      root.style.removeProperty('--terminal-green');
      root.style.removeProperty('--terminal-green-dim');
      root.style.removeProperty('--terminal-background');
      root.style.removeProperty('--terminal-foreground');
      
      // Reset font family
      root.style.removeProperty('font-family');
    }
  }, [theme, storageKey]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Define handler for theme change
    const handleChange = () => {
      if (theme === 'system') {
        const root = window.document.documentElement;
        root.classList.toggle('dark', mediaQuery.matches);
      }
    };
    
    // Add event listener
    mediaQuery.addEventListener('change', handleChange);
    
    // Initial call
    handleChange();
    
    // Cleanup
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  // Create context value
  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      setTheme(newTheme);
    },
  };

  // Return provider
  return (
    <ThemeProviderContext.Provider value={value} {...props}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

// Hook to use theme context
export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};

// Theme toggle component
interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  
  // Toggle between themes
  const toggleTheme = () => {
    if (theme === 'dark') {
      setTheme('terminal');
    } else if (theme === 'terminal') {
      setTheme('system');
    } else {
      setTheme('dark');
    }
  };
  
  // Get current theme label
  const getThemeLabel = () => {
    switch (theme) {
      case 'dark':
        return 'Dark';
      case 'terminal':
        return 'Terminal';
      case 'system':
        return 'System';
      default:
        return 'Theme';
    }
  };
  
  return (
    <button
      onClick={toggleTheme}
      className={className}
      aria-label={`Current theme: ${getThemeLabel()}`}
    >
      {/* Icon based on current theme */}
      {theme === 'dark' && (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      )}
      {theme === 'terminal' && (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )}
      {theme === 'system' && (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )}
    </button>
  );
}

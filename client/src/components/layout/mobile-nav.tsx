import React from 'react';
import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  GraduationCap, 
  WalletCards, 
  Gamepad2, 
  Trophy, 
  Bot, 
  Settings,
  X,
  User
} from 'lucide-react';

interface MobileNavProps {
  isOpen?: boolean;
  toggleMenu?: () => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ isOpen = false, toggleMenu }) => {
  const [location] = useLocation();

  // Check if we're on the game page to hide mobile nav
  const isFinancialGame = location.includes('financial-game');
  if (isFinancialGame) return null;

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: GraduationCap, label: 'Learn', path: '/learning-modules' },
    { icon: WalletCards, label: 'Track', path: '/finance-tracker' },
    { icon: Gamepad2, label: 'Game', path: '/financial-game' },
    { icon: Trophy, label: 'Achieve', path: '/achievements' },
    { icon: Bot, label: 'Assistant', path: '/ai-assistant' }
  ];

  // Animation variants
  const sidebarVariants = {
    open: { 
      x: 0,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30,
        when: "beforeChildren",
        staggerChildren: 0.05
      }
    },
    closed: { 
      x: "-100%",
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30,
        when: "afterChildren",
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    }
  };

  const itemVariants = {
    open: { 
      opacity: 1, 
      x: 0,
      transition: { type: "spring", stiffness: 300, damping: 30 }
    },
    closed: { 
      opacity: 0, 
      x: -20,
      transition: { type: "spring", stiffness: 300, damping: 30 }
    }
  };

  const bottomNavVariants = {
    hidden: { y: 100, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30,
        delayChildren: 0.1,
        staggerChildren: 0.05
      }
    }
  };

  const bottomNavItemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 500, damping: 30 }
    }
  };

  return (
    <>
      {/* Mobile Slide-out Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial="closed"
            animate="open"
            exit="closed"
            variants={sidebarVariants}
            className="fixed inset-0 bg-background/95 backdrop-blur-md z-50 md:hidden overflow-hidden"
          >
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center p-4 border-b border-border/30">
                <motion.h2 
                  variants={itemVariants}
                  className="text-xl font-bold text-foreground"
                >
                  Fin<span className="text-primary">Byte</span>
                </motion.h2>
                <motion.button 
                  variants={itemVariants}
                  onClick={toggleMenu}
                  className="p-2 rounded-full hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                >
                  <X size={20} />
                </motion.button>
              </div>
              
              <nav className="flex-1 overflow-y-auto p-4">
                <motion.ul className="space-y-2">
                  {navItems.map((item) => {
                    const isActive = location === item.path;
                    const Icon = item.icon;
                    
                    return (
                      <motion.li key={item.path} variants={itemVariants}>
                        <Link
                          href={item.path}
                          className={cn(
                            "flex items-center px-4 py-3 rounded-lg text-base transition-all",
                            isActive
                              ? "bg-primary/15 text-primary font-medium"
                              : "text-foreground hover:bg-primary/10 hover:text-primary"
                          )}
                          onClick={toggleMenu}
                        >
                          <Icon className="w-5 h-5 mr-3" />
                          <span>{item.label}</span>
                          {isActive && (
                            <div className="ml-auto w-1 h-4 bg-primary rounded-full" />
                          )}
                        </Link>
                      </motion.li>
                    );
                  })}
                </motion.ul>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Bottom Mobile Navigation Bar */}
      <motion.div 
        variants={bottomNavVariants}
        initial="hidden"
        animate="visible"
        className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t border-border/30 flex justify-around p-3 md:hidden z-40"
      >
        {navItems.map((item) => {
          const isActive = location === item.path;
          const Icon = item.icon;
          
          return (
            <motion.div key={item.path} variants={bottomNavItemVariants}>
              <Link
                href={item.path}
                className={cn(
                  "flex flex-col items-center px-1",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-primary"
                )}
              >
                <div className={cn(
                  "p-1 rounded-full transition-colors",
                  isActive ? "bg-primary/15" : "hover:bg-primary/10"
                )}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs mt-1 font-medium">{item.label}</span>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </>
  );
};

export default MobileNav;
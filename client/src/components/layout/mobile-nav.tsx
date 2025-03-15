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
  User,
  BrainCircuit,
  Code,
  Gift
} from 'lucide-react';

interface MobileNavProps {
  isOpen?: boolean;
  toggleMenu?: () => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ isOpen = false, toggleMenu }) => {
  const [location] = useLocation();

  // Check if we're on the game page to hide mobile nav
  const isFinancialGame = location === '/financial-game';
  if (isFinancialGame) return null;

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: GraduationCap, label: 'Learn', path: '/learning-modules' },
    { icon: WalletCards, label: 'Track', path: '/finance-tracker' },
    { icon: Gamepad2, label: 'Game', path: '/financial-game' },
    { icon: Trophy, label: 'Achieve', path: '/achievements' },
    { icon: Gift, label: 'Rewards', path: '/rewards' },
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
            className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 md:hidden overflow-hidden"
          >
            {/* Animated background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
              <div className="absolute inset-0 grid grid-cols-[repeat(10,1fr)] grid-rows-[repeat(20,1fr)]">
                {Array.from({ length: 200 }).map((_, i) => (
                  <div 
                    key={i} 
                    className="border-r border-b border-[#9FEF00]/10" 
                    style={{ 
                      animation: `pulse ${Math.random() * 4 + 3}s infinite ${Math.random() * 5}s ease-in-out`,
                      opacity: Math.random() * 0.3
                    }}
                  />
                ))}
              </div>
              
              {/* Floating points */}
              <div className="absolute h-1 w-1 rounded-full bg-[#9FEF00] shadow-[0_0_5px_#9FEF00] animate-float1" style={{ top: '15%', left: '25%' }}></div>
              <div className="absolute h-1 w-1 rounded-full bg-[#9FEF00] shadow-[0_0_5px_#9FEF00] animate-float2" style={{ top: '35%', left: '65%' }}></div>
              <div className="absolute h-1 w-1 rounded-full bg-[#9FEF00] shadow-[0_0_5px_#9FEF00] animate-float3" style={{ top: '65%', left: '45%' }}></div>
              <div className="absolute h-1 w-1 rounded-full bg-[#9FEF00] shadow-[0_0_5px_#9FEF00] animate-float4" style={{ top: '85%', left: '15%' }}></div>
              
              <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/80"></div>
            </div>
            
            <div className="flex flex-col h-full relative z-10">
              <div className="flex justify-between items-center p-4 border-b border-[#9FEF00]/20">
                <motion.div 
                  variants={itemVariants}
                  className="flex items-center"
                >
                  <BrainCircuit className="h-5 w-5 text-[#9FEF00] mr-2" />
                  <h2 className="text-xl font-mono font-bold text-white">
                    Money<span className="text-[#9FEF00]">Mind</span>
                  </h2>
                </motion.div>
                <motion.button 
                  variants={itemVariants}
                  onClick={toggleMenu}
                  className="p-2 rounded-full hover:bg-[#9FEF00]/10 text-white/70 hover:text-[#9FEF00] transition-colors"
                >
                  <X size={20} />
                </motion.button>
              </div>
              
              <nav className="flex-1 overflow-y-auto p-4">
                <motion.div
                  variants={itemVariants}
                  className="mb-6 mt-2 px-3"
                >
                  <div className="flex items-center text-xs text-[#9FEF00]/70 mb-2 font-mono">
                    <Code className="h-3 w-3 mr-1" />
                    <span>NAVIGATION</span>
                  </div>
                  <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-[#9FEF00]/30 to-transparent"></div>
                </motion.div>
                
                <motion.ul className="space-y-2">
                  {navItems.map((item) => {
                    const isActive = location === item.path;
                    const Icon = item.icon;
                    
                    return (
                      <motion.li key={item.path} variants={itemVariants}>
                        <Link
                          href={item.path}
                          className={cn(
                            "flex items-center px-4 py-3 rounded-lg text-base transition-all relative group overflow-hidden",
                            isActive
                              ? "bg-[#9FEF00]/10 text-[#9FEF00] font-medium"
                              : "text-white hover:bg-[#9FEF00]/5 hover:text-[#9FEF00]"
                          )}
                          onClick={toggleMenu}
                        >
                          {/* Background glow effect */}
                          <div className={cn(
                            "absolute inset-0 bg-gradient-to-r from-[#9FEF00]/0 via-[#9FEF00]/5 to-[#9FEF00]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                            isActive ? "opacity-50" : ""
                          )} />
                          
                          <Icon className={cn(
                            "w-5 h-5 mr-3 relative z-10",
                            isActive ? "text-[#9FEF00]" : "text-white/70 group-hover:text-[#9FEF00]/70"
                          )} />
                          <span className="relative z-10 font-mono">{item.label}</span>
                          
                          {isActive && (
                            <>
                              <div className="ml-auto w-1 h-4 bg-[#9FEF00] rounded-full shadow-[0_0_8px_rgba(159,239,0,0.8)] relative z-10" />
                              <div className="absolute left-0 inset-y-0 w-1 bg-[#9FEF00] rounded-r-sm shadow-[0_0_10px_rgba(159,239,0,0.5)]" />
                            </>
                          )}
                        </Link>
                      </motion.li>
                    );
                  })}
                </motion.ul>
              </nav>
              
              <div className="p-4 border-t border-[#9FEF00]/20 bg-black/50 text-center">
                <div className="text-xs text-white/50 font-mono">
                  <span className="text-[#9FEF00]">&gt;</span> SESSION <span className="text-[#9FEF00]">ACTIVE</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Bottom Mobile Navigation Bar */}
      <motion.div 
        variants={bottomNavVariants}
        initial="hidden"
        animate="visible"
        className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-md border-t border-[#9FEF00]/20 flex justify-around p-3 md:hidden z-40 relative overflow-hidden"
      >
        {/* Grid background for bottom nav */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          <div className="absolute inset-0 grid grid-cols-[repeat(6,1fr)] grid-rows-[repeat(1,1fr)]">
            {Array.from({ length: 6 }).map((_, i) => (
              <div 
                key={i} 
                className="border-r border-[#9FEF00]/10" 
                style={{ 
                  animation: `pulse ${Math.random() * 4 + 3}s infinite ${Math.random() * 5}s ease-in-out`,
                  opacity: Math.random() * 0.3
                }}
              />
            ))}
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-transparent"></div>
        </div>
        
        {navItems.map((item) => {
          const isActive = location === item.path;
          const Icon = item.icon;
          
          return (
            <motion.div key={item.path} variants={bottomNavItemVariants} className="relative z-10">
              <Link
                href={item.path}
                className={cn(
                  "flex flex-col items-center px-1",
                  isActive
                    ? "text-[#9FEF00]"
                    : "text-white/70 hover:text-[#9FEF00]"
                )}
              >
                <div className={cn(
                  "p-1.5 rounded-full transition-colors relative",
                  isActive ? "bg-[#9FEF00]/10 shadow-[0_0_10px_rgba(159,239,0,0.3)]" : "hover:bg-[#9FEF00]/5"
                )}>
                  <Icon className="w-5 h-5" />
                  {isActive && (
                    <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-[#9FEF00] shadow-[0_0_5px_#9FEF00]"></span>
                  )}
                </div>
                <span className="text-xs mt-1 font-mono tracking-wide">{item.label}</span>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </>
  );
};

export default MobileNav;
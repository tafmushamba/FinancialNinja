import React from 'react';
import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { 
  Home, 
  GraduationCap, 
  WalletCards, 
  Gamepad2, 
  Trophy, 
  Bot, 
  Settings,
  ChevronRight 
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface SidebarProps {
  collapsed?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed = false }) => {
  const [location] = useLocation();
  const { user } = useAuth();

  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: GraduationCap, label: 'Learning Modules', path: '/learning-modules' },
    { icon: WalletCards, label: 'Finance Tracker', path: '/finance-tracker' },
    { icon: Gamepad2, label: 'Financial Game', path: '/financial-game' },
    { icon: Trophy, label: 'Achievements', path: '/achievements' },
    { icon: Bot, label: 'AI Assistant', path: '/ai-assistant' },
    { icon: Settings, label: 'Settings', path: '/settings' }
  ];

  const getUserInitials = () => {
    if (!user) return '?';
    
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`;
    } else if (user.username) {
      return user.username[0].toUpperCase();
    }
    
    return '?';
  };

  // Staggered animation for sidebar items
  const sidebar = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      }
    }
  };

  const navItem = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <aside className="w-full h-full bg-card/70 overflow-hidden z-30 backdrop-blur-sm border-r border-border/30">
      <div className="h-full flex flex-col">
        {/* Logo */}
        <div className="p-4 flex items-center justify-center lg:justify-start border-b border-border/30">
          <div className="w-9 h-9 flex items-center justify-center rounded-md bg-primary/20">
            <ChevronRight className="text-primary h-4 w-4" />
          </div>
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className={cn("ml-3 text-xl font-bold", collapsed ? "hidden" : "hidden lg:block")}
          >
            Fin<span className="text-primary">Byte</span>
          </motion.h1>
        </div>
        
        {/* Navigation */}
        <motion.nav 
          className="flex-1 py-4 overflow-y-auto px-2"
          variants={sidebar}
          initial="hidden"
          animate="show"
        >
          <ul className="space-y-1">
            {navItems.map((item, index) => {
              const isActive = location === item.path;
              const Icon = item.icon;
              
              return (
                <motion.li 
                  key={item.path}
                  variants={navItem}
                  custom={index}
                >
                  <Link 
                    href={item.path}
                    className={cn(
                      "flex items-center py-2 px-3 rounded-lg transition-all duration-200",
                      isActive
                        ? "bg-primary/15 text-primary font-medium"
                        : "text-foreground hover:bg-primary/10 hover:text-primary"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span className={cn("ml-3 text-sm", collapsed ? "hidden" : "hidden lg:block")}>
                      {item.label}
                    </span>
                    {isActive && !collapsed && (
                      <div className="ml-auto w-1 h-4 bg-primary rounded-full" />
                    )}
                  </Link>
                </motion.li>
              );
            })}
          </ul>
        </motion.nav>
        
        {/* User Profile */}
        <div className="p-4 border-t border-border/30">
          <div className="flex items-center">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary/20 text-primary text-sm font-medium">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            <div className={cn("ml-3", collapsed ? "hidden" : "hidden lg:block")}>
              <p className="text-sm font-medium">
                {user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username : 'Guest'}
              </p>
              <p className="text-xs text-muted-foreground">
                {user?.userLevel || 'New User'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

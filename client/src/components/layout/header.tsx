import React from 'react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  LogOut, 
  User,
  Settings, 
  Bell, 
  Search,
  Menu,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Link } from 'wouter';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface HeaderProps {
  title?: string;
  toggleSidebar?: () => void;
  isSidebarOpen?: boolean;
  toggleMobileMenu?: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  title = "Dashboard", 
  toggleSidebar,
  isSidebarOpen,
  toggleMobileMenu
}) => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const getUserInitials = () => {
    if (!user) return 'U';
    
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`;
    } else if (user.username) {
      return user.username[0].toUpperCase();
    }
    
    return 'U';
  };

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-card/40 backdrop-blur-md border-b border-border/30 py-3 px-4 flex justify-between items-center sticky top-0 z-10 w-full"
    >
      <div className="flex items-center">
        <button 
          onClick={toggleMobileMenu} 
          className="md:hidden mr-4 p-2 rounded-full hover:bg-primary/10 text-foreground hover:text-primary transition-colors duration-200"
          aria-label="Toggle mobile menu"
        >
          <Menu size={20} />
        </button>
        
        <button 
          onClick={toggleSidebar} 
          className="hidden md:flex mr-4 p-2 rounded-full hover:bg-primary/10 text-foreground hover:text-primary transition-colors duration-200"
          aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {isSidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
        
        <motion.h2 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xl font-bold text-foreground"
        >
          {title}
        </motion.h2>
      </div>
      
      <div className="flex items-center space-x-2">
        <button className="p-2 rounded-full hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors duration-200">
          <Bell size={18} />
        </button>
        <button className="p-2 rounded-full hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors duration-200">
          <Search size={18} />
        </button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className={cn(
              "h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center",
              "hover:bg-primary/20 transition-all border border-primary/20 ml-2"
            )}>
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary/20 text-primary text-sm font-medium">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              {user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username : 'Account'}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link to="/settings">
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
            </Link>
            <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.header>
  );
};

export default Header;

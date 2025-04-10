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
  ChevronRight,
  BrainCircuit,
  Code,
  Server
} from 'lucide-react';
import { Link } from 'wouter';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Added Mascot component
const Mascot = ({ size = "md" }) => {
  // Replace this with your actual mascot component
  return <span className={`text-[#9FEF00] text-${size}`}>🤖</span>;
};


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
      className="bg-black/80 backdrop-blur-md border-b border-[#9FEF00]/20 py-3 px-4 flex justify-between items-center sticky top-0 z-10 w-full relative overflow-hidden"
    >
      {/* Animated background grid effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-20">
        <div className="absolute inset-0 grid grid-cols-[repeat(20,1fr)] grid-rows-[repeat(5,1fr)]">
          {Array.from({ length: 100 }).map((_, i) => (
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
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80"></div>
      </div>

      <div className="flex items-center relative z-10">
        <button 
          onClick={toggleMobileMenu} 
          className="md:hidden mr-4 p-2 rounded-full hover:bg-[#9FEF00]/10 text-white hover:text-[#9FEF00] transition-colors duration-200"
          aria-label="Toggle mobile menu"
        >
          <Menu size={20} />
        </button>

        <button 
          onClick={toggleSidebar} 
          className="hidden md:flex mr-4 p-2 rounded-full hover:bg-[#9FEF00]/10 text-white hover:text-[#9FEF00] transition-colors duration-200"
          aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {isSidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center"
        >
          <Link to="/" className="flex items-center">
            <Mascot size="lg" />
            <BrainCircuit className="h-5 w-5 text-[#9FEF00] mr-2" />
            <h2 className="text-xl font-mono font-bold text-white">
              Money<span className="text-[#9FEF00]">Mind</span>
            </h2>
          </Link>
        </motion.div>
      </div>

      <div className="flex items-center space-x-2 relative z-10">
        {/* Notification button with glow effect */}
        <button className="p-2 rounded-full hover:bg-[#9FEF00]/10 text-white/70 hover:text-[#9FEF00] transition-colors duration-200 relative group">
          <Bell size={18} />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-[#9FEF00] shadow-[0_0_5px_#9FEF00] animate-pulse"></span>
        </button>

        {/* Search button */}
        <button className="p-2 rounded-full hover:bg-[#9FEF00]/10 text-white/70 hover:text-[#9FEF00] transition-colors duration-200">
          <Search size={18} />
        </button>

        {/* System status indicator */}
        <div className="hidden md:flex items-center mr-2 px-2 py-1 bg-black/40 border border-[#9FEF00]/20 rounded text-xs text-white/70">
          <Server size={12} className="text-[#9FEF00] mr-1" />
          <span className="font-mono">SYSTEM <span className="text-[#9FEF00]">ONLINE</span></span>
        </div>

        {/* User dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className={cn(
              "h-9 w-9 rounded-full bg-[#9FEF00]/10 flex items-center justify-center",
              "hover:bg-[#9FEF00]/20 transition-all border border-[#9FEF00]/30 shadow-[0_0_10px_rgba(159,239,0,0.2)] ml-2"
            )}>
              <Avatar className="h-8 w-8">
                {user?.profilePicture && (
                  <AvatarImage src={user.profilePicture} alt={user.username || 'User profile'} />
                )}
                <AvatarFallback className="bg-black text-[#9FEF00] text-sm font-mono">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-black/90 border border-[#9FEF00]/30 text-white shadow-[0_0_20px_rgba(159,239,0,0.2)]">
            <DropdownMenuLabel className="font-mono">
              <span className="text-[#9FEF00]">&gt;</span> {user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username : 'User'}
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#9FEF00]/20" />
            <Link to="/settings">
              <DropdownMenuItem className="cursor-pointer hover:bg-[#9FEF00]/10 hover:text-[#9FEF00] font-mono">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
            </Link>
            <DropdownMenuItem className="cursor-pointer hover:bg-[#9FEF00]/10 hover:text-[#9FEF00] font-mono" onClick={handleLogout}>
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
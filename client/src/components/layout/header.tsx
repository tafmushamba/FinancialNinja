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
  Search 
} from 'lucide-react';
import { Link } from 'wouter';
import { useAuth } from '@/context/AuthContext';

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

  return (
    <header className="bg-dark-800 border-b border-dark-600 py-3 px-4 flex justify-between items-center sticky top-0 z-10 w-full" style={{ backgroundColor: 'var(--dark-800)', borderColor: 'var(--dark-600)' }}>
      <div className="flex items-center">
        <button 
          onClick={toggleMobileMenu} 
          className="md:hidden mr-4 p-2 rounded hover:bg-dark-700 text-gray-400 hover:text-green-500 transition-colors duration-200"
          aria-label="Toggle mobile menu"
        >
          <i className="fas fa-bars"></i>
        </button>
        
        <button 
          onClick={toggleSidebar} 
          className="hidden md:flex mr-4 p-2 rounded hover:bg-dark-700 text-gray-400 hover:text-green-500 transition-colors duration-200"
          aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          <i className={`fas ${isSidebarOpen ? 'fa-chevron-left' : 'fa-chevron-right'}`}></i>
        </button>
        
        <h2 className="text-xl font-mono font-bold">{title}</h2>
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="p-2 hover:bg-dark-700 text-gray-400 hover:text-green-500 transition-colors duration-200">
          <Bell size={18} />
        </button>
        <button className="p-2 hover:bg-dark-700 text-gray-400 hover:text-green-500 transition-colors duration-200">
          <Search size={18} />
        </button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="h-8 w-8 rounded-full bg-green-500 bg-opacity-20 flex items-center justify-center text-green-500 hover:bg-opacity-30 transition-all">
              <User size={16} />
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
    </header>
  );
};

export default Header;

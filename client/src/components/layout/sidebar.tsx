import React from 'react';
import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

interface SidebarProps {
  collapsed?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed = false }) => {
  const [location] = useLocation();
  const { user } = useAuth();

  const navItems = [
    { icon: 'fas fa-home', label: 'Dashboard', path: '/' },
    { icon: 'fas fa-graduation-cap', label: 'Learning Modules', path: '/learning-modules' },
    { icon: 'fas fa-wallet', label: 'Finance Tracker', path: '/finance-tracker' },
    { icon: 'fas fa-gamepad', label: 'Financial Game', path: '/financial-game' },
    { icon: 'fas fa-trophy', label: 'Achievements', path: '/achievements' },
    { icon: 'fas fa-robot', label: 'AI Assistant', path: '/ai-assistant' },
    { icon: 'fas fa-cog', label: 'Settings', path: '/settings' }
  ];

  return (
    <aside className="w-full h-full bg-dark-800 overflow-hidden z-30" style={{ backgroundColor: 'var(--dark-800)' }}>
      <div className="h-full flex flex-col">
        {/* Logo */}
        <div className="p-4 flex items-center justify-center lg:justify-start border-b border-dark-600" style={{ borderColor: 'var(--dark-600)' }}>
          <div className="w-8 h-8 flex items-center justify-center rounded-md bg-green-500 bg-opacity-20">
            <i className="fas fa-chart-line text-green-500"></i>
          </div>
          <h1 className={cn("ml-3 text-xl font-mono font-bold text-white", collapsed ? "hidden" : "hidden lg:block")}>
            Fin<span className="text-green-500">Byte</span>
          </h1>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link 
                  href={item.path}
                  className={cn(
                    "flex items-center py-2 px-4 transition-all duration-200",
                    location === item.path
                      ? "text-green-500 border-l-4 border-green-500"
                      : "text-white hover:text-green-500"
                  )}
                  style={{ 
                    backgroundColor: location === item.path ? 'var(--dark-700)' : ''
                  }}
                >
                  <i className={cn(item.icon, "w-6 text-center")}></i>
                  <span className={cn("ml-3", collapsed ? "hidden" : "hidden lg:block")}>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        {/* User Profile */}
        <div className="p-4 border-t border-dark-600" style={{ borderColor: 'var(--dark-600)' }}>
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-purple-500 bg-opacity-30 flex items-center justify-center">
              <span className="text-purple-500 text-sm font-bold">
                {user ? (user.firstName?.[0] || '') + (user.lastName?.[0] || '') || user.username?.[0] || '?' : '?'}
              </span>
            </div>
            <div className={cn("ml-3", collapsed ? "hidden" : "hidden lg:block")}>
              <p className="text-sm font-medium">
                {user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username : 'Guest'}
              </p>
              <p className="text-xs text-gray-400">
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

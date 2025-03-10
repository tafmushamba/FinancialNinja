import React from 'react';
import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';

const Sidebar: React.FC = () => {
  const [location] = useLocation();

  const navItems = [
    { icon: 'fas fa-home', label: 'Dashboard', path: '/' },
    { icon: 'fas fa-graduation-cap', label: 'Learning Modules', path: '/learning-modules' },
    { icon: 'fas fa-wallet', label: 'Finance Tracker', path: '/finance-tracker' },
    { icon: 'fas fa-trophy', label: 'Achievements', path: '/achievements' },
    { icon: 'fas fa-robot', label: 'AI Assistant', path: '/ai-assistant' },
    { icon: 'fas fa-cog', label: 'Settings', path: '/settings' }
  ];

  return (
    <aside className="w-16 lg:w-64 bg-dark-800 h-screen hidden md:block z-30">
      <div className="h-full flex flex-col">
        {/* Logo */}
        <div className="p-4 flex items-center justify-center lg:justify-start border-b border-dark-600">
          <div className="w-8 h-8 flex items-center justify-center rounded-md bg-neon-green bg-opacity-20">
            <i className="fas fa-chart-line text-neon-green"></i>
          </div>
          <h1 className="hidden lg:block ml-3 text-xl font-mono font-bold text-white">
            Fin<span className="text-neon-green">Byte</span>
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
                      ? "text-neon-green bg-dark-700 border-l-4 border-neon-green"
                      : "text-white hover:text-neon-green hover:bg-dark-700"
                  )}
                >
                  <i className={cn(item.icon, "w-6 text-center")}></i>
                  <span className="ml-3 hidden lg:block">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        {/* User Profile */}
        <div className="p-4 border-t border-dark-600">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-neon-purple bg-opacity-30 flex items-center justify-center">
              <span className="text-neon-purple text-sm font-bold">JS</span>
            </div>
            <div className="ml-3 hidden lg:block">
              <p className="text-sm font-medium">John Smith</p>
              <p className="text-xs text-gray-400">Level 3 Investor</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

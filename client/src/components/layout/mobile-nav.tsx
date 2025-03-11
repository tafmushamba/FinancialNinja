import React from 'react';
import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';

interface MobileNavProps {
  isOpen?: boolean;
  toggleMenu?: () => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ isOpen = false, toggleMenu }) => {
  const [location] = useLocation();

  const navItems = [
    { icon: 'fas fa-home', label: 'Home', path: '/' },
    { icon: 'fas fa-graduation-cap', label: 'Learn', path: '/learning-modules' },
    { icon: 'fas fa-wallet', label: 'Track', path: '/finance-tracker' },
    { icon: 'fas fa-gamepad', label: 'Game', path: '/financial-game' },
    { icon: 'fas fa-trophy', label: 'Achieve', path: '/achievements' },
    { icon: 'fas fa-user', label: 'Profile', path: '/settings' }
  ];

  return (
    <>
      {/* Mobile Slide-out Menu */}
      <div 
        className={cn(
          "fixed inset-0 bg-dark-900 bg-opacity-90 z-50 transition-transform duration-300 md:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )} 
        style={{ backgroundColor: 'var(--dark-900)' }}
      >
        <div className="flex flex-col h-full">
          <div 
            className="flex justify-between items-center p-4 border-b border-dark-700" 
            style={{ borderColor: 'var(--dark-700)' }}
          >
            <h2 className="text-xl font-bold text-white">Financial Literacy</h2>
            <button 
              onClick={toggleMenu}
              className="p-2 rounded hover:bg-dark-700 text-gray-400 hover:text-green-500"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
          
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className={cn(
                      "flex items-center px-4 py-3 rounded-md text-base",
                      location === item.path
                        ? "bg-dark-700 text-green-500 font-medium"
                        : "text-gray-300 hover:bg-dark-800 hover:text-green-500"
                    )}
                    style={{ 
                      backgroundColor: location === item.path ? 'var(--dark-700)' : ''
                    }}
                    onClick={toggleMenu}
                  >
                    <i className={cn(item.icon, "w-6 text-center")}></i>
                    <span className="ml-3">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
      
      {/* Bottom Mobile Navigation Bar */}
      <div 
        className="fixed bottom-0 left-0 right-0 bg-dark-800 border-t border-dark-600 flex justify-around p-3 md:hidden z-40"
        style={{ backgroundColor: 'var(--dark-800)', borderColor: 'var(--dark-600)' }}
      >
        {navItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={cn(
              "flex flex-col items-center",
              location === item.path
                ? "text-green-500"
                : "text-gray-400 hover:text-green-500"
            )}
          >
            <i className={cn(item.icon, "text-lg")}></i>
            <span className="text-xs mt-1">{item.label}</span>
          </Link>
        ))}
      </div>
    </>
  );
};

export default MobileNav;
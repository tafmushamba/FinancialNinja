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
    { icon: 'fas fa-trophy', label: 'Achieve', path: '/achievements' },
    { icon: 'fas fa-user', label: 'Profile', path: '/settings' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-dark-800 border-t border-dark-600 flex justify-around p-3 md:hidden z-40">
      {navItems.map((item) => (
        <Link
          key={item.path}
          href={item.path}
          className={cn(
            "flex flex-col items-center",
            location === item.path
              ? "text-neon-green"
              : "text-gray-400 hover:text-neon-green"
          )}
        >
          <i className={cn(item.icon, "text-lg")}></i>
          <span className="text-xs mt-1">{item.label}</span>
        </Link>
      ))}
    </div>
  );
};

export default MobileNav;

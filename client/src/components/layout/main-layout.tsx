import React from 'react';
import Sidebar from './sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileNav from './mobile-nav';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();

  return (
    <div className="flex min-h-screen bg-dark-900">
      {/* Sidebar for desktop */}
      <Sidebar />
      
      {/* Main content area */}
      <div className="flex-1 min-h-screen flex flex-col">
        {/* Mobile navigation */}
        {isMobile && <MobileNav />}
        
        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-dark-900">
          {children}
        </main>
        
        {/* Add bottom padding on mobile to account for mobile navigation */}
        {isMobile && <div className="h-16"></div>}
      </div>
    </div>
  );
};

export default MainLayout;
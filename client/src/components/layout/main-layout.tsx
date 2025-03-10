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
    <div className="min-h-screen bg-dark-900">
      {/* Sidebar for desktop */}
      <Sidebar />
      
      {/* Main content area */}
      <div className="md:ml-16 lg:ml-64 min-h-screen flex flex-col w-full">
        {/* Mobile navigation */}
        {isMobile && <MobileNav />}
        
        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-dark-900 py-4">
          <div className="w-full">
            {children}
          </div>
        </main>
        
        {/* Add bottom padding on mobile to account for mobile navigation */}
        {isMobile && <div className="h-16"></div>}
      </div>
    </div>
  );
};

export default MainLayout;
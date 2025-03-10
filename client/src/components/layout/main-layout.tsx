
import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import Sidebar from "./sidebar";
import Header from "./header";
import MobileNav from "./mobile-nav";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [location] = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  // Close mobile menu when navigating to a new page
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      {/* Sidebar - hidden on mobile */}
      <div className={cn(
        "hidden md:block transition-all duration-300 ease-in-out",
        isSidebarOpen ? "w-64" : "w-20"
      )}>
        <Sidebar collapsed={!isSidebarOpen} />
      </div>
      
      {/* Main content */}
      <div className="flex flex-col flex-1 w-full overflow-hidden">
        <Header 
          toggleSidebar={toggleSidebar} 
          isSidebarOpen={isSidebarOpen}
          toggleMobileMenu={toggleMobileMenu}
        />
        
        {/* Mobile menu */}
        <MobileNav isOpen={isMobileMenuOpen} toggleMenu={toggleMobileMenu} />
        
        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-black p-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;


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
  
  // Get page title based on current location
  const getPageTitle = () => {
    const path = location.split("/")[1];
    switch (path) {
      case "":
        return "Dashboard";
      case "learning-modules":
        return "Learning Modules";
      case "finance-tracker":
        return "Finance Tracker";
      case "achievements":
        return "Achievements";
      case "ai-assistant":
        return "AI Assistant";
      case "settings":
        return "Settings";
      default:
        return path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, " ");
    }
  };
  
  // Close mobile menu when navigating to a new page
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <div className="flex min-h-screen bg-background text-foreground overflow-hidden">
      {/* Sidebar - hidden on mobile */}
      <aside className={cn(
        "hidden md:block transition-all duration-300 ease-in-out h-screen",
        isSidebarOpen ? "w-64" : "w-20"
      )}>
        <Sidebar collapsed={!isSidebarOpen} />
      </aside>
      
      {/* Main content area */}
      <div className="flex flex-col flex-1 w-full">
        {/* Top header */}
        <Header 
          title={getPageTitle()}
          toggleSidebar={toggleSidebar} 
          isSidebarOpen={isSidebarOpen}
          toggleMobileMenu={toggleMobileMenu}
        />
        
        {/* Mobile navigation overlay */}
        <MobileNav isOpen={isMobileMenuOpen} toggleMenu={toggleMobileMenu} />
        
        {/* Main page content */}
        <main className="flex-1 overflow-y-auto p-4 pb-20 md:pb-10">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;

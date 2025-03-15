import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import Sidebar from "./sidebar";
import Header from "./header";
import MobileNav from "./mobile-nav";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

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
      case "financial-game":
        return "Financial Simulator";
      default:
        return path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, " ");
    }
  };
  
  // Close mobile menu when navigating to a new page
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Check if current page is financial game
  const isFinancialGame = location === '/financial-game';

  return (
    <div className={cn(
      "flex min-h-screen bg-background text-foreground overflow-hidden",
      isFinancialGame ? "bg-gradient-to-br from-blue-950 to-purple-950" : ""
    )}>
      {/* Sidebar - hidden on mobile and financial game page */}
      {!isFinancialGame && (
        <aside className={cn(
          "hidden md:block transition-all duration-300 ease-in-out h-screen",
          isSidebarOpen ? "w-64" : "w-20"
        )}>
          <Sidebar collapsed={!isSidebarOpen} />
        </aside>
      )}
      
      {/* Main content area */}
      <div className="flex flex-col flex-1 w-full">
        {/* Top header - hidden on financial game page */}
        {!isFinancialGame && (
          <Header 
            title={getPageTitle()}
            toggleSidebar={toggleSidebar} 
            isSidebarOpen={isSidebarOpen}
            toggleMobileMenu={toggleMobileMenu}
          />
        )}
        
        {/* Mobile navigation overlay - only rendered when menu is open and not on financial game page */}
        {!isFinancialGame && isMobileMenuOpen && (
          <MobileNav isOpen={isMobileMenuOpen} toggleMenu={toggleMobileMenu} />
        )}
        
        {/* Main page content */}
        <motion.main 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className={cn(
            "flex-1 overflow-y-auto",
            isFinancialGame ? "p-0 pb-0" : "p-4 md:p-6 pb-20 md:pb-10"
          )}
        >
          {children}
        </motion.main>
      </div>
      
      {/* Decorative elements */}
      {!isFinancialGame && (
        <>
          <div className="fixed top-0 right-0 w-1/3 h-1/4 bg-primary/5 rounded-bl-full blur-3xl pointer-events-none" />
          <div className="fixed bottom-0 left-0 w-1/4 h-1/3 bg-primary/5 rounded-tr-full blur-3xl pointer-events-none" />
        </>
      )}
    </div>
  );
};

export default MainLayout;

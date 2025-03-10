import React from "react";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/layout/sidebar";
import MobileNav from "@/components/layout/mobile-nav";
import Header from "@/components/layout/header";
import WelcomeSection from "@/components/dashboard/welcome-section";
import LearningModules from "@/components/dashboard/learning-modules";
import StatsOverview from "@/components/dashboard/stats-overview";
import FinancialOverview from "@/components/dashboard/financial-overview";
import AiAssistant from "@/components/dashboard/ai-assistant";

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-dark-900 text-foreground flex flex-col">
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <div className="block md:hidden">
        <MobileNav />
      </div>
      <div className="md:ml-64 p-4 md:p-8 flex-grow">
        <Header title="Dashboard" />
        <main className="mt-6 max-w-7xl mx-auto">
          <WelcomeSection />
          <LearningModules />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <StatsOverview />
            <FinancialOverview />
          </div>
          <AiAssistant />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
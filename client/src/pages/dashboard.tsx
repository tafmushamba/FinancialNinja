import React from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import WelcomeSection from "@/components/dashboard/welcome-section";
import LearningModules from "@/components/dashboard/learning-modules";
import StatsOverview from "@/components/dashboard/stats-overview";
import FinancialOverview from "@/components/dashboard/financial-overview";
import AiAssistant from "@/components/dashboard/ai-assistant";

const Dashboard: React.FC = () => {
  return (
    <>
      <Header title="Dashboard" />
      <div className="px-4">
        <WelcomeSection />
        <LearningModules />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <StatsOverview />
          <FinancialOverview />
        </div>
        <AiAssistant />
      </div>
    </>
  );
};

export default Dashboard;
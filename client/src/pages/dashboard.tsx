import React from "react";
import { useQuery } from "@tanstack/react-query";
import WelcomeSection from "@/components/dashboard/welcome-section";
import LearningModules from "@/components/dashboard/learning-modules";
import StatsOverview from "@/components/dashboard/stats-overview";
import FinancialOverview from "@/components/dashboard/financial-overview";
import AiAssistant from "@/components/dashboard/ai-assistant";

const Dashboard: React.FC = () => {
  return (
    <div>
      <WelcomeSection />
      <LearningModules />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 px-4">
        <StatsOverview />
        <FinancialOverview />
      </div>
      <AiAssistant />
    </div>
  );
};

export default Dashboard;
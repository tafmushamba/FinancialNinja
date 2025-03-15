import React from "react";
import { useQuery } from "@tanstack/react-query";
import WelcomeSection from "@/components/dashboard/welcome-section";
import LearningModules from "@/components/dashboard/learning-modules";
import StatsOverview from "@/components/dashboard/stats-overview";

const Dashboard: React.FC = () => {
  return (
    <div className="container mx-auto py-6 max-w-7xl animate-fadeIn">
      <WelcomeSection />
      <div className="grid grid-cols-1 gap-8 mb-8">
        <LearningModules />
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8 px-4">
          <StatsOverview />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
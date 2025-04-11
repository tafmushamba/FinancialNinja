import React from "react";
import { useQuery } from "@tanstack/react-query";
import WelcomeSection from "@/components/dashboard/welcome-section";
import LearningModules from "@/components/dashboard/learning-modules";
import StatsOverview from "@/components/dashboard/stats-overview";

const Dashboard: React.FC = () => {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8 max-w-6xl animate-fadeIn space-y-10">
      <WelcomeSection />
      {/* Financial Progress Overview moved here for better prominence */}
      <StatsOverview />
      {/* Main content grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
        {/* Learning Modules taking up 2/3 width on large screens */}
        <div className="lg:col-span-2 md:col-span-2">
          <LearningModules />
        </div>
        {/* StatsOverview moved above grid */}
      </div>
    </div>
  );
};

export default Dashboard;
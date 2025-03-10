import React from 'react';
import Sidebar from '@/components/layout/sidebar';
import MobileNav from '@/components/layout/mobile-nav';
import Header from '@/components/layout/header';
import WelcomeSection from '@/components/dashboard/welcome-section';
import StatsOverview from '@/components/dashboard/stats-overview';
import LearningModules from '@/components/dashboard/learning-modules';
import FinancialOverview from '@/components/dashboard/financial-overview';
import AiAssistant from '@/components/dashboard/ai-assistant';
import UpcomingLessons from '@/components/dashboard/upcoming-lessons';
import Achievements from '@/components/dashboard/achievements';

const Dashboard: React.FC = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
        <Header title="Dashboard" />
        
        <div className="p-4 md:p-6">
          <WelcomeSection />
          <StatsOverview />
          <LearningModules />
          <FinancialOverview />
          <AiAssistant />
          
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 animate-fadeIn">
            <UpcomingLessons />
            <Achievements />
          </section>
        </div>
      </main>
      
      <MobileNav />
    </div>
  );
};

export default Dashboard;

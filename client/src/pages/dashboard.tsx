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
import React from "react";
import { useNavigate } from "react-router-dom";
import { HeroSection } from "@/components/layout/hero-section";
import { ModuleCard } from "@/components/modules/module-card";
import { useQuery } from "@tanstack/react-query";
import { fetchUserProfile, fetchModules, fetchRecommendations } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { data: profile } = useQuery({ queryKey: ["profile"], queryFn: fetchUserProfile });
  const { data: modules } = useQuery({ queryKey: ["modules"], queryFn: fetchModules });
  const { data: recommendations } = useQuery({ 
    queryKey: ["recommendations"], 
    queryFn: fetchRecommendations 
  });

  const featuredModules = modules?.modules.slice(0, 3) || [];
  
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection
        title="Master Your Financial Future"
        subtitle="Join thousands building their financial literacy with personalized learning paths and AI-powered insights."
        ctaLabel="Explore Learning Modules"
        ctaAction={() => navigate("/modules")}
      />

      <div className="container px-4 mx-auto py-12">
        {/* User progress section */}
        {profile && (
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <Avatar className="h-16 w-16 border-2 border-neon-green">
                <AvatarImage src={profile.avatarUrl} />
                <AvatarFallback className="bg-neon-green/20 text-neon-green text-xl">
                  {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold">
                  Welcome back, {profile.firstName}
                </h2>
                <p className="text-muted-foreground">
                  Continue your financial literacy journey
                </p>
              </div>
            </div>
            
            <Card className="bg-dark-800 border-dark-600">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Your Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <span>Financial Literacy Score</span>
                  <span className="font-mono text-neon-green">{profile.financialLiteracyScore}/100</span>
                </div>
                <Progress value={profile.financialLiteracyScore} className="h-2 mb-4" />
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                  <div className="bg-dark-700 p-4 rounded-md">
                    <p className="text-sm text-muted-foreground mb-1">Modules Completed</p>
                    <p className="text-2xl font-bold">{profile.modulesCompleted}</p>
                  </div>
                  <div className="bg-dark-700 p-4 rounded-md">
                    <p className="text-sm text-muted-foreground mb-1">Lessons Completed</p>
                    <p className="text-2xl font-bold">{profile.lessonsCompleted}</p>
                  </div>
                  <div className="bg-dark-700 p-4 rounded-md">
                    <p className="text-sm text-muted-foreground mb-1">Quiz Score Avg</p>
                    <p className="text-2xl font-bold">{profile.quizScoreAvg}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Featured modules section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Continue Learning</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredModules.map((module) => (
              <ModuleCard
                key={module.id}
                id={module.id}
                title={module.title}
                description={module.description}
                icon={module.icon}
                accentColor={module.accentColor}
                difficulty={module.difficulty}
                duration={module.duration}
                topics={module.topics}
                progress={module.id % 2 === 0 ? 45 : 28}
              />
            ))}
          </div>
        </section>

        {/* Recommendations section */}
        {recommendations && (
          <section>
            <h2 className="text-2xl font-bold mb-6">Personalized Recommendations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recommendations.recommendations.map((rec, index) => (
                <Card key={index} className="bg-dark-800 border-dark-600 overflow-hidden">
                  <div className="h-32 bg-gradient-to-r from-neon-purple/30 to-neon-cyan/30 image-fade-mask" />
                  <CardContent className="p-6 -mt-12">
                    <div className="bg-dark-700 p-4 rounded-md mb-4 border border-dark-600">
                      <h3 className="font-bold text-lg mb-2">{rec.title}</h3>
                      <p className="text-muted-foreground text-sm">{rec.description}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-neon-green">
                        <i className="fas fa-chart-line mr-2"></i>
                        <span className="text-sm">{rec.reason}</span>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-neon-green text-neon-green hover:bg-neon-green/10"
                        onClick={() => navigate(rec.link)}
                      >
                        Explore
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

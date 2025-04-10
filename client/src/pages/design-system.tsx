"use client";

import React from 'react';
import MainLayout from '@/components/layout/main-layout';
import { NeonButton } from '@/components/ui/neon-button';
import { GlassCard } from '@/components/ui/glass-card';
import { TiltCard } from '@/components/ui/tilt-card';
import { ProgressPath } from '@/components/ui/progress-path';
import { AnimatedChart } from '@/components/ui/animated-chart';
import { SavingsGoal } from '@/components/ui/savings-goal';
import { AchievementBadge } from '@/components/ui/achievement-badge';
import { FinancialTipCard } from '@/components/ui/financial-tip-card';
import { EffectsShowcase } from '@/components/ui/effects-showcase';

const DesignSystem = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-gradient text-gradient-rainbow">FinancialNinja Design System</h1>
        
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-gradient text-gradient-green">Visual Effects & Animations</h2>
          <p className="mb-8 text-gray-300">
            Our enhanced visual library provides a range of animations, effects, and transitions 
            to create engaging user experiences across the FinancialNinja application.
          </p>
          
          <EffectsShowcase className="bg-dark-800 rounded-xl" />
        </div>
        
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-gradient text-gradient-cyan">UI Components</h2>
          <p className="mb-8 text-gray-300">
            Custom components designed for financial applications with interactive animations and visual appeal.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-dark-800 p-6 rounded-xl">
              <h3 className="text-xl font-semibold mb-4">Neon Buttons</h3>
              <div className="space-y-4">
                <NeonButton color="green">Green Button</NeonButton>
                <NeonButton color="cyan">Cyan Button</NeonButton>
                <NeonButton color="purple">Purple Button</NeonButton>
              </div>
            </div>
            
            <div className="bg-dark-800 p-6 rounded-xl">
              <h3 className="text-xl font-semibold mb-4">Glass Cards</h3>
              <div className="space-y-4">
                <GlassCard className="p-4">
                  <h4 className="font-medium">Basic Glass Card</h4>
                  <p className="text-sm opacity-80 mt-2">A card with glassmorphism effect</p>
                </GlassCard>
                
                <GlassCard glowColor="green" className="p-4">
                  <h4 className="font-medium">Green Glow Glass Card</h4>
                  <p className="text-sm opacity-80 mt-2">With custom glow color</p>
                </GlassCard>
              </div>
            </div>
            
            <div className="bg-dark-800 p-6 rounded-xl">
              <h3 className="text-xl font-semibold mb-4">Tilt Cards</h3>
              <TiltCard className="p-4 mb-4">
                <h4 className="font-medium">3D Tilt Card</h4>
                <p className="text-sm opacity-80 mt-2">Hover to see the 3D effect</p>
              </TiltCard>
              
              <TiltCard glowColor="purple" className="p-4">
                <h4 className="font-medium">Glow Tilt Card</h4>
                <p className="text-sm opacity-80 mt-2">With purple glow effect</p>
              </TiltCard>
            </div>
          </div>
        </div>
        
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-gradient text-gradient-purple">Financial Components</h2>
          <p className="mb-8 text-gray-300">
            Specialized components for financial tracking, goal setting, and visualization.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-dark-800 p-6 rounded-xl">
              <h3 className="text-xl font-semibold mb-4">Savings Goal Tracker</h3>
              <SavingsGoal 
                goalName="Emergency Fund" 
                currentAmount={3500} 
                targetAmount={5000}
                currency="$"
                colorScheme="green"
              />
              
              <div className="mt-6">
                <SavingsGoal 
                  goalName="New Car" 
                  currentAmount={8200} 
                  targetAmount={20000}
                  currency="$"
                  colorScheme="cyan"
                />
              </div>
            </div>
            
            <div className="bg-dark-800 p-6 rounded-xl">
              <h3 className="text-xl font-semibold mb-4">Financial Progress</h3>
              <ProgressPath 
                steps={[
                  { id: 1, title: 'Budget Setup', status: 'completed' },
                  { id: 2, title: 'Savings Plan', status: 'completed' },
                  { id: 3, title: 'Debt Reduction', status: 'current' },
                  { id: 4, title: 'Investment', status: 'locked' },
                  { id: 5, title: 'Financial Freedom', status: 'locked' }
                ]}
              />
            </div>
          </div>
        </div>
        
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-gradient text-gradient-rainbow">Data Visualization</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-dark-800 p-6 rounded-xl">
              <h3 className="text-xl font-semibold mb-4">Animated Charts</h3>
              <AnimatedChart 
                data={[
                  { label: 'Jan', value: 500 },
                  { label: 'Feb', value: 700 },
                  { label: 'Mar', value: 800 },
                  { label: 'Apr', value: 1200 },
                  { label: 'May', value: 1500 },
                  { label: 'Jun', value: 1700 }
                ]}
                variant="bar"
              />
            </div>
            
            <div className="bg-dark-800 p-6 rounded-xl">
              <h3 className="text-xl font-semibold mb-4">Investment Growth</h3>
              <AnimatedChart 
                data={[
                  { label: 'Q1', value: 3000 },
                  { label: 'Q2', value: 3600 },
                  { label: 'Q3', value: 4200 },
                  { label: 'Q4', value: 5000 }
                ]}
                variant="line"
              />
            </div>
          </div>
        </div>
        
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-gradient text-gradient-green">Engagement & Gamification</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-dark-800 p-6 rounded-xl">
              <h3 className="text-xl font-semibold mb-4">Achievement Badges</h3>
              <div className="flex flex-wrap gap-4">
                <AchievementBadge
                  title="Budget Master"
                  description="Stayed under budget for 3 months"
                  level="gold"
                  obtained={true}
                />
                
                <AchievementBadge
                  title="Saver Pro"
                  description="Saved $10,000 this year"
                  level="platinum"
                  obtained={true}
                />
                
                <AchievementBadge
                  title="Investor"
                  description="Made your first investment"
                  level="silver"
                  obtained={false}
                />
              </div>
            </div>
            
            <div className="col-span-1 md:col-span-2 bg-dark-800 p-6 rounded-xl">
              <h3 className="text-xl font-semibold mb-4">Financial Tips</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FinancialTipCard
                  title="Emergency Fund"
                  content="Aim to save 3-6 months of expenses for emergencies"
                  category="saving"
                />
                
                <FinancialTipCard
                  title="50/30/20 Rule"
                  content="Allocate 50% to needs, 30% to wants, and 20% to savings"
                  category="budgeting"
                />
                
                <FinancialTipCard
                  title="Pay Yourself First"
                  content="Set aside savings as soon as you get paid"
                  category="saving"
                />
                
                <FinancialTipCard
                  title="Compound Interest"
                  content="Start investing early to maximize compound growth"
                  category="investing"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default DesignSystem;

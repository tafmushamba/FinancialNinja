import React from 'react';
import { LifeSimulationGame } from '@/components/games/life-choices/life-simulation-game';
import MainLayout from '@/components/layout/main-layout';

export default function LifeSimulationPage() {
  return (
    <MainLayout>
      <div className="container mx-auto py-6 max-w-5xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Life Choices: Financial Simulation</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Navigate through different life stages and see how your financial decisions impact your future. Make choices about education, career, housing, and retirement to build financial skills and earn badges.
          </p>
        </div>
        
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden">
          <LifeSimulationGame />
        </div>
      </div>
    </MainLayout>
  );
}
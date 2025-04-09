import React from 'react';
import { LifeSimulationGame } from '@/components/games/life-choices/life-simulation-game';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { ArrowLeft } from 'lucide-react';

export default function LifeSimulationPage() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background text-foreground overflow-hidden p-4 md:p-6 pb-20 md:pb-10"
    >
      <div className="container mx-auto py-6 max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-1">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </Button>
          </Link>
        </div>
        
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
    </motion.div>
  );
}
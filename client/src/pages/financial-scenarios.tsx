import React from 'react';
import ScenarioBasedLearning from '@/components/scenarios/scenario-based-learning';
import { useToast } from '@/hooks/use-toast';

export default function FinancialScenariosPage() {
  const { toast } = useToast();
  
  const handleScenarioComplete = (scenario: any, score: number) => {
    toast({
      title: 'Scenario Completed!',
      description: `You completed "${scenario.title}" with a score of ${score}/100.`,
      variant: 'default',
    });
  };
  
  return (
    <div className="container py-6">
      <ScenarioBasedLearning onComplete={handleScenarioComplete} />
    </div>
  );
}
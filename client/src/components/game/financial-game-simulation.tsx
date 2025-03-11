import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FinancialMetrics } from './financial-metrics';
import { GameMessage } from './game-message';
import { AchievementsList } from './achievements-list';
import { useFinancialGame } from '@/hooks/use-financial-game';

interface FinancialGameSimulationProps {
  career: string;
}

export function FinancialGameSimulation({ career }: FinancialGameSimulationProps) {
  const { toast } = useToast();
  const [playerName, setPlayerName] = useState('Player');

  useEffect(() => {
    // Get the username from local storage (if available)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        if (user.firstName) {
          setPlayerName(user.firstName);
        }
      } catch (e) {
        console.error("Error parsing user from localStorage:", e);
      }
    }
  }, []);

  const {
    gameState,
    gameStage,
    currentMessage,
    financialMetrics,
    achievements,
    level,
    xpEarned,
    isProcessing,
    initializeGame,
    makeDecision,
    endGame
  } = useFinancialGame(career, playerName);

  useEffect(() => {
    initializeGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMakeDecision = (decision: string) => {
    if (isProcessing) return;
    
    makeDecision(decision);
    
    toast({
      title: "Decision Made",
      description: `You've decided to ${decision.toLowerCase()}.`,
    });
  };

  const handleEndGame = () => {
    if (isProcessing) return;
    
    endGame();
    
    toast({
      title: "Game Completed",
      description: "Let's see your final results!",
    });
  };

  // Render the decision buttons based on the message content
  const renderDecisionOptions = () => {
    // Simple heuristic to extract options from the message
    const options: string[] = [];
    
    // If in final stage, show end game option
    if (gameStage === 'processing_decisions' && currentMessage) {
      if (currentMessage.includes("What's your decision?")) {
        options.push("Invest in stocks");
        options.push("Save for emergency fund");
        options.push("Pay down debt");
        options.push("Upgrade skills");
      }
    }
    
    // Add a continue option if we have no other options
    if (options.length === 0 && gameStage === 'processing_decisions') {
      return (
        <div className="flex gap-2 flex-wrap justify-center">
          <Button onClick={() => handleMakeDecision("Continue with next scenario")}>
            Continue
          </Button>
          <Button variant="outline" onClick={handleEndGame}>
            End Game
          </Button>
        </div>
      );
    }
    
    return (
      <div className="flex gap-2 flex-wrap justify-center">
        {options.map((option, idx) => (
          <Button 
            key={idx} 
            onClick={() => handleMakeDecision(option)}
            disabled={isProcessing}
          >
            {option}
          </Button>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Financial Twin: {career} Path</CardTitle>
              <CardDescription>Your virtual financial simulation</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">Level {level}</Badge>
              <Badge variant="secondary">XP: {xpEarned}</Badge>
            </div>
          </div>
          <Progress value={xpEarned % 100} className="h-2" />
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="simulation">
            <TabsList className="w-full justify-start mb-4">
              <TabsTrigger value="simulation">Simulation</TabsTrigger>
              <TabsTrigger value="metrics">Financial Metrics</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
            </TabsList>
            
            <TabsContent value="simulation" className="space-y-4">
              <GameMessage message={currentMessage} isLoading={isProcessing} />
              
              {gameStage !== 'welcome' && gameStage !== 'initialization' && gameStage !== 'game_over' && (
                <div className="mt-4">
                  {renderDecisionOptions()}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="metrics">
              <FinancialMetrics metrics={financialMetrics} />
            </TabsContent>
            
            <TabsContent value="achievements">
              <AchievementsList achievements={achievements} />
            </TabsContent>
          </Tabs>
        </CardContent>
        
        {gameStage === 'game_over' && (
          <CardFooter>
            <div className="w-full text-center">
              <Button variant="default" onClick={() => window.location.reload()}>
                Play Again
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
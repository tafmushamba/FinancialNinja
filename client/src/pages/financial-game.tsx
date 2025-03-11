import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { FinancialGameSimulation } from '@/components/game/financial-game-simulation';

export default function FinancialGame() {
  const { toast } = useToast();
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedCareer, setSelectedCareer] = useState<string | null>(null);

  const careerOptions = [
    {
      title: "Student",
      description: "Navigate educational expenses and part-time jobs while building skills for the future.",
      icon: "👩‍🎓",
    },
    {
      title: "Entrepreneur",
      description: "Build your business from the ground up, managing investments and unpredictable income.",
      icon: "👨‍💼",
    },
    {
      title: "Artist",
      description: "Balance creative passions with practical financial needs in a competitive market.",
      icon: "🎨",
    },
    {
      title: "Banker",
      description: "Leverage your financial expertise with high income but significant responsibilities.",
      icon: "💼",
    },
  ];

  const startGame = (career: string) => {
    setSelectedCareer(career);
    setGameStarted(true);
    toast({
      title: "Game Started!",
      description: `You've chosen the ${career} career path. Good luck!`,
    });
  };

  const resetGame = () => {
    setGameStarted(false);
    setSelectedCareer(null);
  };

  if (!gameStarted) {
    return (
      <div className="container mx-auto py-6 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Financial Twin Simulation</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Create your financial twin and navigate through life's financial challenges.
            Make decisions, face unexpected events, and build your financial future.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {careerOptions.map((career) => (
            <CareerCard 
              key={career.title}
              career={career}
              onSelect={() => startGame(career.title)}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Financial Twin Simulation</h1>
        <Button variant="outline" onClick={resetGame}>
          Start Over
        </Button>
      </div>
      
      {selectedCareer && <FinancialGameSimulation career={selectedCareer} />}
    </div>
  );
}

interface CareerCardProps {
  career: {
    title: string;
    description: string;
    icon: string;
  };
  onSelect: () => void;
}

function CareerCard({ career, onSelect }: CareerCardProps) {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={onSelect}>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">{career.title}</h3>
          <span className="text-4xl">{career.icon}</span>
        </div>
        <p className="text-muted-foreground">{career.description}</p>
        <Button className="w-full">Select This Path</Button>
      </div>
    </Card>
  );
}
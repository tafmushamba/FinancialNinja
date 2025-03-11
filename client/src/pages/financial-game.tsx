import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { PlayCircle } from 'lucide-react';
import { FinancialGameSimulation } from '@/components/game/financial-game-simulation';
import { CareerSprite } from '@/components/game/sprites';

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
        <motion.div 
          className="text-center space-y-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold tracking-tight">Financial Twin Simulation</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Create your financial twin and navigate through life's financial challenges.
            Make decisions, face unexpected events, and build your financial future.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {careerOptions.map((career, index) => (
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
      <motion.div 
        className="flex justify-between items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold tracking-tight">Financial Twin Simulation</h1>
        <Button variant="outline" onClick={resetGame}>
          <PlayCircle className="mr-2 h-4 w-4" />
          Choose Different Career
        </Button>
      </motion.div>
      
      {selectedCareer && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <FinancialGameSimulation career={selectedCareer} />
        </motion.div>
      )}
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
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card 
        className="p-6 hover:shadow-lg transition-all cursor-pointer overflow-hidden border-2 hover:border-primary/50" 
        onClick={onSelect}
      >
        <div className="space-y-4">
          <div className="flex flex-col items-center mb-4">
            <div className="w-32 h-32 mb-2 bg-gray-100 rounded-full p-1 flex items-center justify-center">
              <CareerSprite career={career.title} className="w-full h-full" />
            </div>
            <h3 className="text-xl font-semibold text-center">{career.title}</h3>
          </div>
          <p className="text-muted-foreground text-center">{career.description}</p>
          <Button className="w-full">
            <PlayCircle className="h-4 w-4 mr-2" />
            Select This Path
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
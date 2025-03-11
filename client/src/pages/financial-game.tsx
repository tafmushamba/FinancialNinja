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
      <div className="min-h-screen bg-gradient-to-br from-blue-950 via-background to-purple-950/30 py-16">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 rounded-bl-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-primary/5 rounded-tr-full blur-3xl pointer-events-none" />
      
        <div className="container mx-auto px-4 relative z-10 space-y-12">
          <motion.div 
            className="text-center space-y-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400">
              Financial Adventure
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Create your financial twin and navigate through life's challenges.
              Make decisions, face unexpected events, and build your financial future.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-3xl mx-auto mb-12 px-4 py-6 rounded-lg bg-card/40 backdrop-blur-sm border border-border/30 shadow-lg"
          >
            <h2 className="text-xl md:text-2xl font-bold text-center mb-6">Choose Your Career Path</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {careerOptions.map((career, index) => (
                <CareerCard 
                  key={career.title}
                  career={career}
                  onSelect={() => startGame(career.title)}
                />
              ))}
            </div>
          </motion.div>
          
          <div className="text-center text-sm text-muted-foreground">
            <p>Each career path offers unique financial challenges and opportunities</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-background to-purple-950/30">
      {/* Header only shown when game is started */}
      <div className="border-b border-border/30 bg-card/40 backdrop-blur-md">
        <div className="container mx-auto py-4 px-4">
          <motion.div 
            className="flex flex-col md:flex-row justify-between items-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center">
              <CareerSprite 
                career={selectedCareer || ''} 
                className="w-12 h-12 mr-3 bg-primary/10 rounded-full p-1" 
              />
              <div>
                <h1 className="text-2xl font-bold">Financial Adventure</h1>
                <p className="text-sm text-muted-foreground">
                  Career: {selectedCareer}
                </p>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              onClick={resetGame}
              className="border-primary/20 hover:bg-primary/10 hover:text-primary"
            >
              <PlayCircle className="mr-2 h-4 w-4" />
              Choose Different Career
            </Button>
          </motion.div>
        </div>
      </div>
      
      {/* Main game area */}
      <div className="container mx-auto">
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
      whileHover={{ scale: 1.03, y: -5 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card 
        className="p-6 hover:shadow-xl transition-all cursor-pointer overflow-hidden border border-primary/20 bg-card/70 backdrop-blur-sm hover:bg-card/90" 
        onClick={onSelect}
      >
        <div className="space-y-4">
          <div className="flex flex-col items-center mb-4">
            <div className="w-24 h-24 mb-3 bg-primary/10 rounded-full p-2 flex items-center justify-center border-2 border-primary/20">
              <CareerSprite career={career.title} className="w-full h-full" />
            </div>
            <h3 className="text-xl font-bold text-center text-foreground">{career.title}</h3>
          </div>
          <p className="text-muted-foreground text-center text-sm">{career.description}</p>
          <Button 
            className="w-full mt-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md" 
            size="sm"
          >
            <PlayCircle className="h-4 w-4 mr-2" />
            Start Journey
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { PlayCircle, Award, Code, Terminal, Zap, Waves, ArrowLeft, ChevronLeft } from 'lucide-react';
import { FinancialGameSimulation } from '@/components/game/financial-game-simulation';
import { CareerSprite } from '@/components/game/sprites';
import { useLocation } from 'wouter';

export default function FinancialGame() {
  const { toast } = useToast();
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedCareer, setSelectedCareer] = useState<string | null>(null);
  const [, navigate] = useLocation();

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

  const handleBack = () => {
    navigate('/');
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-black overflow-hidden relative">
        {/* Animated background grid effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-15">
          <div className="absolute inset-0 grid grid-cols-[repeat(30,1fr)] grid-rows-[repeat(30,1fr)]">
            {Array.from({ length: 900 }).map((_, i) => (
              <div 
                key={i} 
                className="border-r border-b border-[#9FEF00]/10" 
                style={{ 
                  animation: `pulse ${Math.random() * 4 + 3}s infinite ${Math.random() * 5}s ease-in-out`,
                  opacity: Math.random() * 0.3
                }}
              />
            ))}
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-transparent to-black/80"></div>
        </div>
        
        {/* Floating points */}
        <div className="absolute h-1 w-1 rounded-full bg-[#9FEF00] shadow-[0_0_5px_#9FEF00] animate-float1" style={{ top: '15%', left: '25%' }}></div>
        <div className="absolute h-1 w-1 rounded-full bg-[#9FEF00] shadow-[0_0_5px_#9FEF00] animate-float2" style={{ top: '35%', left: '65%' }}></div>
        <div className="absolute h-1 w-1 rounded-full bg-[#9FEF00] shadow-[0_0_5px_#9FEF00] animate-float3" style={{ top: '65%', left: '45%' }}></div>
        <div className="absolute h-1 w-1 rounded-full bg-[#9FEF00] shadow-[0_0_5px_#9FEF00] animate-float4" style={{ top: '85%', left: '15%' }}></div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-[#9FEF00]/5 rounded-bl-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-[#9FEF00]/5 rounded-tr-full blur-3xl pointer-events-none" />
      
        <div className="container mx-auto px-4 relative z-10 py-8 md:py-16 flex flex-col min-h-screen justify-center">
          {/* Back button */}
          <div className="absolute top-4 left-4 md:top-8 md:left-8 z-20">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleBack}
              className="group bg-black/40 text-white/70 hover:text-[#9FEF00] hover:bg-[#9FEF00]/10 border border-[#9FEF00]/20 rounded-md px-4 py-2 flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
              <span className="text-sm font-mono">Back</span>
            </Button>
          </div>
          
          <motion.div 
            className="text-center space-y-4 mb-10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-white/80 max-w-2xl mx-auto text-lg">
              Create your financial twin and navigate through life's challenges.
              Make decisions, face unexpected events, and build your financial future.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-5xl mx-auto mb-12 p-8 rounded-lg bg-black/40 backdrop-blur-sm border border-[#9FEF00]/20 shadow-[0_0_30px_rgba(159,239,0,0.1)]"
          >
            <div className="flex items-center justify-center mb-8">
              <div className="h-0.5 w-12 bg-[#9FEF00]/30 mr-4"></div>
              <h2 className="text-xl md:text-2xl font-bold text-center font-mono text-white">
                Choose Your <span className="text-[#9FEF00]">Career Path</span>
              </h2>
              <div className="h-0.5 w-12 bg-[#9FEF00]/30 ml-4"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {careerOptions.map((career, index) => (
                <CareerCard 
                  key={career.title}
                  career={career}
                  onSelect={() => startGame(career.title)}
                />
              ))}
            </div>
          </motion.div>
          
          <div className="text-center text-sm text-white/50 font-mono">
            <Code className="inline-block h-3 w-3 mr-1" />
            <span>Each career path offers unique financial challenges and opportunities</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-10">
        <div className="absolute inset-0 grid grid-cols-[repeat(30,1fr)] grid-rows-[repeat(30,1fr)]">
          {Array.from({ length: 900 }).map((_, i) => (
            <div 
              key={i} 
              className="border-r border-b border-[#9FEF00]/10" 
              style={{ 
                animation: `pulse ${Math.random() * 4 + 3}s infinite ${Math.random() * 5}s ease-in-out`,
                opacity: Math.random() * 0.3
              }}
            />
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-transparent to-black/80"></div>
      </div>
      
      {/* Header only shown when game is started */}
      <div className="border-b border-[#9FEF00]/20 bg-black/60 backdrop-blur-md relative z-10">
        <div className="container mx-auto py-4 px-4">
          <motion.div 
            className="flex flex-col md:flex-row justify-between items-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center">
              <div className="h-12 w-12 mr-3 bg-[#9FEF00]/10 rounded-lg p-1 border border-[#9FEF00]/30 flex items-center justify-center">
                <CareerSprite 
                  career={selectedCareer || ''} 
                  className="w-10 h-10" 
                />
              </div>
              <div>
                <p className="text-sm text-white/60 font-mono">
                  <Code className="inline h-3 w-3 mr-1 text-[#9FEF00]" />
                  Career: <span className="text-[#9FEF00]">{selectedCareer}</span>
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                onClick={handleBack}
                className="border-[#9FEF00]/20 hover:bg-[#9FEF00]/10 hover:text-[#9FEF00] text-white/80 group"
              >
                <ChevronLeft className="mr-1 h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
                <span className="font-mono">Back</span>
              </Button>
              
              <Button 
                variant="outline" 
                onClick={resetGame}
                className="border-[#9FEF00]/20 hover:bg-[#9FEF00]/10 hover:text-[#9FEF00] text-white/80"
              >
                <Terminal className="mr-2 h-4 w-4" />
                Choose Different Career
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Main game area */}
      <div className="container mx-auto relative z-10">
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
  // Get career-specific icon
  const getCareerIcon = () => {
    switch(career.title) {
      case "Student": return <Award className="text-[#9FEF00] h-5 w-5" />;
      case "Entrepreneur": return <Zap className="text-[#9FEF00] h-5 w-5" />;
      case "Artist": return <Waves className="text-[#9FEF00] h-5 w-5" />;
      case "Banker": return <Code className="text-[#9FEF00] h-5 w-5" />;
      default: return <Terminal className="text-[#9FEF00] h-5 w-5" />;
    }
  };

  // Get career-specific description
  const getCareerDetails = () => {
    switch(career.title) {
      case "Student":
        return "Navigate educational expenses and part-time jobs while building skills for the future.";
      case "Entrepreneur":
        return "Build your business from the ground up, managing investments and unpredictable income.";
      case "Artist":
        return "Balance creative passions with practical financial needs in a competitive market.";
      case "Banker":
        return "Leverage your financial expertise with high income but significant responsibilities.";
      default:
        return career.description;
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -5 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card 
        className="overflow-hidden rounded-lg border-[#9FEF00]/20 bg-black/40 backdrop-blur-sm hover:shadow-[0_0_20px_rgba(159,239,0,0.2)] transition-all cursor-pointer group" 
        onClick={onSelect}
      >
        <div className="relative overflow-hidden">
          {/* Card background animation */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#9FEF00]/0 to-[#9FEF00]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#9FEF00]/0 group-hover:bg-[#9FEF00]/30 transition-colors duration-500"></div>
          
          <div className="p-6 space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-24 h-24 bg-[#9FEF00]/5 border border-[#9FEF00]/20 p-2 group-hover:shadow-[0_0_15px_rgba(159,239,0,0.3)] transition-all relative rounded-lg">
                <div className="absolute inset-0 bg-[#9FEF00]/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <CareerSprite career={career.title} className="w-full h-full relative z-10" />
              </div>
              
              <div className="space-y-1 text-center">
                <h3 className="text-xl font-bold text-white flex items-center justify-center space-x-2">
                  <span>{getCareerIcon()}</span> 
                  <span className="ml-2 group-hover:text-[#9FEF00] transition-colors">{career.title}</span>
                </h3>
                <div className="h-0.5 w-12 mx-auto bg-[#9FEF00]/20"></div>
              </div>
            </div>
            
            <p className="text-white/60 text-center text-sm min-h-[60px]">{getCareerDetails()}</p>
            
            <Button 
              className="w-full bg-black hover:bg-[#9FEF00]/20 border border-[#9FEF00]/30 text-white hover:text-[#9FEF00] shadow-md group-hover:shadow-[0_0_10px_rgba(159,239,0,0.2)] transition-all" 
              variant="outline"
              size="sm"
            >
              <span className="text-[#9FEF00]">&gt;</span>
              <span className="mx-1">Start Journey</span>
              <span className="text-[#9FEF00] animate-pulse">_</span>
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
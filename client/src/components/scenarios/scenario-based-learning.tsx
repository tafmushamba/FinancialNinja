import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowRight, 
  BarChart, 
  BookOpen, 
  ChevronRight,
  DollarSign, 
  CreditCard, 
  PiggyBank, 
  Briefcase,
  Home,
  GraduationCap,
  Car,
  Heart,
  BarChart4,
  Lock,
  TrendingUp,
  Sunrise,
  Bus,
  Trophy,
  Unlock
} from 'lucide-react';

// Types
export interface ScenarioOption {
  id: string;
  text: string;
  icon: React.ReactNode;
  impact: {
    financial: number;
    knowledge: number;
    happiness: number;
    stress: number;
  };
  consequence: string;
  explanation: string;
  tips: string[];
}

export interface ScenarioStage {
  id: string;
  title: string;
  description: string;
  image?: string;
  options: ScenarioOption[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: 'budgeting' | 'investing' | 'saving' | 'credit' | 'debt' | 'housing' | 'retirement' | 'career' | 'education';
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  image?: string;
  stages: ScenarioStage[];
  completionReward: {
    points: number;
    badge?: string;
    unlocks?: string[];
  };
  category: 'budgeting' | 'investing' | 'saving' | 'credit' | 'debt' | 'housing' | 'retirement' | 'career' | 'education';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // in minutes
  locked?: boolean; // indicates if scenario is locked or available
}

export interface UserStats {
  financial: number;
  knowledge: number;
  happiness: number;
  stress: number;
}

const categoryIcons = {
  budgeting: <BarChart className="h-5 w-5" />,
  investing: <TrendingUp className="h-5 w-5" />,
  saving: <PiggyBank className="h-5 w-5" />,
  credit: <CreditCard className="h-5 w-5" />,
  debt: <DollarSign className="h-5 w-5" />,
  housing: <Home className="h-5 w-5" />,
  retirement: <Sunrise className="h-5 w-5" />,
  career: <Briefcase className="h-5 w-5" />,
  education: <GraduationCap className="h-5 w-5" />
};

const difficultyColors = {
  beginner: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  intermediate: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  advanced: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
};

// Sample scenario data (we would eventually fetch this from the API)
const sampleScenario: Scenario = {
  id: 'first-job-budgeting',
  title: 'First Job Budgeting',
  description: 'You just landed your first job! Now you need to set up a budget to manage your income. Make smart financial decisions to secure your future.',
  image: '/scenarios/first-job.jpg',
  category: 'budgeting',
  difficulty: 'beginner',
  estimatedTime: 10,
  completionReward: {
    points: 50,
    badge: 'budget-master',
    unlocks: ['investing-basics']
  },
  stages: [
    {
      id: 'income-allocation',
      title: 'Income Allocation',
      description: "You've received your first paycheck of £2,000. How will you allocate your income?",
      difficulty: 'beginner',
      category: 'budgeting',
      options: [
        {
          id: 'balanced-approach',
          text: 'Use the 50/30/20 rule: 50% needs, 30% wants, 20% savings',
          icon: <BarChart4 />,
          impact: {
            financial: 80,
            knowledge: 75,
            happiness: 70,
            stress: -60
          },
          consequence: 'You\'ve created a balanced budget that allows for enjoying life while building financial security.',
          explanation: 'The 50/30/20 rule is a sustainable budgeting method that balances current lifestyle with future goals.',
          tips: [
            'Track your expenses to ensure you\'re sticking to your percentages',
            'Consider automating transfers to savings accounts',
            'Review and adjust the percentages as your income changes'
          ]
        },
        {
          id: 'spend-freely',
          text: 'Spend freely and enjoy your income, saving whatever is left at the end',
          icon: <Heart />,
          impact: {
            financial: 20,
            knowledge: 10,
            happiness: 90,
            stress: -40
          },
          consequence: 'You had a great month, but now you have very little savings and are worried about unexpected expenses.',
          explanation: 'Without a plan, spending often exceeds what\'s sustainable, leaving little for emergencies or future goals.',
          tips: [
            'Try setting up automatic transfers to savings as soon as you get paid',
            'Use budgeting apps to track where your money is going',
            'Set spending limits for discretionary categories'
          ]
        },
        {
          id: 'extreme-saving',
          text: 'Live extremely frugally and save most of your income',
          icon: <PiggyBank />,
          impact: {
            financial: 95,
            knowledge: 60,
            happiness: 40,
            stress: -50
          },
          consequence: 'Your savings are growing quickly, but you\'re feeling deprived and unsatisfied with your lifestyle.',
          explanation: 'Extreme frugality can accelerate savings but may not be sustainable long-term if it affects your quality of life too much.',
          tips: [
            'Build some "fun money" into your budget to prevent burnout',
            'Focus on cutting large expenses rather than denying small pleasures',
            'Set clear savings goals so you can see the purpose behind the sacrifice'
          ]
        }
      ]
    },
    {
      id: 'emergency-fund',
      title: 'Building an Emergency Fund',
      description: "Financial experts recommend having an emergency fund. What approach will you take?",
      difficulty: 'beginner',
      category: 'saving',
      options: [
        {
          id: 'three-to-six',
          text: 'Save 3-6 months of expenses in a high-interest savings account',
          icon: <PiggyBank />,
          impact: {
            financial: 85,
            knowledge: 80,
            happiness: 65,
            stress: -80
          },
          consequence: 'You have a solid safety net for unexpected expenses or income loss.',
          explanation: '3-6 months of expenses is the generally recommended amount for emergency funds, balancing security with opportunity cost.',
          tips: [
            'Shop around for the best interest rates on savings accounts',
            'Keep your emergency fund separate from your regular accounts to avoid temptation',
            'Once complete, redirect this savings to other financial goals'
          ]
        },
        {
          id: 'minimal-emergency',
          text: 'Save just £1,000 for emergencies and focus on other financial goals',
          icon: <DollarSign />,
          impact: {
            financial: 60,
            knowledge: 50,
            happiness: 75,
            stress: -40
          },
          consequence: 'Your small emergency fund helps with minor issues but leaves you vulnerable to bigger financial shocks.',
          explanation: 'A minimal emergency fund is better than nothing and may be appropriate while paying off high-interest debt, but provides limited protection.',
          tips: [
            'Increase your emergency fund over time as other financial pressures decrease',
            'Consider supplementing with low-interest credit options for true emergencies',
            'Prioritize building this up further after addressing high-interest debt'
          ]
        },
        {
          id: 'credit-reliance',
          text: 'Rely on credit cards for emergencies instead of saving cash',
          icon: <CreditCard />,
          impact: {
            financial: 30,
            knowledge: 40,
            happiness: 60,
            stress: -20
          },
          consequence: 'When an emergency arose, you went into high-interest debt, creating additional financial stress.',
          explanation: 'Credit cards charge high interest rates and relying on them for emergencies can lead to growing debt problems during already difficult times.',
          tips: [
            'Start building even a small emergency fund to reduce reliance on credit',
            'If you must use credit in an emergency, have a concrete plan to pay it off quickly',
            'Look into lower-interest emergency options like personal lines of credit'
          ]
        }
      ]
    },
    {
      id: 'transport-decision',
      title: 'Transportation Decision',
      description: "You need reliable transportation for your job. What will you choose?",
      difficulty: 'beginner',
      category: 'budgeting',
      options: [
        {
          id: 'public-transport',
          text: 'Use public transportation or cycling/walking when possible',
          icon: <Bus />,
          impact: {
            financial: 90,
            knowledge: 60,
            happiness: 65,
            stress: -60
          },
          consequence: 'You\'re saving significantly on transportation costs, though your commute takes longer.',
          explanation: 'Public transport is typically the most cost-effective option, eliminating expenses for car payments, insurance, maintenance, fuel, and parking.',
          tips: [
            'Look for monthly or annual transit passes to save further',
            'Use commute time productively (reading, learning, planning)',
            'Consider the health benefits of active transportation like walking or cycling'
          ]
        },
        {
          id: 'used-car',
          text: 'Buy a reliable used car with cash',
          icon: <Car />,
          impact: {
            financial: 60,
            knowledge: 75,
            happiness: 80,
            stress: -70
          },
          consequence: 'You have the convenience of a car without the burden of car payments, though you still have ongoing costs.',
          explanation: 'A paid-off used car balances convenience with financial prudence, avoiding depreciation while minimizing ongoing debt.',
          tips: [
            'Budget for insurance, fuel, maintenance, and repairs',
            'Research reliable models with good fuel efficiency',
            'Have a mechanic inspect before purchasing'
          ]
        },
        {
          id: 'new-car-loan',
          text: 'Finance a new car with monthly payments',
          icon: <CreditCard />,
          impact: {
            financial: 30,
            knowledge: 65,
            happiness: 90,
            stress: -40
          },
          consequence: 'You enjoy your new car, but the payments, insurance, and depreciation are straining your budget.',
          explanation: 'New cars lose significant value immediately and continue depreciating rapidly, while also requiring higher insurance and oftentimes generating loan interest.',
          tips: [
            'If choosing this route, aim to keep total transportation costs below 15% of income',
            'Consider leasing if you prefer driving newer vehicles',
            'Make extra payments when possible to reduce the loan term'
          ]
        }
      ]
    }
  ]
};

// Sample ongoing scenarios
const ongoingScenarios: Scenario[] = [
  {
    id: 'investing-basics',
    title: 'Investment Fundamentals',
    description: 'Learn the basics of investing and start building your portfolio with this hands-on scenario.',
    image: '/scenarios/investing.jpg',
    category: 'investing',
    difficulty: 'intermediate',
    estimatedTime: 15,
    completionReward: {
      points: 75,
      badge: 'investor-initiate',
      unlocks: ['stock-market-mastery']
    },
    stages: []
  },
  {
    id: 'credit-score-builder',
    title: 'Building Your Credit Score',
    description: 'Navigate the world of credit and learn how to build a strong credit history without falling into debt traps.',
    image: '/scenarios/credit.jpg',
    category: 'credit',
    difficulty: 'beginner',
    estimatedTime: 12,
    completionReward: {
      points: 60,
      badge: 'credit-maestro',
      unlocks: ['mortgage-readiness']
    },
    stages: []
  },
  {
    id: 'first-home-purchase',
    title: 'Buying Your First Home',
    description: 'Simulate the process of saving for and purchasing your first home in the UK market.',
    image: '/scenarios/home.jpg',
    category: 'housing',
    difficulty: 'advanced',
    estimatedTime: 20,
    completionReward: {
      points: 100,
      badge: 'property-pioneer',
      unlocks: ['property-investment']
    },
    stages: [],
    locked: true
  }
];

// Component to display a scenario card for selection
interface ScenarioCardProps {
  scenario: Scenario;
  onClick: () => void;
}

const ScenarioCard: React.FC<ScenarioCardProps> = ({ scenario, onClick }) => {
  return (
    <Card 
      className={`overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer ${scenario.locked ? 'opacity-70' : ''}`}
      onClick={scenario.locked ? undefined : onClick}
    >
      <div className="relative overflow-hidden h-40">
        {scenario.image ? (
          <div 
            className="absolute inset-0 bg-cover bg-center" 
            style={{ backgroundImage: `url(${scenario.image})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/10" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600" />
        )}
        
        <div className="absolute bottom-0 p-4 text-white">
          <div className="flex items-center justify-between w-full">
            <Badge className={difficultyColors[scenario.difficulty]}>
              {scenario.difficulty.charAt(0).toUpperCase() + scenario.difficulty.slice(1)}
            </Badge>
            <Badge variant="outline" className="bg-black/30 text-white border-white/20">
              {scenario.estimatedTime} min
            </Badge>
          </div>
          <h3 className="text-xl font-bold mt-2">{scenario.title}</h3>
        </div>
        
        {scenario.locked && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="flex flex-col items-center text-white">
              <Lock className="h-8 w-8 mb-2" />
              <p className="text-sm">Complete prerequisites to unlock</p>
            </div>
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-center space-x-2 mb-3">
          {categoryIcons[scenario.category]}
          <span className="text-sm font-medium">
            {scenario.category.charAt(0).toUpperCase() + scenario.category.slice(1)}
          </span>
        </div>
        
        <p className="text-muted-foreground text-sm mb-4">{scenario.description}</p>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4 text-green-500" />
            <span className="text-sm">{scenario.completionReward.points} pts</span>
          </div>
          
          {!scenario.locked && (
            <Button variant="ghost" size="sm" className="gap-1">
              Start <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Component to display a scenario option
interface ScenarioOptionCardProps {
  option: ScenarioOption;
  onSelect: () => void;
  selected: boolean;
}

const ScenarioOptionCard: React.FC<ScenarioOptionCardProps> = ({ option, onSelect, selected }) => {
  return (
    <div 
      className={`border rounded-lg p-4 cursor-pointer transition-all ${
        selected 
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md ring-2 ring-blue-500/50' 
          : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
      }`}
      onClick={onSelect}
    >
      <div className="flex gap-3">
        <div className={`rounded-full p-2 ${selected ? 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}`}>
          {option.icon}
        </div>
        <div className="flex-1">
          <p className="font-medium">{option.text}</p>
        </div>
      </div>
    </div>
  );
};

// Component to display feedback after making a choice
interface FeedbackCardProps {
  option: ScenarioOption;
  onContinue: () => void;
}

const FeedbackCard: React.FC<FeedbackCardProps> = ({ option, onContinue }) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="border rounded-lg p-6 bg-white dark:bg-gray-800 shadow-lg"
      >
        <h3 className="text-xl font-bold mb-4">Result</h3>
        <p className="mb-4">{option.consequence}</p>
        
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Financial Impact</p>
            <Progress value={option.impact.financial} className="h-2 mb-1" />
            <p className="text-xs text-right">{option.impact.financial}/100</p>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground mb-1">Knowledge Gained</p>
            <Progress value={option.impact.knowledge} className="h-2 mb-1" />
            <p className="text-xs text-right">{option.impact.knowledge}/100</p>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground mb-1">Happiness</p>
            <Progress value={option.impact.happiness} className="h-2 mb-1" />
            <p className="text-xs text-right">{option.impact.happiness}/100</p>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground mb-1">Stress Reduction</p>
            <Progress value={Math.abs(option.impact.stress)} className="h-2 mb-1" />
            <p className="text-xs text-right">{Math.abs(option.impact.stress)}/100</p>
          </div>
        </div>
        
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
          <h4 className="font-medium mb-2">Financial Insight</h4>
          <p className="text-sm">{option.explanation}</p>
        </div>
        
        <div>
          <h4 className="font-medium mb-2">Expert Tips</h4>
          <ul className="list-disc pl-5 space-y-1">
            {option.tips.map((tip, index) => (
              <li key={index} className="text-sm">{tip}</li>
            ))}
          </ul>
        </div>
        
        <div className="mt-6 flex justify-end">
          <Button onClick={onContinue}>
            Continue <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

// Component to display completion summary
interface CompletionSummaryProps {
  scenario: Scenario;
  userStats: UserStats;
  choices: ScenarioOption[];
  onFinish: () => void;
}

const CompletionSummary: React.FC<CompletionSummaryProps> = ({ scenario, userStats, choices, onFinish }) => {
  // Calculate average stats
  const avgFinancial = choices.reduce((sum, choice) => sum + choice.impact.financial, 0) / choices.length;
  const avgKnowledge = choices.reduce((sum, choice) => sum + choice.impact.knowledge, 0) / choices.length;
  const avgHappiness = choices.reduce((sum, choice) => sum + choice.impact.happiness, 0) / choices.length;
  const avgStressReduction = choices.reduce((sum, choice) => sum + Math.abs(choice.impact.stress), 0) / choices.length;
  
  // Calculate overall score (weighted average)
  const overallScore = Math.round(
    (avgFinancial * 0.4) + 
    (avgKnowledge * 0.3) + 
    (avgHappiness * 0.2) + 
    (avgStressReduction * 0.1)
  );
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="border rounded-lg p-6 bg-white dark:bg-gray-800 shadow-lg"
      >
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 mb-4">
            <DollarSign className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold">Scenario Complete!</h2>
          <p className="text-muted-foreground">You've completed the {scenario.title} scenario</p>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Your Score</h3>
            <div className="text-2xl font-bold">{overallScore}/100</div>
          </div>
          
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Financial Decision Quality</span>
                <span>{Math.round(avgFinancial)}%</span>
              </div>
              <Progress value={avgFinancial} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Knowledge Application</span>
                <span>{Math.round(avgKnowledge)}%</span>
              </div>
              <Progress value={avgKnowledge} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Life Satisfaction Balance</span>
                <span>{Math.round(avgHappiness)}%</span>
              </div>
              <Progress value={avgHappiness} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Stress Management</span>
                <span>{Math.round(avgStressReduction)}%</span>
              </div>
              <Progress value={avgStressReduction} className="h-2" />
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
          <h3 className="font-semibold mb-2">Rewards Earned</h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <span className="font-medium">{scenario.completionReward.points} points</span>
            </div>
            
            {scenario.completionReward.badge && (
              <div className="flex items-center space-x-2">
                <Trophy className="h-5 w-5 text-amber-500" />
                <span className="font-medium">New Badge</span>
              </div>
            )}
            
            {scenario.completionReward.unlocks && scenario.completionReward.unlocks.length > 0 && (
              <div className="flex items-center space-x-2">
                <Unlock className="h-5 w-5 text-blue-500" />
                <span className="font-medium">{scenario.completionReward.unlocks.length} Scenario{scenario.completionReward.unlocks.length > 1 ? 's' : ''} Unlocked</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Your Choices</h3>
          <div className="space-y-3">
            {choices.map((choice, index) => (
              <div key={index} className="p-3 bg-gray-50 dark:bg-gray-900 rounded border dark:border-gray-700">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Stage {index + 1}</span>
                  <span className="text-xs text-muted-foreground">Score: {Math.round((choice.impact.financial * 0.4) + (choice.impact.knowledge * 0.3) + (choice.impact.happiness * 0.2) + (Math.abs(choice.impact.stress) * 0.1))}/100</span>
                </div>
                <p className="text-sm">{choice.text}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button onClick={onFinish}>
            Finish & Return to Scenarios
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

// Main scenario-based learning component
interface ScenarioBasedLearningProps {
  onComplete?: (scenario: Scenario, score: number) => void;
}

export const ScenarioBasedLearning: React.FC<ScenarioBasedLearningProps> = ({ onComplete }) => {
  const [mode, setMode] = useState<'selection' | 'scenario'>('selection');
  const [activeScenario, setActiveScenario] = useState<Scenario | null>(null);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<ScenarioOption | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [userChoices, setUserChoices] = useState<ScenarioOption[]>([]);
  const [userStats, setUserStats] = useState<UserStats>({
    financial: 50,
    knowledge: 50,
    happiness: 50,
    stress: 50
  });
  
  const handleScenarioSelect = (scenario: Scenario) => {
    setActiveScenario(scenario);
    setCurrentStageIndex(0);
    setSelectedOption(null);
    setShowFeedback(false);
    setShowCompletion(false);
    setUserChoices([]);
    setMode('scenario');
  };
  
  const handleOptionSelect = (option: ScenarioOption) => {
    setSelectedOption(option);
  };
  
  const handleContinue = () => {
    if (!activeScenario || !selectedOption) return;
    
    // Update user stats based on the selected option
    setUserStats(prev => ({
      financial: Math.min(100, Math.max(0, prev.financial + (selectedOption.impact.financial - 50) / 5)),
      knowledge: Math.min(100, Math.max(0, prev.knowledge + (selectedOption.impact.knowledge - 50) / 5)),
      happiness: Math.min(100, Math.max(0, prev.happiness + (selectedOption.impact.happiness - 50) / 5)),
      stress: Math.min(100, Math.max(0, prev.stress + selectedOption.impact.stress / 5))
    }));
    
    // Add the choice to the user's choices
    setUserChoices(prev => [...prev, selectedOption]);
    
    // Move to the next stage or show completion
    if (currentStageIndex < activeScenario.stages.length - 1) {
      setCurrentStageIndex(prevIndex => prevIndex + 1);
      setSelectedOption(null);
      setShowFeedback(false);
    } else {
      setShowCompletion(true);
    }
  };
  
  const handleSubmitChoice = () => {
    if (selectedOption) {
      setShowFeedback(true);
    }
  };
  
  const handleFinish = () => {
    if (activeScenario) {
      // Calculate average stats
      const avgFinancial = userChoices.reduce((sum, choice) => sum + choice.impact.financial, 0) / userChoices.length;
      const avgKnowledge = userChoices.reduce((sum, choice) => sum + choice.impact.knowledge, 0) / userChoices.length;
      const avgHappiness = userChoices.reduce((sum, choice) => sum + choice.impact.happiness, 0) / userChoices.length;
      const avgStressReduction = userChoices.reduce((sum, choice) => sum + Math.abs(choice.impact.stress), 0) / userChoices.length;
      
      // Calculate overall score (weighted average)
      const overallScore = Math.round(
        (avgFinancial * 0.4) + 
        (avgKnowledge * 0.3) + 
        (avgHappiness * 0.2) + 
        (avgStressReduction * 0.1)
      );
      
      // Call the onComplete callback if provided
      if (onComplete) {
        onComplete(activeScenario, overallScore);
      }
    }
    
    // Reset state and go back to selection
    setActiveScenario(null);
    setCurrentStageIndex(0);
    setSelectedOption(null);
    setShowFeedback(false);
    setShowCompletion(false);
    setUserChoices([]);
    setMode('selection');
  };
  
  const currentStage = activeScenario?.stages[currentStageIndex];
  
  return (
    <div className="container mx-auto p-4">
      {mode === 'selection' ? (
        <>
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Financial Scenarios</h1>
            <p className="text-muted-foreground">
              Learn by doing! Explore realistic financial scenarios and practice making smart financial decisions.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ScenarioCard 
              scenario={sampleScenario} 
              onClick={() => handleScenarioSelect(sampleScenario)} 
            />
            
            {ongoingScenarios.map(scenario => (
              <ScenarioCard 
                key={scenario.id} 
                scenario={scenario} 
                onClick={() => handleScenarioSelect(scenario)} 
              />
            ))}
          </div>
        </>
      ) : (
        <>
          {/* Back button */}
          <Button 
            variant="ghost" 
            className="mb-4" 
            onClick={() => {
              if (showCompletion) {
                handleFinish();
              } else if (showFeedback) {
                setShowFeedback(false);
              } else if (currentStageIndex > 0) {
                setCurrentStageIndex(prev => prev - 1);
                setUserChoices(prev => prev.slice(0, -1));
                setSelectedOption(null);
              } else {
                setMode('selection');
              }
            }}
          >
            ← Back
          </Button>
          
          {activeScenario && currentStage && !showCompletion && (
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-2xl font-bold">{activeScenario.title}</h2>
                <Badge className={difficultyColors[activeScenario.difficulty]}>
                  {activeScenario.difficulty.charAt(0).toUpperCase() + activeScenario.difficulty.slice(1)}
                </Badge>
              </div>
              
              <div className="flex space-x-2 mb-4">
                <Badge variant="outline" className="flex items-center gap-1">
                  {categoryIcons[activeScenario.category]}
                  <span>{activeScenario.category.charAt(0).toUpperCase() + activeScenario.category.slice(1)}</span>
                </Badge>
                
                <Badge variant="outline" className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  <span>Stage {currentStageIndex + 1} of {activeScenario.stages.length}</span>
                </Badge>
              </div>
              
              <Progress 
                value={(currentStageIndex / activeScenario.stages.length) * 100} 
                className="h-1 mb-6" 
              />
            </div>
          )}
          
          {showCompletion && activeScenario ? (
            <CompletionSummary 
              scenario={activeScenario}
              userStats={userStats}
              choices={userChoices}
              onFinish={handleFinish}
            />
          ) : showFeedback && selectedOption ? (
            <FeedbackCard 
              option={selectedOption}
              onContinue={handleContinue}
            />
          ) : currentStage ? (
            <Card>
              <CardHeader>
                <CardTitle>{currentStage.title}</CardTitle>
                <p className="text-muted-foreground">{currentStage.description}</p>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  {currentStage.options.map(option => (
                    <ScenarioOptionCard
                      key={option.id}
                      option={option}
                      selected={selectedOption?.id === option.id}
                      onSelect={() => handleOptionSelect(option)}
                    />
                  ))}
                </div>
              </CardContent>
              
              <CardFooter className="justify-end">
                <Button 
                  disabled={!selectedOption} 
                  onClick={handleSubmitChoice}
                >
                  Submit Decision
                </Button>
              </CardFooter>
            </Card>
          ) : null}
        </>
      )}
    </div>
  );
};

// Using the icons imported from lucide-react at the top of the file

export default ScenarioBasedLearning;
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { AlertCircle, Briefcase, CreditCard, DollarSign, GraduationCap, Home, PiggyBank, Sunrise, Tag, Clipboard, Check, CheckCircle2, BadgeAlert, ArrowRight } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

// Type definitions
interface LifeStage {
  id: string;
  title: string;
  description: string;
  background: string;
  icon: React.ReactNode;
  startingScenario: Scenario;
}

interface Scenario {
  id: string;
  title: string;
  description: string;
  image?: string;
  financialSituation: FinancialSituation;
  decisions: Decision[];
}

interface Decision {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  outcomes: {
    description: string;
    financialImpact: FinancialImpact;
    nextScenario?: string;
    consequences: string;
    skillsGained?: string[];
    badge?: {
      id: string;
      name: string;
      description: string;
      icon: React.ReactNode;
    };
  }
}

interface FinancialSituation {
  income: number;
  savings: number;
  debt: number;
  expenses: number;
  assets: number;
  creditScore: number;
}

interface FinancialImpact {
  income?: number;
  savings?: number;
  debt?: number;
  expenses?: number;
  assets?: number;
  creditScore?: number;
}

interface GameHistory {
  scenario: string;
  decision: string;
  outcome: string;
  financialImpact: FinancialImpact;
  timestamp: Date;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  earned: boolean;
  earnedDate?: Date;
}

interface GameState {
  playerName: string;
  age: number;
  currentLifeStage: string;
  currentScenario: string;
  financialSituation: FinancialSituation;
  history: GameHistory[];
  badges: Badge[];
  skillsLevels: {
    budgeting: number;
    investing: number;
    debtManagement: number;
    planning: number;
    riskManagement: number;
  };
  gameCompleted: boolean;
}

// Life stages data
const lifeStages: LifeStage[] = [
  {
    id: "young-adult",
    title: "Young Adult (18-25)",
    description: "Starting out in life with education and early career choices",
    background: "bg-gradient-to-r from-violet-500 to-purple-500",
    icon: <GraduationCap />,
    startingScenario: {
      id: "education-choice",
      title: "Education Path",
      description: "You've just finished school. What's your next step for education or training?",
      financialSituation: {
        income: 0,
        savings: 2000,
        debt: 0,
        expenses: 800,
        assets: 500,
        creditScore: 650
      },
      decisions: [
        {
          id: "university",
          title: "University Degree",
          description: "Pursue a university degree with student loans",
          icon: <GraduationCap />,
          outcomes: {
            description: "You decide to pursue a university degree in business. This requires taking on student loans, but offers potential for higher future earnings.",
            financialImpact: {
              debt: 9000,
              expenses: 1200,
              creditScore: -10
            },
            nextScenario: "university-life",
            consequences: "You'll graduate in 3 years with significant student debt, but with a valuable degree that may increase your earning potential.",
            skillsGained: ["planning", "budgeting"],
            badge: {
              id: "academic-pursuit",
              name: "Academic Pursuit",
              description: "Chose to invest in higher education",
              icon: <GraduationCap />
            }
          }
        },
        {
          id: "apprenticeship",
          title: "Apprenticeship",
          description: "Start an apprenticeship with immediate income",
          icon: <Briefcase />,
          outcomes: {
            description: "You begin an apprenticeship in a skilled trade, earning while you learn.",
            financialImpact: {
              income: 1200,
              expenses: 900,
              creditScore: 10
            },
            nextScenario: "first-pay",
            consequences: "You start earning right away but with lower initial income. You'll gain valuable practical skills without taking on debt.",
            skillsGained: ["budgeting", "planning"],
            badge: {
              id: "skilled-trades",
              name: "Skilled Trades",
              description: "Chose a practical skill-based career path",
              icon: <Briefcase />
            }
          }
        },
        {
          id: "work",
          title: "Full-time Work",
          description: "Jump straight into the workforce",
          icon: <DollarSign />,
          outcomes: {
            description: "You decide to start working immediately in an entry-level position.",
            financialImpact: {
              income: 1600,
              expenses: 1100,
              creditScore: 15
            },
            nextScenario: "first-job",
            consequences: "You'll have immediate income but may face limited career advancement without further qualifications.",
            skillsGained: ["budgeting"],
            badge: {
              id: "early-earner",
              name: "Early Earner",
              description: "Chose to enter the workforce immediately",
              icon: <DollarSign />
            }
          }
        }
      ]
    }
  },
  {
    id: "career-building",
    title: "Career Building (25-35)",
    description: "Advancing your career and making major financial commitments",
    background: "bg-gradient-to-r from-blue-500 to-teal-500",
    icon: <Briefcase />,
    startingScenario: {
      id: "career-opportunity",
      title: "Career Opportunity",
      description: "You have several options for advancing your career. What will you choose?",
      financialSituation: {
        income: 2500,
        savings: 8000,
        debt: 5000,
        expenses: 1800,
        assets: 3000,
        creditScore: 700
      },
      decisions: [
        {
          id: "job-offer",
          title: "New Job Offer",
          description: "Accept a higher-paying job in a new city",
          icon: <Briefcase />,
          outcomes: {
            description: "You accept a new position with better pay but in a city with a higher cost of living.",
            financialImpact: {
              income: 1000,
              expenses: 800,
              savings: -2000,
              creditScore: 15
            },
            nextScenario: "relocation",
            consequences: "Your income increases significantly, but you face relocation costs and higher living expenses in the new city.",
            skillsGained: ["planning", "riskManagement"],
            badge: {
              id: "career-climber",
              name: "Career Climber",
              description: "Made a bold career move for advancement",
              icon: <Briefcase />
            }
          }
        },
        {
          id: "further-education",
          title: "Further Education",
          description: "Invest in advanced qualifications",
          icon: <GraduationCap />,
          outcomes: {
            description: "You decide to pursue advanced qualifications while working part-time.",
            financialImpact: {
              income: -500,
              debt: 7000,
              expenses: 200,
              creditScore: -5
            },
            nextScenario: "study-and-work",
            consequences: "Your income temporarily decreases as you work part-time, and you take on some additional debt for education, but your future earning potential increases.",
            skillsGained: ["planning", "riskManagement"],
            badge: {
              id: "lifelong-learner",
              name: "Lifelong Learner",
              description: "Invested in continued education for long-term gain",
              icon: <GraduationCap />
            }
          }
        },
        {
          id: "entrepreneurship",
          title: "Start a Business",
          description: "Take a risk on your own business venture",
          icon: <Tag />,
          outcomes: {
            description: "You decide to start your own small business using your savings and a small business loan.",
            financialImpact: {
              income: -1000,
              savings: -5000,
              debt: 10000,
              expenses: 1000,
              creditScore: -20
            },
            nextScenario: "new-business",
            consequences: "You invest your savings and take on debt to start your business. Your income initially drops but there's potential for significant future growth if successful.",
            skillsGained: ["riskManagement", "planning", "budgeting"],
            badge: {
              id: "entrepreneur-spirit",
              name: "Entrepreneurial Spirit",
              description: "Took the bold step to start your own business",
              icon: <Tag />
            }
          }
        }
      ]
    }
  },
  {
    id: "family-life",
    title: "Family Life (35-50)",
    description: "Balancing family needs with financial security",
    background: "bg-gradient-to-r from-green-500 to-emerald-500",
    icon: <Home />,
    startingScenario: {
      id: "housing-decision",
      title: "Housing Decision",
      description: "Your family is growing and you need to make a housing decision.",
      financialSituation: {
        income: 4500,
        savings: 30000,
        debt: 15000,
        expenses: 3000,
        assets: 20000,
        creditScore: 720
      },
      decisions: [
        {
          id: "buy-house",
          title: "Buy a House",
          description: "Take out a mortgage to buy a family home",
          icon: <Home />,
          outcomes: {
            description: "You decide to buy a house using your savings for a down payment and taking out a mortgage.",
            financialImpact: {
              savings: -25000,
              debt: 250000,
              expenses: 500,
              assets: 300000,
              creditScore: 10
            },
            nextScenario: "new-homeowner",
            consequences: "You've invested in a property that may appreciate over time, but you now have significant mortgage debt and ongoing maintenance expenses.",
            skillsGained: ["planning", "budgeting"],
            badge: {
              id: "homeowner",
              name: "Homeowner",
              description: "Made the major financial commitment of buying a home",
              icon: <Home />
            }
          }
        },
        {
          id: "rent-larger",
          title: "Rent a Larger Place",
          description: "Rent a larger property to meet your family's needs",
          icon: <Home />,
          outcomes: {
            description: "You choose to rent a larger place that meets your family's needs without the long-term commitment of buying.",
            financialImpact: {
              expenses: 800,
              savings: 5000,
              creditScore: 5
            },
            nextScenario: "family-renting",
            consequences: "You maintain flexibility and avoid taking on large debt, but your monthly expenses increase and you're not building equity in a property.",
            skillsGained: ["budgeting"],
            badge: {
              id: "flexibility-first",
              name: "Flexibility First",
              description: "Chose housing flexibility over long-term property investment",
              icon: <Home />
            }
          }
        },
        {
          id: "renovate",
          title: "Renovate Current Home",
          description: "Stay put and renovate your current living space",
          icon: <Home />,
          outcomes: {
            description: "You decide to renovate your current living space to make it more suitable for your growing family.",
            financialImpact: {
              savings: -15000,
              debt: 10000,
              assets: 20000,
              creditScore: -5
            },
            nextScenario: "home-renovation",
            consequences: "You improve your current living situation and potentially increase your property value, but take on some debt for the renovations.",
            skillsGained: ["budgeting", "planning"],
            badge: {
              id: "home-improver",
              name: "Home Improver",
              description: "Invested in improving your existing property",
              icon: <Home />
            }
          }
        }
      ]
    }
  },
  {
    id: "pre-retirement",
    title: "Pre-Retirement (50-65)",
    description: "Preparing for retirement and maximizing savings",
    background: "bg-gradient-to-r from-orange-500 to-amber-500",
    icon: <PiggyBank />,
    startingScenario: {
      id: "retirement-planning",
      title: "Retirement Planning",
      description: "You're thinking about your retirement strategy with 15 years to go.",
      financialSituation: {
        income: 6000,
        savings: 100000,
        debt: 50000,
        expenses: 4000,
        assets: 350000,
        creditScore: 750
      },
      decisions: [
        {
          id: "aggressive-saving",
          title: "Aggressive Saving",
          description: "Maximize retirement contributions and reduce expenses",
          icon: <PiggyBank />,
          outcomes: {
            description: "You decide to maximize your retirement contributions and significantly reduce your expenses.",
            financialImpact: {
              income: -1000,
              expenses: -1000,
              savings: 24000,
              creditScore: 15
            },
            nextScenario: "retirement-focus",
            consequences: "You're setting yourself up for a more comfortable retirement, but living more frugally now and potentially missing out on some experiences.",
            skillsGained: ["planning", "budgeting"],
            badge: {
              id: "retirement-planner",
              name: "Retirement Planner",
              description: "Prioritized retirement security with aggressive saving",
              icon: <PiggyBank />
            }
          }
        },
        {
          id: "balanced-approach",
          title: "Balanced Approach",
          description: "Moderate saving while enjoying life now",
          icon: <PiggyBank />,
          outcomes: {
            description: "You take a balanced approach with moderate retirement saving while still enjoying life experiences.",
            financialImpact: {
              income: -500,
              expenses: 200,
              savings: 3600,
              creditScore: 5
            },
            nextScenario: "balance-life-retirement",
            consequences: "You're still preparing for retirement but at a more moderate pace, allowing you to enjoy your current lifestyle more.",
            skillsGained: ["planning", "budgeting"],
            badge: {
              id: "life-balancer",
              name: "Life Balancer",
              description: "Found the sweet spot between present enjoyment and future security",
              icon: <PiggyBank />
            }
          }
        },
        {
          id: "investment-focus",
          title: "Investment Focus",
          description: "Focus on growing your investment portfolio with higher-risk investments",
          icon: <CreditCard />,
          outcomes: {
            description: "You decide to focus on growing your wealth through higher-risk investments with potential for greater returns.",
            financialImpact: {
              savings: -50000,
              assets: 70000,
              creditScore: -10
            },
            nextScenario: "investment-growth",
            consequences: "You've reallocated some of your savings to potentially higher-return investments, which could significantly increase your retirement funds but also carries more risk.",
            skillsGained: ["investing", "riskManagement"],
            badge: {
              id: "investment-strategist",
              name: "Investment Strategist",
              description: "Took calculated investment risks for potential long-term gain",
              icon: <CreditCard />
            }
          }
        }
      ]
    }
  },
  {
    id: "retirement",
    title: "Retirement (65+)",
    description: "Managing finances in retirement",
    background: "bg-gradient-to-r from-red-500 to-rose-500",
    icon: <Sunrise />,
    startingScenario: {
      id: "retirement-lifestyle",
      title: "Retirement Lifestyle",
      description: "You've reached retirement age. How will you manage your finances in retirement?",
      financialSituation: {
        income: 3000,
        savings: 400000,
        debt: 20000,
        expenses: 2500,
        assets: 500000,
        creditScore: 780
      },
      decisions: [
        {
          id: "fixed-income",
          title: "Fixed Income Strategy",
          description: "Focus on stable, predictable income from low-risk investments",
          icon: <DollarSign />,
          outcomes: {
            description: "You reorganize your investments to focus on stable, predictable income streams with minimal risk.",
            financialImpact: {
              income: 200,
              savings: -30000,
              assets: -10000,
              creditScore: 10
            },
            nextScenario: "steady-retirement",
            consequences: "Your income is reliable and your risk is low, but your overall returns may not keep pace with inflation over the long term.",
            skillsGained: ["planning", "riskManagement"],
            badge: {
              id: "security-focused",
              name: "Security Focused",
              description: "Prioritized financial security in retirement",
              icon: <DollarSign />
            }
          }
        },
        {
          id: "downsize",
          title: "Downsize",
          description: "Sell your family home and move to a smaller property",
          icon: <Home />,
          outcomes: {
            description: "You sell your family home and move to a smaller, more manageable property.",
            financialImpact: {
              savings: 150000,
              expenses: -500,
              assets: -100000,
              creditScore: 5
            },
            nextScenario: "downsized-living",
            consequences: "You've increased your liquid savings and reduced your expenses, making your retirement funds more sustainable, but you've had to leave your family home.",
            skillsGained: ["planning", "budgeting"],
            badge: {
              id: "lifestyle-optimizer",
              name: "Lifestyle Optimizer",
              description: "Made practical housing decisions to enhance retirement security",
              icon: <Home />
            }
          }
        },
        {
          id: "part-time-work",
          title: "Part-Time Work",
          description: "Supplement your retirement income with part-time work",
          icon: <Briefcase />,
          outcomes: {
            description: "You decide to take on some part-time work to supplement your retirement income and stay active.",
            financialImpact: {
              income: 1200,
              expenses: 200,
              creditScore: 15
            },
            nextScenario: "working-retirement",
            consequences: "You have more income and stay engaged, but need to balance work with enjoying your retirement years.",
            skillsGained: ["budgeting"],
            badge: {
              id: "active-retiree",
              name: "Active Retiree",
              description: "Balanced retirement with continued participation in the workforce",
              icon: <Briefcase />
            }
          }
        }
      ]
    }
  }
];

// Additional scenarios that branch from the starting scenarios
const additionalScenarios: Record<string, Scenario> = {
  // Young Adult scenarios
  "university-life": {
    id: "university-life",
    title: "University Life",
    description: "You're now at university with student loans. How will you manage your finances?",
    financialSituation: {
      income: 800, // Part-time job
      savings: 1000,
      debt: 9000, // Student loans
      expenses: 1200,
      assets: 500,
      creditScore: 640
    },
    decisions: [
      {
        id: "frugal-living",
        title: "Live Frugally",
        description: "Minimize expenses by living frugally",
        icon: <PiggyBank />,
        outcomes: {
          description: "You choose to live very frugally, minimizing expenses and avoiding additional debt.",
          financialImpact: {
            expenses: -300,
            savings: 1200,
            creditScore: 20
          },
          nextScenario: "graduation",
          consequences: "You maintain lower debt but may miss out on some social experiences at university.",
          skillsGained: ["budgeting"],
          badge: {
            id: "budget-master",
            name: "Budget Master",
            description: "Successfully maintained tight budget controls during education",
            icon: <PiggyBank />
          }
        }
      },
      {
        id: "work-study",
        title: "Work More Hours",
        description: "Take on more work hours to earn extra income",
        icon: <Briefcase />,
        outcomes: {
          description: "You work more hours alongside your studies to earn extra income.",
          financialImpact: {
            income: 400,
            expenses: 100,
            savings: 900,
            creditScore: 15
          },
          nextScenario: "graduation",
          consequences: "You have more income, but less time for studies and social activities.",
          skillsGained: ["budgeting", "planning"],
          badge: {
            id: "work-ethic",
            name: "Work Ethic",
            description: "Balanced work and education effectively",
            icon: <Briefcase />
          }
        }
      },
      {
        id: "credit-card",
        title: "Use Credit Cards",
        description: "Use credit cards to maintain lifestyle",
        icon: <CreditCard />,
        outcomes: {
          description: "You use credit cards to maintain a better lifestyle during university.",
          financialImpact: {
            debt: 3000,
            expenses: 200,
            creditScore: -30
          },
          nextScenario: "graduation-with-debt",
          consequences: "You enjoy university life more but graduate with additional debt.",
          skillsGained: [],
          badge: {
            id: "credit-dependent",
            name: "Credit Dependent",
            description: "Relied heavily on credit during education",
            icon: <CreditCard />
          }
        }
      }
    ]
  },
  
  // More scenarios would be added here
  
  // Final scenario that concludes the game
  "game-conclusion": {
    id: "game-conclusion",
    title: "Financial Life Journey Complete",
    description: "You've navigated through the key financial stages of life. Let's see how you did!",
    financialSituation: {
      income: 0, // Will be set based on player's current situation
      savings: 0,
      debt: 0,
      expenses: 0,
      assets: 0,
      creditScore: 0
    },
    decisions: [
      {
        id: "view-results",
        title: "View Your Results",
        description: "See a summary of your financial journey and achievements",
        icon: <Clipboard />,
        outcomes: {
          description: "Your financial life journey is complete. Here's a summary of your achievements and final financial position.",
          financialImpact: {},
          consequences: "Game complete. You can restart to try different financial decisions.",
          skillsGained: []
        }
      }
    ]
  }
};

// The main game component
export function LifeSimulationGame() {
  // State for the game
  const [gameState, setGameState] = useState<GameState>({
    playerName: "Player",
    age: 18,
    currentLifeStage: "young-adult",
    currentScenario: "education-choice",
    financialSituation: {
      income: 0,
      savings: 2000,
      debt: 0,
      expenses: 800,
      assets: 500,
      creditScore: 650
    },
    history: [],
    badges: [],
    skillsLevels: {
      budgeting: 1,
      investing: 1,
      debtManagement: 1,
      planning: 1,
      riskManagement: 1
    },
    gameCompleted: false
  });
  
  // State for player name input at game start
  const [playerNameInput, setPlayerNameInput] = useState("");
  const [gameStarted, setGameStarted] = useState(false);
  const [showOutcome, setShowOutcome] = useState(false);
  const [selectedDecision, setSelectedDecision] = useState<Decision | null>(null);
  const [showBadgeEarned, setShowBadgeEarned] = useState(false);
  const [earnedBadge, setEarnedBadge] = useState<Badge | null>(null);
  
  // Get the current life stage and scenario
  const currentLifeStage = lifeStages.find(stage => stage.id === gameState.currentLifeStage);
  const currentScenario = gameState.currentScenario === "education-choice" && currentLifeStage 
    ? currentLifeStage.startingScenario 
    : additionalScenarios[gameState.currentScenario];
  
  // Start the game with the player's name
  const startGame = () => {
    if (playerNameInput.trim()) {
      setGameState(prev => ({
        ...prev,
        playerName: playerNameInput.trim()
      }));
      setGameStarted(true);
    }
  };
  
  // Handle making a decision
  const makeDecision = (decision: Decision) => {
    setSelectedDecision(decision);
    setShowOutcome(true);
    
    // Check if the decision earns a badge
    if (decision.outcomes.badge) {
      const newBadge: Badge = {
        ...decision.outcomes.badge,
        earned: true,
        earnedDate: new Date()
      };
      
      setEarnedBadge(newBadge);
      setShowBadgeEarned(true);
    }
  };
  
  // Apply the outcome of a decision
  const applyOutcome = () => {
    if (!selectedDecision) return;
    
    const outcome = selectedDecision.outcomes;
    
    // Update financial situation
    const newFinancialSituation = { ...gameState.financialSituation };
    if (outcome.financialImpact.income) newFinancialSituation.income += outcome.financialImpact.income;
    if (outcome.financialImpact.savings) newFinancialSituation.savings += outcome.financialImpact.savings;
    if (outcome.financialImpact.debt) newFinancialSituation.debt += outcome.financialImpact.debt;
    if (outcome.financialImpact.expenses) newFinancialSituation.expenses += outcome.financialImpact.expenses;
    if (outcome.financialImpact.assets) newFinancialSituation.assets += outcome.financialImpact.assets;
    if (outcome.financialImpact.creditScore) newFinancialSituation.creditScore += outcome.financialImpact.creditScore;
    
    // Ensure credit score stays within reasonable bounds
    newFinancialSituation.creditScore = Math.max(300, Math.min(850, newFinancialSituation.creditScore));
    
    // Update skills levels
    const newSkillsLevels = { ...gameState.skillsLevels };
    if (outcome.skillsGained) {
      outcome.skillsGained.forEach(skill => {
        if (skill === "budgeting") newSkillsLevels.budgeting += 1;
        if (skill === "investing") newSkillsLevels.investing += 1;
        if (skill === "debtManagement") newSkillsLevels.debtManagement += 1;
        if (skill === "planning") newSkillsLevels.planning += 1;
        if (skill === "riskManagement") newSkillsLevels.riskManagement += 1;
      });
    }
    
    // Add badge if one was earned
    let newBadges = [...gameState.badges];
    if (outcome.badge) {
      newBadges.push({
        ...outcome.badge,
        earned: true,
        earnedDate: new Date()
      });
    }
    
    // Add to history
    const newHistory = [...gameState.history];
    newHistory.push({
      scenario: currentScenario?.title || "",
      decision: selectedDecision.title,
      outcome: outcome.description,
      financialImpact: outcome.financialImpact,
      timestamp: new Date()
    });
    
    // Determine next scenario or if game is complete
    let nextScenario = outcome.nextScenario || "game-conclusion";
    let gameCompleted = nextScenario === "game-conclusion";
    
    // Age the player based on the scenario change
    let newAge = gameState.age;
    newAge += Math.floor(Math.random() * 5) + 1; // Age 1-5 years with each decision
    
    // Determine current life stage based on age
    let newLifeStage = gameState.currentLifeStage;
    if (newAge >= 65) newLifeStage = "retirement";
    else if (newAge >= 50) newLifeStage = "pre-retirement";
    else if (newAge >= 35) newLifeStage = "family-life";
    else if (newAge >= 25) newLifeStage = "career-building";
    else newLifeStage = "young-adult";
    
    // Update game state
    setGameState({
      ...gameState,
      age: newAge,
      currentLifeStage: newLifeStage,
      currentScenario: nextScenario,
      financialSituation: newFinancialSituation,
      history: newHistory,
      badges: newBadges,
      skillsLevels: newSkillsLevels,
      gameCompleted
    });
    
    setShowOutcome(false);
    setSelectedDecision(null);
  };
  
  // Reset the game
  const resetGame = () => {
    setGameState({
      playerName: "Player",
      age: 18,
      currentLifeStage: "young-adult",
      currentScenario: "education-choice",
      financialSituation: {
        income: 0,
        savings: 2000,
        debt: 0,
        expenses: 800,
        assets: 500,
        creditScore: 650
      },
      history: [],
      badges: [],
      skillsLevels: {
        budgeting: 1,
        investing: 1,
        debtManagement: 1,
        planning: 1,
        riskManagement: 1
      },
      gameCompleted: false
    });
    setGameStarted(false);
    setPlayerNameInput("");
    setShowOutcome(false);
    setSelectedDecision(null);
    setShowBadgeEarned(false);
    setEarnedBadge(null);
  };
  
  // Calculate net worth
  const calculateNetWorth = () => {
    return gameState.financialSituation.assets + gameState.financialSituation.savings - gameState.financialSituation.debt;
  };
  
  // Format skill level as stars
  const formatSkillLevel = (level: number) => {
    return "★".repeat(Math.min(level, 5)) + "☆".repeat(Math.max(0, 5 - level));
  };
  
  // Get financial score (0-100)
  const getFinancialScore = () => {
    const netWorth = calculateNetWorth();
    const creditScore = gameState.financialSituation.creditScore;
    const debtRatio = gameState.financialSituation.income > 0 
      ? Math.min(1, gameState.financialSituation.debt / (gameState.financialSituation.income * 12))
      : 1;
    
    // Weighted score calculation
    const weightedNetWorth = (netWorth / 1000000) * 40; // Max 40 points for net worth up to 1M
    const weightedCreditScore = ((creditScore - 300) / 550) * 30; // Max 30 points for credit score
    const weightedDebtRatio = (1 - debtRatio) * 30; // Max 30 points for low debt-to-income
    
    const totalScore = Math.min(100, Math.max(0, weightedNetWorth + weightedCreditScore + weightedDebtRatio));
    return Math.round(totalScore);
  };
  
  // Get score category
  const getScoreCategory = () => {
    const score = getFinancialScore();
    if (score >= 80) return { name: "Financial Master", color: "text-emerald-500" };
    if (score >= 60) return { name: "Financial Savvy", color: "text-blue-500" };
    if (score >= 40) return { name: "Financial Learner", color: "text-amber-500" };
    return { name: "Financial Novice", color: "text-red-500" };
  };
  
  if (!gameStarted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] p-6 bg-gradient-to-b from-indigo-900 to-purple-900 rounded-lg text-white">
        <h1 className="text-4xl font-bold mb-8">Financial Life Choices</h1>
        <p className="text-xl mb-8 text-center max-w-lg">
          Navigate through life's financial decisions and see how they impact your financial future.
        </p>
        
        <Card className="w-full max-w-md bg-white/10 backdrop-blur-md border-white/20">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Enter Your Name</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="playerName" className="block text-sm font-medium mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  id="playerName"
                  value={playerNameInput}
                  onChange={(e) => setPlayerNameInput(e.target.value)}
                  className="w-full px-4 py-2 rounded-md bg-white/20 border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-400 text-white"
                  placeholder="Enter your name"
                />
              </div>
              
              <Button 
                onClick={startGame}
                className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
              >
                Start Your Financial Journey
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (gameState.gameCompleted) {
    const score = getFinancialScore();
    const category = getScoreCategory();
    
    return (
      <div className="min-h-[600px] p-6 bg-gradient-to-b from-slate-900 to-slate-800 rounded-lg text-white">
        <h1 className="text-3xl font-bold mb-4 text-center">Financial Life Journey Complete!</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <Clipboard className="mr-2 h-6 w-6" /> Your Results
              </h2>
              
              <div className="space-y-4">
                <div className="flex flex-col items-center justify-center mb-6">
                  <div className="relative mb-2">
                    <div className="h-36 w-36 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
                      <div className="h-32 w-32 rounded-full bg-slate-900 flex items-center justify-center text-4xl font-bold">
                        {score}
                      </div>
                    </div>
                    <div className="absolute -right-2 -bottom-2 bg-green-500 h-10 w-10 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <h3 className={`text-xl font-medium ${category.color}`}>{category.name}</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm">Net Worth</p>
                    <p className="text-xl font-semibold">{formatCurrency(calculateNetWorth())}</p>
                  </div>
                  
                  <div>
                    <p className="text-gray-400 text-sm">Credit Score</p>
                    <p className="text-xl font-semibold">{gameState.financialSituation.creditScore}</p>
                  </div>
                  
                  <div>
                    <p className="text-gray-400 text-sm">Badges Earned</p>
                    <p className="text-xl font-semibold">{gameState.badges.length}</p>
                  </div>
                  
                  <div>
                    <p className="text-gray-400 text-sm">Financial Age</p>
                    <p className="text-xl font-semibold">{gameState.age}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <AlertCircle className="mr-2 h-6 w-6" /> Your Financial Profile
              </h2>
              
              <div className="space-y-4">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Financial Skills</p>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between">
                        <span>Budgeting</span>
                        <span className="text-yellow-400">{formatSkillLevel(gameState.skillsLevels.budgeting)}</span>
                      </div>
                      <Progress value={gameState.skillsLevels.budgeting * 20} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between">
                        <span>Investing</span>
                        <span className="text-yellow-400">{formatSkillLevel(gameState.skillsLevels.investing)}</span>
                      </div>
                      <Progress value={gameState.skillsLevels.investing * 20} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between">
                        <span>Debt Management</span>
                        <span className="text-yellow-400">{formatSkillLevel(gameState.skillsLevels.debtManagement)}</span>
                      </div>
                      <Progress value={gameState.skillsLevels.debtManagement * 20} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between">
                        <span>Planning</span>
                        <span className="text-yellow-400">{formatSkillLevel(gameState.skillsLevels.planning)}</span>
                      </div>
                      <Progress value={gameState.skillsLevels.planning * 20} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between">
                        <span>Risk Management</span>
                        <span className="text-yellow-400">{formatSkillLevel(gameState.skillsLevels.riskManagement)}</span>
                      </div>
                      <Progress value={gameState.skillsLevels.riskManagement * 20} className="h-2" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="badges">
          <TabsList className="w-full grid grid-cols-2 mb-4">
            <TabsTrigger value="badges">Badges Earned</TabsTrigger>
            <TabsTrigger value="history">Decision History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="badges">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {gameState.badges.length > 0 ? (
                    gameState.badges.map((badge, index) => (
                      <Card key={index} className="bg-white/5 border-white/10">
                        <CardContent className="p-4 flex flex-col items-center text-center">
                          <div className="h-12 w-12 rounded-full bg-indigo-900 flex items-center justify-center mb-2">
                            {badge.icon}
                          </div>
                          <h4 className="font-medium text-md">{badge.name}</h4>
                          <p className="text-xs text-gray-400 mt-1">{badge.description}</p>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <p className="col-span-3 text-center py-8 text-gray-400">You didn't earn any badges.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="history">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {gameState.history.length > 0 ? (
                    gameState.history.map((event, index) => (
                      <div key={index} className="border-b border-white/10 pb-4 last:border-0">
                        <h4 className="font-medium">{event.scenario}</h4>
                        <p className="text-sm text-gray-300">Decision: {event.decision}</p>
                        <p className="text-xs text-gray-400 mt-1">{event.outcome}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-center py-8 text-gray-400">No decision history available.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-center mt-6">
          <Button onClick={resetGame} className="bg-indigo-600 hover:bg-indigo-700">
            Start New Game
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-[600px] relative">
      {/* Current Life Stage and Financial Info Header */}
      <div className={`${currentLifeStage?.background} text-white p-6 rounded-t-lg`}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Avatar className="h-12 w-12 mr-4">
              <AvatarImage src={null} />
              <AvatarFallback className="bg-white/20">
                {currentLifeStage?.icon}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">{currentLifeStage?.title}</h2>
              <p className="text-sm opacity-80">{gameState.playerName}, Age {gameState.age}</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-white/10 text-white">
              Income: {formatCurrency(gameState.financialSituation.income)}/mo
            </Badge>
            <Badge variant="outline" className="bg-white/10 text-white">
              Savings: {formatCurrency(gameState.financialSituation.savings)}
            </Badge>
            <Badge variant="outline" className="bg-white/10 text-white">
              Debt: {formatCurrency(gameState.financialSituation.debt)}
            </Badge>
            <Badge variant="outline" className="bg-white/10 text-white">
              Net Worth: {formatCurrency(calculateNetWorth())}
            </Badge>
          </div>
        </div>
      </div>
      
      {/* Current Scenario */}
      <div className="bg-white dark:bg-slate-900 rounded-b-lg p-6 shadow-lg">
        {currentScenario && (
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-2">{currentScenario.title}</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">{currentScenario.description}</p>
            
            {!showOutcome && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentScenario.decisions.map((decision) => (
                  <motion.div
                    key={decision.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card 
                      className="bg-slate-50 dark:bg-slate-800 border-2 hover:border-primary cursor-pointer transition-all"
                      onClick={() => makeDecision(decision)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center mb-2">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                            {decision.icon}
                          </div>
                          <h4 className="font-bold">{decision.title}</h4>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{decision.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
            
            {showOutcome && selectedDecision && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-slate-100 dark:bg-slate-800 border-primary">
                  <CardContent className="p-6">
                    <h4 className="font-bold text-lg mb-3">Outcome: {selectedDecision.title}</h4>
                    <p className="mb-4">{selectedDecision.outcomes.description}</p>
                    
                    <div className="mb-4 p-3 bg-white dark:bg-slate-900 rounded-md">
                      <h5 className="font-medium mb-2">Financial Impact:</h5>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {selectedDecision.outcomes.financialImpact.income && (
                          <div>
                            <p className="text-sm text-slate-500">Monthly Income</p>
                            <p className={selectedDecision.outcomes.financialImpact.income > 0 ? "text-green-600" : "text-red-500"}>
                              {selectedDecision.outcomes.financialImpact.income > 0 ? "+" : ""}
                              {formatCurrency(selectedDecision.outcomes.financialImpact.income)}
                            </p>
                          </div>
                        )}
                        
                        {selectedDecision.outcomes.financialImpact.savings && (
                          <div>
                            <p className="text-sm text-slate-500">Savings</p>
                            <p className={selectedDecision.outcomes.financialImpact.savings > 0 ? "text-green-600" : "text-red-500"}>
                              {selectedDecision.outcomes.financialImpact.savings > 0 ? "+" : ""}
                              {formatCurrency(selectedDecision.outcomes.financialImpact.savings)}
                            </p>
                          </div>
                        )}
                        
                        {selectedDecision.outcomes.financialImpact.debt && (
                          <div>
                            <p className="text-sm text-slate-500">Debt</p>
                            <p className={selectedDecision.outcomes.financialImpact.debt < 0 ? "text-green-600" : "text-red-500"}>
                              {selectedDecision.outcomes.financialImpact.debt > 0 ? "+" : ""}
                              {formatCurrency(selectedDecision.outcomes.financialImpact.debt)}
                            </p>
                          </div>
                        )}
                        
                        {selectedDecision.outcomes.financialImpact.expenses && (
                          <div>
                            <p className="text-sm text-slate-500">Monthly Expenses</p>
                            <p className={selectedDecision.outcomes.financialImpact.expenses < 0 ? "text-green-600" : "text-red-500"}>
                              {selectedDecision.outcomes.financialImpact.expenses > 0 ? "+" : ""}
                              {formatCurrency(selectedDecision.outcomes.financialImpact.expenses)}
                            </p>
                          </div>
                        )}
                        
                        {selectedDecision.outcomes.financialImpact.assets && (
                          <div>
                            <p className="text-sm text-slate-500">Assets</p>
                            <p className={selectedDecision.outcomes.financialImpact.assets > 0 ? "text-green-600" : "text-red-500"}>
                              {selectedDecision.outcomes.financialImpact.assets > 0 ? "+" : ""}
                              {formatCurrency(selectedDecision.outcomes.financialImpact.assets)}
                            </p>
                          </div>
                        )}
                        
                        {selectedDecision.outcomes.financialImpact.creditScore && (
                          <div>
                            <p className="text-sm text-slate-500">Credit Score</p>
                            <p className={selectedDecision.outcomes.financialImpact.creditScore > 0 ? "text-green-600" : "text-red-500"}>
                              {selectedDecision.outcomes.financialImpact.creditScore > 0 ? "+" : ""}
                              {selectedDecision.outcomes.financialImpact.creditScore}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {selectedDecision.outcomes.skillsGained && selectedDecision.outcomes.skillsGained.length > 0 && (
                      <div className="mb-4">
                        <h5 className="font-medium mb-2">Skills Improved:</h5>
                        <div className="flex flex-wrap gap-2">
                          {selectedDecision.outcomes.skillsGained.map((skill, index) => (
                            <Badge key={index} variant="secondary">
                              {skill.charAt(0).toUpperCase() + skill.slice(1)} +1
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <p className="mb-4 italic text-slate-600 dark:text-slate-400">
                      {selectedDecision.outcomes.consequences}
                    </p>
                    
                    <div className="text-center">
                      <Button onClick={applyOutcome}>
                        Continue <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        )}
      </div>
      
      {/* Badge Earned Popup */}
      <AnimatePresence>
        {showBadgeEarned && earnedBadge && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/50"
            onClick={() => setShowBadgeEarned(false)}
          >
            <div className="bg-white dark:bg-slate-900 rounded-lg p-6 max-w-sm text-center" onClick={e => e.stopPropagation()}>
              <BadgeAlert className="h-16 w-16 text-yellow-500 mx-auto mb-2" />
              <h3 className="text-xl font-bold mb-1">Badge Earned!</h3>
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto my-4">
                {earnedBadge.icon}
              </div>
              <h4 className="text-lg font-semibold text-primary">{earnedBadge.name}</h4>
              <p className="text-slate-600 dark:text-slate-400 my-3">{earnedBadge.description}</p>
              <Button onClick={() => setShowBadgeEarned(false)} className="mt-2">
                <Check className="mr-2 h-4 w-4" /> Continue
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
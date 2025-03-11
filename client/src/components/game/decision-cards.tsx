import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  CreditCard, PiggyBank, ArrowUpDown, BarChart3, Shield, Wallet, 
  Plane, Home, Coffee, Users, TrendingDown, Globe, Sparkles, 
  PartyPopper, DollarSign, Calendar as CalendarIcon, Clock as ClockIcon, 
  Lightbulb as LightbulbIcon, Zap as ZapIcon, TrendingUp as TrendingUpIcon,
  BookOpen as BookOpenIcon, Book as BookIcon, Laptop as LaptopIcon
} from 'lucide-react';
import { motion } from 'framer-motion';

interface DecisionOption {
  value: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  impact: {
    savings: number;
    debt: number;
    income: number;
    expenses: number;
  };
}

interface DecisionCardsProps {
  onSelect: (option: string) => void;
  selectedOption: string | null;
  disabled: boolean;
  scenario?: string | undefined;
  decisionOptions?: DecisionOption[];
}

export function DecisionCards({ onSelect, selectedOption, disabled, scenario, decisionOptions }: DecisionCardsProps) {
  // If we have API-provided decision options, use those instead of detecting from scenario
  if (decisionOptions && decisionOptions.length > 0) {
    // Map API decision options to our component's expected format
    const mappedOptions = decisionOptions.map(option => {
      // Determine icon based on the option's label or value
      let icon;
      const labelLower = option.label.toLowerCase();
      const valueLower = option.value.toLowerCase();
      
      if (labelLower.includes('save') || valueLower.includes('save')) {
        icon = <PiggyBank className="h-6 w-6 text-amber-500" />;
      } else if (labelLower.includes('debt') || valueLower.includes('debt') || labelLower.includes('loan') || valueLower.includes('loan')) {
        icon = <CreditCard className="h-6 w-6 text-blue-500" />;
      } else if (labelLower.includes('invest') || valueLower.includes('invest') || labelLower.includes('isa') || valueLower.includes('isa')) {
        icon = <BarChart3 className="h-6 w-6 text-green-500" />;
      } else if (labelLower.includes('budget') || valueLower.includes('budget')) {
        icon = <Wallet className="h-6 w-6 text-sky-500" />;
      } else if (labelLower.includes('job') || valueLower.includes('job') || labelLower.includes('work') || valueLower.includes('work')) {
        icon = <TrendingUpIcon className="h-6 w-6 text-purple-500" />;
      } else if (labelLower.includes('study') || valueLower.includes('study') || labelLower.includes('education') || valueLower.includes('education')) {
        icon = <BookOpenIcon className="h-6 w-6 text-blue-500" />;
      } else {
        icon = <LightbulbIcon className="h-6 w-6 text-purple-500" />;
      }
      
      return {
        ...option,
        icon
      };
    });
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {mappedOptions.map((option, index) => (
          <motion.div
            key={option.value}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card 
              className={`cursor-pointer transition-all hover:shadow-md hover:border-primary/50 ${
                selectedOption === option.value ? 'border-2 border-primary' : ''
              } ${disabled ? 'opacity-60 pointer-events-none' : ''}`}
              onClick={() => !disabled && onSelect(option.value)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center space-x-2">
                  {option.icon}
                  <CardTitle className="text-base">{option.label}</CardTitle>
                </div>
                <CardDescription>{option.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0 text-sm">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span>Savings Impact:</span>
                    <span className={option.impact.savings > 0 ? 'text-green-600' : option.impact.savings < 0 ? 'text-red-600' : ''}>
                      {option.impact.savings > 0 ? '+' : ''}{option.impact.savings}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Debt Impact:</span>
                    <span className={option.impact.debt < 0 ? 'text-green-600' : option.impact.debt > 0 ? 'text-red-600' : ''}>
                      {option.impact.debt > 0 ? '+' : ''}{option.impact.debt}%
                    </span>
                  </div>
                  {option.impact.income !== 0 && (
                    <div className="flex items-center justify-between">
                      <span>Income Impact:</span>
                      <span className={option.impact.income > 0 ? 'text-green-600' : 'text-red-600'}>
                        {option.impact.income > 0 ? '+' : ''}{option.impact.income}%
                      </span>
                    </div>
                  )}
                  {option.impact.expenses !== 0 && (
                    <div className="flex items-center justify-between">
                      <span>Expenses Impact:</span>
                      <span className={option.impact.expenses < 0 ? 'text-green-600' : 'text-red-600'}>
                        {option.impact.expenses > 0 ? '+' : ''}{option.impact.expenses}%
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    );
  }

  // Advanced scenario detection system if no API options provided
  // This analyzes the scenario text to determine the most appropriate decision set
  
  // Lifestyle and social scenarios
  const isSpringBreakScenario = scenario?.toLowerCase().includes('spring break');
  const isVacationScenario = scenario?.toLowerCase().includes('vacation') || scenario?.toLowerCase().includes('holiday') || scenario?.toLowerCase().includes('trip');
  const isSocialEventScenario = scenario?.toLowerCase().includes('friend') || scenario?.toLowerCase().includes('party') || scenario?.toLowerCase().includes('wedding') || scenario?.toLowerCase().includes('social');
  const isDiningScenario = scenario?.toLowerCase().includes('dining') || scenario?.toLowerCase().includes('restaurant') || scenario?.toLowerCase().includes('food');
  
  // Emergency and unexpected events
  const isUnexpectedExpenseScenario = scenario?.toLowerCase().includes('unexpected') || scenario?.toLowerCase().includes('emergency') || scenario?.toLowerCase().includes('surprise bill');
  const isMedicalScenario = scenario?.toLowerCase().includes('medical') || scenario?.toLowerCase().includes('health') || scenario?.toLowerCase().includes('doctor') || scenario?.toLowerCase().includes('hospital');
  const isCarRepairScenario = scenario?.toLowerCase().includes('car') || scenario?.toLowerCase().includes('vehicle') || scenario?.toLowerCase().includes('repair');
  const isHomeRepairScenario = scenario?.toLowerCase().includes('home repair') || scenario?.toLowerCase().includes('fix') || scenario?.toLowerCase().includes('maintenance');
  
  // Investment and financial opportunity scenarios
  const isInvestmentScenario = scenario?.toLowerCase().includes('investment') || scenario?.toLowerCase().includes('stock market') || scenario?.toLowerCase().includes('opportunity');
  const isRealEstateScenario = scenario?.toLowerCase().includes('real estate') || scenario?.toLowerCase().includes('property') || scenario?.toLowerCase().includes('house');
  const isEducationScenario = scenario?.toLowerCase().includes('education') || scenario?.toLowerCase().includes('course') || scenario?.toLowerCase().includes('class') || scenario?.toLowerCase().includes('training');
  const isCareerScenario = scenario?.toLowerCase().includes('career') || scenario?.toLowerCase().includes('job') || scenario?.toLowerCase().includes('work') || scenario?.toLowerCase().includes('business');
  
  // Student-specific scenarios
  const isTextbookScenario = scenario?.toLowerCase().includes('textbook') || scenario?.toLowerCase().includes('tightrope');
  const isStudentScenario = scenario?.toLowerCase().includes('student') || scenario?.toLowerCase().includes('college') || scenario?.toLowerCase().includes('university');
  
  // Different sets of options based on scenario
  const springBreakOptions: DecisionOption[] = [
    {
      value: 'skip_trip',
      label: 'Skip the Trip',
      description: 'Focus on your financial goals instead of spending on the trip',
      icon: <Home className="h-6 w-6 text-blue-500" />,
      impact: {
        savings: 10,
        debt: -5,
        income: 0,
        expenses: -15
      }
    },
    {
      value: 'budget_travel',
      label: 'Budget Travel Options',
      description: 'Go on the trip but find ways to minimize costs',
      icon: <Plane className="h-6 w-6 text-amber-500" />,
      impact: {
        savings: -5,
        debt: 5,
        income: 0,
        expenses: 10
      }
    },
    {
      value: 'side_hustle',
      label: 'Earn Extra Money',
      description: 'Take on a temporary side job to pay for the trip',
      icon: <DollarSign className="h-6 w-6 text-green-500" />,
      impact: {
        savings: 0,
        debt: 0,
        income: 15,
        expenses: 5
      }
    },
    {
      value: 'split_costs',
      label: 'Split Costs with Friends',
      description: 'Coordinate with friends to share expenses and reduce individual costs',
      icon: <Users className="h-6 w-6 text-purple-500" />,
      impact: {
        savings: -5,
        debt: 0,
        income: 0,
        expenses: 5
      }
    }
  ];

  const unexpectedExpenseOptions: DecisionOption[] = [
    {
      value: 'use_emergency_fund',
      label: 'Use Emergency Fund',
      description: 'This is what your emergency fund was built for',
      icon: <Shield className="h-6 w-6 text-red-500" />,
      impact: {
        savings: -15,
        debt: 0,
        income: 0,
        expenses: 0
      }
    },
    {
      value: 'temporary_credit',
      label: 'Use Credit Card',
      description: 'Cover the expense with credit and pay it off gradually',
      icon: <CreditCard className="h-6 w-6 text-blue-500" />,
      impact: {
        savings: 0,
        debt: 10,
        income: 0,
        expenses: 5
      }
    },
    {
      value: 'reduce_expenses',
      label: 'Cut Other Expenses',
      description: 'Temporarily reduce discretionary spending to cover this cost',
      icon: <TrendingDown className="h-6 w-6 text-purple-500" />,
      impact: {
        savings: -5,
        debt: 0,
        income: 0,
        expenses: -10
      }
    },
    {
      value: 'ask_for_help',
      label: 'Ask for Help',
      description: 'Reach out to family or friends for temporary assistance',
      icon: <Users className="h-6 w-6 text-sky-500" />,
      impact: {
        savings: 0,
        debt: 0,
        income: 5,
        expenses: 0
      }
    }
  ];

  const investmentOptions: DecisionOption[] = [
    {
      value: 'conservative_investment',
      label: 'Conservative Investment',
      description: 'Lower risk, stable but modest returns',
      icon: <Shield className="h-6 w-6 text-blue-500" />,
      impact: {
        savings: -5,
        debt: 0,
        income: 3,
        expenses: 0
      }
    },
    {
      value: 'balanced_portfolio',
      label: 'Balanced Portfolio',
      description: 'Mix of stocks and bonds for moderate growth with some stability',
      icon: <ArrowUpDown className="h-6 w-6 text-purple-500" />,
      impact: {
        savings: -10,
        debt: 0,
        income: 7,
        expenses: 0
      }
    },
    {
      value: 'aggressive_growth',
      label: 'Aggressive Growth',
      description: 'Higher risk stocks and funds for potential higher returns',
      icon: <BarChart3 className="h-6 w-6 text-red-500" />,
      impact: {
        savings: -15,
        debt: 0,
        income: 12,
        expenses: 0
      }
    },
    {
      value: 'real_estate',
      label: 'Real Estate Investment',
      description: 'Invest in property or REITs for steady income and appreciation',
      icon: <Home className="h-6 w-6 text-green-500" />,
      impact: {
        savings: -20,
        debt: 10,
        income: 10,
        expenses: 5
      }
    }
  ];
  
  // Default options if no specific scenario is detected
  const defaultOptions: DecisionOption[] = [
    {
      value: 'savings_focus',
      label: 'Focus on Savings',
      description: 'Prioritize building your savings account and emergency fund',
      icon: <PiggyBank className="h-6 w-6 text-amber-500" />,
      impact: {
        savings: 15,
        debt: 0,
        income: 0,
        expenses: -5
      }
    },
    {
      value: 'debt_payment',
      label: 'Pay Down Debt',
      description: 'Accelerate debt payments to reduce interest costs',
      icon: <CreditCard className="h-6 w-6 text-blue-500" />,
      impact: {
        savings: -5,
        debt: -20,
        income: 0,
        expenses: 0
      }
    },
    {
      value: 'balanced_approach',
      label: 'Balanced Approach',
      description: 'Maintain a balanced strategy for savings and debt reduction',
      icon: <ArrowUpDown className="h-6 w-6 text-purple-500" />,
      impact: {
        savings: 5,
        debt: -10,
        income: 0, 
        expenses: -5
      }
    },
    {
      value: 'investment',
      label: 'Invest for Growth',
      description: 'Put your money into investments for long-term growth',
      icon: <BarChart3 className="h-6 w-6 text-green-500" />,
      impact: {
        savings: -10,
        debt: 0,
        income: 5,
        expenses: 0
      }
    },
    {
      value: 'emergency_fund',
      label: 'Build Emergency Fund',
      description: 'Establish a safety net for unexpected expenses',
      icon: <Shield className="h-6 w-6 text-red-500" />,
      impact: {
        savings: 20,
        debt: 0,
        income: 0,
        expenses: -10
      }
    },
    {
      value: 'budget_optimization',
      label: 'Optimize Budget',
      description: 'Refine your budget to reduce expenses and increase savings',
      icon: <Wallet className="h-6 w-6 text-sky-500" />,
      impact: {
        savings: 10,
        debt: -5,
        income: 0,
        expenses: -15
      }
    }
  ];
  
  // Add more specific scenario options
  const socialEventOptions: DecisionOption[] = [
    {
      value: 'attend_budget',
      label: 'Attend on a Budget',
      description: 'Participate but set strict spending limits',
      icon: <Users className="h-6 w-6 text-green-500" />,
      impact: {
        savings: -5,
        debt: 0,
        income: 0,
        expenses: 8
      }
    },
    {
      value: 'skip_event',
      label: 'Skip the Event',
      description: 'Prioritize financial health over social activities',
      icon: <Home className="h-6 w-6 text-blue-500" />,
      impact: {
        savings: 5,
        debt: 0,
        income: 0,
        expenses: -10
      }
    },
    {
      value: 'host_alternative',
      label: 'Host Alternative Gathering',
      description: 'Organize a more affordable alternative with friends',
      icon: <PartyPopper className="h-6 w-6 text-purple-500" />,
      impact: {
        savings: 0,
        debt: 0,
        income: 0,
        expenses: 5
      }
    },
    {
      value: 'gift_creative',
      label: 'Creative Gift Solution',
      description: 'Make a thoughtful but inexpensive gift',
      icon: <Sparkles className="h-6 w-6 text-amber-500" />,
      impact: {
        savings: 0,
        debt: 0,
        income: 0,
        expenses: 3
      }
    }
  ];

  const medicalScenarioOptions: DecisionOption[] = [
    {
      value: 'use_insurance',
      label: 'Use Insurance Coverage',
      description: 'Maximize your insurance benefits',
      icon: <Shield className="h-6 w-6 text-blue-500" />,
      impact: {
        savings: -5,
        debt: 0,
        income: 0,
        expenses: 5
      }
    },
    {
      value: 'payment_plan',
      label: 'Request Payment Plan',
      description: 'Negotiate a manageable payment schedule',
      icon: <CalendarIcon className="h-6 w-6 text-purple-500" />,
      impact: {
        savings: -2,
        debt: 3,
        income: 0,
        expenses: 3
      }
    },
    {
      value: 'seek_assistance',
      label: 'Apply for Assistance',
      description: 'Look into financial aid programs',
      icon: <Users className="h-6 w-6 text-green-500" />,
      impact: {
        savings: 0,
        debt: 0,
        income: 0,
        expenses: 2
      }
    },
    {
      value: 'preventive_care',
      label: 'Focus on Prevention',
      description: 'Invest in preventive care to avoid future costs',
      icon: <ZapIcon className="h-6 w-6 text-amber-500" />,
      impact: {
        savings: -3,
        debt: 0,
        income: 0,
        expenses: 0
      }
    }
  ];

  const careerOptions: DecisionOption[] = [
    {
      value: 'accept_promotion',
      label: 'Accept Promotion',
      description: 'Take on more responsibility for higher pay',
      icon: <TrendingUpIcon className="h-6 w-6 text-green-500" />,
      impact: {
        savings: 5,
        debt: -5,
        income: 15,
        expenses: 5
      }
    },
    {
      value: 'further_education',
      label: 'Invest in Education',
      description: 'Gain credentials for long-term career growth',
      icon: <LightbulbIcon className="h-6 w-6 text-blue-500" />,
      impact: {
        savings: -10,
        debt: 15,
        income: 0,
        expenses: 10
      }
    },
    {
      value: 'start_business',
      label: 'Start Side Business',
      description: 'Create additional income stream with entrepreneurship',
      icon: <DollarSign className="h-6 w-6 text-purple-500" />,
      impact: {
        savings: -15,
        debt: 5,
        income: 20,
        expenses: 10
      }
    },
    {
      value: 'networking',
      label: 'Focus on Networking',
      description: 'Build professional relationships for opportunities',
      icon: <Users className="h-6 w-6 text-amber-500" />,
      impact: {
        savings: -2,
        debt: 0,
        income: 5,
        expenses: 3
      }
    }
  ];

  // Student-specific textbook options
  const textbookOptions: DecisionOption[] = [
    {
      value: 'buy_new_textbooks',
      label: 'Buy New Textbooks',
      description: 'Purchase all new textbooks for your classes',
      icon: <BookOpenIcon className="h-6 w-6 text-blue-500" />,
      impact: {
        savings: -20,
        debt: 0,
        income: 0,
        expenses: 15
      }
    },
    {
      value: 'used_textbooks',
      label: 'Buy Used Textbooks',
      description: 'Find used textbooks at a discount',
      icon: <BookIcon className="h-6 w-6 text-amber-500" />,
      impact: {
        savings: -10,
        debt: 0,
        income: 0,
        expenses: 8
      }
    },
    {
      value: 'rent_textbooks',
      label: 'Rent Textbooks',
      description: 'Temporarily rent textbooks for the semester',
      icon: <CalendarIcon className="h-6 w-6 text-green-500" />,
      impact: {
        savings: -5,
        debt: 0,
        income: 0,
        expenses: 5
      }
    },
    {
      value: 'digital_alternatives',
      label: 'Digital Alternatives',
      description: 'Use e-books or online resources instead',
      icon: <LaptopIcon className="h-6 w-6 text-purple-500" />,
      impact: {
        savings: -3,
        debt: 0,
        income: 0,
        expenses: 3
      }
    }
  ];

  const homeOptions: DecisionOption[] = [
    {
      value: 'diy_repair',
      label: 'DIY Repair',
      description: 'Fix it yourself to save on labor costs',
      icon: <Home className="h-6 w-6 text-green-500" />,
      impact: {
        savings: -5,
        debt: 0,
        income: 0,
        expenses: 3
      }
    },
    {
      value: 'professional_service',
      label: 'Hire Professional',
      description: 'Pay for quality work with warranty',
      icon: <Shield className="h-6 w-6 text-blue-500" />,
      impact: {
        savings: -15,
        debt: 5,
        income: 0,
        expenses: 15
      }
    },
    {
      value: 'delay_repair',
      label: 'Delay Non-Critical Repair',
      description: 'Save up first for non-urgent issues',
      icon: <ClockIcon className="h-6 w-6 text-amber-500" />,
      impact: {
        savings: 5,
        debt: 0,
        income: 0,
        expenses: -5
      }
    },
    {
      value: 'preventive_maintenance',
      label: 'Preventive Maintenance',
      description: 'Regular upkeep to avoid expensive repairs',
      icon: <Shield className="h-6 w-6 text-purple-500" />,
      impact: {
        savings: -3,
        debt: 0,
        income: 0,
        expenses: 5
      }
    }
  ];

  // Dynamically select the appropriate options based on the detected scenario
  let options: DecisionOption[] = defaultOptions;
  
  // General category detection
  const isLifestyleScenario = isSpringBreakScenario || isVacationScenario || isSocialEventScenario || isDiningScenario;
  const isEmergencyScenario = isUnexpectedExpenseScenario || isMedicalScenario || isCarRepairScenario || isHomeRepairScenario;
  const isOpportunityScenario = isInvestmentScenario || isRealEstateScenario || isEducationScenario || isCareerScenario;
  
  // Specific scenario selection with priority for the most specific match
  if (isTextbookScenario) {
    options = textbookOptions; // Highest priority for textbook scenarios
  } else if (isSpringBreakScenario) {
    options = springBreakOptions;
  } else if (isVacationScenario) {
    options = springBreakOptions; // Reuse spring break options for vacation scenarios
  } else if (isSocialEventScenario) {
    options = socialEventOptions;
  } else if (isMedicalScenario) {
    options = medicalScenarioOptions;
  } else if (isHomeRepairScenario) {
    options = homeOptions;
  } else if (isCareerScenario) {
    options = careerOptions;
  } else if (isEducationScenario) {
    options = careerOptions; // Reuse career options for education
  } else if (isUnexpectedExpenseScenario) {
    options = unexpectedExpenseOptions;
  } else if (isInvestmentScenario) {
    options = investmentOptions;
  } else if (isRealEstateScenario) {
    options = investmentOptions; // Reuse investment options for real estate
  } else if (isStudentScenario) {
    options = textbookOptions; // Use textbook options for general student scenarios
  }
  // Use category fallbacks if specific scenario not found
  else if (isLifestyleScenario) {
    options = socialEventOptions;
  } else if (isEmergencyScenario) {
    options = unexpectedExpenseOptions;
  } else if (isOpportunityScenario) {
    options = investmentOptions;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {options.map((option, index) => (
        <motion.div
          key={option.value}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card 
            className={`cursor-pointer transition-all hover:shadow-md hover:border-primary/50 ${
              selectedOption === option.value ? 'border-2 border-primary' : ''
            } ${disabled ? 'opacity-60 pointer-events-none' : ''}`}
            onClick={() => !disabled && onSelect(option.value)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center space-x-2">
                {option.icon}
                <CardTitle className="text-base">{option.label}</CardTitle>
              </div>
              <CardDescription>{option.description}</CardDescription>
            </CardHeader>
            <CardContent className="pt-0 text-sm">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span>Savings Impact:</span>
                  <span className={option.impact.savings > 0 ? 'text-green-600' : option.impact.savings < 0 ? 'text-red-600' : ''}>
                    {option.impact.savings > 0 ? '+' : ''}{option.impact.savings}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Debt Impact:</span>
                  <span className={option.impact.debt < 0 ? 'text-green-600' : option.impact.debt > 0 ? 'text-red-600' : ''}>
                    {option.impact.debt > 0 ? '+' : ''}{option.impact.debt}%
                  </span>
                </div>
                {option.impact.income !== 0 && (
                  <div className="flex items-center justify-between">
                    <span>Income Impact:</span>
                    <span className={option.impact.income > 0 ? 'text-green-600' : 'text-red-600'}>
                      {option.impact.income > 0 ? '+' : ''}{option.impact.income}%
                    </span>
                  </div>
                )}
                {option.impact.expenses !== 0 && (
                  <div className="flex items-center justify-between">
                    <span>Expenses Impact:</span>
                    <span className={option.impact.expenses < 0 ? 'text-green-600' : 'text-red-600'}>
                      {option.impact.expenses > 0 ? '+' : ''}{option.impact.expenses}%
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
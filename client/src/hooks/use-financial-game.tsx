import { useState, useEffect } from 'react';
import { FinancialMetricsType } from '@/components/game/financial-metrics';

type GameStage = 'welcome' | 'initialization' | 'processing_decisions' | 'game_over';

interface GameState {
  income: number;
  expenses: number;
  savings: number;
  debt: number;
  achievements: string[];
  level: number;
  xpEarned: number;
  monthlyBalance: number;
  debtToIncomeRatio: number;
  savingsRatio: number;
}

export function useFinancialGame(careerPath: string, playerName: string) {
  const [gameState, setGameState] = useState<GameState>({
    income: 0,
    expenses: 0,
    savings: 0,
    debt: 0,
    achievements: [],
    level: 1,
    xpEarned: 0,
    monthlyBalance: 0,
    debtToIncomeRatio: 0,
    savingsRatio: 0
  });
  
  const [gameStage, setGameStage] = useState<GameStage>('welcome');
  const [currentMessage, setCurrentMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Initial financial states by career
  const careerInitialStates: Record<string, Partial<GameState>> = {
    'Student': {
      income: 1200,
      expenses: 1000,
      savings: 500,
      debt: 20000
    },
    'Entrepreneur': {
      income: 3000,
      expenses: 2500,
      savings: 10000,
      debt: 50000
    },
    'Artist': {
      income: 2000,
      expenses: 1800,
      savings: 2000,
      debt: 15000
    },
    'Banker': {
      income: 7000,
      expenses: 5000,
      savings: 30000,
      debt: 10000
    }
  };

  // Sample scenarios by career
  const careerScenarios: Record<string, string[]> = {
    'Student': [
      "Your student loan payment is due, but you've found a part-time job opportunity that could help. What's your decision?",
      "A new semester is starting, and you need textbooks. You can buy new, used, or digital versions. What's your choice?",
      "Your laptop is getting old. You can repair it, buy a new one, or use the library computers. What will you do?",
      "Your friends are planning a spring break trip. It's expensive but could be a great experience. How do you manage this?"
    ],
    'Entrepreneur': [
      "An investor is interested in your business. They're offering capital but want a significant equity share. What's your decision?",
      "You have the opportunity to expand your business, but it requires taking on additional debt. How will you proceed?",
      "A competitor has emerged in your market. You can lower prices, invest in marketing, or focus on product improvement. What's your strategy?",
      "Your business is facing a cash flow issue. You need to decide between delaying supplier payments, taking a personal loan, or finding new investors. What will you do?"
    ],
    'Artist': [
      "A gallery is interested in your work but charges a high commission. What's your decision?",
      "You've been offered a commercial project. It pays well but isn't aligned with your artistic vision. Will you take it?",
      "You need new equipment for your art. You can buy high-end tools, mid-range options, or continue with what you have. What will you choose?",
      "You've been invited to an art fair that could boost your visibility, but the entry fee is substantial. How will you handle this opportunity?"
    ],
    'Banker': [
      "Your bank is offering a promotion with higher responsibilities. It means more income but also more stress and hours. What's your decision?",
      "You have a significant bonus coming. You can invest it, pay down your mortgage, or enjoy a luxury vacation. What will you do?",
      "You've spotted a potential issue in the financial reporting system. Addressing it might affect your department's performance metrics. How will you handle this?",
      "You're considering shifting to a different sector in finance that has higher growth potential but initial income reduction. What will you decide?"
    ]
  };

  // Random financial events that can occur
  const financialEvents = [
    {
      type: 'Medical Emergency',
      impact: { savings: -5000 },
      message: 'You faced an unexpected medical expense of $5,000.'
    },
    {
      type: 'Job Opportunity',
      impact: { income: 500 },
      message: 'You received a job opportunity that increased your monthly income by $500.'
    },
    {
      type: 'Car Repair',
      impact: { savings: -2000 },
      message: 'Your car needed urgent repairs costing $2,000.'
    },
    {
      type: 'Market Downturn',
      impact: { savings: -0.1 },
      message: 'A market downturn reduced your savings by 10%.'
    },
    {
      type: 'Unexpected Bonus',
      impact: { savings: 3000 },
      message: 'You received an unexpected bonus of $3,000.'
    }
  ];

  // Initialize the game with welcome message
  const initializeGame = async () => {
    setIsProcessing(true);
    setGameStage('welcome');
    
    // Welcome message
    const welcomeMessage = generateWelcomeMessage(playerName, careerPath);
    setCurrentMessage(welcomeMessage);
    
    setTimeout(() => {
      // Initialize financial status based on career
      const initialState = careerInitialStates[careerPath] || {};
      
      const income = initialState.income || 0;
      const expenses = initialState.expenses || 0;
      const savings = initialState.savings || 0;
      const debt = initialState.debt || 0;
      
      setGameState({
        income,
        expenses,
        savings,
        debt,
        achievements: [],
        level: 1,
        xpEarned: 0,
        monthlyBalance: income - expenses,
        debtToIncomeRatio: debt / (income * 12),
        savingsRatio: income > 0 ? savings / income : 0
      });
      
      setGameStage('initialization');
      const initMessage = generateInitializationMessage(careerPath, income, expenses, savings, debt);
      setCurrentMessage(initMessage);
      
      // Move to main game loop after initialization
      setTimeout(() => {
        setGameStage('processing_decisions');
        setIsProcessing(false);
      }, 2000);
    }, 3000);
  };

  // Start a new game with player name
  const startGame = async (name: string) => {
    if (!name.trim()) return;
    
    setIsProcessing(true);
    setCurrentMessage(`Welcome ${name}! Initializing your financial journey as a ${careerPath}...`);
    
    try {
      // Call the API to start a new game session
      const response = await fetch('/api/financial-game/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerName: name, careerChoice: careerPath })
      });
      
      if (!response.ok) throw new Error('Failed to start game');
      
      const data = await response.json();
      
      // Update game state with response
      setCurrentMessage(data.content);
      setGameStage('initialization');
    } catch (error) {
      console.error('Error starting game:', error);
      setCurrentMessage(`Sorry, there was an error starting the game. Please try again.`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Process player decisions
  const makeDecision = (decision: string) => {
    setIsProcessing(true);
    
    // Process decision impact on financial state
    const updatedState = processDecisionImpact(decision, { ...gameState });
    
    // Potentially trigger random events
    const { state: stateWithEvents, eventMessage } = processRandomEvent(updatedState);
    
    // Update achievements
    const stateWithAchievements = updateAchievements(stateWithEvents);
    
    // Update game state
    setGameState(stateWithAchievements);
    
    // Generate response message
    const responseMessage = generateResponseMessage(decision, stateWithAchievements, eventMessage);
    setCurrentMessage(responseMessage);
    
    // Continue game
    setTimeout(() => {
      setIsProcessing(false);
    }, 1500);
  };

  // End the game and show summary
  const endGame = () => {
    setIsProcessing(true);
    setGameStage('game_over');
    
    // Generate final summary message
    const summaryMessage = generateSummaryMessage(playerName, careerPath, gameState);
    setCurrentMessage(summaryMessage);
    
    setTimeout(() => {
      setIsProcessing(false);
    }, 1500);
  };

  // Generate welcome message
  const generateWelcomeMessage = (name: string, career: string) => {
    return `# Welcome to Financial Twin Simulation, ${name}!

You've selected the **${career}** career path. In this simulation, you'll navigate through realistic financial scenarios, make decisions, and see how they impact your financial future.

Your financial twin will face challenges specific to your chosen career, experience unexpected events, and build achievements based on your decisions.

Let's begin your financial journey!`;
  };

  // Generate initialization message with financial status
  const generateInitializationMessage = (
    career: string,
    income: number,
    expenses: number,
    savings: number,
    debt: number
  ) => {
    const firstScenario = careerScenarios[career]?.[0] || "What's your next financial move?";
    
    return `## Initial Financial Status

As a ${career}, here's your starting financial situation:

- **Monthly Income**: $${income.toLocaleString()}
- **Monthly Expenses**: $${expenses.toLocaleString()}
- **Current Savings**: $${savings.toLocaleString()}
- **Current Debt**: $${debt.toLocaleString()}

## Your First Financial Challenge

${firstScenario}

What's your decision?`;
  };

  // Process the impact of the player's decision
  const processDecisionImpact = (decision: string, state: GameState) => {
    const decisionLower = decision.toLowerCase();
    
    // Apply decision impacts
    if (decisionLower.includes('invest')) {
      // Investing typically reduces savings but potentially increases income
      state.savings -= Math.min(state.savings, 1000);
      
      // 70% chance of investment success
      if (Math.random() < 0.7) {
        state.income += 200;
        state.achievements.push('Successful Investor');
      }
    } 
    else if (decisionLower.includes('save') || decisionLower.includes('emergency fund')) {
      // Saving increases savings but doesn't immediately affect other metrics
      state.savings += 500;
      
      if (!state.achievements.includes('Savings Milestone')) {
        state.achievements.push('Savings Milestone');
      }
    } 
    else if ((decisionLower.includes('pay') && decisionLower.includes('debt')) || decisionLower.includes('loan')) {
      // Paying debt reduces both debt and savings
      const debtPayment = Math.min(2000, state.debt);
      state.debt -= debtPayment;
      state.savings -= Math.min(state.savings, debtPayment);
      
      if (state.debt === 0 && !state.achievements.includes('Debt Free Champion')) {
        state.achievements.push('Debt Free Champion');
      }
    }
    else if (decisionLower.includes('upgrade') || decisionLower.includes('skill')) {
      // Upgrading skills costs money but increases income
      state.savings -= Math.min(state.savings, 1500);
      state.income += 300;
      
      if (!state.achievements.includes('Skill Builder')) {
        state.achievements.push('Skill Builder');
      }
    }
    else if (decisionLower.includes('continue')) {
      // Just continuing doesn't directly affect finances
      // but may lead to a random event
    }
    
    // Update derived metrics
    state.monthlyBalance = state.income - state.expenses;
    state.debtToIncomeRatio = state.income > 0 ? state.debt / (state.income * 12) : 0;
    state.savingsRatio = state.income > 0 ? state.savings / state.income : 0;
    
    // Update XP based on decision quality
    if (state.monthlyBalance > 0) {
      state.xpEarned += 25;
    }
    
    return state;
  };

  // Process potential random events
  const processRandomEvent = (state: GameState) => {
    // 20% chance of random event
    if (Math.random() < 0.2) {
      const event = financialEvents[Math.floor(Math.random() * financialEvents.length)];
      
      // Apply event impacts
      Object.entries(event.impact).forEach(([key, value]) => {
        if (key === 'income') {
          state.income += (value as number);
        } else if (key === 'expenses') {
          state.expenses += (value as number);
        } else if (key === 'savings') {
          // If value is negative percentage (like -0.1)
          if (value < 0 && value > -1) {
            state.savings += state.savings * (value as number);
          } else {
            state.savings += (value as number);
          }
        } else if (key === 'debt') {
          state.debt += (value as number);
        }
      });
      
      // Update derived metrics
      state.monthlyBalance = state.income - state.expenses;
      state.debtToIncomeRatio = state.income > 0 ? state.debt / (state.income * 12) : 0;
      state.savingsRatio = state.income > 0 ? state.savings / state.income : 0;
      
      return { state, eventMessage: event.message };
    }
    
    return { state, eventMessage: null };
  };

  // Update achievements based on financial metrics
  const updateAchievements = (state: GameState) => {
    const newAchievements = [...state.achievements];
    
    // Check for new achievements
    if (state.monthlyBalance > 0 && !newAchievements.includes('Positive Cash Flow Master')) {
      newAchievements.push('Positive Cash Flow Master');
    }
    
    if (state.savingsRatio > 0.2 && !newAchievements.includes('Strategic Saver')) {
      newAchievements.push('Strategic Saver');
    }
    
    if (state.debtToIncomeRatio < 0.3 && !newAchievements.includes('Debt Management Expert')) {
      newAchievements.push('Debt Management Expert');
    }
    
    if (state.savings > 50000 && !newAchievements.includes('Wealth Builder')) {
      newAchievements.push('Wealth Builder');
    }
    
    // Add XP for new achievements
    const newAchievementsCount = newAchievements.length - state.achievements.length;
    state.xpEarned += newAchievementsCount * 25;
    
    // Level up if enough XP
    state.level = Math.floor(state.xpEarned / 100) + 1;
    
    return { ...state, achievements: newAchievements };
  };

  // Generate response message after a decision
  const generateResponseMessage = (decision: string, state: GameState, eventMessage: string | null) => {
    const { monthlyBalance, debtToIncomeRatio, savingsRatio } = state;
    
    const randomScenario = getRandomScenario(careerPath);
    
    let message = `## Financial Update

You decided to ${decision}.

### Current Status
- Level: ${state.level} (XP: ${state.xpEarned})
- Monthly Income: $${state.income.toLocaleString()}
- Monthly Expenses: $${state.expenses.toLocaleString()}
- Current Savings: $${state.savings.toLocaleString()}
- Current Debt: $${state.debt.toLocaleString()}
- Monthly Balance: $${monthlyBalance.toLocaleString()}
- Debt-to-Income Ratio: ${(debtToIncomeRatio * 100).toFixed(1)}%
- Savings Ratio: ${(savingsRatio * 100).toFixed(1)}%`;

    if (state.achievements.length > 0) {
      message += `\n\n### Achievements
- ${state.achievements.join('\n- ')}`;
    }

    if (eventMessage) {
      message += `\n\n### Event
${eventMessage}`;
    }

    message += `\n\n### Next Scenario
${randomScenario}

What's your decision?`;

    return message;
  };

  // Generate summary message at the end of the game
  const generateSummaryMessage = (name: string, career: string, state: GameState) => {
    return `# Financial Twin Simulation Complete!

## Final Financial Status for ${name} (${career})

### Financial Metrics
- **Final Level**: ${state.level}
- **XP Earned**: ${state.xpEarned}
- **Monthly Income**: $${state.income.toLocaleString()}
- **Monthly Expenses**: $${state.expenses.toLocaleString()}
- **Final Savings**: $${state.savings.toLocaleString()}
- **Remaining Debt**: $${state.debt.toLocaleString()}
- **Monthly Balance**: $${state.monthlyBalance.toLocaleString()}
- **Debt-to-Income Ratio**: ${(state.debtToIncomeRatio * 100).toFixed(1)}%
- **Savings Ratio**: ${(state.savingsRatio * 100).toFixed(1)}%

### Achievements Unlocked
${state.achievements.length > 0 
  ? state.achievements.map(a => `- ${a}`).join('\n') 
  : '- No achievements unlocked'}

### Financial Insights
${generateFinancialInsights(state)}

Thank you for playing the Financial Twin Simulation! You can play again with a different career path to explore more financial scenarios.`;
  };

  // Generate financial insights based on final state
  const generateFinancialInsights = (state: GameState) => {
    const insights = [];
    
    if (state.monthlyBalance <= 0) {
      insights.push("Your expenses exceed your income, creating a negative cash flow. Focus on reducing expenses or increasing income.");
    } else {
      insights.push("You've maintained a positive cash flow, which is essential for financial stability.");
    }
    
    if (state.debtToIncomeRatio > 0.4) {
      insights.push("Your debt-to-income ratio is high. Consider prioritizing debt reduction to improve financial health.");
    } else if (state.debtToIncomeRatio < 0.2) {
      insights.push("You've maintained a healthy debt-to-income ratio, indicating good debt management.");
    }
    
    if (state.savingsRatio < 0.1) {
      insights.push("Your savings ratio is low. Try to save at least 10% of your income for emergencies and future goals.");
    } else if (state.savingsRatio > 0.2) {
      insights.push("Excellent savings habits! You're saving more than 20% of your income.");
    }
    
    return insights.join('\n\n');
  };

  // Get a random scenario based on career
  const getRandomScenario = (career: string) => {
    const scenarios = careerScenarios[career] || [];
    if (scenarios.length === 0) return "What's your next financial move?";
    
    return scenarios[Math.floor(Math.random() * scenarios.length)];
  };

  // Prepare financial metrics for display
  const financialMetrics: FinancialMetricsType = {
    income: gameState.income,
    expenses: gameState.expenses,
    savings: gameState.savings,
    debt: gameState.debt,
    monthlyBalance: gameState.monthlyBalance,
    debtToIncomeRatio: gameState.debtToIncomeRatio,
    savingsRatio: gameState.savingsRatio
  };

  return {
    gameState,
    gameStage,
    currentMessage,
    financialMetrics,
    achievements: gameState.achievements,
    level: gameState.level,
    xpEarned: gameState.xpEarned,
    isProcessing,
    initializeGame,
    makeDecision,
    endGame
  };
}
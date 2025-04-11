import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Castle, Coins, ShieldAlert, TrendingUp, Award, User } from 'lucide-react';
import { DecisionOption } from './types';

// Import custom sprites or avatars if available
import { CareerSprite } from './sprites';

interface PokemonGameUIProps {
  gameState: {
    stage: 'welcome' | 'initialization' | 'making_decisions' | 'conclusion';
    playerName: string;
    careerPath: string;
    income: number;
    expenses: number;
    savings: number;
    debt: number;
    xpEarned: number;
    level: number;
    achievements: string[];
    message: string | null;
    isLoading: boolean;
    roundCount: number;
    nextStep: 'continue' | 'conclude';
    decisionOptions?: DecisionOption[];
  };
  selectedDecision: string;
  onDecisionSelect: (decision: string) => void;
  onContinue: () => void;
  isSubmitting: boolean;
}

export function PokemonGameUI({
  gameState,
  selectedDecision,
  onDecisionSelect,
  onContinue,
  isSubmitting
}: PokemonGameUIProps) {
  const [dialogKey, setDialogKey] = useState(0);
  const [showDecisions, setShowDecisions] = useState(false);
  const [showFullMessage, setShowFullMessage] = useState(false);

  // Reset dialog when the message changes
  useEffect(() => {
    setDialogKey(prev => prev + 1);
  }, [gameState.message]);

  // Show decisions when in making_decisions stage
  useEffect(() => {
    setShowDecisions(gameState.stage === 'making_decisions');
  }, [gameState.stage]);

  // Map career to avatar sprite
  const getAvatarSprite = () => {
    const career = gameState.careerPath.toLowerCase();
    if (career.includes('student')) return 'student';
    if (career.includes('entrepreneur')) return 'entrepreneur';
    if (career.includes('artist')) return 'artist';
    if (career.includes('banker')) return 'banker';
    if (career.includes('software')) return 'software';
    return 'default';
  };

  // Define career-specific themes
  const getCareerTheme = () => {
    const career = gameState.careerPath.toLowerCase();
    if (career.includes('student')) {
      return {
        name: 'Academic Campus',
        background: 'from-gray-900 to-blue-800',
        mapBackground: 'from-blue-800 to-gray-800',
        primaryColor: 'blue',
        domainTitle: `${gameState.playerName}'s University Journey`,
        mapTitle: 'Campus Map',
        statusTitle: 'Academic Status',
        questsTitle: 'Academic Goals',
        advisorTitle: 'Campus Counselor',
        advisorName: 'Prof. Eleanor Wise',
        advisorAbbr: 'CC',
        advisorSprite: '📚',
        decreeTitle: 'Make a Student Decision',
        welcomeMessage: `Welcome to your University Journey, ${gameState.playerName}! As a ${gameState.careerPath}, your path to financial wisdom begins on campus. Prepare to tackle student challenges like tuition and internships while building your future!`,
        initMessage: `Your academic foundation is set, ${gameState.playerName}. Your campus life awaits your decisions. Let's explore your student resources and budget.`,
        decisionMessage: "A new challenge emerges on campus—maybe a tuition hike or a chance for a scholarship. Your Campus Counselor, Prof. Eleanor Wise, has prepared options for your consideration. Choose wisely to enhance your university experience!",
        conclusionMessage: `Your university journey has reached graduation day, ${gameState.playerName}. Behold the future you've shaped with your decisions! Let's review your academic and financial achievements.`
      };
    } else if (career.includes('entrepreneur')) {
      return {
        name: 'Startup Ecosystem',
        background: 'from-gray-900 to-green-800',
        mapBackground: 'from-green-800 to-gray-800',
        primaryColor: 'green',
        domainTitle: `${gameState.playerName}'s Startup Empire`,
        mapTitle: 'Business Map',
        statusTitle: 'Company Status',
        questsTitle: 'Business Milestones',
        advisorTitle: 'Business Mentor',
        advisorName: 'Marcus Venture',
        advisorAbbr: 'BM',
        advisorSprite: '💼',
        decreeTitle: 'Make a Business Decision',
        welcomeMessage: `Welcome to your Startup Empire, ${gameState.playerName}! As a ${gameState.careerPath}, your journey to build a business dynasty begins now. Prepare to conquer financial markets and grow your venture!`,
        initMessage: `Your startup foundation is set, ${gameState.playerName}. Your business world awaits your strategy. Let's explore your entrepreneurial resources.`,
        decisionMessage: "A new opportunity arises in your startup. Your Business Mentor, Marcus Venture, has prepared options for your strategy. Choose wisely to grow your business empire!",
        conclusionMessage: `Your entrepreneurial journey has reached its peak, ${gameState.playerName}. Behold the business empire you've built! Let's review your startup legacy.`
      };
    } else if (career.includes('artist')) {
      return {
        name: 'Creative Studio',
        background: 'from-gray-900 to-purple-800',
        mapBackground: 'from-purple-800 to-gray-800',
        primaryColor: 'purple',
        domainTitle: `${gameState.playerName}'s Artistic Realm`,
        mapTitle: 'Creative Map',
        statusTitle: 'Artistic Status',
        questsTitle: 'Creative Projects',
        advisorTitle: 'Creative Muse',
        advisorName: 'Luna Palette',
        advisorAbbr: 'CM',
        advisorSprite: '🎨',
        decreeTitle: 'Make a Creative Decision',
        welcomeMessage: `Welcome to your Artistic Realm, ${gameState.playerName}! As a ${gameState.careerPath}, your journey to create a masterpiece legacy begins now. Prepare to balance creativity and finances!`,
        initMessage: `Your creative foundation is set, ${gameState.playerName}. Your artistic world awaits your inspiration. Let's explore your creative resources.`,
        decisionMessage: "A new inspiration strikes in your studio. Your Creative Muse, Luna Palette, has prepared options for your art. Choose wisely to enrich your artistic realm!",
        conclusionMessage: `Your artistic journey has reached its peak, ${gameState.playerName}. Behold the creative legacy you've crafted! Let's review your artistic achievements.`
      };
    } else if (career.includes('banker')) {
      return {
        name: 'Financial District',
        background: 'from-gray-900 to-indigo-800',
        mapBackground: 'from-indigo-800 to-gray-800',
        primaryColor: 'indigo',
        domainTitle: `${gameState.playerName}'s Banking Empire`,
        mapTitle: 'Financial Map',
        statusTitle: 'Banking Status',
        questsTitle: 'Financial Targets',
        advisorTitle: 'Investment Advisor',
        advisorName: 'Gordon Sterling',
        advisorAbbr: 'IA',
        advisorSprite: '💰',
        decreeTitle: 'Make a Financial Decision',
        welcomeMessage: `Welcome to your Banking Empire, ${gameState.playerName}! As a ${gameState.careerPath}, your journey to dominate the financial world begins now. Prepare to manage wealth and investments!`,
        initMessage: `Your banking foundation is set, ${gameState.playerName}. Your financial district awaits your decisions. Let's explore your banking resources.`,
        decisionMessage: "A new financial challenge arises in your district. Your Investment Advisor, Gordon Sterling, has prepared options for your portfolio. Choose wisely to strengthen your banking empire!",
        conclusionMessage: `Your banking career has reached its peak, ${gameState.playerName}. Behold the financial empire you've built! Let's review your banking legacy.`
      };
    } else if (career.includes('software')) {
      return {
        name: 'Tech Hub',
        background: 'from-gray-900 to-cyan-800',
        mapBackground: 'from-cyan-800 to-gray-800',
        primaryColor: 'cyan',
        domainTitle: `${gameState.playerName}'s Tech Dominion`,
        mapTitle: 'Tech Map',
        statusTitle: 'Tech Status',
        questsTitle: 'Tech Innovations',
        advisorTitle: 'Tech Mentor',
        advisorName: 'Ada Codewell',
        advisorAbbr: 'TM',
        advisorSprite: '💻',
        decreeTitle: 'Make a Tech Decision',
        welcomeMessage: `Welcome to your Tech Dominion, ${gameState.playerName}! As a ${gameState.careerPath}, your journey to innovate and build wealth in tech begins now. Prepare to code your way to financial success!`,
        initMessage: `Your tech foundation is set, ${gameState.playerName}. Your digital realm awaits your innovations. Let's explore your tech resources.`,
        decisionMessage: "A new tech challenge emerges in your hub. Your Tech Mentor, Ada Codewell, has prepared options for your project. Choose wisely to advance your tech dominion!",
        conclusionMessage: `Your tech career has reached its peak, ${gameState.playerName}. Behold the digital empire you've engineered! Let's review your tech legacy.`
      };
    } else {
      return {
        name: 'Financial Kingdom',
        background: 'from-gray-900 to-blue-900',
        mapBackground: 'from-blue-900 to-gray-900',
        primaryColor: 'blue',
        domainTitle: `${gameState.playerName}'s Financial Kingdom`,
        mapTitle: 'Kingdom Map',
        statusTitle: 'Kingdom Status',
        questsTitle: 'Royal Quests',
        advisorTitle: 'Royal Advisor',
        advisorName: 'Sir Reginald Goldheart',
        advisorAbbr: 'RA',
        advisorSprite: '👑',
        decreeTitle: 'Issue a Royal Decree',
        welcomeMessage: `Welcome to the Financial Kingdom, ${gameState.playerName}! As a ${gameState.careerPath}, your journey to build a mighty empire begins now. Prepare to conquer financial challenges and grow your wealth!`,
        initMessage: `Your kingdom's foundation is set, ${gameState.playerName}. Your financial realm awaits your command. Let's explore your empire's resources.`,
        decisionMessage: "A new challenge arises in your kingdom. Your Royal Advisor, Sir Reginald Goldheart, has prepared options for your decree. Choose wisely to strengthen your empire!",
        conclusionMessage: `Your reign has reached its peak, ${gameState.playerName}. Behold the empire you've built! Let's review your legacy in the Financial Kingdom.`
      };
    }
  };

  const careerTheme = getCareerTheme();

  // Function to get scene-specific message
  const getSceneMessage = () => {
    if (gameState.stage === 'welcome') {
      return gameState.message || careerTheme.welcomeMessage;
    } else if (gameState.stage === 'initialization') {
      return gameState.message || careerTheme.initMessage;
    } else if (gameState.stage === 'making_decisions') {
      return gameState.message || careerTheme.decisionMessage;
    } else if (gameState.stage === 'conclusion') {
      return gameState.message || careerTheme.conclusionMessage;
    }
    return gameState.message;
  };

  // Function to truncate long messages
  const truncateMessage = (msg: string, maxLength: number = 200) => {
    if (msg.length <= maxLength) return msg;
    return msg.substring(0, maxLength) + '...';
  };

  // Determine if message is too long
  const isMessageLong = gameState.message && gameState.message.length > 200;
  const displayMessage = showFullMessage || !isMessageLong ? gameState.message || '' : truncateMessage(gameState.message || '');

  // Function to get a visual representation of financial health
  const getKingdomHealth = () => {
    const savingsRatio = gameState.income > 0 ? gameState.savings / gameState.income : 0;
    if (savingsRatio > 0.5) return { text: 'Prosperous Empire', color: 'text-green-400', icon: <Coins className="h-5 w-5 text-green-400" /> };
    if (savingsRatio > 0.2) return { text: 'Stable Kingdom', color: 'text-yellow-400', icon: <TrendingUp className="h-5 w-5 text-yellow-400" /> };
    return { text: 'Struggling Realm', color: 'text-red-400', icon: <ShieldAlert className="h-5 w-5 text-red-400" /> };
  };

  // Create a visual level progress bar
  const getLevelProgress = () => {
    const xpForNextLevel = gameState.level * 100;
    const progress = Math.min(100, Math.round((gameState.xpEarned / xpForNextLevel) * 100));
    return (
      <div className="w-full bg-gray-700 rounded-full h-2.5 mt-1">
        <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen w-full bg-gradient-to-br ${careerTheme.background} text-white p-0 flex items-center justify-center`}>
      <div className="w-full h-screen flex flex-col overflow-hidden">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full mb-2 text-center flex-shrink-0 p-2 relative"
        >
          <h1 className={`text-3xl md:text-4xl font-bold text-${careerTheme.primaryColor}-200`}>{careerTheme.domainTitle}</h1>
          <p className="text-base text-gray-300 mt-1">Level {gameState.level} - {gameState.careerPath}</p>
          {/* Achievement Badges */}
          <div className="absolute top-2 right-2 flex space-x-2">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 1 }}
              className={`w-8 h-8 bg-${careerTheme.primaryColor}-600 rounded-full flex items-center justify-center text-sm font-bold text-white border-2 border-${careerTheme.primaryColor}-400 shadow-lg`}
              title="Savings Master"
            >
              £
            </motion.div>
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 1.5 }}
              className={`w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-sm font-bold text-white border-2 border-red-400 shadow-lg opacity-50`}
              title="Debt Slayer (Locked)"
            >
              D
            </motion.div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="w-full h-full flex flex-col md:flex-row gap-2 flex-grow overflow-hidden max-h-[calc(100vh-60px)] md:max-h-[calc(100vh-70px)] px-2 md:px-4">
          {/* Left Column - Map and Status */}
          <div className="w-full md:w-1/3 flex flex-col gap-2 overflow-y-auto max-h-[calc(100vh-60px)] md:max-h-[calc(100vh-70px)] scrollbar-hide">
            {/* Map */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className={`financial-map bg-gray-800 bg-opacity-70 rounded-xl p-3 shadow-lg border border-${careerTheme.primaryColor}-700/30 flex-shrink-0 h-64 md:h-72 relative overflow-hidden`}
            >
              <h2 className={`text-lg font-bold text-${careerTheme.primaryColor}-300 mb-2 flex items-center relative z-10`}><Castle className={`mr-2 h-5 w-5 text-${careerTheme.primaryColor}-400`} /> {careerTheme.mapTitle}</h2>
              <div className={`relative h-52 md:h-60 w-full bg-gradient-to-b ${careerTheme.mapBackground} rounded-lg overflow-hidden border border-${careerTheme.primaryColor}-800/50`}>
                {/* Animated Background Effect */}
                <div className={`absolute inset-0 opacity-20`}
                  style={{ 
                    backgroundImage: careerTheme.name === 'Academic Campus' ? 'url("data:image/svg+xml,%3Csvg width=\"100\" height=\"100\" viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cpath d=\"M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-6-3l2.292-2.292c.39-.39.39-1.024 0-1.414s-1.024-.39-1.414 0L52 37.586l-2.292-2.292c-.39-.39-1.024-.39-1.414 0s-.39 1.024 0 1.414L50.586 39l-2.292 2.292c-.39.39-.39 1.024 0 1.414s1.024.39 1.414 0L52 40.414l2.292 2.292c.39.39 1.024.39 1.414 0s.39-1.024 0-1.414L53.414 39l2.292-2.292c.39-.39.39-1.024 0-1.414s-1.024-.39-1.414 0L52 37.586l-2.292-2.292c-.39-.39-1.024-.39-1.414 0s-.39 1.024 0 1.414L50.586 39z\" fill=\"%23fff\" fill-opacity=\"1\" fill-rule=\"evenodd\"/%3E%3C/svg%3E")' : 'url("data:image/svg+xml,%3Csvg width=\"100\" height=\"100\" viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cpath d=\"M45 35h10v10H45z\" fill=\"%23fff\" fill-opacity=\"1\" fill-rule=\"evenodd\"/%3E%3C/svg%3E")', 
                    backgroundSize: '100px 100px',
                    animation: 'mapPulse 10s infinite ease-in-out'
                  }}
                ></div>
                {/* Animated Particles */}
                <div className="absolute inset-0 overflow-hidden">
                  {[...Array(5)].map((_, i) => (
                    <motion.div 
                      key={i}
                      className={`absolute w-1 h-1 bg-${careerTheme.primaryColor}-400 rounded-full opacity-50`}
                      initial={{ x: Math.random() * 100 + '%', y: Math.random() * 100 + '%' }}
                      animate={{ 
                        x: Math.random() * 100 + '%', 
                        y: Math.random() * 100 + '%',
                        opacity: [0.3, 0.8, 0.3]
                      }}
                      transition={{ 
                        duration: Math.random() * 10 + 5, 
                        repeat: Infinity, 
                        repeatType: "reverse" 
                      }}
                    />
                  ))}
                </div>
                {/* Pathways */}
                <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
                  <defs>
                    <marker id="arrowhead" markerWidth="5" markerHeight="3.5" refX="5" refY="1.75" orient="auto" markerUnits="strokeWidth">
                      <polygon points="0 0, 5 1.75, 0 3.5" fill={`text-${careerTheme.primaryColor}-400`} />
                    </marker>
                  </defs>
                  <motion.line x1="25%" y1="15%" x2="75%" y2="25%" stroke={`url(#gradient-${careerTheme.primaryColor})`} strokeWidth="2" strokeDasharray="5,5" markerEnd="url(#arrowhead)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }} />
                  <motion.line x1="20%" y1="75%" x2="80%" y2="65%" stroke={`url(#gradient-${careerTheme.primaryColor})`} strokeWidth="2" strokeDasharray="5,5" markerEnd="url(#arrowhead)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 4, repeat: Infinity, repeatType: 'reverse', delay: 1 }} />
                  <defs>
                    <linearGradient id={`gradient-${careerTheme.primaryColor}`} x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor={`#${careerTheme.primaryColor === 'blue' ? '3b82f6' : '10b981'}`} stopOpacity="0.5" />
                      <stop offset="100%" stopColor={`#${careerTheme.primaryColor === 'blue' ? '1e40af' : '059669'}`} stopOpacity="0.5" />
                    </linearGradient>
                  </defs>
                </svg>
                {/* Map elements */}
                <motion.div className={`absolute top-10 left-1/4 w-20 h-20 bg-${careerTheme.primaryColor}-700/60 rounded-full flex items-center justify-center border-2 border-${careerTheme.primaryColor}-500/50 cursor-pointer z-10`} animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} whileHover={{ scale: 1.1 }}>
                  <div className={`text-center text-sm font-bold text-${careerTheme.primaryColor}-200`}>Savings<br/>{gameState.savings.toLocaleString('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits: 0, maximumFractionDigits: 0 })}</div>
                </motion.div>
                <motion.div className={`absolute top-1/3 right-1/4 w-20 h-20 bg-red-800/60 rounded-md flex items-center justify-center border-2 border-red-600/50 cursor-pointer z-10`} animate={{ y: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 2 }} whileHover={{ scale: 1.1 }}>
                  <div className="text-center text-sm font-bold text-red-200">Debt<br/>{gameState.debt.toLocaleString('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits: 0, maximumFractionDigits: 0 })}</div>
                </motion.div>
                {/* Level Checkpoint */}
                <motion.div 
                  className={`absolute top-3/4 left-1/2 w-16 h-16 bg-yellow-700/60 rounded-full flex items-center justify-center border-2 border-yellow-500/50 cursor-pointer z-10 transform -translate-x-1/2 -translate-y-1/2`}
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  whileHover={{ scale: 1.1 }}
                >
                  <div className="text-center text-xs font-bold text-yellow-200">Level {gameState.level}</div>
                </motion.div>
              </div>
            </motion.div>

            {/* Status */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className={`royal-status bg-gray-800 bg-opacity-70 rounded-xl p-3 shadow-lg border border-${careerTheme.primaryColor}-700/30 flex-shrink-0 h-28 md:h-32 relative`}>
              <h2 className={`text-lg font-bold text-${careerTheme.primaryColor}-300 mb-2 flex items-center`}><Coins className={`mr-2 h-5 w-5 text-${careerTheme.primaryColor}-400`} /> {careerTheme.statusTitle}</h2>
              <div className="grid grid-cols-2 gap-2 text-base">
                <div className={`flex items-center text-${careerTheme.primaryColor}-200`}><div className={`w-2 h-2 bg-${careerTheme.primaryColor}-400 rounded-full mr-2`}></div>Savings: {gameState.savings.toLocaleString('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits: 0, maximumFractionDigits: 0 })}</div>
                <div className="flex items-center text-red-200"><div className="w-2 h-2 bg-red-400 rounded-full mr-2"></div>Debt: {gameState.debt.toLocaleString('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits: 0, maximumFractionDigits: 0 })}</div>
              </div>
              <div className="mt-2">
                <p className={`text-sm text-${careerTheme.primaryColor}-300 mb-1`}>Progress to Next Level</p>
                <div className="w-full bg-gray-700 rounded-full h-3 relative overflow-hidden">
                  <motion.div 
                    className={`bg-${careerTheme.primaryColor}-600 h-3 rounded-full`}
                    style={{ width: `${Math.min(gameState.xpEarned || 0, 100)}%` }}
                    initial={{ x: '-100%' }}
                    animate={{ x: 0 }}
                    transition={{ duration: 1.5, ease: 'easeOut', delay: 0.5 }}
                  ></motion.div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20 pointer-events-none rounded-full"></div>
                </div>
                <motion.div 
                  className={`text-xs text-${careerTheme.primaryColor}-200 mt-1 text-center`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 2 }}
                >
                  {Math.round((gameState.xpEarned || 0))}% complete
                </motion.div>
              </div>
              {/* Level Up Notification */}
              {gameState.xpEarned && gameState.xpEarned > 90 && (
                <motion.div 
                  className={`absolute -top-2 -right-2 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-full border border-yellow-300 shadow-lg`}
                  initial={{ scale: 0, rotate: -10 }}
                  animate={{ scale: [1, 1.2, 1], rotate: 0 }}
                  transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
                >
                  Level Up Soon!
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Right Column - Quests, Advisor, Scenarios */}
          <div className="w-full md:w-2/3 flex flex-col gap-2 overflow-y-auto max-h-[calc(100vh-60px)] md:max-h-[calc(100vh-70px)] scrollbar-hide">
            {/* Quests and Advisor */}
            <div className="flex flex-row gap-2 h-40 md:h-48">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 }} className={`royal-quests bg-gray-800 bg-opacity-70 rounded-xl p-3 shadow-lg border border-${careerTheme.primaryColor}-700/30 flex-shrink-0 w-1/2 relative overflow-hidden`}>
                <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-500/20 rounded-bl-full"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-yellow-500/10 rounded-tr-full"></div>
                <h2 className={`text-lg font-bold text-${careerTheme.primaryColor}-300 mb-2 flex items-center relative z-10`}><Award className={`mr-2 h-5 w-5 text-${careerTheme.primaryColor}-400 animate-pulse`} /> {careerTheme.questsTitle}</h2>
                <p className={`text-sm text-${careerTheme.primaryColor}-100 mb-2`}>Tasks to advance:</p>
                <ul className={`space-y-1 text-sm text-${careerTheme.primaryColor}-200`}>
                  <motion.li className="flex items-center" initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.8 }}><span className={`w-2 h-2 bg-${careerTheme.primaryColor}-400 rounded-full mr-2`}></span>Increase savings 10%</motion.li>
                  <motion.li className="flex items-center" initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 1.0 }}><span className={`w-2 h-2 bg-${careerTheme.primaryColor}-400 rounded-full mr-2`}></span>Reduce debt £5K</motion.li>
                  <motion.li className="flex items-center" initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 1.2 }}><span className={`w-2 h-2 bg-${careerTheme.primaryColor}-400 rounded-full mr-2`}></span>Reach Level {gameState.level + 1}</motion.li>
                </ul>
                <motion.div 
                  className={`absolute -bottom-2 -right-2 text-xs ${careerTheme.primaryColor === 'blue' ? 'text-blue-300 bg-blue-900/30' : 'text-green-300 bg-green-900/30'} px-1 py-0.5 rounded-full`}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.5, duration: 0.5 }}
                >
                  +50 XP
                </motion.div>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.8 }} className={`advisor-panel bg-gray-800 bg-opacity-70 rounded-xl p-3 shadow-lg border border-${careerTheme.primaryColor}-700/30 flex-shrink-0 w-1/2 relative overflow-hidden`}>
                <motion.div 
                  className={`absolute top-0 left-0 w-full h-full bg-${careerTheme.primaryColor}-500/10`}
                  animate={{ opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 5, repeat: Infinity }}
                ></motion.div>
                <h2 className={`text-lg font-bold text-${careerTheme.primaryColor}-300 mb-2 flex items-center relative z-10`}><User className={`mr-2 h-5 w-5 text-${careerTheme.primaryColor}-400`} /> {careerTheme.advisorTitle}</h2>
                <div className="flex items-center mb-2">
                  <motion.div 
                    className={`w-10 h-10 bg-${careerTheme.primaryColor}-800 rounded-full flex items-center justify-center text-xl mr-2 border-2 border-${careerTheme.primaryColor}-600/50`}
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                  >
                    {careerTheme.advisorSprite}
                  </motion.div>
                  <div>
                    <p className={`font-medium text-${careerTheme.primaryColor}-200 text-base`}>{careerTheme.advisorName}</p>
                  </div>
                </div>
                <motion.div 
                  className={`text-xs text-${careerTheme.primaryColor}-200 italic mt-2 bg-${careerTheme.primaryColor}-900/30 px-2 py-1 rounded-lg inline-block`}
                  animate={{ opacity: [1, 0.7, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  "Make wise choices!"
                </motion.div>
              </motion.div>
            </div>

            {/* Scenarios */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className={`scenario-section bg-gray-800 bg-opacity-70 rounded-xl p-3 shadow-lg border border-${careerTheme.primaryColor}-700/30 flex-grow overflow-y-auto max-h-[calc(100vh-240px)] md:max-h-[calc(100vh-280px)] relative overflow-hidden`}>
              <div className="absolute top-0 left-0 w-24 h-24 bg-red-500/10 rounded-br-full"></div>
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-red-500/10 rounded-tl-full"></div>
              <h2 className={`text-xl font-bold text-${careerTheme.primaryColor}-300 mb-2 flex items-center relative z-10`}><ShieldAlert className={`mr-2 h-5 w-5 text-${careerTheme.primaryColor}-400 animate-pulse`} /> {careerTheme.decreeTitle}</h2>
              <div className="bg-gray-700/50 rounded-lg p-3 border border-gray-600/30 mb-2 h-28 md:h-32 overflow-y-auto relative">
                <motion.div 
                  className={`absolute top-0 right-0 text-xs text-white bg-${careerTheme.primaryColor}-800/50 px-2 py-1 rounded-bl-md border-b border-l border-${careerTheme.primaryColor}-700/30`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  New Event
                </motion.div>
                <ReactMarkdown>{getSceneMessage()}</ReactMarkdown>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                {gameState.decisionOptions && gameState.decisionOptions.length > 0 && gameState.decisionOptions.map((option: DecisionOption, index: number) => (
                  <motion.div 
                    key={option.value} 
                    className={`bg-gray-700/60 p-3 rounded-lg border border-${careerTheme.primaryColor}-800/40 cursor-pointer hover:bg-gray-700/80 transition-all duration-200 relative overflow-hidden`}
                    whileHover={{ scale: 1.02, boxShadow: '0 0 10px rgba(255, 255, 255, 0.2)' }} 
                    whileTap={{ scale: 0.98 }} 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 * index + 0.5 }}
                    onClick={() => onDecisionSelect(option.value)}
                  >
                    <motion.div 
                      className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-${careerTheme.primaryColor}-600/50 to-transparent`}
                      initial={{ x: '-100%' }}
                      animate={{ x: '100%' }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                    ></motion.div>
                    <h3 className={`font-bold text-${careerTheme.primaryColor}-200 mb-1 flex items-center`}><div className={`w-6 h-6 bg-${careerTheme.primaryColor}-900/50 rounded-full flex items-center justify-center text-sm mr-2`}>{index + 1}</div> {option.label}</h3>
                    <p className="text-gray-300 text-sm line-clamp-2">{option.description}</p>
                    <motion.div 
                      className={`absolute top-2 right-2 text-xs text-gray-300 bg-gray-800/30 px-1 py-0.5 rounded-full`}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 * index + 1 }}
                    >
                      Impact
                    </motion.div>
                  </motion.div>
                ))}
              </div>
              <div className="flex justify-center mt-2">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button onClick={onContinue} disabled={isSubmitting || (gameState.stage === 'making_decisions' && !selectedDecision)} className={`bg-${careerTheme.primaryColor}-600 hover:bg-${careerTheme.primaryColor}-700 text-white px-8 py-3 rounded-md transition-colors duration-200 text-lg shadow-lg border border-${careerTheme.primaryColor}-500/30`}>
                    {isSubmitting ? 'Processing...' : (
                      <>
                        {gameState.stage === 'welcome' && 'Begin Your Journey'}
                        {gameState.stage === 'initialization' && 'Establish Your Domain'}
                        {gameState.stage === 'making_decisions' && 'Confirm Decision'}
                        {gameState.stage === 'conclusion' && 'Review Your Achievements'}
                      </>
                    )}
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
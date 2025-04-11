import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge as UIBadge } from '@/components/ui/badge';
import {
  Trophy,
  GraduationCap,
  Briefcase,
  LineChart,
  Wallet,
  Cpu,
  Lightbulb,
  Sparkles,
  Target,
  PiggyBank,
  Rocket,
  Award,
  Medal,
  TrendingUp,
  BrainCircuit,
  Calculator,
  Gamepad2,
  ShieldCheck,
  BadgeCheck,
  Gem
} from 'lucide-react';

// Badge types and data
export interface Badge {
  id: string;
  name: string;
  description: string;
  category: 'learning' | 'finance' | 'achievement' | 'special';
  icon: React.ReactNode;
  color: string;
  level: 1 | 2 | 3 | 4 | 5;
  unlocked: boolean;
  progress?: number;
  dateEarned?: Date;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  requirement: string;
  points: number;
}

// Badge categories with their descriptions
export const badgeCategories = {
  learning: {
    name: 'Learning',
    description: 'Badges earned by completing educational content',
    icon: <GraduationCap />,
    color: 'bg-blue-500 dark:bg-blue-600'
  },
  finance: {
    name: 'Financial Mastery',
    description: 'Badges earned by demonstrating financial skills',
    icon: <LineChart />,
    color: 'bg-green-500 dark:bg-green-600'
  },
  achievement: {
    name: 'Achievement',
    description: 'Badges earned by reaching milestones',
    icon: <Trophy />,
    color: 'bg-purple-500 dark:bg-purple-600'
  },
  special: {
    name: 'Special',
    description: 'Limited edition and special event badges',
    icon: <Sparkles />,
    color: 'bg-amber-500 dark:bg-amber-600'
  }
};

// Rarity colors for badges
export const rarityColors = {
  common: 'from-slate-400 to-slate-500',
  uncommon: 'from-green-400 to-green-600',
  rare: 'from-blue-400 to-blue-600',
  epic: 'from-purple-400 to-purple-600',
  legendary: 'from-amber-400 to-amber-600'
};

// Badge difficulty/level names
export const badgeLevelNames = {
  1: 'Novice',
  2: 'Apprentice',
  3: 'Adept',
  4: 'Expert',
  5: 'Master'
};

// Sample badge collection (these would come from the API in a real implementation)
export const badgeCollection: Badge[] = [
  // Learning Badges
  {
    id: 'learning-beginner',
    name: 'Learning Beginner',
    description: 'Completed your first learning module',
    category: 'learning',
    icon: <GraduationCap />,
    color: 'bg-blue-500',
    level: 1,
    unlocked: true,
    progress: 100,
    dateEarned: new Date('2025-01-15'),
    rarity: 'common',
    requirement: 'Complete 1 learning module',
    points: 10
  },
  {
    id: 'knowledge-seeker',
    name: 'Knowledge Seeker',
    description: 'Completed 5 learning modules',
    category: 'learning',
    icon: <Lightbulb />,
    color: 'bg-blue-500',
    level: 2,
    unlocked: true,
    progress: 100,
    dateEarned: new Date('2025-02-01'),
    rarity: 'uncommon',
    requirement: 'Complete 5 learning modules',
    points: 25
  },
  {
    id: 'financial-scholar',
    name: 'Financial Scholar',
    description: 'Completed all modules in one learning path',
    category: 'learning',
    icon: <BrainCircuit />,
    color: 'bg-blue-500',
    level: 3,
    unlocked: false,
    progress: 75,
    rarity: 'rare',
    requirement: 'Complete all modules in one learning path',
    points: 50
  },
  {
    id: 'master-of-finance',
    name: 'Master of Finance',
    description: 'Completed all available learning modules',
    category: 'learning',
    icon: <Award />,
    color: 'bg-blue-500',
    level: 5,
    unlocked: false,
    progress: 30,
    rarity: 'legendary',
    requirement: 'Complete all available learning modules',
    points: 150
  },
  
  // Quiz Badges
  {
    id: 'quiz-novice',
    name: 'Quiz Novice',
    description: 'Passed your first quiz',
    category: 'learning',
    icon: <Target />,
    color: 'bg-blue-500',
    level: 1,
    unlocked: true,
    progress: 100,
    dateEarned: new Date('2025-01-20'),
    rarity: 'common',
    requirement: 'Pass 1 quiz',
    points: 10
  },
  {
    id: 'quiz-master',
    name: 'Quiz Master',
    description: 'Achieved a perfect score on 5 quizzes',
    category: 'learning',
    icon: <BadgeCheck />,
    color: 'bg-blue-500',
    level: 3,
    unlocked: false,
    progress: 60,
    rarity: 'rare',
    requirement: 'Get a perfect score on 5 quizzes',
    points: 50
  },
  
  // Finance Badges
  {
    id: 'budgeting-novice',
    name: 'Budgeting Novice',
    description: 'Created your first budget',
    category: 'finance',
    icon: <Wallet />,
    color: 'bg-green-500',
    level: 1,
    unlocked: true,
    progress: 100,
    dateEarned: new Date('2025-01-25'),
    rarity: 'common',
    requirement: 'Create a budget',
    points: 10
  },
  {
    id: 'savings-goal',
    name: 'Savings Goal Achiever',
    description: 'Reached a savings goal',
    category: 'finance',
    icon: <PiggyBank />,
    color: 'bg-green-500',
    level: 2,
    unlocked: true,
    progress: 100,
    dateEarned: new Date('2025-02-10'),
    rarity: 'uncommon',
    requirement: 'Reach a savings goal',
    points: 25
  },
  {
    id: 'investment-guru',
    name: 'Investment Guru',
    description: 'Created and maintained a diversified investment portfolio',
    category: 'finance',
    icon: <TrendingUp />,
    color: 'bg-green-500',
    level: 4,
    unlocked: false,
    progress: 40,
    rarity: 'epic',
    requirement: 'Create and maintain a diversified investment portfolio',
    points: 100
  },
  
  // Achievement Badges
  {
    id: 'early-bird',
    name: 'Early Bird',
    description: 'Logged in for 7 consecutive days',
    category: 'achievement',
    icon: <Rocket />,
    color: 'bg-purple-500',
    level: 1,
    unlocked: true,
    progress: 100,
    dateEarned: new Date('2025-01-08'),
    rarity: 'common',
    requirement: 'Log in for 7 consecutive days',
    points: 15
  },
  {
    id: 'consistent-learner',
    name: 'Consistent Learner',
    description: 'Completed at least one learning activity for 30 consecutive days',
    category: 'achievement',
    icon: <Medal />,
    color: 'bg-purple-500',
    level: 3,
    unlocked: false,
    progress: 53,
    rarity: 'rare',
    requirement: 'Complete at least one learning activity for 30 consecutive days',
    points: 75
  },
  
  // Game Badges
  {
    id: 'game-explorer',
    name: 'Game Explorer',
    description: 'Played your first financial game',
    category: 'achievement',
    icon: <Gamepad2 />,
    color: 'bg-purple-500',
    level: 1,
    unlocked: true,
    progress: 100,
    dateEarned: new Date('2025-01-30'),
    rarity: 'common',
    requirement: 'Play a financial game',
    points: 10
  },
  {
    id: 'simulation-master',
    name: 'Simulation Master',
    description: 'Successfully completed a full life simulation with a high financial score',
    category: 'achievement',
    icon: <Cpu />,
    color: 'bg-purple-500',
    level: 4,
    unlocked: false,
    progress: 25,
    rarity: 'epic',
    requirement: 'Complete a life simulation with a financial score of 80+',
    points: 100
  },
  
  // Special Badges
  {
    id: 'early-adopter',
    name: 'Early Adopter',
    description: 'Joined during the platform\'s beta phase',
    category: 'special',
    icon: <Sparkles />,
    color: 'bg-amber-500',
    level: 2,
    unlocked: true,
    progress: 100,
    dateEarned: new Date('2025-01-01'),
    rarity: 'rare',
    requirement: 'Join during beta phase',
    points: 50
  },
  {
    id: 'financial-guardian',
    name: 'Financial Guardian',
    description: 'A rare badge awarded to users who demonstrate exceptional financial literacy',
    category: 'special',
    icon: <ShieldCheck />,
    color: 'bg-amber-500',
    level: 5,
    unlocked: false,
    progress: 10,
    rarity: 'legendary',
    requirement: 'Demonstrate exceptional financial literacy across all platform features',
    points: 200
  },
  {
    id: 'diamond-member',
    name: 'Diamond Member',
    description: 'Reached the highest member status through continuous engagement',
    category: 'special',
    icon: <Gem />,
    color: 'bg-amber-500',
    level: 5,
    unlocked: false,
    progress: 5,
    rarity: 'legendary',
    requirement: 'Reach 1000 points and complete all major platform activities',
    points: 250
  }
];

// Badge card component for displaying a single badge
interface BadgeCardProps {
  badge: Badge;
  showDetails?: boolean;
  onClick?: () => void;
}

export const BadgeCard: React.FC<BadgeCardProps> = ({ badge, showDetails = false, onClick }) => {
  return (
    <Card 
      className={`overflow-hidden transition-all duration-300 hover:shadow-lg ${badge.unlocked ? '' : 'bg-gray-100 dark:bg-slate-900/50 opacity-70'}`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex flex-col items-center text-center">
          {/* Badge Icon */}
          <div className={`w-16 h-16 rounded-full ${badge.unlocked ? `bg-gradient-to-br ${rarityColors[badge.rarity]}` : 'bg-gray-300 dark:bg-gray-700'} flex items-center justify-center mb-3 p-3 shadow-lg`}>
            <div className="text-white w-10 h-10">
              {badge.icon}
            </div>
          </div>
          
          {/* Badge Name and Rarity */}
          <h3 className="font-semibold mt-2 text-lg">{badge.name}</h3>
          <div className="flex items-center mt-1 mb-1">
            <UIBadge variant={badge.unlocked ? "default" : "outline"} className={badge.unlocked ? `bg-gradient-to-r ${rarityColors[badge.rarity]} text-white` : "text-gray-500"}>
              {badge.rarity.charAt(0).toUpperCase() + badge.rarity.slice(1)}
            </UIBadge>
            <span className="mx-1 text-gray-400">•</span>
            <UIBadge variant="outline">Level {badge.level}</UIBadge>
          </div>
          
          {/* Badge Description */}
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
            {badge.description}
          </p>
          
          {/* Badge Progress */}
          {!badge.unlocked && (
            <div className="w-full mt-3">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Progress</span>
                <span>{badge.progress}%</span>
              </div>
              <Progress value={badge.progress} className="h-2" />
            </div>
          )}
          
          {/* Badge Date and Points */}
          {showDetails && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 w-full">
              <div className="grid grid-cols-2 gap-2 text-sm">
                {badge.dateEarned && (
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Earned on</p>
                    <p className="font-medium">{badge.dateEarned.toLocaleDateString()}</p>
                  </div>
                )}
                <div className={badge.dateEarned ? "" : "col-span-2"}>
                  <p className="text-gray-500 dark:text-gray-400">Points</p>
                  <p className="font-medium">{badge.points} pts</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Badge grid for displaying multiple badges
interface BadgeGridProps {
  badges: Badge[];
  onBadgeClick?: (badge: Badge) => void;
  filtering?: boolean;
}

export const BadgeGrid: React.FC<BadgeGridProps> = ({ badges, onBadgeClick, filtering = true }) => {
  const [filter, setFilter] = React.useState<string>('all');
  const [sort, setSort] = React.useState<string>('newest');
  
  // Filter badges based on the selected filter
  const filteredBadges = badges.filter(badge => {
    if (filter === 'all') return true;
    if (filter === 'unlocked') return badge.unlocked;
    if (filter === 'locked') return !badge.unlocked;
    return badge.category === filter;
  });
  
  // Sort badges based on the selected sort option
  const sortedBadges = [...filteredBadges].sort((a, b) => {
    if (sort === 'newest') {
      // Sort by date earned (if unlocked)
      if (a.dateEarned && b.dateEarned) {
        return b.dateEarned.getTime() - a.dateEarned.getTime();
      }
      // Unlocked badges come before locked ones
      if (a.unlocked && !b.unlocked) return -1;
      if (!a.unlocked && b.unlocked) return 1;
      return 0;
    }
    if (sort === 'rarity') {
      // Convert rarity to numeric value for sorting
      const rarityOrder = { common: 1, uncommon: 2, rare: 3, epic: 4, legendary: 5 };
      return rarityOrder[b.rarity] - rarityOrder[a.rarity];
    }
    if (sort === 'level') {
      return b.level - a.level;
    }
    if (sort === 'progress') {
      // Unlocked badges first, then by progress
      if (a.unlocked && !b.unlocked) return -1;
      if (!a.unlocked && b.unlocked) return 1;
      if (!a.unlocked && !b.unlocked) {
        return (b.progress || 0) - (a.progress || 0);
      }
      return 0;
    }
    return 0;
  });
  
  // Calculate badge statistics
  const totalBadges = badges.length;
  const unlockedBadges = badges.filter(badge => badge.unlocked).length;
  const badgeProgress = (unlockedBadges / totalBadges) * 100;
  
  return (
    <div className="space-y-6">
      {/* Badge Progress Overview */}
      <div className="rounded-lg shadow p-4 border border-border/30">
        <h2 className="text-xl font-semibold mb-3">Your Badge Collection</h2>
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
          <span>Progress</span>
          <span>{unlockedBadges} / {totalBadges} ({Math.round(badgeProgress)}%)</span>
        </div>
        <Progress value={badgeProgress} className="h-2.5" />
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
          {Object.entries(badgeCategories).map(([key, category]) => (
            <div key={key} className="text-center">
              <div className={`w-10 h-10 mx-auto rounded-full ${category.color} flex items-center justify-center mb-2`}>
                <div className="text-white w-5 h-5">
                  {category.icon}
                </div>
              </div>
              <p className="text-sm font-medium">{category.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {badges.filter(b => b.category === key && b.unlocked).length} / {badges.filter(b => b.category === key).length}
              </p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Filtering and Sorting Options */}
      {filtering && (
        <div className="flex flex-col sm:flex-row justify-between gap-3 mb-4">
          <div className="flex flex-wrap gap-2">
            <UIBadge 
              variant={filter === 'all' ? "default" : "outline"}
              className="cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700"
              onClick={() => setFilter('all')}
            >
              All Badges
            </UIBadge>
            <UIBadge 
              variant={filter === 'unlocked' ? "default" : "outline"}
              className="cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700"
              onClick={() => setFilter('unlocked')}
            >
              Unlocked
            </UIBadge>
            <UIBadge 
              variant={filter === 'locked' ? "default" : "outline"}
              className="cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700"
              onClick={() => setFilter('locked')}
            >
              Locked
            </UIBadge>
            {Object.entries(badgeCategories).map(([key, category]) => (
              <UIBadge 
                key={key}
                variant={filter === key ? "default" : "outline"}
                className="cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700"
                onClick={() => setFilter(key)}
              >
                {category.name}
              </UIBadge>
            ))}
          </div>
          
          <div className="flex gap-2">
            <select 
              className="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 text-sm p-1.5"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="rarity">Rarity</option>
              <option value="level">Level</option>
              <option value="progress">Progress</option>
            </select>
          </div>
        </div>
      )}
      
      {/* Badge Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {sortedBadges.map((badge) => (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <BadgeCard 
              badge={badge} 
              onClick={() => onBadgeClick && onBadgeClick(badge)}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Badge detail modal component
interface BadgeDetailProps {
  badge: Badge;
  onClose: () => void;
}

export const BadgeDetail: React.FC<BadgeDetailProps> = ({ badge, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-md w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Badge Header with Background */}
        <div className={`p-6 relative bg-gradient-to-br ${rarityColors[badge.rarity]} text-white`}>
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="flex items-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm mr-4">
              <div className="text-white w-12 h-12">
                {badge.icon}
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold">{badge.name}</h2>
              <div className="flex mt-1 space-x-2">
                <UIBadge variant="secondary" className="bg-white/20 backdrop-blur-sm">
                  {badge.rarity.charAt(0).toUpperCase() + badge.rarity.slice(1)}
                </UIBadge>
                <UIBadge variant="secondary" className="bg-white/20 backdrop-blur-sm">
                  {badgeLevelNames[badge.level]} (Lvl {badge.level})
                </UIBadge>
              </div>
            </div>
          </div>
        </div>
        
        {/* Badge Details */}
        <div className="p-6">
          <p className="text-lg mb-4">{badge.description}</p>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Category</h3>
              <p className="font-medium">{badgeCategories[badge.category].name}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Requirement</h3>
              <p className="font-medium">{badge.requirement}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Points</h3>
              <p className="font-medium">{badge.points} pts</p>
            </div>
            
            {badge.unlocked ? (
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Earned</h3>
                <p className="font-medium">{badge.dateEarned?.toLocaleDateString()}</p>
              </div>
            ) : (
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-500 dark:text-gray-400">Progress</span>
                  <span className="font-medium">{badge.progress}%</span>
                </div>
                <Progress value={badge.progress} className="h-2.5" />
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Main badge system component that brings everything together
export const BadgeSystem: React.FC = () => {
  const [selectedBadge, setSelectedBadge] = React.useState<Badge | null>(null);
  
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg p-6 mb-6">
        <h1 className="text-2xl font-bold mb-2">Achievements & Badges</h1>
        <p className="opacity-90">
          Earn badges by completing activities and demonstrating your financial knowledge.
          Collect all badges to showcase your mastery of financial concepts.
        </p>
      </div>
      
      <BadgeGrid 
        badges={badgeCollection} 
        onBadgeClick={(badge) => setSelectedBadge(badge)}
      />
      
      {selectedBadge && (
        <BadgeDetail 
          badge={selectedBadge} 
          onClose={() => setSelectedBadge(null)}
        />
      )}
    </div>
  );
};
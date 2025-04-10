import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { LightbulbIcon, BookmarkIcon, ShareIcon, ThumbsUpIcon } from 'lucide-react';

interface FinancialTipCardProps {
  title: string;
  content: string;
  category?: 'saving' | 'investing' | 'budgeting' | 'credit' | 'general';
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  author?: string;
  imageUrl?: string;
  className?: string;
  onSave?: () => void;
  onShare?: () => void;
  onLike?: () => void;
  isSaved?: boolean;
  isLiked?: boolean;
  likeCount?: number;
}

export function FinancialTipCard({
  title,
  content,
  category = 'general',
  difficulty = 'beginner',
  author,
  imageUrl,
  className,
  onSave,
  onShare,
  onLike,
  isSaved = false,
  isLiked = false,
  likeCount = 0
}: FinancialTipCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [saved, setSaved] = useState(isSaved);
  const [liked, setLiked] = useState(isLiked);
  const [likes, setLikes] = useState(likeCount);
  const [animate, setAnimate] = useState(false);
  
  // Category styling
  const categoryStyles = {
    saving: {
      bg: 'bg-neon-green/10',
      text: 'text-neon-green',
      border: 'border-neon-green/20',
      icon: '💰'
    },
    investing: {
      bg: 'bg-neon-cyan/10',
      text: 'text-neon-cyan',
      border: 'border-neon-cyan/20',
      icon: '📈'
    },
    budgeting: {
      bg: 'bg-neon-purple/10',
      text: 'text-neon-purple',
      border: 'border-neon-purple/20',
      icon: '🗒️'
    },
    credit: {
      bg: 'bg-neon-yellow/10',
      text: 'text-neon-yellow',
      border: 'border-neon-yellow/20',
      icon: '💳'
    },
    general: {
      bg: 'bg-neon-blue/10',
      text: 'text-neon-blue',
      border: 'border-neon-blue/20',
      icon: '💡'
    }
  };
  
  // Difficulty styling
  const difficultyStyles = {
    beginner: {
      text: 'text-neon-green',
      label: 'Beginner'
    },
    intermediate: {
      text: 'text-neon-cyan',
      label: 'Intermediate'
    },
    advanced: {
      text: 'text-neon-purple',
      label: 'Advanced'
    }
  };

  const handleSave = () => {
    setSaved(!saved);
    setAnimate(true);
    setTimeout(() => setAnimate(false), 1000);
    if (onSave) onSave();
  };

  const handleLike = () => {
    const newLikedState = !liked;
    setLiked(newLikedState);
    setLikes(prev => newLikedState ? prev + 1 : Math.max(0, prev - 1));
    if (onLike) onLike();
  };

  const handleShare = () => {
    if (onShare) onShare();
  };

  return (
    <div className={cn(
      'relative overflow-hidden rounded-lg border border-dark-600/80',
      'bg-dark-800/60 backdrop-blur-sm transition-all duration-300',
      'shadow-lg hover:shadow-xl group',
      className
    )}>
      {/* Optional image */}
      {imageUrl && (
        <div className="w-full h-40 overflow-hidden">
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* Gradient overlay for text readability */}
          <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-transparent to-dark-900/80"></div>
        </div>
      )}
      
      {/* Content */}
      <div className={cn(
        'p-4',
        imageUrl ? 'pt-0 -mt-12 relative z-10' : ''
      )}>
        {/* Category badge */}
        <div className={cn(
          'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mb-2',
          categoryStyles[category].bg,
          categoryStyles[category].text,
          categoryStyles[category].border
        )}>
          <span className="mr-1">{categoryStyles[category].icon}</span>
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </div>
        
        {/* Difficulty indicator */}
        <div className="absolute top-3 right-3 flex items-center">
          <span className={cn(
            'text-xs font-medium',
            difficultyStyles[difficulty].text
          )}>
            {difficultyStyles[difficulty].label}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold mb-2 line-clamp-2 text-white group-hover:text-gradient-cyan transition-colors duration-300">
          {title}
        </h3>

        {/* Content with expand/collapse */}
        <div className="relative">
          <p className={cn(
            'text-sm text-gray-300 mb-4',
            expanded ? '' : 'line-clamp-3'
          )}>
            {content}
          </p>
          
          {/* Fade-out effect for collapsed content */}
          {!expanded && content.length > 150 && (
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-dark-800/90 to-transparent"></div>
          )}
          
          {/* Expand/collapse button */}
          {content.length > 150 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xs text-neon-cyan hover:text-neon-cyan/80 underline transition-colors mb-3 inline-flex items-center"
            >
              {expanded ? 'Show less' : 'Read more'}
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={cn(
                  "ml-1 h-3 w-3 transition-transform duration-300",
                  expanded ? 'rotate-180' : ''
                )} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          )}
        </div>

        {/* Author info */}
        {author && (
          <div className="flex items-center mb-4">
            <div className="w-6 h-6 rounded-full bg-dark-700 flex items-center justify-center text-xs mr-2">
              {author.charAt(0).toUpperCase()}
            </div>
            <span className="text-xs text-gray-400">{author}</span>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex justify-between items-center border-t border-dark-600/50 pt-3 mt-2">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              'text-xs gap-1 hover:bg-dark-700',
              liked ? 'text-neon-green' : 'text-gray-400'
            )}
            onClick={handleLike}
          >
            <ThumbsUpIcon className="h-3.5 w-3.5" />
            <span>{likes > 0 ? likes : ''}</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              'text-xs gap-1 hover:bg-dark-700',
              saved ? 'text-neon-yellow' : 'text-gray-400',
              animate ? 'animate-bounce-small' : ''
            )}
            onClick={handleSave}
          >
            <BookmarkIcon className={cn('h-3.5 w-3.5', saved ? 'fill-current' : '')} />
            <span>{saved ? 'Saved' : 'Save'}</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="text-xs gap-1 text-gray-400 hover:bg-dark-700"
            onClick={handleShare}
          >
            <ShareIcon className="h-3.5 w-3.5" />
            <span>Share</span>
          </Button>
        </div>
      </div>
      
      {/* Corner shine effect */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/5 rotate-45 transform transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
    </div>
  );
}

"use client";

import React, { useState } from 'react';
import { Heart, ArrowRight, Medal, Trophy, Sparkles } from 'lucide-react';

export interface EffectsShowcaseProps {
  className?: string;
}

export const EffectsShowcase: React.FC<EffectsShowcaseProps> = ({ className = '' }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  
  const triggerAnimation = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 3000);
  };
  
  return (
    <div className={`p-8 space-y-12 ${className}`}>
      <h2 className="text-2xl font-bold mb-6 text-gradient text-gradient-rainbow">Visual Effects Gallery</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Neon & Glow Effects Section */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gradient text-gradient-green">Neon & Glow Effects</h3>
          
          <button className="px-6 py-3 bg-dark-800 text-neon-green border border-neon-green rounded-md glow-green hover:glow-green animate-pulse-slow">
            Pulsing Glow
          </button>
          
          <div className="px-6 py-3 bg-dark-800 text-neon-cyan border border-neon-cyan rounded-md glow-cyan animate-glow">
            Animated Glow
          </div>
          
          <div className="px-6 py-3 bg-dark-800 text-neon-purple border-t border-b border-neon-purple text-flicker">
            Neon Text Flicker
          </div>
        </div>
        
        {/* Animation Effects Section */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gradient text-gradient-cyan">Animation Effects</h3>
          
          <div className="px-6 py-3 bg-dark-700 rounded-md flex items-center justify-between">
            <span>Floating Elements</span>
            <div className="flex">
              <span className="text-neon-green animate-float1 mx-1">⬤</span>
              <span className="text-neon-cyan animate-float2 mx-1">⬤</span>
              <span className="text-neon-purple animate-float3 mx-1">⬤</span>
            </div>
          </div>
          
          <button 
            className="px-6 py-3 bg-dark-700 rounded-md w-full flex items-center justify-between animate-shine"
            onClick={triggerAnimation}
          >
            <span>Click to Trigger</span>
            <ArrowRight className={`animate-bounce-x ${isAnimating ? 'text-neon-green' : ''}`} />
          </button>
          
          <div className="px-6 py-3 bg-dark-700 rounded-md w-full animate-shimmer">
            Shimmer Effect
          </div>
        </div>
        
        {/* 3D & Hover Effects Section */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gradient text-gradient-purple">3D & Hover Effects</h3>
          
          <div className="px-6 py-3 bg-dark-700 rounded-md hover-card flex items-center justify-center">
            <Heart className="text-neon-red mr-2" /> Hover Card
          </div>
          
          <div className="h-32 px-6 py-3 bg-dark-700 rounded-md tilt-on-hover flex items-center justify-center">
            <span className="transform-gpu">3D Tilt Effect</span>
          </div>
          
          <div className="px-6 py-3 glass-card rounded-md flex items-center justify-center">
            Glass Morphism Effect
          </div>
        </div>
      </div>
      
      {/* Special Effects Section */}
      <div className="mt-12">
        <h3 className="text-xl font-semibold text-gradient text-gradient-rainbow mb-6">Special Effects</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
            <div className="px-6 py-12 bg-dark-700 rounded-md flex flex-col items-center justify-center">
              <div className="absolute inset-0 rounded-md overflow-hidden animate-confetti opacity-30"></div>
              <Trophy className="text-neon-yellow text-3xl mb-2" />
              <p className="text-center">Confetti Background Effect</p>
            </div>
          </div>
          
          <div className="px-6 py-12 bg-dark-700 rounded-md flex flex-col items-center justify-center relative">
            <Medal className="text-neon-purple text-3xl mb-2" />
            <p className="text-center">Sparkle Effects</p>
            <span className="absolute top-6 right-8 text-xl text-neon-yellow animate-sparkle-1">✦</span>
            <span className="absolute bottom-10 left-12 text-lg text-neon-cyan animate-sparkle-2">✦</span>
            <span className="absolute top-1/2 right-16 text-xl text-neon-green animate-sparkle-3">✦</span>
          </div>
        </div>
      </div>
      
      {/* Achievement Showcase */}
      <div className="mt-12">
        <h3 className="text-xl font-semibold mb-6">Achievement Badge</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="perspective">
            <div className="relative w-48 h-56 cursor-pointer preserve-3d transition-all duration-500 hover:rotate-y-180">
              <div className="absolute inset-0 backface-hidden rounded-xl bg-dark-600 flex flex-col items-center justify-center p-4 border-2 border-neon-purple glow-purple-sm">
                <Sparkles className="text-neon-purple text-3xl mb-2" />
                <p className="text-center text-lg font-semibold">Master Investor</p>
                <p className="text-center text-sm mt-2">Flip to see details</p>
              </div>
              <div className="absolute inset-0 backface-hidden rounded-xl bg-dark-700 rotate-y-180 flex flex-col items-center justify-center p-4 border-2 border-neon-purple">
                <p className="text-center text-sm">
                  Earned for investing consistently for 6 months and achieving 15% growth.
                </p>
                <button className="mt-4 px-4 py-2 rounded-md bg-dark-600 text-neon-purple hover:glow-purple-sm transition-all duration-300">
                  Share
                </button>
              </div>
            </div>
          </div>
          
          <div className="perspective">
            <div className="relative w-48 h-56 cursor-pointer preserve-3d transition-all duration-500 hover:rotate-y-180">
              <div className="absolute inset-0 backface-hidden rounded-xl bg-dark-600 flex flex-col items-center justify-center p-4 border-2 border-neon-green glow-green-sm">
                <Trophy className="text-neon-green text-3xl mb-2" />
                <p className="text-center text-lg font-semibold">Budget Ninja</p>
                <p className="text-center text-sm mt-2">Flip to see details</p>
              </div>
              <div className="absolute inset-0 backface-hidden rounded-xl bg-dark-700 rotate-y-180 flex flex-col items-center justify-center p-4 border-2 border-neon-green">
                <p className="text-center text-sm">
                  Earned for staying under budget for 3 consecutive months.
                </p>
                <button className="mt-4 px-4 py-2 rounded-md bg-dark-600 text-neon-green hover:glow-green-sm transition-all duration-300">
                  Share
                </button>
              </div>
            </div>
          </div>
          
          <div className="perspective">
            <div className="relative w-48 h-56 cursor-pointer preserve-3d transition-all duration-500 hover:rotate-y-180">
              <div className="absolute inset-0 backface-hidden rounded-xl bg-dark-600 flex flex-col items-center justify-center p-4 border-2 border-neon-cyan glow-cyan-sm">
                <Medal className="text-neon-cyan text-3xl mb-2" />
                <p className="text-center text-lg font-semibold">Savings Champion</p>
                <p className="text-center text-sm mt-2">Flip to see details</p>
              </div>
              <div className="absolute inset-0 backface-hidden rounded-xl bg-dark-700 rotate-y-180 flex flex-col items-center justify-center p-4 border-2 border-neon-cyan">
                <p className="text-center text-sm">
                  Earned for reaching your first savings goal of $5,000.
                </p>
                <button className="mt-4 px-4 py-2 rounded-md bg-dark-600 text-neon-cyan hover:glow-cyan-sm transition-all duration-300">
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

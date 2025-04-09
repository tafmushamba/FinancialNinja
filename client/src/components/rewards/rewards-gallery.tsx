import React from 'react';
import { cn } from "@/lib/utils";

const rewards = [
  {
    id: 'costa',
    brand: 'Costa Coffee',
    title: '£5 Costa Coffee Gift Card',
    description: 'Enjoy a coffee break on us with this £5 Costa Coffee gift card.',
    points: 500,
    icon: '☕',
    category: 'Dining'
  },
  {
    id: 'tesco',
    brand: 'Tesco',
    title: '£10 Tesco Gift Card',
    description: 'Use this £10 gift card at any Tesco store across the UK.',
    points: 1000,
    icon: '🛒',
    category: 'Shopping'
  },
  {
    id: 'vue',
    brand: 'Vue Cinema',
    title: 'Vue Cinema Ticket',
    description: 'One standard ticket for any film at Vue Cinemas nationwide.',
    points: 1200,
    icon: '🎬',
    category: 'Entertainment'
  },
  {
    id: 'spotify',
    brand: 'Spotify',
    title: '1 Month Spotify Premium',
    description: 'Enjoy ad-free music streaming for one month with Spotify Premium.',
    points: 1500,
    icon: '🎵',
    category: 'Entertainment'
  },
  {
    id: 'amazon',
    brand: 'Amazon',
    title: '£15 Amazon Gift Card',
    description: 'Shop for anything on Amazon with this £15 gift card.',
    points: 1500,
    icon: '🛍️',
    category: 'Shopping'
  }
];

export const RewardsGallery = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {rewards.map((reward) => (
        <div
          key={reward.id}
          className={cn(
            "glass-card p-6 rounded-lg transition-all duration-300",
            "hover:transform hover:-translate-y-1",
            "border border-dark-600 glow-border"
          )}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="text-4xl">{reward.icon}</div>
            <div className="text-neon-green font-mono">{reward.points} pts</div>
          </div>

          <h3 className="text-xl font-bold mb-2 text-foreground">{reward.title}</h3>
          <p className="text-sm text-muted-foreground mb-4">{reward.description}</p>

          <div className="flex items-center justify-between">
            <span className="text-sm text-neon-cyan">{reward.brand}</span>
            <button className="px-4 py-2 bg-dark-600 text-neon-green rounded hover:bg-dark-500 transition-colors">
              Redeem
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
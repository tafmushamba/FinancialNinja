
import React from 'react';
import { useGamification } from '../../context/GamificationContext';
import { cn } from "@/lib/utils";

const rewards = [
  {
    id: 'costa',
    brand: 'Costa Coffee',
    title: '£5 Costa Coffee Gift Card',
    description: 'Enjoy a coffee break on us with this £5 Costa Coffee gift card.',
    points: 500,
    icon: '☕',
    category: 'Dining',
    image: 'https://logos-world.net/wp-content/uploads/2021/08/Costa-Coffee-Logo.png'
  },
  {
    id: 'tesco',
    brand: 'Tesco',
    title: '£10 Tesco Gift Card',
    description: 'Use this £10 gift card at any Tesco store across the UK.',
    points: 1000,
    icon: '🛒',
    category: 'Shopping',
    image: 'https://upload.wikimedia.org/wikipedia/en/thumb/b/b0/Tesco_Logo.svg/1200px-Tesco_Logo.svg.png'
  },
  {
    id: 'vue',
    brand: 'Vue Cinema',
    title: 'Vue Cinema Ticket',
    description: 'One standard ticket for any film at Vue Cinemas nationwide.',
    points: 1200,
    icon: '🎬',
    category: 'Entertainment',
    image: 'https://logos-world.net/wp-content/uploads/2022/01/Vue-Symbol.png'
  },
  {
    id: 'spotify',
    brand: 'Spotify',
    title: '1 Month Spotify Premium',
    description: 'Enjoy ad-free music streaming for one month with Spotify Premium.',
    points: 1500,
    icon: '🎵',
    category: 'Entertainment',
    image: 'https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_RGB_Green.png'
  },
  {
    id: 'amazon',
    brand: 'Amazon',
    title: '£15 Amazon Gift Card',
    description: 'Shop for anything on Amazon with this £15 gift card.',
    points: 1500,
    icon: '🛍️',
    category: 'Shopping',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/1200px-Amazon_logo.svg.png'
  },
  {
    id: 'deliveroo',
    brand: 'Deliveroo',
    title: '£15 Deliveroo Voucher',
    description: 'Order your favorite food with this £15 Deliveroo voucher.',
    points: 1500,
    icon: '🍔',
    category: 'Dining',
    image: 'https://logos-download.com/wp-content/uploads/2016/07/Deliveroo_logo_blue_bird.png'
  },
  {
    id: 'appstore',
    brand: 'App Store',
    title: '£10 App Store & iTunes Gift Card',
    description: 'Purchase apps, games, music, and more with this £10 gift card.',
    points: 1000,
    icon: '📱',
    category: 'Entertainment',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Download_on_the_App_Store_Badge.svg/1200px-Download_on_the_App_Store_Badge.svg.png'
  },
  {
    id: 'marks',
    brand: 'Marks & Spencer',
    title: '£25 M&S Gift Card',
    description: 'Shop for clothing, food, and homeware with this £25 M&S gift card.',
    points: 2500,
    icon: '🛍️',
    category: 'Shopping',
    image: 'https://upload.wikimedia.org/wikipedia/en/thumb/9/9b/Marks_%26_Spencer_logo.svg/1200px-Marks_%26_Spencer_logo.svg.png'
  }
];

const categories = ['All Rewards', 'Dining', 'Shopping', 'Entertainment'];

export const RewardsGallery = () => {
  const [selectedCategory, setSelectedCategory] = React.useState('All Rewards');
  const points = 0; // Replace with actual points from context

  const filteredRewards = selectedCategory === 'All Rewards' 
    ? rewards 
    : rewards.filter(reward => reward.category === selectedCategory);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Rewards Marketplace</h2>
        <div className="flex items-center">
          <span className="mr-1">{points}</span>
          <span className="text-sm text-muted-foreground">points available</span>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={cn(
              "px-4 py-2 rounded-md text-sm",
              selectedCategory === category 
                ? "bg-htb-green text-black" 
                : "bg-htb-card hover:bg-opacity-80"
            )}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRewards.map((reward) => (
          <div
            key={reward.id}
            className="bg-htb-card rounded-lg overflow-hidden border border-htb-border"
          >
            <div className="h-32 bg-htb-darker flex items-center justify-center p-6">
              <img 
                src={reward.image} 
                alt={reward.brand} 
                className="h-full w-full object-contain"
              />
            </div>
            <div className="p-4">
              <div className="text-xs text-gray-400 mb-1">{reward.brand}</div>
              <h3 className="font-bold mb-2">{reward.title}</h3>
              <p className="text-sm text-gray-400 mb-4">{reward.description}</p>
              <div className="flex justify-between items-center">
                <div className="text-htb-green font-bold">{reward.points} points</div>
                <button 
                  className={cn(
                    "px-4 py-2 rounded-md",
                    points >= reward.points
                      ? "bg-htb-green text-black font-bold hover:bg-opacity-90"
                      : "bg-gray-700 text-gray-400 cursor-not-allowed"
                  )}
                  disabled={points < reward.points}
                >
                  {points >= reward.points ? 'Redeem' : 'Not Enough Points'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

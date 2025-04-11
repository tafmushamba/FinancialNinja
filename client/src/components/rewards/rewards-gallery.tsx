import React from 'react';
import { useGamification } from '@/context/GamificationContext';
import { cn } from "@/lib/utils";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Reward {
  id: string;
  brand: string;
  title: string;
  description: string;
  pointsRequired: number;
  icon: string;
  category: string;
  image: string;
}

interface RewardsGalleryProps {
  rewards: Reward[];
  currentPoints: number;
  onRedeemReward: (rewardId: string) => Promise<boolean>;
  className?: string;
}

const rewards: Reward[] = [
  {
    id: 'costa',
    brand: 'Costa Coffee',
    title: '£5 Costa Coffee Gift Card',
    description: 'Enjoy a coffee break on us with this £5 Costa Coffee gift card.',
    pointsRequired: 500,
    icon: '☕',
    category: 'Dining',
    image: '/images/rewards/costa.png'
  },
  {
    id: 'tesco',
    brand: 'Tesco',
    title: '£10 Tesco Gift Card',
    description: 'Use this £10 gift card at any Tesco store across the UK.',
    pointsRequired: 1000,
    icon: '🛒',
    category: 'Shopping',
    image: 'https://upload.wikimedia.org/wikipedia/en/thumb/b/b0/Tesco_Logo.svg/1200px-Tesco_Logo.svg.png'
  },
  {
    id: 'vue',
    brand: 'Vue Cinema',
    title: 'Vue Cinema Ticket',
    description: 'One standard ticket for any film at Vue Cinemas nationwide.',
    pointsRequired: 1200,
    icon: '🎬',
    category: 'Entertainment',
    image: '/images/rewards/vue.png'
  },
  {
    id: 'spotify',
    brand: 'Spotify',
    title: '1 Month Spotify Premium',
    description: 'Enjoy ad-free music streaming for one month with Spotify Premium.',
    pointsRequired: 1500,
    icon: '🎵',
    category: 'Entertainment',
    image: 'https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_RGB_Green.png'
  },
  {
    id: 'amazon',
    brand: 'Amazon',
    title: '£15 Amazon Gift Card',
    description: 'Shop for anything on Amazon with this £15 gift card.',
    pointsRequired: 1500,
    icon: '🛍️',
    category: 'Shopping',
    image: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg'
  },
  {
    id: 'deliveroo',
    brand: 'Deliveroo',
    title: '£15 Deliveroo Voucher',
    description: 'Order your favorite food with this £15 Deliveroo voucher.',
    pointsRequired: 1500,
    icon: '🍔',
    category: 'Dining',
    image: 'https://logos-world.net/wp-content/uploads/2021/02/Deliveroo-Symbol.png'
  },
  {
    id: 'appstore',
    brand: 'App Store',
    title: '£10 App Store & iTunes Gift Card',
    description: 'Purchase apps, games, music, and more with this £10 gift card.',
    pointsRequired: 1000,
    icon: '📱',
    category: 'Entertainment',
    image: 'https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg'
  },
  {
    id: 'marks',
    brand: 'Marks & Spencer',
    title: '£25 M&S Gift Card',
    description: 'Shop for clothing, food, and homeware with this £25 M&S gift card.',
    pointsRequired: 2500,
    icon: '🛍️',
    category: 'Shopping',
    image: 'https://cdn.icon-icons.com/icons2/3914/PNG/512/marks_and_spencer_logo_icon_248827.png'
  }
];

export const RewardsGallery: React.FC<RewardsGalleryProps> = ({ currentPoints, onRedeemReward, className }) => {
  const [selectedCategory, setSelectedCategory] = React.useState('All Rewards');

  const filteredRewards = selectedCategory === 'All Rewards' 
    ? rewards 
    : rewards.filter(reward => reward.category === selectedCategory);

  const handleRedeem = async (rewardId: string) => {
    const success = await onRedeemReward(rewardId);
    return success;
  };

  return (
    <div className={`p-6 ${className || ''}`}> 
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Rewards Marketplace</h2>
        <div className="flex items-center">
          <span className="mr-1">{currentPoints}</span>
          <span className="text-sm text-muted-foreground">points available</span>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        {['All Rewards', 'Dining', 'Shopping', 'Entertainment'].map(category => (
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
          <Card
            key={reward.id}
            className="overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-xl border border-htb-border"
          >
            <div className="h-48 bg-htb-darker flex items-center justify-center p-6 relative">
              <img 
                src={reward.image} 
                alt={reward.brand} 
                className="h-full w-full object-contain transition-opacity duration-300 hover:opacity-80"
              />
              <Badge variant="default" className="absolute top-3 right-3 bg-htb-green text-black text-xs font-bold px-2 py-1 rounded-full">
                {reward.category}
              </Badge>
            </div>
            <CardHeader className="p-5 bg-gradient-to-b from-htb-card to-htb-darker pt-4 pb-2">
              <div className="text-sm text-neon-green font-medium">{reward.brand}</div>
              <CardTitle className="text-xl text-white">{reward.title}</CardTitle>
            </CardHeader>
            <CardContent className="p-5 bg-gradient-to-b from-htb-card to-htb-darker pt-0 pb-4">
              <p className="text-sm text-gray-300 line-clamp-2">{reward.description}</p>
            </CardContent>
            <CardFooter className="p-5 bg-gradient-to-b from-htb-card to-htb-darker pt-2 border-t border-htb-border flex justify-between items-center">
              <div className="text-htb-green font-bold text-lg">{reward.pointsRequired} points</div>
              <button 
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200",
                  currentPoints >= reward.pointsRequired
                    ? "bg-htb-green text-black hover:bg-neon-green/90"
                    : "bg-gray-700 text-gray-400 cursor-not-allowed opacity-70"
                )}
                disabled={currentPoints < reward.pointsRequired}
                onClick={() => handleRedeem(reward.id)}
              >
                {currentPoints >= reward.pointsRequired ? 'Redeem Now' : 'Not Enough Points'}
              </button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};
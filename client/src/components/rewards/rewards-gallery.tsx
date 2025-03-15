import React, { useState } from 'react';
import { RewardsCard } from './rewards-card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface Reward {
  id: string;
  title: string;
  brand: string;
  value: string;
  pointsRequired: number;
  imageUrl: string;
  category: string;
}

interface RewardsGalleryProps {
  rewards: Reward[];
  currentPoints: number;
  onRedeemReward: (rewardId: string) => Promise<boolean>;
}

export function RewardsGallery({ rewards, currentPoints, onRedeemReward }: RewardsGalleryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [valueFilter, setValueFilter] = useState('all');
  const { toast } = useToast();

  const handleRedeem = async (rewardId: string) => {
    try {
      const success = await onRedeemReward(rewardId);
      if (success) {
        toast({
          title: 'Reward Redeemed!',
          description: 'Your gift card will be sent to your email shortly.',
          variant: 'default',
        });
      } else {
        toast({
          title: 'Redemption Failed',
          description: 'There was an issue redeeming your reward. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again later.',
        variant: 'destructive',
      });
    }
  };

  const filteredRewards = rewards.filter((reward) => {
    const matchesSearch = reward.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          reward.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || reward.category === categoryFilter;
    const matchesValue = valueFilter === 'all' || reward.value === valueFilter;
    
    return matchesSearch && matchesCategory && matchesValue;
  });

  const redeemableRewards = filteredRewards.filter(reward => currentPoints >= reward.pointsRequired);
  const inProgressRewards = filteredRewards.filter(reward => currentPoints < reward.pointsRequired);

  return (
    <div>
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <div>
          <Input
            placeholder="Search rewards..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="shopping">Shopping</SelectItem>
              <SelectItem value="dining">Dining</SelectItem>
              <SelectItem value="entertainment">Entertainment</SelectItem>
              <SelectItem value="travel">Travel</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Select value={valueFilter} onValueChange={setValueFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by value" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Values</SelectItem>
              <SelectItem value="$5">$5</SelectItem>
              <SelectItem value="$10">$10</SelectItem>
              <SelectItem value="$15">$15</SelectItem>
              <SelectItem value="$25">$25</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Tabs defaultValue="all" className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All Rewards</TabsTrigger>
          <TabsTrigger value="redeemable">Redeemable Now</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-4">
          {filteredRewards.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No rewards found matching your criteria.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRewards.map((reward) => (
                <RewardsCard
                  key={reward.id}
                  title={reward.title}
                  brand={reward.brand}
                  pointsRequired={reward.pointsRequired}
                  currentPoints={currentPoints}
                  imageUrl={reward.imageUrl}
                  value={reward.value}
                  isRedeemable={currentPoints >= reward.pointsRequired}
                  onRedeem={() => handleRedeem(reward.id)}
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="redeemable" className="mt-4">
          {redeemableRewards.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              You don't have enough points to redeem any rewards yet. Keep learning!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {redeemableRewards.map((reward) => (
                <RewardsCard
                  key={reward.id}
                  title={reward.title}
                  brand={reward.brand}
                  pointsRequired={reward.pointsRequired}
                  currentPoints={currentPoints}
                  imageUrl={reward.imageUrl}
                  value={reward.value}
                  isRedeemable={true}
                  onRedeem={() => handleRedeem(reward.id)}
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="in-progress" className="mt-4">
          {inProgressRewards.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              You've earned enough points for all available rewards!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {inProgressRewards.map((reward) => (
                <RewardsCard
                  key={reward.id}
                  title={reward.title}
                  brand={reward.brand}
                  pointsRequired={reward.pointsRequired}
                  currentPoints={currentPoints}
                  imageUrl={reward.imageUrl}
                  value={reward.value}
                  isRedeemable={false}
                  onRedeem={() => handleRedeem(reward.id)}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
} 
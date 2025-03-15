import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { RewardsGallery } from '@/components/rewards/rewards-gallery';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Gift, Award, Sparkles } from 'lucide-react';
import { fetchRewards, redeemReward } from '@/lib/api';

const RewardsPage: React.FC = () => {
  const queryClient = useQueryClient();
  
  const { data: userData, isLoading: userLoading } = useQuery({
    queryKey: ['/api/user/points'],
  });
  
  const { data: rewardsData, isLoading: rewardsLoading } = useQuery({
    queryKey: ['/api/rewards/available'],
  });
  
  const redeemMutation = useMutation({
    mutationFn: redeemReward,
    onSuccess: () => {
      // Invalidate and refetch user points and rewards
      queryClient.invalidateQueries({ queryKey: ['/api/user/points'] });
      queryClient.invalidateQueries({ queryKey: ['/api/rewards/available'] });
    },
  });
  
  const handleRedeemReward = async (rewardId: string) => {
    try {
      await redeemMutation.mutateAsync(rewardId);
      return true;
    } catch (error) {
      console.error('Failed to redeem reward:', error);
      return false;
    }
  };
  
  const userPoints = userData?.points || 0;
  const rewards = rewardsData?.rewards || [];
  
  // Calculate next reward milestone
  const sortedRewards = [...rewards].sort((a, b) => a.pointsRequired - b.pointsRequired);
  const nextMilestone = sortedRewards.find(reward => reward.pointsRequired > userPoints);
  const nextMilestonePoints = nextMilestone ? nextMilestone.pointsRequired : null;
  const pointsToNextMilestone = nextMilestonePoints ? nextMilestonePoints - userPoints : 0;
  
  const milestoneProgress = nextMilestonePoints 
    ? Math.min(100, (userPoints / nextMilestonePoints) * 100)
    : 100;
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-4xl mx-auto text-center mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center justify-center">
          <Gift className="h-6 w-6 mr-2 text-primary" />
          Rewards Marketplace
        </h1>
        <p className="text-muted-foreground">
          Earn points by completing financial literacy modules and redeem them for gift cards from your favorite brands.
        </p>
      </div>
      
      <div className="mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Award className="h-5 w-5 mr-2 text-amber-500" />
              Your Rewards Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            {userLoading ? (
              <div className="text-center py-4">Loading your points...</div>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <span className="text-3xl font-bold">{userPoints}</span>
                    <span className="text-muted-foreground ml-2">points earned</span>
                  </div>
                  {nextMilestonePoints && (
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium text-primary">
                        {pointsToNextMilestone} more points
                      </span>{' '}
                      to unlock {nextMilestone?.brand} {nextMilestone?.value} gift card
                    </div>
                  )}
                </div>
                
                <Progress value={milestoneProgress} className="h-2 mb-4" />
                
                <div className="bg-muted/40 rounded-lg p-4 text-sm">
                  <div className="flex items-start">
                    <Sparkles className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium">Keep learning to earn more rewards!</p>
                      <p className="text-muted-foreground mt-1">
                        Complete learning modules, pass quizzes, and reach financial milestones to earn points. 
                        Each completed module is worth 50-100 points.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {rewardsLoading ? (
        <div className="text-center py-12">Loading available rewards...</div>
      ) : (
        <RewardsGallery
          rewards={rewards}
          currentPoints={userPoints}
          onRedeemReward={handleRedeemReward}
        />
      )}
    </div>
  );
};

export default RewardsPage; 
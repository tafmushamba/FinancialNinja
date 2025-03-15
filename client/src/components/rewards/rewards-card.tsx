import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gift, Check, ChevronRight, ShoppingBag } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';

interface RewardsCardProps {
  title: string;
  brand: string;
  pointsRequired: number;
  currentPoints: number;
  imageUrl: string;
  value: string;
  isRedeemable?: boolean;
  onRedeem?: () => void;
}

export function RewardsCard({
  title,
  brand,
  pointsRequired,
  currentPoints,
  imageUrl,
  value,
  isRedeemable = false,
  onRedeem
}: RewardsCardProps) {
  const progress = Math.min(100, (currentPoints / pointsRequired) * 100);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="overflow-hidden transition-all hover:shadow-lg border-2 border-transparent hover:border-primary/20 h-full flex flex-col">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-base flex items-center">
              <Gift className="h-4 w-4 mr-2 text-primary" />
              {brand}
            </CardTitle>
            <span className="text-sm font-bold text-primary">{value}</span>
          </div>
        </CardHeader>
        <CardContent className="pb-2 flex-grow">
          <div className="aspect-w-16 aspect-h-9 mb-3 rounded-md overflow-hidden">
            <img 
              src={imageUrl || '/placeholder-brand-logo.svg'} 
              alt={`${brand} gift card`} 
              className="object-cover w-full h-full"
            />
          </div>
          <h3 className="font-semibold mb-1">{title}</h3>
          <div className="mt-3">
            <div className="flex justify-between text-xs mb-1">
              <span>{currentPoints} points</span>
              <span>{pointsRequired} points</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardContent>
        <CardFooter className="pt-0">
          <Button 
            variant={isRedeemable ? "default" : "secondary"} 
            className="w-full" 
            disabled={!isRedeemable}
            onClick={onRedeem}
          >
            {isRedeemable ? (
              <>
                <ShoppingBag className="mr-2 h-4 w-4" />
                Redeem Reward
              </>
            ) : (
              <>
                <ChevronRight className="mr-2 h-4 w-4" />
                {`Need ${pointsRequired - currentPoints} more points`}
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
} 
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const AchievementsList: React.FC = () => {
  const { data: achievementsData, isLoading } = useQuery({
    queryKey: ['/api/user/achievements'],
  });

  return (
    <Card className="bg-dark-800 border-dark-600">
      <CardHeader className="pb-0">
        <CardTitle className="text-lg font-mono font-bold">Recent Achievements</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-4">
              <p className="text-gray-400">Loading achievements...</p>
            </div>
          ) : (
            <>
              {achievementsData?.achievements?.map((achievement: any, index: number) => (
                <div key={index} className="bg-dark-700 p-4 rounded flex items-center">
                  <div className={`w-10 h-10 rounded-full bg-${achievement.color} bg-opacity-20 flex items-center justify-center mr-4`}>
                    <i className={`fas ${achievement.icon} text-${achievement.color}`}></i>
                  </div>
                  <div>
                    <h5 className="font-medium">{achievement.title}</h5>
                    <p className="text-xs text-gray-400 mt-1">{achievement.description}</p>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button className="w-full bg-dark-700 hover:bg-dark-600 text-white text-sm">
          View All Achievements
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AchievementsList;

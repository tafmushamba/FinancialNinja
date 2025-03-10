import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const UpcomingLessons: React.FC = () => {
  const { data: recommendationsData, isLoading } = useQuery({
    queryKey: ['/api/learning/recommendations'],
  });

  return (
    <Card className="bg-dark-800 border-dark-600">
      <CardHeader className="pb-0">
        <CardTitle className="text-lg font-mono font-bold">Recommended Next Steps</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-4">
              <p className="text-gray-400">Loading recommendations...</p>
            </div>
          ) : (
            <>
              {recommendationsData?.recommendations?.map((rec: any, index: number) => (
                <div key={index} className="bg-dark-700 p-4 rounded flex items-center">
                  <div className={`w-10 h-10 rounded-full bg-${rec.color} bg-opacity-20 flex items-center justify-center mr-4`}>
                    <i className={`fas ${rec.icon} text-${rec.color}`}></i>
                  </div>
                  <div className="flex-1">
                    <h5 className="font-medium">{rec.title}</h5>
                    <p className="text-xs text-gray-400 mt-1">{rec.type}</p>
                  </div>
                  <Button 
                    className="bg-dark-600 hover:bg-dark-500 px-3 py-1 rounded text-sm"
                    variant="secondary"
                  >
                    Start
                  </Button>
                </div>
              ))}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingLessons;

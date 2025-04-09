import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import ForumHeader from '@/components/forum/forum-header';
import ForumCategoryCard from '@/components/forum/forum-category-card';
import { ForumCategory } from '@/components/forum/forum-types';

export default function Forum() {
  const { data, isLoading, error } = useQuery<{ categories: ForumCategory[] }>({
    queryKey: ['forum-categories'],
    queryFn: async () => {
      const response = await fetch('/api/forum/categories');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      return response.json();
    }
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 space-y-4">
        <ForumHeader />
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error Loading Forum</h2>
          <p className="text-gray-600 mb-4">Failed to load forum categories. Please try again later.</p>
          <Button onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-4">
      <ForumHeader />
      <div className="grid gap-4 md:grid-cols-2">
        {data?.categories?.map((category) => (
          <ForumCategoryCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
}
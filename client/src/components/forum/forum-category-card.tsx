import React from 'react';
import { Link } from 'wouter';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Category } from './forum-types';
import { MessageSquare, ChevronRight } from 'lucide-react';

interface ForumCategoryCardProps {
  category: Category;
}

export default function ForumCategoryCard({ category }: ForumCategoryCardProps) {
  return (
    <Link href={`/forum/categories/${category.id}`}>
      <Card className="cursor-pointer transition-all hover:shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">{category.name}</CardTitle>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </div>
          <CardDescription>{category.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <MessageSquare className="h-4 w-4" />
            <span>{category.topicCount || 0} topics</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
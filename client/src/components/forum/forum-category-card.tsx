import React from 'react';
import { Link } from 'wouter';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { ForumCategory } from './forum-types';
import { MessageSquare, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface ForumCategoryCardProps {
  category: ForumCategory;
}

export default function ForumCategoryCard({ category }: ForumCategoryCardProps) {
  // Use the category color if available, otherwise default to a color
  const bgColor = category.color ? `${category.color}22` : '#3b82f622';
  
  return (
    <Link href={`/forum/categories/${category.id}`}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
        className="group"
      >
        <Card 
          className="cursor-pointer transition-all hover:shadow-lg overflow-hidden"
          style={{ backgroundColor: bgColor, border: `1px solid ${bgColor}` }}
        >
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                {category.name}
              </CardTitle>
              <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-primary transition-colors" />
            </div>
            <CardDescription className="mt-1 line-clamp-2">{category.description}</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <MessageSquare className="h-4 w-4" />
              <span>{category.topicCount || 0} topics</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
}
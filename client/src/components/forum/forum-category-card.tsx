import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, MessageSquare } from "lucide-react";
import { ForumCategory } from "./forum-types";

interface ForumCategoryCardProps {
  category: ForumCategory;
  onClick?: () => void;
}

export default function ForumCategoryCard({ category, onClick }: ForumCategoryCardProps) {
  return (
    <Card 
      className="transition-all hover:shadow-md cursor-pointer overflow-hidden"
      onClick={onClick}
    >
      <div className="flex">
        <div 
          className="w-2 h-full"
          style={{ backgroundColor: '#4f46e5' }}
        />
        <div className="flex-1">
          <CardHeader className="flex flex-row items-start justify-between pb-2">
            <div>
              <CardTitle className="text-lg flex items-center">
                <span 
                  className="w-6 h-6 rounded-full mr-2 flex items-center justify-center text-white"
                  style={{ backgroundColor: category.color || '#888' }}
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                </span>
                {category.name}
              </CardTitle>
              <CardDescription>{category.description}</CardDescription>
            </div>

            <div className="text-center py-1 px-2 bg-muted rounded-md">
              <div className="text-sm font-medium">{category.topicCount || 0}</div>
              <div className="text-xs text-muted-foreground">
                {category.topicCount === 1 ? 'Topic' : 'Topics'}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {category.description || 'Discuss topics related to this category'}
            </p>
          </CardContent>
        </div>
      </div>
    </Card>
  );
}
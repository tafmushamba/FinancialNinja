import { ForumCategory } from "./forum-types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { ReactNode } from "react";

interface ForumCategoryCardProps {
  category: ForumCategory;
  onClick?: () => void;
}

// Map of category icons based on the name or id
const getCategoryIcon = (category: ForumCategory): ReactNode => {
  // This would ideally be based on category.icon from the database
  // For now, we'll use a simple switch based on name or id
  const iconMap: Record<string, ReactNode> = {
    // Add icons for specific categories
    "UK Financial Basics": <span className="text-2xl">💰</span>,
    "Investments & Savings": <span className="text-2xl">📈</span>,
    "Debt & Credit": <span className="text-2xl">💳</span>,
    "Taxes & UK Regulations": <span className="text-2xl">📋</span>,
    "Retirement Planning": <span className="text-2xl">🏖️</span>,
  };
  
  // Try to match by name, fallback to a default icon
  return iconMap[category.name] || <span className="text-2xl">📚</span>;
};

export default function ForumCategoryCard({ category, onClick }: ForumCategoryCardProps) {
  const { id, name, description, topicCount = 0 } = category;
  const icon = getCategoryIcon(category);
  
  return (
    <Card 
      className="hover:border-primary/50 transition-all cursor-pointer"
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
          {icon}
        </div>
        <div className="flex-1">
          <CardTitle className="line-clamp-1">{name}</CardTitle>
          <CardDescription className="line-clamp-2">{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground">
          <Badge variant="outline" className="mr-2">
            {topicCount} {topicCount === 1 ? 'topic' : 'topics'}
          </Badge>
          {/* Would add more stats here like active users, posts count, etc. */}
        </div>
      </CardContent>
      <CardFooter className="justify-between">
        <span className="text-sm text-muted-foreground">
          {/* Add last activity information here when available */}
          Last activity: Today
        </span>
        <Button variant="ghost" size="sm" className="gap-1">
          View <ChevronRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
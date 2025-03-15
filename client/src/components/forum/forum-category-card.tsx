import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, FileText, MessageSquare } from "lucide-react";
import { ForumCategory } from "./forum-types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface ForumCategoryCardProps {
  category: ForumCategory;
  onClick: () => void;
}

export default function ForumCategoryCard({ category, onClick }: ForumCategoryCardProps) {
  // If icon is a string that starts with "lucide:", extract the icon name
  const iconName = category.icon?.startsWith("lucide:") 
    ? category.icon.substring(7) 
    : null;

  // Color with fallback
  const color = category.color || "#4f46e5";

  return (
    <Card 
      className="transition-transform hover:scale-[1.01] cursor-pointer" 
      onClick={onClick}
    >
      <CardHeader className="pb-2 flex flex-row items-start justify-between">
        <div className="flex items-start space-x-4">
          <Avatar className="h-12 w-12" style={{ backgroundColor: color }}>
            <AvatarFallback>
              {iconName === "fileText" ? (
                <FileText className="h-6 w-6 text-white" />
              ) : iconName === "messageSquare" ? (
                <MessageSquare className="h-6 w-6 text-white" />
              ) : (
                category.name.substring(0, 2).toUpperCase()
              )}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{category.name}</CardTitle>
            <CardDescription className="mt-1">
              {category.description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center text-sm text-muted-foreground">
          <Badge variant="outline" className="mr-2">
            {category.topicCount || 0} Topics
          </Badge>
          <span>Latest activity 2 hours ago</span>
        </div>
      </CardContent>
      <CardFooter className="pb-3 pt-1 flex justify-end">
        <ArrowRight className="h-5 w-5 text-primary" />
      </CardFooter>
    </Card>
  );
}
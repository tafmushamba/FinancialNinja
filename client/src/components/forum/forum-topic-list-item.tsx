import { useLocation } from "wouter";
import { Badge } from "@/components/ui/badge";
import { ForumTopic } from "./forum-types";
import { formatDistanceToNow } from "date-fns";
import { MessageCircle, Pin, Lock } from "lucide-react";

interface ForumTopicListItemProps {
  topic: ForumTopic;
  showCategory?: boolean;
}

export default function ForumTopicListItem({ 
  topic, 
  showCategory = true 
}: ForumTopicListItemProps) {
  const [_, setLocation] = useLocation();

  return (
    <div 
      className="py-3 flex items-center justify-between hover:bg-muted/40 rounded-md cursor-pointer px-2 -mx-2"
      onClick={() => setLocation(`/forum/topics/${topic.id}`)}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-sm md:text-base truncate pr-2">
            {topic.isPinned && <Pin className="h-3.5 w-3.5 inline-block mr-1 text-amber-500" />}
            {topic.isLocked && <Lock className="h-3.5 w-3.5 inline-block mr-1 text-amber-500" />}
            {topic.title}
          </h3>
        </div>
        <div className="flex items-center mt-1 text-xs text-muted-foreground">
          <span>
            {topic.user?.username || 'Anonymous'} 
          </span>
          <span className="mx-1">•</span>
          <span>
            {topic.createdAt 
              ? formatDistanceToNow(new Date(topic.createdAt), { addSuffix: true }) 
              : 'Recently'}
          </span>
          
          {showCategory && topic.categoryId && (
            <>
              <span className="mx-1">•</span>
              <Badge 
                variant="outline" 
                className="text-xs h-5 font-normal hover:bg-background"
              >
                Category {topic.categoryId}
              </Badge>
            </>
          )}
        </div>
      </div>
      
      <div className="flex flex-col items-center text-center ml-4">
        <div className="flex items-center">
          <MessageCircle className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
          <span className="text-sm font-medium">{topic.postCount || 0}</span>
        </div>
        <span className="text-xs text-muted-foreground">
          {topic.views || 0} views
        </span>
      </div>
    </div>
  );
}
import { useLocation } from "wouter";
import { ForumTopic } from "./forum-types";
import { Calendar, MessageCircle, User, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ForumTopicListItemProps {
  topic: ForumTopic;
  showCategory?: boolean;
}

export default function ForumTopicListItem({ topic, showCategory = true }: ForumTopicListItemProps) {
  const [_, setLocation] = useLocation();

  const navigateToTopic = () => {
    setLocation(`/forum/topics/${topic.id}`);
  };

  // Format date for display
  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return "Unknown date";
    const d = new Date(date);
    return d.toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  return (
    <div 
      className="py-4 cursor-pointer hover:bg-accent/50 rounded-md transition-colors px-2"
      onClick={navigateToTopic}
    >
      <div className="flex flex-col md:flex-row gap-2 md:gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-md hover:text-primary transition-colors">
              {topic.title}
            </h3>
            {topic.isPinned && (
              <Badge variant="secondary" className="text-xs">Pinned</Badge>
            )}
            {topic.isLocked && (
              <Badge variant="outline" className="text-xs">Locked</Badge>
            )}
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
            {topic.content}
          </p>
          
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <User className="h-3.5 w-3.5" />
              <span>{topic.username || 'Anonymous'}</span>
            </div>
            
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              <span>{formatDate(topic.createdAt)}</span>
            </div>
            
            {showCategory && topic.category && (
              <div className="flex items-center gap-1.5 text-xs">
                <Badge variant="secondary" className="px-2 py-0">
                  {topic.category.name}
                </Badge>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex gap-4 items-start mt-2 md:mt-0">
          <div className="flex flex-col items-center">
            <div className="flex items-center text-xs text-muted-foreground">
              <Eye className="h-3.5 w-3.5 mr-1" />
              <span>{topic.views || 0}</span>
            </div>
            <span className="text-xs text-muted-foreground">views</span>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="flex items-center text-xs text-muted-foreground">
              <MessageCircle className="h-3.5 w-3.5 mr-1" />
              <span>{topic.postCount || 0}</span>
            </div>
            <span className="text-xs text-muted-foreground">posts</span>
          </div>
        </div>
      </div>
    </div>
  );
}
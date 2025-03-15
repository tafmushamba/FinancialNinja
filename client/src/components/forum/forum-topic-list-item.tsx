import { ForumTopic } from "./forum-types";
import { Link } from "wouter";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarDays, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ForumTopicListItemProps {
  topic: ForumTopic;
}

export default function ForumTopicListItem({ topic }: ForumTopicListItemProps) {
  const {
    id,
    title,
    categoryId,
    isPinned,
    isLocked,
    views = 0,
    createdAt,
    lastPostAt,
    postCount = 0,
    user
  } = topic;

  // Format the dates
  const formattedDate = createdAt
    ? formatDistanceToNow(new Date(createdAt), { addSuffix: true })
    : "";
  
  const lastPostDate = lastPostAt
    ? formatDistanceToNow(new Date(lastPostAt), { addSuffix: true })
    : formattedDate;

  // Get the initials for the avatar fallback
  const getUserInitials = () => {
    if (!user || !user.username) return "UK";
    const names = user.username.split(" ");
    if (names.length === 1) return names[0].slice(0, 2).toUpperCase();
    return (names[0][0] + names[1][0]).toUpperCase();
  };

  return (
    <Link href={`/forum/topics/${id}`}>
      <div className="py-4 hover:bg-muted/30 px-2 rounded-md transition-colors cursor-pointer">
        <div className="flex items-start gap-4">
          <Avatar className="hidden sm:flex h-10 w-10">
            <AvatarImage src={user?.avatar} alt={user?.username || "User"} />
            <AvatarFallback>{getUserInitials()}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-medium line-clamp-1">{title}</h3>
              {isPinned && <Badge variant="secondary">Pinned</Badge>}
              {isLocked && <Badge variant="outline">Locked</Badge>}
            </div>
            
            <div className="text-sm text-muted-foreground flex flex-wrap items-center gap-x-4 mt-1">
              <span className="flex items-center gap-1">
                <CalendarDays className="h-3 w-3" />
                {formattedDate}
              </span>
              
              <span>
                By {user?.username || "Anonymous"}
              </span>
              
              {postCount > 0 && (
                <span className="flex items-center gap-1">
                  <MessageCircle className="h-3 w-3" />
                  {postCount} {postCount === 1 ? "reply" : "replies"}
                </span>
              )}
            </div>
          </div>
          
          <div className="hidden sm:block text-right text-sm">
            <div className="text-muted-foreground">
              {views} {views === 1 ? "view" : "views"}
            </div>
            {lastPostAt && (
              <div className="text-muted-foreground mt-1 text-xs">
                Last post {lastPostDate}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
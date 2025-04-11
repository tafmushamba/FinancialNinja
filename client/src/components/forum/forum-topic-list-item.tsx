import { ForumTopic } from "./forum-types";
import { useLocation } from "wouter";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarDays, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

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

  // Format the dates - with error handling
  let formattedDate = "";
  try {
    formattedDate = createdAt
      ? formatDistanceToNow(new Date(createdAt), { addSuffix: true })
      : "";
  } catch (error) {
    console.error("Error formatting createdAt date:", error);
    formattedDate = "Recently";
  }
  
  let lastPostDate = formattedDate;
  try {
    if (lastPostAt) {
      lastPostDate = formatDistanceToNow(new Date(lastPostAt), { addSuffix: true });
    }
  } catch (error) {
    console.error("Error formatting lastPostAt date:", error);
    lastPostDate = "Recently";
  }

  // Get the initials for the avatar fallback
  const getUserInitials = () => {
    if (!user || !user.username) return "UK";
    const names = user.username.split(" ");
    if (names.length === 1) return names[0].slice(0, 2).toUpperCase();
    return (names[0][0] + names[1][0]).toUpperCase();
  };

  const [_, setLocation] = useLocation();

  return (
    <motion.div 
      className="border-b border-border last:border-b-0 hover:bg-accent/50"
      whileHover={{ x: 4 }}
      transition={{ duration: 0.2 }}
      onClick={() => setLocation(`/forum/topics/${categoryId}/${id}`)}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-3 cursor-pointer">
        <div className="flex flex-1 items-center gap-3 overflow-hidden">
          <Avatar className="w-10 h-10 rounded-full border-2 border-background shrink-0">
            {user?.avatar ? (
              <AvatarImage src={user.avatar} alt={user?.username || "User"} />
            ) : (
              <AvatarFallback>{getUserInitials()}</AvatarFallback>
            )}
          </Avatar>
          
          <div className="flex flex-col min-w-0 flex-1">
            <div className="font-medium leading-tight truncate hover:text-primary transition-colors">{title}</div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-0.5 flex-wrap">
              <span className="truncate">{user?.username || "Unknown User"}</span>
              {isPinned && <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">Pinned</Badge>}
              {isLocked && <Badge variant="destructive">Locked</Badge>}
            </div>
          </div>
        </div>
        
        <div className="flex sm:w-auto items-center gap-4 text-sm whitespace-nowrap justify-end flex-0.5 sm:flex-0.7">
          <div className="hidden sm:flex items-center gap-1 text-muted-foreground w-24">
            <CalendarDays className="h-3 w-3" />
            {formattedDate}
          </div>
          
          <div className="hidden md:flex flex-col items-end text-muted-foreground w-24">
            {lastPostAt && (
              <span className="text-xs">{lastPostDate}</span>
            )}
          </div>
          
          <div className="flex items-center justify-end w-24 gap-1 text-muted-foreground">
            {postCount > 0 && (
              <span className="flex items-center gap-1">
                <MessageCircle className="h-3 w-3" />
                {postCount} {postCount === 1 ? "reply" : "replies"}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
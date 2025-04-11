import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ForumPost } from "./forum-types";
import { formatDistanceToNow } from "date-fns";
import { ThumbsUp, MessageSquare, Award, Flag, Edit, Lightbulb } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface ForumPostCardProps {
  post: ForumPost;
  isFirstPost?: boolean;
  onReactionAdded?: (postId: number, type: string) => void;
  postIndex: number;
}

export default function ForumPostCard({ 
  post, 
  isFirstPost = false,
  onReactionAdded,
  postIndex
}: ForumPostCardProps) {
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  
  const handleReaction = (type: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to react to posts",
        variant: "default"
      });
      return;
    }
    
    if (onReactionAdded) {
      onReactionAdded(post.id, type);
    }
  };

  const isCurrentUser = isAuthenticated && user?.id === post.userId;
  
  // Format the date
  let formattedDate = "";
  try {
    formattedDate = post.createdAt
      ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })
      : "";
  } catch (error) {
    console.error("Error formatting post date:", error);
    formattedDate = "Recently";
  }

  // Get avatar initials
  const getUserInitials = () => {
    if (!post.user || !post.user.username) return "UK";
    const names = post.user.username.split(" ");
    if (names.length === 1) return names[0].slice(0, 2).toUpperCase();
    return (names[0][0] + names[1][0]).toUpperCase();
  };
  
  const getReactionIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <ThumbsUp className="h-4 w-4" />;
      case 'helpful':
        return <Lightbulb className="h-4 w-4" />;
      default:
        return null;
    }
  };
  
  // Count reactions by type
  const reactionCounts = {} as Record<string, number>;
  if (post.reactions) {
    post.reactions.forEach(reaction => {
      reactionCounts[reaction.reactionType] = (reactionCounts[reaction.reactionType] || 0) + 1;
    });
  }
  
  // Check if current user has reacted with each type
  const userReactions = {} as Record<string, boolean>;
  if (isAuthenticated && post.reactions) {
    post.reactions.forEach(reaction => {
      if (reaction.userId === user?.id) {
        userReactions[reaction.reactionType] = true;
      }
    });
  }

  // Animation variants for new post highlighting
  const postVariants = {
    initial: { backgroundColor: 'rgba(0,0,0,0)' },
    newPost: { 
      backgroundColor: ['rgba(52, 211, 153, 0.1)', 'rgba(52, 211, 153, 0.05)', 'rgba(52, 211, 153, 0)'],
      transition: { duration: 3, ease: "easeOut" }
    }
  };

  const renderPostContent = () => {
    return post.content.split("\n").map((paragraph, i) => (
      <p key={i} className="text-base leading-relaxed">{paragraph}</p>
    ));
  };

  return (
    <motion.div
      variants={postVariants}
      initial="initial"
      animate={postIndex < 3 ? "newPost" : "initial"}
      className="border-b border-border pb-6 last:border-b-0 last:pb-0"
    >
      <Card className="border-0 shadow-none bg-transparent pt-6">
        <CardHeader className="p-0 flex flex-row gap-4 items-center mb-4">
          <Avatar className="w-12 h-12 rounded-full border-2 border-background shrink-0">
            {post.user?.avatar ? (
              <AvatarImage src={post.user.avatar} alt={post.user?.username || "User"} />
            ) : (
              <AvatarFallback>{getUserInitials()}</AvatarFallback>
            )}
          </Avatar>
          <div className="flex flex-col overflow-hidden min-w-0 flex-1 justify-center">
            <div className="font-medium truncate">{post.user?.username || "Unknown User"}</div>
            <div className="text-sm text-muted-foreground flex items-center gap-2 flex-wrap mt-0.5">
              {formattedDate}
              {post.isEdited && <Badge variant="outline">Edited</Badge>}
              {isFirstPost && <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">Topic Starter</Badge>}
              {isCurrentUser && <Badge variant="default">Your Post</Badge>}
            </div>
          </div>
          
          <div className="flex items-center gap-2 shrink-0 text-muted-foreground text-sm font-medium whitespace-nowrap">
            #{postIndex + 1}
          </div>
        </CardHeader>
        <CardContent className="p-0 mb-4">
          {renderPostContent()}
          
          {(post.reactions && post.reactions.length > 0) && (
            <div className="flex items-center flex-wrap gap-2 mt-3">
              {Object.entries(reactionCounts).map(([type, count]) => (
                <motion.div 
                  key={type}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${userReactions[type] ? 'text-primary font-medium' : 'text-muted-foreground'}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleReaction(type)}
                >
                  {getReactionIcon(type) as React.ReactElement}
                  <span>{count}</span>
                </motion.div>
              ))}
            </div>
          )}

          <CardFooter className="flex flex-wrap gap-2 p-0 pt-2 mt-2 border-t border-border/50">
            <div className="flex gap-2 flex-1">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 sm:flex-initial"
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-8 ${userReactions['like'] ? 'text-primary' : ''}`}
                  onClick={() => handleReaction('like')}
                >
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  Like
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 sm:flex-initial"
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-8 ${userReactions['helpful'] ? 'text-primary' : ''}`}
                  onClick={() => handleReaction('helpful')}
                >
                  <Lightbulb className="h-4 w-4 mr-1" />
                  Helpful
                </Button>
              </motion.div>
            </div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 sm:flex-initial justify-end flex"
            >
              <Button
                variant="ghost"
                size="sm"
                className="h-8"
              >
                <MessageSquare className="h-4 w-4 mr-1" />
                Reply
              </Button>
            </motion.div>
          </CardFooter>
        </CardContent>
      </Card>
    </motion.div>
  );
}
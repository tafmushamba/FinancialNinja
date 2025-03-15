import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ForumPost } from "./forum-types";
import { formatDistanceToNow } from "date-fns";
import { ThumbsUp, MessageSquare, Award, Flag, Edit } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

interface ForumPostCardProps {
  post: ForumPost;
  isFirstPost?: boolean;
  onReactionAdded?: (postId: number, type: string) => void;
}

export default function ForumPostCard({ 
  post, 
  isFirstPost = false,
  onReactionAdded
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

  return (
    <Card className={isFirstPost ? "border-primary/30" : undefined}>
      {isFirstPost && (
        <div className="bg-primary/10 px-4 py-1">
          <Badge variant="outline" className="bg-background">
            Original Post
          </Badge>
        </div>
      )}
      <div className="flex">
        <div className="w-40 shrink-0 p-6 border-r hidden md:block">
          <div className="flex flex-col items-center text-center">
            <Avatar className="h-16 w-16 mb-2">
              <AvatarFallback className="bg-primary/10">
                {post.user?.username?.slice(0, 2).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <h3 className="font-medium text-sm mb-1">
              {post.user?.username || 'Anonymous'}
            </h3>
            <Badge variant="outline" className="text-xs">
              {post.user?.userLevel || 'Member'}
            </Badge>
          </div>
        </div>
        <div className="flex-1 flex flex-col">
          <CardHeader className="flex-row items-center justify-between py-3 md:py-4 space-y-0">
            <div className="flex items-center">
              <Avatar className="h-8 w-8 mr-2 md:hidden">
                <AvatarFallback className="bg-primary/10">
                  {post.user?.username?.slice(0, 2).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <span className="font-medium text-sm md:hidden">
                  {post.user?.username || 'Anonymous'}
                </span>
                <div className="text-xs text-muted-foreground">
                  {post.createdAt 
                    ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true }) 
                    : 'Recently'}
                  {post.isEdited && <span className="ml-1">(edited)</span>}
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              {isCurrentUser && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => toast({
                    title: "Coming soon!",
                    description: "Edit functionality is being developed."
                  })}
                >
                  <Edit className="h-4 w-4 mr-1" /> Edit
                </Button>
              )}
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => toast({
                  title: "Coming soon!",
                  description: "Report functionality is being developed."
                })}
              >
                <Flag className="h-4 w-4" />
                <span className="sr-only">Report</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="py-2 flex-1">
            <div className="prose prose-sm max-w-none dark:prose-invert">
              {post.content.split("\n").map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </CardContent>
          <CardFooter className="border-t py-3 justify-between">
            <div className="flex space-x-1">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleReaction('like')}
              >
                <ThumbsUp className="h-4 w-4 mr-1" /> 
                {post.reactionCount || 0}
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleReaction('helpful')}
              >
                <Award className="h-4 w-4 mr-1" /> Helpful
              </Button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const textarea = document.querySelector('textarea');
                if (textarea) {
                  textarea.focus();
                  textarea.value = `@${post.user?.username || 'Anonymous'} `;
                }
              }}
            >
              <MessageSquare className="h-4 w-4 mr-1" /> Reply
            </Button>
          </CardFooter>
        </div>
      </div>
    </Card>
  );
}
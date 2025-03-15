import { useEffect, useState } from "react";
import { useRoute, Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, MessageCircle, Eye, Calendar, Lock } from "lucide-react";
import { ForumCategory, ForumPost, ForumTopic } from "../components/forum/forum-types";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import ForumPostCard from "../components/forum/forum-post-card";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { formatDistanceToNow } from "date-fns";
import PageHeader from "@/components/layout/page-header";

export default function ForumTopicPage() {
  const [match, params] = useRoute<{ topicId: string }>("/forum/topics/:topicId");
  const [_, setLocation] = useLocation();
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();

  const [topic, setTopic] = useState<ForumTopic | null>(null);
  const [category, setCategory] = useState<Partial<ForumCategory> | null>(null);
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPostContent, setNewPostContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchTopic = async () => {
      if (!match || !params?.topicId) return;

      try {
        setLoading(true);
        const response = await apiRequest<{ 
          topic: ForumTopic;
          category: Partial<ForumCategory> | null;
          posts: ForumPost[];
        }>({
          url: `/api/forum/topics/${params.topicId}`,
          method: "GET"
        });

        setTopic(response.topic);
        setCategory(response.category);
        setPosts(response.posts);
      } catch (error) {
        console.error("Error fetching topic:", error);
        toast({
          title: "Error",
          description: "Failed to load topic. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTopic();
  }, [match, params, toast]);

  const handleSubmitReply = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to reply to this topic",
        variant: "default"
      });
      return;
    }

    if (!topic || !newPostContent.trim()) return;

    try {
      setSubmitting(true);
      const response = await apiRequest<{ post: ForumPost }>({
        url: `/api/forum/topics/${topic.id}/posts`,
        method: "POST",
        data: { content: newPostContent }
      });

      setPosts(prev => [...prev, response.post]);
      setNewPostContent("");
      toast({
        title: "Success",
        description: "Your reply has been posted",
        variant: "default"
      });
    } catch (error) {
      console.error("Error posting reply:", error);
      toast({
        title: "Error",
        description: "Failed to post your reply. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!match) {
    return null;
  }

  return (
    <div className="container py-6 space-y-6 max-w-5xl">
      <Button 
        variant="ghost" 
        className="mb-2 flex items-center"
        onClick={() => category 
          ? setLocation(`/forum/categories/${category.id}`) 
          : setLocation("/forum")
        }
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        {category ? `Back to ${category.name}` : 'Back to Forum'}
      </Button>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-12 w-3/4 mb-2" />
          <Skeleton className="h-6 w-1/2 mb-4" />
          <Skeleton className="h-[200px] w-full mb-4" />
          <Skeleton className="h-[200px] w-full" />
        </div>
      ) : topic ? (
        <>
          <PageHeader 
            title={topic.title}
            description={
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Eye className="inline-block mr-1 h-4 w-4" /> 
                  {topic.views || 0} views
                </div>
                <div className="flex items-center">
                  <Calendar className="inline-block mr-1 h-4 w-4" /> 
                  {topic.createdAt ? formatDistanceToNow(new Date(topic.createdAt), { addSuffix: true }) : 'Recently'}
                </div>
                {topic.isLocked && (
                  <div className="flex items-center text-amber-500">
                    <Lock className="inline-block mr-1 h-4 w-4" /> 
                    Locked
                  </div>
                )}
              </div>
            }
          />

          {category && (
            <div className="flex items-center mb-4">
              <Badge 
                className="text-sm"
                style={{ backgroundColor: category.color || '#888', color: 'white' }}
              >
                {category.name}
              </Badge>
            </div>
          )}

          <div className="space-y-4">
            {posts.map((post, index) => (
              <ForumPostCard 
                key={post.id} 
                post={post}
                isFirstPost={index === 0}
                onReactionAdded={(postId, type) => {
                  // Placeholder for reaction handling
                  toast({
                    title: "Coming soon!",
                    description: "Reaction feature is being developed"
                  });
                }}
              />
            ))}
          </div>

          {!topic.isLocked ? (
            <Card>
              <CardHeader>
                <CardTitle>Post a Reply</CardTitle>
                {!isAuthenticated && (
                  <CardDescription>
                    <Link href="/login" className="text-primary hover:underline">
                      Sign in
                    </Link> to join the conversation
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder={isAuthenticated 
                    ? "Share your thoughts or ask questions..." 
                    : "Sign in to reply to this topic"
                  }
                  className="min-h-[120px]"
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  disabled={!isAuthenticated || submitting}
                />
              </CardContent>
              <CardFooter className="flex justify-end border-t px-6 py-4">
                <Button 
                  onClick={handleSubmitReply}
                  disabled={!isAuthenticated || submitting || !newPostContent.trim()}
                >
                  {submitting ? "Posting..." : "Post Reply"}
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <Card className="bg-muted">
              <CardContent className="pt-6 text-center">
                <Lock className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                <h3 className="text-lg font-medium">This topic is locked</h3>
                <p className="text-muted-foreground mt-1">
                  New replies are no longer accepted
                </p>
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-12">
          <h2 className="text-2xl font-bold mb-2">Topic not found</h2>
          <p className="text-muted-foreground mb-6">The topic you're looking for doesn't exist</p>
          <Button onClick={() => setLocation("/forum")}>
            Return to Forum
          </Button>
        </div>
      )}
    </div>
  );
}
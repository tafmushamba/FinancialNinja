import { useEffect, useState } from "react";
import { useRoute, Link, useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, ArrowLeft, MessageCircle } from "lucide-react";
import { ForumCategory, ForumTopic } from "../components/forum/forum-types";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import ForumHeader from "../components/forum/forum-header";
import ForumTopicListItem from "../components/forum/forum-topic-list-item";
import { Skeleton } from "@/components/ui/skeleton";
import PageHeader from "@/components/layout/page-header";
import { useAuth } from "@/context/AuthContext";

export default function ForumCategoryPage() {
  const [match, params] = useRoute<{ categoryId: string }>("/forum/categories/:categoryId");
  const [_, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  const [category, setCategory] = useState<ForumCategory | null>(null);
  const [topics, setTopics] = useState<ForumTopic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      if (!match || !params?.categoryId) return;

      try {
        setLoading(true);
        const response = await apiRequest<{ 
          category: ForumCategory;
          topics: ForumTopic[];
        }>({
          url: `/api/forum/categories/${params.categoryId}/topics`
        });

        setCategory(response.category);
        setTopics(response.topics);
      } catch (error) {
        console.error("Error fetching category:", error);
        toast({
          title: "Error",
          description: "Failed to load category topics. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [match, params, toast]);

  if (!match) {
    return null;
  }

  const handleCreateTopic = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create a new topic",
        variant: "default"
      });
      return;
    }

    // Placeholder for create topic action
    toast({
      title: "Coming soon!",
      description: "This feature is currently being developed."
    });
  };

  return (
    <div className="container py-6 space-y-6 max-w-5xl">
      <Button 
        variant="ghost" 
        className="mb-2 flex items-center"
        onClick={() => setLocation("/forum")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Forum
      </Button>

      {loading ? (
        <>
          <Skeleton className="h-12 w-3/4 mb-2" />
          <Skeleton className="h-6 w-1/2 mb-8" />
          <Skeleton className="h-[400px] w-full" />
        </>
      ) : category ? (
        <>
          <PageHeader 
            title={category.name} 
            description={category.description}
            icon={
              <div 
                className="h-10 w-10 rounded-md flex items-center justify-center text-white"
                style={{ backgroundColor: category.color }}
              >
                <MessageCircle className="h-6 w-6" />
              </div>
            }
          />

          <ForumHeader />

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Topics</CardTitle>
                <CardDescription>
                  {topics.length === 0 
                    ? "No topics yet in this category" 
                    : `${topics.length} topic${topics.length === 1 ? '' : 's'} in this category`}
                </CardDescription>
              </div>
              <Button onClick={handleCreateTopic}>
                <Plus className="mr-2 h-4 w-4" />
                New Topic
              </Button>
            </CardHeader>
            <CardContent>
              {topics.length > 0 ? (
                <div className="space-y-1 divide-y">
                  {topics.map((topic) => (
                    <ForumTopicListItem key={topic.id} topic={topic} showCategory={false} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <MessageCircle className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                  <h3 className="text-lg font-medium">No topics yet</h3>
                  <p className="text-muted-foreground mt-1">
                    Be the first to start a discussion in this category
                  </p>
                  <Button className="mt-4" onClick={handleCreateTopic}>
                    Create New Topic
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-12">
          <h2 className="text-2xl font-bold mb-2">Category not found</h2>
          <p className="text-muted-foreground mb-6">The category you're looking for doesn't exist</p>
          <Button onClick={() => setLocation("/forum")}>
            Return to Forum
          </Button>
        </div>
      )}
    </div>
  );
}
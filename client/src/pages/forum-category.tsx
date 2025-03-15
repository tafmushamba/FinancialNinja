import { useEffect, useState } from "react";
import { useRoute, Link, useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { ForumCategory, ForumTopic } from "../components/forum/forum-types";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import ForumHeader from "../components/forum/forum-header";
import ForumTopicListItem from "../components/forum/forum-topic-list-item";
import CreateTopicDialog from "../components/forum/create-topic-dialog";
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
  const [error, setError] = useState<string | null>(null);

  const fetchTopics = async () => {
    if (!match || !params?.categoryId) return;

    try {
      setLoading(true);
      setError(null);
      
      // Directly fetch data and log everything for debugging
      const response = await fetch(`/api/forum/categories/${params.categoryId}/topics`);
      const data = await response.json();
      
      console.log("API response:", data);
      
      // Set the category and topics data
      setCategory(data.category || null);
      setTopics(Array.isArray(data.topics) ? data.topics : []);
      
    } catch (error) {
      console.error("Error fetching category:", error);
      setError("Failed to load topics. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, [match, params, toast]);

  if (!match) {
    return null;
  }

  const handleCreateTopicClick = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create a new topic",
        variant: "default"
      });
      return;
    }
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
      ) : error ? (
        <div className="p-8 text-center">
          <h2 className="text-lg font-semibold mb-2">Error Loading Data</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={fetchTopics}>Try Again</Button>
        </div>
      ) : category ? (
        <>
          <div className="p-4 border rounded mb-4">
            <h1 className="text-xl font-bold mb-2">{category.name}</h1>
            <p className="text-muted-foreground">{category.description}</p>
          </div>

          <div className="bg-background p-4 rounded-lg border">
            <h2 className="text-lg font-semibold mb-4">Topics ({topics.length})</h2>
            
            {topics.length > 0 ? (
              <div className="space-y-4">
                {topics.map((topic) => (
                  <div key={topic.id} className="p-3 border rounded">
                    <h3 className="font-medium">{topic.title}</h3>
                    <p className="text-sm text-muted-foreground truncate">{topic.content}</p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                      <span>Views: {topic.views}</span>
                      <span>Posts: {topic.postCount || 0}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p>No topics in this category yet.</p>
                <Button className="mt-4" onClick={handleCreateTopicClick}>Create Topic</Button>
              </div>
            )}
          </div>
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
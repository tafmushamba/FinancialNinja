import { useEffect, useState } from "react";
import { useRoute, Link, useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { ForumCategory, ForumTopic } from "@/components/forum/forum-types";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import ForumHeader from "@/components/forum/forum-header";
import ForumTopicListItem from "@/components/forum/forum-topic-list-item";
import CreateTopicDialog from "@/components/forum/create-topic-dialog";
import { Skeleton } from "@/components/ui/skeleton";
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
      
      // Debug what's happening with topics data
      console.log("Topics data:", data.topics);
      console.log("Is Array?", Array.isArray(data.topics));
      console.log("Topics length:", data.topics ? data.topics.length : 0);
      
      // Add missing user data to each topic before setting state
      const topicsWithUser = Array.isArray(data.topics) 
        ? data.topics.map(topic => {
            console.log("Processing topic:", topic);
            return {
              ...topic,
              user: {
                id: topic.userId,
                username: "User " + topic.userId, // Default username
                userLevel: "Regular" // Default level
              }
            };
          }) 
        : [];
      
      console.log("Topics with user data:", topicsWithUser);
      setTopics(topicsWithUser);
      
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

  const handleCreateTopicSuccess = () => {
    // Refetch topics after creating new topic
    fetchTopics();
    toast({
      title: "Success!",
      description: "Your topic was created successfully.",
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
      ) : error ? (
        <div className="p-8 text-center">
          <h2 className="text-lg font-semibold mb-2">Error Loading Data</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={fetchTopics}>Try Again</Button>
        </div>
      ) : category ? (
        <>
          <ForumHeader 
            currentCategory={category} 
            showSearch={false}
          />

          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Topics ({topics.length})</h2>
            {isAuthenticated && (
              <CreateTopicDialog 
                category={category} 
                onSuccess={handleCreateTopicSuccess} 
              />
            )}
          </div>
          
          {topics.length > 0 ? (
            <div className="space-y-4">
              {topics.map((topic) => (
                <ForumTopicListItem key={topic.id} topic={topic} />
              ))}
            </div>
          ) : (
            <div className="text-center p-12 border rounded-lg bg-background">
              <h3 className="font-medium text-lg mb-2">No topics in this category yet</h3>
              <p className="text-muted-foreground mb-6">Be the first to start a discussion!</p>
              {isAuthenticated ? (
                <CreateTopicDialog 
                  category={category} 
                  onSuccess={handleCreateTopicSuccess} 
                />
              ) : (
                <Button onClick={() => setLocation("/login")}>
                  Log in to create a topic
                </Button>
              )}
            </div>
          )}
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
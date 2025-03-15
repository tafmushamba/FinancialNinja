import { useEffect, useState } from "react";
import { Link, useLocation, useRoute } from "wouter";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ForumCategory, ForumTopic } from "@/components/forum/forum-types";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import ForumHeader from "@/components/forum/forum-header";
import ForumCategoryCard from "@/components/forum/forum-category-card";
import ForumTopicListItem from "@/components/forum/forum-topic-list-item";
import { Skeleton } from "@/components/ui/skeleton";
import PageHeader from "@/components/layout/page-header";
import { MessageCircle, Users } from "lucide-react";

export default function ForumPage() {
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [recentTopics, setRecentTopics] = useState<ForumTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [_, setLocation] = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [categoriesResponse, recentTopicsResponse] = await Promise.all([
          apiRequest<{ categories: ForumCategory[] }>({ 
            url: "/api/forum/categories",
            method: "GET" 
          }),
          apiRequest<{ topics: ForumTopic[] }>({ 
            url: "/api/forum/topics/recent?limit=5",
            method: "GET" 
          })
        ]);
        
        setCategories(categoriesResponse.categories);
        
        // Add missing user data to each topic before setting state
        const topicsWithUser = recentTopicsResponse.topics.map(topic => ({
          ...topic,
          user: {
            id: topic.userId,
            username: "User " + topic.userId, // Default username
            userLevel: "Regular" // Default level
          }
        }));
        
        setRecentTopics(topicsWithUser);
      } catch (error) {
        console.error("Error fetching forum data:", error);
        toast({
          title: "Error",
          description: "Failed to load forum data. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  return (
    <div className="container py-6 space-y-6 max-w-5xl">
      <PageHeader 
        title="Community Forum" 
        description="Join the UK Financial Literacy community to learn and share knowledge"
        icon={<Users className="h-6 w-6" />}
      />

      <ForumHeader />

      <Tabs defaultValue="categories" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="recent">Recent Discussions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="categories" className="space-y-4">
          {loading ? (
            Array(5).fill(0).map((_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-[100px] w-full" />
              </div>
            ))
          ) : (
            categories.map((category) => (
              <ForumCategoryCard 
                key={category.id} 
                category={category}
                onClick={() => setLocation(`/forum/categories/${category.id}`)}
              />
            ))
          )}
        </TabsContent>
        
        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Discussions</CardTitle>
              <CardDescription>
                The latest topics from across all categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                Array(5).fill(0).map((_, index) => (
                  <div key={index} className="py-2">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                ))
              ) : recentTopics.length > 0 ? (
                <div className="space-y-2 divide-y">
                  {recentTopics.map((topic) => (
                    <ForumTopicListItem key={topic.id} topic={topic} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <MessageCircle className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                  <h3 className="text-lg font-medium">No topics yet</h3>
                  <p className="text-muted-foreground mt-1">
                    Be the first to start a discussion by selecting a category
                  </p>
                  <Button 
                    className="mt-4" 
                    onClick={() => {
                      // Switch to categories tab
                      const categoriesTab = document.querySelector('[data-state="inactive"][value="categories"]');
                      if (categoriesTab) {
                        (categoriesTab as HTMLElement).click();
                      }
                    }}
                  >
                    View Categories
                  </Button>
                </div>
              )}
            </CardContent>
            {recentTopics.length > 0 && (
              <CardFooter className="border-t px-6 py-4">
                <Button variant="outline" onClick={() => toast({
                  title: "Coming soon!",
                  description: "View all topics feature is coming soon!"
                })}>
                  View All Topics
                </Button>
              </CardFooter>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
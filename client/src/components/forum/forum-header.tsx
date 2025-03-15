import { useState } from "react";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Info, Search } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function ForumHeader() {
  const [_, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    // Placeholder for search functionality
    toast({
      title: "Coming soon!",
      description: "Search functionality is currently being developed."
    });
  };

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
      description: "Create topic functionality is currently being developed."
    });
  };

  return (
    <Card className="border-primary/10 bg-primary/5">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div className="flex-1 max-w-xl">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-primary mt-1" />
              <div>
                <h3 className="font-medium mb-1">Community Guidelines</h3>
                <p className="text-sm text-muted-foreground">
                  Our forum is a place to learn and discuss UK financial topics in a respectful environment. 
                  Keep discussions constructive and be mindful of UK financial regulations when giving advice.
                </p>
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-auto space-y-3 md:space-y-0 md:flex gap-3">
            <form onSubmit={handleSearch} className="flex-1 md:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search forum..."
                  className="pl-9 w-full md:w-[200px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>
            
            <Button onClick={handleCreateTopic}>
              New Topic
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

export default function ForumHeader() {
  const [searchQuery, setSearchQuery] = useState("");
  const [_, setLocation] = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // TODO: Implement search functionality when API is ready
      console.log("Searching for:", searchQuery);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
      <div className="flex-1 w-full">
        <form onSubmit={handleSearch} className="relative">
          <Input
            className="pl-10 w-full"
            placeholder="Search all discussions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </form>
      </div>
      <div className="flex gap-2 w-full sm:w-auto">
        <Button 
          variant="outline" 
          onClick={() => setLocation("/forum")}
          className="flex-1 sm:flex-initial"
        >
          All Categories
        </Button>
        <Button 
          onClick={() => {
            // This would open a create topic dialog or navigate to create topic page
            // Currently using a placeholder alert
            alert("Create topic dialog will be implemented here");
          }}
          className="flex-1 sm:flex-initial"
        >
          Create Topic
        </Button>
      </div>
    </div>
  );
}
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { ForumCategory } from "./forum-types";

interface ForumHeaderProps {
  currentCategory?: ForumCategory;
  showSearch?: boolean;
}

export default function ForumHeader({ currentCategory, showSearch = true }: ForumHeaderProps) {
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
      {showSearch && (
        <div className="flex-1 w-full">
          <form onSubmit={handleSearch} className="relative">
            <Input
              className="pl-10 w-full"
              placeholder={currentCategory 
                ? `Search in ${currentCategory.name}...` 
                : "Search all discussions..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </form>
        </div>
      )}
      <div className="flex gap-2 w-full sm:w-auto">
        {currentCategory && (
          <Button 
            variant="outline" 
            onClick={() => setLocation("/forum")}
            className="flex-1 sm:flex-initial"
          >
            All Categories
          </Button>
        )}
        <Button 
          onClick={() => {
            // If we're in a category and have a create topic dialog
            if (currentCategory) {
              // We'll leave the button as is, it's handled by the parent
              return;
            }
            
            // Otherwise show a placeholder message
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
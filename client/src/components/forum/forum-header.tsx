import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
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
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            <form onSubmit={handleSearch} className="w-full flex gap-2">
              <Input
                type="search"
                placeholder="Search forum..."
                className="w-full bg-background/50 border-background/20 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-primary/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ pointerEvents: 'auto' }}
              />
              <Button 
                type="submit" 
                size="sm" 
                variant="outline"
                className="cursor-pointer text-neon-green hover:bg-neon-green/10 z-10"
                style={{ pointerEvents: 'auto' }}
              >
                Search
              </Button>
            </form>
          </motion.div>
        </div>
      )}
      <div className="flex justify-end w-full sm:w-auto gap-2">
        {currentCategory && (
          <Button 
            variant="outline"
            onClick={() => setLocation('/forum')}
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
          className="flex-1 sm:flex-initial bg-primary hover:bg-primary/90 transition-colors"
        >
          Create Topic
        </Button>
      </div>
    </div>
  );
}
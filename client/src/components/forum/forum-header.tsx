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
            className="relative"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <form onSubmit={handleSearch} className="w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search forum topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-md border-border focus-visible:ring-primary/50"
              />
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
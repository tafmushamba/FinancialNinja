import { Link } from "wouter";
import { MessageCircle, Users, Book, Activity, Filter, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ForumCategory } from "./forum-types";

interface ForumHeaderProps {
  categories?: ForumCategory[];
  currentCategory?: ForumCategory | null;
  showSearch?: boolean;
}

export default function ForumHeader({ 
  categories = [], 
  currentCategory = null,
  showSearch = true
}: ForumHeaderProps) {
  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {currentCategory ? currentCategory.name : "Community Forum"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {currentCategory 
              ? currentCategory.description 
              : "Connect with fellow learners, share insights, and discuss UK financial topics"}
          </p>
        </div>
        
        {showSearch && (
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search forum..."
                className="w-full pl-9 sm:w-[250px] lg:w-[300px]"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
              <span className="sr-only">Filter</span>
            </Button>
          </div>
        )}
      </div>

      {!currentCategory && (
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center"
            asChild
          >
            <Link href="/forum">
              <Activity className="mr-1 h-4 w-4" />
              Recent Topics
            </Link>
          </Button>
          
          {categories.slice(0, 5).map((category) => (
            <Button
              key={category.id}
              variant="outline"
              size="sm"
              className="flex items-center"
              asChild
            >
              <Link href={`/forum/categories/${category.id}`}>
                <span dangerouslySetInnerHTML={{ 
                  __html: category.icon || '<span class="mr-1 h-4 w-4"></span>' 
                }} />
                {category.name}
              </Link>
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
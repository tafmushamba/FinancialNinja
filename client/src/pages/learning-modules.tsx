import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchModules } from "@/lib/api";
import { ModuleCard } from "@/components/modules/module-card";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button"; // Import the correct Button component
import { motion } from "framer-motion"; // Import motion from framer-motion

const LearningModulesPage: React.FC = () => {
  const [, navigate] = useLocation();
  const { data, isLoading } = useQuery<{ modules: any[] }>({
    queryKey: ['/api/learning/all-modules'],
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [difficulty, setDifficulty] = useState("all");
  const [category, setCategory] = useState("all");
  const [activeTab, setActiveTab] = useState("all");

  const modules = data?.modules || [];

  // Normalize category names to ensure consistent filtering
  const normalizedModules = modules.map(module => {
    let normalizedCategory = 'Basics';
    if (module.topics && module.topics.length > 0) {
      const firstTopic = module.topics[0].toLowerCase();
      if (firstTopic.includes('saving')) normalizedCategory = 'Savings';
      else if (firstTopic.includes('invest')) normalizedCategory = 'Investing';
      else if (firstTopic.includes('credit')) normalizedCategory = 'Credit';
      else if (firstTopic.includes('tax')) normalizedCategory = 'Taxes';
      else if (firstTopic.includes('debt')) normalizedCategory = 'Debt';
      else normalizedCategory = 'Basics';
    }
    return {
      ...module,
      category: normalizedCategory
    };
  });

  const filteredModules = normalizedModules.filter((module: any) => {
    const matchesSearch = (
      module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      module.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const matchesDifficulty = difficulty === "all" || module.difficulty === difficulty;
    
    // Use includes for partial matching on category/topics
    const categoryLower = category.toLowerCase();
    const matchesCategory = category === "all" || 
      module.category?.toLowerCase().includes(categoryLower) || 
      module.topics?.some((topic: string) => topic.toLowerCase().includes(categoryLower));

    console.log(`Filtering Module: ${module.title}, Category: ${module.category}, Topics: ${JSON.stringify(module.topics)}, Filter Category: ${category}, Matches Category: ${matchesCategory}`);
    
    return matchesSearch && matchesDifficulty && matchesCategory;
  });

  const handleCategoryChange = (newCategory: string) => {
    console.log(`Changing category filter to: ${newCategory}`);
    setCategory(newCategory);
    setActiveTab(newCategory);
  };

  const handleDifficultyChange = (newDifficulty: string) => {
    console.log(`Changing difficulty filter to: ${newDifficulty}`);
    setDifficulty(newDifficulty);
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl animate-fadeIn"
      style={{ position: 'relative', zIndex: 1, pointerEvents: 'auto' }}
    >
      <div className="mb-8 text-center max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold font-mono mb-2">Learning Modules</h1>
        <p className="text-muted-foreground">Explore our comprehensive financial education curriculum.</p>
      </div>

      {/* Sticky Filter Bar */}
      <div className="sticky top-0 bg-background/80 backdrop-blur-sm z-10 py-4 mb-8 border-b border-border/50"
        style={{ pointerEvents: 'auto' }}
      >
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between"
          style={{ pointerEvents: 'auto' }}
        >
          {/* Search Input */}
          <form onSubmit={(e) => e.preventDefault()} className="w-full md:w-1/3"
            style={{ pointerEvents: 'auto' }}
          >
            <div className="relative"
              style={{ pointerEvents: 'auto' }}
            >
              <Input
                placeholder="Search modules..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-background/60"
                style={{ pointerEvents: 'auto' }}
              />
            </div>
          </form>

          {/* Filter Controls */}
          <div className="flex flex-wrap gap-2 items-center w-full md:w-auto justify-center md:justify-end"
            style={{ pointerEvents: 'auto' }}
          >
            <div className="flex items-center gap-2 text-sm text-muted-foreground"
              style={{ pointerEvents: 'auto' }}
            >
              Filter by:
            </div>
            <div className="flex flex-wrap gap-2"
              style={{ pointerEvents: 'auto' }}
            >
              <Button
                variant={difficulty === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => handleDifficultyChange("all")}
                className={`cursor-pointer z-10 rounded-full px-3 transition-all duration-300 ${difficulty === "all" ? 'bg-neon-green text-black hover:bg-neon-green/90' : 'border-neon-green/30 text-neon-green hover:bg-neon-green/10'}`}
                style={{ pointerEvents: 'auto' }}
              >
                All Levels
              </Button>
              <Button
                variant={difficulty === "beginner" ? "default" : "outline"}
                size="sm"
                onClick={() => handleDifficultyChange("beginner")}
                className={`cursor-pointer z-10 rounded-full px-3 transition-all duration-300 ${difficulty === "beginner" ? 'bg-neon-green text-black hover:bg-neon-green/90' : 'border-neon-green/30 text-neon-green hover:bg-neon-green/10'}`}
                style={{ pointerEvents: 'auto' }}
              >
                Beginner
              </Button>
              <Button
                variant={difficulty === "intermediate" ? "default" : "outline"}
                size="sm"
                onClick={() => handleDifficultyChange("intermediate")}
                className={`cursor-pointer z-10 rounded-full px-3 transition-all duration-300 ${difficulty === "intermediate" ? 'bg-neon-green text-black hover:bg-neon-green/90' : 'border-neon-green/30 text-neon-green hover:bg-neon-green/10'}`}
                style={{ pointerEvents: 'auto' }}
              >
                Intermediate
              </Button>
              <Button
                variant={difficulty === "advanced" ? "default" : "outline"}
                size="sm"
                onClick={() => handleDifficultyChange("advanced")}
                className={`cursor-pointer z-10 rounded-full px-3 transition-all duration-300 ${difficulty === "advanced" ? 'bg-neon-green text-black hover:bg-neon-green/90' : 'border-neon-green/30 text-neon-green hover:bg-neon-green/10'}`}
                style={{ pointerEvents: 'auto' }}
              >
                Advanced
              </Button>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-1 mt-4 overflow-x-auto"
          style={{ pointerEvents: 'auto' }}
        >
          {[
            { id: "all", label: "All" },
            { id: "Basics", label: "Basics" },
            { id: "Savings", label: "Savings" },
            { id: "Investing", label: "Investing" },
            { id: "Credit", label: "Credit" },
            { id: "Taxes", label: "Taxes" },
            { id: "Debt", label: "Debt" },
          ].map((tab) => (
            <Button
              key={tab.id}
              variant="ghost"
              className={`relative px-4 py-2 text-sm cursor-pointer transition-all duration-300 ${activeTab === tab.id ? 'text-neon-green' : 'text-white/70 hover:text-neon-green/70'}`}
              onClick={() => handleCategoryChange(tab.id)}
              style={{ pointerEvents: 'auto' }}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-neon-green"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        style={{ pointerEvents: 'auto' }}
      >
        {filteredModules.length === 0 ? (
          <div className="col-span-full text-center py-12 border border-neon-green/30 rounded-lg bg-dark-800"
            style={{ pointerEvents: 'auto' }}
          >
            No modules found matching your criteria.
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setDifficulty("all");
                setCategory("all");
                setActiveTab("all");
                console.log("Reset all filters");
              }}
              className="mt-4 text-neon-green border-neon-green/30 hover:bg-neon-green/10"
              style={{ pointerEvents: 'auto' }}
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          filteredModules.map((module: any) => (
            <ModuleCard
              key={module.id}
              id={module.id}
              title={module.title}
              description={module.description}
              icon={module.icon}
              accentColor={module.accentColor}
              difficulty={module.difficulty}
              duration={module.duration}
              topics={module.topics || []}
              progress={module.progress}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default LearningModulesPage;
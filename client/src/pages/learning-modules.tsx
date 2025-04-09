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

  const filteredModules = modules.filter((module: any) => {
    const matchesSearch = (
      module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      module.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesDifficulty = difficulty === "all" || module.difficulty?.toLowerCase() === difficulty.toLowerCase();
    const matchesCategory = category === "all" || module.category?.toLowerCase() === category.toLowerCase();
    
    let matchesTab = true;
    if (activeTab === "in-progress") {
      matchesTab = module.progress > 0 && module.progress < 100;
    } else if (activeTab === "completed") {
      matchesTab = module.progress === 100;
    }

    return matchesSearch && matchesDifficulty && matchesCategory && matchesTab;
  });

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-4xl mx-auto text-center mb-8">
        <p className="text-muted-foreground">
          Explore our comprehensive financial literacy modules designed to help you
          master personal finance and wealth-building strategies.
        </p>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <div>
          <Input
            placeholder="Search modules..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div>
          <Select value={difficulty} onValueChange={setDifficulty}>
            <SelectTrigger>
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Difficulties</SelectItem>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="investing">Investing</SelectItem>
              <SelectItem value="budgeting">Budgeting</SelectItem>
              <SelectItem value="risk">Risk Management</SelectItem>
              <SelectItem value="retirement">Retirement</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All Modules</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-3 text-center py-12">Loading modules...</div>
        ) : filteredModules.length === 0 ? (
          <div className="col-span-3 text-center py-12">
            No modules found matching your criteria.
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
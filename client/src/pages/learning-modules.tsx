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
import { useLocation } from "../lib/location";
import { Button, Card, CardFooter } from "@/components/ui";
import { MobileNav } from "@/components/navigation/mobile-nav";

const LearningModulesPage: React.FC = () => {
  const [, setLocation] = useLocation();
  const { data: allModulesData, isLoading } = useQuery({
    queryKey: ['/api/learning/all-modules'],
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [difficulty, setDifficulty] = useState("all");
  const [category, setCategory] = useState("all");

  const modules = allModulesData?.modules || [];

  const filteredModules = modules.filter(module => {
    const matchesSearch = module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        module.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = difficulty === "all" || module.difficulty.toLowerCase() === difficulty.toLowerCase();
    // This is a placeholder for category filtering
    return matchesSearch && matchesDifficulty;
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Learning Modules</h1>
        <p className="text-lg text-muted-foreground">
          Explore our comprehensive financial literacy modules designed to help you
          master personal finance and wealth-building strategies.
        </p>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <div>
          <Input
            placeholder="Search modules..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-dark-800 border-dark-600"
          />
        </div>

        <div>
          <Select value={difficulty} onValueChange={setDifficulty}>
            <SelectTrigger className="bg-dark-800 border-dark-600">
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
            <SelectTrigger className="bg-dark-800 border-dark-600">
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

      <Tabs defaultValue="all" className="mb-8">
        <TabsList className="bg-dark-800">
          <TabsTrigger value="all">All Modules</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
      </Tabs>

      <main>
        <div className="grid gap-8">
          <section>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                <div className="col-span-3 text-center py-12">Loading modules...</div>
              ) : filteredModules.length === 0 ? (
                <div className="col-span-3 text-center py-12">
                  No modules found matching your criteria.
                </div>
              ) : (
                <>
                  {filteredModules.map((module) => (
                    <Card 
                      key={module.id}
                      className={`bg-dark-800 border-dark-600 overflow-hidden group hover:shadow-${module.accentColor} transition-shadow duration-300`}
                    >
                      <div className="h-32 bg-dark-700 relative overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <i className={`${module.icon} text-5xl text-${module.accentColor} opacity-20`}></i>
                        </div>
                      </div>

                      <CardFooter className="flex justify-between items-center mt-4">
                        <Button
                          className={`px-4 py-2 rounded-md transition-colors ${
                          module.status === 'locked' 
                              ? 'bg-dark-700 hover:bg-dark-600 text-white' 
                              : `bg-${module.accentColor} bg-opacity-20 hover:bg-opacity-30 text-${module.accentColor}`
                          }`}
                          disabled={module.status === 'locked'}
                          variant={module.status === 'locked' ? 'secondary' : 'outline'}
                          onClick={() => {
                            if (module.status !== 'locked') {
                              setLocation(`/learning-modules/${module.id}`);
                            }
                          }}
                        >
                          {module.status === 'locked' ? 'Unlock' : module.status === 'completed' ? 'Review' : 'Continue'}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </>
              )}
            </div>
          </section>
        </div>
      </main>

      <MobileNav />
    </div>
  );
};

export default LearningModulesPage;
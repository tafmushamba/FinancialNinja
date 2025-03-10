import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import Sidebar from '@/components/layout/sidebar';
import MobileNav from '@/components/layout/mobile-nav';
import Header from '@/components/layout/header';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import TerminalText from '@/components/ui/terminal-text';
import { formatTimeRemaining } from '@/lib/utils';

const LearningModules: React.FC = () => {
  const [, setLocation] = useLocation();
  const { data: allModulesData, isLoading } = useQuery({
    queryKey: ['/api/learning/all-modules'],
  });

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
        <Header title="Learning Modules" />
        
        <div className="p-4 md:p-6">
          <section className="mb-8 animate-fadeIn">
            <h1 className="text-2xl font-mono font-bold mb-6">
              <TerminalText>Financial Learning Modules</TerminalText>
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                <div className="col-span-3 text-center py-8">Loading modules...</div>
              ) : (
                <>
                  {allModulesData?.modules?.map((module: any) => (
                    <Card 
                      key={module.id}
                      className={`bg-dark-800 border-dark-600 overflow-hidden group hover:shadow-${module.accentColor} transition-shadow duration-300`}
                    >
                      <div className="h-40 bg-dark-700 relative overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <i className={`${module.icon} text-6xl text-${module.accentColor} opacity-20`}></i>
                        </div>
                        <div className={`absolute top-2 right-2 bg-dark-800 px-2 py-1 rounded text-xs ${module.status === 'locked' ? 'text-gray-400' : `text-${module.accentColor}`}`}>
                          {module.status === 'locked' ? (
                            <><i className="fas fa-lock mr-1"></i> Locked</>
                          ) : module.status === 'completed' ? (
                            <><i className="fas fa-check-circle mr-1"></i> Completed</>
                          ) : (
                            <><i className="fas fa-clock mr-1"></i> {formatTimeRemaining(module.timeRemaining)}</>
                          )}
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <h4 className="font-mono font-bold">{module.title}</h4>
                          <span className={`bg-${module.accentColor} bg-opacity-20 text-${module.accentColor} text-xs px-2 py-1 rounded`}>
                            {module.status === 'locked' ? 'Locked' : module.status === 'completed' ? 'Completed' : 'In Progress'}
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm mt-2">{module.description}</p>
                        <div className="mt-3">
                          <div className="w-full bg-dark-600 rounded-full h-1.5">
                            <div 
                              className={`bg-${module.accentColor} h-1.5 rounded-full`} 
                              style={{ width: `${module.progress}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-400 mt-1">
                            {module.lessonsCompleted}/{module.totalLessons} lessons completed
                          </p>
                        </div>
                        
                        <div className="mt-4 space-y-3">
                          <div className="flex justify-between text-sm text-gray-400">
                            <span><i className="fas fa-clock mr-1"></i> {module.duration}</span>
                            <span><i className="fas fa-graduation-cap mr-1"></i> {module.difficulty}</span>
                          </div>
                          
                          {module.status !== 'locked' && (
                            <div className="flex items-center text-xs text-gray-400">
                              <span className="mr-2">Topics:</span>
                              <div className="flex flex-wrap gap-1">
                                {module.topics.map((topic: string, index: number) => (
                                  <span key={index} className="bg-dark-700 px-2 py-1 rounded">{topic}</span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 pt-0">
                        <Button 
                          className={`w-full ${
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

export default LearningModules;
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

export default function LearningModulesPage() {
  const { data, isLoading } = useQuery({ queryKey: ["modules"], queryFn: fetchModules });
  const [searchTerm, setSearchTerm] = useState("");
  const [difficulty, setDifficulty] = useState("all");
  const [category, setCategory] = useState("all");
  
  const modules = data?.modules || [];
  
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
          <Tabs defaultValue="grid" className="w-full">
            <TabsList className="bg-dark-800 border-dark-600">
              <TabsTrigger value="grid">
                <i className="fas fa-th-large mr-2"></i> Grid View
              </TabsTrigger>
              <TabsTrigger value="list">
                <i className="fas fa-list mr-2"></i> List View
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-neon-green mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading modules...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModules.length > 0 ? (
            filteredModules.map(module => (
              <ModuleCard
                key={module.id}
                id={module.id}
                title={module.title}
                description={module.description}
                icon={module.icon}
                accentColor={module.accentColor}
                difficulty={module.difficulty}
                duration={module.duration}
                topics={module.topics}
              />
            ))
          ) : (
            <div className="col-span-3 text-center py-12">
              <p className="text-muted-foreground">No modules found. Try adjusting your search.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

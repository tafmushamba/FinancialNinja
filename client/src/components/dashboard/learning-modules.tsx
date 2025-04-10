import React, { useState } from 'react';
import { Link } from 'wouter';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { fetchModules, type Module } from '@/lib/api';

// Extend the Module interface to include category and image
interface ExtendedModule extends Module {
  category?: string;
  progress: number;
  image?: string;
}

const LearningModules: React.FC = () => {
  const [filter, setFilter] = useState('All');
  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/learning/modules'],
    queryFn: fetchModules
  });

  const modules = (data?.modules || []).map(module => ({
    ...module,
    category: module.topics?.[0] || 'General',  // Use the first topic as category if not defined
    progress: module.progress || 0  // Ensure progress is always defined
  })) as ExtendedModule[];
  const categories = ['All', 'Basics', 'Savings', 'Investing', 'Credit', 'Taxes', 'Debt'];

  const filteredModules = filter === 'All' 
    ? modules 
    : modules.filter(module => module.category === filter);

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="h-48" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Failed to load modules. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold font-mono">Learning Modules</h2>
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <Button
              key={category}
              variant={filter === category ? "default" : "outline"}
              onClick={() => setFilter(category)}
              className="text-sm"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModules.map(module => (
          <Link key={module.id} href={`/learning-modules/${module.id}`}>
            <Card className="overflow-hidden hover:border-neon-green/40 hover:shadow-lg hover:shadow-neon-green/20 transition-all duration-300 cursor-pointer group transform hover:scale-[1.02]">
              <div 
                className="h-48 bg-cover bg-center relative overflow-hidden"
                style={{
                  backgroundImage: module.image ? `url(${module.image})` : undefined,
                  backgroundColor: !module.image && module.accentColor ? `var(--${module.accentColor})` : 'var(--primary)'
                }}
              >
                <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-all duration-300 backdrop-blur-[1px] group-hover:backdrop-blur-none">
                  <div className="absolute top-4 left-4 flex items-center space-x-2">
                    <Badge variant="outline" className="bg-black/50 backdrop-blur-sm border-none group-hover:bg-neon-green/20 group-hover:text-neon-green transition-all duration-300">
                      {module.category}
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 left-4 text-4xl text-white group-hover:text-neon-green group-hover:scale-110 transform transition-all duration-300">
                    <i className={module.icon || 'fas fa-book'}></i>
                  </div>
                </div>
              </div>

              <div className="p-4 relative">
                <h3 className="font-bold mb-2 group-hover:text-neon-green transition-colors duration-300">
                  {module.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {module.description}
                </p>

                {module.progress > 0 ? (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-neon-green">{module.progress}% Complete</span>
                    </div>
                    <Progress value={module.progress} className="h-1" />
                  </div>
                ) : (
                  <Button variant="outline" className="w-full group-hover:border-neon-green/40 group-hover:bg-neon-green/10 group-hover:text-neon-green transition-all duration-300">
                    Start Learning
                    <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">→</span>
                  </Button>
                )}
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default LearningModules;
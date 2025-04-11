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

  const modules = (data?.modules || []).map(module => {
    // Normalize category names to match our filter categories
    let normalizedCategory = 'Basics'; // Default
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
      // Make sure category exactly matches one of our filter buttons
      category: normalizedCategory,
      progress: module.progress || 0  // Ensure progress is always defined
    };
  }) as ExtendedModule[];
  
  // Log module categories and topics for debugging
  console.log('Modules with categories and topics:', modules.map(m => ({ 
    title: m.title, 
    category: m.category, 
    topics: m.topics 
  })));
  
  const categories = ['All', 'Basics', 'Savings', 'Investing', 'Credit', 'Taxes', 'Debt'];

  const filteredModules = filter === 'All' 
    ? modules 
    : modules.filter(module => {
      // Case-insensitive comparison to make filtering more robust
      // Check both category and topics array for matches
      // Use 'includes' for partial matches rather than exact equality
      const filterLower = filter.toLowerCase();
      const categoryMatch = module.category?.toLowerCase().includes(filterLower) || false;
      const topicMatch = module.topics?.some(topic => topic.toLowerCase().includes(filterLower)) || false;
      console.log(`Filtering - Module: ${module.title}, Category: ${module.category}, Topics: ${JSON.stringify(module.topics)}, Filter: ${filter}, Category Match: ${categoryMatch}, Topic Match: ${topicMatch}`);
      return categoryMatch || topicMatch;
    });

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

  if (filter !== 'All' && filteredModules.length === 0) {
    return (
      <div className="animate-fadeIn">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold font-mono">Learning Modules</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Button
                key={category}
                variant={filter === category ? "default" : "outline"}
                onClick={(e) => {
                  e.preventDefault();
                  console.log(`Clicked filter: ${category}`);
                  setFilter(category);
                  console.log(`Filter set to: ${category}`);
                }}
                className={`text-sm cursor-pointer z-10 rounded-full px-4 py-1 transition-all duration-300 ${filter === category ? 'bg-neon-green text-black hover:bg-neon-green/90' : 'border-neon-green/30 text-neon-green hover:bg-neon-green/10'}`}
                style={{ pointerEvents: 'auto' }}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
        <div className="text-center py-8 border border-neon-green/30 rounded-lg bg-dark-800">
          <p className="text-white/70">No modules found for the selected filter: <strong>{filter}</strong></p>
          <p className="text-white/50 mt-2">Try selecting a different filter or view All modules.</p>
          <Button 
            variant="outline" 
            onClick={(e) => {
              e.preventDefault();
              setFilter('All');
              console.log('Reset filter to All');
            }}
            className="mt-4 text-neon-green border-neon-green/30 hover:bg-neon-green/10"
          >
            View All Modules
          </Button>
        </div>
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
              onClick={(e) => {
                e.preventDefault();
                console.log(`Clicked filter: ${category}`);
                setFilter(category);
                console.log(`Filter set to: ${category}`);
              }}
              className={`text-sm cursor-pointer z-10 rounded-full px-4 py-1 transition-all duration-300 ${filter === category ? 'bg-neon-green text-black hover:bg-neon-green/90' : 'border-neon-green/30 text-neon-green hover:bg-neon-green/10'}`}
              style={{ pointerEvents: 'auto' }}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModules.map(module => (
          <Link key={module.id} href={`/learning-modules/${module.id}`}>
            {/* Add slight shadow, lift on hover, improve border transition */}
            <Card className="overflow-hidden border border-dark-600 hover:border-neon-green/50 shadow-md hover:shadow-lg hover:shadow-neon-green/20 transition-all duration-300 cursor-pointer group transform hover:-translate-y-1 hover:scale-[1.03]">
              <div 
                className="h-48 bg-cover bg-center relative overflow-hidden"
                style={{
                  backgroundImage: module.image ? `linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.6)), url(${module.image})` : undefined, // Added gradient overlay
                  backgroundColor: !module.image && module.accentColor ? `var(--${module.accentColor})` : 'var(--primary)',
                  backgroundBlendMode: module.image ? 'multiply' : 'normal' // Blend gradient with image
                }}
              >
                {/* Add gradient background if no image for better contrast */}
                {!module.image && (
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"></div>
                )}
                <div className="absolute inset-0 flex flex-col justify-between p-4"> {/* Adjusted padding */} 
                  <div className="flex items-start justify-between"> {/* Top content container */}
                    <Badge variant="secondary" className="bg-black/60 backdrop-blur-sm border-none text-xs text-gray-300 group-hover:bg-neon-green/80 group-hover:text-black font-semibold transition-all duration-300"> {/* Improved badge styling */}
                      {module.category}
                    </Badge>
                    <div className="text-3xl text-white/80 group-hover:text-neon-green group-hover:scale-110 transform transition-all duration-300 opacity-70 group-hover:opacity-100"> {/* Moved icon to top right, adjusted styling */}
                      <i className={module.icon || 'fas fa-book'}></i>
                    </div>
                  </div>
                  {/* Removed icon from bottom left */}
                </div>
              </div>

              <div className="p-4 bg-dark-700"> {/* Ensure consistent background */} 
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
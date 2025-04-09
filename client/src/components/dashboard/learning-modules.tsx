import React, { useState } from 'react';
import { Link } from 'wouter';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const modules = [
  {
    id: 'budgeting',
    title: 'UK Budgeting Basics',
    icon: '💷',
    image: '/images/budget.jpg',
    description: 'Learn how to create and manage a budget tailored to UK living costs and financial practices.',
    progress: 65,
    category: 'Basics'
  },
  {
    id: 'savings',
    title: 'ISAs & Premium Bonds',
    icon: '🏦',
    image: '/images/investment.jpg',
    description: 'Understand UK-specific savings products like ISAs and Premium Bonds and how to use them effectively.',
    progress: 30,
    category: 'Savings'
  },
  {
    id: 'investing',
    title: 'UK Investment Options',
    icon: '📈',
    image: '/images/investment.jpg',
    description: 'Explore investment opportunities available in the UK market, from stocks to property.',
    progress: 0,
    category: 'Investing'
  },
  {
    id: 'credit',
    title: 'Understanding UK Credit',
    icon: '💳',
    image: '/images/credit.jpg',
    description: 'Learn about UK credit scores, borrowing responsibly, and managing credit cards.',
    progress: 0,
    category: 'Credit'
  },
  {
    id: 'taxes',
    title: 'UK Tax System',
    icon: '📝',
    image: '/images/tax.jpg',
    description: 'Introduction to the UK tax system including income tax, National Insurance, Council Tax, and VAT.',
    progress: 0,
    category: 'Taxes'
  },
  {
    id: 'debt',
    title: 'Debt Management',
    icon: '🔄',
    image: '/images/realestate.jpg',
    description: 'How to manage and repay debts, avoid excessive borrowing, and understand UK-specific debt solutions.',
    progress: 0,
    category: 'Debt'
  }
];

const LearningModules: React.FC = () => {
  const [filter, setFilter] = useState('All');
  const categories = ['All', 'Basics', 'Savings', 'Investing', 'Credit', 'Taxes', 'Debt'];

  const filteredModules = filter === 'All' 
    ? modules 
    : modules.filter(module => module.category === filter);

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
            <Card className="overflow-hidden hover:border-neon-green/40 transition-all duration-300 cursor-pointer group">
              <div 
                className="h-48 bg-cover bg-center relative"
                style={{ backgroundImage: `url(${module.image})` }}
              >
                <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-all duration-300">
                  <div className="absolute top-4 left-4 flex items-center space-x-2">
                    <Badge variant="outline" className="bg-black/50 backdrop-blur-sm border-none">
                      {module.category}
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 left-4 text-4xl">
                    {module.icon}
                  </div>
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-bold mb-2 group-hover:text-neon-green transition-colors">
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
                  <Button variant="outline" className="w-full group-hover:border-neon-green/40">
                    Start Learning
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
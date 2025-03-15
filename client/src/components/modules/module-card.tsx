import React from "react";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface ModuleCardProps {
  id: number;
  title: string;
  description: string;
  icon: string;
  accentColor: string;
  difficulty: string;
  duration: string;
  topics: string[];
  progress?: number;
}

const MODULE_IMAGES: Record<number, string> = {
  1: "/images/investment.jpg",
  2: "/images/budget.jpg",
  3: "/images/retirement.jpg",
  4: "/images/retirement.jpg",
  5: "/images/credit.jpg",
  6: "/images/tax.jpg",
  7: "/images/realestate.jpg",
};

export function ModuleCard({
  id,
  title,
  description,
  icon,
  accentColor,
  difficulty,
  duration,
  topics,
  progress = 0,
}: ModuleCardProps) {
  const bgImage = MODULE_IMAGES[id] || "/images/investment.jpg";
  
  return (
    <Link
      to={`/learning-modules/${id}`}
      className={`module-card block rounded-lg p-6 h-full glow-border card-highlight glass-card`}
    >
      <div 
        className="absolute inset-0 rounded-lg opacity-40 z-0" 
        style={{ 
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(1px)'
        }}
      ></div>
      
      <div className="module-card-content flex flex-col h-full relative z-10">
        <div className="flex items-center mb-2">
          <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: `${accentColor}20` }}>
            <i className={`${icon} text-xl`} style={{ color: accentColor }}></i>
          </div>
          <h3 className="text-xl font-bold text-white">{title}</h3>
        </div>
        
        <p className="text-white/80 mb-4 text-sm">{description}</p>
        
        <div className="mt-auto">
          <div className="flex flex-wrap gap-2 mb-3">
            {topics.slice(0, 2).map((topic, index) => (
              <Badge key={index} variant="outline" className="bg-dark-700/50 backdrop-blur-sm text-white border-none">
                {topic}
              </Badge>
            ))}
            {topics.length > 2 && (
              <Badge variant="outline" className="bg-dark-700/50 backdrop-blur-sm text-white border-none">
                +{topics.length - 2} more
              </Badge>
            )}
          </div>
          
          <div className="flex justify-between text-xs text-white/70 mb-1">
            <span>{difficulty}</span>
            <span>{duration}</span>
          </div>
          
          {progress > 0 && (
            <div className="flex items-center gap-2">
              <Progress value={progress} className="h-1.5 overflow-hidden">
                <div 
                  className="h-full bg-neon-green" 
                  style={{ 
                    width: `${progress}%`,
                    boxShadow: '0 0 8px rgba(159, 239, 0, 0.7)'
                  }}>
                </div>
              </Progress>
              <span className="text-xs text-white/70">{progress}%</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

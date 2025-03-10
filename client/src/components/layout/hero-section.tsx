
import React from "react";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaAction: () => void;
  image?: string;
}

export function HeroSection({ 
  title, 
  subtitle, 
  ctaLabel, 
  ctaAction,
  image = "/images/hero.jpg" 
}: HeroSectionProps) {
  return (
    <div 
      className="hero-section w-full py-14 md:py-24 px-4"
      style={{ backgroundImage: `url(${image})` }}
    >
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
          {title}
        </h1>
        <p className="text-lg md:text-xl text-white/80 mb-8 max-w-xl mx-auto">
          {subtitle}
        </p>
        <Button 
          onClick={ctaAction} 
          size="lg" 
          className="bg-neon-green hover:bg-neon-green/90 text-dark font-semibold"
        >
          {ctaLabel}
        </Button>
      </div>
    </div>
  );
}

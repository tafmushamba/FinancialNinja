import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number; // Controls the tilt intensity (1-10)
  glowColor?: string; // CSS color value
  glowIntensity?: number; // 0-100
  perspective?: number; // Perspective value in pixels
  disabled?: boolean; // Disable tilt effect
  resetOnLeave?: boolean; // Reset tilt when mouse leaves
}

export function TiltCard({
  children,
  className,
  intensity = 5,
  glowColor = 'rgba(159, 239, 0, 0.3)',
  glowIntensity = 30,
  perspective = 1000,
  disabled = false,
  resetOnLeave = true,
}: TiltCardProps) {
  const [tiltStyle, setTiltStyle] = useState<React.CSSProperties>({});
  const [glowStyle, setGlowStyle] = useState<React.CSSProperties>({});
  const cardRef = useRef<HTMLDivElement>(null);
  const normalizedIntensity = Math.min(Math.max(intensity, 1), 10) * 0.5;
  
  // For devices that support hover - enable 3D effect
  const [supportsHover, setSupportsHover] = useState(true);
  
  useEffect(() => {
    // Check if device supports hover
    const hasHover = window.matchMedia('(hover: hover)').matches;
    setSupportsHover(hasHover);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || !supportsHover) return;
    
    const card = cardRef.current;
    if (!card) return;
    
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate tilt amounts based on mouse position and intensity
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const tiltX = ((y - centerY) / centerY) * normalizedIntensity * -1;
    const tiltY = ((x - centerX) / centerX) * normalizedIntensity;
    
    // Update the tilt style
    setTiltStyle({
      transform: `perspective(${perspective}px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`,
      transition: 'transform 0.1s ease'
    });
    
    // Update glow effect based on mouse position
    const percentX = (x / rect.width) * 100;
    const percentY = (y / rect.height) * 100;
    setGlowStyle({
      background: `radial-gradient(circle at ${percentX}% ${percentY}%, ${glowColor} 0%, transparent ${glowIntensity}%)`,
      opacity: 1
    });
  };

  const handleMouseLeave = () => {
    if (resetOnLeave) {
      setTiltStyle({
        transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
        transition: 'transform 0.5s ease'
      });
      setGlowStyle({
        opacity: 0,
        transition: 'opacity 0.5s ease'
      });
    }
  };

  return (
    <div 
      ref={cardRef}
      className={cn(
        'relative overflow-hidden rounded-lg',
        'shadow-lg transition-all duration-300',
        'transform-gpu', // Hardware acceleration for smoother transitions
        'will-change-transform',
        className
      )}
      style={tiltStyle}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Dynamic glow effect layer */}
      {supportsHover && !disabled && (
        <div 
          className="absolute inset-0 pointer-events-none z-0 transition-opacity duration-300"
          style={glowStyle}
        />
      )}
      
      {/* Content container */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

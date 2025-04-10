import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { 
  Home, 
  GraduationCap, 
  WalletCards, 
  Gamepad2, 
  Trophy, 
  Bot, 
  Settings,
  Code,
  BrainCircuit,
  Gift,
  Calculator,
  LifeBuoy,
  MessageCircle,
  Palette
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface SidebarProps {
  collapsed?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed = false }) => {
  const [location] = useLocation();
  const { user } = useAuth();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Fluid animation in canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        canvas.width = rect.width;
        canvas.height = rect.height;
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle system for fluid effect
    const particles: Particle[] = [];
    const particleCount = 50;
    
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      color: string;
      
      constructor() {
        this.x = Math.random() * (canvas?.width || 300);
        this.y = Math.random() * (canvas?.height || 300);
        this.size = Math.random() * 3 + 0.5;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.color = '#9FEF00';
      }
      
      update() {
        // Move particles
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Edge detection with bounce
        if (this.x > (canvas?.width || 300) || this.x < 0) {
          this.speedX *= -1;
        }
        
        if (this.y > (canvas?.height || 300) || this.y < 0) {
          this.speedY *= -1;
        }
        
        // Slowly change direction
        this.speedX += (Math.random() - 0.5) * 0.01;
        this.speedY += (Math.random() - 0.5) * 0.01;
        
        // Limit speed
        this.speedX = Math.max(-0.7, Math.min(0.7, this.speedX));
        this.speedY = Math.max(-0.7, Math.min(0.7, this.speedY));
      }
      
      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.fill();
      }
    }
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
    
    // Connection lines between particles
    function drawConnections() {
      if (!ctx) return;
      ctx.lineWidth = 0.3;
      ctx.strokeStyle = '#9FEF00';
      
      for (let i = 0; i < particles.length; i++) {
        for (let j = i; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 80) {
            ctx.globalAlpha = 0.2 * (1 - distance / 80);
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    }
    
    // Animation loop
    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      for (const particle of particles) {
        particle.update();
        particle.draw();
      }
      
      // Draw connections
      drawConnections();
      
      // Add glow effect
      ctx.globalCompositeOperation = 'screen';
      ctx.filter = 'blur(4px)';
      for (const particle of particles) {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
        ctx.fillStyle = '#9FEF00';
        ctx.globalAlpha = particle.opacity * 0.3;
        ctx.fill();
      }
      ctx.filter = 'none';
      ctx.globalCompositeOperation = 'source-over';
      
      requestAnimationFrame(animate);
    }
    
    animate();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: GraduationCap, label: 'Learning Modules', path: '/learning-modules' },
    { icon: WalletCards, label: 'Finance Tracker', path: '/finance-tracker' },
    { icon: Calculator, label: 'Financial Calculators', path: '/financial-calculators' },
    { icon: Gamepad2, label: 'Financial Game', path: '/financial-game' },
    { icon: BrainCircuit, label: 'Life Simulation', path: '/life-simulation' },
    { icon: MessageCircle, label: 'Community Forum', path: '/forum' },
    { icon: Trophy, label: 'Achievements', path: '/achievements' },
    { icon: Gift, label: 'Rewards', path: '/rewards' },
    { icon: Bot, label: 'AI Assistant', path: '/ai-assistant' },
    { icon: Palette, label: 'Design System', path: '/design-system' },
    { icon: Settings, label: 'Settings', path: '/settings' }
  ];

  const getUserInitials = () => {
    if (!user) return '?';
    
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`;
    } else if (user.username) {
      return user.username[0].toUpperCase();
    }
    
    return '?';
  };

  // Staggered animation for sidebar items
  const sidebar = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      }
    }
  };

  const navItem = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <aside className="w-full h-full bg-black/90 overflow-hidden z-30 backdrop-blur-sm border-r border-[#9FEF00]/20 relative">
      {/* Fluid animated background using canvas */}
      <div className="absolute inset-0 z-0">
        <canvas 
          ref={canvasRef} 
          className="w-full h-full"
        />
        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/50 to-black/80 z-10"></div>
      </div>

      <div className="h-full flex flex-col relative z-20">
        {/* Logo */}
        <Link href="/" className="p-4 flex items-center justify-center lg:justify-start border-b border-[#9FEF00]/20 hover:bg-[#9FEF00]/5 transition-colors duration-200 cursor-pointer">
          <div className="w-10 h-10 flex items-center justify-center">
            <img src="/images/mascot.svg" alt="Money Mind Mascot" className="h-10 w-10" />
          </div>
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className={cn("ml-3 text-xl font-bold text-white", collapsed ? "hidden" : "hidden lg:block")}
          >
            Money<span className="text-[#9FEF00]">Mind</span>
          </motion.h1>
        </Link>
        
        {/* Navigation */}
        <motion.nav 
          className="flex-1 py-4 overflow-y-auto px-2"
          variants={sidebar}
          initial="hidden"
          animate="show"
        >
          <ul className="space-y-1">
            {navItems.map((item, index) => {
              const isActive = location === item.path;
              const Icon = item.icon;
              
              return (
                <motion.li 
                  key={item.path}
                  variants={navItem}
                  custom={index}
                >
                  <Link 
                    href={item.path}
                    className={cn(
                      "flex items-center py-2 px-3 rounded-lg transition-all duration-200 relative group overflow-hidden",
                      isActive
                        ? "bg-[#9FEF00]/10 text-[#9FEF00] font-medium"
                        : "text-white/80 hover:bg-[#9FEF00]/5 hover:text-[#9FEF00]"
                    )}
                  >
                    {/* Background glow effect on hover */}
                    <div className={cn(
                      "absolute inset-0 bg-gradient-to-r from-[#9FEF00]/0 via-[#9FEF00]/5 to-[#9FEF00]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                      isActive ? "opacity-50" : ""
                    )} />
                    
                    {/* Icon */}
                    <Icon className={cn(
                      "w-5 h-5 relative z-10",
                      isActive ? "text-[#9FEF00]" : "text-white/70 group-hover:text-[#9FEF00]/70"
                    )} />
                    
                    {/* Label */}
                    <span className={cn(
                      "ml-3 text-sm relative z-10",
                      collapsed ? "hidden" : "hidden lg:block",
                      isActive ? "text-[#9FEF00]" : "text-white/80 group-hover:text-white"
                    )}>
                      {item.label}
                    </span>
                    
                    {/* Active indicator */}
                    {isActive && !collapsed && (
                      <div className="ml-auto w-1 h-4 bg-[#9FEF00] rounded-full shadow-[0_0_8px_rgba(159,239,0,0.8)] relative z-10" />
                    )}
                    
                    {/* Terminal-style cursor indicator on active item */}
                    {isActive && (
                      <div className="absolute left-0 inset-y-0 w-1 bg-[#9FEF00] rounded-r-sm shadow-[0_0_10px_rgba(159,239,0,0.5)]" />
                    )}
                  </Link>
                </motion.li>
              );
            })}
          </ul>
        </motion.nav>
        
        {/* User Profile */}
        <div className="p-4 border-t border-[#9FEF00]/20 bg-black/50 backdrop-blur-sm relative z-10">
          <div className="flex items-center">
            <Avatar className="h-8 w-8 border border-[#9FEF00]/30 shadow-[0_0_10px_rgba(159,239,0,0.2)]">
              {user?.profilePicture && (
                <AvatarImage src={user.profilePicture} alt={user.username || 'User profile'} />
              )}
              <AvatarFallback className="bg-[#9FEF00]/10 text-[#9FEF00] text-sm font-medium">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            <div className={cn("ml-3", collapsed ? "hidden" : "hidden lg:block")}>
              <p className="text-sm font-medium text-white">
                {user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username : 'Guest'}
              </p>
              <p className="text-xs text-[#9FEF00]/70">
                {user?.userLevel || 'New User'} <span className="text-white/50">|</span> <Code className="inline h-3 w-3 mr-1" /> <span className="tracking-wider">01</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

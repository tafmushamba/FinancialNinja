import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedBackgroundProps {
  className?: string;
  style?: React.CSSProperties;
  type?: 'gradient' | 'particles' | 'waves' | 'matrix' | 'cosmic';
}

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ 
  className = '', 
  style = {}, 
  type = 'gradient'
}) => {
  
  const renderBackground = () => {
    switch(type) {
      case 'particles':
        return (
          <div className="absolute inset-0 overflow-hidden z-0">
            {[...Array(20)].map((_, i) => (
              <motion.div 
                key={i}
                className="absolute bg-neon-green/30 rounded-full blur-md"
                style={{ 
                  width: `${Math.random() * 20 + 10}px`, 
                  height: `${Math.random() * 20 + 10}px`, 
                  left: `${Math.random() * 100}%`, 
                  top: `${Math.random() * 100}%` 
                }}
                animate={{ 
                  x: (Math.random() * 200) - 100, 
                  y: (Math.random() * 200) - 100,
                  opacity: [0.3, 0.8, 0.3]
                }}
                transition={{ 
                  duration: Math.random() * 30 + 20, 
                  repeat: Infinity, 
                  ease: "linear" 
                }}
              />
            ))}
          </div>
        );
      
      case 'waves':
        return (
          <div className="absolute inset-0 overflow-hidden z-0">
            <svg className="absolute bottom-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none">
              <motion.path 
                fill="rgba(159, 239, 0, 0.1)" 
                fillOpacity="1" 
                d="M0,192L48,176C96,160,192,128,288,122.7C384,117,480,139,576,160C672,181,768,203,864,186.7C960,171,1056,117,1152,106.7C1248,96,1344,128,1392,144L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                animate={{ 
                  d: [
                    "M0,192L48,176C96,160,192,128,288,122.7C384,117,480,139,576,160C672,181,768,203,864,186.7C960,171,1056,117,1152,106.7C1248,96,1344,128,1392,144L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                    "M0,160L48,186.7C96,213,192,267,288,272C384,277,480,235,576,208C672,181,768,171,864,176C960,181,1056,203,1152,186.7C1248,171,1344,117,1392,90.7L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                    "M0,192L48,176C96,160,192,128,288,122.7C384,117,480,139,576,160C672,181,768,203,864,186.7C960,171,1056,117,1152,106.7C1248,96,1344,128,1392,144L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                  ]
                }}
                transition={{ 
                  duration: 15, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              />
            </svg>
          </div>
        );
      
      case 'matrix':
        return (
          <div className="absolute inset-0 overflow-hidden z-0 bg-dark-900">
            {[...Array(30)].map((_, i) => (
              <motion.div 
                key={i}
                className="absolute text-neon-green/50 font-mono text-xs"
                style={{ 
                  left: `${Math.random() * 100}%`, 
                  top: `${Math.random() * 100}%`,
                  transform: `rotate(${Math.random() * 360}deg)`
                }}
                animate={{ 
                  y: [0, Math.random() * 100 + 50, 0],
                  opacity: [0.2, 0.5, 0.2]
                }}
                transition={{ 
                  duration: Math.random() * 10 + 5, 
                  repeat: Infinity, 
                  ease: "linear",
                  delay: Math.random() * 5
                }}
              >
                {Math.random().toString(36).substring(2, 15)}
              </motion.div>
            ))}
          </div>
        );
      
      case 'cosmic':
        return (
          <div className="absolute inset-0 overflow-hidden z-0 bg-dark-900">
            {[...Array(5)].map((_, i) => (
              <motion.div 
                key={`nebula-${i}`}
                className="absolute rounded-full blur-xl opacity-30"
                style={{ 
                  width: `${Math.random() * 300 + 100}px`, 
                  height: `${Math.random() * 200 + 100}px`, 
                  left: `${Math.random() * 80 + 10}%`, 
                  top: `${Math.random() * 80 + 10}%`,
                  background: `radial-gradient(circle, ${['#9FEF00', '#0075FF', '#FF00AA'][Math.floor(Math.random() * 3)]} 0%, transparent 70%)`
                }}
                animate={{ 
                  x: (Math.random() * 100) - 50, 
                  y: (Math.random() * 100) - 50,
                  opacity: [0.1, 0.3, 0.1]
                }}
                transition={{ 
                  duration: Math.random() * 40 + 20, 
                  repeat: Infinity, 
                  ease: "easeInOut",
                  delay: Math.random() * 10
                }}
              />
            ))}
            {[...Array(50)].map((_, i) => (
              <motion.div 
                key={`star-${i}`}
                className="absolute bg-white rounded-full opacity-70"
                style={{ 
                  width: `${Math.random() * 2 + 1}px`, 
                  height: `${Math.random() * 2 + 1}px`, 
                  left: `${Math.random() * 100}%`, 
                  top: `${Math.random() * 100}%`
                }}
                animate={{ 
                  opacity: [0.3, 0.7, 0.3]
                }}
                transition={{ 
                  duration: Math.random() * 2 + 1, 
                  repeat: Infinity, 
                  ease: "easeInOut",
                  delay: Math.random() * 5
                }}
              />
            ))}
            {[...Array(3)].map((_, i) => (
              <motion.div 
                key={`shooting-star-${i}`}
                className="absolute bg-neon-green rounded-full opacity-0"
                style={{ 
                  width: '3px', 
                  height: '3px'
                }}
                initial={{ 
                  left: '0%', 
                  top: `${Math.random() * 30 + 10}%`,
                  opacity: 0
                }}
                animate={{ 
                  left: '100%',
                  top: `${Math.random() * 70 + 20}%`,
                  opacity: [0, 0.8, 0]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                  delay: Math.random() * 30 + 10
                }}
              />
            ))}
          </div>
        );
      
      case 'gradient':
      default:
        return (
          <motion.div 
            className="absolute inset-0 z-0"
            style={{ 
              background: 'linear-gradient(45deg, rgba(159, 239, 0, 0.1), rgba(0, 117, 255, 0.1), rgba(159, 239, 0, 0.1))',
              ...style
            }}
            animate={{ 
              background: [
                'linear-gradient(45deg, rgba(159, 239, 0, 0.1), rgba(0, 117, 255, 0.1), rgba(159, 239, 0, 0.1))',
                'linear-gradient(45deg, rgba(0, 117, 255, 0.1), rgba(159, 239, 0, 0.1), rgba(0, 117, 255, 0.1))',
                'linear-gradient(45deg, rgba(159, 239, 0, 0.1), rgba(0, 117, 255, 0.1), rgba(159, 239, 0, 0.1))'
              ]
            }}
            transition={{ 
              duration: 20, 
              repeat: Infinity, 
              ease: "linear" 
            }}
          />
        );
    }
  };
  
  return (
    <div className={`animated-background ${className}`} style={style}>
      {renderBackground()}
    </div>
  );
};

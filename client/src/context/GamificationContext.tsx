import React, { createContext, useContext, useState, ReactNode } from 'react';

interface GamificationContextType {
  points: number;
  addPoints: (amount: number) => void;
}

const defaultContext: GamificationContextType = {
  points: 0,
  addPoints: () => {},
};

const GamificationContext = createContext<GamificationContextType>(defaultContext);

export const useGamification = () => useContext(GamificationContext);

interface GamificationProviderProps {
  children: ReactNode;
}

export const GamificationProvider: React.FC<GamificationProviderProps> = ({ children }) => {
  const [points, setPoints] = useState(0);

  const addPoints = (amount: number) => {
    setPoints(prevPoints => prevPoints + amount);
  };

  return (
    <GamificationContext.Provider value={{ points, addPoints }}>
      {children}
    </GamificationContext.Provider>
  );
};

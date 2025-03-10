
// Simple location utility for managing navigation
import { useState, useEffect } from 'react';

export const useLocation = () => {
  const [location, setLocation] = useState(window.location.pathname);

  const navigate = (path: string) => {
    window.history.pushState(null, '', path);
    setLocation(path);
  };

  useEffect(() => {
    const handlePopState = () => {
      setLocation(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return [location, navigate] as const;
};

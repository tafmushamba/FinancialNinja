import { createContext, useContext, useEffect, useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";

// Define the type for our auth context
type AuthContextType = {
  isAuthenticated: boolean | null;
  user: any;
  loading: boolean;
  login: (userData: any) => void;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
};

// Default mock user for development
const mockUser = {
  id: 1,
  username: "taf_m",
  firstName: "taf",
  lastName: "Mushamba",
  email: "taf@example.com",
  userLevel: "Level 1 Investor",
  financialLiteracyScore: 72,
};

// Create a context with a default value
const AuthContext = createContext<AuthContextType | null>(null);

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Auth Provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [, navigate] = useLocation();

  const checkAuthStatus = async () => {
    try {
      // First check if we have a session cookie
      const response = await apiRequest({
        url: "/api/auth/me",
        method: "GET",
        on401: "returnNull",
      });
      
      if (response && response.user) {
        // Store user data in sessionStorage for persistence during navigation
        sessionStorage.setItem('authUser', JSON.stringify(response.user));
        setIsAuthenticated(true);
        setUser(response.user);
      } else {
        // Check if we have stored user data in sessionStorage
        const storedUser = sessionStorage.getItem('authUser');
        
        if (storedUser) {
          // Use the stored user data
          setIsAuthenticated(true);
          setUser(JSON.parse(storedUser));
        } else {
          // For development, provide a default mock user so the UI works properly
          // In production, this would be removed
          if (import.meta.env.DEV) {
            console.warn('Using mock user data for development');
            setIsAuthenticated(true);
            setUser(mockUser);
          } else {
            setIsAuthenticated(false);
            setUser(null);
          }
        }
      }
    } catch (error) {
      console.error("Auth check error:", error);
      // Check if we have stored user data in sessionStorage
      const storedUser = sessionStorage.getItem('authUser');
      
      if (storedUser) {
        // Use the stored user data even if the API call failed
        setIsAuthenticated(true);
        setUser(JSON.parse(storedUser));
      } else {
        // For development, provide a mock user on error
        if (import.meta.env.DEV) {
          console.warn('Using mock user data for development after error');
          setIsAuthenticated(true);
          setUser(mockUser);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const login = (userData: any) => {
    // Store user data in sessionStorage for persistence
    sessionStorage.setItem('authUser', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = async () => {
    try {
      await apiRequest({
        url: "/api/auth/logout",
        method: "POST",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear session storage on logout
      sessionStorage.removeItem('authUser');
      sessionStorage.removeItem('redirectAfterLogin');
      setIsAuthenticated(false);
      setUser(null);
      navigate("/login");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        login,
        logout,
        checkAuthStatus
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
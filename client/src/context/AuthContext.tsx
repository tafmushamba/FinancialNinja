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
      const response = await apiRequest({
        url: "/api/auth/me",
        method: "GET",
        on401: "returnNull",
      });
      
      if (response && response.user) {
        setIsAuthenticated(true);
        setUser(response.user);
      } else {
        // For development, provide a default mock user so the UI works properly
        // In production, this would be removed
        if (process.env.NODE_ENV === 'development') {
          console.warn('Using mock user data for development');
          setIsAuthenticated(true);
          setUser(mockUser);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      }
    } catch (error) {
      console.error("Auth check error:", error);
      // For development, provide a mock user on error
      if (process.env.NODE_ENV === 'development') {
        console.warn('Using mock user data for development after error');
        setIsAuthenticated(true);
        setUser(mockUser);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const login = (userData: any) => {
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
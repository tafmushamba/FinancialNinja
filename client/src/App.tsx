import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import MainLayout from "@/components/layout/main-layout";
import { createContext, useContext, useEffect, useState } from "react";
import { apiRequest } from "@/lib/queryClient";

import Dashboard from "@/pages/dashboard";
import LearningModules from "@/pages/learning-modules";
import ModuleDetail from "@/pages/module-detail";
import Lesson from "@/pages/lesson";
import Quiz from "@/pages/quiz";
import FinanceTracker from "@/pages/finance-tracker";
import Achievements from "@/pages/achievements";
import AiAssistant from "@/pages/ai-assistant";
import Settings from "@/pages/settings";
import NotFound from "@/pages/not-found";
import Login from "@/pages/login";
import Register from "@/pages/register";

// Define the type for our auth context
type AuthContextType = {
  isAuthenticated: boolean | null;
  user: any;
  loading: boolean;
  login: (userData: any) => void;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
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
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
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

// Auth component to protect routes
const ProtectedRoute = ({ component: Component, ...rest }: any) => {
  const { isAuthenticated, loading } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!loading && isAuthenticated === false) {
      navigate("/login");
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return isAuthenticated ? <Component {...rest} /> : null;
};

// Public route that redirects to dashboard if already authenticated
const AuthRoute = ({ component: Component, ...rest }: any) => {
  const { isAuthenticated, loading } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return !isAuthenticated ? <Component {...rest} /> : null;
};

function Router() {
  return (
    <Switch>
      <Route path="/login" component={() => <Login />} />
      <Route path="/register" component={() => <Register />} />
      
      <Route path="/">
        <MainLayout>
          <Switch>
            <Route path="/" component={() => <ProtectedRoute component={Dashboard} />} />
            <Route path="/learning-modules" component={() => <ProtectedRoute component={LearningModules} />} />
            <Route path="/learning-modules/:moduleId" component={(params) => <ProtectedRoute component={ModuleDetail} params={params} />} />
            <Route path="/lesson/:lessonId" component={(params) => <ProtectedRoute component={Lesson} params={params} />} />
            <Route path="/quiz/:id" component={(params) => <ProtectedRoute component={Quiz} params={params} />} />
            <Route path="/finance-tracker" component={() => <ProtectedRoute component={FinanceTracker} />} />
            <Route path="/achievements" component={() => <ProtectedRoute component={Achievements} />} />
            <Route path="/ai-assistant" component={() => <ProtectedRoute component={AiAssistant} />} />
            <Route path="/settings" component={() => <ProtectedRoute component={Settings} />} />
            <Route component={NotFound} />
          </Switch>
        </MainLayout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

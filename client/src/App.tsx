import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import MainLayout from "@/components/layout/main-layout";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "@/context/AuthContext";

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
import FinancialGame from "@/pages/financial-game";
import Rewards from "@/pages/rewards";
import FinancialCalculators from "@/pages/financial-calculators";
import LifeSimulation from "@/pages/life-simulation";
import FinancialScenarios from "@/pages/financial-scenarios";
import Forum from "@/pages/forum";
import ForumCategory from "@/pages/forum-category";
import ForumTopic from "@/pages/forum-topic";
import Certificates from "@/pages/certificates";
import HomePage from "@/pages/index";

// Custom Redirect component for navigation
const Redirect = ({ to }: { to: string }) => {
  const [, navigate] = useLocation();
  useEffect(() => {
    navigate(to);
  }, [to, navigate]);
  return null;
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

function Router() {
  const { isAuthenticated, loading } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (isAuthenticated === false && !loading) {
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/register') {
        navigate('/login');
      }
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      
      <Route path="/learning-modules">
        <MainLayout>
          <LearningModules />
        </MainLayout>
      </Route>
      
      <Route path="/learning-modules/:moduleId">
        <MainLayout>
          <ModuleDetail />
        </MainLayout>
      </Route>
      
      <Route path="/lesson/:lessonId">
        <MainLayout>
          <Lesson />
        </MainLayout>
      </Route>
      
      <Route path="/quiz/:id">
        <MainLayout>
          <Quiz />
        </MainLayout>
      </Route>
      
      <Route path="/finance-tracker">
        <MainLayout>
          <FinanceTracker />
        </MainLayout>
      </Route>
      
      <Route path="/achievements">
        <MainLayout>
          <Achievements />
        </MainLayout>
      </Route>
      
      <Route path="/rewards">
        <MainLayout>
          <Rewards />
        </MainLayout>
      </Route>
      
      <Route path="/ai-assistant">
        <MainLayout>
          <AiAssistant />
        </MainLayout>
      </Route>
      
      <Route path="/financial-game">
        <MainLayout>
          <FinancialGame />
        </MainLayout>
      </Route>
      
      <Route path="/financial-calculators">
        <MainLayout>
          <FinancialCalculators />
        </MainLayout>
      </Route>
      
      <Route path="/life-simulation">
        <MainLayout>
          <LifeSimulation />
        </MainLayout>
      </Route>
      
      <Route path="/financial-scenarios">
        <MainLayout>
          <FinancialScenarios />
        </MainLayout>
      </Route>
      
      <Route path="/forum">
        <MainLayout>
          <Forum />
        </MainLayout>
      </Route>
      
      <Route path="/forum/categories/:categoryId">
        <MainLayout>
          <ForumCategory />
        </MainLayout>
      </Route>
      
      <Route path="/forum/topics/:topicId">
        <MainLayout>
          <ForumTopic />
        </MainLayout>
      </Route>
      
      <Route path="/certificates">
        <MainLayout>
          <Certificates />
        </MainLayout>
      </Route>
      
      <Route path="/certificates/:verificationCode">
        <MainLayout>
          <Certificates />
        </MainLayout>
      </Route>
      
      <Route path="/settings">
        <MainLayout>
          <Settings />
        </MainLayout>
      </Route>
      
      <Route path="/dashboard">
        <MainLayout>
          <Dashboard />
        </MainLayout>
      </Route>

      <Route path="/">
        <MainLayout>
          <HomePage />
        </MainLayout>
      </Route>
      
      <Route>
        <MainLayout>
          <NotFound />
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

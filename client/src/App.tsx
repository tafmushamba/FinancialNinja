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

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      
      <Route path="/">
        {isAuthenticated ? (
          <MainLayout>
            <Route path="/" component={Dashboard} />
            <Route path="/learning-modules" component={LearningModules} />
            <Route path="/learning-modules/:moduleId" component={ModuleDetail} />
            <Route path="/lesson/:lessonId" component={Lesson} />
            <Route path="/quiz/:id" component={Quiz} />
            <Route path="/finance-tracker" component={FinanceTracker} />
            <Route path="/achievements" component={Achievements} />
            <Route path="/ai-assistant" component={AiAssistant} />
            <Route path="/settings" component={Settings} />
            <Route path="/:rest*" component={NotFound} />
          </MainLayout>
        ) : (
          <div className="flex justify-center items-center h-screen">
            <div className="text-center">
              <h1 className="text-2xl font-bold">Please log in</h1>
              <p className="mb-4">You need to be logged in to access this page</p>
              <button 
                onClick={() => navigate("/login")} 
                className="text-primary hover:underline"
              >
                Go to login
              </button>
            </div>
          </div>
        )}
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

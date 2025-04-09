import React from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { 
  ChevronRight, 
  BarChart, 
  PiggyBank, 
  TrendingUp, 
  Star, 
  ArrowRight, 
  Check, 
  Trophy, 
  Zap,
  Home,
  GraduationCap,
  WalletCards,
  Gamepad2,
  Bot,
  Settings,
  Calculator,
  MessageCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function HomePage() {
  const [location] = useLocation();
  
  // Navigation items for vertical nav
  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: Home },
    { path: "/learning-modules", label: "Learning Modules", icon: GraduationCap },
    { path: "/finance-tracker", label: "Finance Tracker", icon: WalletCards },
    { path: "/financial-game", label: "Financial Game", icon: Gamepad2 },
    { path: "/financial-calculators", label: "Calculators", icon: Calculator },
    { path: "/ai-assistant", label: "AI Assistant", icon: Bot },
    { path: "/forum", label: "Community", icon: MessageCircle },
    { path: "/settings", label: "Settings", icon: Settings },
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-white dark:from-slate-900 dark:via-slate-950 dark:to-black flex">      
      {/* Vertical Navigation */}
      <div className="hidden lg:block w-64 h-screen bg-black/90 border-r border-gray-800 fixed left-0 top-0 overflow-y-auto">
        <div className="p-4">
          <Link href="/">
            <div className="flex items-center space-x-2">
              <img src="/images/logo.svg" alt="MoneyMind Logo" className="h-8 w-8" />
              <h1 className="text-xl font-bold text-white">Money<span className="text-[#9FEF00]">Mind</span></h1>
            </div>
          </Link>
        </div>
        
        <nav className="mt-6 px-3">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = location === item.path;
              const Icon = item.icon;
              
              return (
                <li key={item.path}>
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
                      isActive ? "text-[#9FEF00]" : "text-white/80 group-hover:text-white"
                    )}>
                      {item.label}
                    </span>
                    
                    {/* Active indicator */}
                    {isActive && (
                      <div className="ml-auto w-1 h-4 bg-[#9FEF00] rounded-full shadow-[0_0_8px_rgba(159,239,0,0.8)] relative z-10" />
                    )}
                    
                    {/* Terminal-style cursor indicator on active item */}
                    {isActive && (
                      <div className="absolute left-0 inset-y-0 w-1 bg-[#9FEF00] rounded-r-sm shadow-[0_0_10px_rgba(159,239,0,0.5)]" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
      
      {/* Main Content with padding for the sidebar */}
      <div className="flex-1 lg:ml-64">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-16 md:py-24 px-4">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="space-y-6">
                <div className="inline-flex items-center bg-[#9FEF00]/10 dark:bg-[#9FEF00]/20 text-[#9FEF00] dark:text-[#9FEF00] rounded-full px-4 py-1 text-sm font-medium mb-4">
                  <Star className="w-4 h-4 mr-2 fill-current" />
                  <span>Start Your Financial Quest</span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white mb-4 leading-tight">
                  Master Your Money,
                  <br />
                  <span className="text-[#9FEF00] dark:text-[#9FEF00]">Shape Your Future</span>
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                  A gamified financial education platform designed for UK youth to learn, practice, and master personal finance in a fun, interactive way.
                </p>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <Link href="/register">
                    <Button size="lg" className="w-full sm:w-auto bg-[#9FEF00] hover:bg-[#8FDF00] text-black font-semibold">
                      Get Started
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Right Visual - Gamified Path Teaser */}
              <div className="relative flex justify-center items-center mt-10 md:mt-0">
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-6 w-full max-w-md">
                  <div className="flex items-center mb-4">
                    <img src="/images/mascot.svg" alt="Money Mind Mascot" className="h-16 w-16 mr-4" />
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Your Learning Path</h3>
                  </div>
                  <div className="space-y-4">
                    {/* Example Path Steps - More visual */}
                    <div className="flex items-center p-3 rounded-lg bg-blue-50 dark:bg-slate-700/50 transition hover:shadow-md">
                      <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full mr-3">
                        <BarChart className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">Budgeting Basics</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Track your spending</p>
                      </div>
                      <span className="ml-auto text-xs font-medium text-blue-600 dark:text-blue-400">Level 1</span>
                    </div>
                    <div className="flex items-center p-3 rounded-lg bg-purple-50 dark:bg-slate-700/50 transition hover:shadow-md opacity-70">
                      <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-full mr-3">
                        <PiggyBank className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">Smart Saving</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Build your future fund</p>
                      </div>
                      <span className="ml-auto text-xs font-medium text-gray-500 dark:text-gray-400">Locked</span>
                    </div>
                    <div className="flex items-center p-3 rounded-lg bg-green-50 dark:bg-slate-700/50 transition hover:shadow-md opacity-50">
                      <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full mr-3">
                        <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">Intro to Investing</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Grow your wealth</p>
                      </div>
                      <span className="ml-auto text-xs font-medium text-gray-500 dark:text-gray-400">Locked</span>
                    </div>
                  </div>
                  <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">Complete modules to unlock new levels!</p>
                </div>
              </div>
            </div>
          </div>
          {/* Optional decorative background elements */}
          <div className="absolute top-0 left-0 w-48 h-48 bg-blue-200 dark:bg-blue-800 rounded-full opacity-20 -translate-x-1/4 -translate-y-1/4 blur-2xl -z-10"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-200 dark:bg-purple-800 rounded-full opacity-20 translate-x-1/4 translate-y-1/4 blur-3xl -z-10"></div>
        </section>

        {/* Features Section - Modernized */}
        <section className="py-16 px-4 bg-gray-50 dark:bg-slate-900/50">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1: Interactive Lessons */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-slate-700 text-center transform transition duration-300 hover:scale-105 hover:shadow-xl">
                <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-[#9FEF00]/20 dark:bg-[#9FEF00]/30">
                  <svg className="w-8 h-8 text-[#9FEF00] dark:text-[#9FEF00]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Interactive Lessons</h3>
                <p className="text-gray-600 dark:text-gray-300">Engaging modules with quizzes and real-world UK scenarios.</p>
              </div>

              {/* Feature 2: Gamified Learning */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-slate-700 text-center transform transition duration-300 hover:scale-105 hover:shadow-xl">
                <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-[#9FEF00]/20 dark:bg-[#9FEF00]/30">
                  <svg className="w-8 h-8 text-[#9FEF00] dark:text-[#9FEF00]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path></svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Gamified Experience</h3>
                <p className="text-gray-600 dark:text-gray-300">Earn points, unlock achievements, and track your progress.</p>
              </div>

              {/* Feature 3: UK Focused Content */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-slate-700 text-center transform transition duration-300 hover:scale-105 hover:shadow-xl">
                <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-[#9FEF00]/20 dark:bg-[#9FEF00]/30">
                  <svg className="w-8 h-8 text-[#9FEF00] dark:text-[#9FEF00]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">UK-Specific Content</h3>
                <p className="text-gray-600 dark:text-gray-300">Learn about ISAs, student finance, taxes, and more relevant topics.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Learning Paths Preview - Modernized & Gamified */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Your Financial Learning Journey</h2>
              <Link href="/learning-modules">
                <Button variant="link" className="text-[#9FEF00] dark:text-[#9FEF00] font-medium">
                  View All Learning Modules
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <p className="text-center text-gray-600 dark:text-gray-300 mb-12 md:mb-16 max-w-2xl mx-auto text-lg">
              Progress through tailored levels, mastering essential UK financial concepts step-by-step.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Level 1: Beginner */}
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-100 dark:border-slate-700 overflow-hidden transform transition duration-300 hover:shadow-2xl hover:-translate-y-1">
                <div className="bg-green-50 dark:bg-green-900/20 p-4">
                  <div className="flex items-center">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-green-200 dark:bg-green-800">
                      <Zap className="w-6 h-6 text-green-600 dark:text-green-300" />
                    </span>
                  </div>
                  <p className="text-sm text-green-700 dark:text-green-300">Learn fundamental money concepts and basic personal finance.</p>
                </div>
                <div className="p-6">
                  <ul className="space-y-3">
                    <li className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                      <Check className="h-5 w-5 text-[#9FEF00] mr-2 flex-shrink-0" />
                      Understanding income and expenses
                    </li>
                    <li className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                      <Check className="h-5 w-5 text-[#9FEF00] mr-2 flex-shrink-0" />
                      Creating your first budget
                    </li>
                    <li className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                      <Check className="h-5 w-5 text-[#9FEF00] mr-2 flex-shrink-0" />
                      UK banking basics
                    </li>
                  </ul>
                  <div className="mt-6 pt-4 border-t border-gray-100 dark:border-slate-700">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500 dark:text-gray-400">Progress</span>
                      <span className="text-xs font-medium text-[#9FEF00] dark:text-[#9FEF00]">Unlocked</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2 mt-1">
                      <div className="bg-[#9FEF00] dark:bg-[#9FEF00] h-2 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Level 2: Intermediate */}
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-100 dark:border-slate-700 overflow-hidden transform transition duration-300 hover:shadow-2xl hover:-translate-y-1">
                <div className="bg-[#9FEF00]/10 dark:bg-[#9FEF00]/20 p-4">
                  <div className="flex items-center">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#9FEF00]/20 dark:bg-[#9FEF00]/30">
                      <BarChart className="w-6 h-6 text-[#9FEF00] dark:text-[#9FEF00]" />
                    </span>
                  </div>
                  <p className="text-sm text-[#9FEF00] dark:text-[#9FEF00]">Deepen your knowledge with more complex financial concepts.</p>
                </div>
                <div className="p-6">
                  <ul className="space-y-3">
                    <li className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                      <Check className="h-5 w-5 text-[#9FEF00] mr-2 flex-shrink-0" />
                      Saving strategies
                    </li>
                    <li className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                      <Check className="h-5 w-5 text-[#9FEF00] mr-2 flex-shrink-0" />
                      Understanding credit
                    </li>
                    <li className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                      <Check className="h-5 w-5 text-[#9FEF00] mr-2 flex-shrink-0" />
                      UK tax basics
                    </li>
                  </ul>
                  <div className="mt-6 pt-4 border-t border-gray-100 dark:border-slate-700">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500 dark:text-gray-400">Progress</span>
                      <span className="text-xs font-medium text-blue-600 dark:text-blue-400">60% Complete</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2 mt-1">
                      <div className="bg-[#9FEF00] dark:bg-[#9FEF00] h-2 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Level 3: Advanced */}
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-100 dark:border-slate-700 overflow-hidden transform transition duration-300 hover:shadow-2xl hover:-translate-y-1">
                <div className="bg-[#9FEF00]/10 dark:bg-[#9FEF00]/20 p-4">
                  <div className="flex items-center">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#9FEF00]/20 dark:bg-[#9FEF00]/30">
                      <Trophy className="w-6 h-6 text-[#9FEF00] dark:text-[#9FEF00]" />
                    </span>
                  </div>
                  <p className="text-sm text-[#9FEF00] dark:text-[#9FEF00]">Master complex financial strategies and long-term planning.</p>
                </div>
                <div className="p-6">
                  <ul className="space-y-3">
                    <li className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                      <Check className="h-5 w-5 text-[#9FEF00] mr-2 flex-shrink-0" />
                      Advanced investment strategies
                    </li>
                    <li className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                      <Check className="h-5 w-5 text-[#9FEF00] mr-2 flex-shrink-0" />
                      Retirement planning
                    </li>
                    <li className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                      <Check className="h-5 w-5 text-[#9FEF00] mr-2 flex-shrink-0" />
                      UK tax optimization
                    </li>
                  </ul>
                  <div className="mt-6 pt-4 border-t border-gray-100 dark:border-slate-700">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500 dark:text-gray-400">Progress</span>
                      <span className="text-xs font-medium text-[#9FEF00] dark:text-[#9FEF00]">25% Complete</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2 mt-1">
                      <div className="bg-[#9FEF00] dark:bg-[#9FEF00] h-2 rounded-full" style={{ width: '25%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section - Modernized */}
        <section className="relative overflow-hidden bg-gradient-to-r from-[#9FEF00] to-[#8FDF00] dark:from-[#9FEF00] dark:to-[#8FDF00] rounded-2xl p-8 md:p-12 text-center my-16 container mx-auto px-4 shadow-xl">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full opacity-10 -translate-x-1/3 -translate-y-1/3 blur-2xl"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-white rounded-full opacity-10 translate-x-1/3 translate-y-1/3 blur-2xl"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-black mb-4">Ready to Master Your Money Mind?</h2>
            <p className="text-black dark:text-black mb-8 max-w-2xl mx-auto text-lg">Join thousands of UK youth who are taking control of their financial future with our interactive, gamified learning platform.</p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto text-base font-semibold bg-black hover:bg-gray-900 text-[#9FEF00] px-8 py-3 transition duration-300 ease-in-out transform hover:scale-105 shadow-lg">
                  Start Your Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-base font-semibold border-black text-black hover:bg-black/10 px-8 py-3 transition duration-300">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

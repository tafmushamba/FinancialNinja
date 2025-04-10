import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ChevronRight, BarChart, PiggyBank, TrendingUp, Star, ArrowRight, Check, Trophy, Zap } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-white dark:from-slate-900 dark:via-slate-950 dark:to-black">
      {/* Hero Section - Modernized */}
      <section className="relative overflow-hidden pt-20 pb-12 md:pt-28 md:pb-20">
        <div className="container mx-auto px-4 z-10 relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center md:text-left">
              <div className="inline-flex items-center bg-[#9FEF00]/10 dark:bg-[#9FEF00]/20 text-[#9FEF00] dark:text-[#9FEF00] rounded-full px-4 py-1 text-sm font-medium mb-4">
                <Star className="w-4 h-4 mr-2 fill-current" />
                <span>Start Your Financial Quest</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white mb-4 leading-tight">
                Master Your Money,
                <br />
                <span className="text-[#9FEF00] dark:text-[#9FEF00]">Unlock Your Future.</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-xl mx-auto md:mx-0">
                Fun, engaging lessons designed for UK youth. Learn budgeting, saving, and investing essentials to build financial confidence.
              </p>
              <div className="flex flex-col sm:flex-row justify-center md:justify-start space-y-3 sm:space-y-0 sm:space-x-4">
                {!isAuthenticated ? (
                  <>
                    <Link href="/register">
                      <Button size="lg" className="w-full sm:w-auto text-base font-semibold bg-[#9FEF00] hover:bg-[#8FDF00] dark:bg-[#9FEF00] dark:hover:bg-[#8FDF00] text-black px-8 py-3 transition duration-300 ease-in-out transform hover:scale-105 shadow-lg">
                        Start Your Quest
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                    <Link href="/login">
                      <Button variant="outline" size="lg" className="w-full sm:w-auto text-base font-semibold border-[#9FEF00] text-[#9FEF00] hover:bg-[#9FEF00]/10 px-8 py-3 transition duration-300">
                        Sign In
                      </Button>
                    </Link>
                  </>
                ) : (
                  <Link href="/dashboard">
                    <Button size="lg" className="w-full sm:w-auto text-base font-semibold bg-[#9FEF00] hover:bg-[#8FDF00] dark:bg-[#9FEF00] dark:hover:bg-[#8FDF00] text-black px-8 py-3 transition duration-300 ease-in-out transform hover:scale-105 shadow-lg">
                      Continue to Dashboard
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                )}
              </div>
            </div>

            {/* Right Visual - Gamified Path Teaser */}
            <div className="relative flex justify-center items-center mt-10 md:mt-0">
              <div className="absolute inset-0 bg-gradient-to-br from-[#9FEF00]/10 to-[#9FEF00]/20 dark:from-[#9FEF00]/20 dark:to-[#9FEF00]/10 rounded-full blur-3xl opacity-50 -z-10"></div>
              <div className="relative bg-white dark:bg-slate-800/50 p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 w-full max-w-md backdrop-blur-sm">
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
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">Why Choose Money Mind?</h2>
        <div className="grid md:grid-cols-3 gap-8">
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
      </section>

      {/* Learning Paths Preview - Modernized & Gamified */}
      <section className="bg-gradient-to-b from-white via-[#9FEF00]/5 to-white dark:from-black dark:via-[#9FEF00]/10 dark:to-black py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 md:mb-0">Your Learning Adventure</h2>
            <Link href="/dashboard">
              <Button variant="outline" className="text-sm px-4 py-2 border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition duration-300">
                View All Paths
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-12 md:mb-16 max-w-2xl mx-auto text-lg">
            Progress through tailored levels, mastering essential UK financial concepts step-by-step.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Level 1: Beginner */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-100 dark:border-slate-700 overflow-hidden transform transition duration-300 hover:shadow-2xl hover:-translate-y-1">
              <div className="p-6 bg-gradient-to-r from-green-50 to-lime-50 dark:from-green-900/50 dark:to-lime-900/50 border-b border-green-200 dark:border-green-700">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-semibold text-green-800 dark:text-green-200">Beginner</h3>
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
                    Understanding money basics
                  </li>
                  <li className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                    <Check className="h-5 w-5 text-[#9FEF00] mr-2 flex-shrink-0" />
                    Setting up your first budget
                  </li>
                  <li className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                    <Check className="h-5 w-5 text-[#9FEF00] mr-2 flex-shrink-0" />
                    Saving for short-term goals
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
              <div className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/50 dark:to-cyan-900/50 border-b border-blue-200 dark:border-blue-700">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-semibold text-blue-800 dark:text-blue-200">Intermediate</h3>
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
                    Advanced budgeting techniques
                  </li>
                  <li className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                    <Check className="h-5 w-5 text-[#9FEF00] mr-2 flex-shrink-0" />
                    UK banking and financial products
                  </li>
                  <li className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                    <Check className="h-5 w-5 text-[#9FEF00] mr-2 flex-shrink-0" />
                    Introduction to investing
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
              <div className="p-6 bg-gradient-to-r from-[#9FEF00]/5 to-[#9FEF00]/10 dark:from-[#9FEF00]/20 dark:to-[#9FEF00]/10 border-b border-[#9FEF00]/30 dark:border-[#9FEF00]/30">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-semibold text-[#9FEF00] dark:text-[#9FEF00]">Advanced</h3>
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
            {!isAuthenticated ? (
              <>
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
              </>
            ) : (
              <Link href="/dashboard">
                <Button size="lg" className="w-full sm:w-auto text-base font-semibold bg-black hover:bg-gray-900 text-[#9FEF00] px-8 py-3 transition duration-300 ease-in-out transform hover:scale-105 shadow-lg">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

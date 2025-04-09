
import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ChevronRight, BarChart, PiggyBank, TrendingUp } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="uk-flag-element bg-white rounded-lg shadow-md overflow-hidden mb-12">
        <div className="px-6 py-12 md:px-12 text-center md:text-left md:flex md:items-center">
          <div className="md:flex-1 mb-8 md:mb-0 md:pr-10">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Building Financial Confidence for UK Youth</h1>
            <p className="text-lg text-gray-600 mb-6">
              Learn essential money skills with fun, interactive lessons tailored to the UK financial system. Start your journey to financial literacy today.
            </p>
            <div className="flex flex-col sm:flex-row justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
              <Link href="/dashboard">
                <Button size="lg" className="text-base">
                  Start Learning
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="text-base">
                About FinWise
              </Button>
            </div>
          </div>
          <div className="md:flex-1 flex justify-center">
            <div className="bg-primary-50 p-6 rounded-lg relative w-full max-w-sm">
              <div className="absolute -top-4 -right-4 bg-secondary-100 text-secondary-700 rounded-full px-3 py-1 text-sm font-medium">
                UK Focused
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Your Financial Journey</h3>
              <div className="space-y-4">
                <div className="flex items-center bg-white p-3 rounded-md shadow-sm">
                  <div className="bg-primary-100 p-2 rounded-full mr-3">
                    <BarChart className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Learn Budgeting</p>
                    <p className="text-sm text-gray-500">Master your spending habits</p>
                  </div>
                  <div className="ml-auto bg-green-100 px-2 py-1 rounded text-xs text-green-700">Beginner</div>
                </div>
                <div className="flex items-center bg-white p-3 rounded-md shadow-sm">
                  <div className="bg-primary-100 p-2 rounded-full mr-3">
                    <PiggyBank className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Smart Saving</p>
                    <p className="text-sm text-gray-500">Build your emergency fund</p>
                  </div>
                  <div className="ml-auto bg-amber-100 px-2 py-1 rounded text-xs text-amber-700">Intermediate</div>
                </div>
                <div className="flex items-center bg-white p-3 rounded-md shadow-sm">
                  <div className="bg-primary-100 p-2 rounded-full mr-3">
                    <TrendingUp className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">UK Investing</p>
                    <p className="text-sm text-gray-500">Grow your wealth</p>
                  </div>
                  <div className="ml-auto bg-red-100 px-2 py-1 rounded text-xs text-red-700">Advanced</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Why Learn with FinWise?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
              <svg className="h-6 w-6 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">UK-Specific Content</h3>
            <p className="text-gray-600">Learn about ISAs, UK tax system, pension options, and other financial concepts relevant to British youth.</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center mb-4">
              <svg className="h-6 w-6 text-secondary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Interactive Learning</h3>
            <p className="text-gray-600">Engage with quizzes, calculators, and simulations that make learning financial concepts fun and memorable.</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-4">
              <svg className="h-6 w-6 text-amber-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Progress Tracking</h3>
            <p className="text-gray-600">Track your learning journey, earn badges, and build confidence as you master essential financial skills.</p>
          </div>
        </div>
      </section>

      {/* Learning Paths Preview */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Learning Paths</h2>
          <Link href="/dashboard">
            <Button variant="outline" className="text-sm">
              View All Paths
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
            <div className="bg-green-50 p-4 border-b border-gray-200">
              <div className="flex items-center">
                <div className="difficulty-indicator beginner">
                  <span></span><span></span><span></span>
                </div>
                <h3 className="text-lg font-semibold ml-2">Beginner</h3>
              </div>
              <p className="mt-2 text-sm text-gray-600">Learn fundamental money concepts and basic personal finance.</p>
            </div>
            <div className="p-4">
              <ul className="space-y-2">
                <li className="flex items-center text-sm">
                  <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Understanding money basics
                </li>
                <li className="flex items-center text-sm">
                  <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Setting up your first budget
                </li>
                <li className="flex items-center text-sm">
                  <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Saving for short-term goals
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-amber-200">
            <div className="bg-amber-50 p-4 border-b border-amber-200">
              <div className="flex items-center">
                <div className="difficulty-indicator intermediate">
                  <span></span><span></span><span></span>
                </div>
                <h3 className="text-lg font-semibold ml-2">Intermediate</h3>
              </div>
              <p className="mt-2 text-sm text-gray-600">Deepen your knowledge with more complex financial concepts.</p>
            </div>
            <div className="p-4">
              <ul className="space-y-2">
                <li className="flex items-center text-sm">
                  <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Advanced budgeting techniques
                </li>
                <li className="flex items-center text-sm">
                  <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  UK banking and financial products
                </li>
                <li className="flex items-center text-sm">
                  <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Introduction to investing
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
            <div className="bg-red-50 p-4 border-b border-gray-200">
              <div className="flex items-center">
                <div className="difficulty-indicator advanced">
                  <span></span><span></span><span></span>
                </div>
                <h3 className="text-lg font-semibold ml-2">Advanced</h3>
              </div>
              <p className="mt-2 text-sm text-gray-600">Master complex financial strategies and long-term planning.</p>
            </div>
            <div className="p-4">
              <ul className="space-y-2">
                <li className="flex items-center text-sm">
                  <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Advanced investment strategies
                </li>
                <li className="flex items-center text-sm">
                  <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Retirement planning
                </li>
                <li className="flex items-center text-sm">
                  <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  UK tax optimization
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-50 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to start your financial education?</h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">Join thousands of UK youth who are taking control of their financial future with FinWise's interactive learning platform.</p>
        <Link href="/dashboard">
          <Button size="lg" className="text-base">
            Get Started for Free
          </Button>
        </Link>
      </section>
    </div>
  );
}

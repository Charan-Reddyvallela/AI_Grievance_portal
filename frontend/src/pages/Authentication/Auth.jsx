import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SignIn from './SignIn.jsx';
import SignUp from './SignUp.jsx';
import { MessageSquare, Users, Shield, ArrowRight, ChevronRight } from 'lucide-react';

export default function Auth() {
  const [isSignIn, setIsSignIn] = useState(true);

  return (
    <div className="min-h-screen flex auth-page">
      {/* Left Panel - Brand */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 p-12 flex-col justify-between relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-8">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">AI Grievance Portal</h1>
              <p className="text-blue-100">Smart Civic Issue Management</p>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-bold text-white mb-4">
                {isSignIn ? 'Welcome Back' : 'Join Our Community'}
              </h2>
              <p className="text-xl text-blue-100 leading-relaxed">
                {isSignIn 
                  ? 'Sign in to access your grievance dashboard and track your complaints.'
                  : 'Create an account to report issues and participate in improving your community.'
                }
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 mt-1">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Secure & Reliable</h3>
                  <p className="text-blue-100">Your data is protected with enterprise-grade security</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 mt-1">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Community Driven</h3>
                  <p className="text-blue-100">Join thousands of citizens making a difference</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 mt-1">
                  <ArrowRight className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Quick Resolution</h3>
                  <p className="text-blue-100">Fast tracking of grievances to concerned departments</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10">
          <div className="flex items-center space-x-6 text-blue-100">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/help" className="hover:text-white transition-colors">Help Center</Link>
          </div>
          <p className="text-blue-200 text-sm mt-4">© 2024 AI Grievance Portal. All rights reserved.</p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 bg-gray-50 dark:bg-gray-900">
        <div className="w-full max-w-md">
          {/* Toggle */}
          <div className="auth-toggle mb-8 bg-white dark:bg-gray-800 rounded-lg p-1 border border-gray-200 dark:border-gray-700">
            <div className="flex relative">
              <div
                className={`absolute top-1 left-1 h-10 bg-blue-600 rounded-md transition-all duration-300 ${
                  isSignIn ? 'w-1/2 translate-x-0' : 'w-1/2 translate-x-full'
                }`}
              />
              <button
                onClick={() => setIsSignIn(true)}
                className={`auth-toggle-btn relative z-10 flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-300 ${
                  isSignIn 
                    ? 'text-white auth-toggle-btn--active' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsSignIn(false)}
                className={`auth-toggle-btn relative z-10 flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-300 ${
                  !isSignIn 
                    ? 'text-white auth-toggle-btn--active' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Sign Up
              </button>
            </div>
          </div>

          {/* Form Container */}
          <div className="relative overflow-hidden">
            <div
              className={`transition-all duration-500 transform ${
                isSignIn ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 absolute'
              }`}
            >
              <SignIn />
            </div>
            <div
              className={`transition-all duration-500 transform ${
                !isSignIn ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 absolute'
              }`}
            >
              <SignUp />
            </div>
          </div>

          {/* Footer Links */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              By continuing, you agree to our{' '}
              <Link 
                to="/terms" 
                className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors font-medium group"
              >
                Terms of Service
                <ChevronRight className="inline w-3 h-3 ml-1 transition-transform group-hover:translate-x-1" />
              </Link>{' '}
              and{' '}
              <Link 
                to="/privacy" 
                className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors font-medium group"
              >
                Privacy Policy
                <ChevronRight className="inline w-3 h-3 ml-1 transition-transform group-hover:translate-x-1" />
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, X, Check, Bot, Heart, UtensilsCrossed, BarChart3, ChefHat, Users, Calendar, User, Sparkles, Play, Volume2 } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { HomePage } from './HomePage';
import { AIAssistant } from './AIAssistant';
import { MoodTracker } from './MoodTracker';
import { FoodLogger } from './FoodLogger';
import { Analytics } from './Analytics';

type ActiveTab = 'home' | 'ai' | 'mood' | 'food' | 'analytics' | 'recipes' | 'social' | 'planner' | 'profile';

interface GuidedTourProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onComplete: () => void;
  step: number;
  setStep: (step: number) => void;
}

interface TourStep {
  id: number;
  title: string;
  description: string;
  tab: ActiveTab;
  target: string;
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
  icon: React.ComponentType<any>;
  color: string;
  action?: string;
}

export function GuidedTour({ activeTab, setActiveTab, onComplete, step, setStep }: GuidedTourProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);

  const tourSteps: TourStep[] = [
    {
      id: 0,
      title: "Welcome to MoodBites! 🎉",
      description: "Let's take a quick tour to show you how to track your mood, log food, and get AI-powered insights for better nutrition and wellness.",
      tab: 'home',
      target: 'center',
      position: 'center',
      icon: Sparkles,
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 1,
      title: "Your Dashboard",
      description: "This is your home base! See your daily progress, achievements, and quick actions. Everything you need is right here.",
      tab: 'home',
      target: 'main-content',
      position: 'center',
      icon: BarChart3,
      color: 'from-blue-500 to-purple-500'
    },
    {
      id: 2,
      title: "AI Nutrition Coach",
      description: "Meet your personal AI coach! Ask questions about nutrition, get meal recommendations, and receive personalized insights based on your data.",
      tab: 'ai',
      target: 'ai-chat',
      position: 'center',
      icon: Bot,
      color: 'from-purple-500 to-indigo-500',
      action: 'Try asking: "What should I eat for more energy?"'
    },
    {
      id: 3,
      title: "Track Your Mood",
      description: "Log how you're feeling throughout the day. Our AI will help you discover patterns between your emotions and eating habits.",
      tab: 'mood',
      target: 'mood-tracker',
      position: 'center',
      icon: Heart,
      color: 'from-pink-500 to-rose-500',
      action: 'Try rating your current mood!'
    },
    {
      id: 4,
      title: "Food Logger",
      description: "Easily log your meals and get AI recommendations. Take photos, search our database, or get suggestions based on your mood.",
      tab: 'food',
      target: 'food-logger',
      position: 'center',
      icon: UtensilsCrossed,
      color: 'from-green-500 to-emerald-500',
      action: 'Log a meal to see how it affects your mood!'
    },
    {
      id: 5,
      title: "Smart Analytics",
      description: "Discover insights about your mood-food patterns. See what foods boost your energy and which ones make you feel your best.",
      tab: 'analytics',
      target: 'analytics',
      position: 'center',
      icon: BarChart3,
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 6,
      title: "Music & Navigation",
      description: "Your sidebar has everything! Navigate between features and enjoy mood-based music recommendations powered by Spotify.",
      tab: 'home',
      target: 'sidebar',
      position: 'right',
      icon: Volume2,
      color: 'from-green-500 to-blue-500',
      action: 'Try clicking different mood buttons for music!'
    }
  ];

  const currentStep = tourSteps[step];

  useEffect(() => {
    if (currentStep) {
      setActiveTab(currentStep.tab);
    }
  }, [step, currentStep, setActiveTab]);

  const handleNext = () => {
    if (step < tourSteps.length - 1) {
      setStep(step + 1);
    } else {
      setShowConfetti(true);
      setTimeout(() => {
        onComplete();
      }, 2000);
    }
  };

  const handlePrevious = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage setActiveTab={setActiveTab} />;
      case 'ai':
        return <AIAssistant setActiveTab={setActiveTab} />;
      case 'mood':
        return <MoodTracker setActiveTab={setActiveTab} />;
      case 'food':
        return <FoodLogger setActiveTab={setActiveTab} />;
      case 'analytics':
        return <Analytics setActiveTab={setActiveTab} />;
      default:
        return <HomePage setActiveTab={setActiveTab} />;
    }
  };

  if (!isVisible || !currentStep) return null;

  return (
    <div className="min-h-screen transition-colors duration-300 relative">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random()}s`
              }}
            >
              <div className={`w-3 h-3 rounded-full ${
                ['bg-yellow-400', 'bg-pink-400', 'bg-blue-400', 'bg-green-400', 'bg-purple-400'][Math.floor(Math.random() * 5)]
              }`}></div>
            </div>
          ))}
        </div>
      )}

      {/* Main App Layout */}
      <div className="flex">
        <div id="sidebar">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        <main className="flex-1 overflow-hidden" id="main-content">
          <div id="ai-chat">
            <div id="mood-tracker">
              <div id="food-logger">
                <div id="analytics">
                  {renderContent()}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Tour Overlay */}
      <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
        {/* Tour Card */}
        <div className={`relative max-w-lg w-full bg-white rounded-3xl shadow-2xl overflow-hidden ${
          currentStep.position === 'center' ? 'mx-auto' : ''
        }`}>
          {/* Header */}
          <div className={`bg-gradient-to-r ${currentStep.color} p-6 text-white relative overflow-hidden`}>
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-20">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-white rounded-full animate-pulse"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`
                  }}
                ></div>
              ))}
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <currentStep.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{currentStep.title}</h2>
                    <p className="text-white/80 text-sm">Step {step + 1} of {tourSteps.length}</p>
                  </div>
                </div>
                <button
                  onClick={handleSkip}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-white/20 rounded-full h-2">
                <div 
                  className="bg-white h-2 rounded-full transition-all duration-500"
                  style={{ width: `${((step + 1) / tourSteps.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <p className="text-gray-700 text-lg leading-relaxed mb-4">
              {currentStep.description}
            </p>
            
            {currentStep.action && (
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-4 border border-blue-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Play className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">Try This:</span>
                </div>
                <p className="text-blue-700 text-sm">{currentStep.action}</p>
              </div>
            )}

            {/* Special completion message */}
            {step === tourSteps.length - 1 && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 mb-4 border border-green-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-800">You're All Set!</span>
                </div>
                <p className="text-green-700 text-sm">
                  You now know how to use MoodBites to track your nutrition and mood. Start your wellness journey today!
                </p>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between p-6 bg-gray-50 border-t border-gray-100">
            <button
              onClick={handlePrevious}
              disabled={step === 0}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>
            
            <div className="flex space-x-2">
              {tourSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === step ? 'bg-purple-500' : 
                    index < step ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                ></div>
              ))}
            </div>
            
            <button
              onClick={handleNext}
              className={`flex items-center space-x-2 px-6 py-2 rounded-xl text-white font-medium transition-all duration-200 hover:shadow-lg ${
                step === tourSteps.length - 1
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                  : `bg-gradient-to-r ${currentStep.color}`
              }`}
            >
              <span>{step === tourSteps.length - 1 ? 'Start Using MoodBites' : 'Next'}</span>
              {step === tourSteps.length - 1 ? (
                <Check className="w-4 h-4" />
              ) : (
                <ArrowRight className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
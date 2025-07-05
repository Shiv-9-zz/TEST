import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { HomePage } from './components/HomePage';
import { AIAssistant } from './components/AIAssistant';
import { MoodTracker } from './components/MoodTracker';
import { FoodLogger } from './components/FoodLogger';
import { Analytics } from './components/Analytics';
import { Recipes } from './components/Recipes';
import { Social } from './components/Social';
import { MealPlanner } from './components/MealPlanner';
import { Profile } from './components/Profile';
import { OpeningAnimation } from './components/OpeningAnimation';
import { SignupPage } from './components/SignupPage';
import { GuidedTour } from './components/GuidedTour';
import { ThemeProvider } from './contexts/ThemeContext';
import { AppProvider } from './contexts/AppContext';

type ActiveTab = 'home' | 'ai' | 'mood' | 'food' | 'analytics' | 'recipes' | 'social' | 'planner' | 'profile';
type AppState = 'loading' | 'signup' | 'tour' | 'app';

function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [appState, setAppState] = useState<AppState>('loading');
  const [tourStep, setTourStep] = useState(0);

  useEffect(() => {
    // Check if user has completed onboarding
    const hasCompletedOnboarding = localStorage.getItem('moodbites_onboarding_complete');
    
    if (hasCompletedOnboarding) {
      // Skip to app if user has already completed onboarding
      setTimeout(() => setAppState('app'), 3000);
    } else {
      // Show full onboarding flow
      setTimeout(() => setAppState('signup'), 3000);
    }
  }, []);

  const handleSignupComplete = () => {
    setAppState('tour');
  };

  const handleTourComplete = () => {
    localStorage.setItem('moodbites_onboarding_complete', 'true');
    setAppState('app');
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
      case 'recipes':
        return <Recipes setActiveTab={setActiveTab} />;
      case 'social':
        return <Social setActiveTab={setActiveTab} />;
      case 'planner':
        return <MealPlanner setActiveTab={setActiveTab} />;
      case 'profile':
        return <Profile setActiveTab={setActiveTab} />;
      default:
        return <HomePage setActiveTab={setActiveTab} />;
    }
  };

  if (appState === 'loading') {
    return <OpeningAnimation />;
  }

  if (appState === 'signup') {
    return <SignupPage onComplete={handleSignupComplete} />;
  }

  if (appState === 'tour') {
    return (
      <ThemeProvider>
        <AppProvider>
          <GuidedTour 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onComplete={handleTourComplete}
            step={tourStep}
            setStep={setTourStep}
          />
        </AppProvider>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <AppProvider>
        <div className="min-h-screen transition-colors duration-300">
          <div className="flex">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            <main className="flex-1 overflow-hidden">
              {renderContent()}
            </main>
          </div>
        </div>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;
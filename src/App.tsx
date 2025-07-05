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
import { AppProvider, useApp } from './contexts/AppContext';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import './TabTransition.css';

type ActiveTab = 'home' | 'ai' | 'mood' | 'food' | 'analytics' | 'recipes' | 'social' | 'planner' | 'profile';
type AppState = 'loading' | 'signup' | 'tour' | 'app';

function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [appState, setAppState] = useState<AppState>('loading');
  const [tourStep, setTourStep] = useState(0);
  const { language } = useApp ? useApp() : { language: 'en' };

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
        return <HomePage setActiveTab={setActiveTab as (tab: string) => void} />;
      case 'ai':
        return <AIAssistant setActiveTab={setActiveTab as (tab: string) => void} />;
      case 'mood':
        return <MoodTracker setActiveTab={setActiveTab as (tab: string) => void} />;
      case 'food':
        return <FoodLogger setActiveTab={setActiveTab as (tab: string) => void} />;
      case 'analytics':
        return <Analytics setActiveTab={setActiveTab as (tab: string) => void} />;
      case 'recipes':
        return <Recipes setActiveTab={setActiveTab as (tab: string) => void} />;
      case 'social':
        return <Social setActiveTab={setActiveTab as (tab: string) => void} />;
      case 'planner':
        return <MealPlanner setActiveTab={setActiveTab as (tab: string) => void} />;
      case 'profile':
        return <Profile setActiveTab={setActiveTab as (tab: string) => void} />;
      default:
        return <HomePage setActiveTab={setActiveTab as (tab: string) => void} />;
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
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab as (tab: any) => void} />
            <main className="flex-1 overflow-hidden relative">
              <SwitchTransition>
                <CSSTransition
                  key={activeTab}
                  timeout={300}
                  classNames="fade"
                  unmountOnExit
                >
                  <div>
                    {renderContent()}
                  </div>
                </CSSTransition>
              </SwitchTransition>
            </main>
          </div>
        </div>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;
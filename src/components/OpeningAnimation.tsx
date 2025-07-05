import React, { useState, useEffect } from 'react';
import { UtensilsCrossed, Heart, Brain, Sparkles, Zap } from 'lucide-react';

export function OpeningAnimation() {
  const [currentStep, setCurrentStep] = useState(0);
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setShowText(true), 500);
    const timer2 = setTimeout(() => setCurrentStep(1), 1000);
    const timer3 = setTimeout(() => setCurrentStep(2), 1500);
    const timer4 = setTimeout(() => setCurrentStep(3), 2000);
    const timer5 = setTimeout(() => setCurrentStep(4), 2500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, []);

  const icons = [
    { Icon: UtensilsCrossed, color: 'text-orange-500', delay: 0 },
    { Icon: Heart, color: 'text-pink-500', delay: 200 },
    { Icon: Brain, color: 'text-purple-500', delay: 400 },
    { Icon: Sparkles, color: 'text-yellow-500', delay: 600 },
    { Icon: Zap, color: 'text-blue-500', delay: 800 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600 flex items-center justify-center overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          >
            <div className="w-2 h-2 bg-white/20 rounded-full"></div>
          </div>
        ))}
      </div>

      <div className="text-center z-10">
        {/* Logo Animation */}
        <div className="relative mb-8">
          <div className="flex items-center justify-center space-x-4 mb-6">
            {icons.map(({ Icon, color, delay }, index) => (
              <div
                key={index}
                className={`transform transition-all duration-1000 ${
                  currentStep >= index ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                }`}
                style={{ transitionDelay: `${delay}ms` }}
              >
                <div className="relative">
                  <div className={`w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center ${
                    currentStep >= index ? 'animate-bounce' : ''
                  }`}>
                    <Icon className={`w-8 h-8 ${color}`} />
                  </div>
                  {currentStep >= index && (
                    <div className="absolute inset-0 rounded-full bg-white/10 animate-ping"></div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Main Logo */}
          <div className={`transform transition-all duration-1000 ${
            showText ? 'scale-100 opacity-100 translate-y-0' : 'scale-0 opacity-0 translate-y-10'
          }`}>
            <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center shadow-2xl">
              <UtensilsCrossed className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>

        {/* Text Animation */}
        <div className={`transform transition-all duration-1000 delay-500 ${
          showText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <h1 className="text-6xl font-bold text-white mb-4 tracking-tight">
            MoodBites
          </h1>
          <p className="text-2xl text-white/90 mb-8 font-light">
            Where Food Meets Feelings
          </p>
          
          <div className="flex items-center justify-center space-x-2 text-white/80">
            <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>

        {/* Taglines */}
        <div className={`mt-12 space-y-2 transform transition-all duration-1000 delay-1000 ${
          currentStep >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <p className="text-white/80 text-lg">🤖 AI-Powered Nutrition Coach</p>
          <p className="text-white/80 text-lg">📊 Smart Mood & Food Analytics</p>
          <p className="text-white/80 text-lg">🎵 Personalized Music & Recipes</p>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-20 animate-float">
        <div className="w-8 h-8 bg-yellow-400/30 rounded-full"></div>
      </div>
      <div className="absolute top-40 right-32 animate-float" style={{ animationDelay: '1s' }}>
        <div className="w-6 h-6 bg-pink-400/30 rounded-full"></div>
      </div>
      <div className="absolute bottom-32 left-40 animate-float" style={{ animationDelay: '2s' }}>
        <div className="w-10 h-10 bg-purple-400/30 rounded-full"></div>
      </div>
      <div className="absolute bottom-20 right-20 animate-float" style={{ animationDelay: '0.5s' }}>
        <div className="w-4 h-4 bg-blue-400/30 rounded-full"></div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
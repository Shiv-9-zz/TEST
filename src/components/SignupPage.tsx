import React, { useState } from 'react';
import { User, Mail, Lock, UtensilsCrossed, ArrowRight, Check, Heart, Brain, Zap } from 'lucide-react';

interface SignupPageProps {
  onComplete: () => void;
}

export function SignupPage({ onComplete }: SignupPageProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    dietaryRestrictions: [] as string[],
    moodGoals: [] as string[],
    experience: ''
  });

  const dietaryOptions = [
    { id: 'vegetarian', label: 'Vegetarian', emoji: '🥬' },
    { id: 'vegan', label: 'Vegan', emoji: '🌱' },
    { id: 'gluten-free', label: 'Gluten-Free', emoji: '🌾' },
    { id: 'dairy-free', label: 'Dairy-Free', emoji: '🥛' },
    { id: 'keto', label: 'Keto', emoji: '🥑' },
    { id: 'paleo', label: 'Paleo', emoji: '🥩' },
    { id: 'none', label: 'No Restrictions', emoji: '🍽️' }
  ];

  const moodGoalOptions = [
    { id: 'energy', label: 'More Energy', emoji: '⚡', color: 'from-yellow-400 to-orange-500' },
    { id: 'happiness', label: 'Better Mood', emoji: '😊', color: 'from-pink-400 to-rose-500' },
    { id: 'calm', label: 'Reduce Stress', emoji: '🧘', color: 'from-blue-400 to-purple-500' },
    { id: 'focus', label: 'Mental Clarity', emoji: '🧠', color: 'from-purple-400 to-indigo-500' },
    { id: 'comfort', label: 'Emotional Balance', emoji: '🤗', color: 'from-green-400 to-teal-500' },
    { id: 'motivation', label: 'Stay Motivated', emoji: '🎯', color: 'from-red-400 to-pink-500' }
  ];

  const experienceOptions = [
    { id: 'beginner', label: 'New to nutrition tracking', emoji: '🌱' },
    { id: 'intermediate', label: 'Some experience with healthy eating', emoji: '🌿' },
    { id: 'advanced', label: 'Very knowledgeable about nutrition', emoji: '🌳' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field: 'dietaryRestrictions' | 'moodGoals', item: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(item) 
        ? prev[field].filter(i => i !== item)
        : [...prev[field], item]
    }));
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      // Save user data and complete signup
      const userData = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        avatar: `https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=200`,
        joinDate: new Date().toISOString().split('T')[0],
        preferences: {
          dietaryRestrictions: formData.dietaryRestrictions,
          favoriteCategories: ['healthy'],
          moodGoals: formData.moodGoals
        },
        stats: {
          totalMeals: 0,
          averageMood: 7.0,
          streakDays: 0,
          recipesShared: 0
        }
      };
      
      localStorage.setItem('moodbites_user', JSON.stringify(userData));
      onComplete();
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.name && formData.email && formData.password;
      case 2:
        return formData.dietaryRestrictions.length > 0;
      case 3:
        return formData.moodGoals.length > 0;
      case 4:
        return formData.experience;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 flex items-center justify-center p-8">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-r from-orange-500 to-pink-500 flex items-center justify-center shadow-xl">
            <UtensilsCrossed className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Welcome to MoodBites</h1>
          <p className="text-gray-600 text-lg">Let's personalize your nutrition journey</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Step {step} of 4</span>
            <span className="text-sm text-gray-600">{Math.round((step / 4) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-orange-500 to-pink-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(step / 4) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <User className="w-12 h-12 text-orange-500 mx-auto mb-3" />
                <h2 className="text-2xl font-bold text-gray-800">Create Your Account</h2>
                <p className="text-gray-600">Tell us about yourself</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Create a secure password"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🥗</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Dietary Preferences</h2>
                <p className="text-gray-600">Help us recommend the right foods for you</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {dietaryOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => toggleArrayItem('dietaryRestrictions', option.id)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                      formData.dietaryRestrictions.includes(option.id)
                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                        : 'border-gray-200 hover:border-orange-300 text-gray-700'
                    }`}
                  >
                    <div className="text-2xl mb-2">{option.emoji}</div>
                    <div className="font-medium">{option.label}</div>
                    {formData.dietaryRestrictions.includes(option.id) && (
                      <Check className="w-5 h-5 text-orange-500 mx-auto mt-2" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <Heart className="w-12 h-12 text-pink-500 mx-auto mb-3" />
                <h2 className="text-2xl font-bold text-gray-800">Your Wellness Goals</h2>
                <p className="text-gray-600">What would you like to improve with nutrition?</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {moodGoalOptions.map((goal) => (
                  <button
                    key={goal.id}
                    onClick={() => toggleArrayItem('moodGoals', goal.id)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                      formData.moodGoals.includes(goal.id)
                        ? 'border-pink-500 bg-pink-50 text-pink-700'
                        : 'border-gray-200 hover:border-pink-300 text-gray-700'
                    }`}
                  >
                    <div className="text-2xl mb-2">{goal.emoji}</div>
                    <div className="font-medium">{goal.label}</div>
                    {formData.moodGoals.includes(goal.id) && (
                      <Check className="w-5 h-5 text-pink-500 mx-auto mt-2" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <Brain className="w-12 h-12 text-purple-500 mx-auto mb-3" />
                <h2 className="text-2xl font-bold text-gray-800">Your Experience Level</h2>
                <p className="text-gray-600">This helps us customize your experience</p>
              </div>
              
              <div className="space-y-4">
                {experienceOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleInputChange('experience', option.id)}
                    className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                      formData.experience === option.id
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-200 hover:border-purple-300 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{option.emoji}</span>
                      <div className="flex-1">
                        <div className="font-medium">{option.label}</div>
                      </div>
                      {formData.experience === option.id && (
                        <Check className="w-5 h-5 text-purple-500" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
            <button
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
              className="px-6 py-3 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Back
            </button>
            
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className="px-8 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <span>{step === 4 ? 'Complete Setup' : 'Continue'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Features Preview */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">What you'll get with MoodBites:</p>
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span>AI Coach</span>
            </div>
            <div className="flex items-center space-x-1">
              <Heart className="w-4 h-4 text-pink-500" />
              <span>Mood Tracking</span>
            </div>
            <div className="flex items-center space-x-1">
              <UtensilsCrossed className="w-4 h-4 text-orange-500" />
              <span>Smart Recipes</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
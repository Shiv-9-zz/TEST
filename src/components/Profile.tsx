import React, { useState } from 'react';
import { User, Settings, Camera, Edit3, Save, X, Award, Calendar, TrendingUp, Heart, Utensils, Target, Star } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useApp } from '../contexts/AppContext';

interface ProfileProps {
  setActiveTab: (tab: string) => void;
}

export function Profile({ setActiveTab }: ProfileProps) {
  const { theme } = useTheme();
  const { user, setUser, moodEntries, foodEntries } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    dietaryRestrictions: user?.preferences.dietaryRestrictions || [],
    favoriteCategories: user?.preferences.favoriteCategories || [],
    moodGoals: user?.preferences.moodGoals || []
  });

  const dietaryOptions = ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'keto', 'paleo', 'low-carb', 'mediterranean'];
  const categoryOptions = ['healthy', 'comfort', 'energetic', 'calm', 'breakfast', 'lunch', 'dinner', 'snacks'];
  const moodGoalOptions = ['energy', 'happiness', 'calm', 'focus', 'comfort', 'motivation'];

  const achievements = [
    { icon: Calendar, title: '14-Day Streak', description: 'Logged meals for 14 days straight', earned: true, color: 'text-green-500' },
    { icon: Heart, title: 'Mood Master', description: 'Tracked mood 50 times', earned: true, color: 'text-pink-500' },
    { icon: Utensils, title: 'Food Explorer', description: 'Tried 25 new recipes', earned: true, color: 'text-orange-500' },
    { icon: Star, title: 'Community Star', description: 'Shared 10 recipes', earned: true, color: 'text-purple-500' },
    { icon: Target, title: 'Goal Achiever', description: 'Met weekly goals 4 times', earned: false, color: 'text-gray-400' },
    { icon: TrendingUp, title: 'Mood Booster', description: 'Improved mood by 20%', earned: false, color: 'text-gray-400' }
  ];

  const handleSave = () => {
    if (user) {
      setUser({
        ...user,
        name: editForm.name,
        email: editForm.email,
        preferences: {
          dietaryRestrictions: editForm.dietaryRestrictions,
          favoriteCategories: editForm.favoriteCategories,
          moodGoals: editForm.moodGoals
        }
      });
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm({
      name: user?.name || '',
      email: user?.email || '',
      dietaryRestrictions: user?.preferences.dietaryRestrictions || [],
      favoriteCategories: user?.preferences.favoriteCategories || [],
      moodGoals: user?.preferences.moodGoals || []
    });
    setIsEditing(false);
  };

  const toggleArrayItem = (array: string[], item: string, setter: (items: string[]) => void) => {
    if (array.includes(item)) {
      setter(array.filter(i => i !== item));
    } else {
      setter([...array, item]);
    }
  };

  if (!user) return null;

  return (
    <div className={`min-h-screen transition-colors duration-300 p-8 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50'
    }`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-4xl font-bold mb-2 flex items-center ${
            theme === 'dark' ? 'text-white' : 'text-gray-800'
          }`}>
            <User className="w-10 h-10 mr-4 text-purple-600" />
            My Profile
          </h1>
          <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
            Manage your account and track your wellness journey
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className={`rounded-2xl p-8 shadow-xl border ${
            theme === 'dark' 
              ? 'bg-gray-800/90 border-gray-700' 
              : 'bg-white/80 border-gray-100'
          } backdrop-blur-sm`}>
            <div className="text-center mb-6">
              <div className="relative inline-block">
                <img 
                  src={user.avatar} 
                  alt={user.name}
                  className="w-32 h-32 rounded-full object-cover mx-auto mb-4 border-4 border-purple-500"
                />
                <button className="absolute bottom-2 right-2 p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              
              {isEditing ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                    className={`w-full p-3 rounded-xl border-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-200 text-gray-900'
                    }`}
                  />
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                    className={`w-full p-3 rounded-xl border-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-200 text-gray-900'
                    }`}
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSave}
                      className="flex-1 bg-green-600 text-white py-2 px-4 rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-xl hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {user.name}
                  </h2>
                  <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                    {user.email}
                  </p>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-purple-600 text-white py-2 px-6 rounded-xl hover:bg-purple-700 transition-colors flex items-center space-x-2 mx-auto"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </button>
                </>
              )}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className={`text-center p-4 rounded-xl ${
                theme === 'dark' ? 'bg-gray-700/50' : 'bg-purple-50'
              }`}>
                <div className="text-2xl font-bold text-purple-600">{user.stats.totalMeals}</div>
                <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Meals Logged
                </div>
              </div>
              <div className={`text-center p-4 rounded-xl ${
                theme === 'dark' ? 'bg-gray-700/50' : 'bg-green-50'
              }`}>
                <div className="text-2xl font-bold text-green-600">{user.stats.averageMood}</div>
                <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Avg Mood
                </div>
              </div>
              <div className={`text-center p-4 rounded-xl ${
                theme === 'dark' ? 'bg-gray-700/50' : 'bg-orange-50'
              }`}>
                <div className="text-2xl font-bold text-orange-600">{user.stats.streakDays}</div>
                <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Day Streak
                </div>
              </div>
              <div className={`text-center p-4 rounded-xl ${
                theme === 'dark' ? 'bg-gray-700/50' : 'bg-pink-50'
              }`}>
                <div className="text-2xl font-bold text-pink-600">{user.stats.recipesShared}</div>
                <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Recipes Shared
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-6 space-y-2">
              <button
                onClick={() => setActiveTab('mood')}
                className={`w-full p-3 rounded-xl transition-colors flex items-center space-x-3 ${
                  theme === 'dark' 
                    ? 'bg-gray-700/50 hover:bg-gray-700 text-white' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                }`}
              >
                <Heart className="w-5 h-5 text-pink-500" />
                <span>Track Mood</span>
              </button>
              <button
                onClick={() => setActiveTab('food')}
                className={`w-full p-3 rounded-xl transition-colors flex items-center space-x-3 ${
                  theme === 'dark' 
                    ? 'bg-gray-700/50 hover:bg-gray-700 text-white' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                }`}
              >
                <Utensils className="w-5 h-5 text-green-500" />
                <span>Log Food</span>
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`w-full p-3 rounded-xl transition-colors flex items-center space-x-3 ${
                  theme === 'dark' 
                    ? 'bg-gray-700/50 hover:bg-gray-700 text-white' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                }`}
              >
                <TrendingUp className="w-5 h-5 text-blue-500" />
                <span>View Analytics</span>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Preferences */}
            <div className={`rounded-2xl p-8 shadow-xl border ${
              theme === 'dark' 
                ? 'bg-gray-800/90 border-gray-700' 
                : 'bg-white/80 border-gray-100'
            } backdrop-blur-sm`}>
              <h3 className={`text-2xl font-bold mb-6 flex items-center ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                <Settings className="w-6 h-6 mr-3 text-purple-600" />
                Preferences
              </h3>

              <div className="space-y-6">
                {/* Dietary Restrictions */}
                <div>
                  <label className={`block text-lg font-semibold mb-3 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Dietary Restrictions
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {dietaryOptions.map(option => (
                      <button
                        key={option}
                        onClick={() => isEditing && toggleArrayItem(
                          editForm.dietaryRestrictions, 
                          option, 
                          (items) => setEditForm(prev => ({ ...prev, dietaryRestrictions: items }))
                        )}
                        disabled={!isEditing}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                          (isEditing ? editForm.dietaryRestrictions : user.preferences.dietaryRestrictions).includes(option)
                            ? 'bg-purple-600 text-white'
                            : theme === 'dark'
                              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        } ${!isEditing ? 'cursor-default' : 'cursor-pointer'}`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Favorite Categories */}
                <div>
                  <label className={`block text-lg font-semibold mb-3 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Favorite Food Categories
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {categoryOptions.map(option => (
                      <button
                        key={option}
                        onClick={() => isEditing && toggleArrayItem(
                          editForm.favoriteCategories, 
                          option, 
                          (items) => setEditForm(prev => ({ ...prev, favoriteCategories: items }))
                        )}
                        disabled={!isEditing}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                          (isEditing ? editForm.favoriteCategories : user.preferences.favoriteCategories).includes(option)
                            ? 'bg-green-600 text-white'
                            : theme === 'dark'
                              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        } ${!isEditing ? 'cursor-default' : 'cursor-pointer'}`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mood Goals */}
                <div>
                  <label className={`block text-lg font-semibold mb-3 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Mood Goals
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {moodGoalOptions.map(option => (
                      <button
                        key={option}
                        onClick={() => isEditing && toggleArrayItem(
                          editForm.moodGoals, 
                          option, 
                          (items) => setEditForm(prev => ({ ...prev, moodGoals: items }))
                        )}
                        disabled={!isEditing}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                          (isEditing ? editForm.moodGoals : user.preferences.moodGoals).includes(option)
                            ? 'bg-orange-600 text-white'
                            : theme === 'dark'
                              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        } ${!isEditing ? 'cursor-default' : 'cursor-pointer'}`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className={`rounded-2xl p-8 shadow-xl border ${
              theme === 'dark' 
                ? 'bg-gray-800/90 border-gray-700' 
                : 'bg-white/80 border-gray-100'
            } backdrop-blur-sm`}>
              <h3 className={`text-2xl font-bold mb-6 flex items-center ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                <Award className="w-6 h-6 mr-3 text-yellow-500" />
                Achievements
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement, index) => {
                  const Icon = achievement.icon;
                  return (
                    <div
                      key={index}
                      className={`p-4 rounded-xl border transition-all duration-200 ${
                        achievement.earned
                          ? theme === 'dark'
                            ? 'bg-gray-700/50 border-gray-600'
                            : 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200'
                          : theme === 'dark'
                            ? 'bg-gray-800/30 border-gray-700'
                            : 'bg-gray-50 border-gray-200'
                      } ${achievement.earned ? 'hover:scale-105' : ''}`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className={`w-8 h-8 ${achievement.color}`} />
                        <div className="flex-1">
                          <h4 className={`font-semibold ${
                            achievement.earned 
                              ? theme === 'dark' ? 'text-white' : 'text-gray-900'
                              : theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                          }`}>
                            {achievement.title}
                          </h4>
                          <p className={`text-sm ${
                            achievement.earned 
                              ? theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                              : theme === 'dark' ? 'text-gray-600' : 'text-gray-500'
                          }`}>
                            {achievement.description}
                          </p>
                        </div>
                        {achievement.earned && (
                          <div className="text-yellow-500">
                            <Star className="w-5 h-5 fill-current" />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
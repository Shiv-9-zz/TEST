import React, { useState, useEffect } from 'react';
import { Utensils, TrendingUp, Target, Calendar, Coffee, Sunrise, Sun, Moon, Bot, Sparkles, Play, ExternalLink, Zap, Award, Users } from 'lucide-react';
import { youtubeService } from '../services/youtube';
import { useTheme } from '../contexts/ThemeContext';
import { useApp } from '../contexts/AppContext';
import { ProgressRings } from './ProgressRings';
import { Notifications } from './Notifications';
import { QuickActions } from './QuickActions';

interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  channelTitle: string;
  publishedAt: string;
  duration: string;
  viewCount: string;
  url: string;
}

interface HomePageProps {
  setActiveTab: (tab: string) => void;
}

export function HomePage({ setActiveTab }: HomePageProps) {
  const { theme } = useTheme();
  const { user, moodEntries, foodEntries } = useApp();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [featuredVideos, setFeaturedVideos] = useState<YouTubeVideo[]>([]);
  const [isLoadingVideos, setIsLoadingVideos] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    loadFeaturedVideos();
  }, []);

  const loadFeaturedVideos = async () => {
    setIsLoadingVideos(true);
    try {
      const videos = await youtubeService.searchMoodCookingVideos('healthy', 3);
      setFeaturedVideos(videos);
    } catch (error) {
      console.error('Failed to load featured videos:', error);
    } finally {
      setIsLoadingVideos(false);
    }
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return { text: 'Good Morning', icon: Sunrise, color: theme === 'dark' ? 'from-yellow-600 to-orange-700' : 'from-yellow-400 to-orange-500' };
    if (hour < 17) return { text: 'Good Afternoon', icon: Sun, color: theme === 'dark' ? 'from-orange-600 to-red-700' : 'from-orange-400 to-red-500' };
    return { text: 'Good Evening', icon: Moon, color: theme === 'dark' ? 'from-purple-600 to-pink-700' : 'from-purple-400 to-pink-500' };
  };

  const greeting = getGreeting();
  const GreetingIcon = greeting.icon;

  const todayStats = [
    { label: 'Meals Logged', value: foodEntries.length.toString(), icon: Utensils, color: theme === 'dark' ? 'bg-green-700' : 'bg-green-500', change: '+1' },
    { label: 'Mood Score', value: user?.stats.averageMood.toString() || '8.2', icon: TrendingUp, color: theme === 'dark' ? 'bg-blue-700' : 'bg-blue-500', change: '+0.4' },
    { label: 'Daily Goal', value: '85%', icon: Target, color: theme === 'dark' ? 'bg-purple-700' : 'bg-purple-500', change: '+12%' },
    { label: 'Streak', value: user?.stats.streakDays.toString() || '14', icon: Calendar, color: theme === 'dark' ? 'bg-orange-700' : 'bg-orange-500', change: '+1' },
  ];

  const featuredRecipes = [
    {
      name: 'Energizing Smoothie Bowl',
      image: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=400',
      mood: '⚡',
      time: '10 min',
      calories: '280'
    },
    {
      name: 'Comfort Pasta',
      image: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=400',
      mood: '🤗',
      time: '25 min',
      calories: '420'
    },
    {
      name: 'Zen Green Tea',
      image: 'https://images.pexels.com/photos/230477/pexels-photo-230477.jpeg?auto=compress&cs=tinysrgb&w=400',
      mood: '🧘',
      time: '5 min',
      calories: '25'
    }
  ];

  const moodInsights = [
    { mood: '😊', food: 'Fresh Fruits', correlation: '92%' },
    { mood: '⚡', food: 'Green Smoothies', correlation: '88%' },
    { mood: '🤗', food: 'Warm Soups', correlation: '85%' },
  ];

  const aiInsights = [
    "Your energy peaks 2-3 hours after protein-rich meals",
    "Green vegetables boost your mood by 85% on average",
    "Weekend cooking sessions increase happiness by 40%"
  ];

  const achievements = [
    { icon: Award, title: '7-Day Streak', description: 'Logged meals for a week!', color: 'text-yellow-500' },
    { icon: Zap, title: 'Energy Booster', description: 'Improved mood by 15%', color: 'text-blue-500' },
    { icon: Users, title: 'Community Star', description: '10 recipe shares', color: 'text-purple-500' }
  ];

  const openVideo = (video: YouTubeVideo) => {
    if (video.url && video.url !== '#') {
      window.open(video.url, '_blank');
    }
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'log-meal':
        setActiveTab('food');
        break;
      case 'mood-check':
        setActiveTab('mood');
        break;
      case 'ai-chat':
        setActiveTab('ai');
        break;
      case 'photo-food':
        setActiveTab('food');
        break;
      default:
        console.log('Quick action:', action);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50'
    }`}>
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className={`absolute inset-0 ${
          theme === 'dark' 
            ? 'bg-gradient-to-r from-blue-900/20 to-purple-900/20' 
            : 'bg-gradient-to-r from-orange-600/20 to-red-600/20'
        }`}></div>
        <div className="relative px-8 py-12">
          <div className="max-w-6xl mx-auto">
            {/* Header with Notifications */}
            <div className="flex justify-between items-start mb-8">
              <div className="text-center flex-1">
                <div className={`inline-flex items-center space-x-3 bg-gradient-to-r ${greeting.color} text-white px-6 py-3 rounded-full shadow-lg mb-4`}>
                  <GreetingIcon className="w-6 h-6" />
                  <span className="text-lg font-semibold">{greeting.text}, {user?.name || 'User'}!</span>
                </div>
                <h1 className={`text-5xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                  Welcome to <span className={`text-transparent bg-clip-text ${
                    theme === 'dark' 
                      ? 'bg-gradient-to-r from-blue-400 to-purple-600' 
                      : 'bg-gradient-to-r from-orange-600 to-red-600'
                  }`}>MoodBites</span>
                </h1>
                <p className={`text-xl max-w-2xl mx-auto mb-6 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Discover the delicious connection between what you eat and how you feel with AI-powered insights.
                </p>
                
                {/* AI Highlight */}
                <div className={`rounded-2xl p-6 max-w-2xl mx-auto border ${
                  theme === 'dark' 
                    ? 'bg-gradient-to-r from-gray-800 to-gray-700 border-gray-600' 
                    : 'bg-gradient-to-r from-purple-100 to-pink-100 border-purple-200'
                }`}>
                  <div className="flex items-center justify-center space-x-3 mb-3">
                    <Bot className={`w-6 h-6 ${theme === 'dark' ? 'text-blue-400' : 'text-purple-600'}`} />
                    <span className={`text-lg font-semibold ${
                      theme === 'dark' ? 'text-white' : 'text-purple-800'
                    }`}>AI-Powered Nutrition Coach</span>
                    <Sparkles className={`w-5 h-5 ${theme === 'dark' ? 'text-blue-400' : 'text-purple-600'}`} />
                  </div>
                  <p className={theme === 'dark' ? 'text-gray-300' : 'text-purple-700'}>
                    Get personalized meal recommendations, mood analysis, and nutrition insights tailored just for you!
                  </p>
                </div>
              </div>
              
              <Notifications />
            </div>

            {/* Progress Rings */}
            <div className={`rounded-2xl p-6 shadow-lg border mb-8 ${
              theme === 'dark' 
                ? 'bg-gray-800/90 border-gray-700' 
                : 'bg-white/80 border-gray-100'
            } backdrop-blur-sm`}>
              <h2 className={`text-2xl font-bold mb-6 text-center ${
                theme === 'dark' ? 'text-white' : 'text-gray-800'
              }`}>
                Today's Progress
              </h2>
              <ProgressRings />
            </div>

            {/* Today's Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
              {todayStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className={`rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border ${
                    theme === 'dark' 
                      ? 'bg-gray-800/90 border-gray-700' 
                      : 'bg-white/80 border-gray-100'
                  } backdrop-blur-sm`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-xl ${stat.color} text-white`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                          {stat.value}
                        </div>
                        <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          {stat.label}
                        </div>
                        <div className="text-xs text-green-600 font-medium mt-1">
                          {stat.change}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-8 pb-12">
        <div className="max-w-6xl mx-auto">
          {/* Achievements */}
          <div className={`rounded-2xl p-6 shadow-lg border mb-8 ${
            theme === 'dark' 
              ? 'bg-gray-800/90 border-gray-700' 
              : 'bg-white/80 border-gray-100'
          } backdrop-blur-sm`}>
            <h2 className={`text-2xl font-bold mb-6 flex items-center ${
              theme === 'dark' ? 'text-white' : 'text-gray-800'
            }`}>
              <Award className="w-6 h-6 mr-3 text-yellow-500" />
              Recent Achievements
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {achievements.map((achievement, index) => {
                const Icon = achievement.icon;
                return (
                  <div key={index} className={`p-4 rounded-xl border transition-all duration-200 hover:scale-105 ${
                    theme === 'dark' 
                      ? 'bg-gray-700/50 border-gray-600 hover:bg-gray-700' 
                      : 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 hover:from-yellow-100 hover:to-orange-100'
                  }`}>
                    <div className="flex items-center space-x-3">
                      <Icon className={`w-8 h-8 ${achievement.color}`} />
                      <div>
                        <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                          {achievement.title}
                        </h3>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          {achievement.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            
            {/* AI Insights */}
            <div className={`rounded-2xl p-6 shadow-lg border ${
              theme === 'dark' 
                ? 'bg-gray-800/90 border-gray-700' 
                : 'bg-white/80 border-purple-100'
            } backdrop-blur-sm`}>
              <h2 className={`text-2xl font-bold mb-6 flex items-center ${
                theme === 'dark' ? 'text-white' : 'text-gray-800'
              }`}>
                <Bot className={`w-6 h-6 mr-3 ${theme === 'dark' ? 'text-blue-400' : 'text-purple-600'}`} />
                AI Insights for You
              </h2>
              <div className="space-y-4">
                {aiInsights.map((insight, index) => (
                  <div key={index} className={`p-4 rounded-xl border ${
                    theme === 'dark' 
                      ? 'bg-gradient-to-r from-gray-700 to-gray-600 border-gray-600' 
                      : 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-100'
                  }`}>
                    <div className="flex items-start space-x-3">
                      <Sparkles className={`w-5 h-5 mt-0.5 ${
                        theme === 'dark' ? 'text-blue-400' : 'text-purple-600'
                      }`} />
                      <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>{insight}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className={`mt-6 p-4 rounded-xl text-white ${
                theme === 'dark' 
                  ? 'bg-gradient-to-r from-blue-700 to-purple-700' 
                  : 'bg-gradient-to-r from-purple-600 to-pink-600'
              }`}>
                <h3 className="font-semibold mb-2 flex items-center">
                  <Bot className="w-5 h-5 mr-2" />
                  Today's AI Recommendation
                </h3>
                <p className="text-sm opacity-90">
                  Based on your mood patterns, try adding omega-3 rich foods like salmon or walnuts to boost your afternoon energy!
                </p>
              </div>
            </div>

            {/* Featured Recipes */}
            <div className={`rounded-2xl p-6 shadow-lg border ${
              theme === 'dark' 
                ? 'bg-gray-800/90 border-gray-700' 
                : 'bg-white/80 border-gray-100'
            } backdrop-blur-sm`}>
              <h2 className={`text-2xl font-bold mb-6 flex items-center ${
                theme === 'dark' ? 'text-white' : 'text-gray-800'
              }`}>
                <Coffee className={`w-6 h-6 mr-3 ${theme === 'dark' ? 'text-orange-400' : 'text-orange-600'}`} />
                Recipes for Your Mood
              </h2>
              <div className="space-y-4">
                {featuredRecipes.map((recipe, index) => (
                  <div 
                    key={index} 
                    className={`flex items-center space-x-4 p-4 rounded-xl transition-colors cursor-pointer group ${
                      theme === 'dark' 
                        ? 'hover:bg-gray-700/50' 
                        : 'hover:bg-orange-50'
                    }`}
                    onClick={() => setActiveTab('recipes')}
                  >
                    <img 
                      src={recipe.image} 
                      alt={recipe.name}
                      className="w-16 h-16 rounded-xl object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                          {recipe.name}
                        </h3>
                        <span className="text-xl">{recipe.mood}</span>
                      </div>
                      <div className={`flex items-center space-x-4 text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        <span>⏱️ {recipe.time}</span>
                        <span>🔥 {recipe.calories} cal</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Featured Cooking Videos */}
          <div className={`rounded-2xl p-6 shadow-lg mb-8 border ${
            theme === 'dark' 
              ? 'bg-gray-800/90 border-gray-700' 
              : 'bg-white/80 border-gray-100'
          } backdrop-blur-sm`}>
            <h2 className={`text-2xl font-bold mb-6 flex items-center ${
              theme === 'dark' ? 'text-white' : 'text-gray-800'
            }`}>
              <Play className="w-6 h-6 mr-3 text-red-600" />
              Featured Cooking Videos
              <span className="ml-3 text-sm bg-red-100 text-red-700 px-3 py-1 rounded-full">
                YouTube
              </span>
            </h2>
            
            {isLoadingVideos ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                <span className={`ml-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Loading videos...
                </span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featuredVideos.map((video, index) => (
                  <div 
                    key={index} 
                    className="group cursor-pointer"
                    onClick={() => openVideo(video)}
                  >
                    <div className="relative overflow-hidden rounded-xl mb-3">
                      <img 
                        src={video.thumbnail} 
                        alt={video.title}
                        className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                        <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Play className="w-6 h-6 text-white ml-1" />
                        </div>
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs">
                        {video.duration}
                      </div>
                    </div>
                    <h3 className={`font-semibold line-clamp-2 mb-1 group-hover:text-red-600 transition-colors ${
                      theme === 'dark' ? 'text-white' : 'text-gray-800'
                    }`}>
                      {video.title}
                    </h3>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {video.channelTitle}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Mood-Food Patterns */}
          <div className={`rounded-2xl p-6 shadow-lg mb-8 border ${
            theme === 'dark' 
              ? 'bg-gray-800/90 border-gray-700' 
              : 'bg-white/80 border-gray-100'
          } backdrop-blur-sm`}>
            <h2 className={`text-2xl font-bold mb-6 flex items-center ${
              theme === 'dark' ? 'text-white' : 'text-gray-800'
            }`}>
              <TrendingUp className={`w-6 h-6 mr-3 ${theme === 'dark' ? 'text-orange-400' : 'text-orange-600'}`} />
              Your Mood-Food Patterns
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {moodInsights.map((insight, index) => (
                <div key={index} className={`flex items-center justify-between p-4 rounded-xl ${
                  theme === 'dark' 
                    ? 'bg-gradient-to-r from-gray-700 to-gray-600' 
                    : 'bg-gradient-to-r from-orange-50 to-yellow-50'
                }`}>
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl">{insight.mood}</div>
                    <div>
                      <div className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                        {insight.food}
                      </div>
                      <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Best mood booster
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">{insight.correlation}</div>
                    <div className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>
                      correlation
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className={`rounded-2xl p-6 shadow-lg border ${
            theme === 'dark' 
              ? 'bg-gray-800/90 border-gray-700' 
              : 'bg-white/80 border-gray-100'
          } backdrop-blur-sm`}>
            <h2 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <button 
                onClick={() => setActiveTab('ai')}
                className={`p-6 rounded-xl text-white hover:shadow-lg transition-all duration-300 hover:scale-105 ${
                  theme === 'dark' 
                    ? 'bg-gradient-to-r from-purple-700 to-pink-700' 
                    : 'bg-gradient-to-r from-purple-500 to-pink-500'
                }`}
              >
                <div className="text-3xl mb-2">🤖</div>
                <div className="font-semibold">Ask AI Coach</div>
                <div className="text-sm opacity-90">Get personalized advice</div>
              </button>
              <button 
                onClick={() => setActiveTab('food')}
                className={`p-6 rounded-xl text-white hover:shadow-lg transition-all duration-300 hover:scale-105 ${
                  theme === 'dark' 
                    ? 'bg-gradient-to-r from-green-700 to-emerald-700' 
                    : 'bg-gradient-to-r from-green-500 to-emerald-500'
                }`}
              >
                <div className="text-3xl mb-2">🍽️</div>
                <div className="font-semibold">Log a Meal</div>
                <div className="text-sm opacity-90">Track what you're eating</div>
              </button>
              <button 
                onClick={() => setActiveTab('mood')}
                className={`p-6 rounded-xl text-white hover:shadow-lg transition-all duration-300 hover:scale-105 ${
                  theme === 'dark' 
                    ? 'bg-gradient-to-r from-blue-700 to-purple-700' 
                    : 'bg-gradient-to-r from-blue-500 to-purple-500'
                }`}
              >
                <div className="text-3xl mb-2">😊</div>
                <div className="font-semibold">Check Your Mood</div>
                <div className="text-sm opacity-90">How are you feeling?</div>
              </button>
              <button 
                onClick={() => setActiveTab('recipes')}
                className={`p-6 rounded-xl text-white hover:shadow-lg transition-all duration-300 hover:scale-105 ${
                  theme === 'dark' 
                    ? 'bg-gradient-to-r from-red-700 to-pink-700' 
                    : 'bg-gradient-to-r from-red-500 to-pink-500'
                }`}
              >
                <div className="text-3xl mb-2">📺</div>
                <div className="font-semibold">Watch Recipes</div>
                <div className="text-sm opacity-90">Learn from cooking videos</div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Quick Actions */}
      <QuickActions onAction={handleQuickAction} />
    </div>
  );
}
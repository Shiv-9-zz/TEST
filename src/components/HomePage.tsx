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
      
      // Check if we only got fallback videos (with url = '#')
      const allFallback = videos.every(video => video.url === '#');
      if (allFallback) {
        console.warn('Only fallback YouTube videos were loaded');
      }
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
    <div className="min-h-screen transition-colors duration-300 bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 backdrop-blur-2xl bg-opacity-90 dark:bg-opacity-90">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-red-600/20 dark:from-blue-900/20 dark:to-purple-900/20"></div>
        <div className="relative px-8 py-16">
          <div className="max-w-6xl mx-auto">
            {/* Header with Notifications */}
            <div className="flex justify-between items-start mb-12">
              <div className="text-center flex-1">
                <div className={`inline-flex items-center space-x-3 bg-gradient-to-r ${greeting.color} text-white px-8 py-4 rounded-3xl shadow-2xl mb-6 backdrop-blur-md`}>
                  <GreetingIcon className="w-8 h-8 drop-shadow-lg" />
                  <span className="text-2xl font-extrabold tracking-tight drop-shadow-lg">{greeting.text}, {user?.name || 'User'}!</span>
                </div>
                <h1 className="text-6xl font-extrabold mb-6 text-gray-800 dark:text-white drop-shadow-lg">
                  Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600 dark:from-blue-400 dark:to-purple-600">
                    MoodBites
                  </span>
                </h1>
                <p className="text-2xl max-w-2xl mx-auto mb-8 text-gray-600 dark:text-gray-300 font-medium opacity-90">
                  Discover the delicious connection between what you eat and how you feel with AI-powered insights.
                </p>
                {/* AI Highlight */}
                <div className="rounded-3xl p-8 max-w-2xl mx-auto border bg-gradient-to-r from-purple-100 to-pink-100 border-purple-200 dark:from-gray-800 dark:to-gray-700 dark:border-gray-600 shadow-xl backdrop-blur-md">
                  <div className="flex items-center justify-center space-x-4 mb-4">
                    <Bot className="w-7 h-7 text-purple-600 dark:text-blue-400 drop-shadow-lg" />
                    <span className="text-xl font-bold text-purple-800 dark:text-white drop-shadow-lg">
                      AI-Powered Nutrition Coach
                    </span>
                    <Sparkles className="w-6 h-6 text-purple-600 dark:text-blue-400 drop-shadow-lg" />
                  </div>
                  <p className="text-purple-700 dark:text-gray-300 text-lg font-medium opacity-90">
                    Get personalized meal recommendations, mood analysis, and nutrition insights tailored just for you!
                  </p>
                </div>
              </div>
              <Notifications />
            </div>
            {/* Progress Rings */}
            <div className="rounded-3xl p-8 shadow-2xl border mb-12 bg-white/80 border-gray-100 dark:bg-gray-800/90 dark:border-gray-700 backdrop-blur-md">
              <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-800 dark:text-white tracking-tight drop-shadow-lg">
                Today's Progress
              </h2>
              <ProgressRings />
            </div>
            {/* Today's Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
              {todayStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border bg-white/80 border-gray-100 dark:bg-gray-800/90 dark:border-gray-700 backdrop-blur-md flex flex-col items-center gap-4">
                    <div className={`p-4 rounded-2xl ${stat.color} shadow-lg`}> {/* stat.color already handles dark/light */}
                      <Icon className="w-8 h-8" />
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-extrabold text-gray-800 dark:text-white drop-shadow-lg">
                        {stat.value}
                      </div>
                      <div className="text-lg text-gray-600 dark:text-gray-400 font-semibold opacity-80">
                        {stat.label}
                      </div>
                      <div className="text-sm text-green-600 font-bold mt-1">
                        {stat.change}
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
      <div className="px-8 pb-16">
        <div className="max-w-6xl mx-auto">
          {/* Achievements */}
          <div className="rounded-3xl p-8 shadow-2xl border mb-12 bg-white/80 border-gray-100 dark:bg-gray-800/90 dark:border-gray-700 backdrop-blur-md">
            <h2 className="text-3xl font-extrabold mb-8 flex items-center text-gray-800 dark:text-white tracking-tight drop-shadow-lg">
              <Award className="w-8 h-8 mr-4 text-yellow-500" />
              Recent Achievements
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {achievements.map((achievement, index) => {
                const Icon = achievement.icon;
                return (
                  <div key={index} className="p-6 rounded-2xl border transition-all duration-300 hover:scale-105 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 hover:from-yellow-100 hover:to-orange-100 dark:bg-gray-700/50 dark:border-gray-600 dark:hover:bg-gray-700 shadow-lg backdrop-blur-md flex items-center gap-4">
                    <Icon className={`w-10 h-10 ${achievement.color} drop-shadow-lg`} />
                    <div>
                      <h3 className="font-bold text-lg text-gray-800 dark:text-white drop-shadow-lg">
                        {achievement.title}
                      </h3>
                      <p className="text-base text-gray-600 dark:text-gray-400 font-medium opacity-80">
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
            {/* AI Insights */}
            <div className="rounded-3xl p-8 shadow-2xl border bg-white/80 border-purple-100 dark:bg-gray-800/90 dark:border-gray-700 backdrop-blur-md">
              <h2 className="text-3xl font-extrabold mb-8 flex items-center text-gray-800 dark:text-white tracking-tight drop-shadow-lg">
                <Bot className="w-8 h-8 mr-4 text-purple-600 dark:text-blue-400 drop-shadow-lg" />
                AI Insights for You
              </h2>
              <div className="space-y-6">
                {aiInsights.map((insight, index) => (
                  <div key={index} className="p-6 rounded-2xl border bg-gradient-to-r from-purple-50 to-pink-50 border-purple-100 dark:from-gray-700 dark:to-gray-600 dark:border-gray-600 shadow-md backdrop-blur-md">
                    <div className="flex items-start space-x-4">
                      <Sparkles className="w-6 h-6 mt-1 text-purple-600 dark:text-blue-400 drop-shadow-lg" />
                      <p className="text-lg text-gray-700 dark:text-gray-300 font-medium opacity-90">{insight}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 p-6 rounded-2xl text-white bg-gradient-to-r from-purple-600 to-pink-600 dark:from-blue-700 dark:to-purple-700 shadow-lg">
                <h3 className="font-bold mb-2 flex items-center text-lg">
                  <Bot className="w-6 h-6 mr-2" />
                  Today's AI Recommendation
                </h3>
                <p className="text-base opacity-90">
                  Based on your mood patterns, try adding omega-3 rich foods like salmon or walnuts to boost your afternoon energy!
                </p>
              </div>
            </div>
            {/* Featured Recipes */}
            <div className="rounded-3xl p-8 shadow-2xl border bg-white/80 border-gray-100 dark:bg-gray-800/90 dark:border-gray-700 backdrop-blur-md">
              <h2 className="text-3xl font-extrabold mb-8 flex items-center text-gray-800 dark:text-white tracking-tight drop-shadow-lg">
                <Coffee className="w-8 h-8 mr-4 text-orange-600 dark:text-orange-400 drop-shadow-lg" />
                Recipes for Your Mood
              </h2>
              <div className="space-y-6">
                {featuredRecipes.map((recipe, index) => (
                  <div 
                    key={index} 
                    className="flex items-center space-x-6 p-6 rounded-2xl transition-colors cursor-pointer group hover:bg-orange-50 dark:hover:bg-gray-700/50 shadow-md backdrop-blur-md"
                    onClick={() => setActiveTab('recipes')}
                  >
                    <img 
                      src={recipe.image} 
                      alt={recipe.name}
                      className="w-20 h-20 rounded-2xl object-cover group-hover:scale-110 transition-transform duration-300 shadow-lg"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-bold text-xl text-gray-800 dark:text-white drop-shadow-lg">
                          {recipe.name}
                        </h3>
                        <span className="text-2xl">{recipe.mood}</span>
                      </div>
                      <div className="flex items-center space-x-6 text-lg text-gray-600 dark:text-gray-400 font-medium opacity-80">
                        <span>⏱️ {recipe.time}</span>
                        <span>🔥 {recipe.calories} cal</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Featured Videos */}
          <div className="rounded-3xl p-8 shadow-2xl border mb-12 bg-white/80 border-gray-100 dark:bg-gray-800/90 dark:border-gray-700 backdrop-blur-md">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-extrabold text-gray-800 dark:text-white tracking-tight drop-shadow-lg">
                Featured Videos
              </h2>
              {featuredVideos.every(video => video.url === '#') && (
                <div className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                  YouTube API unavailable - Showing sample videos
                </div>
              )}
            </div>
            {isLoadingVideos ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {featuredVideos.map((video, index) => (
                  <div
                    key={video.id || index}
                    className="rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-white dark:bg-gray-700 cursor-pointer"
                    onClick={() => openVideo(video)}
                  >
                    <div className="relative">
                      <img 
                        src={video.thumbnail} 
                        alt={video.title} 
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                        <div className="p-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <Play className="w-6 h-6 text-white" />
                            <span className="text-white font-medium">{video.duration}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2 line-clamp-2">{video.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">{video.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 dark:text-gray-400">{video.channelTitle}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{video.viewCount}</span>
                      </div>
                      {video.url === '#' && (
                        <div className="mt-2 text-xs text-yellow-600 dark:text-yellow-400 italic">
                          Sample video - Click to see real content
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Mood-Food Patterns */}
          <div className="rounded-3xl p-8 shadow-2xl mb-12 border bg-white/80 border-gray-100 dark:bg-gray-800/90 dark:border-gray-700 backdrop-blur-md">
            <h2 className="text-3xl font-extrabold mb-8 flex items-center text-gray-800 dark:text-white tracking-tight drop-shadow-lg">
              <TrendingUp className="w-8 h-8 mr-4 text-orange-600 dark:text-orange-400 drop-shadow-lg" />
              Your Mood-Food Patterns
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {moodInsights.map((insight, index) => (
                <div key={index} className="flex items-center justify-between p-6 rounded-2xl bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-gray-700 dark:to-gray-600 shadow-md backdrop-blur-md">
                  <div className="flex items-center space-x-6">
                    <div className="text-4xl">{insight.mood}</div>
                    <div>
                      <div className="font-bold text-lg text-gray-800 dark:text-white drop-shadow-lg">
                        {insight.food}
                      </div>
                      <div className="text-base text-gray-600 dark:text-gray-400 font-medium opacity-80">
                        Best mood booster
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-extrabold text-green-600 drop-shadow-lg">{insight.correlation}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-500 font-medium opacity-80">
                      correlation
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Quick Actions */}
          <div className="rounded-3xl p-8 shadow-2xl border bg-white/80 border-gray-100 dark:bg-gray-800/90 dark:border-gray-700 backdrop-blur-md">
            <h2 className="text-3xl font-extrabold mb-8 text-gray-800 dark:text-white tracking-tight drop-shadow-lg">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <button 
                onClick={() => setActiveTab('ai')}
                className="p-8 rounded-2xl text-white hover:shadow-2xl transition-all duration-300 hover:scale-110 bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-700 dark:to-pink-700 shadow-lg text-xl font-bold flex flex-col items-center gap-2"
              >
                <div className="text-4xl mb-2">🤖</div>
                <div>Ask AI Coach</div>
                <div className="text-base opacity-90 font-medium">Get personalized advice</div>
              </button>
              <button 
                onClick={() => setActiveTab('food')}
                className="p-8 rounded-2xl text-white hover:shadow-2xl transition-all duration-300 hover:scale-110 bg-gradient-to-r from-green-500 to-emerald-500 dark:from-green-700 dark:to-emerald-700 shadow-lg text-xl font-bold flex flex-col items-center gap-2"
              >
                <div className="text-4xl mb-2">🍽️</div>
                <div>Log a Meal</div>
                <div className="text-base opacity-90 font-medium">Track what you're eating</div>
              </button>
              <button 
                onClick={() => setActiveTab('mood')}
                className="p-8 rounded-2xl text-white hover:shadow-2xl transition-all duration-300 hover:scale-110 bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-700 dark:to-purple-700 shadow-lg text-xl font-bold flex flex-col items-center gap-2"
              >
                <div className="text-4xl mb-2">😊</div>
                <div>Check Your Mood</div>
                <div className="text-base opacity-90 font-medium">How are you feeling?</div>
              </button>
              <button 
                onClick={() => setActiveTab('recipes')}
                className="p-8 rounded-2xl text-white hover:shadow-2xl transition-all duration-300 hover:scale-110 bg-gradient-to-r from-red-500 to-pink-500 dark:from-red-700 dark:to-pink-700 shadow-lg text-xl font-bold flex flex-col items-center gap-2"
              >
                <div className="text-4xl mb-2">📺</div>
                <div>Watch Recipes</div>
                <div className="text-base opacity-90 font-medium">Learn from cooking videos</div>
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
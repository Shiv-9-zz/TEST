import React from 'react';
import { TrendingUp, Calendar, Target, Brain, ArrowRight, Bot, Heart, Utensils } from 'lucide-react';
import { MoodFoodCorrelation } from './charts/MoodFoodCorrelation';
import { WeeklyProgress } from './charts/WeeklyProgress';
import { useApp } from '../contexts/AppContext';

interface AnalyticsProps {
  setActiveTab: (tab: string) => void;
}

export function Analytics({ setActiveTab }: AnalyticsProps) {
  const { user, moodEntries, foodEntries } = useApp();

  const insights = [
    {
      title: 'Mood-Food Pattern',
      description: 'You feel happiest 2-3 hours after eating protein-rich meals',
      icon: Brain,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Best Eating Times',
      description: 'Your energy peaks when you eat breakfast before 9 AM',
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Weekly Trend',
      description: 'Your mood scores are 15% higher this week compared to last week',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Goal Progress',
      description: 'You\'re 85% towards your weekly nutrition goals',
      icon: Target,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  const avgMood = moodEntries.length > 0 
    ? (moodEntries.reduce((sum, entry) => sum + entry.mood, 0) / moodEntries.length).toFixed(1)
    : '0.0';

  const totalCalories = foodEntries.reduce((sum, entry) => sum + entry.calories, 0);
  const avgCalories = foodEntries.length > 0 ? Math.round(totalCalories / foodEntries.length) : 0;

  const trackingConsistency = Math.min(100, Math.round(((moodEntries.length + foodEntries.length) / 14) * 100));

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics & Insights</h1>
        <p className="text-gray-600">Discover patterns between your mood and eating habits.</p>
      </div>

      {/* AI-Powered Insights Banner */}
      <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-6 mb-8 border border-purple-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Bot className="w-8 h-8 text-purple-600" />
            <div>
              <h3 className="text-lg font-bold text-purple-800">AI-Powered Analytics</h3>
              <p className="text-purple-700">Get deeper insights with our AI nutrition coach</p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('ai')}
            className="bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition-colors flex items-center space-x-2"
          >
            <span>Ask AI for Analysis</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Insights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {insights.map((insight, index) => {
          const Icon = insight.icon;
          return (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-xl ${insight.bgColor}`}>
                  <Icon className={`w-6 h-6 ${insight.color}`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">{insight.title}</h3>
                  <p className="text-gray-600 text-sm">{insight.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Mood-Food Correlation</h3>
          <MoodFoodCorrelation />
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Progress</h3>
          <WeeklyProgress />
        </div>
      </div>

      {/* Detailed Statistics */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Your Statistics</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{avgMood}</div>
            <div className="text-sm text-gray-600">Average Mood Score</div>
            <div className="text-xs text-green-600 mt-1">
              {moodEntries.length > 0 ? '+0.5 from last week' : 'Start tracking to see trends'}
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{avgCalories}</div>
            <div className="text-sm text-gray-600">Average Daily Calories</div>
            <div className="text-xs text-green-600 mt-1">
              {foodEntries.length > 0 ? 'Within target range' : 'Start logging food'}
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">{trackingConsistency}%</div>
            <div className="text-sm text-gray-600">Tracking Consistency</div>
            <div className="text-xs text-green-600 mt-1">
              {trackingConsistency > 70 ? 'Great job!' : 'Keep it up!'}
            </div>
          </div>
        </div>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl p-6 border border-pink-200">
          <Heart className="w-8 h-8 text-pink-600 mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-2">Track More Moods</h3>
          <p className="text-gray-600 text-sm mb-4">
            {moodEntries.length === 0 
              ? 'Start tracking your mood to see patterns'
              : `You've logged ${moodEntries.length} mood entries. Keep going!`
            }
          </p>
          <button
            onClick={() => setActiveTab('mood')}
            className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors flex items-center space-x-2"
          >
            <span>Track Mood</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
          <Utensils className="w-8 h-8 text-green-600 mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-2">Log More Foods</h3>
          <p className="text-gray-600 text-sm mb-4">
            {foodEntries.length === 0 
              ? 'Start logging your meals to see nutrition patterns'
              : `You've logged ${foodEntries.length} food entries. Great progress!`
            }
          </p>
          <button
            onClick={() => setActiveTab('food')}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <span>Log Food</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-200">
          <Bot className="w-8 h-8 text-purple-600 mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-2">AI Insights</h3>
          <p className="text-gray-600 text-sm mb-4">
            Get personalized recommendations based on your data patterns.
          </p>
          <button
            onClick={() => setActiveTab('ai')}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
          >
            <span>Ask AI</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
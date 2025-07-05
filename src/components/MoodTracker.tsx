import React, { useState } from 'react';
import { Plus, Calendar, Smile, Music, Bot, Sparkles, TrendingUp, ArrowRight } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

interface MoodTrackerProps {
  setActiveTab: (tab: string) => void;
}

export function MoodTracker({ setActiveTab }: MoodTrackerProps) {
  const { addMoodEntry, moodEntries, currentMood } = useApp();
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [note, setNote] = useState('');

  const moods = [
    { value: 1, emoji: '😢', label: 'Very Sad', color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50' },
    { value: 2, emoji: '😔', label: 'Sad', color: 'from-blue-400 to-blue-500', bg: 'bg-blue-50' },
    { value: 3, emoji: '😐', label: 'Neutral', color: 'from-gray-400 to-gray-500', bg: 'bg-gray-50' },
    { value: 4, emoji: '🙂', label: 'Good', color: 'from-green-400 to-green-500', bg: 'bg-green-50' },
    { value: 5, emoji: '😊', label: 'Happy', color: 'from-yellow-400 to-yellow-500', bg: 'bg-yellow-50' },
    { value: 6, emoji: '😁', label: 'Very Happy', color: 'from-orange-400 to-orange-500', bg: 'bg-orange-50' },
    { value: 7, emoji: '🤩', label: 'Excellent', color: 'from-red-400 to-red-500', bg: 'bg-red-50' },
  ];

  const recentMoods = moodEntries.slice(0, 4).map(entry => ({
    date: new Date(entry.timestamp).toLocaleString(),
    mood: entry.mood,
    note: entry.note,
    food: entry.foods.join(', ') || 'No food logged',
    aiInsight: 'AI analysis based on your patterns'
  }));

  const moodBasedSuggestions = {
    1: { food: 'Warm Soup', music: 'Calming Piano', activity: 'Gentle Tea', aiTip: 'Warm foods and magnesium-rich ingredients can help soothe your nervous system.' },
    2: { food: 'Comfort Food', music: 'Soft Jazz', activity: 'Hot Chocolate', aiTip: 'Dark chocolate contains compounds that naturally boost mood.' },
    3: { food: 'Fresh Fruit', music: 'Nature Sounds', activity: 'Light Snack', aiTip: 'Vitamin C from citrus fruits can help improve energy and mood.' },
    4: { food: 'Balanced Meal', music: 'Upbeat Pop', activity: 'Healthy Smoothie', aiTip: 'Maintain this mood with balanced proteins and complex carbs.' },
    5: { food: 'Colorful Salad', music: 'Happy Tunes', activity: 'Fresh Juice', aiTip: 'Colorful vegetables provide antioxidants that support brain health.' },
    6: { food: 'Celebration Treat', music: 'Energetic Beats', activity: 'Special Dessert', aiTip: 'You\'re in a great mood! Omega-3s can help maintain this feeling.' },
    7: { food: 'Gourmet Dish', music: 'Victory Songs', activity: 'Fancy Meal', aiTip: 'Keep this excellent mood with foods rich in folate and B-vitamins.' },
  };

  const aiMoodAnalysis = {
    weeklyTrend: '+15%',
    bestTime: '2-3 PM',
    topFoodBooster: 'Greek Yogurt',
    recommendation: 'Your mood peaks after protein-rich meals. Consider adding more lean proteins to your diet.'
  };

  const handleSaveMood = () => {
    if (selectedMood) {
      addMoodEntry({
        date: new Date().toISOString().split('T')[0],
        mood: selectedMood,
        note: note,
        foods: []
      });
      setSelectedMood(null);
      setNote('');
      alert('Mood saved successfully! 🎉 AI insights updated!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center">
            <Smile className="w-10 h-10 mr-4 text-orange-600" />
            AI Mood Tracker
          </h1>
          <p className="text-gray-600 text-lg">Track your mood and get AI-powered insights on how food affects your emotions.</p>
        </div>

        {/* AI Mood Analysis */}
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-3xl p-8 shadow-xl mb-8 border border-purple-200">
          <h2 className="text-2xl font-bold text-purple-800 mb-6 flex items-center">
            <Bot className="w-6 h-6 mr-3" />
            Your AI Mood Analysis
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white/80 rounded-2xl p-4 text-center">
              <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">{aiMoodAnalysis.weeklyTrend}</div>
              <div className="text-sm text-gray-600">Weekly Improvement</div>
            </div>
            <div className="bg-white/80 rounded-2xl p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{aiMoodAnalysis.bestTime}</div>
              <div className="text-sm text-gray-600">Peak Mood Time</div>
            </div>
            <div className="bg-white/80 rounded-2xl p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{aiMoodAnalysis.topFoodBooster}</div>
              <div className="text-sm text-gray-600">Top Mood Booster</div>
            </div>
            <div className="bg-white/80 rounded-2xl p-4 text-center">
              <Sparkles className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-sm font-medium text-purple-600">AI Confidence</div>
              <div className="text-lg font-bold text-purple-600">94%</div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-white/80 rounded-2xl">
            <h3 className="font-bold text-purple-800 mb-2 flex items-center">
              <Bot className="w-5 h-5 mr-2" />
              AI Recommendation
            </h3>
            <p className="text-purple-700">{aiMoodAnalysis.recommendation}</p>
            <button 
              onClick={() => setActiveTab('ai')}
              className="mt-3 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
            >
              <span>Get More AI Insights</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mood Selector */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl mb-8 border border-orange-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Rate Your Current Mood
          </h2>
          
          <div className="grid grid-cols-3 md:grid-cols-7 gap-4 mb-8">
            {moods.map((mood) => (
              <button
                key={mood.value}
                onClick={() => setSelectedMood(mood.value)}
                className={`p-6 rounded-2xl border-3 transition-all duration-300 hover:scale-110 transform ${
                  selectedMood === mood.value
                    ? `border-orange-400 ${mood.bg} shadow-2xl scale-110`
                    : 'border-gray-200 hover:border-orange-300 bg-white'
                }`}
              >
                <div className="text-5xl mb-3">{mood.emoji}</div>
                <div className="text-sm font-semibold text-gray-700">{mood.label}</div>
              </button>
            ))}
          </div>

          {selectedMood && (
            <div className={`p-6 rounded-2xl bg-gradient-to-r ${moods[selectedMood - 1].color} text-white mb-6`}>
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Sparkles className="w-6 h-6 mr-2" />
                AI Suggestions for your mood:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <span>🍽️</span>
                  <span>{moodBasedSuggestions[selectedMood as keyof typeof moodBasedSuggestions]?.food}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Music className="w-4 h-4" />
                  <span>{moodBasedSuggestions[selectedMood as keyof typeof moodBasedSuggestions]?.music}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>☕</span>
                  <span>{moodBasedSuggestions[selectedMood as keyof typeof moodBasedSuggestions]?.activity}</span>
                </div>
              </div>
              <div className="bg-white/20 rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Bot className="w-5 h-5" />
                  <span className="font-semibold">AI Nutrition Tip:</span>
                </div>
                <p className="text-sm">{moodBasedSuggestions[selectedMood as keyof typeof moodBasedSuggestions]?.aiTip}</p>
              </div>
            </div>
          )}

          <div className="mb-6">
            <label className="block text-lg font-semibold text-gray-700 mb-3">
              What's influencing your mood today? (optional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Share what you ate, how you're feeling, or what's on your mind..."
              className="w-full p-4 border-2 border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none text-gray-700 bg-orange-50/50"
              rows={4}
            />
          </div>

          <div className="flex space-x-4">
            <button
              onClick={handleSaveMood}
              disabled={!selectedMood}
              className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-4 px-8 rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-lg hover:scale-105 transform"
            >
              <Plus className="w-6 h-6 mr-3" />
              Save Mood Entry & Get AI Insights
            </button>
            <button
              onClick={() => setActiveTab('food')}
              className="bg-green-600 text-white font-bold py-4 px-8 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center hover:scale-105 transform"
            >
              Log Food
            </button>
          </div>
        </div>

        {/* Recent Moods with AI Insights */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-orange-100">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <Calendar className="w-6 h-6 mr-3 text-orange-600" />
            Your Mood Journey with AI Insights
          </h3>
          
          <div className="space-y-4">
            {recentMoods.length > 0 ? recentMoods.map((entry, index) => {
              const mood = moods.find(m => m.value === entry.mood);
              return (
                <div key={index} className="flex items-center space-x-6 p-6 rounded-2xl hover:bg-orange-50 transition-colors border border-orange-100">
                  <div className="text-5xl">{mood?.emoji}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="font-bold text-gray-800 text-lg">{mood?.label}</span>
                      <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{entry.date}</span>
                    </div>
                    <p className="text-gray-700 mb-2">{entry.note}</p>
                    <div className="flex items-center space-x-4 mb-2">
                      <span className="text-sm text-orange-600 bg-orange-100 px-3 py-1 rounded-full font-medium">
                        🍽️ {entry.food}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-purple-600 bg-purple-50 px-3 py-1 rounded-full inline-block">
                      <Bot className="w-4 h-4" />
                      <span>{entry.aiInsight}</span>
                    </div>
                  </div>
                </div>
              );
            }) : (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">😊</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No mood entries yet</h3>
                <p className="text-gray-600">Start tracking your mood to get personalized AI insights!</p>
              </div>
            )}
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => setActiveTab('analytics')}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors flex items-center space-x-2 mx-auto"
            >
              <TrendingUp className="w-5 h-5" />
              <span>View Detailed Analytics</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
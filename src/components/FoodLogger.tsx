import React, { useState } from 'react';
import { Search, Plus, Clock, Utensils, Camera, Zap, Bot, Sparkles, TrendingUp, ArrowRight } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

interface FoodLoggerProps {
  setActiveTab: (tab: string) => void;
}

export function FoodLogger({ setActiveTab }: FoodLoggerProps) {
  const { addFoodEntry, foodEntries, currentMood } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMeal, setSelectedMeal] = useState('breakfast');
  const [showAIRecommendations, setShowAIRecommendations] = useState(true);

  const mealTypes = [
    { id: 'breakfast', label: 'Breakfast', icon: '🌅', color: 'from-yellow-400 to-orange-500' },
    { id: 'lunch', label: 'Lunch', icon: '☀️', color: 'from-orange-400 to-red-500' },
    { id: 'dinner', label: 'Dinner', icon: '🌙', color: 'from-purple-400 to-pink-500' },
    { id: 'snack', label: 'Snack', icon: '🍎', color: 'from-green-400 to-blue-500' },
  ];

  const foodSuggestions = [
    { 
      name: 'Avocado Toast', 
      calories: 250, 
      category: 'Healthy', 
      mood: '😊',
      image: 'https://images.pexels.com/photos/566566/pexels-photo-566566.jpeg?auto=compress&cs=tinysrgb&w=200',
      benefits: 'Boosts happiness',
      aiScore: 95
    },
    { 
      name: 'Greek Yogurt with Berries', 
      calories: 180, 
      category: 'Protein', 
      mood: '⚡',
      image: 'https://images.pexels.com/photos/704555/pexels-photo-704555.jpeg?auto=compress&cs=tinysrgb&w=200',
      benefits: 'Increases energy',
      aiScore: 92
    },
    { 
      name: 'Quinoa Buddha Bowl', 
      calories: 320, 
      category: 'Healthy', 
      mood: '🧘',
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=200',
      benefits: 'Promotes calm',
      aiScore: 88
    },
    { 
      name: 'Grilled Salmon', 
      calories: 280, 
      category: 'Protein', 
      mood: '💪',
      image: 'https://images.pexels.com/photos/725991/pexels-photo-725991.jpeg?auto=compress&cs=tinysrgb&w=200',
      benefits: 'Brain power',
      aiScore: 90
    },
    { 
      name: 'Green Smoothie', 
      calories: 150, 
      category: 'Healthy', 
      mood: '⚡',
      image: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=200',
      benefits: 'Energy boost',
      aiScore: 87
    },
    { 
      name: 'Dark Chocolate', 
      calories: 120, 
      category: 'Treat', 
      mood: '😍',
      image: 'https://images.pexels.com/photos/65882/chocolate-dark-coffee-confiserie-65882.jpeg?auto=compress&cs=tinysrgb&w=200',
      benefits: 'Mood lifter',
      aiScore: 75
    },
  ];

  const aiRecommendations = [
    {
      title: "Perfect for Your Current Mood",
      description: "Based on your recent mood patterns, these foods will boost your energy:",
      foods: ['Greek Yogurt with Berries', 'Green Smoothie', 'Quinoa Buddha Bowl']
    },
    {
      title: "Nutritional Balance",
      description: "You're low on omega-3s today. Consider these options:",
      foods: ['Grilled Salmon', 'Avocado Toast']
    }
  ];

  const recentMeals = foodEntries.slice(0, 3).map(entry => ({
    time: new Date(entry.timestamp).toLocaleTimeString(),
    meal: entry.mealType,
    items: [entry.name],
    calories: entry.calories,
    mood: entry.mood,
    image: 'https://images.pexels.com/photos/704555/pexels-photo-704555.jpeg?auto=compress&cs=tinysrgb&w=100',
    aiInsight: 'Great choice! This food supports your mood goals.'
  }));

  const filteredSuggestions = foodSuggestions.filter(food =>
    food.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddFood = (food: any) => {
    addFoodEntry({
      name: food.name,
      calories: food.calories,
      mealType: selectedMeal,
      mood: food.mood
    });
    alert(`${food.name} added to ${selectedMeal}! 🎉`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center">
            <Utensils className="w-10 h-10 mr-4 text-orange-600" />
            AI-Powered Food Logger
          </h1>
          <p className="text-gray-600 text-lg">Track your meals and get personalized AI recommendations for optimal mood and nutrition.</p>
        </div>

        {/* AI Recommendations */}
        {showAIRecommendations && (
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-3xl p-8 shadow-xl mb-8 border border-purple-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-purple-800 flex items-center">
                <Bot className="w-6 h-6 mr-3" />
                AI Recommendations for You
              </h2>
              <button 
                onClick={() => setShowAIRecommendations(false)}
                className="text-purple-600 hover:text-purple-800"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {aiRecommendations.map((rec, index) => (
                <div key={index} className="bg-white/80 rounded-2xl p-6 border border-purple-200">
                  <div className="flex items-center space-x-2 mb-3">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    <h3 className="font-bold text-purple-800">{rec.title}</h3>
                  </div>
                  <p className="text-purple-700 text-sm mb-4">{rec.description}</p>
                  <div className="space-y-2">
                    {rec.foods.map((food, idx) => (
                      <div key={idx} className="flex items-center space-x-2 text-sm">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span className="text-purple-800 font-medium">{food}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={() => setActiveTab('ai')}
                className="bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition-colors flex items-center space-x-2 mx-auto"
              >
                <Bot className="w-5 h-5" />
                <span>Get More AI Insights</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Meal Type Selector */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl mb-8 border border-orange-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">What are you eating?</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {mealTypes.map((meal) => (
              <button
                key={meal.id}
                onClick={() => setSelectedMeal(meal.id)}
                className={`p-6 rounded-2xl border-3 transition-all duration-300 hover:scale-105 transform ${
                  selectedMeal === meal.id
                    ? 'border-orange-400 bg-gradient-to-r ' + meal.color + ' text-white shadow-2xl scale-105'
                    : 'border-gray-200 hover:border-orange-300 bg-white'
                }`}
              >
                <div className="text-4xl mb-3">{meal.icon}</div>
                <div className={`font-bold text-lg ${selectedMeal === meal.id ? 'text-white' : 'text-gray-800'}`}>
                  {meal.label}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Food Search */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl mb-8 border border-orange-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <Search className="w-6 h-6 mr-3 text-orange-600" />
            Find Your Food
          </h2>
          
          <div className="relative mb-8">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for delicious foods..."
              className="w-full pl-12 pr-4 py-4 border-2 border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg bg-orange-50/50"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSuggestions.map((food, index) => (
              <div
                key={index}
                className="group p-6 border-2 border-orange-200 rounded-2xl hover:border-orange-400 hover:bg-orange-50 transition-all duration-300 cursor-pointer hover:scale-105 transform bg-white relative"
              >
                {/* AI Score Badge */}
                <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center space-x-1">
                  <Bot className="w-3 h-3" />
                  <span>{food.aiScore}%</span>
                </div>
                
                <div className="flex items-start space-x-4">
                  <img 
                    src={food.image} 
                    alt={food.name}
                    className="w-16 h-16 rounded-xl object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-gray-800 text-lg">{food.name}</h3>
                      <div className="text-2xl">{food.mood}</div>
                    </div>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm text-orange-600 font-semibold">{food.calories} cal</span>
                      <span className="text-sm bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                        {food.category}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-green-600 mb-2">
                      <Zap className="w-4 h-4" />
                      <span>{food.benefits}</span>
                    </div>
                    <div className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded-full inline-block mb-3">
                      AI Match: {food.aiScore}% for your goals
                    </div>
                    <button
                      onClick={() => handleAddFood(food)}
                      className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-2 px-4 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add to {mealTypes.find(m => m.id === selectedMeal)?.label}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mt-8">
            <button className="flex items-center space-x-2 px-6 py-3 text-gray-600 hover:bg-orange-50 rounded-xl transition-colors border-2 border-gray-200 hover:border-orange-300">
              <Camera className="w-5 h-5" />
              <span>Take Photo</span>
            </button>
            <button
              onClick={() => setActiveTab('recipes')}
              className="bg-green-600 text-white font-bold py-3 px-8 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center space-x-2 hover:scale-105 transform"
            >
              <span>Find Recipes</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Today's Meals with AI Insights */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-orange-100">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <Clock className="w-6 h-6 mr-3 text-orange-600" />
            Today's Food Journey
          </h3>
          
          <div className="space-y-6">
            {recentMeals.length > 0 ? recentMeals.map((meal, index) => (
              <div key={index} className="flex items-center space-x-6 p-6 rounded-2xl hover:bg-orange-50 transition-colors border-2 border-orange-100">
                <img 
                  src={meal.image} 
                  alt={meal.meal}
                  className="w-20 h-20 rounded-2xl object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="font-bold text-gray-800 text-lg">{meal.meal}</span>
                    <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{meal.time}</span>
                    <div className="text-2xl">{meal.mood}</div>
                  </div>
                  <p className="text-gray-700 mb-2">{meal.items.join(', ')}</p>
                  <div className="flex items-center space-x-4 mb-2">
                    <span className="text-orange-600 font-semibold bg-orange-100 px-3 py-1 rounded-full">
                      🔥 {meal.calories} calories
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-purple-600 bg-purple-50 px-3 py-1 rounded-full inline-block">
                    <Bot className="w-4 h-4" />
                    <span>{meal.aiInsight}</span>
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🍽️</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No meals logged yet</h3>
                <p className="text-gray-600">Start logging your meals to get personalized AI insights!</p>
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-center space-x-4">
            <button
              onClick={() => setActiveTab('mood')}
              className="bg-pink-600 text-white px-6 py-3 rounded-xl hover:bg-pink-700 transition-colors flex items-center space-x-2"
            >
              <span>Track Mood</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <TrendingUp className="w-5 h-5" />
              <span>View Analytics</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
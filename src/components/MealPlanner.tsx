import React, { useState } from 'react';
import { Calendar, Plus, ChefHat, Clock, Utensils, ArrowRight, Bot, Target } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

interface MealPlannerProps {
  setActiveTab: (tab: string) => void;
}

export function MealPlanner({ setActiveTab }: MealPlannerProps) {
  const { addFoodEntry, currentMood } = useApp();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState<'week' | 'day'>('week');

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

  const mealPlan = {
    '2024-01-15': {
      breakfast: { name: 'Green Smoothie Bowl', calories: 280, mood: '⚡' },
      lunch: { name: 'Quinoa Salad', calories: 420, mood: '😊' },
      dinner: { name: 'Grilled Salmon', calories: 380, mood: '🧘' },
      snack: { name: 'Greek Yogurt', calories: 150, mood: '😌' },
    },
    '2024-01-16': {
      breakfast: { name: 'Oatmeal with Berries', calories: 250, mood: '😊' },
      lunch: { name: 'Buddha Bowl', calories: 450, mood: '⚡' },
      dinner: { name: 'Lentil Curry', calories: 400, mood: '🤗' },
      snack: { name: 'Almonds', calories: 120, mood: '😌' },
    },
  };

  const getCurrentWeekDates = () => {
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 1));
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      return date.toISOString().split('T')[0];
    });
  };

  const weekDates = getCurrentWeekDates();

  const handleAddMeal = (meal: any) => {
    addFoodEntry({
      name: meal.name,
      calories: meal.calories,
      mealType: 'planned',
      mood: meal.mood
    });
    alert(`${meal.name} added to your meal plan! 📅`);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Meal Planner</h1>
        <p className="text-gray-600">Plan your meals based on your mood goals and nutritional needs.</p>
      </div>

      {/* AI Meal Planning Banner */}
      <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-2xl p-6 mb-8 border border-green-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Bot className="w-8 h-8 text-green-600" />
            <div>
              <h3 className="text-lg font-bold text-green-800">AI Meal Planning</h3>
              <p className="text-green-700">Get personalized meal plans based on your mood: {currentMood}/7</p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('ai')}
            className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <span>Get AI Meal Plan</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* View Toggle */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-purple-500" />
            <span className="font-medium text-gray-900">Meal Planning</span>
          </div>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('week')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'week' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
              }`}
            >
              Week View
            </button>
            <button
              onClick={() => setViewMode('day')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'day' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
              }`}
            >
              Day View
            </button>
          </div>
        </div>

        {viewMode === 'week' ? (
          /* Week View */
          <div className="overflow-x-auto">
            <div className="grid grid-cols-8 gap-4 min-w-full">
              {/* Header */}
              <div className="font-medium text-gray-900">Meals</div>
              {weekDates.map((date, index) => (
                <div key={date} className="text-center">
                  <div className="font-medium text-gray-900">{daysOfWeek[index]}</div>
                  <div className="text-sm text-gray-500">{new Date(date).getDate()}</div>
                </div>
              ))}

              {/* Meal Rows */}
              {mealTypes.map((mealType) => (
                <React.Fragment key={mealType}>
                  <div className="font-medium text-gray-700 py-4">{mealType}</div>
                  {weekDates.map((date) => {
                    const meal = mealPlan[date]?.[mealType.toLowerCase()];
                    return (
                      <div key={`${date}-${mealType}`} className="py-2">
                        {meal ? (
                          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-3 rounded-lg border border-green-200 cursor-pointer hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium text-gray-900">{meal.name}</span>
                              <span className="text-lg">{meal.mood}</span>
                            </div>
                            <div className="text-xs text-gray-600 mb-2">{meal.calories} cal</div>
                            <button
                              onClick={() => handleAddMeal(meal)}
                              className="w-full bg-green-600 text-white text-xs py-1 px-2 rounded hover:bg-green-700 transition-colors"
                            >
                              Add to Log
                            </button>
                          </div>
                        ) : (
                          <button className="w-full h-16 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors flex items-center justify-center group">
                            <Plus className="w-5 h-5 text-gray-400 group-hover:text-purple-500" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        ) : (
          /* Day View */
          <div>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="mb-6 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {mealTypes.map((mealType) => {
                const meal = mealPlan[selectedDate]?.[mealType.toLowerCase()];
                return (
                  <div key={mealType} className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900">{mealType}</h3>
                      <Utensils className="w-5 h-5 text-gray-400" />
                    </div>
                    
                    {meal ? (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900">{meal.name}</span>
                          <span className="text-2xl">{meal.mood}</span>
                        </div>
                        <div className="text-sm text-gray-600 mb-4">{meal.calories} calories</div>
                        <div className="flex space-x-2">
                          <button className="flex-1 bg-purple-100 text-purple-700 py-2 px-3 rounded-lg text-sm font-medium hover:bg-purple-200 transition-colors">
                            Edit
                          </button>
                          <button 
                            onClick={() => handleAddMeal(meal)}
                            className="flex-1 bg-green-100 text-green-700 py-2 px-3 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors"
                          >
                            Add to Log
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Plus className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                        <p className="text-gray-500 text-sm mb-4">No meal planned</p>
                        <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded-lg text-sm font-medium hover:shadow-md transition-all duration-200">
                          Add Meal
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Meal Suggestions */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <ChefHat className="w-5 h-5 mr-2 text-purple-500" />
          Suggested Meals for Your Mood
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: 'Energy Boost Bowl', mood: '⚡', time: '20 min', calories: 380 },
            { name: 'Comfort Pasta', mood: '🤗', time: '25 min', calories: 450 },
            { name: 'Calming Tea & Toast', mood: '🧘', time: '10 min', calories: 200 },
          ].map((suggestion, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-colors cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">{suggestion.name}</span>
                <span className="text-2xl">{suggestion.mood}</span>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{suggestion.time}</span>
                </div>
                <span>{suggestion.calories} cal</span>
              </div>
              <button
                onClick={() => handleAddMeal(suggestion)}
                className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
              >
                Add to Plan
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => setActiveTab('recipes')}
          className="p-4 bg-green-100 hover:bg-green-200 rounded-xl transition-colors flex items-center space-x-3"
        >
          <span className="text-2xl">📖</span>
          <span className="text-green-800 font-medium">Browse Recipes</span>
          <ArrowRight className="w-4 h-4 text-green-600" />
        </button>
        <button
          onClick={() => setActiveTab('food')}
          className="p-4 bg-orange-100 hover:bg-orange-200 rounded-xl transition-colors flex items-center space-x-3"
        >
          <span className="text-2xl">🍽️</span>
          <span className="text-orange-800 font-medium">Log Current Meal</span>
          <ArrowRight className="w-4 h-4 text-orange-600" />
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className="p-4 bg-blue-100 hover:bg-blue-200 rounded-xl transition-colors flex items-center space-x-3"
        >
          <Target className="w-5 h-5 text-blue-600" />
          <span className="text-blue-800 font-medium">Track Progress</span>
          <ArrowRight className="w-4 h-4 text-blue-600" />
        </button>
      </div>
    </div>
  );
}
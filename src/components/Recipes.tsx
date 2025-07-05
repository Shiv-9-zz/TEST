import React, { useState, useEffect } from 'react';
import { Clock, Users, Heart, Star, Filter, Loader2, ExternalLink, Play, Eye, ArrowRight, Bot } from 'lucide-react';
import { recipeService } from '../services/recipes';
import { youtubeService } from '../services/youtube';
import { useApp } from '../contexts/AppContext';

interface Recipe {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
  summary: string;
  nutrition?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

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

interface RecipesProps {
  setActiveTab: (tab: string) => void;
}

export function Recipes({ setActiveTab }: RecipesProps) {
  const { favoriteRecipes, toggleFavoriteRecipe, currentMood } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMood, setSelectedMood] = useState('all');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingVideos, setIsLoadingVideos] = useState(false);
  const [internalActiveTab, setInternalActiveTab] = useState<'recipes' | 'videos'>('recipes');

  const categories = [
    { id: 'all', label: 'All Recipes' },
    { id: 'breakfast', label: 'Breakfast' },
    { id: 'lunch', label: 'Lunch' },
    { id: 'dinner', label: 'Dinner' },
    { id: 'snacks', label: 'Snacks' },
  ];

  const moodFilters = [
    { id: 'all', label: 'All Moods', emoji: '🌈' },
    { id: 'happy', label: 'Mood Lifting', emoji: '😊' },
    { id: 'energetic', label: 'Energy Boost', emoji: '⚡' },
    { id: 'comfort', label: 'Comfort Food', emoji: '🤗' },
    { id: 'calm', label: 'Calming', emoji: '🧘' },
    { id: 'healthy', label: 'Healthy', emoji: '🥗' },
  ];

  useEffect(() => {
    loadRecipes();
    loadVideos();
  }, [selectedMood]);

  const loadRecipes = async () => {
    setIsLoading(true);
    try {
      let fetchedRecipes: Recipe[];
      if (selectedMood === 'all') {
        fetchedRecipes = await recipeService.searchRecipesByMood('healthy', 12);
      } else {
        fetchedRecipes = await recipeService.searchRecipesByMood(selectedMood, 12);
      }
      setRecipes(fetchedRecipes);
    } catch (error) {
      console.error('Failed to load recipes:', error);
      // Load fallback recipes
      setRecipes([
        {
          id: 1,
          title: 'Rainbow Buddha Bowl',
          image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
          readyInMinutes: 25,
          servings: 2,
          summary: 'Colorful and nutritious bowl packed with quinoa, roasted vegetables, and tahini dressing.',
          nutrition: { calories: 420, protein: 15, carbs: 65, fat: 12 }
        },
        {
          id: 2,
          title: 'Blueberry Overnight Oats',
          image: 'https://images.pexels.com/photos/704555/pexels-photo-704555.jpeg?auto=compress&cs=tinysrgb&w=400',
          readyInMinutes: 5,
          servings: 1,
          summary: 'Creamy overnight oats with fresh blueberries and a touch of honey.',
          nutrition: { calories: 280, protein: 12, carbs: 45, fat: 8 }
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadVideos = async () => {
    setIsLoadingVideos(true);
    try {
      let fetchedVideos: YouTubeVideo[];
      if (selectedMood === 'all') {
        fetchedVideos = await youtubeService.getCookingChannels();
      } else {
        fetchedVideos = await youtubeService.searchMoodCookingVideos(selectedMood, 8);
      }
      setVideos(fetchedVideos);
    } catch (error) {
      console.error('Failed to load videos:', error);
    } finally {
      setIsLoadingVideos(false);
    }
  };

  const filteredRecipes = recipes.filter(recipe => {
    if (selectedCategory === 'all') return true;
    // Simple category filtering based on recipe title/summary
    const content = (recipe.title + ' ' + recipe.summary).toLowerCase();
    return content.includes(selectedCategory);
  });

  const openVideo = (video: YouTubeVideo) => {
    if (video.url && video.url !== '#') {
      window.open(video.url, '_blank');
    }
  };

  const handleFavoriteToggle = (recipeId: number) => {
    toggleFavoriteRecipe(recipeId.toString());
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
          Mood-Boosting Recipes & Videos
          <span className="ml-3 text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full">
            Powered by Recipe & YouTube APIs
          </span>
        </h1>
        <p className="text-gray-600">Discover recipes and cooking videos that will nourish your body and lift your spirits.</p>
      </div>

      {/* AI Recommendations Banner */}
      <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-6 mb-8 border border-blue-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Bot className="w-8 h-8 text-purple-600" />
            <div>
              <h3 className="text-lg font-bold text-purple-800">AI Recipe Recommendations</h3>
              <p className="text-purple-700">Get personalized recipe suggestions based on your mood: {currentMood}/7</p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('ai')}
            className="bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition-colors flex items-center space-x-2"
          >
            <span>Ask AI for Recipes</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
        <div className="flex items-center space-x-4 mb-6">
          <button
            onClick={() => setInternalActiveTab('recipes')}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 ${
              internalActiveTab === 'recipes'
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span>📖</span>
            <span>Recipes</span>
          </button>
          <button
            onClick={() => setInternalActiveTab('videos')}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 ${
              internalActiveTab === 'videos'
                ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Play className="w-4 h-4" />
            <span>Cooking Videos</span>
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <span className="font-medium text-gray-900">Filters</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mood & Nutrition</label>
            <div className="flex flex-wrap gap-2">
              {moodFilters.map((mood) => (
                <button
                  key={mood.id}
                  onClick={() => setSelectedMood(mood.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1 ${
                    selectedMood === mood.id
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  disabled={isLoading || isLoadingVideos}
                >
                  <span>{mood.emoji}</span>
                  <span>{mood.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content based on active tab */}
      {internalActiveTab === 'recipes' ? (
        <>
          {/* Loading State for Recipes */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-green-600 mr-3" />
              <span className="text-lg text-gray-600">Loading delicious recipes...</span>
            </div>
          )}

          {/* Recipe Grid */}
          {!isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRecipes.map((recipe) => (
                <div key={recipe.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow group">
                  <div className="relative overflow-hidden">
                    <img 
                      src={recipe.image} 
                      alt={recipe.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4">
                      <button 
                        onClick={() => handleFavoriteToggle(recipe.id)}
                        className="p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
                      >
                        <Heart className={`w-4 h-4 ${
                          favoriteRecipes.includes(recipe.id.toString()) 
                            ? 'text-red-500 fill-current' 
                            : 'text-gray-600'
                        }`} />
                      </button>
                    </div>
                    {recipe.nutrition && (
                      <div className="absolute bottom-4 left-4 bg-black/70 text-white px-2 py-1 rounded-lg text-sm">
                        🔥 {recipe.nutrition.calories} cal
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 line-clamp-1">{recipe.title}</h3>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600">4.5</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2" 
                       dangerouslySetInnerHTML={{ __html: recipe.summary.replace(/<[^>]*>/g, '') }} />
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{recipe.readyInMinutes} min</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{recipe.servings} servings</span>
                      </div>
                    </div>
                    
                    {recipe.nutrition && (
                      <div className="grid grid-cols-3 gap-2 mb-4 text-xs">
                        <div className="text-center p-2 bg-blue-50 rounded">
                          <div className="font-semibold text-blue-600">{recipe.nutrition.protein}g</div>
                          <div className="text-gray-600">Protein</div>
                        </div>
                        <div className="text-center p-2 bg-green-50 rounded">
                          <div className="font-semibold text-green-600">{recipe.nutrition.carbs}g</div>
                          <div className="text-gray-600">Carbs</div>
                        </div>
                        <div className="text-center p-2 bg-yellow-50 rounded">
                          <div className="font-semibold text-yellow-600">{recipe.nutrition.fat}g</div>
                          <div className="text-gray-600">Fat</div>
                        </div>
                      </div>
                    )}
                    
                    <button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium py-2 px-4 rounded-xl hover:shadow-md transition-all duration-200 flex items-center justify-center space-x-2">
                      <span>View Recipe</span>
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State for Recipes */}
          {!isLoading && filteredRecipes.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🍽️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No recipes found</h3>
              <p className="text-gray-600">Try adjusting your filters or check your API configuration.</p>
            </div>
          )}
        </>
      ) : (
        <>
          {/* Loading State for Videos */}
          {isLoadingVideos && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-red-600 mr-3" />
              <span className="text-lg text-gray-600">Loading cooking videos...</span>
            </div>
          )}

          {/* Video Grid */}
          {!isLoadingVideos && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {videos.map((video) => (
                <div 
                  key={video.id} 
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer"
                  onClick={() => openVideo(video)}
                >
                  <div className="relative overflow-hidden">
                    <img 
                      src={video.thumbnail} 
                      alt={video.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                      <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Play className="w-8 h-8 text-white ml-1" />
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-sm">
                      {video.duration}
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-red-600 transition-colors">
                      {video.title}
                    </h3>
                    
                    <p className="text-sm text-gray-600 mb-2">{video.channelTitle}</p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Eye className="w-3 h-3" />
                        <span>{video.viewCount}</span>
                      </div>
                      <span>{new Date(video.publishedAt).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <button className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium py-2 px-4 rounded-xl hover:shadow-md transition-all duration-200 flex items-center justify-center space-x-2">
                        <Play className="w-4 h-4" />
                        <span>Watch on YouTube</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State for Videos */}
          {!isLoadingVideos && videos.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📺</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No videos found</h3>
              <p className="text-gray-600">Try adjusting your filters or check your YouTube API configuration.</p>
            </div>
          )}
        </>
      )}

      {/* Navigation Links */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => setActiveTab('food')}
          className="p-4 bg-green-100 hover:bg-green-200 rounded-xl transition-colors flex items-center space-x-3"
        >
          <span className="text-2xl">🍽️</span>
          <span className="text-green-800 font-medium">Log Your Meals</span>
          <ArrowRight className="w-4 h-4 text-green-600" />
        </button>
        <button
          onClick={() => setActiveTab('planner')}
          className="p-4 bg-blue-100 hover:bg-blue-200 rounded-xl transition-colors flex items-center space-x-3"
        >
          <span className="text-2xl">📅</span>
          <span className="text-blue-800 font-medium">Plan Your Meals</span>
          <ArrowRight className="w-4 h-4 text-blue-600" />
        </button>
        <button
          onClick={() => setActiveTab('social')}
          className="p-4 bg-purple-100 hover:bg-purple-200 rounded-xl transition-colors flex items-center space-x-3"
        >
          <span className="text-2xl">👥</span>
          <span className="text-purple-800 font-medium">Share with Community</span>
          <ArrowRight className="w-4 h-4 text-purple-600" />
        </button>
      </div>
    </div>
  );
}
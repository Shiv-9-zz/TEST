import React, { useState, useEffect } from 'react';
import { 
  Home,
  Heart, 
  UtensilsCrossed, 
  BarChart3, 
  ChefHat,
  Users,
  Calendar,
  Music,
  Play,
  Pause,
  Volume2,
  Bot,
  Loader2,
  ExternalLink,
  Sun,
  Moon,
  Settings,
  User,
  SkipForward,
  SkipBack,
  Shuffle,
  Repeat
} from 'lucide-react';
import { spotifyService } from '../services/spotify';
import { useTheme } from '../contexts/ThemeContext';
import { useApp } from '../contexts/AppContext';

type ActiveTab = 'home' | 'mood' | 'food' | 'analytics' | 'recipes' | 'social' | 'planner' | 'ai' | 'profile';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

interface SpotifyTrack {
  id: string;
  name: string;
  artists: { name: string }[];
  duration_ms: number;
  preview_url: string | null;
  external_urls: { spotify: string };
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const { theme, toggleTheme } = useTheme();
  const { user } = useApp();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState(0);
  const [musicRecommendations, setMusicRecommendations] = useState<SpotifyTrack[]>([]);
  const [isLoadingMusic, setIsLoadingMusic] = useState(false);
  const [selectedMoodForMusic, setSelectedMoodForMusic] = useState('cooking');
  const [volume, setVolume] = useState(75);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);

  const menuItems = [
    { id: 'home' as ActiveTab, label: 'Home', icon: Home },
    { id: 'ai' as ActiveTab, label: 'AI Coach', icon: Bot },
    { id: 'mood' as ActiveTab, label: 'Mood Tracker', icon: Heart },
    { id: 'food' as ActiveTab, label: 'Food Logger', icon: UtensilsCrossed },
    { id: 'analytics' as ActiveTab, label: 'Analytics', icon: BarChart3 },
    { id: 'recipes' as ActiveTab, label: 'Recipes', icon: ChefHat },
    { id: 'social' as ActiveTab, label: 'Social', icon: Users },
    { id: 'planner' as ActiveTab, label: 'Meal Planner', icon: Calendar },
    { id: 'profile' as ActiveTab, label: 'Profile', icon: User },
  ];

  const moodOptions = [
    { emoji: '😊', label: 'Happy', color: theme === 'dark' ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-700', mood: 'happy' },
    { emoji: '😌', label: 'Calm', color: theme === 'dark' ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700', mood: 'calm' },
    { emoji: '⚡', label: 'Energetic', color: theme === 'dark' ? 'bg-orange-900 text-orange-300' : 'bg-orange-100 text-orange-700', mood: 'energetic' },
    { emoji: '🤗', label: 'Comfort', color: theme === 'dark' ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-700', mood: 'comfort' },
    { emoji: '🧘', label: 'Zen', color: theme === 'dark' ? 'bg-purple-900 text-purple-300' : 'bg-purple-100 text-purple-700', mood: 'calm' },
    { emoji: '👨‍🍳', label: 'Cooking', color: theme === 'dark' ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-700', mood: 'cooking' },
  ];

  useEffect(() => {
    loadMusicRecommendations('cooking');
  }, []);

  const loadMusicRecommendations = async (mood: string) => {
    setIsLoadingMusic(true);
    try {
      const tracks = await spotifyService.searchMoodBasedMusic(mood, 6);
      setMusicRecommendations(tracks);
      setSelectedMoodForMusic(mood);
      console.log('Loaded music recommendations:', tracks);
    } catch (error) {
      console.error('Failed to load music recommendations:', error);
    } finally {
      setIsLoadingMusic(false);
    }
  };

  const handleMoodClick = (mood: string) => {
    loadMusicRecommendations(mood);
  };

  const openSpotifyTrack = (track: SpotifyTrack) => {
    if (track.external_urls?.spotify && track.external_urls.spotify !== '#') {
      window.open(track.external_urls.spotify, '_blank');
    }
  };

  const handlePlayPause = (index: number) => {
    if (currentSong === index && isPlaying) {
      setIsPlaying(false);
    } else {
      setCurrentSong(index);
      setIsPlaying(true);
    }
  };

  const handleNext = () => {
    if (musicRecommendations.length > 0) {
      const nextIndex = (currentSong + 1) % musicRecommendations.length;
      setCurrentSong(nextIndex);
    }
  };

  const handlePrevious = () => {
    if (musicRecommendations.length > 0) {
      const prevIndex = currentSong === 0 ? musicRecommendations.length - 1 : currentSong - 1;
      setCurrentSong(prevIndex);
    }
  };

  return (
    <div className={`w-80 min-h-screen shadow-2xl transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-b from-amber-900 via-orange-800 to-red-900'
    }`}>
      {/* Header */}
      <div className={`p-6 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-orange-700/30'}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${
              theme === 'dark' 
                ? 'bg-gradient-to-r from-blue-500 to-purple-600' 
                : 'bg-gradient-to-r from-yellow-400 to-orange-500'
            }`}>
              <UtensilsCrossed className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                MoodBites
              </h1>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-orange-200'}`}>
                AI-Powered Nutrition
              </p>
            </div>
          </div>
          
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-xl transition-all duration-200 hover:scale-110 ${
              theme === 'dark' 
                ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' 
                : 'bg-orange-700/50 hover:bg-orange-600/50 text-orange-200'
            }`}
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

        {/* User Info */}
        {user && (
          <div 
            className={`flex items-center space-x-3 p-3 rounded-xl cursor-pointer transition-colors ${
              theme === 'dark' 
                ? 'bg-gray-700/50 hover:bg-gray-700' 
                : 'bg-orange-700/30 hover:bg-orange-700/50'
            }`}
            onClick={() => setActiveTab('profile')}
          >
            <img 
              src={user.avatar} 
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover border-2 border-white/20"
            />
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium truncate">{user.name}</p>
              <p className={`text-sm truncate ${theme === 'dark' ? 'text-gray-300' : 'text-orange-200'}`}>
                {user.stats.streakDays} day streak
              </p>
            </div>
          </div>
        )}
      </div>
      
      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? theme === 'dark'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105'
                    : 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg transform scale-105'
                  : theme === 'dark'
                    ? 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                    : 'text-orange-100 hover:bg-orange-800/50 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
              {item.id === 'ai' && (
                <div className="ml-auto w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Quick Mood Selector */}
      <div className={`p-4 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-orange-700/30'}`}>
        <h3 className={`text-sm font-semibold mb-3 flex items-center ${
          theme === 'dark' ? 'text-gray-300' : 'text-orange-200'
        }`}>
          <Heart className="w-4 h-4 mr-2" />
          Quick Mood & Music
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {moodOptions.map((mood, index) => (
            <button
              key={index}
              onClick={() => handleMoodClick(mood.mood)}
              className={`p-2 rounded-lg hover:scale-105 transition-transform duration-200 text-center ${
                mood.color
              } ${selectedMoodForMusic === mood.mood ? 'ring-2 ring-blue-400' : ''}`}
            >
              <div className="text-lg mb-1">{mood.emoji}</div>
              <div className="text-xs font-medium">{mood.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Spotify Music Player */}
      <div className={`p-4 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-orange-700/30'}`}>
        <h3 className={`text-sm font-semibold mb-3 flex items-center ${
          theme === 'dark' ? 'text-gray-300' : 'text-orange-200'
        }`}>
          <Music className="w-4 h-4 mr-2" />
          Spotify Music Player
          <span className="ml-2 text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
            Live
          </span>
        </h3>
        
        {/* Current Playing Track */}
        {musicRecommendations.length > 0 && (
          <div className={`p-3 rounded-lg mb-3 ${
            theme === 'dark' 
              ? 'bg-gray-700/50 border border-gray-600' 
              : 'bg-orange-700/50 border border-orange-500/50'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">
                  {musicRecommendations[currentSong]?.name || 'No track selected'}
                </p>
                <p className={`text-xs truncate ${
                  theme === 'dark' ? 'text-gray-400' : 'text-orange-300'
                }`}>
                  {musicRecommendations[currentSong]?.artists.map(artist => artist.name).join(', ') || ''}
                </p>
              </div>
              <button
                onClick={() => openSpotifyTrack(musicRecommendations[currentSong])}
                className={`ml-2 transition-colors ${
                  theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-orange-300 hover:text-white'
                }`}
                title="Open in Spotify"
              >
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
            
            {/* Player Controls */}
            <div className="flex items-center justify-center space-x-3 mb-2">
              <button
                onClick={() => setIsShuffled(!isShuffled)}
                className={`transition-colors ${
                  isShuffled 
                    ? 'text-green-400' 
                    : theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-orange-300 hover:text-white'
                }`}
              >
                <Shuffle className="w-4 h-4" />
              </button>
              <button
                onClick={handlePrevious}
                className={`transition-colors ${
                  theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-orange-300 hover:text-white'
                }`}
              >
                <SkipBack className="w-4 h-4" />
              </button>
              <button
                onClick={() => handlePlayPause(currentSong)}
                className={`p-2 rounded-full transition-colors ${
                  theme === 'dark' 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'bg-orange-600 hover:bg-orange-700 text-white'
                }`}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <button
                onClick={handleNext}
                className={`transition-colors ${
                  theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-orange-300 hover:text-white'
                }`}
              >
                <SkipForward className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsRepeating(!isRepeating)}
                className={`transition-colors ${
                  isRepeating 
                    ? 'text-green-400' 
                    : theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-orange-300 hover:text-white'
                }`}
              >
                <Repeat className="w-4 h-4" />
              </button>
            </div>
            
            {/* Progress Bar */}
            <div className={`w-full rounded-full h-1 mb-2 ${
              theme === 'dark' ? 'bg-gray-600' : 'bg-orange-800/50'
            }`}>
              <div className={`h-1 rounded-full w-1/3 ${
                theme === 'dark' 
                  ? 'bg-gradient-to-r from-blue-400 to-purple-500' 
                  : 'bg-gradient-to-r from-yellow-400 to-orange-500'
              }`}></div>
            </div>
            
            <div className="flex justify-between text-xs text-gray-400">
              <span>1:23</span>
              <span>{musicRecommendations[currentSong] ? spotifyService.formatDuration(musicRecommendations[currentSong].duration_ms) : '0:00'}</span>
            </div>
          </div>
        )}
        
        {isLoadingMusic ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className={`w-6 h-6 animate-spin ${theme === 'dark' ? 'text-gray-400' : 'text-orange-300'}`} />
            <span className={`ml-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-orange-300'}`}>
              Loading music...
            </span>
          </div>
        ) : (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {musicRecommendations.map((track, index) => (
              <div
                key={track.id}
                className={`p-3 rounded-lg transition-all duration-200 cursor-pointer group ${
                  currentSong === index
                    ? theme === 'dark'
                      ? 'bg-gray-700/70 border border-gray-600'
                      : 'bg-orange-700/70 border border-orange-500/50'
                    : theme === 'dark'
                      ? 'bg-gray-800/30 hover:bg-gray-700/40'
                      : 'bg-orange-800/30 hover:bg-orange-700/40'
                }`}
                onClick={() => setCurrentSong(index)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{track.name}</p>
                    <p className={`text-xs truncate ${
                      theme === 'dark' ? 'text-gray-400' : 'text-orange-300'
                    }`}>
                      {track.artists.map(artist => artist.name).join(', ')}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 ml-2">
                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-orange-300'}`}>
                      {spotifyService.formatDuration(track.duration_ms)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayPause(index);
                      }}
                      className={`transition-colors ${
                        theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-orange-300 hover:text-white'
                      }`}
                    >
                      {isPlaying && currentSong === index ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openSpotifyTrack(track);
                      }}
                      className={`transition-colors opacity-0 group-hover:opacity-100 ${
                        theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-orange-300 hover:text-white'
                      }`}
                      title="Open in Spotify"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Volume Control */}
        <div className="mt-4 flex items-center space-x-2">
          <Volume2 className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-orange-300'}`} />
          <div className={`flex-1 rounded-full h-2 ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-orange-800/50'
          }`}>
            <div 
              className={`h-2 rounded-full ${
                theme === 'dark' 
                  ? 'bg-gradient-to-r from-blue-400 to-purple-500' 
                  : 'bg-gradient-to-r from-yellow-400 to-orange-500'
              }`}
              style={{ width: `${volume}%` }}
            ></div>
          </div>
          <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-orange-300'}`}>
            {volume}%
          </span>
        </div>
        
        <div className={`mt-2 text-xs text-center ${
          theme === 'dark' ? 'text-gray-500' : 'text-orange-300'
        }`}>
          Powered by Spotify API • {musicRecommendations.length} tracks loaded
        </div>
      </div>
    </div>
  );
}
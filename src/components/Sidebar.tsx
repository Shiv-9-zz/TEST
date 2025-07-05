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
    <div className="w-80 min-h-screen shadow-2xl transition-colors duration-300 bg-gradient-to-b from-amber-900 via-orange-800 to-red-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 backdrop-blur-xl bg-opacity-80 dark:bg-opacity-80">
      {/* Header */}
      <div className="p-8 border-b border-orange-700/30 dark:border-gray-700 flex flex-col gap-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-3xl flex items-center justify-center shadow-xl bg-gradient-to-r from-yellow-400 to-orange-500 dark:from-blue-500 dark:to-purple-600">
              <UtensilsCrossed className="w-8 h-8 text-white drop-shadow-lg" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white drop-shadow-lg">
                MoodBites
              </h1>
              <p className="text-base text-orange-200 dark:text-gray-300 font-medium opacity-80">
                AI-Powered Nutrition
              </p>
            </div>
          </div>
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-3 rounded-2xl transition-all duration-300 hover:scale-110 bg-orange-700/50 hover:bg-orange-600/50 text-orange-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-yellow-400 shadow-md backdrop-blur-md"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
          </button>
        </div>
        {/* User Info */}
        {user && (
          <div 
            className="flex items-center space-x-4 p-4 rounded-2xl cursor-pointer transition-all duration-300 bg-orange-700/30 hover:bg-orange-700/50 dark:bg-gray-700/50 dark:hover:bg-gray-700 shadow-lg backdrop-blur-md group"
            onClick={() => setActiveTab('profile')}
          >
            <img 
              src={user.avatar} 
              alt={user.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-white/30 group-hover:scale-105 transition-transform duration-300 shadow-md"
            />
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold truncate text-lg">{user.name}</p>
              <p className="text-sm truncate text-orange-200 dark:text-gray-300 opacity-80">
                {user.stats.streakDays} day streak
              </p>
            </div>
          </div>
        )}
      </div>
      {/* Navigation */}
      <nav className="p-6 space-y-3">
        <h2 className="text-lg font-bold text-orange-100 dark:text-gray-200 mb-2 tracking-wide uppercase opacity-80">Menu</h2>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={
                `w-full flex items-center space-x-4 px-5 py-3 rounded-2xl transition-all duration-300
                text-lg font-medium shadow-sm
                ${isActive ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg scale-105 dark:from-blue-600 dark:to-purple-600' : 'text-orange-100 hover:bg-orange-800/60 hover:text-white dark:text-gray-300 dark:hover:bg-gray-700/60 dark:hover:text-white opacity-90'}
                hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 dark:focus:ring-blue-500`
              }
            >
              <Icon className="w-6 h-6" />
              <span className="font-semibold">{item.label}</span>
              {item.id === 'ai' && (
                <div className="ml-auto w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              )}
            </button>
          );
        })}
      </nav>
      {/* Quick Mood Selector */}
      <div className="p-6 border-t border-orange-700/30 dark:border-gray-700">
        <h3 className="text-base font-bold mb-4 flex items-center text-orange-200 dark:text-gray-300 tracking-wide uppercase opacity-80">
          <Heart className="w-5 h-5 mr-2" />
          Quick Mood & Music
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {moodOptions.map((mood, index) => (
            <button
              key={index}
              onClick={() => handleMoodClick(mood.mood)}
              className={`p-3 rounded-xl hover:scale-110 transition-transform duration-300 text-center shadow-md backdrop-blur-md ${selectedMoodForMusic === mood.mood ? 'ring-2 ring-blue-400' : ''} ${theme === 'dark' ? mood.color.replace(/bg-\w+-100/g, 'bg-yellow-900').replace(/text-\w+-700/g, 'text-yellow-300') : mood.color}`}
            >
              <div className="text-2xl mb-1 drop-shadow-lg">{mood.emoji}</div>
              <div className="text-xs font-semibold opacity-90">{mood.label}</div>
            </button>
          ))}
        </div>
      </div>
      {/* Spotify Music Player */}
      <div className="p-6 border-t border-orange-700/30 dark:border-gray-700">
        <h3 className="text-base font-bold mb-4 flex items-center text-orange-200 dark:text-gray-300 tracking-wide uppercase opacity-80">
          <Music className="w-5 h-5 mr-2" />
          Spotify Music Player
          <span className="ml-2 text-xs bg-green-500 text-white px-2 py-0.5 rounded-full shadow-sm">
            Live
          </span>
        </h3>
        {/* Current Playing Track */}
        {musicRecommendations.length > 0 && (
          <div className="p-4 rounded-2xl mb-4 bg-orange-700/50 border border-orange-500/50 dark:bg-gray-700/50 dark:border-gray-600 shadow-lg backdrop-blur-md">
            <div className="flex items-center justify-between mb-2">
              <div className="flex-1 min-w-0">
                <p className="text-white text-base font-semibold truncate">
                  {musicRecommendations[currentSong]?.name || 'No track selected'}
                </p>
                <p className="text-xs truncate text-orange-300 dark:text-gray-400 opacity-80">
                  {musicRecommendations[currentSong]?.artists.map(artist => artist.name).join(', ') || ''}
                </p>
              </div>
              <button
                onClick={() => openSpotifyTrack(musicRecommendations[currentSong])}
                className="ml-2 transition-colors text-orange-300 hover:text-white dark:text-gray-400 dark:hover:text-white"
                title="Open in Spotify"
              >
                <ExternalLink className="w-5 h-5" />
              </button>
            </div>
            {/* Player Controls */}
            <div className="flex items-center justify-center space-x-4 mb-2">
              <button
                onClick={() => setIsShuffled(!isShuffled)}
                className={`transition-colors ${isShuffled ? 'text-green-400' : 'text-orange-300 hover:text-white dark:text-gray-400 dark:hover:text-white'} text-lg`}
                aria-label="Shuffle"
              >
                <Shuffle className="w-5 h-5" />
              </button>
              <button
                onClick={handlePrevious}
                className="transition-colors text-orange-300 hover:text-white dark:text-gray-400 dark:hover:text-white text-lg"
                aria-label="Previous"
              >
                <SkipBack className="w-5 h-5" />
              </button>
              <button
                onClick={() => handlePlayPause(currentSong)}
                className="p-3 rounded-full transition-colors bg-orange-600 hover:bg-orange-700 text-white dark:bg-blue-600 dark:hover:bg-blue-700 shadow-md"
                aria-label="Play/Pause"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>
              <button
                onClick={handleNext}
                className="transition-colors text-orange-300 hover:text-white dark:text-gray-400 dark:hover:text-white text-lg"
                aria-label="Next"
              >
                <SkipForward className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsRepeating(!isRepeating)}
                className={`transition-colors ${isRepeating ? 'text-green-400' : 'text-orange-300 hover:text-white dark:text-gray-400 dark:hover:text-white'} text-lg`}
                aria-label="Repeat"
              >
                <Repeat className="w-5 h-5" />
              </button>
            </div>
            {/* Progress Bar */}
            <div className="w-full rounded-full h-2 mb-2 bg-orange-800/50 dark:bg-gray-600">
              <div className="h-2 rounded-full w-1/3 bg-gradient-to-r from-yellow-400 to-orange-500 dark:from-blue-400 dark:to-purple-500 shadow-md"></div>
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>1:23</span>
              <span>{musicRecommendations[currentSong] ? spotifyService.formatDuration(musicRecommendations[currentSong].duration_ms) : '0:00'}</span>
            </div>
          </div>
        )}
        {isLoadingMusic ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="w-6 h-6 animate-spin text-orange-300 dark:text-gray-400" />
            <span className="ml-2 text-sm text-orange-300 dark:text-gray-400">
              Loading music...
            </span>
          </div>
        ) : (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {musicRecommendations.map((track, index) => (
              <div
                key={track.id}
                className={`p-3 rounded-xl transition-all duration-300 cursor-pointer group ${currentSong === index ? 'bg-orange-700/70 border border-orange-500/50 dark:bg-gray-700/70 dark:border-gray-600 scale-105 shadow-lg' : 'bg-orange-800/30 hover:bg-orange-700/40 dark:bg-gray-800/30 dark:hover:bg-gray-700/40 opacity-90'} backdrop-blur-md`}
                onClick={() => setCurrentSong(index)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-semibold truncate">{track.name}</p>
                    <p className="text-xs truncate text-orange-300 dark:text-gray-400 opacity-80">
                      {track.artists.map(artist => artist.name).join(', ')}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 ml-2">
                    <span className="text-xs text-orange-300 dark:text-gray-400">
                      {spotifyService.formatDuration(track.duration_ms)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayPause(index);
                      }}
                      className="transition-colors text-orange-300 hover:text-white dark:text-gray-400 dark:hover:text-white"
                      aria-label="Play/Pause"
                    >
                      {isPlaying && currentSong === index ? (
                        <Pause className="w-5 h-5" />
                      ) : (
                        <Play className="w-5 h-5" />
                      )}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openSpotifyTrack(track);
                      }}
                      className="transition-colors opacity-0 group-hover:opacity-100 text-orange-300 hover:text-white dark:text-gray-400 dark:hover:text-white"
                      title="Open in Spotify"
                      aria-label="Open in Spotify"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {/* Volume Control */}
        <div className="mt-4 flex items-center space-x-3">
          <Volume2 className="w-5 h-5 text-orange-300 dark:text-gray-400" />
          <div className="flex-1 rounded-full h-3 bg-orange-800/50 dark:bg-gray-700 shadow-inner">
            <div 
              className="h-3 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 dark:from-blue-400 dark:to-purple-500 shadow-md"
              style={{ width: `${volume}%` }}
            ></div>
          </div>
          <span className="text-xs text-orange-300 dark:text-gray-400 font-semibold">
            {volume}%
          </span>
        </div>
        <div className="mt-3 text-xs text-center text-orange-300 dark:text-gray-500 opacity-80">
          Powered by Spotify API • {musicRecommendations.length} tracks loaded
        </div>
      </div>
    </div>
  );
}
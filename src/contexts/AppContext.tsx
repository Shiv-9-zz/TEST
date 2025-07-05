import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  joinDate: string;
  preferences: {
    dietaryRestrictions: string[];
    favoriteCategories: string[];
    moodGoals: string[];
  };
  stats: {
    totalMeals: number;
    averageMood: number;
    streakDays: number;
    recipesShared: number;
  };
}

interface MoodEntry {
  id: string;
  date: string;
  mood: number;
  note: string;
  foods: string[];
  timestamp: Date;
}

interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  mealType: string;
  mood: string;
  timestamp: Date;
  image?: string;
}

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  moodEntries: MoodEntry[];
  addMoodEntry: (entry: Omit<MoodEntry, 'id' | 'timestamp'>) => void;
  foodEntries: FoodEntry[];
  addFoodEntry: (entry: Omit<FoodEntry, 'id' | 'timestamp'>) => void;
  favoriteRecipes: string[];
  toggleFavoriteRecipe: (recipeId: string) => void;
  currentMood: number;
  setCurrentMood: (mood: number) => void;
  language: string;
  setLanguage: (lang: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('moodbites_user');
    return saved ? JSON.parse(saved) : {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=200',
      joinDate: '2024-01-01',
      preferences: {
        dietaryRestrictions: ['vegetarian'],
        favoriteCategories: ['healthy', 'comfort'],
        moodGoals: ['energy', 'happiness']
      },
      stats: {
        totalMeals: 156,
        averageMood: 8.2,
        streakDays: 14,
        recipesShared: 8
      }
    };
  });

  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>(() => {
    const saved = localStorage.getItem('moodbites_moods');
    return saved ? JSON.parse(saved) : [];
  });

  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>(() => {
    const saved = localStorage.getItem('moodbites_foods');
    return saved ? JSON.parse(saved) : [];
  });

  const [favoriteRecipes, setFavoriteRecipes] = useState<string[]>(() => {
    const saved = localStorage.getItem('moodbites_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentMood, setCurrentMood] = useState<number>(7);
  const [language, setLanguage] = useState(() => localStorage.getItem('chatbotLang') || 'en');

  useEffect(() => {
    if (user) {
      localStorage.setItem('moodbites_user', JSON.stringify(user));
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('moodbites_moods', JSON.stringify(moodEntries));
  }, [moodEntries]);

  useEffect(() => {
    localStorage.setItem('moodbites_foods', JSON.stringify(foodEntries));
  }, [foodEntries]);

  useEffect(() => {
    localStorage.setItem('moodbites_favorites', JSON.stringify(favoriteRecipes));
  }, [favoriteRecipes]);

  useEffect(() => {
    localStorage.setItem('chatbotLang', language);
  }, [language]);

  const addMoodEntry = (entry: Omit<MoodEntry, 'id' | 'timestamp'>) => {
    const newEntry: MoodEntry = {
      ...entry,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    setMoodEntries(prev => [newEntry, ...prev]);
    setCurrentMood(entry.mood);
  };

  const addFoodEntry = (entry: Omit<FoodEntry, 'id' | 'timestamp'>) => {
    const newEntry: FoodEntry = {
      ...entry,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    setFoodEntries(prev => [newEntry, ...prev]);
  };

  const toggleFavoriteRecipe = (recipeId: string) => {
    setFavoriteRecipes(prev => 
      prev.includes(recipeId) 
        ? prev.filter(id => id !== recipeId)
        : [...prev, recipeId]
    );
  };

  return (
    <AppContext.Provider value={{
      user,
      setUser,
      moodEntries,
      addMoodEntry,
      foodEntries,
      addFoodEntry,
      favoriteRecipes,
      toggleFavoriteRecipe,
      currentMood,
      setCurrentMood,
      language,
      setLanguage
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
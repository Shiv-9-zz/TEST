import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'sunny' | 'rainy' | 'cloudy' | 'night';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  setThemeByWeather: (weather: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme');
    return (saved as Theme) || 'light';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark' || theme === 'night');
    document.documentElement.classList.toggle('sunny', theme === 'sunny');
    document.documentElement.classList.toggle('rainy', theme === 'rainy');
    document.documentElement.classList.toggle('cloudy', theme === 'cloudy');
    document.documentElement.classList.toggle('night', theme === 'night');
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'night';
      return 'light';
    });
  };

  const setThemeByWeather = (weather: string) => {
    if (weather.includes('rain')) setTheme('rainy');
    else if (weather.includes('cloud')) setTheme('cloudy');
    else if (weather.includes('clear')) setTheme('sunny');
    else if (weather.includes('night')) setTheme('night');
    else setTheme('light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, setThemeByWeather }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
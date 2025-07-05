import React from 'react';
import { Plus, Camera, Zap, Heart, Utensils, Bot } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface QuickActionsProps {
  onAction: (action: string) => void;
}

export function QuickActions({ onAction }: QuickActionsProps) {
  const { theme } = useTheme();

  const actions = [
    {
      id: 'log-meal',
      icon: Utensils,
      label: 'Quick Log',
      description: 'Log a meal',
      color: 'from-green-500 to-emerald-600',
      darkColor: 'from-green-600 to-emerald-700'
    },
    {
      id: 'mood-check',
      icon: Heart,
      label: 'Mood Check',
      description: 'How do you feel?',
      color: 'from-pink-500 to-rose-600',
      darkColor: 'from-pink-600 to-rose-700'
    },
    {
      id: 'ai-chat',
      icon: Bot,
      label: 'Ask AI',
      description: 'Get advice',
      color: 'from-purple-500 to-indigo-600',
      darkColor: 'from-purple-600 to-indigo-700'
    },
    {
      id: 'photo-food',
      icon: Camera,
      label: 'Photo Log',
      description: 'Snap & track',
      color: 'from-blue-500 to-cyan-600',
      darkColor: 'from-blue-600 to-cyan-700'
    }
  ];

  return (
    <div className={`fixed bottom-6 right-6 z-40`}>
      <div className="flex flex-col space-y-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={() => onAction(action.id)}
              className={`group relative p-4 rounded-2xl shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl bg-gradient-to-r ${
                theme === 'dark' ? action.darkColor : action.color
              } text-white`}
            >
              <Icon className="w-6 h-6" />
              
              {/* Tooltip */}
              <div className={`absolute right-full mr-3 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
                theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
              } px-3 py-2 rounded-lg shadow-lg whitespace-nowrap border ${
                theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <div className="font-medium">{action.label}</div>
                <div className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  {action.description}
                </div>
                {/* Arrow */}
                <div className={`absolute left-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-r-0 border-t-4 border-b-4 border-transparent ${
                  theme === 'dark' ? 'border-l-gray-800' : 'border-l-white'
                }`} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
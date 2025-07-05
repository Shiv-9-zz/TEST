import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface ProgressRingProps {
  progress: number;
  size: number;
  strokeWidth: number;
  color: string;
  label: string;
  value: string;
}

function ProgressRing({ progress, size, strokeWidth, color, label, value }: ProgressRingProps) {
  const { theme } = useTheme();
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg
          height={size}
          width={size}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            stroke={theme === 'dark' ? '#374151' : '#e5e7eb'}
            fill="transparent"
            strokeWidth={strokeWidth}
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          {/* Progress circle */}
          <circle
            stroke={color}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            r={radius}
            cx={size / 2}
            cy={size / 2}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {value}
          </span>
          <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            {progress}%
          </span>
        </div>
      </div>
      <span className={`text-sm font-medium mt-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
        {label}
      </span>
    </div>
  );
}

export function ProgressRings() {
  const progressData = [
    { progress: 85, color: '#10b981', label: 'Nutrition', value: '85%' },
    { progress: 72, color: '#3b82f6', label: 'Hydration', value: '2.1L' },
    { progress: 90, color: '#8b5cf6', label: 'Mood', value: '8.2' },
    { progress: 68, color: '#f59e0b', label: 'Exercise', value: '68%' }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {progressData.map((data, index) => (
        <ProgressRing
          key={index}
          progress={data.progress}
          size={100}
          strokeWidth={8}
          color={data.color}
          label={data.label}
          value={data.value}
        />
      ))}
    </div>
  );
}
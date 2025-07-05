import React from 'react';

export function MoodFoodCorrelation() {
  const correlations = [
    { food: 'Leafy Greens', mood: 8.5, count: 12 },
    { food: 'Nuts & Seeds', mood: 8.2, count: 8 },
    { food: 'Dark Chocolate', mood: 7.8, count: 6 },
    { food: 'Berries', mood: 8.1, count: 10 },
    { food: 'Fish', mood: 7.9, count: 7 },
    { food: 'Whole Grains', mood: 7.5, count: 15 },
  ];

  const maxMood = 10;
  const maxCount = Math.max(...correlations.map(c => c.count));

  return (
    <div className="h-64">
      <div className="space-y-3">
        {correlations.map((item, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div className="w-24 text-sm font-medium text-gray-700 truncate">
              {item.food}
            </div>
            <div className="flex-1 flex items-center space-x-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 rounded-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-1000 ease-out"
                  style={{ width: `${(item.mood / maxMood) * 100}%` }}
                />
              </div>
              <div className="w-8 text-xs text-gray-600 text-right">
                {item.mood}
              </div>
            </div>
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-purple-700">
                {item.count}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">Foods with highest mood correlation (circles show frequency)</p>
      </div>
    </div>
  );
}
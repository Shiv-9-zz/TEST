import React from 'react';

export function WeeklyProgress() {
  const weeks = [
    { week: 'Week 1', mood: 6.8, nutrition: 75 },
    { week: 'Week 2', mood: 7.2, nutrition: 78 },
    { week: 'Week 3', mood: 7.8, nutrition: 82 },
    { week: 'Week 4', mood: 8.2, nutrition: 85 },
  ];

  const maxValue = 10;

  return (
    <div className="h-64">
      <div className="flex items-end justify-between h-48 space-x-6">
        {weeks.map((week, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div className="flex space-x-2 items-end">
              {/* Mood Bar */}
              <div className="flex flex-col items-center">
                <div 
                  className="w-6 bg-gradient-to-t from-purple-500 to-purple-300 rounded-t group hover:from-purple-600 hover:to-purple-400 transition-colors cursor-pointer relative"
                  style={{ height: `${(week.mood / maxValue) * 120}px` }}
                >
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Mood: {week.mood}
                  </div>
                </div>
                <span className="text-xs text-purple-600 mt-1">M</span>
              </div>
              
              {/* Nutrition Bar */}
              <div className="flex flex-col items-center">
                <div 
                  className="w-6 bg-gradient-to-t from-green-500 to-green-300 rounded-t group hover:from-green-600 hover:to-green-400 transition-colors cursor-pointer relative"
                  style={{ height: `${(week.nutrition / 100) * 120}px` }}
                >
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Nutrition: {week.nutrition}%
                  </div>
                </div>
                <span className="text-xs text-green-600 mt-1">N</span>
              </div>
            </div>
            <span className="text-sm text-gray-600 mt-2">{week.week}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-center space-x-4 text-sm">
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-purple-500 rounded"></div>
          <span className="text-gray-600">Mood Score</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span className="text-gray-600">Nutrition Goal</span>
        </div>
      </div>
    </div>
  );
}
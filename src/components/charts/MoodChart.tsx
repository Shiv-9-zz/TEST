import React from 'react';

export function MoodChart() {
  const data = [
    { day: 'Mon', mood: 7 },
    { day: 'Tue', mood: 8 },
    { day: 'Wed', mood: 6 },
    { day: 'Thu', mood: 9 },
    { day: 'Fri', mood: 8 },
    { day: 'Sat', mood: 7 },
    { day: 'Sun', mood: 8 },
  ];

  const maxMood = 10;

  return (
    <div className="h-64">
      <div className="flex items-end justify-between h-48 space-x-2">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div 
              className="w-full bg-gradient-to-t from-purple-500 to-pink-400 rounded-t-lg relative group hover:from-purple-600 hover:to-pink-500 transition-colors cursor-pointer"
              style={{ height: `${(item.mood / maxMood) * 100}%` }}
            >
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                {item.mood}/10
              </div>
            </div>
            <span className="text-sm text-gray-600 mt-2">{item.day}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">Weekly mood trends - hover to see scores</p>
      </div>
    </div>
  );
}
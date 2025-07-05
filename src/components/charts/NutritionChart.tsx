import React from 'react';

export function NutritionChart() {
  const nutrients = [
    { name: 'Protein', value: 85, color: 'bg-blue-500' },
    { name: 'Carbs', value: 72, color: 'bg-green-500' },
    { name: 'Fats', value: 68, color: 'bg-yellow-500' },
    { name: 'Fiber', value: 90, color: 'bg-purple-500' },
    { name: 'Vitamins', value: 78, color: 'bg-pink-500' },
  ];

  return (
    <div className="h-64 space-y-4">
      {nutrients.map((nutrient, index) => (
        <div key={index} className="flex items-center space-x-4">
          <div className="w-20 text-sm font-medium text-gray-700">
            {nutrient.name}
          </div>
          <div className="flex-1 bg-gray-200 rounded-full h-3">
            <div 
              className={`h-3 rounded-full ${nutrient.color} transition-all duration-1000 ease-out`}
              style={{ width: `${nutrient.value}%` }}
            />
          </div>
          <div className="w-12 text-sm text-gray-600 text-right">
            {nutrient.value}%
          </div>
        </div>
      ))}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">Daily nutrition goals progress</p>
      </div>
    </div>
  );
}
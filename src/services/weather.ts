export async function fetchWeather(city: string) {
  const apiKey = 'ba29165628cfc486ed7bce2ec82aab47'; // User's OpenWeatherMap API key
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch weather data');
  }
  return response.json();
} 
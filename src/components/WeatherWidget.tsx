
import { useState, useEffect } from "react";
import { Sun, Cloud, CloudRain, CloudLightning, CloudSnow, Wind } from "lucide-react";

const WeatherWidget = () => {
  const [currentTime, setCurrentTime] = useState<string>("");
  const [weather, setWeather] = useState<{
    temp?: number;
    condition?: string;
    icon?: string;
  }>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Update time every minute
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true,
        timeZone: 'America/Nassau'
      };
      setCurrentTime(now.toLocaleTimeString('en-US', options));
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // Fetch weather data
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          "https://api.openweathermap.org/data/2.5/weather?q=Nassau,BS&units=imperial&appid=9de243494c0b295cca9337e1e96b00e2"
        );
        const data = await response.json();
        
        setWeather({
          temp: Math.round(data.main.temp),
          condition: data.weather[0].main,
          icon: data.weather[0].icon
        });
      } catch (error) {
        console.error("Failed to fetch weather data:", error);
        setWeather({ temp: 82, condition: "Sunny" }); // Fallback weather in Fahrenheit
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeather();
    // Refresh weather every 30 minutes
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const getWeatherIcon = () => {
    if (isLoading) return <Sun className="animate-pulse" />;
    
    switch (weather.condition) {
      case "Clear":
        return <Sun className="text-yellow-400" size={22} />;
      case "Clouds":
        return <Cloud className="text-gray-400" size={22} />;
      case "Rain":
      case "Drizzle":
        return <CloudRain className="text-blue-400" size={22} />;
      case "Thunderstorm":
        return <CloudLightning className="text-purple-400" size={22} />;
      case "Snow":
        return <CloudSnow className="text-blue-200" size={22} />;
      default:
        return <Wind className="text-gray-400" size={22} />;
    }
  };

  return (
    <div className="flex items-center bg-white/80 backdrop-blur-sm rounded-full px-3 py-1 text-sm shadow-sm">
      <div className="flex items-center mr-3 border-r pr-3 border-gray-300">
        <span className="font-medium">{currentTime}</span>
      </div>
      <div className="flex items-center gap-1">
        {getWeatherIcon()}
        {isLoading ? (
          <span className="animate-pulse">Loading...</span>
        ) : (
          <span>
            <span className="font-medium">{weather.temp}°F</span>
            <span className="text-gray-600 ml-1 hidden sm:inline">Nassau, BS</span>
          </span>
        )}
      </div>
    </div>
  );
};

export default WeatherWidget;

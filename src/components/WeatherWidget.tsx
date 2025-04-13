
import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

const WeatherWidget = () => {
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format time to show hours:minutes AM/PM in Eastern Standard Time
      const options: Intl.DateTimeFormatOptions = { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true,
        timeZone: 'America/New_York'
      };
      const formatter = new Intl.DateTimeFormat('en-US', options);
      setCurrentTime(formatter.format(now) + ' EST');
    };

    updateTime();
    const interval = setInterval(updateTime, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center bg-white/80 backdrop-blur-sm rounded-full px-3 py-1 text-sm shadow-sm">
      <div className="flex items-center gap-2">
        <Clock size={16} className="text-gray-600" />
        <span className="font-medium">{currentTime}</span>
      </div>
    </div>
  );
};

export default WeatherWidget;

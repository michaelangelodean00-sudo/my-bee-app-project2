
import { useState, useEffect } from "react";
import { Calendar } from "lucide-react";
import { format } from "date-fns";

const WeatherWidget = () => {
  const [currentDateTime, setCurrentDateTime] = useState<string>("");

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const formattedDate = format(now, 'EEE, MMM d');
      setCurrentDateTime(formattedDate);
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center bg-white/80 backdrop-blur-sm rounded-full px-3 py-1 text-sm shadow-sm">
      <div className="flex items-center gap-2">
        <Calendar size={16} className="text-gray-600" />
        <span className="font-medium">{currentDateTime}</span>
      </div>
    </div>
  );
};

export default WeatherWidget;


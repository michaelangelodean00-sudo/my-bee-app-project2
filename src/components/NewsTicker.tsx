
import { useEffect, useState } from "react";
import { Newspaper } from "lucide-react";

const news = [
  "Community cleanup event planned for this weekend",
  "Local restaurant celebrates 10 years in business",
  "New public transportation routes announced",
  "School board meeting scheduled for Thursday",
  "Farmers market returns with seasonal produce"
];

const NewsTicker = () => {
  const [currentNews, setCurrentNews] = useState<string>(news[0]);
  const [newsIndex, setNewsIndex] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setNewsIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % news.length;
        setCurrentNews(news[nextIndex]);
        return nextIndex;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center bg-white/80 backdrop-blur-sm rounded-full px-3 py-1 text-sm shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 animate-marquee">
        <Newspaper size={16} className="text-gray-600 flex-shrink-0" />
        <span className="font-medium whitespace-nowrap">{currentNews}</span>
      </div>
    </div>
  );
};

export default NewsTicker;

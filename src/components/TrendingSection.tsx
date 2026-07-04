
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, MapPin, Calendar, ShoppingBag } from "lucide-react";

const TrendingSection = () => {
  const trendingItems = [
    {
      id: 1,
      type: "business",
      title: "Local Coffee Shops",
      count: "12 new posts",
      icon: ShoppingBag,
      category: "Food & Drink"
    },
    {
      id: 2,
      type: "event",
      title: "Tech Meetups",
      count: "5 events this week",
      icon: Calendar,
      category: "Technology"
    },
    {
      id: 3,
      type: "location",
      title: "Downtown SF",
      count: "24 businesses",
      icon: MapPin,
      category: "Location"
    }
  ];

  const suggestedBusinesses = [
    {
      id: 1,
      name: "Green Leaf Cafe",
      category: "Restaurant",
      image: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=60&h=60&auto=format&fit=crop"
    },
    {
      id: 2,
      name: "Tech Solutions Inc",
      category: "Technology",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=60&h=60&auto=format&fit=crop"
    }
  ];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <TrendingUp size={16} />
            Trending Now
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          {trendingItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-50 dark:bg-blue-900 rounded-lg">
                    <Icon size={14} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{item.title}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{item.count}</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  {item.category}
                </Badge>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Suggested for You</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          {suggestedBusinesses.map((business) => (
            <div key={business.id} className="flex items-center space-x-3">
              <img
                src={business.image}
                alt={business.name}
                className="w-10 h-10 rounded-lg object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{business.name}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">{business.category}</p>
              </div>
              <Button variant="outline" size="sm" className="text-xs">
                Follow
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default TrendingSection;

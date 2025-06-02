
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Upload, Calendar, MapPin, Users, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const QuickActions = () => {
  const actions = [
    {
      icon: Plus,
      label: "Create Post",
      description: "Share something new",
      color: "bg-blue-500 hover:bg-blue-600",
      action: () => {
        // Scroll to create post section
        const createPost = document.querySelector('[data-create-post]');
        createPost?.scrollIntoView({ behavior: 'smooth' });
      }
    },
    {
      icon: Upload,
      label: "Upload Video",
      description: "Share a video",
      color: "bg-green-500 hover:bg-green-600",
      link: "/businesses" // Assuming video upload is in businesses section
    },
    {
      icon: Calendar,
      label: "Find Events",
      description: "Discover happenings",
      color: "bg-purple-500 hover:bg-purple-600",
      link: "/events"
    },
    {
      icon: MapPin,
      label: "Explore Local",
      description: "Find nearby businesses",
      color: "bg-orange-500 hover:bg-orange-600",
      link: "/businesses"
    }
  ];

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <TrendingUp size={16} />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action, index) => {
            const Icon = action.icon;
            const content = (
              <div className={`${action.color} text-white p-3 rounded-lg text-center hover:shadow-md transition-all cursor-pointer`}>
                <Icon size={20} className="mx-auto mb-2" />
                <p className="font-medium text-xs">{action.label}</p>
                <p className="text-xs opacity-90">{action.description}</p>
              </div>
            );

            return action.link ? (
              <Link key={index} to={action.link}>
                {content}
              </Link>
            ) : (
              <div key={index} onClick={action.action}>
                {content}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;

import React from "react";
import { 
  Calendar, 
  CalendarDays, 
  CalendarClock,
  PartyPopper, 
  Music, 
  Ticket, 
  Mic,
  Theater,
  Users,
  GlassWater
} from "lucide-react";

// Custom SVG Event Icon
export const EventSvgIcon: React.FC<{ className?: string, size?: number }> = ({ className, size = 24 }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size}
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
  >
    <path d="M8 2v4" />
    <path d="M16 2v4" />
    <rect width="18" height="18" x="3" y="4" rx="2" />
    <path d="M3 10h18" />
    <path d="M10 16h4" />
    <path d="M8 14h.01" />
    <path d="M16 14h.01" />
    <path d="M12 18h.01" />
  </svg>
);

// Creative Events Icon - New addition
export const CreativeEventIcon: React.FC<{ className?: string, size?: number }> = ({ className, size = 24 }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size}
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 2a10 10 0 1 0 10 10 10 10 0 0 0-10-10z" />
    <path d="M8 9a2 2 0 1 1 4 0c0 1.5-.5 2-2 3v1" />
    <path d="M12 17h.01" />
    <path d="M8 17l2-3h4l2 3" />
    <path d="M16 9a2 2 0 1 0-4 0c0 1.5.5 2 2 3v1" />
    <path d="M12 7v.01" />
  </svg>
);

// Event Icon Type
export type EventIconType = 
  | "calendar" 
  | "calendarDays" 
  | "calendarClock"
  | "partyPopper" 
  | "music" 
  | "ticket" 
  | "mic"
  | "theater"
  | "users"
  | "glassWater"
  | "custom" 
  | "image"
  | "creative";

// Icon Map
export const eventIconMap = {
  calendar: Calendar,
  calendarDays: CalendarDays,
  calendarClock: CalendarClock,
  partyPopper: PartyPopper,
  music: Music,
  ticket: Ticket,
  mic: Mic,
  theater: Theater,
  users: Users,
  glassWater: GlassWater,
  custom: EventSvgIcon,
  creative: CreativeEventIcon
};

// Icon colors/gradients
export const iconBackgrounds = {
  purple: "bg-gradient-to-br from-purple-400 to-purple-600",
  blue: "bg-gradient-to-br from-blue-400 to-blue-600",
  green: "bg-gradient-to-br from-green-400 to-green-600",
  orange: "bg-gradient-to-br from-orange-400 to-orange-600",
  pink: "bg-gradient-to-br from-pink-400 to-pink-600",
  indigo: "bg-gradient-to-br from-indigo-400 to-indigo-600",
  teal: "bg-gradient-to-br from-teal-400 to-teal-600",
  yellow: "bg-gradient-to-br from-yellow-400 to-yellow-600",
  red: "bg-gradient-to-br from-red-400 to-red-600",
};

interface EventIconProps {
  type: EventIconType;
  background?: keyof typeof iconBackgrounds;
  size?: number;
  className?: string;
  imagePath?: string;
}

export const EventIcon: React.FC<EventIconProps> = ({ 
  type, 
  background = "purple", 
  size = 48, 
  className,
  imagePath = "/lovable-uploads/fec52d62-5fad-43bf-8596-51b7b6eb49b8.png"
}) => {
  const backgroundClass = iconBackgrounds[background];
  
  if (type === "image") {
    return (
      <div className={`rounded-full ${backgroundClass} p-4 ${className}`}>
        <img 
          src={imagePath} 
          alt="Events icon" 
          className="w-12 h-12 object-contain" 
        />
      </div>
    );
  }
  
  const IconComponent = eventIconMap[type];
  
  return (
    <div className={`rounded-full ${backgroundClass} p-4 ${className}`}>
      <IconComponent size={size} className="text-white" />
    </div>
  );
};

// Smaller version for sidebar
export const SidebarEventIcon: React.FC<EventIconProps> = ({ 
  type, 
  size = 20, 
  className,
  imagePath = "/lovable-uploads/fec52d62-5fad-43bf-8596-51b7b6eb49b8.png"
}) => {
  if (type === "image") {
    return (
      <div className={`w-5 h-5 flex items-center justify-center ${className}`}>
        <img src={imagePath} alt="Events icon" className="w-5 h-5 object-contain" />
      </div>
    );
  }
  
  const IconComponent = eventIconMap[type];
  
  return <IconComponent size={size} className={`text-bee-blue ${className}`} />;
};


import React from "react";

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

// Creative Events Icon
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

// Concert Icon
export const ConcertIcon: React.FC<{ className?: string, size?: number }> = ({ className, size = 24 }) => (
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
    <path d="M12 3v10" />
    <path d="M8 6v7" />
    <path d="M16 6v7" />
    <path d="M3 16a2 2 0 1 0 4 0 2 2 0 1 0-4 0z" />
    <path d="M7 16a2 2 0 1 0 4 0 2 2 0 1 0-4 0z" />
    <path d="M11 16a2 2 0 1 0 4 0 2 2 0 1 0-4 0z" />
    <path d="M15 16a2 2 0 1 0 4 0 2 2 0 1 0-4 0z" />
    <rect x="2" y="18" width="20" height="2" rx="1" />
  </svg>
);

// Crowd Icon - New addition
export const CrowdIcon: React.FC<{ className?: string, size?: number }> = ({ className, size = 24 }) => (
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
    <circle cx="8" cy="6" r="3" />
    <circle cx="16" cy="6" r="3" />
    <circle cx="12" cy="7" r="2" />
    <circle cx="4" cy="8" r="2" />
    <circle cx="20" cy="8" r="2" />
    <path d="M4 14h4c0-1 .6-2 2-2s2 1 2 2h4c0-1 .6-2 2-2s2 1 2 2" />
    <path d="M2 14h2" />
    <path d="M20 14h2" />
    <path d="M8 14c0 4 0 6 4 6s4-2 4-6" />
  </svg>
);

// Calendar SVG Icons
export const CalendarIcon: React.FC<{ className?: string, size?: number }> = ({ className, size = 24 }) => (
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
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
  </svg>
);

export const CalendarDaysIcon: React.FC<{ className?: string, size?: number }> = ({ className, size = 24 }) => (
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
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
    <line x1="8" x2="8" y1="14" y2="14" />
    <line x1="12" x2="12" y1="14" y2="14" />
    <line x1="16" x2="16" y1="14" y2="14" />
    <line x1="8" x2="8" y1="18" y2="18" />
    <line x1="12" x2="12" y1="18" y2="18" />
    <line x1="16" x2="16" y1="18" y2="18" />
  </svg>
);

export const CalendarClockIcon: React.FC<{ className?: string, size?: number }> = ({ className, size = 24 }) => (
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
    <path d="M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5" />
    <path d="M16 2v4" />
    <path d="M8 2v4" />
    <path d="M3 10h18" />
    <path d="M18 21a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z" />
    <path d="M18 14v2h2" />
  </svg>
);

// Party Popper Icon
export const PartyPopperIcon: React.FC<{ className?: string, size?: number }> = ({ className, size = 24 }) => (
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
    <path d="M5.8 11.3 2 22l10.7-3.79" />
    <path d="M4 3h.01" />
    <path d="M22 8h.01" />
    <path d="M15 2h.01" />
    <path d="M22 20h.01" />
    <path d="m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12v0c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10" />
    <path d="m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11v0c-.11.7-.72 1.22-1.43 1.22H17" />
    <path d="m11 2 .33.82c.34.86-.2 1.82-1.11 1.98v0C9.52 4.9 9 5.52 9 6.23V7" />
    <path d="M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2Z" />
  </svg>
);

// Music Icon
export const MusicIcon: React.FC<{ className?: string, size?: number }> = ({ className, size = 24 }) => (
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
    <path d="M9 18V5l12-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="16" r="3" />
  </svg>
);

// Ticket Icon
export const TicketIcon: React.FC<{ className?: string, size?: number }> = ({ className, size = 24 }) => (
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
    <path d="M3 7v2a3 3 0 1 1 0 6v2c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-2a3 3 0 1 1 0-6V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2Z" />
    <path d="M13 5v2" />
    <path d="M13 17v2" />
    <path d="M13 11v2" />
  </svg>
);

// Mic Icon
export const MicIcon: React.FC<{ className?: string, size?: number }> = ({ className, size = 24 }) => (
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
    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" x2="12" y1="19" y2="22" />
  </svg>
);

// Theater Icon
export const TheaterIcon: React.FC<{ className?: string, size?: number }> = ({ className, size = 24 }) => (
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
    <path d="M2 8h20" />
    <path d="M2 16h20" />
    <path d="M12 2v20" />
    <path d="M2 12h20" />
    <path d="M6 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
    <path d="M6 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
    <path d="M6 22a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
    <path d="M18 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
    <path d="M18 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
    <path d="M18 22a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
  </svg>
);

// Glass Water Icon
export const GlassWaterIcon: React.FC<{ className?: string, size?: number }> = ({ className, size = 24 }) => (
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
    <path d="M15.2 22H8.8a2 2 0 0 1-2-1.79L5 3h14l-1.81 17.21A2 2 0 0 1 15.2 22Z" />
    <path d="M6 12a5 5 0 0 1 6 0 5 5 0 0 0 6 0" />
  </svg>
);

// Building2 Icon
export const Building2Icon: React.FC<{ className?: string, size?: number }> = ({ className, size = 24 }) => (
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
    <path d="M6 22V2a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v20z" />
    <path d="M6 12H4a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h2" />
    <path d="M18 12h2a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-2" />
    <path d="M10 7h4" />
    <path d="M10 11h4" />
    <path d="M10 15h4" />
  </svg>
);

// Home Icon
export const HomeIcon: React.FC<{ className?: string, size?: number }> = ({ className, size = 24 }) => (
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
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

// ShoppingBag Icon
export const ShoppingBagIcon: React.FC<{ className?: string, size?: number }> = ({ className, size = 24 }) => (
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
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

// Settings Icon
export const SettingsIcon: React.FC<{ className?: string, size?: number }> = ({ className, size = 24 }) => (
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
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

// LogOut Icon
export const LogOutIcon: React.FC<{ className?: string, size?: number }> = ({ className, size = 24 }) => (
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
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
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
  | "creative"
  | "concert"
  | "crowd";

// Icon Map
export const eventIconMap = {
  calendar: CalendarIcon,
  calendarDays: CalendarDaysIcon,
  calendarClock: CalendarClockIcon,
  partyPopper: PartyPopperIcon,
  music: MusicIcon,
  ticket: TicketIcon,
  mic: MicIcon,
  theater: TheaterIcon,
  users: CrowdIcon, // Use our custom crowd icon
  glassWater: GlassWaterIcon,
  custom: EventSvgIcon,
  creative: CreativeEventIcon,
  concert: ConcertIcon,
  crowd: CrowdIcon
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

import { useState } from 'react';
import { Building2, Calendar, ShoppingCart, Settings, User, Home, UserCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useNotifications } from '../contexts/NotificationContext';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import SearchBar from './SearchBar';
import { cn } from '@/lib/utils';

interface ModernSidebarProps {
  className?: string;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const ModernSidebar = ({ className = "", isCollapsed = false, onToggleCollapse }: ModernSidebarProps) => {
  const location = useLocation();
  const { hasNewBusinessVideos, hasNewEventsVideos, hasNewEcommerceItems } = useNotifications();

  const navigationItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Building2, label: "Business", path: "/businesses", hasNotification: hasNewBusinessVideos },
    { icon: Calendar, label: "Events", path: "/events", hasNotification: hasNewEventsVideos },
    { icon: ShoppingCart, label: "E-commerce", path: "/ecommerce", hasNotification: hasNewEcommerceItems },
    { icon: Settings, label: "Settings", path: "/settings" },
    { icon: UserCircle, label: "Profile", path: "/profile" },
  ];

  return (
    <div className={cn(
      "bg-sidebar-background border-r border-sidebar-border h-full sticky top-0 transition-all duration-300 ease-in-out",
      isCollapsed ? "w-16" : "w-64",
      className
    )}>
      {/* Sidebar Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <h2 className="text-lg font-semibold text-sidebar-foreground font-bebas">
              NAVIGATION
            </h2>
          )}
          {onToggleCollapse && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleCollapse}
              className="text-sidebar-foreground hover:bg-sidebar-accent/10 h-8 w-8"
            >
              {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </Button>
          )}
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Search Bar - only show when not collapsed */}
        {!isCollapsed && (
          <div className="mb-4">
            <SearchBar />
          </div>
        )}
        
        {/* Navigation Items */}
        <nav className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center justify-between rounded-xl transition-all duration-200 group relative",
                  isCollapsed ? "p-3" : "px-4 py-3",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/10 hover:text-sidebar-accent-foreground"
                )}
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="relative">
                    <Icon size={20} className="flex-shrink-0" />
                    {item.hasNotification && (
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    )}
                  </div>
                  {!isCollapsed && (
                    <div className="flex items-center space-x-2 min-w-0">
                      <span className="font-medium text-sm truncate">{item.label}</span>
                      {item.hasNotification && (
                        <Badge 
                          variant="destructive" 
                          className="text-xs px-1.5 py-0.5 bg-red-500 text-white animate-pulse"
                        >
                          NEW
                        </Badge>
                      )}
                    </div>
                  )}
                </div>

                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-sidebar-background border border-sidebar-border rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                    <span className="text-sm text-sidebar-foreground">{item.label}</span>
                    {item.hasNotification && (
                      <Badge 
                        variant="destructive" 
                        className="ml-2 text-xs px-1.5 py-0.5 bg-red-500 text-white"
                      >
                        NEW
                      </Badge>
                    )}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Quick Actions - only show when not collapsed */}
        {!isCollapsed && (
          <div className="pt-6 border-t border-sidebar-border">
            <h3 className="text-xs font-semibold text-sidebar-foreground/70 uppercase tracking-wider mb-3">
              Quick Actions
            </h3>
            <div className="space-y-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start text-left h-auto py-2"
              >
                <span className="text-sm">Create Post</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start text-left h-auto py-2"
              >
                <span className="text-sm">Upload Video</span>
              </Button>
            </div>
          </div>
        )}

        {/* User Status - only show when not collapsed */}
        {!isCollapsed && (
          <div className="pt-6 border-t border-sidebar-border">
            <div className="glass-card p-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <User size={16} className="text-primary-foreground" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-sidebar-foreground truncate">
                    Welcome back!
                  </p>
                  <p className="text-xs text-sidebar-foreground/70">
                    Ready to explore?
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModernSidebar;
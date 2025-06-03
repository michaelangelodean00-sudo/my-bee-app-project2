
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Star, Users, Settings, Edit } from "lucide-react";
import { Link } from "react-router-dom";
import ProfileEditDialog from "./ProfileEditDialog";

const UserProfile = () => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [user, setUser] = useState({
    name: "John Doe",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&auto=format&fit=crop&crop=face",
    avatarFallback: "JD",
    location: "San Francisco, CA",
    memberSince: "Jan 2024",
    postsCount: 12,
    followersCount: 145,
    followingCount: 89,
    isVerified: true,
    businessOwner: true,
    bio: "",
    businessType: "",
    website: ""
  });

  const handleProfileSave = (updatedUser: any) => {
    setUser(prev => ({ ...prev, ...updatedUser }));
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user.avatarUrl} />
              <AvatarFallback>{user.avatarFallback}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm truncate">{user.name}</h3>
                {user.isVerified && (
                  <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                    <Star size={10} className="mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
              {user.businessOwner && (
                <Badge variant="outline" className="text-xs mt-1">
                  Business Owner
                </Badge>
              )}
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setIsEditDialogOpen(true)}
              className="p-1 h-8 w-8"
            >
              <Edit size={14} />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0 space-y-3">
          {user.bio && (
            <p className="text-xs text-gray-700 dark:text-gray-300">{user.bio}</p>
          )}
          
          <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
            <MapPin size={12} className="mr-1" />
            {user.location}
          </div>
          
          <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
            <Calendar size={12} className="mr-1" />
            Member since {user.memberSince}
          </div>
          
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div>
              <div className="font-semibold text-gray-900 dark:text-gray-100">{user.postsCount}</div>
              <div className="text-gray-600 dark:text-gray-400">Posts</div>
            </div>
            <div>
              <div className="font-semibold text-gray-900 dark:text-gray-100">{user.followersCount}</div>
              <div className="text-gray-600 dark:text-gray-400">Followers</div>
            </div>
            <div>
              <div className="font-semibold text-gray-900 dark:text-gray-100">{user.followingCount}</div>
              <div className="text-gray-600 dark:text-gray-400">Following</div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm" className="flex-1">
              <Link to="/profile">
                <Users size={14} className="mr-1" />
                Profile
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="flex-1">
              <Link to="/settings">
                <Settings size={14} className="mr-1" />
                Settings
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <ProfileEditDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        currentUser={user}
        onSave={handleProfileSave}
      />
    </>
  );
};

export default UserProfile;

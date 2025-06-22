import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Star, Users, Settings, Edit } from "lucide-react";
import { Link } from "react-router-dom";
import ProfileEditDialog from "./ProfileEditDialog";

export interface UserProfileProps {
  name: string;
  avatarUrl: string;
  avatarFallback: string;
  location: string;
  memberSince: string;
  postsCount: number;
  followersCount: number;
  followingCount: number;
  isVerified: boolean;
  businessOwner: boolean;
  bio?: string;
  website?: string;
  isCurrentUser?: boolean;
}

const UserProfile: React.FC<UserProfileProps> = ({
  name,
  avatarUrl,
  avatarFallback,
  location,
  memberSince,
  postsCount,
  followersCount,
  followingCount,
  isVerified,
  businessOwner,
  bio,
  website,
  isCurrentUser = false
}) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  
  // This local state is for the edit dialog, 
  // but the source of truth is passed in as props.
  const [editableUser, setEditableUser] = useState({
    name,
    avatarUrl,
    avatarFallback,
    location,
    memberSince,
    postsCount,
    followersCount,
    followingCount,
    isVerified,
    businessOwner,
    bio: bio || "",
    website: website || ""
  });

  const handleProfileSave = (updatedUser: any) => {
    // In a real app, this would trigger a mutation to update the user data
    // For now, we just update the local state for the dialog
    setEditableUser(prev => ({ ...prev, ...updatedUser }));
  };

  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={avatarUrl} />
              <AvatarFallback>{avatarFallback}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm truncate">{name}</h3>
                {isVerified && (
                  <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                    <Star size={10} className="mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
              {businessOwner && (
                <Badge variant="outline" className="text-xs mt-1">
                  Business Owner
                </Badge>
              )}
            </div>
            {isCurrentUser && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsEditDialogOpen(true)}
                className="p-1 h-8 w-8"
              >
                <Edit size={14} />
              </Button>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="pt-0 space-y-3">
          {bio && (
            <p className="text-xs text-gray-700 dark:text-gray-300">{bio}</p>
          )}
          
          <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
            <MapPin size={12} className="mr-1" />
            {location}
          </div>
          
          <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
            <Calendar size={12} className="mr-1" />
            Member since {memberSince}
          </div>
          
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div>
              <div className="font-semibold text-gray-900 dark:text-gray-100">{postsCount}</div>
              <div className="text-gray-600 dark:text-gray-400">Posts</div>
            </div>
            <div>
              <div className="font-semibold text-gray-900 dark:text-gray-100">{followersCount}</div>
              <div className="text-gray-600 dark:text-gray-400">Followers</div>
            </div>
            <div>
              <div className="font-semibold text-gray-900 dark:text-gray-100">{followingCount}</div>
              <div className="text-gray-600 dark:text-gray-400">Following</div>
            </div>
          </div>
          
          {isCurrentUser ? (
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
          ) : (
            <div className="mt-4">
              <Button
                variant="default"
                size="sm"
                className="w-full"
                onClick={handleFollowToggle}
              >
                {isFollowing ? 'Unfollow' : 'Follow'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {isCurrentUser && (
        <ProfileEditDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          currentUser={{
            name: editableUser.name,
            avatarUrl: editableUser.avatarUrl,
            avatarFallback: editableUser.avatarFallback,
            location: editableUser.location,
            businessOwner: editableUser.businessOwner,
          }}
          onSave={handleProfileSave}
        />
      )}
    </>
  );
};

export default UserProfile;

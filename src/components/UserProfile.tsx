import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Star, Users, Settings, Edit, Building2, User, Briefcase, Globe, Shield, ArrowUpRight, Sparkles, Clock, XCircle, Phone, Navigation, Instagram, Facebook, Twitter } from "lucide-react";
import { Link } from "react-router-dom";
import ProfileEditDialog from "./ProfileEditDialog";
import { cn } from "@/lib/utils";
import { getMyLatest, subscribeApprovals, type BusinessApprovalSubmission } from "@/utils/businessApprovals";

export type UserRole = 'user' | 'admin';

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
  role?: UserRole;
  bio?: string;
  website?: string;
  phone?: string;
  streetAddress?: string;
  googleMapUrl?: string;
  socialMedia?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    tiktok?: string;
  };
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
  role = 'user',
  bio,
  website,
  phone,
  streetAddress,
  googleMapUrl,
  socialMedia,
  isCurrentUser = false
}) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [upgradeMode, setUpgradeMode] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const ownerKey = name || "current-user";
  const [myApproval, setMyApproval] = useState<BusinessApprovalSubmission | undefined>(
    () => (isCurrentUser ? getMyLatest(ownerKey) : undefined)
  );

  useEffect(() => {
    if (!isCurrentUser) return;
    const update = () => setMyApproval(getMyLatest(ownerKey));
    update();
    return subscribeApprovals(update);
  }, [isCurrentUser, ownerKey]);

  const pendingBusiness = isCurrentUser && myApproval?.status === "pending" && !businessOwner;
  const rejectedBusiness = isCurrentUser && myApproval?.status === "rejected" && !businessOwner;

  // Admin status is private — only ever surfaced to the admin themselves.
  // Regular users and business accounts must never see admin badges, banners,
  // or the Admin Panel entry point on someone else's profile.
  const isAdmin = role === 'admin' && isCurrentUser;
  
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
    website: website || "",
    phone: phone || "",
    streetAddress: streetAddress || "",
    googleMapUrl: googleMapUrl || "",
    socialMedia: socialMedia || {}
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
      <Card className={cn(
        "w-full overflow-hidden transition-all duration-300",
        businessOwner 
          ? "border-amber-200 dark:border-amber-800 bg-gradient-to-br from-amber-50/50 to-orange-50/30 dark:from-amber-950/20 dark:to-orange-950/10" 
          : "border-border"
      )}>
        {/* Account Type Banner */}
        <div className={cn(
          "px-4 py-2 flex items-center justify-between text-xs font-medium",
          isAdmin
            ? "bg-gradient-to-r from-red-500 to-rose-500 text-white"
            : businessOwner 
              ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white" 
              : "bg-gradient-to-r from-primary/10 to-secondary/10 text-foreground"
        )}>
          <div className="flex items-center gap-2">
            {businessOwner ? (
              <>
                <Building2 size={14} />
                <span>Business Account</span>
              </>
            ) : (
              <>
                <User size={14} />
                <span>Personal Account</span>
              </>
            )}
          </div>
          {isAdmin && (
            <Badge className="bg-white/20 text-white border-white/30 text-xs">
              <Shield size={10} className="mr-1" />
              Admin
            </Badge>
          )}
        </div>

        {(pendingBusiness || rejectedBusiness) && (
          <div
            className={cn(
              "px-4 py-2 flex items-center gap-2 text-xs font-medium border-b",
              pendingBusiness
                ? "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800"
                : "bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800"
            )}
          >
            {pendingBusiness ? <Clock size={14} /> : <XCircle size={14} />}
            <span className="flex-1 truncate">
              {pendingBusiness
                ? "Business profile pending admin approval"
                : "Business application was not approved"}
            </span>
          </div>
        )}


        <CardHeader className="pb-3">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Avatar className={cn(
                "h-14 w-14 ring-2 ring-offset-2 ring-offset-background",
                businessOwner 
                  ? "ring-amber-500" 
                  : "ring-primary/30"
              )}>
                <AvatarImage src={avatarUrl} />
                <AvatarFallback className={cn(
                  businessOwner 
                    ? "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300" 
                    : "bg-primary/10 text-primary"
                )}>
                  {avatarFallback}
                </AvatarFallback>
              </Avatar>
              {businessOwner && (
                <div className="absolute -bottom-1 -right-1 bg-amber-500 rounded-full p-1">
                  <Briefcase size={10} className="text-white" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-sm truncate">{name}</h3>
                {isAdmin && (
                  <Badge className="text-xs px-1.5 py-0.5 bg-red-500 hover:bg-red-600 text-white">
                    <Shield size={10} className="mr-1" />
                    Admin
                  </Badge>
                )}
                {isVerified && (
                  <Badge 
                    variant="secondary" 
                    className={cn(
                      "text-xs px-1.5 py-0.5",
                      businessOwner 
                        ? "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300" 
                        : ""
                    )}
                  >
                    <Star size={10} className="mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
              {businessOwner ? (
                <div className="flex items-center gap-1 mt-1">
                  <Badge className="text-xs bg-amber-500 hover:bg-amber-600 text-white">
                    <Building2 size={10} className="mr-1" />
                    Business Owner
                  </Badge>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground mt-1">Community Member</p>
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
            <p className="text-xs text-muted-foreground">{bio}</p>
          )}

          {/* Business-specific info */}
          {businessOwner && website && (
            <div className="flex items-center text-xs text-amber-600 dark:text-amber-400">
              <Globe size={12} className="mr-1" />
              <a href={website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                {website}
              </a>
            </div>
          )}
          
          <div className="flex items-center text-xs text-muted-foreground">
            <MapPin size={12} className="mr-1" />
            {location}
          </div>
          
          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar size={12} className="mr-1" />
            Member since {memberSince}
          </div>
          
          <div className={cn(
            "grid grid-cols-3 gap-2 text-center text-xs p-3 rounded-lg",
            businessOwner 
              ? "bg-amber-50 dark:bg-amber-950/30" 
              : "bg-muted/50"
          )}>
            <div>
              <div className="font-semibold text-foreground">{postsCount}</div>
              <div className="text-muted-foreground">{businessOwner ? "Listings" : "Posts"}</div>
            </div>
            <div>
              <div className="font-semibold text-foreground">{followersCount}</div>
              <div className="text-muted-foreground">{businessOwner ? "Customers" : "Followers"}</div>
            </div>
            <div>
              <div className="font-semibold text-foreground">{followingCount}</div>
              <div className="text-muted-foreground">Following</div>
            </div>
          </div>
          
          {isCurrentUser ? (
            <div className="flex flex-col gap-2">
              {!businessOwner && !pendingBusiness && (
                <button
                  type="button"
                  onClick={() => { setUpgradeMode(true); setIsEditDialogOpen(true); }}
                  className="group relative overflow-hidden rounded-lg p-3 text-left bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm hover:shadow-md transition-all duration-200 active:scale-[0.98] touch-manipulation"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <Sparkles size={16} className="flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="text-xs font-semibold leading-tight">
                          {rejectedBusiness ? "Resubmit Business Profile" : "Upgrade to Business"}
                        </div>
                        <div className="text-[10px] opacity-90 leading-tight truncate">Promote, sell & get listed</div>
                      </div>
                    </div>
                    <ArrowUpRight size={16} className="flex-shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </button>
              )}
              {pendingBusiness && (
                <div className="rounded-lg p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 flex items-center gap-2">
                  <Clock size={16} className="text-amber-600 dark:text-amber-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-amber-700 dark:text-amber-300 leading-tight">
                      Pending Admin Review
                    </div>
                    <div className="text-[10px] text-amber-700/80 dark:text-amber-400/80 leading-tight truncate">
                      We'll notify you once approved.
                    </div>
                  </div>
                </div>
              )}
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
              {isAdmin && (
                <Button asChild variant="default" size="sm" className="w-full bg-red-500 hover:bg-red-600">
                  <Link to="/admin">
                    <Shield size={14} className="mr-1" />
                    Admin Panel
                  </Link>
                </Button>
              )}
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
          key={upgradeMode ? "upgrade" : "edit"}
          open={isEditDialogOpen}
          onOpenChange={(open) => {
            setIsEditDialogOpen(open);
            if (!open) setUpgradeMode(false);
          }}
          currentUser={{
            name: editableUser.name,
            avatarUrl: editableUser.avatarUrl,
            avatarFallback: editableUser.avatarFallback,
            location: editableUser.location,
            businessOwner: upgradeMode ? true : editableUser.businessOwner,
          }}
          onSave={handleProfileSave}
        />
      )}
    </>
  );
};

export default UserProfile;

import React, { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Lock, 
  Shield, 
  Bell, 
  Eye, 
  Globe, 
  CreditCard, 
  Download, 
  Trash2, 
  Settings,
  Camera,
  MapPin,
  Briefcase,
  GraduationCap,
  Heart,
  Users,
  Calendar,
  Phone,
  Mail,
  Home,
  Edit
} from "lucide-react";

const ProfileSettings = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    birthday: "1990-01-01",
    gender: "male",
    pronouns: "he/him",
    bio: "Software developer passionate about creating amazing user experiences.",
    location: "San Francisco, CA",
    hometown: "New York, NY",
    relationship: "single",
    work: "Senior Developer at Tech Corp",
    education: "Stanford University",
    website: "https://johndoe.dev",
    accountType: "individual"
  });

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "public",
    friendsList: "friends",
    phoneNumber: "friends",
    email: "me",
    birthday: "friends",
    posts: "friends",
    friendRequests: "everyone",
    lookupByEmail: true,
    lookupByPhone: true,
    searchEngines: false,
    faceRecognition: true,
    locationHistory: true,
    activityStatus: true,
    readReceipts: true
  });

  const [notificationSettings, setNotificationSettings] = useState({
    comments: true,
    likes: true,
    mentions: true,
    friendRequests: true,
    messages: true,
    groupPosts: true,
    eventInvites: true,
    birthdays: true,
    memories: true,
    suggestions: false,
    ads: false,
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false
  });

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-background transition-colors">
      <Header toggleMobileSidebar={toggleMobileSidebar} />
      
      <div className="flex">
        {/* Mobile Sidebar Overlay */}
        {mobileSidebarOpen && (
          <div 
            className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-40 md:hidden"
            onClick={toggleMobileSidebar}
          />
        )}
        
        {/* Mobile Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-card transform ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-200 ease-in-out md:hidden`}>
          <Sidebar />
        </div>
        
        {/* Desktop Sidebar */}
        <Sidebar className="hidden md:block" />
        
        {/* Main Content */}
        <div className="flex-1 max-w-6xl mx-auto py-6 px-4">
          <Tabs defaultValue="general" orientation="vertical" className="flex flex-col md:flex-row gap-10">
            <TabsList className="sticky top-36 self-start flex flex-col items-start h-auto bg-transparent p-0 border-r border-border w-full md:w-48 shrink-0 space-y-1">
              <TabsTrigger value="general" className="w-full justify-start">
                <User size={16} className="mr-2" />
                General
              </TabsTrigger>
              <TabsTrigger value="security" className="w-full justify-start">
                <Lock size={16} className="mr-2" />
                Security
              </TabsTrigger>
              <TabsTrigger value="privacy" className="w-full justify-start">
                <Shield size={16} className="mr-2" />
                Privacy
              </TabsTrigger>
              <TabsTrigger value="notifications" className="w-full justify-start">
                <Bell size={16} className="mr-2" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="ads" className="w-full justify-start">
                <Eye size={16} className="mr-2" />
                Ads
              </TabsTrigger>
              <TabsTrigger value="account" className="w-full justify-start">
                <Settings size={16} className="mr-2" />
                Account
              </TabsTrigger>
            </TabsList>

            <div className="flex-1">
              <div className="mb-6">
                <h1 className="heading-large">Settings</h1>
                <p className="body-medium text-muted-foreground">Manage your account settings and preferences</p>
              </div>
              {/* General Settings */}
              <TabsContent value="general" className="space-y-6 mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User size={20} />
                      Profile Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Profile Picture */}
                    <div className="flex items-center gap-4">
                      <Avatar className="w-20 h-20">
                        <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&auto=format&fit=crop&crop=face" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div className="space-y-2">
                        <Button variant="outline" className="flex items-center gap-2">
                          <Camera size={16} />
                          Change Photo
                        </Button>
                        <Button variant="ghost" size="sm">Remove</Button>
                      </div>
                    </div>

                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input 
                          id="firstName" 
                          value={profileData.firstName}
                          onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input 
                          id="lastName" 
                          value={profileData.lastName}
                          onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea 
                        id="bio" 
                        placeholder="Write something about yourself..."
                        value={profileData.bio}
                        onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                        className="mt-1"
                      />
                    </div>

                    <Separator />

                    {/* Contact Info */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Phone size={18} />
                        Contact Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input 
                            id="email" 
                            type="email"
                            value={profileData.email}
                            onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input 
                            id="phone" 
                            value={profileData.phone}
                            onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="website">Website</Label>
                        <Input 
                          id="website" 
                          placeholder="https://yourwebsite.com"
                          value={profileData.website}
                          onChange={(e) => setProfileData({...profileData, website: e.target.value})}
                        />
                      </div>
                    </div>

                    <Separator />

                    {/* Personal Info */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Heart size={18} />
                        Personal Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="birthday">Birthday</Label>
                          <Input 
                            id="birthday" 
                            type="date"
                            value={profileData.birthday}
                            onChange={(e) => setProfileData({...profileData, birthday: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="gender">Gender</Label>
                          <Select value={profileData.gender} onValueChange={(value) => setProfileData({...profileData, gender: value})}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="non-binary">Non-binary</SelectItem>
                              <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                              <SelectItem value="custom">Custom</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="pronouns">Pronouns</Label>
                          <Input 
                            id="pronouns" 
                            placeholder="e.g., he/him, she/her, they/them"
                            value={profileData.pronouns}
                            onChange={(e) => setProfileData({...profileData, pronouns: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="relationship">Relationship Status</Label>
                          <Select value={profileData.relationship} onValueChange={(value) => setProfileData({...profileData, relationship: value})}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="single">Single</SelectItem>
                              <SelectItem value="in-relationship">In a relationship</SelectItem>
                              <SelectItem value="engaged">Engaged</SelectItem>
                              <SelectItem value="married">Married</SelectItem>
                              <SelectItem value="complicated">It's complicated</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Location */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <MapPin size={18} />
                        Location
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="location">Current City</Label>
                          <Input 
                            id="location" 
                            value={profileData.location}
                            onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="hometown">Hometown</Label>
                          <Input 
                            id="hometown" 
                            value={profileData.hometown}
                            onChange={(e) => setProfileData({...profileData, hometown: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Work and Education */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Briefcase size={18} />
                        Work & Education
                      </h3>
                      <div>
                        <Label htmlFor="work">Work</Label>
                        <Input 
                          id="work" 
                          placeholder="Job title at Company"
                          value={profileData.work}
                          onChange={(e) => setProfileData({...profileData, work: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="education">Education</Label>
                        <Input 
                          id="education" 
                          placeholder="School or University"
                          value={profileData.education}
                          onChange={(e) => setProfileData({...profileData, education: e.target.value})}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="accountType">Account Type</Label>
                      <Select
                        value={profileData.accountType}
                        onValueChange={(value) => setProfileData({ ...profileData, accountType: value })}
                      >
                        <SelectTrigger id="accountType">
                          <SelectValue placeholder="Select account type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="individual">Individual</SelectItem>
                          <SelectItem value="company">Company/Business</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Separator />

                    <Button className="w-full md:w-auto">Save Changes</Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Security Settings */}
              <TabsContent value="security" className="space-y-6 mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lock size={20} />
                      Password & Security
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input id="currentPassword" type="password" />
                    </div>
                    <div>
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input id="newPassword" type="password" />
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input id="confirmPassword" type="password" />
                    </div>
                    <Button>Update Password</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Two-Factor Authentication</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">SMS Authentication</p>
                        <p className="text-sm text-gray-600">Receive codes via text message</p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Authenticator App</p>
                        <p className="text-sm text-gray-600">Use Google Authenticator or similar app</p>
                      </div>
                      <Switch />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Login Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">Current Session</p>
                          <p className="text-sm text-gray-600">San Francisco, CA • Chrome • Active now</p>
                        </div>
                        <Badge>Current</Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">iPhone</p>
                          <p className="text-sm text-gray-600">New York, NY • Mobile App • 2 hours ago</p>
                        </div>
                        <Button variant="outline" size="sm">End Session</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Privacy Settings */}
              <TabsContent value="privacy" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield size={20} />
                      Privacy Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold">Profile Visibility</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Profile visibility</p>
                            <p className="text-sm text-gray-600">Who can see your profile</p>
                          </div>
                          <Select value={privacySettings.profileVisibility} onValueChange={(value) => setPrivacySettings({...privacySettings, profileVisibility: value})}>
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="public">Public</SelectItem>
                              <SelectItem value="friends">Friends</SelectItem>
                              <SelectItem value="me">Only me</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Friends list</p>
                            <p className="text-sm text-gray-600">Who can see your friends</p>
                          </div>
                          <Select value={privacySettings.friendsList} onValueChange={(value) => setPrivacySettings({...privacySettings, friendsList: value})}>
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="public">Public</SelectItem>
                              <SelectItem value="friends">Friends</SelectItem>
                              <SelectItem value="me">Only me</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Phone number</p>
                            <p className="text-sm text-gray-600">Who can see your phone number</p>
                          </div>
                          <Select value={privacySettings.phoneNumber} onValueChange={(value) => setPrivacySettings({...privacySettings, phoneNumber: value})}>
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="public">Public</SelectItem>
                              <SelectItem value="friends">Friends</SelectItem>
                              <SelectItem value="me">Only me</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Email address</p>
                            <p className="text-sm text-gray-600">Who can see your email</p>
                          </div>
                          <Select value={privacySettings.email} onValueChange={(value) => setPrivacySettings({...privacySettings, email: value})}>
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="public">Public</SelectItem>
                              <SelectItem value="friends">Friends</SelectItem>
                              <SelectItem value="me">Only me</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="font-semibold">How People Find You</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Search by email</p>
                            <p className="text-sm text-gray-600">Let people find you using your email</p>
                          </div>
                          <Switch 
                            checked={privacySettings.lookupByEmail}
                            onCheckedChange={(checked) => setPrivacySettings({...privacySettings, lookupByEmail: checked})}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Search by phone</p>
                            <p className="text-sm text-gray-600">Let people find you using your phone number</p>
                          </div>
                          <Switch 
                            checked={privacySettings.lookupByPhone}
                            onCheckedChange={(checked) => setPrivacySettings({...privacySettings, lookupByPhone: checked})}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Search engines</p>
                            <p className="text-sm text-gray-600">Allow search engines to link to your profile</p>
                          </div>
                          <Switch 
                            checked={privacySettings.searchEngines}
                            onCheckedChange={(checked) => setPrivacySettings({...privacySettings, searchEngines: checked})}
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="font-semibold">Activity & Location</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Location history</p>
                            <p className="text-sm text-gray-600">Save locations where you use the app</p>
                          </div>
                          <Switch 
                            checked={privacySettings.locationHistory}
                            onCheckedChange={(checked) => setPrivacySettings({...privacySettings, locationHistory: checked})}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Activity status</p>
                            <p className="text-sm text-gray-600">Show when you're active</p>
                          </div>
                          <Switch 
                            checked={privacySettings.activityStatus}
                            onCheckedChange={(checked) => setPrivacySettings({...privacySettings, activityStatus: checked})}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Read receipts</p>
                            <p className="text-sm text-gray-600">Show when you've read messages</p>
                          </div>
                          <Switch 
                            checked={privacySettings.readReceipts}
                            onCheckedChange={(checked) => setPrivacySettings({...privacySettings, readReceipts: checked})}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Notifications */}
              <TabsContent value="notifications" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell size={20} />
                      Notification Preferences
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold">Social</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Comments</p>
                            <p className="text-sm text-gray-600">When someone comments on your posts</p>
                          </div>
                          <Switch 
                            checked={notificationSettings.comments}
                            onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, comments: checked})}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Likes and reactions</p>
                            <p className="text-sm text-gray-600">When someone likes your posts</p>
                          </div>
                          <Switch 
                            checked={notificationSettings.likes}
                            onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, likes: checked})}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Mentions and tags</p>
                            <p className="text-sm text-gray-600">When someone mentions you</p>
                          </div>
                          <Switch 
                            checked={notificationSettings.mentions}
                            onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, mentions: checked})}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Friend requests</p>
                            <p className="text-sm text-gray-600">When someone sends you a friend request</p>
                          </div>
                          <Switch 
                            checked={notificationSettings.friendRequests}
                            onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, friendRequests: checked})}
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="font-semibold">Messages & Groups</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Messages</p>
                            <p className="text-sm text-gray-600">New message notifications</p>
                          </div>
                          <Switch 
                            checked={notificationSettings.messages}
                            onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, messages: checked})}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Group posts</p>
                            <p className="text-sm text-gray-600">Posts in groups you're in</p>
                          </div>
                          <Switch 
                            checked={notificationSettings.groupPosts}
                            onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, groupPosts: checked})}
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="font-semibold">Events & Reminders</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Event invites</p>
                            <p className="text-sm text-gray-600">When you're invited to events</p>
                          </div>
                          <Switch 
                            checked={notificationSettings.eventInvites}
                            onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, eventInvites: checked})}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Birthdays</p>
                            <p className="text-sm text-gray-600">Friends' birthday reminders</p>
                          </div>
                          <Switch 
                            checked={notificationSettings.birthdays}
                            onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, birthdays: checked})}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Memories</p>
                            <p className="text-sm text-gray-600">Your memories and past posts</p>
                          </div>
                          <Switch 
                            checked={notificationSettings.memories}
                            onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, memories: checked})}
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="font-semibold">Delivery Methods</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Push notifications</p>
                            <p className="text-sm text-gray-600">Notifications on your device</p>
                          </div>
                          <Switch 
                            checked={notificationSettings.pushNotifications}
                            onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, pushNotifications: checked})}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Email notifications</p>
                            <p className="text-sm text-gray-600">Notifications via email</p>
                          </div>
                          <Switch 
                            checked={notificationSettings.emailNotifications}
                            onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, emailNotifications: checked})}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">SMS notifications</p>
                            <p className="text-sm text-gray-600">Notifications via text message</p>
                          </div>
                          <Switch 
                            checked={notificationSettings.smsNotifications}
                            onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, smsNotifications: checked})}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Ads Settings */}
              <TabsContent value="ads" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye size={20} />
                      Ad Preferences
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Personalized ads</p>
                          <p className="text-sm text-gray-600">Show ads based on your interests</p>
                        </div>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Location-based ads</p>
                          <p className="text-sm text-gray-600">Show ads based on your location</p>
                        </div>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Social interactions</p>
                          <p className="text-sm text-gray-600">Show ads based on social activity</p>
                        </div>
                        <Switch />
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="font-semibold">Ad Categories</h3>
                      <p className="text-sm text-gray-600">Choose what types of ads you want to see</p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {["Technology", "Fashion", "Food", "Travel", "Sports", "Entertainment", "Business", "Health", "Education"].map((category) => (
                          <Badge key={category} variant="outline" className="cursor-pointer hover:bg-gray-100">
                            {category}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Account Settings */}
              <TabsContent value="account" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Download size={20} />
                      Your Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Download your information</p>
                        <p className="text-sm text-gray-600">Get a copy of what you've shared</p>
                      </div>
                      <Button variant="outline">Download</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Activity log</p>
                        <p className="text-sm text-gray-600">Review your activity on the platform</p>
                      </div>
                      <Button variant="outline">View Log</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard size={20} />
                      Payment Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Payment methods</p>
                        <p className="text-sm text-gray-600">Manage your payment options</p>
                      </div>
                      <Button variant="outline">Manage</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Billing history</p>
                        <p className="text-sm text-gray-600">View past transactions</p>
                      </div>
                      <Button variant="outline">View History</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-red-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-600">
                      <Trash2 size={20} />
                      Danger Zone
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Deactivate account</p>
                        <p className="text-sm text-gray-600">Temporarily disable your account</p>
                      </div>
                      <Button variant="outline">Deactivate</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Delete account</p>
                        <p className="text-sm text-gray-600">Permanently delete your account and data</p>
                      </div>
                      <Button variant="destructive">Delete Account</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;

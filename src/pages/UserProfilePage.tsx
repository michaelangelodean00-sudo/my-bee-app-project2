import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import UserProfile from '../components/UserProfile';
import { Card } from '@/components/ui/card';
import { Plus } from 'lucide-react';

const UserProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Mock user data, we will replace this with real data later
  const user = {
    id: id || 'current_user',
    name: id ? `User ${id}` : 'My Profile',
    bio: 'This is a sample bio.',
    followers: 120,
    following: 50,
    isCompany: id ? Math.random() > 0.5 : false,
    posts: [
      { id: 1, content: 'My first post!' },
      { id: 2, content: 'Having a great day!' },
    ],
    avatarUrl: `https://i.pravatar.cc/150?u=${id || 'current_user'}`,
    avatarFallback: id ? `U${id}` : 'MP',
    location: 'San Francisco, CA',
    memberSince: 'Jan 2024',
    postsCount: 2,
    isVerified: true,
  };

  const isCurrentUser = !id;

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleMobileSidebar={toggleMobileSidebar} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 dark:bg-gray-800">
          <div className="container mx-auto px-6 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-1 space-y-4">
                <UserProfile
                  name={user.name}
                  avatarUrl={user.avatarUrl}
                  avatarFallback={user.avatarFallback}
                  location={user.location}
                  memberSince={user.memberSince}
                  postsCount={user.posts.length}
                  followersCount={user.followers}
                  followingCount={user.following}
                  isVerified={user.isVerified}
                  businessOwner={user.isCompany}
                  bio={user.bio}
                  isCurrentUser={isCurrentUser}
                />

                {/* Upload Video - only visible for business profiles */}
                {user.isCompany && isCurrentUser && (
                  <Card
                    className="p-4 cursor-pointer hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 bg-card border-amber-200 dark:border-amber-800 group"
                    onClick={() => navigate('/upload-video')}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center group-hover:bg-amber-200 dark:group-hover:bg-amber-800/60 transition-colors">
                        <Plus size={20} className="text-amber-600 dark:text-amber-400" />
                      </div>
                      <div>
                        <span className="text-sm font-medium text-amber-700 dark:text-amber-300">Upload Video</span>
                        <p className="text-xs text-muted-foreground">Promote your business</p>
                      </div>
                    </div>
                  </Card>
                )}
              </div>

              <div className="lg:col-span-3">
                <div className="bg-white dark:bg-gray-700 shadow-md rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Posts</h3>
                  <div className="mt-4 grid gap-6">
                    {user.posts.map((post) => (
                      <div key={post.id} className="bg-gray-100 dark:bg-gray-800 shadow-md rounded-lg p-4">
                        <p className="text-gray-800 dark:text-gray-200">{post.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserProfilePage;
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import UserProfile from '../components/UserProfile';

const UserProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Mock user data, we will replace this with real data later
  const user = {
    id: id || 'current_user',
    name: id ? `User ${id}` : 'My Profile',
    bio: 'This is a sample bio.',
    followers: 120,
    following: 50,
    isCompany: id ? Math.random() > 0.5 : false, // Randomly assign for mock purposes
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
              <div className="lg:col-span-1">
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
                  isCurrentUser={!id}
                />
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
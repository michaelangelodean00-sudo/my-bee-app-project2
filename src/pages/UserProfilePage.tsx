import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import UserProfile from '../components/UserProfile';
import { Card } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface ProfileRow {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  account_type: 'personal' | 'business';
  business_name: string | null;
  business_category: string | null;
  phone: string | null;
  address: string | null;
  status: string;
  created_at: string;
}

const UserProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [loading, setLoading] = useState(true);

  const isCurrentUser = !id;
  const targetId = id || authUser?.id;

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!targetId) {
        setProfile(null);
        setLoading(false);
        return;
      }
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('id, display_name, avatar_url, account_type, business_name, business_category, phone, address, status, created_at')
        .eq('id', targetId)
        .maybeSingle();
      if (cancelled) return;
      if (error) {
        console.error('Failed to load profile:', error);
        setProfile(null);
      } else {
        setProfile(data as ProfileRow | null);
      }
      setLoading(false);
    };
    load();
    return () => { cancelled = true; };
  }, [targetId]);

  const toggleMobileSidebar = () => setMobileSidebarOpen(!mobileSidebarOpen);

  const displayName =
    profile?.business_name ||
    profile?.display_name ||
    (isCurrentUser ? 'My Profile' : 'User');
  const avatarUrl = profile?.avatar_url || '';
  const avatarFallback = displayName.slice(0, 2).toUpperCase();
  const isCompany = profile?.account_type === 'business' && profile?.status === 'approved';
  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })
    : '—';

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleMobileSidebar={toggleMobileSidebar} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 dark:bg-gray-800">
          <div className="container mx-auto px-6 py-8">
            {loading ? (
              <div className="text-center text-muted-foreground py-16">Loading profile…</div>
            ) : !profile ? (
              <div className="text-center text-muted-foreground py-16">Profile not found.</div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-1 space-y-4">
                  <UserProfile
                    name={displayName}
                    avatarUrl={avatarUrl}
                    avatarFallback={avatarFallback}
                    location={profile.address || ''}
                    memberSince={memberSince}
                    postsCount={0}
                    followersCount={0}
                    followingCount={0}
                    isVerified={profile.status === 'approved'}
                    businessOwner={isCompany}
                    phone={profile.phone || undefined}
                    isCurrentUser={isCurrentUser}
                  />

                  {isCompany && isCurrentUser && (
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
                    <p className="mt-4 text-sm text-muted-foreground">No posts yet.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserProfilePage;

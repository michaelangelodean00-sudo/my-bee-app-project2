import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export const useBusinessFollow = (businessId: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const queryKey = ["business-follows", businessId, user?.id ?? "anon"];

  const { data, isLoading } = useQuery({
    queryKey,
    staleTime: 30_000,
    queryFn: async () => {
      // Follower counts come from an aggregate RPC rather than a row count.
      // business_follows no longer exposes other people's follower_id to the
      // client, so counting rows directly would only ever see your own.
      const [{ data: count }, mine] = await Promise.all([
        supabase.rpc("business_follower_count", { _business_id: businessId }),
        user
          ? supabase
              .from("business_follows")
              .select("id")
              .eq("business_id", businessId)
              .eq("follower_id", user.id)
              .maybeSingle()
          : Promise.resolve({ data: null }),
      ]);
      return { followers: count ?? 0, isFollowing: !!(mine as { data: unknown }).data };
    },
  });

  const mutation = useMutation({
    mutationFn: async (follow: boolean) => {
      if (!user) throw new Error("Sign in to follow businesses.");
      if (follow) {
        const { error } = await supabase
          .from("business_follows")
          .insert({ business_id: businessId, follower_id: user.id });
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("business_follows")
          .delete()
          .eq("business_id", businessId)
          .eq("follower_id", user.id);
        if (error) throw error;
      }
    },
    onSuccess: (_r, follow) => {
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: ["followed-businesses"] });
      toast.success(follow ? "Following this business" : "Unfollowed");
    },
    onError: (e: Error) => toast.error(e.message || "Could not update follow"),
  });

  return {
    followers: data?.followers ?? 0,
    isFollowing: data?.isFollowing ?? false,
    isLoading,
    canFollow: !!user && user.id !== businessId,
    isSignedIn: !!user,
    pending: mutation.isPending,
    toggleFollow: () => mutation.mutate(!(data?.isFollowing ?? false)),
  };
};

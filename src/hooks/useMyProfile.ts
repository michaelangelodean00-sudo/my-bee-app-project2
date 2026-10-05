import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const MY_PROFILE_KEY = ["my-profile"];

export const useMyProfile = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: [...MY_PROFILE_KEY, user?.id],
    enabled: !!user?.id,
    staleTime: 30_000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("account_type, status, rejection_reason, business_name, business_category, phone, address, avatar_url")
        .eq("id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
};

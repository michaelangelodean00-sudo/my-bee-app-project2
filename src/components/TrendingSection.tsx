import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface SuggestedBusiness {
  id: string;
  name: string;
  category: string | null;
  avatarUrl: string | null;
}

const TrendingSection = () => {
  const { data: suggested = [], isLoading } = useQuery({
    queryKey: ["suggested-businesses"],
    staleTime: 60_000,
    queryFn: async (): Promise<SuggestedBusiness[]> => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, business_name, display_name, business_category, avatar_url, updated_at")
        .eq("account_type", "business")
        .eq("status", "approved")
        .order("updated_at", { ascending: false })
        .limit(3);
      if (error) throw error;
      return (data ?? []).map((row) => ({
        id: row.id,
        name: row.business_name || row.display_name || "Unnamed business",
        category: row.business_category,
        avatarUrl: row.avatar_url,
      }));
    },
  });

  if (isLoading || suggested.length === 0) return null;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Suggested for You</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          {suggested.map((business) => (
            <div key={business.id} className="flex items-center space-x-3">
              <Avatar className="h-10 w-10 rounded-lg">
                <AvatarImage src={business.avatarUrl ?? undefined} alt={business.name} />
                <AvatarFallback className="rounded-lg text-xs">
                  {business.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{business.name}</p>
                {business.category && (
                  <p className="text-xs text-muted-foreground truncate">{business.category}</p>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default TrendingSection;

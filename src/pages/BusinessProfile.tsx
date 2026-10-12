import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Phone, MessageCircle, Globe, Instagram, Facebook, MapPin, Clock } from "lucide-react";
import Header from "../components/Header";
import MobileBottomNav from "../components/MobileBottomNav";
import NotFound from "./NotFound";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useBusinessFollow } from "@/hooks/useBusinessFollow";
import { DAYS, DAY_LABELS, formatTime, getOpenStatus, nassauNow, WeekHours } from "@/lib/bahamasTime";
import { whatsappUrl, websiteUrl, instagramUrl, facebookUrl, telUrl } from "@/lib/businessLinks";
import { toast } from "sonner";

const UUID_RE = /^[0-9a-f-]{36}$/i;

const BusinessProfile = () => {
  const { id = "" } = useParams();
  const valid = UUID_RE.test(id);
  const { data, isLoading } = useQuery({
    queryKey: ["business-profile", id],
    enabled: valid,
    staleTime: 60_000,
    queryFn: async () => {
      const [{ data: p, error }, { data: d }] = await Promise.all([
        supabase.from("public_businesses").select("*").eq("id", id).maybeSingle(),
        supabase.from("business_details").select("*").eq("business_id", id).maybeSingle(),
      ]);
      if (error) throw error;
      return p ? { p, d } : null;
    },
  });
  const follow = useBusinessFollow(id);

  if (!valid || (!isLoading && !data)) return <NotFound />;

  const p = data?.p, d = data?.d;
  const hours = (d?.hours as WeekHours | null) ?? null;
  const status = getOpenStatus(hours);
  const today = nassauNow().day;
  const name = p?.business_name || p?.display_name || "Business";
  const links = [
    { href: telUrl(p?.phone), label: "Call", icon: Phone },
    { href: whatsappUrl(d?.whatsapp), label: "WhatsApp", icon: MessageCircle },
    { href: websiteUrl(d?.website), label: "Website", icon: Globe },
    { href: instagramUrl(d?.instagram), label: "Instagram", icon: Instagram },
    { href: facebookUrl(d?.facebook), label: "Facebook", icon: Facebook },
  ].filter((l) => l.href);

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header toggleMobileSidebar={() => {}} />
      <main className="max-w-2xl mx-auto px-4 py-4">
        <Link to="/businesses" className="inline-flex min-h-[44px] items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> All businesses
        </Link>
        {isLoading || !p ? (
          <Skeleton className="h-64 rounded-xl mt-2" />
        ) : (
          <article className="bee-card p-5 mt-2 space-y-5">
            <div className="flex items-start gap-4">
              <img src={p.avatar_url || "/placeholder.svg"} alt="" className="h-20 w-20 rounded-xl object-cover bg-muted flex-shrink-0" />
              <div className="min-w-0">
                <h1 className="heading-large break-words">{name}</h1>
                <p className="text-sm text-muted-foreground">{[p.business_category, d?.island].filter(Boolean).join(" · ")}</p>
                {status && (
                  <p className={`text-sm font-medium mt-1 ${status.open ? "text-primary" : "text-muted-foreground"}`}>{status.label}</p>
                )}
              </div>
            </div>

            {d?.description && <p className="text-sm text-foreground whitespace-pre-line break-words">{d.description}</p>}

            <div className="flex flex-wrap gap-2">
              <Button
                className="min-h-[44px] touch-manipulation active:scale-95"
                variant={follow.isFollowing ? "secondary" : "default"}
                disabled={follow.pending}
                onClick={() => follow.isSignedIn
                  ? follow.canFollow ? follow.toggleFollow() : toast.info("This is your own business profile.")
                  : toast.info("Sign in to follow businesses.")}
              >
                {follow.isFollowing ? "Following" : "Follow"} · {follow.followers}
              </Button>
              {links.map(({ href, label, icon: Icon }) => (
                <Button key={label} asChild variant="outline" className="min-h-[44px] touch-manipulation active:scale-95">
                  <a href={href!} target={label === "Call" ? undefined : "_blank"} rel="noopener noreferrer nofollow">
                    <Icon className="h-4 w-4" /> {label}
                  </a>
                </Button>
              ))}
            </div>

            {p.address && (
              <p className="flex items-start gap-2 text-sm"><MapPin className="h-4 w-4 mt-0.5 text-primary" />{p.address}</p>
            )}

            <section aria-labelledby="hours-h">
              <h2 id="hours-h" className="flex items-center gap-2 font-semibold mb-2"><Clock className="h-4 w-4 text-primary" /> Hours</h2>
              {hours ? (
                <table className="w-full text-sm">
                  <tbody>
                    {DAYS.map((k, i) => {
                      const h = hours[k];
                      return (
                        <tr key={k} className={i === today ? "font-semibold text-foreground" : "text-muted-foreground"}>
                          <td className="py-1 pr-4">{DAY_LABELS[k]}{i === today ? " (today)" : ""}</td>
                          <td className="py-1 text-right">
                            {!h ? "Not listed" : h.closed ? "Closed" : `${formatTime(h.open)} – ${formatTime(h.close)}`}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <p className="text-sm text-muted-foreground">This business hasn't added its hours yet.</p>
              )}
              <p className="text-xs text-muted-foreground mt-2">Times shown in Bahamas time.</p>
            </section>
          </article>
        )}
      </main>
      <MobileBottomNav />
    </div>
  );
};

export default BusinessProfile;

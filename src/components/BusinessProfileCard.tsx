import { useEffect, useState } from "react";
import { MapPin, Phone, Globe, Heart, Instagram, Facebook, Twitter, Navigation, UserPlus, UserCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useBusinessFollow } from "@/hooks/useBusinessFollow";
import { toast } from "sonner";


export interface BusinessProfile {
  id: string;
  name: string;
  category: string;
  description: string;
  address: string;
  phone?: string;
  website?: string;
  googleMapUrl?: string;
  socialMedia?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    tiktok?: string;
  };
  imageUrl: string;
  tags: string[];
  isNew?: boolean;
}

interface BusinessProfileCardProps {
  business: BusinessProfile;
  className?: string;
}

interface Engagement {
  liked: boolean;
  likes: number;
}

const storageKey = (id: string) => `business-engagement-${id}`;

const loadEngagement = (b: BusinessProfile): Engagement => {
  try {
    const raw = localStorage.getItem(storageKey(b.id));
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        liked: !!parsed.liked,
        likes: parsed.likes ?? 0,
      };
    }
  } catch {}
  return { liked: false, likes: 0 };
};

const BusinessProfileCard = ({ business, className }: BusinessProfileCardProps) => {
  const [engagement, setEngagement] = useState<Engagement>(() => loadEngagement(business));

  useEffect(() => {
    localStorage.setItem(storageKey(business.id), JSON.stringify(engagement));
  }, [business.id, engagement]);

  const toggleLike = () => {
    setEngagement(prev => {
      const liked = !prev.liked;
      return { ...prev, liked, likes: Math.max(0, prev.likes + (liked ? 1 : -1)) };
    });
  };

  return (
    <Card
      className={cn(
        "overflow-hidden border border-border bg-card hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 group",
        className
      )}
    >
      {/* Cover Image */}
      <div className="relative h-36 bg-muted overflow-hidden">
        <img
          src={business.imageUrl}
          alt={business.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {business.isNew && (
          <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground text-[10px]">
            New on B.E.E
          </Badge>
        )}
        <button
          onClick={toggleLike}
          aria-label={engagement.liked ? "Unlike business" : "Like business"}
          className="absolute bottom-2 right-2 h-9 w-9 rounded-full bg-background/85 backdrop-blur-sm border border-border flex items-center justify-center hover:scale-110 active:scale-95 transition-transform touch-manipulation"
        >
          <Heart
            className={cn(
              "h-4 w-4 transition-colors",
              engagement.liked ? "fill-rose-500 text-rose-500" : "text-foreground"
            )}
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-3 space-y-2">
        <div>
          <h3 className="font-semibold text-sm text-foreground leading-tight line-clamp-1">
            {business.name}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
            {business.description}
          </p>
        </div>

        {engagement.likes > 0 && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Heart className="h-3 w-3 fill-rose-500 text-rose-500" />
            {engagement.likes}
          </div>
        )}

        {/* Address */}
        <div className="flex items-start gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3 mt-0.5 flex-shrink-0" />
          <span className="line-clamp-1">{business.address}</span>
        </div>

        {/* Tags */}
        {business.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {business.tags.slice(0, 3).map(tag => (
              <span
                key={tag}
                className="text-[10px] px-1.5 py-0.5 rounded-full bg-accent text-accent-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          {business.phone && (
            <a href={`tel:${business.phone.replace(/\s/g, '')}`} className="flex-1">
              <Button size="sm" variant="outline" className="h-7 text-xs w-full gap-1">
                <Phone className="h-3 w-3" />
                Call
              </Button>
            </a>
          )}
          {business.website && (
            <a href={business.website} target="_blank" rel="noopener noreferrer" className="flex-1">
              <Button size="sm" variant="outline" className="h-7 text-xs w-full gap-1">
                <Globe className="h-3 w-3" />
                Visit
              </Button>
            </a>
          )}
          {business.googleMapUrl && (
            <a href={business.googleMapUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
              <Button size="sm" variant="outline" className="h-7 text-xs w-full gap-1">
                <Navigation className="h-3 w-3" />
                Map
              </Button>
            </a>
          )}
          <Button size="sm" className="h-7 text-xs flex-1">
            View
          </Button>
        </div>

        {/* Social Media */}
        {business.socialMedia && (
          <div className="flex items-center gap-2 pt-1">
            {business.socialMedia.instagram && (
              <a
                href={business.socialMedia.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="h-7 w-7 rounded-full bg-muted flex items-center justify-center hover:bg-rose-100 hover:text-rose-600 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-3.5 w-3.5" />
              </a>
            )}
            {business.socialMedia.facebook && (
              <a
                href={business.socialMedia.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="h-7 w-7 rounded-full bg-muted flex items-center justify-center hover:bg-blue-100 hover:text-blue-600 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-3.5 w-3.5" />
              </a>
            )}
            {business.socialMedia.twitter && (
              <a
                href={business.socialMedia.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="h-7 w-7 rounded-full bg-muted flex items-center justify-center hover:bg-sky-100 hover:text-sky-600 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-3.5 w-3.5" />
              </a>
            )}
            {business.socialMedia.tiktok && (
              <a
                href={business.socialMedia.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="h-7 w-7 rounded-full bg-muted flex items-center justify-center hover:bg-purple-100 hover:text-purple-600 transition-colors"
                aria-label="TikTok"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.5-4.35 2.89 2.89 0 0 1 2.5-1.43c.26 0 .51.04.76.1V9.56a6.37 6.37 0 0 0-.76-.05A6.34 6.34 0 0 0 5 15.88a6.34 6.34 0 0 0 6.34 6.33 6.34 6.34 0 0 0 6.33-6.33V8.78a8.27 8.27 0 0 0 4.83 1.55V6.88a4.87 4.87 0 0 1-2.91-.19z"/>
                </svg>
              </a>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default BusinessProfileCard;

import { MapPin, Phone, Globe, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface BusinessProfile {
  id: string;
  name: string;
  category: string;
  description: string;
  address: string;
  phone?: string;
  website?: string;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  tags: string[];
  isNew?: boolean;
  isVerified?: boolean;
}

interface BusinessProfileCardProps {
  business: BusinessProfile;
  className?: string;
}

const BusinessProfileCard = ({ business, className }: BusinessProfileCardProps) => {
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
            New
          </Badge>
        )}
        {business.isVerified && (
          <Badge className="absolute top-2 right-2 bg-emerald-600 text-white text-[10px]">
            ✓ Verified
          </Badge>
        )}
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

        {/* Rating */}
        <div className="flex items-center gap-1">
          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
          <span className="text-xs font-medium text-foreground">{business.rating.toFixed(1)}</span>
          <span className="text-xs text-muted-foreground">({business.reviewCount})</span>
        </div>

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
            <Button size="sm" variant="outline" className="h-7 text-xs flex-1 gap-1">
              <Phone className="h-3 w-3" />
              Call
            </Button>
          )}
          {business.website && (
            <Button size="sm" variant="outline" className="h-7 text-xs flex-1 gap-1">
              <Globe className="h-3 w-3" />
              Visit
            </Button>
          )}
          <Button size="sm" className="h-7 text-xs flex-1">
            View
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default BusinessProfileCard;

import { Link } from "wouter";
import { MapPin, Wifi, Plug, Star, Clock } from "lucide-react";
import type { StudySpotResponse } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { SpotImage } from "@/components/SpotImage";
import { getSpotStats } from "@/lib/reviews-data";

export function SpotCard({ spot }: { spot: StudySpotResponse }) {
  const stats = getSpotStats(spot.id);

  const imageUrl = spot.images?.[0]?.url;

  const getHoursString = () => {
    if (!spot.openingHours) return null;
    const hours = spot.openingHours as any;
    const viennaNow = new Date(new Date().toLocaleString("en-US", {timeZone: "Europe/Vienna"}));
    const currentDay = viennaNow.getDay();
    const dayMap = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    const todayKey = dayMap[currentDay];
    const todayHours = hours[todayKey];

    if (todayHours?.closed) return "Closed today";
    if (todayHours?.open && todayHours?.close) return `Open today: ${todayHours.open}–${todayHours.close}`;
    return "Closed today";
  };

  return (
    <Link 
      href={`/spots/${spot.id}`}
      className="group flex flex-col bg-card rounded-2xl overflow-hidden border border-border/50 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 relative animate-reveal h-full"
    >
      <div className="relative h-48 w-full overflow-hidden shrink-0">
        <SpotImage
          src={imageUrl} 
          spotWebsite={spot.website}
          alt={spot.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent" />
        
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white">
          <Star className="w-4 h-4 fill-[#EE9BB6] text-[#EE9BB6]" />
          <span className="font-bold text-sm">
            {stats.reviewCount > 0 ? stats.avgRating.toFixed(1) : "New"}
          </span>
          {stats.reviewCount > 0 && <span className="text-white/80 text-xs">({stats.reviewCount})</span>}
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-lg leading-tight line-clamp-1 group-hover:text-primary transition-colors mb-2">
          {spot.name}
        </h3>
        
        <div className="space-y-1.5 mb-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="line-clamp-1">{spot.address}</span>
          </div>
          {spot.openingHours && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="w-3.5 h-3.5 shrink-0" />
              <span>{getHoursString()}</span>
            </div>
          )}
        </div>

        <div className="mt-auto pt-3 border-t border-border/50 flex flex-wrap gap-2">
          {spot.hasWifi && (
            <Badge variant="secondary" className="bg-secondary/50 text-secondary-foreground font-normal gap-1 h-6">
              <Wifi className="w-3 h-3" /> WiFi
            </Badge>
          )}
          {spot.hasOutlets && (
            <Badge variant="secondary" className="bg-secondary/50 text-secondary-foreground font-normal gap-1 h-6">
              <Plug className="w-3 h-3" /> Outlets
            </Badge>
          )}
          {spot.tags && Array.isArray(spot.tags) && spot.tags.slice(0, 2).map((tag, i) => (
            <Badge key={i} variant="outline" className="font-normal text-muted-foreground border-border/50 h-6">
              {String(tag)}
            </Badge>
          ))}
        </div>
      </div>
    </Link>
  );
}

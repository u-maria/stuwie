import { Link } from "wouter";
import { MapPin, Wifi, Plug, Star, Heart, BookmarkPlus, Clock } from "lucide-react";
import type { StudySpotResponse } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useToggleSavedSpot, useSavedSpots } from "@/hooks/use-user-activity";
import { useToast } from "@/hooks/use-toast";

const DAYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

export function SpotCard({ spot }: { spot: StudySpotResponse }) {
  const { isAuthenticated } = useAuth();
  const { data: savedSpots } = useSavedSpots();
  const toggleMutation = useToggleSavedSpot();
  const { toast } = useToast();

  const isFavorite = savedSpots?.some(s => s.spotId === spot.id && s.listType === "favorite");
  const isSaved = savedSpots?.some(s => s.spotId === spot.id && s.listType === "check_later");

  const handleSave = (e: React.MouseEvent, type: "favorite" | "check_later") => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast({ title: "Please sign in", description: "You need to be signed in to save spots." });
      return;
    }
    toggleMutation.mutate({ spotId: spot.id, listType: type }, {
      onSuccess: (data) => {
        toast({ title: data.action === "added" ? "Saved!" : "Removed", description: `Spot has been ${data.action}.` });
      }
    });
  };

  const imageUrl = spot.images?.[0]?.url || "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80";

  const getHoursString = () => {
    if (!spot.openingHours) return null;
    const hours = spot.openingHours as any;
    
    // Check if Mon-Sun are same
    const allSame = DAYS.every(d => JSON.stringify(hours[d]) === JSON.stringify(hours['mon']));
    if (allSame) {
      const h = hours['mon'];
      return h.closed ? "Mon–Sun closed" : `Mon–Sun ${h.open}–${h.close}`;
    }

    // Mon-Fri same
    const weekSame = ['tue', 'wed', 'thu', 'fri'].every(d => JSON.stringify(hours[d]) === JSON.stringify(hours['mon']));
    // Sat-Sun same
    const weekendSame = JSON.stringify(hours['sat']) === JSON.stringify(hours['sun']);

    if (weekSame && weekendSame) {
      const hw = hours['mon'];
      const hwe = hours['sat'];
      return `Mon–Fri ${hw.open}–${hw.close}, Sat–Sun ${hwe.open}–${hwe.close}`;
    }

    // fallback simplified display
    const h = hours[DAYS[new Date().getDay()]];
    return h?.closed ? "Closed today" : `Open today: ${h?.open}–${h?.close}`;
  };

  return (
    <Link 
      href={`/spots/${spot.id}`}
      className="group flex flex-col bg-card rounded-2xl overflow-hidden border border-border/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative"
    >
      <div className="relative h-48 w-full overflow-hidden">
        <img 
          src={imageUrl} 
          alt={spot.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent" />
        
        <div className="absolute top-3 right-3 flex gap-2">
          <Button 
            size="icon" 
            variant="secondary" 
            className={`h-8 w-8 rounded-full backdrop-blur-md bg-white/70 hover:bg-white border-0 ${isSaved ? 'text-[#EE9BB6]' : 'text-muted-foreground'}`}
            onClick={(e) => handleSave(e, "check_later")}
          >
            <BookmarkPlus className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </Button>
          <Button 
            size="icon" 
            variant="secondary" 
            className={`h-8 w-8 rounded-full backdrop-blur-md bg-white/70 hover:bg-white border-0 ${isFavorite ? 'text-destructive' : 'text-muted-foreground'}`}
            onClick={(e) => handleSave(e, "favorite")}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </Button>
        </div>

        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white">
          <Star className="w-4 h-4 fill-[#EE9BB6] text-[#EE9BB6]" />
          <span className="font-bold text-sm">{Number(spot.avgRating).toFixed(1)}</span>
          <span className="text-white/80 text-xs">({spot.reviewCount})</span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-serif font-bold text-lg leading-tight line-clamp-1 group-hover:text-primary transition-colors">
            {spot.name}
          </h3>
        </div>
        
        <div className="space-y-1.5 mb-4">
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

        <div className="mt-auto pt-4 border-t border-border/50 flex flex-wrap gap-2">
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
          {spot.tags && Array.isArray(spot.tags) && spot.tags.map((tag, i) => (
            <Badge key={i} variant="outline" className="font-normal text-muted-foreground border-border/50 h-6">
              {String(tag)}
            </Badge>
          ))}
        </div>
      </div>
    </Link>
  );
}

import { useEffect, useState, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Link } from "wouter";
import L from "leaflet";
import { Star, SlidersHorizontal, MapPin } from "lucide-react";
import { useSpots } from "@/hooks/use-spots";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

// Fix Leaflet's default icon path issues in Vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

const DAYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

export default function MapPage() {
  const [mounted, setMounted] = useState(false);
  const [filters, setFilters] = useState({
    openNow: false,
    openOnSunday: false,
    wifi: false,
    outlets: false,
  });
  const [appliedFilters, setAppliedFilters] = useState(filters);

  const { data: spots, isLoading } = useSpots({ 
    status: "approved",
    ...(appliedFilters.wifi && { hasWifi: "true" }),
    ...(appliedFilters.outlets && { hasOutlets: "true" })
  });

  const filteredSpots = useMemo(() => {
    if (!spots) return [];
    const now = new Date();
    const day = DAYS[now.getDay()];
    const currentTime = now.getHours() * 60 + now.getMinutes();

    return spots.filter(spot => {
      if (appliedFilters.openOnSunday) {
        if (!(spot.openingHours as any)?.sun || (spot.openingHours as any).sun.closed) return false;
      }
      if (appliedFilters.openNow) {
        const hours = (spot.openingHours as any)?.[day];
        if (!hours || hours.closed) return false;
        const [oH, oM] = hours.open.split(':').map(Number);
        const [cH, cM] = hours.close.split(':').map(Number);
        const openVal = oH * 60 + oM;
        let closeVal = cH * 60 + cM;
        if (closeVal <= openVal) closeVal += 24 * 60;
        if (currentTime < openVal || currentTime >= closeVal) return false;
      }
      return true;
    });
  }, [spots, appliedFilters]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="min-h-screen bg-background" />;

  return (
    <div className="h-[calc(100vh-4rem)] w-full relative z-0">
      <MapContainer 
        center={[48.2082, 16.3738]} 
        zoom={13} 
        className="w-full h-full"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        
        {filteredSpots.map((spot) => spot.lat && spot.lng && (
          <Marker key={spot.id} position={[spot.lat, spot.lng]}>
            <Popup className="rounded-xl overflow-hidden shadow-xl border-0 p-0 m-0">
              <div className="w-64 -m-3 pb-3">
                <div className="h-32 w-full bg-muted relative mb-3">
                  <img 
                    src={spot.images?.[0]?.url || "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80"} 
                    alt={spot.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur text-white px-2 py-1 rounded-md flex items-center gap-1 text-xs">
                    <Star className="w-3 h-3 text-primary fill-primary" />
                    {Number(spot.avgRating).toFixed(1)}
                  </div>
                </div>
                <div className="px-3">
                  <h3 className="font-bold font-serif text-lg leading-tight mb-1">{spot.name}</h3>
                  <p className="text-xs text-muted-foreground mb-3">{spot.district}</p>
                  <Button asChild className="w-full h-8 text-xs font-bold">
                    <Link href={`/spots/${spot.id}`}>View Details</Link>
                  </Button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <div className="absolute top-4 left-4 z-[400] flex flex-col gap-2">
        <div className="bg-background/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg border border-border/50">
          <h2 className="font-bold text-sm">Vienna Map</h2>
          <p className="text-xs text-muted-foreground font-medium">{filteredSpots.length} spots found</p>
        </div>
        
        <Sheet>
          <SheetTrigger asChild>
            <Button size="sm" variant="secondary" className="bg-background/90 backdrop-blur-md shadow-lg border-border/50 font-bold">
              <SlidersHorizontal className="w-3.5 h-3.5 mr-2" /> Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px]">
            <SheetHeader className="mb-6">
              <SheetTitle className="font-serif">Map Filters</SheetTitle>
            </SheetHeader>
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Checkbox 
                    id="map-openNow" 
                    checked={filters.openNow} 
                    onCheckedChange={(c) => setFilters(f => ({ ...f, openNow: !!c }))} 
                  />
                  <Label htmlFor="map-openNow" className="font-bold">Open Now</Label>
                </div>
                <div className="flex items-center space-x-3">
                  <Checkbox 
                    id="map-openSunday" 
                    checked={filters.openOnSunday} 
                    onCheckedChange={(c) => setFilters(f => ({ ...f, openOnSunday: !!c }))} 
                  />
                  <Label htmlFor="map-openSunday" className="font-bold">Open on Sunday</Label>
                </div>
              </div>
              <Button className="w-full font-bold" onClick={() => setAppliedFilters(filters)}>Apply Filters</Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}

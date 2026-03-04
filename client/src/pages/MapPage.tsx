import { useEffect, useState, useMemo } from "react";
import { GoogleMap, useJsApiLoader, MarkerF, InfoWindow } from "@react-google-maps/api";
import { Link } from "wouter";
import { Star, Clock, MapPin, Search, SlidersHorizontal, X, Check } from "lucide-react";
import { useSpots } from "@/hooks/use-spots";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const containerStyle = { width: '100%', height: '100%' };
const center = { lat: 48.2082, lng: 16.3738 };
const DAYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

export default function MapPage() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ""
  });

  const [district, setDistrict] = useState<string>("all");
  const [filters, setFilters] = useState({
    openNow: false,
    openOnSunday: false,
    wifi: false,
    outlets: false,
    district: "all",
    tags: [] as string[]
  });
  const [appliedFilters, setAppliedFilters] = useState(filters);
  const [selectedSpot, setSelectedSpot] = useState<any>(null);

  const { data: spots, isLoading } = useSpots({ 
    status: "approved",
    ...(appliedFilters.district !== "all" && { district: appliedFilters.district }),
    ...(appliedFilters.wifi && { hasWifi: "true" }),
    ...(appliedFilters.outlets && { hasOutlets: "true" })
  });

  const filteredSpots = useMemo(() => {
    if (!spots) return [];
    const now = new Date();
    const day = DAYS[now.getDay()];
    const currentTime = now.getHours() * 60 + now.getMinutes();

    return spots.filter(spot => {
      if (appliedFilters.tags.length > 0) {
        const spotTags = (spot.tags || []) as string[];
        if (!appliedFilters.tags.every(tag => spotTags.includes(tag))) return false;
      }
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

  const districts = [
    "all", "1. Innere Stadt", "2. Leopoldstadt", "3. Landstraße", "4. Wieden", "5. Margareten",
    "6. Mariahilf", "7. Neubau", "8. Josefstadt", "9. Alsergrund", "10. Favoriten", "11. Simmering",
    "12. Meidling", "13. Hietzing", "14. Penzing", "15. Rudolfsheim-Fünfhaus", "16. Ottakring",
    "17. Hernals", "18. Währing", "19. Döbling", "20. Brigittenau", "21. Floridsdorf", "22. Donaustadt", "23. Liesing"
  ];

  if (!isLoaded) return <div className="min-h-screen bg-background" />;

  return (
    <div className="h-[calc(100vh-4rem)] w-full relative z-0">
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={13} options={{ disableDefaultUI: true, zoomControl: true }}>
        {filteredSpots.map(spot => spot.lat && spot.lng && (
          <MarkerF key={spot.id} position={{ lat: spot.lat, lng: spot.lng }} onClick={() => setSelectedSpot(spot)} />
        ))}
        {selectedSpot && (
          <InfoWindow position={{ lat: selectedSpot.lat, lng: selectedSpot.lng }} onCloseClick={() => setSelectedSpot(null)}>
            <div className="w-64 p-0">
              <div className="h-32 w-full bg-muted relative mb-2">
                <img src={selectedSpot.images?.[0]?.url} alt={selectedSpot.name} className="w-full h-full object-cover" />
              </div>
              <h3 className="font-bold text-base leading-tight">{selectedSpot.name}</h3>
              <p className="text-xs text-muted-foreground mb-2">{selectedSpot.district}</p>
              <Button asChild size="sm" className="w-full h-8 text-xs"><Link href={`/spots/${selectedSpot.id}`}>View Details</Link></Button>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>

      <div className="absolute top-4 left-4 z-[400] flex flex-col gap-2">
        <div className="bg-background/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg border border-border/50">
          <h2 className="font-bold text-sm">Vienna Map</h2>
          <p className="text-xs text-muted-foreground">{filteredSpots.length} spots found</p>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button size="sm" variant="secondary" className="bg-background/90 backdrop-blur-md shadow-lg border-border/50"><SlidersHorizontal className="w-3.5 h-3.5 mr-2" /> Filters</Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader><SheetTitle>Filters</SheetTitle></SheetHeader>
            <div className="space-y-6 py-4">
              <div className="space-y-4">
                <Checkbox id="map-openNow" checked={filters.openNow} onCheckedChange={(c) => setFilters(f => ({ ...f, openNow: !!c }))} />
                <Label htmlFor="map-openNow" className="ml-2">Open Now</Label>
              </div>
              <Button className="w-full" onClick={() => setAppliedFilters(filters)}>Apply Filters</Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Link } from "wouter";
import L from "leaflet";
import { Star, Navigation } from "lucide-react";
import { useSpots } from "@/hooks/use-spots";
import { Button } from "@/components/ui/button";

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

export default function MapPage() {
  const { data: spots, isLoading } = useSpots({ status: "approved" });
  const [mounted, setMounted] = useState(false);

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
        
        {spots?.map((spot) => spot.lat && spot.lng && (
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
                  <Button asChild className="w-full h-8 text-xs">
                    <Link href={`/spots/${spot.id}`}>View Details</Link>
                  </Button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Floating map tools */}
      <div className="absolute top-4 left-4 z-[400] flex flex-col gap-2">
        <div className="bg-background/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg border border-border/50">
          <h2 className="font-bold text-sm">Vienna Map</h2>
          <p className="text-xs text-muted-foreground">{spots?.length || 0} spots found</p>
        </div>
      </div>
    </div>
  );
}

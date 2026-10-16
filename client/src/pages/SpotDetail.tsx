import { useRoute, useLocation } from "wouter";
import { MapPin, Wifi, Plug, Star, Clock, ArrowLeft, MessageSquare, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { useSpot, useSpots } from "@/hooks/use-spots";
import { useReviews } from "@/hooks/use-reviews";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMemo } from "react";
import { getSpotStats, DEMO_REVIEWS } from "@/lib/reviews-data";
import { SEO } from "@/components/SEO";
import { SpotImage } from "@/components/SpotImage";

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const DAY_KEYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

export default function SpotDetail() {
  const [, params] = useRoute("/spots/:id");
  const [, setLocation] = useLocation();
  const spotId = parseInt(params?.id || "0");
  
  const { data: spot, isLoading: spotLoading } = useSpot(spotId);
  const { data: rawSpots } = useSpots({ status: "approved" });
  const { data: realReviews } = useReviews(spotId);

  const spots = useMemo(() => {
    if (!rawSpots) return [];
    return [...rawSpots].map(s => ({ ...s, ...getSpotStats(s.id) })).sort((a, b) => (b.avgRating || 0) - (a.avgRating || 0));
  }, [rawSpots]);

  const currentIndex = spots.findIndex(s => s.id === spotId);
  const prevSpot = currentIndex > 0 ? spots[currentIndex - 1] : null;
  const nextSpot = currentIndex < spots.length - 1 ? spots[currentIndex + 1] : null;

  const reviews = useMemo(() => {
    if (!spot) return [];
    const dummy = DEMO_REVIEWS.filter(r => r.spotId === spot.id);
    return [...(realReviews || []), ...dummy].sort((a, b) => new Date(b.date || b.createdAt!).getTime() - new Date(a.date || a.createdAt!).getTime());
  }, [spot, realReviews]);

  const stats = useMemo(() => getSpotStats(spotId, realReviews), [spotId, realReviews]);

  if (spotLoading) return <div className="min-h-screen bg-background animate-pulse" />;
  if (!spot) return <div className="min-h-screen bg-background flex items-center justify-center font-sans text-2xl">Spot not found</div>;

  const imageUrl = spot.images?.[0]?.url;

  const currentDayKey = DAY_KEYS[(new Date(new Date().toLocaleString("en-US", {timeZone: "Europe/Vienna"})).getDay() + 6) % 7];
  const todayHours = (spot.openingHours as any)?.[currentDayKey];

  return (
    <div className="min-h-screen bg-background pb-24">
      <SEO title={`${spot.name} — Study Spot in ${spot.district}`} description={spot.description} path={`/spots/${spot.id}`} />
      
      <div className="relative h-[40vh] md:h-[60vh] w-full animate-reveal">
        <SpotImage src={imageUrl} spotWebsite={spot.website} alt={spot.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/30" />
        
        <div className="absolute top-6 left-6 z-10">
          <Button asChild variant="secondary" size="sm" className="rounded-full bg-white/20 backdrop-blur hover:bg-white border-0 text-white hover:text-black h-10 px-4 font-sans">
            <Link href="/spots"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Browse</Link>
          </Button>
        </div>

        <div className="absolute inset-y-0 left-4 md:left-8 flex items-center">
          <Button 
            disabled={!prevSpot} 
            onClick={() => setLocation(`/spots/${prevSpot?.id}`)}
            variant="ghost" size="icon" className="h-12 w-12 rounded-full bg-black/20 text-white hover:bg-white/30 backdrop-blur disabled:opacity-0"
          >
            <ChevronLeft className="w-8 h-8" />
          </Button>
        </div>
        <div className="absolute inset-y-0 right-4 md:right-8 flex items-center">
          <Button 
            disabled={!nextSpot} 
            onClick={() => setLocation(`/spots/${nextSpot?.id}`)}
            variant="ghost" size="icon" className="h-12 w-12 rounded-full bg-black/20 text-white hover:bg-white/30 backdrop-blur disabled:opacity-0"
          >
            <ChevronRight className="w-8 h-8" />
          </Button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 max-w-7xl mx-auto w-full">
          <Badge className="bg-[#EE9BB6] text-white mb-3 md:mb-4 px-3 py-0.5 text-xs font-bold tracking-wider font-sans">{spot.district}</Badge>
          <h1 className="text-3xl md:text-6xl font-bold text-white mb-3 md:mb-4 font-sans">{spot.name}</h1>
          <div className="flex flex-wrap items-center gap-4 md:gap-6 text-white/95 text-sm md:text-lg font-medium font-sans">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 md:w-6 md:h-6 fill-[#EE9BB6] text-[#EE9BB6]" />
              <span className="font-bold">{stats.reviewCount > 0 ? stats.avgRating.toFixed(1) : "New"}</span>
              <span className="opacity-80">({stats.reviewCount} reviews)</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 md:w-5 md:h-5" />
              <span>{spot.address}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 flex flex-col md:flex-row gap-12 md:gap-20">
        <div className="flex-1 space-y-12">
          <section className="animate-reveal">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 font-sans">About</h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed whitespace-pre-line font-sans">{spot.description}</p>
            <div className="flex flex-wrap gap-2 mt-8">
               {spot.tags && (spot.tags as string[]).map((tag, i) => (
                <Badge key={i} variant="secondary" className="bg-secondary/70 text-secondary-foreground font-medium px-3 py-1 rounded-lg text-sm font-sans">
                  {tag}
                </Badge>
              ))}
            </div>
          </section>

          <section className="animate-reveal">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 font-sans">Amenities</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {spot.hasWifi && <div className="flex items-center gap-4 p-4 bg-secondary/30 rounded-2xl"><Wifi className="w-5 h-5 text-[#EE9BB6]" /><span className="font-medium font-sans">Fast WiFi</span></div>}
              {spot.hasOutlets && <div className="flex items-center gap-4 p-4 bg-secondary/30 rounded-2xl"><Plug className="w-5 h-5 text-[#EE9BB6]" /><span className="font-medium font-sans">Power Outlets</span></div>}
              {spot.sundayOpen && <div className="flex items-center gap-4 p-4 bg-secondary/30 rounded-2xl"><Clock className="w-5 h-5 text-[#EE9BB6]" /><span className="font-medium font-sans">Open Sundays</span></div>}
            </div>
          </section>

          <section className="animate-reveal">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3 font-sans">
                <MessageSquare className="w-6 h-6 md:w-8 md:h-8 text-[#EE9BB6]" /> Reviews
              </h2>
            </div>

            <div className="space-y-8">
              {reviews.length === 0 ? (
                <p className="text-lg text-muted-foreground italic font-sans">No reviews yet.</p>
              ) : reviews.map((review: any) => (
                <div key={review.id} className="border-b border-border/40 pb-8 last:border-0 font-sans">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#EE9BB6]/20 rounded-xl flex items-center justify-center font-bold text-[#EE9BB6] font-sans">
                        {(review.user?.firstName || review.firstName)?.[0] || 'U'}
                      </div>
                      <div>
                        <div className="font-bold font-sans">{review.user?.firstName || review.firstName || 'Anonymous'}</div>
                        <div className="flex gap-0.5 mt-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3.5 h-3.5 ${i < (review.rating || 0) ? "fill-[#EE9BB6] text-[#EE9BB6]" : "text-muted"}`} />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground font-medium font-sans">
                      {new Date(review.date || review.createdAt!).toLocaleDateString()}
                    </div>
                  </div>
                  <p className="text-foreground/90 leading-relaxed font-sans">{review.text}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="md:w-80 lg:w-96 space-y-8 shrink-0">
          <div className="bg-card p-6 md:p-8 rounded-[24px] md:rounded-[32px] shadow-lg border border-border/50 sticky top-28">
            <h3 className="text-xl font-bold mb-6 font-sans">Plan your visit</h3>

            <div className="space-y-6">
              <h4 className="font-bold text-[10px] uppercase tracking-widest text-muted-foreground font-sans">Opening Hours</h4>
              <div className="space-y-2">
                {DAY_KEYS.map((key, i) => {
                  const h = (spot.openingHours as any)?.[key];
                  return (
                    <div key={key} className={`flex justify-between text-sm ${key === currentDayKey ? "font-bold text-primary" : "text-muted-foreground font-medium"} font-sans`}>
                      <span>{DAYS[i]}</span>
                      <span>{h?.closed ? "Closed" : `${h?.open} – ${h?.close}`}</span>
                    </div>
                  );
                })}
              </div>
              <Button asChild variant="outline" className="w-full h-12 rounded-xl gap-2 border-2 font-bold text-sm hover:border-[#EE9BB6] hover:text-[#EE9BB6] font-sans">
                <a href={(spot as any).googleMapsUrl} target="_blank" rel="noreferrer"><ExternalLink className="w-4 h-4" /> Google Maps</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

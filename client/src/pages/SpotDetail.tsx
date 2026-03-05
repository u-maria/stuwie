import { useRoute } from "wouter";
import { MapPin, Wifi, Plug, Star, Clock, Globe, ArrowLeft, Heart, CheckCircle2, MessageSquare, ExternalLink } from "lucide-react";
import { Link } from "wouter";
import { useSpot } from "@/hooks/use-spots";
import { useReviews, useCreateReview } from "@/hooks/use-reviews";
import { useCreateCheckIn, useToggleSavedSpot, useSavedSpots, useCheckIns } from "@/hooks/use-user-activity";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const DAY_KEYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

const DUMMY_REVIEWS: Record<string, any[]> = {
  "das café": [
    { id: -1, rating: 5, text: "Best place for long study sessions. The tables are huge and the vibe is very productive.", createdAt: new Date(2026, 1, 15).toISOString(), user: { firstName: "Lukas" } },
    { id: -2, rating: 4, text: "Good coffee and reliable WiFi. Can get a bit loud during lunch hours though.", createdAt: new Date(2026, 1, 20).toISOString(), user: { firstName: "Sarah" } }
  ],
  "Jonas Reindl (Währinger Straße)": [
    { id: -3, rating: 5, text: "Specialty coffee is amazing here. Perfect for getting some focused work done near the university.", createdAt: new Date(2026, 1, 10).toISOString(), user: { firstName: "Max" } },
    { id: -4, rating: 4, text: "Super popular among students. Get there early to secure a spot with an outlet!", createdAt: new Date(2026, 1, 25).toISOString(), user: { firstName: "Emma" } }
  ],
  "J. Hornig Kaffeebar": [
    { id: -5, rating: 5, text: "Clean, modern, and very laptop-friendly. One of my favorite spots in the 7th.", createdAt: new Date(2026, 2, 1).toISOString(), user: { firstName: "Anna" } }
  ]
};

export default function SpotDetail() {
  const [, params] = useRoute("/spots/:id");
  const spotId = parseInt(params?.id || "0");
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  
  const { data: spot, isLoading: spotLoading } = useSpot(spotId);
  const { data: realReviews } = useReviews(spotId);
  const { data: savedSpots } = useSavedSpots();
  const { data: checkIns } = useCheckIns();
  
  const checkInMutation = useCreateCheckIn();
  const toggleSaveMutation = useToggleSavedSpot();
  const reviewMutation = useCreateReview();

  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);

  const reviews = useMemo(() => {
    if (!spot) return [];
    const dummy = DUMMY_REVIEWS[spot.name] || [];
    return [...(realReviews || []), ...dummy].sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }, [spot, realReviews]);

  if (spotLoading) return <div className="min-h-screen bg-background animate-pulse" />;
  if (!spot) return <div className="min-h-screen bg-background flex items-center justify-center font-serif text-2xl">Spot not found</div>;

  const isFavorite = savedSpots?.some(s => s.spotId === spot.id && s.listType === "favorite");
  const hasCheckedIn = checkIns?.some(c => c.spotId === spot.id);
  const imageUrl = spot.images?.[0]?.url || "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1920&q=80";

  const handleCheckIn = () => {
    if (!isAuthenticated) return toast({ title: "Please sign in", variant: "destructive" });
    checkInMutation.mutate(spot.id, {
      onSuccess: () => toast({ title: "Checked in successfully!" })
    });
  };

  const handleFavorite = () => {
    if (!isAuthenticated) return toast({ title: "Please sign in", variant: "destructive" });
    toggleSaveMutation.mutate({ spotId: spot.id, listType: "favorite" });
  };

  const submitReview = () => {
    if (!isAuthenticated) return toast({ title: "Please sign in", variant: "destructive" });
    if (!reviewText.trim()) return;
    reviewMutation.mutate({ spotId: spot.id, rating, text: reviewText }, {
      onSuccess: () => {
        setReviewText("");
        toast({ title: "Review submitted!" });
      }
    });
  };

  const viennaNow = new Date(new Date().toLocaleString("en-US", {timeZone: "Europe/Vienna"}));
  const currentDayKey = DAY_KEYS[(viennaNow.getDay() + 6) % 7];
  const todayHours = (spot.openingHours as any)?.[currentDayKey];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Hero Section */}
      <div className="relative h-[40vh] md:h-[50vh] w-full">
        <img src={imageUrl} alt={spot.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40" />
        
        <div className="absolute top-6 left-6">
          <Button asChild variant="secondary" size="icon" className="rounded-full bg-white/20 backdrop-blur hover:bg-white border-0 text-white hover:text-black h-12 w-12">
            <Link href="/spots"><ArrowLeft className="w-6 h-6" /></Link>
          </Button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-8 max-w-6xl mx-auto w-full">
          <Badge className="bg-[#EE9BB6] text-white mb-4 px-4 py-1 text-sm font-bold tracking-wider">{spot.district}</Badge>
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-white mb-4">{spot.name}</h1>
          <div className="flex flex-wrap items-center gap-6 text-white/95 text-lg font-medium">
            <div className="flex items-center gap-2">
              <Star className="w-6 h-6 fill-[#EE9BB6] text-[#EE9BB6]" />
              <span className="font-bold">{Number(spot.avgRating || 0).toFixed(1)}</span>
              <span className="opacity-80">({reviews.length} reviews)</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <span>{spot.address}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 sm:px-8 py-12 md:py-16 flex flex-col md:flex-row gap-16">
        {/* Main Content */}
        <div className="flex-1 space-y-12">
          <section>
            <h2 className="text-3xl font-serif font-bold mb-6">About</h2>
            <p className="text-xl text-muted-foreground leading-relaxed whitespace-pre-line">{spot.description}</p>
            <div className="flex flex-wrap gap-2 mt-8">
               {spot.tags && Array.isArray(spot.tags) && spot.tags.map((tag, i) => (
                <Badge key={i} variant="secondary" className="bg-secondary/70 text-secondary-foreground font-bold px-4 py-1.5 rounded-xl text-sm">
                  {String(tag)}
                </Badge>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-serif font-bold mb-8">Amenities</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {spot.hasWifi && (
                <div className="flex items-center gap-4 p-5 bg-secondary/30 rounded-3xl">
                  <div className="bg-background p-3 rounded-2xl shadow-sm"><Wifi className="w-6 h-6 text-[#EE9BB6]" /></div>
                  <span className="font-bold text-lg">Fast WiFi</span>
                </div>
              )}
              {spot.hasOutlets && (
                <div className="flex items-center gap-4 p-5 bg-secondary/30 rounded-3xl">
                  <div className="bg-background p-3 rounded-2xl shadow-sm"><Plug className="w-6 h-6 text-[#EE9BB6]" /></div>
                  <span className="font-bold text-lg">Power Outlets</span>
                </div>
              )}
              {spot.sundayOpen && (
                <div className="flex items-center gap-4 p-5 bg-secondary/30 rounded-3xl">
                  <div className="bg-background p-3 rounded-2xl shadow-sm"><Clock className="w-6 h-6 text-[#EE9BB6]" /></div>
                  <span className="font-bold text-lg">Open Sundays</span>
                </div>
              )}
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-serif font-bold mb-8 flex items-center gap-3">
              <MessageSquare className="w-8 h-8 text-[#EE9BB6]" /> 
              Reviews
            </h2>
            
            {isAuthenticated && (
              <div className="bg-card p-8 rounded-3xl border border-border/50 shadow-md mb-12">
                <h3 className="text-xl font-bold mb-6">Leave a review</h3>
                <div className="flex gap-3 mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} onClick={() => setRating(star)} className="hover:scale-110 transition-transform">
                      <Star className={`w-8 h-8 ${rating >= star ? "fill-[#EE9BB6] text-[#EE9BB6]" : "text-muted"}`} />
                    </button>
                  ))}
                </div>
                <Textarea 
                  placeholder="How was the vibe? Was the WiFi fast?" 
                  className="mb-6 rounded-2xl resize-none text-lg p-4 bg-background border-border/50 focus:ring-2 focus:ring-[#EE9BB6]"
                  rows={4}
                  value={reviewText}
                  onChange={e => setReviewText(e.target.value)}
                />
                <Button onClick={submitReview} disabled={reviewMutation.isPending} className="rounded-xl h-12 px-8 font-bold text-lg">
                  {reviewMutation.isPending ? "Submitting..." : "Submit Review"}
                </Button>
              </div>
            )}

            <div className="space-y-8">
              {reviews.length === 0 ? (
                <p className="text-xl text-muted-foreground italic">No reviews yet. Be the first!</p>
              ) : reviews.map((review) => (
                <div key={review.id} className="border-b border-border/40 pb-10 last:border-0">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#EE9BB6]/20 rounded-2xl flex items-center justify-center font-black text-[#EE9BB6] text-xl">
                        {review.user?.firstName?.[0] || review.user?.email?.[0] || 'U'}
                      </div>
                      <div>
                        <div className="font-black text-lg">{review.user?.firstName || 'Anonymous User'}</div>
                        <div className="flex gap-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < review.rating ? "fill-[#EE9BB6] text-[#EE9BB6]" : "text-muted"}`} />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground font-bold">
                      {new Date(review.createdAt!).toLocaleDateString()}
                    </div>
                  </div>
                  <p className="text-foreground/90 text-lg leading-relaxed mt-4">{review.text}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar Actions */}
        <div className="md:w-96 space-y-8">
          <div className="bg-card p-8 rounded-[32px] shadow-2xl border border-border/50 sticky top-28">
            <h3 className="font-serif font-bold text-2xl mb-8">Quick Actions</h3>
            
            <Button 
              className={`w-full justify-center h-16 rounded-2xl mb-4 text-xl font-black shadow-lg transition-all ${hasCheckedIn ? "bg-accent hover:bg-accent/90" : "bg-primary"}`}
              onClick={handleCheckIn}
              disabled={checkInMutation.isPending || hasCheckedIn}
            >
              <CheckCircle2 className="w-6 h-6 mr-3" />
              {hasCheckedIn ? "Checked In!" : "Check-in Here"}
            </Button>
            
            <Button 
              variant="outline" 
              className={`w-full justify-center h-16 rounded-2xl mb-8 border-3 text-xl font-black transition-all ${isFavorite ? "border-destructive text-destructive" : ""}`}
              onClick={handleFavorite}
              disabled={toggleSaveMutation.isPending}
            >
              <Heart className={`w-6 h-6 mr-3 ${isFavorite ? "fill-destructive" : ""}`} />
              {isFavorite ? "In Favorites" : "Favorite Spot"}
            </Button>

            <div className="space-y-6 pt-8 border-t border-border/50">
              <div>
                <h4 className="font-black text-sm uppercase tracking-widest text-muted-foreground mb-4">Opening Hours</h4>
                <div className="space-y-2">
                   <div className="flex justify-between items-center bg-secondary/30 p-3 rounded-xl mb-4 border-2 border-primary/10">
                    <span className="font-black text-sm">Open today</span>
                    <span className="font-bold text-sm text-primary">
                      {todayHours?.closed ? "Closed" : `${todayHours?.open} – ${todayHours?.close}`}
                    </span>
                  </div>
                  <div className="space-y-2 px-1">
                    {DAY_KEYS.map((key, i) => {
                      const h = (spot.openingHours as any)?.[key];
                      const isToday = key === currentDayKey;
                      return (
                        <div key={key} className={`flex justify-between text-sm ${isToday ? "font-black text-primary" : "text-muted-foreground font-bold"}`}>
                          <span>{DAYS[i]}</span>
                          <span>{h?.closed ? "Closed" : `${h?.open} – ${h?.close}`}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-border/50 space-y-4">
                <Button asChild variant="outline" className="w-full h-14 rounded-2xl gap-3 border-2 font-black text-lg hover:border-[#EE9BB6] hover:text-[#EE9BB6] transition-all">
                  <a href={(spot as any).googleMapsUrl} target="_blank" rel="noreferrer">
                    <ExternalLink className="w-5 h-5" />
                    Open in Google Maps
                  </a>
                </Button>
                
                {spot.website && (
                  <div className="flex items-center gap-3 text-muted-foreground px-2">
                    <Globe className="w-5 h-5 text-[#EE9BB6]" />
                    <a href={spot.website} target="_blank" rel="noreferrer" className="text-primary font-bold hover:underline truncate text-base">
                      {spot.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

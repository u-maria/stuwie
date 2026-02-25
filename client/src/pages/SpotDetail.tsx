import { useRoute } from "wouter";
import { MapPin, Wifi, Plug, Star, Clock, Globe, ArrowLeft, Heart, CheckCircle2, MessageSquare } from "lucide-react";
import { Link } from "wouter";
import { useSpot } from "@/hooks/use-spots";
import { useReviews, useCreateReview } from "@/hooks/use-reviews";
import { useCreateCheckIn, useToggleSavedSpot, useSavedSpots, useCheckIns } from "@/hooks/use-user-activity";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function SpotDetail() {
  const [, params] = useRoute("/spots/:id");
  const spotId = parseInt(params?.id || "0");
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  
  const { data: spot, isLoading: spotLoading } = useSpot(spotId);
  const { data: reviews } = useReviews(spotId);
  const { data: savedSpots } = useSavedSpots();
  const { data: checkIns } = useCheckIns();
  
  const checkInMutation = useCreateCheckIn();
  const toggleSaveMutation = useToggleSavedSpot();
  const reviewMutation = useCreateReview();

  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);

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

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Hero Section */}
      <div className="relative h-[40vh] md:h-[50vh] w-full">
        {/* cafe interior large */}
        <img src={imageUrl} alt={spot.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40" />
        
        <div className="absolute top-4 left-4">
          <Button asChild variant="secondary" size="icon" className="rounded-full bg-white/20 backdrop-blur hover:bg-white border-0 text-white hover:text-black">
            <Link href="/spots"><ArrowLeft className="w-5 h-5" /></Link>
          </Button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 max-w-5xl mx-auto w-full">
          <Badge className="bg-primary text-primary-foreground mb-3">{spot.district}</Badge>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-2">{spot.name}</h1>
          <div className="flex items-center gap-4 text-white/90">
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 fill-primary text-primary" />
              <span className="font-bold">{Number(spot.avgRating).toFixed(1)}</span>
              <span>({spot.reviewCount} reviews)</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{spot.address}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex flex-col md:flex-row gap-12">
        {/* Main Content */}
        <div className="flex-1 space-y-10">
          <section>
            <h2 className="text-2xl font-serif font-bold mb-4">About</h2>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{spot.description}</p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold mb-4">Amenities</h2>
            <div className="flex flex-wrap gap-4">
              {spot.hasWifi && (
                <div className="flex items-center gap-3 p-4 bg-secondary/50 rounded-2xl flex-1 min-w-[200px]">
                  <div className="bg-background p-2 rounded-full"><Wifi className="w-5 h-5 text-primary" /></div>
                  <span className="font-medium">Fast WiFi</span>
                </div>
              )}
              {spot.hasOutlets && (
                <div className="flex items-center gap-3 p-4 bg-secondary/50 rounded-2xl flex-1 min-w-[200px]">
                  <div className="bg-background p-2 rounded-full"><Plug className="w-5 h-5 text-primary" /></div>
                  <span className="font-medium">Power Outlets</span>
                </div>
              )}
              {spot.sundayOpen && (
                <div className="flex items-center gap-3 p-4 bg-secondary/50 rounded-2xl flex-1 min-w-[200px]">
                  <div className="bg-background p-2 rounded-full"><Clock className="w-5 h-5 text-primary" /></div>
                  <span className="font-medium">Open Sundays</span>
                </div>
              )}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold mb-6 flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-primary" /> 
              Reviews
            </h2>
            
            {isAuthenticated && (
              <div className="bg-card p-6 rounded-2xl border border-border/50 shadow-sm mb-8">
                <h3 className="font-bold mb-4">Leave a review</h3>
                <div className="flex gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} onClick={() => setRating(star)}>
                      <Star className={`w-6 h-6 ${rating >= star ? "fill-primary text-primary" : "text-muted"}`} />
                    </button>
                  ))}
                </div>
                <Textarea 
                  placeholder="How was the vibe? Was the WiFi fast?" 
                  className="mb-4 rounded-xl resize-none"
                  rows={3}
                  value={reviewText}
                  onChange={e => setReviewText(e.target.value)}
                />
                <Button onClick={submitReview} disabled={reviewMutation.isPending} className="rounded-xl">
                  {reviewMutation.isPending ? "Submitting..." : "Submit Review"}
                </Button>
              </div>
            )}

            <div className="space-y-6">
              {reviews?.length === 0 ? (
                <p className="text-muted-foreground italic">No reviews yet. Be the first!</p>
              ) : reviews?.map((review) => (
                <div key={review.id} className="border-b border-border/50 pb-6 last:border-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center font-bold text-primary">
                        {review.user?.firstName?.[0] || review.user?.email?.[0] || 'U'}
                      </div>
                      <div>
                        <div className="font-bold text-sm">{review.user?.firstName || 'Anonymous User'}</div>
                        <div className="flex gap-0.5 mt-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3 h-3 ${i < review.rating ? "fill-primary text-primary" : "text-muted"}`} />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(review.createdAt!).toLocaleDateString()}
                    </div>
                  </div>
                  <p className="text-foreground text-sm leading-relaxed mt-3">{review.text}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar Actions */}
        <div className="md:w-80 space-y-6">
          <div className="bg-card p-6 rounded-3xl shadow-lg border border-border/50 sticky top-24">
            <h3 className="font-serif font-bold text-xl mb-6">Actions</h3>
            
            <Button 
              className={`w-full justify-start h-12 rounded-xl mb-3 transition-all ${hasCheckedIn ? "bg-accent hover:bg-accent/90" : "bg-primary"}`}
              onClick={handleCheckIn}
              disabled={checkInMutation.isPending || hasCheckedIn}
            >
              <CheckCircle2 className="w-5 h-5 mr-3" />
              {hasCheckedIn ? "Checked In Today" : "Check-in Here"}
            </Button>
            
            <Button 
              variant="outline" 
              className={`w-full justify-start h-12 rounded-xl mb-6 border-2 transition-all ${isFavorite ? "border-destructive text-destructive" : ""}`}
              onClick={handleFavorite}
              disabled={toggleSaveMutation.isPending}
            >
              <Heart className={`w-5 h-5 mr-3 ${isFavorite ? "fill-destructive" : ""}`} />
              {isFavorite ? "Saved to Favorites" : "Add to Favorites"}
            </Button>

            <div className="space-y-4 pt-6 border-t border-border/50 text-sm">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Globe className="w-4 h-4 text-primary" />
                {spot.website ? (
                  <a href={spot.website} target="_blank" rel="noreferrer" className="text-primary hover:underline truncate">
                    {spot.website.replace(/^https?:\/\//, '')}
                  </a>
                ) : "No website"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

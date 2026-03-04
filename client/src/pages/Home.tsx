import { useState, useEffect, useCallback, useMemo } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Search, Map, Coffee, BookOpen, Star, Wifi, Plug, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useSpots } from "@/hooks/use-spots";
import { Badge } from "@/components/ui/badge";

const MOTTOS = [
  "Stop guessing. Start studying.",
  "Sunday-safe study spots.",
  "Built for students by students.",
];

function FeaturedSpotHeroCard({ spots }: { spots: any[] }) {
  const [, setLocation] = useLocation();
  const [featuredSpot, setFeaturedSpot] = useState<any>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (spots && spots.length > 0) {
      const randomSpot = spots[Math.floor(Math.random() * spots.length)];
      setFeaturedSpot(randomSpot);
    }
  }, [spots]);

  if (!featuredSpot) return null;

  const imageUrl = featuredSpot.images?.[0]?.url || "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80";

  return (
    <div className="space-y-3 w-full max-w-md mx-auto">
      <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest text-center md:text-left">Try this spot today</p>
      <motion.div
        whileHover={{ y: -8, scale: 1.03 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={() => setLocation(`/spots/${featuredSpot.id}`)}
        className="relative rounded-[24px] overflow-hidden shadow-2xl shadow-black/10 aspect-[4/5] md:aspect-square cursor-pointer border-8 border-white group"
      >
        <img 
          src={imageUrl} 
          alt={featuredSpot.name} 
          className="w-full h-full object-cover rounded-[16px]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none rounded-[16px]" />
        
        <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between gap-3 mb-1">
            <div className="flex items-center gap-3">
              <div className="bg-primary/20 p-2 rounded-lg text-primary">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-foreground leading-tight">{featuredSpot.name}</div>
                <div className="text-xs text-muted-foreground">
                  {featuredSpot.district} Wien • {featuredSpot.hasWifi ? "Fast WiFi" : "WiFi available"}
                </div>
              </div>
            </div>
            {featuredSpot.avgRating && (
              <div className="flex items-center gap-1 text-sm font-bold text-primary">
                <Star className="w-4 h-4 fill-current" />
                {Number(featuredSpot.avgRating).toFixed(1)}
              </div>
            )}
          </div>

          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="pt-3 border-t border-border/50 mt-3 flex flex-wrap gap-2">
                  {featuredSpot.hasWifi && (
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-none text-[10px] h-5">
                      <Wifi className="w-3 h-3 mr-1" /> Fast WiFi
                    </Badge>
                  )}
                  {featuredSpot.hasOutlets && (
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-none text-[10px] h-5">
                      <Plug className="w-3 h-3 mr-1" /> Outlets
                    </Badge>
                  )}
                  {featuredSpot.sundayOpen && (
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-none text-[10px] h-5">
                      <Clock className="w-3 h-3 mr-1" /> Sunday-safe
                    </Badge>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

export default function Home() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { data: spots } = useSpots({ status: "approved" });
  const [currentMotto, setCurrentMotto] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const nextMotto = useCallback(() => {
    setCurrentMotto((prev) => (prev + 1) % MOTTOS.length);
  }, []);

  useEffect(() => {
    if (isPaused || prefersReducedMotion) return;
    const interval = setInterval(nextMotto, 3000);
    return () => clearInterval(interval);
  }, [isPaused, nextMotto, prefersReducedMotion]);

  if (authLoading) return <div className="min-h-screen bg-background" />;

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col">
      <main className="flex-1 flex flex-col md:flex-row items-center justify-center p-6 md:p-12 max-w-7xl mx-auto w-full gap-12 lg:gap-24">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1 max-w-2xl space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold uppercase tracking-wider mb-4">
            <Coffee className="w-4 h-4" />
            <span>Vienna's Best Study Spots</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-foreground leading-[1.1]">
            Find your perfect <br />
            <span className="text-primary italic underline decoration-accent/30 underline-offset-8">focus space.</span>
          </h1>
          
          <div 
            className="h-14 overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onFocus={() => setIsPaused(true)}
            onBlur={() => setIsPaused(false)}
          >
            <AnimatePresence mode="wait">
              <motion.p
                key={currentMotto}
                initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
                animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                exit={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                className="text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed font-medium"
              >
                {MOTTOS[currentMotto]}
              </motion.p>
            </AnimatePresence>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button asChild size="lg" className="rounded-full px-8 text-base shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 font-bold">
              <Link href="/spots">
                <Search className="w-5 h-5 mr-2" />
                Browse Spots
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full px-8 text-base border-2 hover:bg-secondary/50 transition-all duration-300 font-bold">
              <Link href="/map">
                <Map className="w-5 h-5 mr-2" />
                Explore Map
              </Link>
            </Button>
          </div>

          <div className="pt-8 grid grid-cols-2 md:grid-cols-3 gap-6 border-t border-border/50 mt-8">
            <div>
              <div className="text-3xl font-serif font-bold text-foreground">120+</div>
              <div className="text-sm text-muted-foreground font-medium">Curated Spots</div>
            </div>
            <div>
              <div className="text-3xl font-serif font-bold text-foreground">4.8</div>
              <div className="text-sm text-muted-foreground font-medium">Average Rating</div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex-1 w-full relative"
        >
          <FeaturedSpotHeroCard spots={spots || []} />
          
          {/* Decorative blur blobs */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 blur-3xl rounded-full -z-10" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-accent/20 blur-3xl rounded-full -z-10" />
        </motion.div>

      </main>
    </div>
  );
}

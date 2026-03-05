import { useState, useEffect, useCallback, useMemo } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Search, Map, Coffee, BookOpen, Star, Wifi, Plug, Clock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useSpots } from "@/hooks/use-spots";
import { Badge } from "@/components/ui/badge";
import { SEO } from "@/components/SEO";
import { getSpotStats } from "@/lib/reviews-data";

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

  const stats = getSpotStats(featuredSpot.id);
  const imageUrl = featuredSpot.images?.[0]?.url || "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80";

  return (
    <div className="space-y-4 w-full max-w-lg mx-auto relative animate-reveal">
      {/* Decorative Sparkles */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], rotate: [0, 10, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute -top-6 -right-6 text-[#EE9BB6] hidden md:block"
      >
        <Sparkles className="w-10 h-10 fill-current" />
      </motion.div>

      <p className="text-base font-bold text-muted-foreground uppercase tracking-[0.2em] text-center md:text-left">Try this spot today</p>
      <motion.div
        whileHover={{ y: -12, scale: 1.04 }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={() => setLocation(`/spots/${featuredSpot.id}`)}
        className="relative rounded-[32px] overflow-hidden shadow-2xl shadow-black/15 aspect-[4/5] md:aspect-square cursor-pointer border-[10px] border-white group"
      >
        <img 
          src={imageUrl} 
          alt={featuredSpot.name} 
          className="w-full h-full object-cover rounded-[22px]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none rounded-[22px]" />
        
        <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between gap-3 mb-1">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-xl text-primary">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <div className="font-bold text-xl text-foreground leading-tight">{featuredSpot.name}</div>
                <div className="text-sm text-muted-foreground font-medium">
                  {featuredSpot.district} Wien • {featuredSpot.hasWifi ? "Fast WiFi" : "WiFi available"}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 text-lg font-bold text-[#EE9BB6]">
              <Star className="w-5 h-5 fill-current" />
              {stats.reviewCount > 0 ? stats.avgRating.toFixed(1) : "New"}
            </div>
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
                <div className="pt-4 border-t border-border/50 mt-4 flex flex-wrap gap-2">
                  {featuredSpot.hasWifi && (
                    <Badge variant="secondary" className="bg-[#EE9BB6]/10 text-[#EE9BB6] border-none text-xs h-6 px-3">
                      <Wifi className="w-3.5 h-3.5 mr-1.5" /> Fast WiFi
                    </Badge>
                  )}
                  {featuredSpot.hasOutlets && (
                    <Badge variant="secondary" className="bg-[#EE9BB6]/10 text-[#EE9BB6] border-none text-xs h-6 px-3">
                      <Plug className="w-3.5 h-3.5 mr-1.5" /> Outlets
                    </Badge>
                  )}
                  {featuredSpot.sundayOpen && (
                    <Badge variant="secondary" className="bg-[#EE9BB6]/10 text-[#EE9BB6] border-none text-xs h-6 px-3">
                      <Clock className="w-3.5 h-3.5 mr-1.5" /> Sunday-safe
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
    <div className="min-h-[calc(100vh-5rem)] flex flex-col relative overflow-hidden">
      <SEO 
        title="Find your perfect focus space" 
        description="The curated directory of study-friendly cafés and spaces in Vienna. Find WiFi, power outlets, and Sunday-safe spots." 
        path="/"
      />
      {/* Decorative Background Elements */}
      <div className="absolute top-[10%] left-[-5%] w-64 h-64 bg-[#EE9BB6]/10 blur-[100px] rounded-full -z-10" />
      <div className="absolute bottom-[20%] right-[-5%] w-96 h-96 bg-primary/10 blur-[120px] rounded-full -z-10" />

      <main className="flex-1 flex flex-col md:flex-row items-start justify-center p-8 md:p-16 max-w-screen-2xl mx-auto w-full gap-16 lg:gap-32 pt-12 md:pt-24">
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="flex-1 max-w-3xl space-y-10 md:mt-12"
        >
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-[#EE9BB6]/15 text-[#EE9BB6] text-sm font-black uppercase tracking-widest mb-2">
            <Coffee className="w-5 h-5" />
            <span>Vienna's Best Study Spots</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-serif font-bold text-foreground leading-[1.05] tracking-tight">
            Find your perfect <br />
            <span className="text-primary italic relative">
              focus space.
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1, delay: 0.5 }}
                className="absolute bottom-2 left-0 h-3 bg-[#EE9BB6]/30 -z-10 rounded-full"
              />
            </span>
          </h1>
          
          <div 
            className="h-16 overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onFocus={() => setIsPaused(true)}
            onBlur={() => setIsPaused(false)}
          >
            <AnimatePresence mode="wait">
              <motion.p
                key={currentMotto}
                initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 15 }}
                animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                exit={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: -15 }}
                transition={{ duration: 0.5 }}
                className="text-xl md:text-2xl text-muted-foreground max-w-xl leading-relaxed font-bold tracking-tight"
              >
                {MOTTOS[currentMotto]}
              </motion.p>
            </AnimatePresence>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 pt-6">
            <Button asChild size="xl" className="rounded-full px-12 h-16 text-xl shadow-xl shadow-primary/25 hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-400 font-black tracking-tight">
              <Link href="/spots">
                <Search className="w-6 h-6 mr-3" />
                Browse Spots
              </Link>
            </Button>
            <Button asChild size="xl" variant="outline" className="rounded-full px-12 h-16 text-xl border-3 hover:bg-secondary/60 transition-all duration-400 font-black tracking-tight">
              <Link href="/map">
                <Map className="w-6 h-6 mr-3" />
                Explore Map
              </Link>
            </Button>
          </div>

          <div className="pt-12 grid grid-cols-2 md:grid-cols-3 gap-10 border-t border-border/60 mt-12">
            <div>
              <div className="text-4xl font-serif font-bold text-foreground">120+</div>
              <div className="text-base text-muted-foreground font-bold tracking-tight">Curated Spots</div>
            </div>
            <div>
              <div className="text-4xl font-serif font-bold text-[#EE9BB6]">4.8</div>
              <div className="text-base text-muted-foreground font-bold tracking-tight">Average Rating</div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="flex-1 w-full"
        >
          <FeaturedSpotHeroCard spots={spots || []} />
        </motion.div>

      </main>
    </div>
  );
}

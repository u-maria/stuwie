import { useState, useEffect, useCallback } from "react";
import { useLocation, Link } from "wouter";
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
  const prefersReducedMotion = useReducedMotion();

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
    <div className="space-y-3 w-full max-w-lg mx-auto relative animate-reveal">
      <motion.div 
        animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute -top-4 -right-4 text-[#EE9BB6] hidden md:block"
      >
        <Sparkles className="w-8 h-8 fill-current" />
      </motion.div>

      <p className="text-xs md:text-sm font-bold text-muted-foreground uppercase tracking-widest text-center md:text-left font-sans">Try this spot today</p>
      <motion.div
        whileHover={prefersReducedMotion ? {} : { y: -8, scale: 1.02 }}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={() => setLocation(`/spots/${featuredSpot.id}`)}
        className="relative rounded-[24px] md:rounded-[32px] overflow-hidden shadow-xl cursor-pointer border-[6px] md:border-[10px] border-white group"
      >
        <img src={imageUrl} alt={featuredSpot.name} className="w-full h-full object-cover aspect-[4/5] md:aspect-square" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
        
        <div className="absolute bottom-3 left-3 right-3 md:bottom-6 md:left-6 md:right-6 bg-white/95 backdrop-blur-md p-3 md:p-6 rounded-xl md:rounded-2xl shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 md:gap-4">
              <div className="bg-primary/10 p-1.5 md:p-3 rounded-lg text-primary hidden sm:block">
                <BookOpen className="w-4 h-4 md:w-6 md:h-6" />
              </div>
              <div>
                <div className="font-bold text-sm md:text-xl text-foreground leading-tight font-sans">{featuredSpot.name}</div>
                <div className="text-[10px] md:text-sm text-muted-foreground font-medium font-sans">
                  {featuredSpot.district} • {featuredSpot.hasWifi ? "WiFi" : "WiFi avail."}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm md:text-lg font-bold text-[#EE9BB6] font-sans">
              <Star className="w-3 h-3 md:w-5 md:h-5 fill-current" />
              {stats.reviewCount > 0 ? stats.avgRating.toFixed(1) : "New"}
            </div>
          </div>

          <AnimatePresence>
            {isHovered && !prefersReducedMotion && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="hidden md:block overflow-hidden"
              >
                <div className="pt-4 mt-4 border-t border-border/40 flex flex-wrap gap-2">
                  {featuredSpot.hasWifi && <Badge variant="secondary" className="bg-accent/10 text-accent border-none text-[10px] font-sans">Fast WiFi</Badge>}
                  {featuredSpot.hasOutlets && <Badge variant="secondary" className="bg-accent/10 text-accent border-none text-[10px] font-sans">Outlets</Badge>}
                  {featuredSpot.sundayOpen && <Badge variant="secondary" className="bg-accent/10 text-accent border-none text-[10px] font-sans">Sunday-safe</Badge>}
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
  const { isLoading: authLoading } = useAuth();
  const { data: spots } = useSpots({ status: "approved" });
  const [currentMotto, setCurrentMotto] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;
    const interval = setInterval(() => setCurrentMotto(m => (m + 1) % MOTTOS.length), 3000);
    return () => clearInterval(interval);
  }, [prefersReducedMotion]);

  if (authLoading) return <div className="min-h-screen bg-background" />;

  return (
    <div className="min-h-[calc(100vh-5rem)] flex flex-col relative overflow-hidden">
      <SEO title="Find your perfect focus space" description="Curated study-friendly cafés in Vienna." path="/" />
      
      <div className="absolute top-[10%] left-[-5%] w-64 h-64 bg-[#EE9BB6]/10 blur-[100px] rounded-full -z-10" />
      <div className="absolute bottom-[20%] right-[-5%] w-96 h-96 bg-primary/10 blur-[120px] rounded-full -z-10" />

      <main className="flex-1 flex flex-col md:flex-row items-center md:items-start justify-center p-6 md:p-16 max-w-screen-2xl mx-auto w-full gap-8 md:gap-16 lg:gap-24 md:pt-20">
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex-1 max-w-3xl space-y-6 md:space-y-8 md:mt-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EE9BB6]/15 text-[#EE9BB6] text-[10px] md:text-xs font-bold uppercase tracking-widest font-sans">
            <Coffee className="w-3.5 h-3.5" />
            <span>Vienna's Best Study Spots</span>
          </div>
          
          <h1 className="text-4xl md:text-7xl lg:text-8xl font-sans font-bold text-foreground leading-[1.1] tracking-tight">
            Find your perfect <br />
            <span className="text-primary italic relative font-sans">
              focus space.
              <div className="absolute bottom-1 md:bottom-2 left-0 w-full h-2 md:h-3 bg-[#EE9BB6]/20 -z-10 rounded-full" />
            </span>
          </h1>
          
          <div className="h-12 md:h-16">
            <AnimatePresence mode="wait">
              <motion.p key={currentMotto} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="text-base md:text-2xl text-muted-foreground font-medium font-sans">
                {MOTTOS[currentMotto]}
              </motion.p>
            </AnimatePresence>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="rounded-full px-8 h-12 md:h-14 text-base md:text-lg font-bold shadow-lg shadow-primary/10 font-sans">
              <Link href="/spots"><Search className="w-5 h-5 mr-2" /> Browse Spots</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full px-8 h-12 md:h-14 text-base md:text-lg font-bold border-2 font-sans">
              <Link href="/map"><Map className="w-5 h-5 mr-2" /> Explore Map</Link>
            </Button>
          </div>

          <div className="pt-8 flex gap-12 border-t border-border/40">
            <div>
              <div className="text-2xl md:text-4xl font-sans font-bold">120+</div>
              <div className="text-xs md:text-sm text-muted-foreground font-medium font-sans">Curated Spots</div>
            </div>
            <div>
              <div className="text-2xl md:text-4xl font-sans font-bold text-[#EE9BB6]">4.8</div>
              <div className="text-xs md:text-sm text-muted-foreground font-medium font-sans">Avg Rating</div>
            </div>
          </div>
        </motion.div>

        <div className="flex-1 w-full max-w-md md:max-w-none">
          <FeaturedSpotHeroCard spots={spots || []} />
        </div>
      </main>
    </div>
  );
}

import { useState, useEffect, useCallback } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Search, Map, Coffee, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import heroImg from "@assets/27298177-5dbc-486f-9618-14966332c07a_1771986021233.png";

const MOTTOS = [
  "Stop guessing. Start studying.",
  "Sunday-safe study spots.",
  "Built for students by students.",
];

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
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

  if (isLoading) return <div className="min-h-screen bg-background" />;

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col">
      <main className="flex-1 flex flex-col md:flex-row items-center justify-center p-6 md:p-12 max-w-7xl mx-auto w-full gap-12">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1 max-w-2xl space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Coffee className="w-4 h-4" />
            <span>Vienna's Best Study Spots</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-foreground leading-[1.1]">
            Find your perfect <br />
            <span className="text-primary italic">focus space.</span>
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
                className="text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed"
              >
                {MOTTOS[currentMotto]}
              </motion.p>
            </AnimatePresence>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button asChild size="lg" className="rounded-full px-8 text-base shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <Link href="/spots">
                <Search className="w-5 h-5 mr-2" />
                Browse Spots
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full px-8 text-base border-2 hover:bg-secondary/50 transition-all duration-300">
              <Link href="/map">
                <Map className="w-5 h-5 mr-2" />
                Explore Map
              </Link>
            </Button>
          </div>

          <div className="pt-8 grid grid-cols-2 md:grid-cols-3 gap-6 border-t border-border/50 mt-8">
            <div>
              <div className="text-3xl font-serif font-bold text-foreground">120+</div>
              <div className="text-sm text-muted-foreground">Curated Spots</div>
            </div>
            <div>
              <div className="text-3xl font-serif font-bold text-foreground">4.8</div>
              <div className="text-sm text-muted-foreground">Average Rating</div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex-1 w-full relative"
        >
          <div className="relative rounded-[2rem] overflow-hidden shadow-2xl shadow-black/10 aspect-[4/5] md:aspect-square max-w-md mx-auto border-8 border-white">
            <img 
              src={heroImg} 
              alt="Cozy study spot in Vienna" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-lg">
              <div className="flex items-center gap-3">
                <div className="bg-primary/20 p-2 rounded-lg text-primary">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-bold text-foreground">Café Sperl</div>
                  <div className="text-sm text-muted-foreground">1060 Wien • Fast WiFi</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Decorative blur blobs */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 blur-3xl rounded-full -z-10" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-accent/20 blur-3xl rounded-full -z-10" />
        </motion.div>

      </main>
    </div>
  );
}

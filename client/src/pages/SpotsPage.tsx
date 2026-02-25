import { useState } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";
import { useSpots } from "@/hooks/use-spots";
import { SpotCard } from "@/components/SpotCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function SpotsPage() {
  const [district, setDistrict] = useState<string>("all");
  
  // Pass active filters to hook
  const { data: spots, isLoading } = useSpots({ 
    status: "approved",
    ...(district !== "all" && { district })
  });

  const districts = ["all", "1010 Wien", "1020 Wien", "1030 Wien", "1040 Wien", "1050 Wien", "1060 Wien", "1070 Wien", "1080 Wien", "1090 Wien"];

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <div className="bg-secondary/30 border-b border-border/50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">Discover Spots</h1>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input 
                placeholder="Search by name or keyword..." 
                className="pl-9 bg-background border-border/50 rounded-xl shadow-sm h-11"
              />
            </div>
            
            <Select value={district} onValueChange={setDistrict}>
              <SelectTrigger className="w-full sm:w-[180px] bg-background border-border/50 rounded-xl h-11">
                <SelectValue placeholder="All Districts" />
              </SelectTrigger>
              <SelectContent>
                {districts.map(d => (
                  <SelectItem key={d} value={d}>{d === "all" ? "All Districts" : d}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" className="h-11 rounded-xl bg-background shadow-sm border-border/50">
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-80 bg-secondary/50 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : spots?.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex bg-secondary p-4 rounded-full mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold font-serif mb-2">No spots found</h3>
            <p className="text-muted-foreground">Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {spots?.map((spot) => (
              <SpotCard key={spot.id} spot={spot} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}

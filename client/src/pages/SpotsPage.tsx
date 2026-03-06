import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, X, Check } from "lucide-react";
import { useSpots } from "@/hooks/use-spots";
import { SpotCard } from "@/components/SpotCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { SEO } from "@/components/SEO";
import { getSpotStats } from "@/lib/reviews-data";

const DAYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

export default function SpotsPage() {
  const [district, setDistrict] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  
  const [tempFilters, setTempFilters] = useState({
    openNow: false,
    openOnSunday: false,
    wifi: false,
    outlets: false,
    district: "all",
    tags: [] as string[]
  });

  const [appliedFilters, setAppliedFilters] = useState(tempFilters);

  useEffect(() => {
    setAppliedFilters(prev => ({ ...prev, district }));
    setTempFilters(prev => ({ ...prev, district }));
  }, [district]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 200);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: rawSpots, isLoading } = useSpots({ 
    status: "approved",
    ...(appliedFilters.district !== "all" && { district: appliedFilters.district }),
    ...(appliedFilters.wifi && { hasWifi: "true" }),
    ...(appliedFilters.outlets && { hasOutlets: "true" })
  });

  const spots = useMemo(() => {
    if (!rawSpots) return [];
    return rawSpots.map(spot => ({
      ...spot,
      ...getSpotStats(spot.id)
    })).sort((a, b) => (b.avgRating || 0) - (a.avgRating || 0));
  }, [rawSpots]);

  const districts = [
    "all", "1. Innere Stadt", "2. Leopoldstadt", "3. Landstraße", "4. Wieden", "5. Margareten",
    "6. Mariahilf", "7. Neubau", "8. Josefstadt", "9. Alsergrund", "10. Favoriten", "11. Simmering",
    "12. Meidling", "13. Hietzing", "14. Penzing", "15. Rudolfsheim-Fünfhaus", "16. Ottakring",
    "17. Hernals", "18. Währing", "19. Döbling", "20. Brigittenau", "21. Floridsdorf", "22. Donaustadt", "23. Liesing"
  ];

  const allTags = useMemo(() => {
    if (!spots) return [];
    const tagsSet = new Set<string>();
    spots.forEach(spot => {
      if (spot.tags && Array.isArray(spot.tags)) {
        spot.tags.forEach(tag => tagsSet.add(String(tag)));
      }
    });
    return Array.from(tagsSet).sort();
  }, [spots]);

  const filteredSpots = useMemo(() => {
    if (!spots) return [];
    
    const viennaNow = new Date(new Date().toLocaleString("en-US", {timeZone: "Europe/Vienna"}));
    const day = DAYS[viennaNow.getDay()];
    const currentTime = viennaNow.getHours() * 60 + viennaNow.getMinutes();

    const normalize = (str: string) => 
      str.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    return spots.filter(spot => {
      if (debouncedSearch) {
        const query = normalize(debouncedSearch);
        const searchableFields = [
          spot.name,
          spot.address,
          spot.district,
          spot.description,
          ...(spot.tags || [])
        ].join(" ");
        if (!normalize(searchableFields).includes(query)) return false;
      }

      if (appliedFilters.tags.length > 0) {
        const spotTags = (spot.tags || []) as string[];
        if (!appliedFilters.tags.every(tag => spotTags.includes(tag))) return false;
      }

      if (appliedFilters.openOnSunday) {
        const hours = spot.openingHours as any;
        if (!hours?.sun || hours.sun.closed) return false;
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
  }, [spots, debouncedSearch, appliedFilters]);

  const handleApplyFilters = () => {
    setAppliedFilters(tempFilters);
    if (tempFilters.district !== district) setDistrict(tempFilters.district);
  };

  const handleClearFilters = () => {
    const defaultFilters = { openNow: false, openOnSunday: false, wifi: false, outlets: false, district: "all", tags: [] };
    setTempFilters(defaultFilters);
    setAppliedFilters(defaultFilters);
    setDistrict("all");
  };

  const toggleTag = (tag: string) => {
    setTempFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags.filter(t => t !== tag) : [...prev.tags, tag]
    }));
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <SEO 
        title="Browse Study Spots" 
        description="Explore the best study spots in Vienna. Filter by district, WiFi, power outlets, and Sunday availability." 
        path="/spots"
      />
      <div className="bg-secondary/30 border-b border-border/50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-sans font-bold text-foreground mb-4">Discover Spots</h1>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input 
                placeholder="Search by name or keyword..." 
                className="pl-9 bg-background border-border/50 rounded-xl shadow-sm h-11"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={district} onValueChange={setDistrict}>
              <SelectTrigger className="w-full sm:w-[180px] bg-background border-border/50 rounded-xl h-11">
                <SelectValue placeholder="All Districts" />
              </SelectTrigger>
              <SelectContent>
                {districts.map(d => <SelectItem key={d} value={d}>{d === "all" ? "All Districts" : d}</SelectItem>)}
              </SelectContent>
            </Select>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="h-11 rounded-xl bg-background shadow-sm border-border/50">
                  <SlidersHorizontal className="w-4 h-4 mr-2" /> More Filters
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-md overflow-y-auto">
                <SheetHeader className="mb-6"><SheetTitle className="text-2xl font-serif">Filters</SheetTitle></SheetHeader>
                <div className="space-y-8 py-4">
                  <div className="space-y-4">
                    <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Availability</h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Checkbox id="openNow" checked={tempFilters.openNow} onCheckedChange={(checked) => setTempFilters(prev => ({ ...prev, openNow: !!checked }))} />
                        <Label htmlFor="openNow" className="text-base font-medium">Open Now</Label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Checkbox id="openSunday" checked={tempFilters.openOnSunday} onCheckedChange={(checked) => setTempFilters(prev => ({ ...prev, openOnSunday: !!checked }))} />
                        <Label htmlFor="openSunday" className="text-base font-medium">Open on Sunday</Label>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Amenities</h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Checkbox id="wifi" checked={tempFilters.wifi} onCheckedChange={(checked) => setTempFilters(prev => ({ ...prev, wifi: !!checked }))} />
                        <Label htmlFor="wifi" className="text-base font-medium">Wi-Fi</Label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Checkbox id="outlets" checked={tempFilters.outlets} onCheckedChange={(checked) => setTempFilters(prev => ({ ...prev, outlets: !!checked }))} />
                        <Label htmlFor="outlets" className="text-base font-medium">Power Outlets</Label>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">District</h3>
                    <Select value={tempFilters.district} onValueChange={(val) => setTempFilters(prev => ({ ...prev, district: val }))}>
                      <SelectTrigger className="w-full bg-background border-border/50 rounded-xl h-11"><SelectValue placeholder="Select District" /></SelectTrigger>
                      <SelectContent>{districts.map(d => <SelectItem key={d} value={d}>{d === "all" ? "All Districts" : d}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {allTags.map(tag => (
                        <Badge 
                          key={tag}
                          variant={tempFilters.tags.includes(tag) ? "default" : "outline"}
                          className={`cursor-pointer py-1.5 px-3 rounded-full transition-all ${tempFilters.tags.includes(tag) ? "bg-primary text-primary-foreground border-primary" : "hover:bg-secondary border-border/50 text-muted-foreground"}`}
                          onClick={() => toggleTag(tag)}
                        >
                          {tag} {tempFilters.tags.includes(tag) && <X className="ml-1.5 w-3 h-3" />}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <SheetFooter className="flex-col sm:flex-col gap-3 pt-8 mt-auto border-t">
                  <Button className="w-full h-12 rounded-xl text-base" onClick={handleApplyFilters}><Check className="mr-2 w-4 h-4" /> Apply Filters</Button>
                  <Button variant="ghost" className="w-full h-11 rounded-xl text-muted-foreground" onClick={handleClearFilters}>Clear all</Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-80 bg-secondary/50 animate-pulse rounded-2xl" />)}</div>
        ) : filteredSpots.length === 0 ? (
          <div className="text-center py-20"><div className="inline-flex bg-secondary p-4 rounded-full mb-4"><Search className="w-8 h-8 text-muted-foreground" /></div><h3 className="text-xl font-bold font-serif mb-2">No spots found</h3><p className="text-muted-foreground">Try adjusting your filters or search terms.</p></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSpots.map((spot) => <SpotCard key={spot.id} spot={spot as any} />)}
          </div>
        )}
      </div>
    </div>
  );
}

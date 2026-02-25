import { useAuth } from "@/hooks/use-auth";
import { useSavedSpots, useCheckIns } from "@/hooks/use-user-activity";
import { SpotCard } from "@/components/SpotCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Heart, CheckCircle2 } from "lucide-react";

export default function Profile() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { data: savedSpots } = useSavedSpots();
  const { data: checkIns } = useCheckIns();

  if (isLoading) return <div className="min-h-screen bg-background" />;
  if (!isAuthenticated) {
    window.location.href = "/api/login";
    return null;
  }

  const favorites = savedSpots?.filter(s => s.listType === "favorite").map(s => s.spot) || [];
  const toCheckLater = savedSpots?.filter(s => s.listType === "check_later").map(s => s.spot) || [];
  
  // Get unique spots from check-ins
  const checkedInSpots = Array.from(new Map(checkIns?.map(c => [c.spot.id, c.spot])).values());

  return (
    <div className="min-h-screen bg-background pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6 mb-12 bg-card p-8 rounded-3xl shadow-sm border border-border/50">
          <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center text-4xl font-serif text-primary">
            {user?.firstName?.[0] || user?.email?.[0] || 'U'}
          </div>
          <div>
            <h1 className="text-3xl font-serif font-bold text-foreground mb-1">{user?.firstName || 'Student'}</h1>
            <p className="text-muted-foreground">{user?.email}</p>
          </div>
        </div>

        <Tabs defaultValue="favorites" className="w-full">
          <TabsList className="w-full justify-start h-auto p-1 bg-secondary/50 rounded-2xl mb-8 overflow-x-auto">
            <TabsTrigger value="favorites" className="rounded-xl px-6 py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <Heart className="w-4 h-4 mr-2" /> Favorites ({favorites.length})
            </TabsTrigger>
            <TabsTrigger value="checklater" className="rounded-xl px-6 py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <MapPin className="w-4 h-4 mr-2" /> Want to Go ({toCheckLater.length})
            </TabsTrigger>
            <TabsTrigger value="checkins" className="rounded-xl px-6 py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <CheckCircle2 className="w-4 h-4 mr-2" /> Checked In ({checkedInSpots.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="favorites" className="mt-0">
            {favorites.length === 0 ? (
              <EmptyState message="No favorite spots yet." />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.map(spot => <SpotCard key={spot.id} spot={spot} />)}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="checklater" className="mt-0">
            {toCheckLater.length === 0 ? (
              <EmptyState message="No saved spots yet." />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {toCheckLater.map(spot => <SpotCard key={spot.id} spot={spot} />)}
              </div>
            )}
          </TabsContent>

          <TabsContent value="checkins" className="mt-0">
            {checkedInSpots.length === 0 ? (
              <EmptyState message="You haven't checked into any spots." />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {checkedInSpots.map((spot: any) => <SpotCard key={spot.id} spot={spot} />)}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-20 bg-secondary/20 rounded-3xl border border-dashed border-border/50">
      <p className="text-muted-foreground text-lg">{message}</p>
    </div>
  );
}

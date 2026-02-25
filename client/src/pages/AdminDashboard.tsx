import { useSpots, useUpdateSpotStatus } from "@/hooks/use-spots";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminDashboard() {
  const { isAuthenticated, isLoading } = useAuth();
  const { data: pendingSpots, isLoading: spotsLoading } = useSpots({ status: "pending" });
  const updateMutation = useUpdateSpotStatus();
  const { toast } = useToast();

  if (isLoading || spotsLoading) return <div className="min-h-screen bg-background" />;
  if (!isAuthenticated) {
    window.location.href = "/api/login";
    return null;
  }

  const handleAction = (id: number, status: "approved" | "rejected") => {
    updateMutation.mutate({ id, status }, {
      onSuccess: () => toast({ title: `Spot ${status}` })
    });
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <h1 className="text-3xl font-serif font-bold text-foreground mb-8">Admin Dashboard - Pending Spots</h1>
        
        {pendingSpots?.length === 0 ? (
          <div className="bg-card p-12 rounded-3xl text-center border border-border/50 shadow-sm">
            <h3 className="text-xl font-bold text-muted-foreground">No pending spots</h3>
            <p className="mt-2 text-sm text-muted-foreground">All caught up!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingSpots?.map((spot) => (
              <div key={spot.id} className="bg-card p-6 rounded-2xl flex flex-col md:flex-row gap-6 border border-border/50 shadow-sm">
                <div className="flex-1">
                  <h3 className="font-bold text-xl mb-1">{spot.name}</h3>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
                    <MapPin className="w-4 h-4" />
                    {spot.address}, {spot.district}
                  </div>
                  <p className="text-sm bg-secondary/50 p-3 rounded-lg">{spot.description}</p>
                  
                  <div className="flex gap-2 mt-3 text-xs font-medium">
                    {spot.hasWifi && <span className="bg-primary/10 text-primary px-2 py-1 rounded">WiFi</span>}
                    {spot.hasOutlets && <span className="bg-primary/10 text-primary px-2 py-1 rounded">Outlets</span>}
                    {spot.sundayOpen && <span className="bg-primary/10 text-primary px-2 py-1 rounded">Sunday</span>}
                  </div>
                </div>
                
                <div className="flex flex-row md:flex-col gap-2 justify-center md:border-l border-border/50 md:pl-6">
                  <Button 
                    className="bg-accent hover:bg-accent/90 flex-1 md:flex-none rounded-xl"
                    onClick={() => handleAction(spot.id, "approved")}
                    disabled={updateMutation.isPending}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" /> Approve
                  </Button>
                  <Button 
                    variant="destructive"
                    className="flex-1 md:flex-none rounded-xl"
                    onClick={() => handleAction(spot.id, "rejected")}
                    disabled={updateMutation.isPending}
                  >
                    <XCircle className="w-4 h-4 mr-2" /> Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

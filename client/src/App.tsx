import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navigation } from "@/components/Navigation";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Footer } from "@/components/Footer";
import NotFound from "@/pages/not-found";
import { HelmetProvider } from "react-helmet-async";

import Home from "@/pages/Home";
import MapPage from "@/pages/MapPage";
import SpotsPage from "@/pages/SpotsPage";
import SpotDetail from "@/pages/SpotDetail";
import Profile from "@/pages/Profile";
import SubmitSpot from "@/pages/SubmitSpot";
import AdminDashboard from "@/pages/AdminDashboard";
import About from "@/pages/About";
import Signup from "@/pages/Signup";
import Signin from "@/pages/Signin";
import Privacy from "@/pages/Privacy";
import Legal from "@/pages/Legal";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/map" component={MapPage} />
      <Route path="/spots" component={SpotsPage} />
      <Route path="/spots/:id" component={SpotDetail} />
      <Route path="/profile" component={Profile} />
      <Route path="/submit" component={SubmitSpot} />
      <Route path="/admin/pending" component={AdminDashboard} />
      <Route path="/about" component={About} />
      <Route path="/signup" component={Signup} />
      <Route path="/signin" component={Signin} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/legal" component={Legal} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <TooltipProvider>
          <div className="min-h-screen bg-background font-sans text-foreground flex flex-col">
            <AnnouncementBar />
            <Navigation />
            <div className="flex-1">
              <Router />
            </div>
            <Footer />
          </div>
          <Toaster />
        </TooltipProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
}

export default App;

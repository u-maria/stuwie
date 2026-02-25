import type { Express } from "express";
import { type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth, isAuthenticated, authStorage } from "./replit_integrations/auth";
import { registerAuthRoutes } from "./replit_integrations/auth/routes";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Set up auth first
  await setupAuth(app);
  registerAuthRoutes(app);

  // Seed DB Function
  async function seedDatabase() {
    try {
      const spots = await storage.getStudySpots();
      if (spots.length === 0) {
        const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
        const adminUser = await authStorage.upsertUser({
          id: "admin-id-123",
          email: adminEmail,
          firstName: "Admin",
          lastName: "User",
          profileImageUrl: null
        });

        const spot1 = await storage.createStudySpot({
          name: "Café Central",
          district: "1010",
          address: "Herrengasse 14, 1010 Wien",
          lat: 48.2104,
          lng: 16.3654,
          openingHours: { monday: { open: "08:00", close: "20:00" }, sunday: { open: "10:00", close: "18:00" } },
          sundayOpen: true,
          hasWifi: true,
          hasOutlets: true,
          website: "https://cafecentral.wien",
          description: "Historic café in the heart of Vienna. Very beautiful but can be busy. Good for reading.",
          tags: ["historic", "coffee"],
          createdByUserId: adminUser.id,
        });
        await storage.updateStudySpotStatus(spot1.id, "approved");
        await storage.addSpotImages([{ spotId: spot1.id, url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1000&auto=format&fit=crop", sortOrder: 0 }]);

        const spot2 = await storage.createStudySpot({
          name: "Study Hub 1090",
          district: "1090",
          address: "Alserstraße 23, 1090 Wien",
          lat: 48.2163,
          lng: 16.3486,
          openingHours: { monday: { open: "09:00", close: "22:00" } },
          sundayOpen: false,
          hasWifi: true,
          hasOutlets: true,
          website: null,
          description: "Quiet and modern study space for students.",
          tags: ["quiet", "spacious"],
          createdByUserId: adminUser.id,
        });
        await storage.updateStudySpotStatus(spot2.id, "approved");
        await storage.addSpotImages([{ spotId: spot2.id, url: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000&auto=format&fit=crop", sortOrder: 0 }]);
      }
    } catch (e) {
      console.error("Error seeding DB", e);
    }
  }

  // API Routes
  app.get(api.spots.list.path, async (req, res) => {
    try {
      const allSpots = await storage.getStudySpots();
      
      const statusFilter = req.query.status as string;
      const districtFilter = req.query.district as string;
      const openOnSundays = req.query.openOnSundays as string;
      const hasWifi = req.query.hasWifi as string;
      const hasOutlets = req.query.hasOutlets as string;

      const filtered = allSpots.filter(s => {
        if (statusFilter && s.status !== statusFilter) return false;
        if (!statusFilter && s.status !== "approved") return false; // Default to approved
        if (districtFilter && s.district !== districtFilter) return false;
        if (openOnSundays === "true" && !s.sundayOpen) return false;
        if (hasWifi === "true" && !s.hasWifi) return false;
        if (hasOutlets === "true" && !s.hasOutlets) return false;
        return true;
      });

      // Populate images and creator
      const result = await Promise.all(filtered.map(async s => {
        const images = await storage.getSpotImages(s.id);
        const creator = s.createdByUserId ? await authStorage.getUser(s.createdByUserId) : null;
        return { ...s, images, creator };
      }));

      res.json(result);
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "Internal Error" });
    }
  });

  app.get(api.spots.get.path, async (req, res) => {
    const spot = await storage.getStudySpot(Number(req.params.id));
    if (!spot) return res.status(404).json({ message: "Not found" });
    const images = await storage.getSpotImages(spot.id);
    const creator = spot.createdByUserId ? await authStorage.getUser(spot.createdByUserId) : null;
    res.json({ ...spot, images, creator });
  });

  app.post(api.spots.create.path, isAuthenticated, async (req: any, res) => {
    try {
      const body = api.spots.create.input.parse(req.body);
      const userId = req.user.claims.sub;
      const spot = await storage.createStudySpot({ ...body, createdByUserId: userId });
      if (body.images && body.images.length > 0) {
        await storage.addSpotImages(body.images.map((url, i) => ({ spotId: spot.id, url, sortOrder: i })));
      }
      res.status(201).json(spot);
    } catch (e) {
      if (e instanceof z.ZodError) return res.status(400).json({ message: e.errors[0].message });
      res.status(500).json({ message: "Internal Error" });
    }
  });

  app.patch(api.spots.updateStatus.path, isAuthenticated, async (req: any, res) => {
    try {
      const body = api.spots.updateStatus.input.parse(req.body);
      const user = await authStorage.getUser(req.user.claims.sub);
      const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
      if (user?.email !== adminEmail) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const spot = await storage.updateStudySpotStatus(Number(req.params.id), body.status);
      res.json(spot);
    } catch (e) {
      if (e instanceof z.ZodError) return res.status(400).json({ message: e.errors[0].message });
      res.status(500).json({ message: "Internal Error" });
    }
  });

  app.get(api.reviews.list.path, async (req, res) => {
    const reviews = await storage.getReviewsBySpot(Number(req.params.id));
    const result = await Promise.all(reviews.map(async r => {
      const user = await authStorage.getUser(r.userId);
      return { ...r, user };
    }));
    res.json(result);
  });

  app.post(api.reviews.create.path, isAuthenticated, async (req: any, res) => {
    try {
      const body = api.reviews.create.input.parse(req.body);
      const spotId = Number(req.params.id);
      const userId = req.user.claims.sub;
      
      const spot = await storage.getStudySpot(spotId);
      if (!spot) return res.status(404).json({ message: "Spot not found" });

      const review = await storage.createReview({ ...body, spotId, userId });
      res.status(201).json(review);
    } catch (e) {
      if (e instanceof z.ZodError) return res.status(400).json({ message: e.errors[0].message });
      res.status(500).json({ message: "Internal Error" });
    }
  });

  app.delete(api.reviews.delete.path, isAuthenticated, async (req: any, res) => {
    const success = await storage.deleteReview(Number(req.params.id), req.user.claims.sub);
    if (!success) return res.status(404).json({ message: "Review not found or not owned by user" });
    res.status(204).send();
  });

  app.get(api.savedSpots.list.path, isAuthenticated, async (req: any, res) => {
    const saved = await storage.getUserSavedSpots(req.user.claims.sub);
    const result = await Promise.all(saved.map(async s => {
      const spot = await storage.getStudySpot(s.spotId);
      if (!spot) return null;
      const images = await storage.getSpotImages(s.spotId);
      return { ...s, spot: { ...spot, images } };
    }));
    res.json(result.filter(Boolean));
  });

  app.post(api.savedSpots.toggle.path, isAuthenticated, async (req: any, res) => {
    try {
      const body = api.savedSpots.toggle.input.parse(req.body);
      const action = await storage.toggleSavedSpot(req.user.claims.sub, body.spotId, body.listType);
      res.json({ action });
    } catch (e) {
      if (e instanceof z.ZodError) return res.status(400).json({ message: e.errors[0].message });
      res.status(500).json({ message: "Internal Error" });
    }
  });

  app.get(api.checkIns.list.path, isAuthenticated, async (req: any, res) => {
    const checkIns = await storage.getUserCheckIns(req.user.claims.sub);
    const result = await Promise.all(checkIns.map(async c => {
      const spot = await storage.getStudySpot(c.spotId);
      if (!spot) return null;
      const images = await storage.getSpotImages(c.spotId);
      return { ...c, spot: { ...spot, images } };
    }));
    res.json(result.filter(Boolean));
  });

  app.post(api.checkIns.create.path, isAuthenticated, async (req: any, res) => {
    const spotId = Number(req.params.id);
    const spot = await storage.getStudySpot(spotId);
    if (!spot) return res.status(404).json({ message: "Not found" });
    const checkIn = await storage.createCheckIn({ spotId, userId: req.user.claims.sub });
    res.status(201).json(checkIn);
  });

  // Call seed database
  seedDatabase().catch(console.error);

  return httpServer;
}
import type { Express } from "express";
import { type Server } from "http";
import { storage } from "./storage";
import { db } from "./db";
import { 
  studySpots, spotImages, reviews, savedSpots, checkIns,
  type StudySpot, type SpotImage, type Review, type SavedSpot, type CheckIn,
  type InsertStudySpot, type InsertSpotImage, type InsertReview, type InsertSavedSpot, type InsertCheckIn
} from "@shared/schema";
import { eq, and, desc } from "drizzle-orm";
import { setupAuth, isAuthenticated, authStorage } from "./replit_integrations/auth";
import { registerAuthRoutes } from "./replit_integrations/auth/routes";
import { api } from "@shared/routes";
import { z } from "zod";

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
      // Only seed if empty OR if we need to clean up old fake spots
      const hasFakeSpots = spots.some(s => s.name === "Café Central" || s.name === "Study Hub 1090");
      
      if (spots.length === 0 || hasFakeSpots) {
        const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
        const adminUser = await authStorage.upsertUser({
          id: "admin-id-123",
          email: adminEmail,
          firstName: "Admin",
          lastName: "User",
          profileImageUrl: null
        });

        // Wipe old seeds (A)
        for (const s of spots) {
          if (s.name === "Café Central" || s.name === "Study Hub 1090") {
            await db.delete(spotImages).where(eq(spotImages.spotId, s.id));
            await db.delete(reviews).where(eq(reviews.spotId, s.id));
            await db.delete(savedSpots).where(eq(savedSpots.spotId, s.id));
            await db.delete(checkIns).where(eq(checkIns.spotId, s.id));
            await db.delete(studySpots).where(eq(studySpots.id, s.id));
          }
        }

        // Real Study Spots (C)
        const realSpots = [
          {
            name: "das café",
            district: "7. Neubau",
            address: "Burggasse 10, 1070 Wien",
            lat: 48.2038,
            lng: 16.3558,
            website: "https://www.das-cafe.wien",
            photo_url: "https://www.das-cafe.wien/fileadmin/user_upload/dascafe/_MAR9685_Kopie.jpg",
            openingHours: {
              mon: { open: "09:00", close: "24:00" },
              tue: { open: "09:00", close: "24:00" },
              wed: { open: "09:00", close: "24:00" },
              thu: { open: "09:00", close: "01:00" },
              fri: { open: "09:00", close: "01:00" },
              sat: { open: "10:00", close: "01:00" },
              sun: { open: "10:00", close: "23:00" }
            },
            tags: ["spacious", "bright", "big-tables", "sunday-safe", "work-friendly"],
            description: "Bright, spacious café with lots of table space for working/studying. Solid option in the 7th district when you want a reliable longer session."
          },
          {
            name: "Jonas Reindl (Währinger Straße)",
            district: "9. Alsergrund",
            address: "Währinger Straße 2–4, 1090 Wien",
            lat: 48.2149,
            lng: 16.3608,
            website: "https://www.jonasreindl.at",
            photo_url: "https://cdn.prod.website-files.com/64b6780f84d27e4bfd91f2d6/6676cfbec142b79bf6bf0b67_jonasreindlalsergrundvienna-6676bd5815d50.webp",
            openingHours: {
              mon: { open: "08:00", close: "17:30" },
              tue: { open: "08:00", close: "17:30" },
              wed: { open: "08:00", close: "17:30" },
              thu: { open: "08:00", close: "17:30" },
              fri: { open: "08:00", close: "17:30" },
              sat: { open: "09:30", close: "17:30" },
              sun: { open: "09:30", close: "17:30" }
            },
            tags: ["near-uni", "specialty-coffee", "busy", "sunday-safe", "laptop-friendly"],
            description: "A student classic near the university area. Great coffee and lots of laptop users. Can get busy, so it’s best earlier or outside peak hours."
          },
          {
            name: "J. Hornig Kaffeebar",
            district: "7. Neubau",
            address: "Siebensterngasse 29, 1070 Wien",
            lat: 48.2018,
            lng: 16.3538,
            website: "https://jhornig.com",
            photo_url: "https://www.area.at/assets/images/c/hornig-7-5s04bvq6f8epjv3.jpg",
            openingHours: {
              mon: { open: "08:00", close: "19:00" },
              tue: { open: "08:00", close: "19:00" },
              wed: { open: "08:00", close: "19:00" },
              thu: { open: "08:00", close: "19:00" },
              fri: { open: "08:00", close: "19:00" },
              sat: { open: "09:00", close: "19:00" },
              sun: { open: "10:00", close: "18:00" }
            },
            tags: ["sunday-safe", "central-1070", "good-for-2-4h", "work-friendly"],
            description: "Reliable café for getting work done in the 7th. Good default option: coffee + table + steady hours (including Sundays)."
          },
          {
            name: "Burggasse24 Café",
            district: "7. Neubau",
            address: "Burggasse 24/8, 1070 Wien",
            lat: 48.2045,
            lng: 16.3532,
            website: "https://www.burggasse24.com",
            photo_url: "https://lokalfuehrer.stadtbekannt.at/wp-content/uploads/2016/04/Burggasse24-c-STADTBEKANNT.jpg",
            openingHours: {
              mon: { open: "10:00", close: "22:00" },
              tue: { open: "10:00", close: "22:00" },
              wed: { open: "10:00", close: "22:00" },
              thu: { open: "10:00", close: "22:00" },
              fri: { open: "10:00", close: "22:00" },
              sat: { open: "10:00", close: "22:00" },
              sun: { open: "10:00", close: "22:00" }
            },
            tags: ["cozy", "can-be-packed", "short-session", "best-off-peak"],
            description: "Not consistently laptop-friendly. Best if it’s not packed, ideally a couple hours before closing, and you’re doing a shorter session."
          },
          {
            name: "7stern Café",
            district: "7. Neubau",
            address: "Siebensterngasse 31, 1070 Wien",
            lat: 48.2017,
            lng: 16.3535,
            website: "https://www.7stern.net",
            photo_url: "https://www.vienna.at/2015/11/siebenstern-6001.jpg",
            openingHours: {
              mon: { closed: true },
              tue: { open: "10:00", close: "23:00" },
              wed: { open: "10:00", close: "23:00" },
              thu: { open: "10:00", close: "23:00" },
              fri: { open: "10:00", close: "23:00" },
              sat: { open: "10:00", close: "23:00" },
              sun: { open: "10:00", close: "18:00" }
            },
            tags: ["late-hours", "afternoon-best", "classic-1070", "sunday-safe"],
            description: "Classic café option in the 7th with long hours Tue–Sat (until 23:00). Great for afternoon/evening sessions."
          }
        ];

        // Wipe old seeds if they exist to avoid duplication/confusion
        if (hasFakeSpots) {
           // We can't easily TRUNCATE without direct SQL, but we can delete from storage if we add the method.
           // For now, let's just create the new ones and we'll manually filter if needed or just assume fresh start if spots.length matches seed count.
        }

        for (const s of realSpots) {
          const existing = spots.find(spot => spot.name === s.name);
          if (!existing) {
            const newSpot = await storage.createStudySpot({
              name: s.name,
              district: s.district,
              address: s.address,
              lat: s.lat,
              lng: s.lng,
              openingHours: s.openingHours,
              sundayOpen: true,
              hasWifi: true,
              hasOutlets: true,
              website: s.website,
              description: s.description,
              tags: s.tags,
              createdByUserId: adminUser.id,
            });
            await storage.updateStudySpotStatus(newSpot.id, "approved");
            await storage.addSpotImages([{ spotId: newSpot.id, url: s.photo_url, sortOrder: 0 }]);
          }
        }
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
import type { Express, Request, Response } from "express";
import { type Server } from "http";
import { storage } from "./storage";
import { db } from "./db";
import { studySpots, spotImages, reviews, savedSpots, checkIns } from "@shared/schema";
import { eq } from "drizzle-orm";
import { api } from "@shared/routes";
import { getFallbackSpot, getFallbackSpots } from "./fallback-spots";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  const disabledAccountFeature = (_req: Request, res: Response) => {
    res.status(410).json({ message: "Authentication and account features are disabled in this public prototype." });
  };

  ["/api/auth/user", "/api/login", "/api/callback", "/api/logout"].forEach((path) => {
    app.all(path, disabledAccountFeature);
  });

  // Seed DB Function
  async function seedDatabase() {
    try {
      const spots = await storage.getStudySpots();
      // Only seed if empty OR if we need to clean up old fake spots
      const hasFakeSpots = spots.some(s => s.name === "Café Central" || s.name === "Study Hub 1090");
      
      if (spots.length === 0 || hasFakeSpots) {
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
            googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=das%20caf%C3%A9%20Burggasse%2010%201070%20Wien",
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
            googleMapsUrl: "https://maps.app.goo.gl/NA4om2VM7UujvV6S8",
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
            googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=J.%20Hornig%20Kaffeebar%20Siebensterngasse%2029%201070%20Wien",
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
            address: "Burggasse 24, 1070 Wien",
            lat: 48.2045,
            lng: 16.3532,
            website: "https://www.burggasse24.com",
            googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Burggasse24%20Caf%C3%A9%20Burggasse%2024%201070%20Wien",
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
            googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Caf%C3%A9%207stern%20Siebensterngasse%2031%201070%20Wien",
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

        for (const s of realSpots) {
          const existing = spots.find(spot => spot.name === s.name);
          if (existing) {
            // Update existing to ensure hours and maps URL are set
            await storage.updateStudySpot(existing.id, {
              openingHours: s.openingHours,
              googleMapsUrl: s.googleMapsUrl,
              address: s.address,
              tags: s.tags,
            });
          } else {
            const newSpot = await storage.createStudySpot({
              name: s.name,
              district: s.district,
              address: s.address,
              lat: s.lat,
              lng: s.lng,
              openingHours: s.openingHours,
              googleMapsUrl: s.googleMapsUrl,
              sundayOpen: true,
              hasWifi: true,
              hasOutlets: true,
              website: s.website,
              description: s.description,
              tags: s.tags,
              createdByUserId: null,
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
    if (req.query.status && req.query.status !== "approved") {
      return res.json([]);
    }

    try {
      const allSpots = await storage.getStudySpots();
      
      const districtFilter = req.query.district as string;
      const openOnSundays = req.query.openOnSundays as string;
      const hasWifi = req.query.hasWifi as string;
      const hasOutlets = req.query.hasOutlets as string;

      const filtered = allSpots.filter(s => {
        if (s.status !== "approved") return false;
        if (districtFilter && s.district !== districtFilter) return false;
        if (openOnSundays === "true" && !s.sundayOpen) return false;
        if (hasWifi === "true" && !s.hasWifi) return false;
        if (hasOutlets === "true" && !s.hasOutlets) return false;
        return true;
      });

      // Populate images for public spot cards.
      const result = await Promise.all(filtered.map(async s => {
        const { createdByUserId: _createdByUserId, ...publicSpot } = s;
        const images = await storage.getSpotImages(s.id);
        return { ...publicSpot, images };
      }));

      res.json(result);
    } catch (e) {
      console.error("Study spots database unavailable; serving curated fallback spots.", e);
      res.json(getFallbackSpots({
        status: req.query.status as string,
        district: req.query.district as string,
        hasWifi: req.query.hasWifi as string,
        hasOutlets: req.query.hasOutlets as string,
      }));
    }
  });

  app.get(api.spots.get.path, async (req, res) => {
    try {
      const spot = await storage.getStudySpot(Number(req.params.id));
      if (!spot) return res.status(404).json({ message: "Not found" });
      const { createdByUserId: _createdByUserId, ...publicSpot } = spot;
      const images = await storage.getSpotImages(spot.id);
      res.json({ ...publicSpot, images });
    } catch (e) {
      console.error("Study spot database unavailable; serving curated fallback spot.", e);
      const spot = getFallbackSpot(Number(req.params.id));
      if (!spot) return res.status(404).json({ message: "Not found" });
      res.json(spot);
    }
  });

  app.post("/api/spots", disabledAccountFeature);
  app.patch("/api/spots/:id/status", disabledAccountFeature);

  app.get(api.reviews.list.path, async (req, res) => {
    const spotReviews = await storage.getReviewsBySpot(Number(req.params.id));
    res.json(spotReviews.map(({ userId: _userId, ...review }) => ({ ...review, user: null })));
  });

  app.post("/api/spots/:id/reviews", disabledAccountFeature);
  app.delete("/api/reviews/:id", disabledAccountFeature);
  app.get("/api/user/saved-spots", disabledAccountFeature);
  app.post("/api/user/saved-spots/toggle", disabledAccountFeature);
  app.get("/api/user/check-ins", disabledAccountFeature);
  app.post("/api/spots/:id/check-in", disabledAccountFeature);

  // Call seed database
  seedDatabase().catch(console.error);

  return httpServer;
}
import { pgTable, text, serial, integer, boolean, timestamp, jsonb, doublePrecision, numeric } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./models/auth";

export * from "./models/auth";

export const studySpots = pgTable("study_spots", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  district: text("district").notNull(),
  address: text("address").notNull(),
  lat: doublePrecision("lat"),
  lng: doublePrecision("lng"),
  openingHours: jsonb("opening_hours"), // { monday: { open: "08:00", close: "20:00", closed: false }, ... }
  sundayOpen: boolean("sunday_open").default(false),
  googleMapsUrl: text("google_maps_url"),
  hasWifi: boolean("has_wifi").default(false),
  hasOutlets: boolean("has_outlets").default(false),
  website: text("website"),
  description: text("description").notNull(),
  tags: jsonb("tags"), // array of strings
  avgRating: numeric("avg_rating").default("0"),
  reviewCount: integer("review_count").default(0),
  createdByUserId: text("created_by_user_id"), // references users.id
  status: text("status").default("pending"), // pending, approved, rejected
  isFeatured: boolean("is_featured").default(false),
  isSponsored: boolean("is_sponsored").default(false),
  rankingWeight: integer("ranking_weight").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const spotImages = pgTable("spot_images", {
  id: serial("id").primaryKey(),
  spotId: integer("spot_id").notNull(), // references studySpots.id
  url: text("url").notNull(),
  sortOrder: integer("sort_order").default(0),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(), // references users.id
  spotId: integer("spot_id").notNull(), // references studySpots.id
  rating: integer("rating").notNull(), // 0-5
  text: text("text"),
  tags: jsonb("tags"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const savedSpots = pgTable("saved_spots", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  spotId: integer("spot_id").notNull(),
  listType: text("list_type").notNull(), // "favorite" or "check_later"
  createdAt: timestamp("created_at").defaultNow(),
});

export const checkIns = pgTable("check_ins", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  spotId: integer("spot_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const studySpotsRelations = relations(studySpots, ({ many, one }) => ({
  images: many(spotImages),
  reviews: many(reviews),
  creator: one(users, { fields: [studySpots.createdByUserId], references: [users.id] }),
}));

export const spotImagesRelations = relations(spotImages, ({ one }) => ({
  spot: one(studySpots, { fields: [spotImages.spotId], references: [studySpots.id] }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  spot: one(studySpots, { fields: [reviews.spotId], references: [studySpots.id] }),
  user: one(users, { fields: [reviews.userId], references: [users.id] }),
}));

export const savedSpotsRelations = relations(savedSpots, ({ one }) => ({
  spot: one(studySpots, { fields: [savedSpots.spotId], references: [studySpots.id] }),
  user: one(users, { fields: [savedSpots.userId], references: [users.id] }),
}));

export const checkInsRelations = relations(checkIns, ({ one }) => ({
  spot: one(studySpots, { fields: [checkIns.spotId], references: [studySpots.id] }),
  user: one(users, { fields: [checkIns.userId], references: [users.id] }),
}));

// Base Schemas
export const insertStudySpotSchema = createInsertSchema(studySpots).omit({ 
  id: true, 
  createdAt: true, 
  avgRating: true, 
  reviewCount: true, 
  status: true,
  isFeatured: true,
  isSponsored: true,
  rankingWeight: true
});

export const insertSpotImageSchema = createInsertSchema(spotImages).omit({ id: true });
export const insertReviewSchema = createInsertSchema(reviews).omit({ id: true, createdAt: true, updatedAt: true, userId: true });
export const insertSavedSpotSchema = createInsertSchema(savedSpots).omit({ id: true, createdAt: true, userId: true });
export const insertCheckInSchema = createInsertSchema(checkIns).omit({ id: true, createdAt: true, userId: true });

// Types
export type StudySpot = typeof studySpots.$inferSelect;
export type SpotImage = typeof spotImages.$inferSelect;
export type Review = typeof reviews.$inferSelect;
export type SavedSpot = typeof savedSpots.$inferSelect;
export type CheckIn = typeof checkIns.$inferSelect;

export type InsertStudySpot = z.infer<typeof insertStudySpotSchema>;
export type InsertSpotImage = z.infer<typeof insertSpotImageSchema>;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type InsertSavedSpot = z.infer<typeof insertSavedSpotSchema>;
export type InsertCheckIn = z.infer<typeof insertCheckInSchema>;

// API Contract Types
export type CreateStudySpotRequest = InsertStudySpot & { images?: string[] };
export type UpdateStudySpotStatusRequest = { status: "pending" | "approved" | "rejected" };

export type StudySpotResponse = StudySpot & { 
  images: SpotImage[],
  creator?: {
    id: string;
    email: string | null;
    firstName: string | null;
    lastName: string | null;
    profileImageUrl: string | null;
  }
};

export type SpotsListResponse = StudySpotResponse[];
export type ReviewResponse = Review & { 
  user: { 
    id: string; 
    email: string | null; 
    firstName: string | null; 
    lastName: string | null; 
    profileImageUrl: string | null;
  } 
};
export type SavedSpotResponse = SavedSpot & { spot: StudySpotResponse };
export type CheckInResponse = CheckIn & { spot: StudySpotResponse };

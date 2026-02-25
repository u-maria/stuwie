import { db } from "./db";
import { 
  studySpots, spotImages, reviews, savedSpots, checkIns,
  type StudySpot, type SpotImage, type Review, type SavedSpot, type CheckIn,
  type InsertStudySpot, type InsertSpotImage, type InsertReview, type InsertSavedSpot, type InsertCheckIn
} from "@shared/schema";
import { eq, and, desc } from "drizzle-orm";

export interface IStorage {
  // Study Spots
  getStudySpots(): Promise<StudySpot[]>;
  getStudySpot(id: number): Promise<StudySpot | undefined>;
  createStudySpot(spot: InsertStudySpot): Promise<StudySpot>;
  updateStudySpotStatus(id: number, status: string): Promise<StudySpot>;
  
  // Spot Images
  getSpotImages(spotId: number): Promise<SpotImage[]>;
  addSpotImages(images: InsertSpotImage[]): Promise<SpotImage[]>;

  // Reviews
  getReviewsBySpot(spotId: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  deleteReview(id: number, userId: string): Promise<boolean>;

  // Saved Spots
  getUserSavedSpots(userId: string): Promise<SavedSpot[]>;
  toggleSavedSpot(userId: string, spotId: number, listType: string): Promise<"added" | "removed">;

  // Check-ins
  getUserCheckIns(userId: string): Promise<CheckIn[]>;
  createCheckIn(checkIn: InsertCheckIn): Promise<CheckIn>;
}

export class DatabaseStorage implements IStorage {
  async getStudySpots(): Promise<StudySpot[]> {
    return await db.select().from(studySpots);
  }

  async getStudySpot(id: number): Promise<StudySpot | undefined> {
    const [spot] = await db.select().from(studySpots).where(eq(studySpots.id, id));
    return spot;
  }

  async createStudySpot(spot: InsertStudySpot): Promise<StudySpot> {
    const [newSpot] = await db.insert(studySpots).values(spot).returning();
    return newSpot;
  }

  async updateStudySpotStatus(id: number, status: string): Promise<StudySpot> {
    const [updatedSpot] = await db.update(studySpots)
      .set({ status })
      .where(eq(studySpots.id, id))
      .returning();
    return updatedSpot;
  }

  async getSpotImages(spotId: number): Promise<SpotImage[]> {
    return await db.select().from(spotImages).where(eq(spotImages.spotId, spotId));
  }

  async addSpotImages(images: InsertSpotImage[]): Promise<SpotImage[]> {
    if (images.length === 0) return [];
    return await db.insert(spotImages).values(images).returning();
  }

  async getReviewsBySpot(spotId: number): Promise<Review[]> {
    return await db.select().from(reviews).where(eq(reviews.spotId, spotId)).orderBy(desc(reviews.createdAt));
  }

  async createReview(review: InsertReview): Promise<Review> {
    const [newReview] = await db.insert(reviews).values(review).returning();
    
    // Update spot's average rating and count
    const allReviews = await this.getReviewsBySpot(review.spotId);
    const avg = allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length;
    await db.update(studySpots)
      .set({ 
        avgRating: avg.toFixed(1),
        reviewCount: allReviews.length
      })
      .where(eq(studySpots.id, review.spotId));

    return newReview;
  }

  async deleteReview(id: number, userId: string): Promise<boolean> {
    const [review] = await db.select().from(reviews).where(and(eq(reviews.id, id), eq(reviews.userId, userId)));
    if (!review) return false;

    await db.delete(reviews).where(eq(reviews.id, id));

    // Update spot's average rating and count
    const allReviews = await this.getReviewsBySpot(review.spotId);
    const avg = allReviews.length > 0 ? allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length : 0;
    await db.update(studySpots)
      .set({ 
        avgRating: avg.toFixed(1),
        reviewCount: allReviews.length
      })
      .where(eq(studySpots.id, review.spotId));

    return true;
  }

  async getUserSavedSpots(userId: string): Promise<SavedSpot[]> {
    return await db.select().from(savedSpots).where(eq(savedSpots.userId, userId)).orderBy(desc(savedSpots.createdAt));
  }

  async toggleSavedSpot(userId: string, spotId: number, listType: string): Promise<"added" | "removed"> {
    const [existing] = await db.select().from(savedSpots)
      .where(and(
        eq(savedSpots.userId, userId),
        eq(savedSpots.spotId, spotId),
        eq(savedSpots.listType, listType)
      ));

    if (existing) {
      await db.delete(savedSpots).where(eq(savedSpots.id, existing.id));
      return "removed";
    } else {
      await db.insert(savedSpots).values({ userId, spotId, listType });
      return "added";
    }
  }

  async getUserCheckIns(userId: string): Promise<CheckIn[]> {
    return await db.select().from(checkIns).where(eq(checkIns.userId, userId)).orderBy(desc(checkIns.createdAt));
  }

  async createCheckIn(checkIn: InsertCheckIn): Promise<CheckIn> {
    const [newCheckIn] = await db.insert(checkIns).values(checkIn).returning();
    return newCheckIn;
  }
}

export const storage = new DatabaseStorage();
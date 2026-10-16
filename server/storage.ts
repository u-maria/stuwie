import { db } from "./db";
import { 
  studySpots, spotImages, reviews,
  type StudySpot, type SpotImage, type Review,
  type InsertStudySpot, type InsertSpotImage
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Study Spots
  getStudySpots(): Promise<StudySpot[]>;
  getStudySpot(id: number): Promise<StudySpot | undefined>;
  createStudySpot(spot: InsertStudySpot): Promise<StudySpot>;
  updateStudySpot(id: number, updates: Partial<InsertStudySpot>): Promise<StudySpot>;
  updateStudySpotStatus(id: number, status: string): Promise<StudySpot>;
  
  // Spot Images
  getSpotImages(spotId: number): Promise<SpotImage[]>;
  addSpotImages(images: InsertSpotImage[]): Promise<SpotImage[]>;

  // Reviews
  getReviewsBySpot(spotId: number): Promise<Review[]>;
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

  async updateStudySpot(id: number, updates: Partial<InsertStudySpot>): Promise<StudySpot> {
    const [updatedSpot] = await db.update(studySpots)
      .set(updates)
      .where(eq(studySpots.id, id))
      .returning();
    return updatedSpot;
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
}

export const storage = new DatabaseStorage();
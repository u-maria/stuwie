import { z } from "zod";

export const errorSchemas = {
  validation: z.object({ message: z.string(), field: z.string().optional() }),
  notFound: z.object({ message: z.string() }),
  internal: z.object({ message: z.string() }),
};

export const api = {
  spots: {
    list: {
      method: "GET" as const,
      path: "/api/spots" as const,
      input: z.object({
        district: z.string().optional(),
        openNow: z.enum(["true", "false"]).optional(),
        openOnSundays: z.enum(["true", "false"]).optional(),
        hasWifi: z.enum(["true", "false"]).optional(),
        hasOutlets: z.enum(["true", "false"]).optional(),
        sort: z.enum(["relevant", "rating", "newest"]).optional(),
        status: z.literal("approved").optional()
      }).optional(),
      responses: {
        200: z.any(), // SpotsListResponse
      }
    },
    get: {
      method: "GET" as const,
      path: "/api/spots/:id" as const,
      responses: {
        200: z.any(), // StudySpotResponse
        404: errorSchemas.notFound,
      }
    }
  },
  reviews: {
    list: {
      method: "GET" as const,
      path: "/api/spots/:id/reviews" as const,
      responses: {
        200: z.any(), // ReviewResponse[]
      }
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

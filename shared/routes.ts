import { z } from "zod";
import { insertStudySpotSchema, insertReviewSchema, insertSavedSpotSchema, insertCheckInSchema } from "./schema";

export const errorSchemas = {
  validation: z.object({ message: z.string(), field: z.string().optional() }),
  notFound: z.object({ message: z.string() }),
  unauthorized: z.object({ message: z.string() }),
  forbidden: z.object({ message: z.string() }),
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
        status: z.enum(["approved", "pending", "rejected"]).optional()
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
    },
    create: {
      method: "POST" as const,
      path: "/api/spots" as const,
      input: insertStudySpotSchema.extend({
        images: z.array(z.string()).optional()
      }),
      responses: {
        201: z.any(), // StudySpotResponse
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      }
    },
    updateStatus: {
      method: "PATCH" as const,
      path: "/api/spots/:id/status" as const,
      input: z.object({ status: z.enum(["pending", "approved", "rejected"]) }),
      responses: {
        200: z.any(), // StudySpotResponse
        401: errorSchemas.unauthorized,
        403: errorSchemas.forbidden,
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
    },
    create: {
      method: "POST" as const,
      path: "/api/spots/:id/reviews" as const,
      input: insertReviewSchema.omit({ spotId: true }),
      responses: {
        201: z.any(), // ReviewResponse
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
        404: errorSchemas.notFound,
      }
    },
    delete: {
      method: "DELETE" as const,
      path: "/api/reviews/:id" as const,
      responses: {
        204: z.void(),
        401: errorSchemas.unauthorized,
        403: errorSchemas.forbidden,
        404: errorSchemas.notFound,
      }
    }
  },
  savedSpots: {
    list: {
      method: "GET" as const,
      path: "/api/user/saved-spots" as const,
      responses: {
        200: z.any(), // SavedSpotResponse[]
        401: errorSchemas.unauthorized,
      }
    },
    toggle: {
      method: "POST" as const,
      path: "/api/user/saved-spots/toggle" as const,
      input: z.object({ spotId: z.number(), listType: z.enum(["favorite", "check_later"]) }),
      responses: {
        200: z.object({ action: z.enum(["added", "removed"]) }),
        401: errorSchemas.unauthorized,
        404: errorSchemas.notFound,
      }
    }
  },
  checkIns: {
    list: {
      method: "GET" as const,
      path: "/api/user/check-ins" as const,
      responses: {
        200: z.any(), // CheckInResponse[]
        401: errorSchemas.unauthorized,
      }
    },
    create: {
      method: "POST" as const,
      path: "/api/spots/:id/check-in" as const,
      responses: {
        201: z.any(), // CheckInResponse
        401: errorSchemas.unauthorized,
        404: errorSchemas.notFound,
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

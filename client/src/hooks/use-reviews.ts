import { useQuery } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import type { ReviewResponse } from "@shared/schema";

export function useReviews(spotId: number) {
  return useQuery({
    queryKey: [api.reviews.list.path, spotId],
    queryFn: async () => {
      const url = buildUrl(api.reviews.list.path, { id: spotId });
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch reviews");
      return (await res.json()) as ReviewResponse[];
    },
    enabled: !!spotId,
  });
}

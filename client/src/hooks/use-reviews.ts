import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import type { ReviewResponse, InsertReview } from "@shared/schema";

export function useReviews(spotId: number) {
  return useQuery({
    queryKey: [api.reviews.list.path, spotId],
    queryFn: async () => {
      const url = buildUrl(api.reviews.list.path, { id: spotId });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch reviews");
      return (await res.json()) as ReviewResponse[];
    },
    enabled: !!spotId,
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ spotId, ...data }: Omit<InsertReview, "spotId"> & { spotId: number }) => {
      const url = buildUrl(api.reviews.create.path, { id: spotId });
      const res = await fetch(url, {
        method: api.reviews.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to create review");
      }
      return await res.json() as ReviewResponse;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [api.reviews.list.path, variables.spotId] });
      queryClient.invalidateQueries({ queryKey: [api.spots.get.path, variables.spotId] });
    },
  });
}

import { useQuery } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import type { StudySpotResponse, SpotsListResponse } from "@shared/schema";

export function useSpots(filters?: { district?: string; status?: string }) {
  const params = new URLSearchParams();
  if (filters?.district) params.append("district", filters.district);
  if (filters?.status) params.append("status", filters.status);
  
  const queryString = params.toString() ? `?${params.toString()}` : "";

  return useQuery({
    queryKey: [api.spots.list.path, filters],
    queryFn: async () => {
      const res = await fetch(`${api.spots.list.path}${queryString}`);
      if (!res.ok) throw new Error("Failed to fetch spots");
      return (await res.json()) as SpotsListResponse;
    },
  });
}

export function useSpot(id: number) {
  return useQuery({
    queryKey: [api.spots.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.spots.get.path, { id });
      const res = await fetch(url);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch spot");
      return (await res.json()) as StudySpotResponse;
    },
    enabled: !!id,
  });
}

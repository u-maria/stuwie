import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import type { CreateStudySpotRequest, UpdateStudySpotStatusRequest, StudySpotResponse, SpotsListResponse } from "@shared/schema";

export function useSpots(filters?: { district?: string; status?: string }) {
  const params = new URLSearchParams();
  if (filters?.district) params.append("district", filters.district);
  if (filters?.status) params.append("status", filters.status);
  
  const queryString = params.toString() ? `?${params.toString()}` : "";

  return useQuery({
    queryKey: [api.spots.list.path, filters],
    queryFn: async () => {
      const res = await fetch(`${api.spots.list.path}${queryString}`, { credentials: "include" });
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
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch spot");
      return (await res.json()) as StudySpotResponse;
    },
    enabled: !!id,
  });
}

export function useCreateSpot() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateStudySpotRequest) => {
      const res = await fetch(api.spots.create.path, {
        method: api.spots.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create spot");
      }
      return (await res.json()) as StudySpotResponse;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.spots.list.path] });
    },
  });
}

export function useUpdateSpotStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: number } & UpdateStudySpotStatusRequest) => {
      const url = buildUrl(api.spots.updateStatus.path, { id });
      const res = await fetch(url, {
        method: api.spots.updateStatus.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update status");
      return (await res.json()) as StudySpotResponse;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [api.spots.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.spots.get.path, variables.id] });
    },
  });
}

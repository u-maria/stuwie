import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import type { SavedSpotResponse, CheckInResponse } from "@shared/schema";

export function useSavedSpots() {
  return useQuery({
    queryKey: [api.savedSpots.list.path],
    queryFn: async () => {
      const res = await fetch(api.savedSpots.list.path, { credentials: "include" });
      if (res.status === 401) return [];
      if (!res.ok) throw new Error("Failed to fetch saved spots");
      return (await res.json()) as SavedSpotResponse[];
    },
  });
}

export function useToggleSavedSpot() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { spotId: number; listType: "favorite" | "check_later" }) => {
      const res = await fetch(api.savedSpots.toggle.path, {
        method: api.savedSpots.toggle.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to toggle saved spot");
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.savedSpots.list.path] });
    },
  });
}

export function useCheckIns() {
  return useQuery({
    queryKey: [api.checkIns.list.path],
    queryFn: async () => {
      const res = await fetch(api.checkIns.list.path, { credentials: "include" });
      if (res.status === 401) return [];
      if (!res.ok) throw new Error("Failed to fetch check-ins");
      return (await res.json()) as CheckInResponse[];
    },
  });
}

export function useCreateCheckIn() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (spotId: number) => {
      const url = buildUrl(api.checkIns.create.path, { id: spotId });
      const res = await fetch(url, {
        method: api.checkIns.create.method,
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to check in");
      return (await res.json()) as CheckInResponse;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.checkIns.list.path] });
    },
  });
}

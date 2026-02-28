import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import type { Store, InsertStore } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useAppToast } from "@/hooks/use-app-toast";
import { useLocation } from "wouter";

export function useStore() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useAppToast();
  const [, setLocation] = useLocation();

  const { data: myStore, isLoading: isMyStoreLoading } = useQuery<Store>({
    queryKey: [api.stores.getMine.path],
    retry: false,
  });

  const createStoreMutation = useMutation({
    mutationFn: async (data: InsertStore) => {
      const res = await apiRequest(api.stores.create.method, api.stores.create.path, data);
      return res.json();
    },
    onSuccess: (data: Store) => {
      queryClient.invalidateQueries({ queryKey: [api.auth.me.path] });
      queryClient.setQueryData([api.stores.getMine.path], data);
      showSuccess(`Your store '${data.name}' is now live! 🎉`);
      setLocation("/dashboard");
    },
    onError: (error: Error) => {
      showError("Creation failed", error.message);
    },
  });

  const updateStoreMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<InsertStore> }) => {
      const url = buildUrl(api.stores.update.path, { id });
      const res = await apiRequest(api.stores.update.method, url, updates);
      return res.json();
    },
    onSuccess: (data: Store) => {
      queryClient.setQueryData([api.stores.getMine.path], data);
      showSuccess("Store settings saved successfully.");
    },
    onError: (error: Error) => {
      showError("Update failed", error.message);
    },
  });

  return {
    myStore,
    isMyStoreLoading,
    createStoreMutation,
    updateStoreMutation,
  };
}

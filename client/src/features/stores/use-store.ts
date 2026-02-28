import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import type { Store, InsertStore } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export function useStore() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
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
      toast({ title: "Store created!", description: "Welcome to your new shop." });
      setLocation("/dashboard");
    },
    onError: (error: Error) => {
      toast({ variant: "destructive", title: "Creation failed", description: error.message });
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
      toast({ title: "Settings saved", description: "Your store has been updated." });
    },
  });

  return {
    myStore,
    isMyStoreLoading,
    createStoreMutation,
    updateStoreMutation,
  };
}

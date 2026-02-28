import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import type { Product, InsertProduct } from "@shared/schema";

export function useProducts(storeId?: number) {
  return useQuery<Product[]>({
    queryKey: storeId ? ["/api/stores", storeId, "products"] : ["/api/products"],
  });
}

export function useProduct(id: number) {
  return useQuery<Product>({
    queryKey: [`/api/products/${id}`],
  });
}

export function useCreateProduct() {
  return useMutation({
    mutationFn: async (data: InsertProduct) => {
      const res = await apiRequest("POST", "/api/products", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
    },
  });
}

export function useUpdateProduct(id: number) {
  return useMutation({
    mutationFn: async (data: Partial<InsertProduct>) => {
      const res = await apiRequest("PATCH", `/api/products/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      queryClient.invalidateQueries({ queryKey: [`/api/products/${id}`] });
    },
  });
}

export function useDeleteProduct() {
  return useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
    },
  });
}

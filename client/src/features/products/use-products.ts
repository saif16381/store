import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import type { Product, InsertProduct } from "@shared/schema";
import { useAppToast } from "@/hooks/use-app-toast";

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
  const { showSuccess, showError } = useAppToast();
  return useMutation({
    mutationFn: async (data: InsertProduct) => {
      const res = await apiRequest("POST", "/api/products", data);
      return res.json();
    },
    onSuccess: (data: Product) => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      showSuccess(`Product '${data.title}' has been listed.`);
    },
    onError: (error: Error) => {
      showError("Failed to create product", error.message);
    },
  });
}

export function useUpdateProduct(id: number) {
  const { showSuccess, showError } = useAppToast();
  return useMutation({
    mutationFn: async (data: Partial<InsertProduct>) => {
      const res = await apiRequest("PATCH", `/api/products/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      queryClient.invalidateQueries({ queryKey: [`/api/products/${id}`] });
      showSuccess("Product updated successfully.");
    },
    onError: (error: Error) => {
      showError("Failed to update product", error.message);
    },
  });
}

export function useDeleteProduct() {
  const { showSuccess, showError } = useAppToast();
  return useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      showSuccess("Product has been removed.");
    },
    onError: (error: Error) => {
      showError("Failed to remove product", error.message);
    },
  });
}

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertProductSchema, type InsertProduct, type Product } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/use-auth";
import { useCreateProduct, useUpdateProduct } from "../use-products";
import { useLocation } from "wouter";
import { useState } from "react";
import { Loader2, X, Plus } from "lucide-react";

interface ProductFormProps {
  product?: Product;
}

export function ProductForm({ product }: ProductFormProps) {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct(product?.id || 0);
  const [images, setImages] = useState<string[]>(product?.images || []);

  const form = useForm<InsertProduct>({
    resolver: zodResolver(insertProductSchema),
    defaultValues: product ? {
      ...product,
      price: product.price.toString(),
      compareAtPrice: product.compareAtPrice?.toString() || undefined,
    } : {
      title: "",
      description: "",
      price: "0",
      compareAtPrice: undefined,
      category: "",
      stock: 0,
      images: [],
      storeId: user?.storeId ? parseInt(user.storeId) : 0,
      storeName: "",
      storeSlug: "",
    },
  });

  const onSubmit = async (data: InsertProduct) => {
    if (images.length === 0) {
      return;
    }
    
    const productData = {
      ...data,
      images,
      storeId: user?.storeId ? parseInt(user.storeId) : 0,
      // In a real app, these would be fetched from the store record
      storeName: "My Store", 
      storeSlug: "my-store",
    };

    if (product) {
      await updateProduct.mutateAsync(productData);
    } else {
      await createProduct.mutateAsync(productData);
    }
    setLocation("/dashboard/products");
  };

  const addImage = () => {
    // Mock image upload
    setImages([...images, `https://picsum.photos/seed/${Math.random()}/400/400`]);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock</FormLabel>
                <FormControl>
                  <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Electronics">Electronics</SelectItem>
                  <SelectItem value="Fashion">Fashion</SelectItem>
                  <SelectItem value="Home">Home</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <FormLabel>Images</FormLabel>
          <div className="flex flex-wrap gap-4">
            {images.map((url, i) => (
              <div key={i} className="relative w-24 h-24 border rounded overflow-hidden">
                <img src={url} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            {images.length < 8 && (
              <button
                type="button"
                onClick={addImage}
                className="w-24 h-24 border-2 border-dashed rounded flex items-center justify-center hover:bg-gray-50"
              >
                <Plus size={24} className="text-gray-400" />
              </button>
            )}
          </div>
          {images.length === 0 && <p className="text-sm text-red-500">At least one image is required</p>}
        </div>

        <Button type="submit" disabled={createProduct.isPending || updateProduct.isPending}>
          {(createProduct.isPending || updateProduct.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {product ? "Update Product" : "Create Product"}
        </Button>
      </form>
    </Form>
  );
}

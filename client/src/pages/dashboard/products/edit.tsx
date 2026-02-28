import { DashboardLayout } from "@/components/dashboard/layout";
import { ProductForm } from "@/features/products/components/product-form";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { useProduct } from "@/features/products/use-products";

export default function EditProductPage({ id }: { id: number }) {
  const { data: product, isLoading } = useProduct(id);

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/products">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h2 className="text-3xl font-bold tracking-tight">Edit Product</h2>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : product ? (
          <ProductForm product={product} />
        ) : (
          <p>Product not found.</p>
        )}
      </div>
    </DashboardLayout>
  );
}

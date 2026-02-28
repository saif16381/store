import { DashboardLayout } from "@/components/dashboard/layout";
import { ProductForm } from "@/features/products/components/product-form";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Link } from "wouter";

export default function NewProductPage() {
  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/products">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h2 className="text-3xl font-bold tracking-tight">Add New Product</h2>
        </div>
        <ProductForm />
      </div>
    </DashboardLayout>
  );
}

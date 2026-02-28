import { DashboardLayout } from "@/components/dashboard/layout";
import { ProductList } from "@/features/products/components/product-list";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Plus } from "lucide-react";
import { useAppToast } from "@/hooks/use-app-toast";

export default function ProductListPage() {
  const { showSuccess, showError } = useAppToast();
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Products</h2>
            <p className="text-muted-foreground">Manage your store products and inventory.</p>
          </div>
          <Link href="/dashboard/products/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Product
            </Button>
          </Link>
        </div>
        <ProductList />
      </div>
    </DashboardLayout>
  );
}

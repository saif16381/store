import { useQuery } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import type { Store } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function StoreProfilePage({ params }: { params: { slug: string } }) {
  const { data: store, isLoading } = useQuery<Store>({
    queryKey: [api.stores.getBySlug.path, params.slug],
    queryFn: async () => {
      const url = buildUrl(api.stores.getBySlug.path, { slug: params.slug });
      const res = await fetch(url);
      if (!res.ok) throw new Error("Store not found");
      return res.json();
    }
  });

  if (isLoading) return <div className="p-8"><Skeleton className="h-[200px] w-full" /></div>;
  if (!store) return <div className="p-8">Store not found</div>;

  return (
    <div className="container mx-auto py-8">
      {store.banner && (
        <div className="w-full h-48 rounded-lg overflow-hidden mb-8">
          <img src={store.banner} alt={store.name} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="flex items-center gap-6 mb-8">
        <div className="w-24 h-24 rounded-full overflow-hidden border">
          <img src={store.logo} alt={store.name} className="w-full h-full object-cover" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">{store.name}</h1>
          <p className="text-muted-foreground">{store.category}</p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>About our shop</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{store.description}</p>
          <div className="mt-4 flex gap-4 text-sm text-muted-foreground">
            <span>Rating: {store.rating} / 5</span>
            <span>Total Sales: {store.totalSales}</span>
          </div>
        </CardContent>
      </Card>
      
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Products</h2>
        <p className="text-muted-foreground italic">No products listed yet.</p>
      </div>
    </div>
  );
}

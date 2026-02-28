import { Navbar } from "@/components/layout/Navbar";
import { useProduct } from "@/features/products/use-products";
import { Button } from "@/components/ui/button";
import { Loader2, Store, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

export default function ProductDetailPage({ id }: { id: string }) {
  const { data: product, isLoading } = useProduct(parseInt(id));
  const [currentImage, setCurrentImage] = useState(0);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-xl font-semibold">Product not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8 bg-white p-6 rounded-xl shadow-sm">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
              <img 
                src={product.images[currentImage]} 
                alt={product.title}
                className="w-full h-full object-cover"
              />
              {product.images.length > 1 && (
                <div className="absolute inset-0 flex items-center justify-between px-4">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="bg-white/80 hover:bg-white rounded-full"
                    onClick={() => setCurrentImage((prev) => (prev === 0 ? product.images.length - 1 : prev - 1))}
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="bg-white/80 hover:bg-white rounded-full"
                    onClick={() => setCurrentImage((prev) => (prev === product.images.length - 1 ? 0 : prev + 1))}
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                </div>
              )}
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImage(i)}
                  className={`relative w-20 h-20 rounded-md overflow-hidden border-2 flex-shrink-0 ${
                    currentImage === i ? "border-primary" : "border-transparent"
                  }`}
                >
                  <img src={img} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Store className="h-4 w-4" />
                <a href={`/store/${product.storeSlug}`} className="hover:text-primary font-medium">
                  {product.storeName}
                </a>
                <span>•</span>
                <span>{product.category}</span>
              </div>
              <h1 className="text-3xl font-bold">{product.title}</h1>
            </div>

            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-bold text-primary">${product.price}</span>
              {product.compareAtPrice && (
                <span className="text-xl text-muted-foreground line-through">
                  ${product.compareAtPrice}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant={product.stock > 0 ? "secondary" : "destructive"}>
                  {product.stock > 0 ? "In Stock" : "Out of Stock"}
                </Badge>
                {product.stock > 0 && product.stock < 10 && (
                  <span className="text-sm text-orange-600 font-medium">
                    Only {product.stock} left!
                  </span>
                )}
              </div>
            </div>

            <div className="prose prose-sm max-w-none text-muted-foreground">
              <p>{product.description}</p>
            </div>

            <div className="pt-6 space-y-4">
              <Button className="w-full h-12 text-lg" disabled={product.stock === 0}>
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                Free shipping on orders over $50
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

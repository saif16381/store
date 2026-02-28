import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Heart, Sparkles, Star, TrendingUp } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import BecomeSellerForm from "@/features/stores/components/become-seller-form";
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

const categories = [
  { id: 1, name: "Jewelry & Accessories", image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&h=500&fit=crop" },
  { id: 2, name: "Clothing & Shoes", image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&h=500&fit=crop" },
  { id: 3, name: "Home & Living", image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=500&h=500&fit=crop" },
  { id: 4, name: "Wedding & Party", image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=500&h=500&fit=crop" },
  { id: 5, name: "Toys & Entertainment", image: "https://images.unsplash.com/photo-1596461404969-9ce20c71c709?w=500&h=500&fit=crop" },
  { id: 6, name: "Art & Collectibles", image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&h=500&fit=crop" },
];

const trending = [
  { id: 101, title: "Handcrafted Ceramic Mug", shop: "Earth & Fire", price: 28.00, rating: 4.9, reviews: 124, image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=600&h=800&fit=crop" },
  { id: 102, title: "Minimalist Gold Necklace", shop: "Lumina Jewels", price: 65.50, rating: 5.0, reviews: 89, image: "https://images.unsplash.com/photo-1599643478524-fb66f7ca0f85?w=600&h=800&fit=crop" },
  { id: 103, title: "Linen Throw Pillow Cover", shop: "Soft Textiles", price: 34.00, rating: 4.8, reviews: 412, image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600&h=800&fit=crop" },
  { id: 104, title: "Organic Soy Wax Candle", shop: "Aura Scents", price: 22.00, rating: 4.7, reviews: 56, image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600&h=800&fit=crop" },
];

export default function Home() {
  const { user } = useAuth();
  const [showSellerForm, setShowSellerForm] = useState(false);

  return (
    <Layout>
      <section className="relative bg-secondary/30 pt-16 pb-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-70"></div>
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-accent/40 via-transparent to-transparent opacity-70"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground mb-6 leading-tight">
              Discover unique, <span className="text-primary italic">handcrafted</span> pieces you'll love
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 text-balance">
              Support independent creators and find extraordinary items for your home, wardrobe, and life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user?.role === "buyer" && (
                <Dialog open={showSellerForm} onOpenChange={setShowSellerForm}>
                  <DialogTrigger asChild>
                    <Button size="lg" className="rounded-full px-8 h-14 text-lg shadow-xl shadow-primary/20 hover:-translate-y-1 transition-transform">
                      Become a Seller
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-3xl">
                    <BecomeSellerForm />
                  </DialogContent>
                </Dialog>
              )}
              {user?.role === "seller" && (
                <Link href="/dashboard">
                  <Button size="lg" className="rounded-full px-8 h-14 text-lg shadow-xl shadow-primary/20 hover:-translate-y-1 transition-transform">
                    Seller Dashboard
                  </Button>
                </Link>
              )}
              {!user && (
                <Link href="/login">
                  <Button size="lg" className="rounded-full px-8 h-14 text-lg shadow-xl shadow-primary/20 hover:-translate-y-1 transition-transform">
                    Start Shopping
                  </Button>
                </Link>
              )}
              <Button variant="outline" size="lg" className="rounded-full px-8 h-14 text-lg bg-background hover:bg-secondary/50">
                Explore Categories
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-display font-bold flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              Shop by Category
            </h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <motion.a 
                href="#" 
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="group flex flex-col items-center gap-3"
              >
                <div className="w-full aspect-square rounded-full overflow-hidden border-4 border-transparent group-hover:border-primary/20 transition-all duration-300 shadow-md">
                  <img 
                    src={category.image} 
                    alt={category.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <span className="text-sm font-semibold text-center group-hover:text-primary transition-colors">
                  {category.name}
                </span>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-secondary/10 border-t border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="text-3xl font-display font-bold flex items-center gap-2 mb-2">
                <TrendingUp className="h-7 w-7 text-primary" />
                Trending Right Now
              </h2>
              <p className="text-muted-foreground">Find out what everyone's talking about.</p>
            </div>
            <Button variant="ghost" className="font-semibold text-primary hover:text-primary/80 hover:bg-primary/10">
              See more trending →
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {trending.map((item, index) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="group relative flex flex-col"
              >
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-4 bg-secondary">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <button className="absolute top-3 right-3 p-2.5 rounded-full bg-background/80 backdrop-blur-sm text-foreground hover:text-red-500 hover:bg-background transition-colors shadow-sm opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 duration-300">
                    <Heart className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="flex flex-col flex-1">
                  <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-1">{item.shop}</p>
                  
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                    <span className="text-sm font-medium">{item.rating}</span>
                    <span className="text-xs text-muted-foreground">({item.reviews})</span>
                  </div>
                  
                  <div className="mt-auto pt-2">
                    <p className="font-bold text-lg">${item.price.toFixed(2)}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}

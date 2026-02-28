import { Link, useLocation } from "wouter";
import { Store, Search, ShoppingBag, Menu, UserCircle, LogOut, Settings, PackageOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Navbar() {
  const { user, logoutMutation } = useAuth();
  const [, setLocation] = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full glass-panel">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary/20 transition-colors">
                <Store className="h-6 w-6 text-primary" />
              </div>
              <span className="font-display font-bold text-2xl tracking-tight text-foreground">
                ArtisanMarket
              </span>
            </Link>
          </div>

          {/* Search Bar - Hidden on Mobile */}
          <div className="hidden flex-1 max-w-2xl mx-8 md:flex items-center relative">
            <div className="relative w-full group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input 
                type="search" 
                placeholder="Search for handmade goods, vintage, and more..." 
                className="w-full pl-10 pr-4 py-6 rounded-full bg-secondary/50 border-transparent focus-visible:ring-primary/20 focus-visible:bg-background transition-all shadow-inner"
              />
              <Button size="sm" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full px-6 bg-foreground hover:bg-primary text-background transition-colors">
                Search
              </Button>
            </div>
          </div>

          {/* Right Navigation */}
          <div className="flex items-center gap-2 sm:gap-4">
            <Button variant="ghost" size="icon" className="md:hidden">
              <Search className="h-5 w-5" />
            </Button>
            
            <Button variant="ghost" size="icon" className="relative group">
              <ShoppingBag className="h-5 w-5 group-hover:text-primary transition-colors" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary" />
            </Button>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10 border-2 border-primary/20 hover:border-primary transition-colors">
                      <AvatarImage src={user.photoURL || ""} alt={user.displayName} />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {user.displayName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.displayName}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {user.role === "seller" && (
                    <>
                      <DropdownMenuItem onClick={() => setLocation("/dashboard")} className="cursor-pointer">
                        <Store className="mr-2 h-4 w-4" />
                        <span>Seller Dashboard</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem className="cursor-pointer">
                    <PackageOpen className="mr-2 h-4 w-4" />
                    <span>My Orders</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="text-destructive focus:text-destructive cursor-pointer"
                    onClick={() => logoutMutation.mutate()}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden sm:flex items-center gap-3">
                <Button variant="ghost" onClick={() => setLocation("/login")} className="font-semibold hover:text-primary">
                  Sign in
                </Button>
                <Button onClick={() => setLocation("/register")} className="rounded-full px-6 font-semibold shadow-lg shadow-primary/20">
                  Register
                </Button>
              </div>
            )}

            <Button variant="ghost" size="icon" className="sm:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

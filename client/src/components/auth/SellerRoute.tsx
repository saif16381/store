import React, { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SellerRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !user) {
      setLocation("/login");
    }
  }, [isLoading, user, setLocation]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (user.role !== "seller" && user.role !== "admin") {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh] p-4">
        <div className="max-w-md w-full bg-card rounded-2xl p-8 shadow-xl text-center border border-border">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <h2 className="text-2xl font-display font-bold mb-2">Seller Access Required</h2>
          <p className="text-muted-foreground mb-8">
            You need a seller account to access this page. Would you like to upgrade your account to start selling?
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="outline" onClick={() => setLocation("/")}>Go Home</Button>
            <Button onClick={() => setLocation("/settings/upgrade")}>Become a Seller</Button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

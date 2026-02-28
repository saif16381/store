import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cartStore";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useAppToast } from "@/hooks/use-app-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const checkoutSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  address: z.string().min(5, "Full address is required"),
  city: z.string().min(2, "City is required"),
  zipCode: z.string().min(5, "Zip code is required"),
});

type CheckoutData = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const { items, getTotal, clearCart } = useCartStore();
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { showSuccess, showError } = useAppToast();

  const checkoutMutation = useMutation({
    mutationFn: async (data: CheckoutData) => {
      // Group items by store for multi-vendor ordering
      const stores = Array.from(new Set(items.map(i => i.storeId)));
      
      const orderPromises = stores.map(storeId => {
        const storeItems = items.filter(i => i.storeId === storeId);
        const storeTotal = storeItems.reduce((sum, i) => sum + (i.price * i.quantity), 0);
        
        return apiRequest("POST", "/api/orders", {
          storeId,
          items: JSON.stringify(storeItems),
          total: storeTotal.toFixed(2),
          customerName: data.name,
          customerEmail: data.email,
          shippingAddress: `${data.address}, ${data.city}, ${data.zipCode}`,
        });
      });

      return Promise.all(orderPromises);
    },
    onSuccess: () => {
      showSuccess("Order placed successfully! 🎉");
      clearCart();
      setLocation("/");
    },
    onError: (error: Error) => {
      showError("Failed to place order", error.message);
    },
  });

  const form = useForm<CheckoutData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: user?.displayName || "",
      email: user?.email || "",
      address: "",
      city: "",
      zipCode: "",
    },
  });

  if (items.length === 0) {
    setLocation("/cart");
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader><CardTitle>Shipping Information</CardTitle></CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit((data) => checkoutMutation.mutate(data))} className="space-y-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem><FormLabel>Email</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="address" render={({ field }) => (
                  <FormItem><FormLabel>Address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="city" render={({ field }) => (
                    <FormItem><FormLabel>City</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="zipCode" render={({ field }) => (
                    <FormItem><FormLabel>Zip Code</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                <Button type="submit" className="w-full" disabled={checkoutMutation.isPending}>
                  {checkoutMutation.isPending ? "Processing..." : `Pay $${getTotal().toFixed(2)}`}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        
        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Order Summary</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {items.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.title} x {item.quantity}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t pt-2 mt-4 flex justify-between font-bold">
                <span>Total</span>
                <span>${getTotal().toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

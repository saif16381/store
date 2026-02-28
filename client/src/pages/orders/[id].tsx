import { useQuery } from "@tanstack/react-query";
import { useParams, Link, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { motion } from "framer-motion";
import type { Order } from "@shared/schema";
import { formatCurrency } from "@/lib/utils";
import { ChevronLeft, Package, Truck, CheckCircle2, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { useAppToast } from "@/hooks/use-app-toast";

const STATUS_STEPS = [
  { status: "pending", label: "Pending", icon: Clock },
  { status: "confirmed", label: "Confirmed", icon: Package },
  { status: "processing", label: "Processing", icon: Package },
  { status: "shipped", label: "Shipped", icon: Truck },
  { status: "delivered", label: "Delivered", icon: CheckCircle2 },
];

export default function OrderDetailPage() {
  const { id } = useParams();
  const { showInfo } = useAppToast();
  const [prevStatus, setPrevStatus] = useState<string | null>(null);
  const { data: order, isLoading } = useQuery<Order>({
    queryKey: [`/api/orders/${id}`],
    refetchInterval: 5000, // Polling for real-time updates as we don't have Firestore here
  });

  useEffect(() => {
    if (order && prevStatus && order.status !== prevStatus) {
      showInfo(`Your order status has been updated to ${order.status}!`);
    }
    if (order) {
      setPrevStatus(order.status);
    }
  }, [order?.status]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 space-y-8">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto py-16 text-center">
        <h2 className="text-2xl font-bold">Order not found</h2>
        <Link href="/orders">
          <Button variant="link">Back to Orders</Button>
        </Link>
      </div>
    );
  }

  const currentStatusIndex = STATUS_STEPS.findIndex(s => s.status === order.status);
  const items = JSON.parse(order.items);

  return (
    <div className="container mx-auto py-8 max-w-4xl space-y-8">
      <Link href="/orders" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
        <ChevronLeft className="mr-1 h-4 w-4" />
        Back to Orders
      </Link>

      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Order Details</h1>
          <p className="text-muted-foreground">Placed on {format(new Date(order.createdAt || new Date()), "PPP")}</p>
        </div>
        <Badge className="text-lg py-1 px-4">{order.status}</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative flex justify-between">
            {STATUS_STEPS.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = index <= currentStatusIndex;
              return (
                <div key={step.status} className="flex flex-col items-center z-10">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isCompleted ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs mt-2 font-medium">{step.label}</span>
                </div>
              );
            })}
            <div className="absolute top-5 left-0 w-full h-0.5 bg-muted -z-0" />
            <motion.div 
              className="absolute top-5 left-0 h-0.5 bg-primary -z-0"
              initial={{ width: 0 }}
              animate={{ width: `${(currentStatusIndex / (STATUS_STEPS.length - 1)) * 100}%` }}
              transition={{ duration: 1, ease: "easeInOut" }}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item: any) => (
                <div key={item.id} className="flex gap-4">
                  <div className="h-16 w-16 rounded bg-muted flex-shrink-0" />
                  <div className="flex-grow">
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-muted-foreground">Qty: {item.quantity} × {formatCurrency(item.price)}</p>
                  </div>
                  <div className="font-medium">
                    {formatCurrency(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Address</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap">{order.shippingAddress}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>{formatCurrency(Number(order.total))}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>{formatCurrency(Number(order.total))}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import DashboardLayout from "@/components/dashboard/layout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppToast } from "@/hooks/use-app-toast";
import { format } from "date-fns";
import { api, buildUrl } from "@shared/routes";
import { Order } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, Copy, CheckCircle2, Package, Clock, Truck, Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500",
  confirmed: "bg-blue-500",
  processing: "bg-orange-500",
  shipped: "bg-purple-500",
  delivered: "bg-green-500",
  cancelled: "bg-red-500",
};

const statusIcons: Record<string, any> = {
  pending: Clock,
  confirmed: CheckCircle2,
  processing: Package,
  shipped: Truck,
  delivered: CheckCircle2,
  cancelled: Ban,
};

export default function SellerOrdersPage() {
  const { user } = useAuth();
  const { showSuccess, showError } = useAppToast();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState("all");

  const { data: orders, isLoading } = useQuery<Order[]>({
    queryKey: [api.orders.getStoreOrders.path, user?.storeId],
    queryFn: async () => {
      const res = await fetch(buildUrl(api.orders.getStoreOrders.path, { storeId: user!.storeId! }));
      if (!res.ok) throw new Error("Failed to fetch orders");
      return res.json();
    },
    enabled: !!user?.storeId,
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: number; status: string }) => {
      const res = await fetch(buildUrl(api.orders.updateStatus.path, { id: orderId }), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to update status");
      }
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData<Order[]>(
        [api.orders.getStoreOrders.path, user?.storeId],
        (old) => old?.map(o => o.id === data.id ? data : o)
      );
      showSuccess(`Order #${data.id} status updated to ${data.status}`);
    },
    onError: (err: Error) => {
      showError("Failed to update order status", err.message);
    },
  });

  const filteredOrders = orders?.filter(o => filter === "all" || o.status === filter) || [];

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-4">
          <Skeleton className="h-10 w-[250px]" />
          <div className="border rounded-md">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full border-b" />
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Order Management</h1>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Orders</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Buyer</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence mode="popLayout">
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground italic">
                    No orders found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => (
                  <OrderRow 
                    key={order.id} 
                    order={order} 
                    onUpdateStatus={(status) => updateStatusMutation.mutate({ orderId: order.id, status })}
                    isUpdating={updateStatusMutation.isPending && updateStatusMutation.variables?.orderId === order.id}
                  />
                ))
              )}
            </AnimatePresence>
          </TableBody>
        </Table>
      </Card>
    </DashboardLayout>
  );
}

function OrderRow({ order, onUpdateStatus, isUpdating }: { order: Order; onUpdateStatus: (s: string) => void; isUpdating: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const items = JSON.parse(order.items);
  const StatusIcon = statusIcons[order.status] || Clock;

  return (
    <>
      <motion.tr
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <TableCell className="font-mono text-xs">
          <div className="flex items-center gap-2">
            #{order.id.toString().padStart(8, '0')}
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6" 
              onClick={(e) => {
                e.stopPropagation();
                navigator.clipboard.writeText(order.id.toString());
              }}
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        </TableCell>
        <TableCell>{order.customerName}</TableCell>
        <TableCell className="font-medium">${Number(order.total).toFixed(2)}</TableCell>
        <TableCell>
          <Badge className={`${statusColors[order.status]} hover:${statusColors[order.status]} flex items-center gap-1 w-fit`}>
            <StatusIcon className="h-3 w-3" />
            {order.status.toUpperCase()}
          </Badge>
        </TableCell>
        <TableCell className="text-muted-foreground">
          {format(new Date(order.createdAt!), "MMM dd, yyyy")}
        </TableCell>
        <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
          <Select 
            value={order.status} 
            onValueChange={onUpdateStatus}
            disabled={isUpdating || ["shipped", "delivered", "cancelled"].includes(order.status)}
          >
            <SelectTrigger className="w-[130px] ml-auto">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending" disabled>Pending</SelectItem>
              <SelectItem value="confirmed" disabled={order.status !== "pending"}>Confirm</SelectItem>
              <SelectItem value="processing" disabled={order.status !== "confirmed"}>Process</SelectItem>
              <SelectItem value="shipped" disabled={order.status !== "processing"}>Ship</SelectItem>
            </SelectContent>
          </Select>
        </TableCell>
      </motion.tr>
      {isOpen && (
        <TableRow className="bg-muted/30">
          <TableCell colSpan={6} className="p-0">
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-4 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Shipping Information</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{order.shippingAddress}</p>
                    <p className="text-sm font-medium">{order.customerEmail}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Order Items</h4>
                    <div className="space-y-2">
                      {items.map((item: any, idx: number) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span>{item.title} x {item.quantity}</span>
                          <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

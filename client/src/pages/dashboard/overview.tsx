import DashboardLayout from "@/components/dashboard/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingBag, DollarSign, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

const stats = [
  { title: "Total Products", value: "0", icon: Package, color: "text-blue-500" },
  { title: "Total Orders", value: "0", icon: ShoppingBag, color: "text-green-500" },
  { title: "Total Revenue", value: "$0.00", icon: DollarSign, color: "text-yellow-500" },
  { title: "Active Since", value: "Today", icon: TrendingUp, color: "text-purple-500" },
];

export default function DashboardOverview() {
  return (
    <DashboardLayout>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground italic">No orders yet. Start listing products to get sales!</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarGroup, SidebarGroupContent, SidebarGroupLabel } from "@/components/ui/sidebar";
import { LayoutDashboard, Package, ShoppingBag, Settings, LogOut } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";

const items = [
  { title: "Overview", icon: LayoutDashboard, url: "/dashboard" },
  { title: "Products", icon: Package, url: "/dashboard/products" },
  { title: "Orders", icon: ShoppingBag, url: "/dashboard/orders" },
  { title: "Settings", icon: Settings, url: "/dashboard/settings" },
];

export default function DashboardSidebar() {
  const [location] = useLocation();
  const { logoutMutation } = useAuth();

  return (
    <Sidebar>
      <SidebarHeader className="border-b px-6 py-4">
        <Link href="/">
          <a className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Pakstore
          </a>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Seller Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location === item.url}>
                    <Link href={item.url}>
                      <a>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </a>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <div className="mt-auto border-t p-4">
        <SidebarMenuButton 
          onClick={() => logoutMutation.mutate()}
          className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </SidebarMenuButton>
      </div>
    </Sidebar>
  );
}

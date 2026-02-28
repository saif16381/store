import { useEffect } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useThemeStore } from "@/stores/themeStore";
import NotFound from "@/pages/not-found";

// Page Imports
import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import ForgotPassword from "./pages/forgot-password";
import CartPage from "./pages/cart";
import CheckoutPage from "./pages/checkout";
import DashboardOverview from "./pages/dashboard/overview";
import SellerOrdersPage from "./pages/dashboard/orders";
import StoreSettingsPage from "./pages/dashboard/settings";
import ProductListPage from "./pages/dashboard/products/list";
import NewProductPage from "./pages/dashboard/products/new";
import EditProductPage from "./pages/dashboard/products/edit";
import ProductDetailPage from "./pages/product-detail";
import StoreProfilePage from "./pages/store-profile";
import BuyerOrderHistory from "./pages/orders";
import OrderDetailPage from "./pages/orders/[id]";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { SellerRoute } from "./components/auth/SellerRoute";
import { CartDrawer } from "./features/cart/components/cart-drawer";
import { AnimatePresence, motion } from "framer-motion";

const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.2 }}
  >
    {children}
  </motion.div>
);

function Router() {
  return (
    <AnimatePresence mode="wait">
      <Switch>
        <Route path="/">
          <PageWrapper><Home /></PageWrapper>
        </Route>
        <Route path="/login">
          <PageWrapper><Login /></PageWrapper>
        </Route>
        <Route path="/register">
          <PageWrapper><Register /></PageWrapper>
        </Route>
        <Route path="/forgot-password">
          <PageWrapper><ForgotPassword /></PageWrapper>
        </Route>
        <Route path="/cart">
          <PageWrapper><CartPage /></PageWrapper>
        </Route>
        <Route path="/checkout">
          <PageWrapper><CheckoutPage /></PageWrapper>
        </Route>
        <Route path="/store/:slug">
          {(params) => <PageWrapper><StoreProfilePage slug={params.slug} /></PageWrapper>}
        </Route>
        <Route path="/product/:id">
          {(params) => <PageWrapper><ProductDetailPage id={Number(params.id)} /></PageWrapper>}
        </Route>
        
        {/* Buyer Order Routes */}
        <Route path="/orders">
          <ProtectedRoute component={() => <PageWrapper><BuyerOrderHistory /></PageWrapper>} />
        </Route>
        <Route path="/orders/:id">
          {(params) => <ProtectedRoute component={() => <PageWrapper><OrderDetailPage id={Number(params.id)} /></PageWrapper>} />}
        </Route>

        {/* Dashboard Routes */}
        <Route path="/dashboard">
          <SellerRoute component={() => <PageWrapper><DashboardOverview /></PageWrapper>} />
        </Route>
        <Route path="/dashboard/settings">
          <SellerRoute component={() => <PageWrapper><StoreSettingsPage /></PageWrapper>} />
        </Route>
        <Route path="/dashboard/products">
          <SellerRoute component={() => <PageWrapper><ProductListPage /></PageWrapper>} />
        </Route>
        <Route path="/dashboard/products/new">
          <SellerRoute component={() => <PageWrapper><NewProductPage /></PageWrapper>} />
        </Route>
        <Route path="/dashboard/products/:id/edit">
          {(params) => <SellerRoute component={() => <PageWrapper><EditProductPage id={Number(params.id)} /></PageWrapper>} />}
        </Route>
        <Route path="/dashboard/orders">
          <SellerRoute component={() => <PageWrapper><SellerOrdersPage /></PageWrapper>} />
        </Route>
        
        {/* Fallback to 404 */}
        <Route>
          <PageWrapper><NotFound /></PageWrapper>
        </Route>
      </Switch>
    </AnimatePresence>
  );
}

function App() {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
        <CartDrawer />
        <Toaster position="bottom-right" expand={false} richColors />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

export default App;

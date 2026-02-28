import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

// Page Imports
import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import ForgotPassword from "./pages/forgot-password";
import CartPage from "./pages/cart";
import CheckoutPage from "./pages/checkout";
import DashboardOverview from "./pages/dashboard/overview";
import StoreSettingsPage from "./pages/dashboard/settings";
import ProductListPage from "./pages/dashboard/products/list";
import NewProductPage from "./pages/dashboard/products/new";
import EditProductPage from "./pages/dashboard/products/edit";
import ProductDetailPage from "./pages/product-detail";
import StoreProfilePage from "./pages/store-profile";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { SellerRoute } from "./components/auth/SellerRoute";
import { CartDrawer } from "./features/cart/components/cart-drawer";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/cart" component={CartPage} />
      <Route path="/checkout" component={CheckoutPage} />
      <Route path="/store/:slug" component={StoreProfilePage} />
      <Route path="/product/:id" component={ProductDetailPage} />
      
      {/* Dashboard Routes */}
      <Route path="/dashboard">
        <SellerRoute component={DashboardOverview} />
      </Route>
      <Route path="/dashboard/settings">
        <SellerRoute component={StoreSettingsPage} />
      </Route>
      <Route path="/dashboard/products">
        <SellerRoute component={ProductListPage} />
      </Route>
      <Route path="/dashboard/products/new">
        <SellerRoute component={NewProductPage} />
      </Route>
      <Route path="/dashboard/products/:id/edit">
        {(params) => <SellerRoute component={() => <EditProductPage id={Number(params.id)} />} />}
      </Route>
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
        <CartDrawer />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

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
import DashboardOverview from "./pages/dashboard/overview";
import StoreSettingsPage from "./pages/dashboard/settings";
import StoreProfilePage from "./pages/store-profile";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { SellerRoute } from "./components/auth/SellerRoute";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/store/:slug" component={StoreProfilePage} />
      
      {/* Dashboard Routes */}
      <Route path="/dashboard">
        <SellerRoute component={DashboardOverview} />
      </Route>
      <Route path="/dashboard/settings">
        <SellerRoute component={StoreSettingsPage} />
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
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import type { LoginData, RegisterData, ForgotPasswordData, User } from "@shared/schema";
import { apiRequest, getQueryFn } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { useAuthUI } from "@/store/use-auth-ui";

export function useAuth() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { setAuthLoading, setAuthError } = useAuthUI();

  // Fetch current user
  const { 
    data: user, 
    isLoading: isUserLoading,
    error: userError 
  } = useQuery<User | null>({
    queryKey: [api.auth.me.path],
    // Custom queryFn to handle 401 silently and return null instead of throwing
    queryFn: getQueryFn({ on401: "returnNull" }),
    retry: false,
  });

  // Login Mutation
  const loginMutation = useMutation({
    mutationFn: async (data: LoginData) => {
      setAuthLoading(true);
      setAuthError(null);
      const res = await apiRequest(api.auth.login.method, api.auth.login.path, data);
      return res.json();
    },
    onSuccess: (data: User) => {
      queryClient.setQueryData([api.auth.me.path], data);
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
      setLocation("/");
    },
    onError: (error: Error) => {
      setAuthError(error.message);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message || "Please check your credentials and try again.",
      });
    },
    onSettled: () => setAuthLoading(false),
  });

  // Register Mutation
  const registerMutation = useMutation({
    mutationFn: async (data: RegisterData) => {
      setAuthLoading(true);
      setAuthError(null);
      const res = await apiRequest(api.auth.register.method, api.auth.register.path, data);
      return res.json();
    },
    onSuccess: (data: User) => {
      queryClient.setQueryData([api.auth.me.path], data);
      toast({
        title: "Account created!",
        description: "Welcome to ArtisanMarket.",
      });
      setLocation("/");
    },
    onError: (error: Error) => {
      setAuthError(error.message);
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error.message || "Could not create your account. Please try again.",
      });
    },
    onSettled: () => setAuthLoading(false),
  });

  // Logout Mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest(api.auth.logout.method, api.auth.logout.path);
    },
    onSuccess: () => {
      queryClient.setQueryData([api.auth.me.path], null);
      queryClient.clear();
      toast({
        title: "Logged out",
        description: "You have been securely logged out.",
      });
      setLocation("/");
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Logout failed",
        description: "An error occurred while logging out.",
      });
    },
  });

  // Forgot Password Mutation
  const forgotPasswordMutation = useMutation({
    mutationFn: async (data: ForgotPasswordData) => {
      const res = await apiRequest(api.auth.forgotPassword.method, api.auth.forgotPassword.path, data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Reset link sent",
        description: "Check your email for instructions to reset your password.",
      });
      setLocation("/login");
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Request failed",
        description: error.message || "Failed to send reset link.",
      });
    },
  });

  return {
    user,
    isLoading: isUserLoading,
    error: userError,
    loginMutation,
    registerMutation,
    logoutMutation,
    forgotPasswordMutation,
    isAuthenticated: !!user,
  };
}

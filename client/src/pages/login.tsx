import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Store, Loader2 } from "lucide-react";
import { loginSchema, type LoginData } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export default function Login() {
  const { loginMutation } = useAuth();
  
  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginData) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent/30 blur-[100px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sm:mx-auto sm:w-full sm:max-w-md relative z-10"
      >
        <Link href="/" className="flex justify-center items-center gap-2 mb-6 group cursor-pointer">
          <div className="bg-primary/10 p-3 rounded-2xl group-hover:bg-primary/20 transition-colors">
            <Store className="h-8 w-8 text-primary" />
          </div>
          <span className="font-display font-bold text-3xl text-foreground">ArtisanMarket</span>
        </Link>
        <h2 className="mt-2 text-center text-3xl font-display font-bold tracking-tight text-foreground">
          Welcome back
        </h2>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link href="/register" className="font-semibold text-primary hover:underline transition-all">
            Sign up
          </Link>
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10"
      >
        <div className="bg-card py-10 px-4 shadow-2xl shadow-black/5 sm:rounded-3xl sm:px-10 border border-border/50 backdrop-blur-sm">
          
          {/* Google OAuth Placeholder Button */}
          <Button variant="outline" className="w-full py-6 mb-6 font-semibold text-foreground bg-background hover:bg-secondary/50 border-2 rounded-xl transition-all">
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M23.52 12.273c0-.85-.076-1.667-.218-2.455H12v4.64h6.455c-.278 1.5-1.124 2.774-2.395 3.626v3.016h3.876c2.268-2.086 3.584-5.163 3.584-8.827Z" fill="#4285F4"/><path d="M12 24c3.24 0 5.956-1.075 7.942-2.91l-3.876-3.015c-1.075.72-2.45 1.146-4.066 1.146-3.128 0-5.78-2.113-6.726-4.954H1.272v3.12A11.968 11.968 0 0 0 12 24Z" fill="#34A853"/><path d="M5.274 14.267A7.195 7.195 0 0 1 4.908 12c0-.79.142-1.558.366-2.267V6.613H1.272A11.967 11.967 0 0 0 0 12c0 1.93.46 3.754 1.272 5.387l4.002-3.12Z" fill="#FBBC05"/><path d="M12 4.755c1.76 0 3.344.605 4.587 1.79L19.7 3.43C17.712 1.573 15.24 0 12 0 7.395 0 3.195 2.684 1.272 6.613l4.002 3.12c.946-2.84 3.598-4.978 6.726-4.978Z" fill="#EA4335"/></svg>
            Continue with Google
          </Button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-card px-4 text-muted-foreground font-medium">Or continue with email</span>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-foreground">Email address</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="you@example.com" 
                        {...field} 
                        className="py-6 rounded-xl bg-background border-2 focus-visible:ring-primary/20 transition-all"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel className="font-semibold text-foreground">Password</FormLabel>
                      <Link href="/forgot-password" className="text-sm font-semibold text-primary hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        {...field} 
                        className="py-6 rounded-xl bg-background border-2 focus-visible:ring-primary/20 transition-all"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full py-6 rounded-xl text-lg shadow-lg shadow-primary/25 hover:-translate-y-0.5 transition-all mt-6"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Signing in...
                  </>
                ) : "Sign in"}
              </Button>
            </form>
          </Form>
        </div>
      </motion.div>
    </div>
  );
}

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Store, Loader2, Info } from "lucide-react";
import { registerSchema, type RegisterData } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export default function Register() {
  const { registerMutation } = useAuth();
  
  const form = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      displayName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: RegisterData) => {
    registerMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent/30 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[100px] pointer-events-none" />

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
          Create an account
        </h2>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-primary hover:underline transition-all">
            Sign in
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
          
          <Alert className="mb-6 bg-primary/5 border-primary/20 text-primary-foreground">
            <Info className="h-4 w-4 text-primary" />
            <AlertDescription className="text-foreground/80 ml-2">
              New accounts start as buyers. You can upgrade to a seller account in your dashboard later.
            </AlertDescription>
          </Alert>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="displayName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-foreground">Full Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Jane Doe" 
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-foreground">Email address</FormLabel>
                    <FormControl>
                      <Input 
                        type="email"
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
                    <FormLabel className="font-semibold text-foreground">Password</FormLabel>
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

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-foreground">Confirm Password</FormLabel>
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
                disabled={registerMutation.isPending}
              >
                {registerMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Creating account...
                  </>
                ) : "Create Account"}
              </Button>
            </form>
          </Form>
        </div>
      </motion.div>
    </div>
  );
}

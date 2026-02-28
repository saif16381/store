import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Store, Loader2, ArrowLeft } from "lucide-react";
import { forgotPasswordSchema, type ForgotPasswordData } from "@shared/schema";
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

export default function ForgotPassword() {
  const { forgotPasswordMutation } = useAuth();
  
  const form = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: ForgotPasswordData) => {
    forgotPasswordMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[100px] pointer-events-none" />

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
          Reset password
        </h2>
        <p className="mt-2 text-center text-sm text-muted-foreground px-4 text-balance">
          Enter the email address associated with your account and we'll send you a link to reset your password.
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10"
      >
        <div className="bg-card py-10 px-4 shadow-2xl shadow-black/5 sm:rounded-3xl sm:px-10 border border-border/50 backdrop-blur-sm">
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

              <Button 
                type="submit" 
                className="w-full py-6 rounded-xl text-lg shadow-lg shadow-primary/25 hover:-translate-y-0.5 transition-all"
                disabled={forgotPasswordMutation.isPending}
              >
                {forgotPasswordMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Sending link...
                  </>
                ) : "Send Reset Link"}
              </Button>
            </form>
          </Form>

          <div className="mt-8 text-center">
            <Link href="/login" className="inline-flex items-center text-sm font-semibold text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to sign in
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

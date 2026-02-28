import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertStoreSchema } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useStore } from "../use-store";
import { motion, AnimatePresence } from "framer-motion";

const categories = ["Fashion", "Electronics", "Home & Garden", "Art & Crafts", "Food & Beverages", "Beauty", "Sports", "Books", "Other"];

export default function BecomeSellerForm() {
  const [step, setStep] = useState(1);
  const { createStoreMutation } = useStore();
  
  const form = useForm({
    resolver: zodResolver(insertStoreSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      category: "",
      logo: "https://via.placeholder.com/150",
      banner: "",
    }
  });

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const onSubmit = (data: any) => {
    createStoreMutation.mutate(data);
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Become a Seller</CardTitle>
        <CardDescription>Step {step} of 3</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Store Name</FormLabel>
                        <FormControl><Input {...field} placeholder="My Awesome Shop" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Store URL Slug</FormLabel>
                        <FormControl><Input {...field} placeholder="my-awesome-shop" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="button" onClick={nextStep} className="w-full">Next</Button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl><Textarea {...field} placeholder="Tell us about your shop..." /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" onClick={prevStep} className="flex-1">Back</Button>
                    <Button type="button" onClick={nextStep} className="flex-1">Next</Button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="p-4 border rounded-md bg-muted/50">
                    <h3 className="font-bold">{form.getValues("name")}</h3>
                    <p className="text-sm text-muted-foreground">{form.getValues("description")}</p>
                    <p className="text-xs mt-2">Category: {form.getValues("category")}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" onClick={prevStep} className="flex-1">Back</Button>
                    <Button type="submit" className="flex-1" disabled={createStoreMutation.isPending}>
                      {createStoreMutation.isPending ? "Creating..." : "Confirm & Create"}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

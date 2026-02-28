import { useQuery, useMutation } from "@tanstack/react-query";
import { Review, insertReviewSchema } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

export function ProductReviews({ productId }: { productId: number }) {
  const { user } = useAuth();
  const { data: reviews, isLoading } = useQuery<Review[]>({
    queryKey: ["/api/products", productId, "reviews"],
  });

  const mutation = useMutation({
    mutationFn: async (values: any) => {
      return apiRequest("POST", `/api/products/${productId}/reviews`, values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products", productId, "reviews"] });
    },
  });

  const form = useForm({
    resolver: zodResolver(insertReviewSchema.extend({ rating: z.number().min(1).max(5) })),
    defaultValues: { rating: 5, comment: "" },
  });

  if (isLoading) return <div>Loading reviews...</div>;

  return (
    <div className="space-y-8 mt-12">
      <h2 className="text-2xl font-bold">Customer Reviews</h2>
      
      {user && (
        <Card>
          <CardHeader><CardTitle>Write a Review</CardTitle></CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button key={s} type="button" onClick={() => form.setValue("rating", s)}>
                      <Star className={`h-6 w-6 ${form.watch("rating") >= s ? "fill-primary text-primary" : "text-muted"}`} />
                    </button>
                  ))}
                </div>
                <FormField control={form.control} name="comment" render={({ field }) => (
                  <FormItem><FormControl><Textarea {...field} placeholder="Share your thoughts..." /></FormControl><FormMessage /></FormItem>
                )} />
                <Button type="submit" disabled={mutation.isPending}>Submit Review</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {reviews?.map((review) => (
          <Card key={review.id}>
            <CardContent className="pt-6">
              <div className="flex justify-between mb-2">
                <span className="font-semibold">{review.userName}</span>
                <span className="text-sm text-muted-foreground">{format(new Date(review.createdAt!), "MMM d, yyyy")}</span>
              </div>
              <div className="flex gap-1 mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < review.rating ? "fill-primary text-primary" : "text-muted"}`} />
                ))}
              </div>
              <p className="text-muted-foreground">{review.comment}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  RatingBody,
  RatingBodyType,
  RatingResponseType,
  RatingType,
} from "@/schemaValidations/rating.schema";
import ratingApiRequest from "@/apiRequest/rating";

import { Star } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
interface AddRatingButtonProps {
  eventId: string;
  onSuccess?: () => void; // callback để refresh list nếu cần
}

export default function AddRatingButton({
  eventId,
  onSuccess,
}: AddRatingButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [rating, setRating] = useState<RatingType | null>(null);
  const form = useForm<RatingBodyType>({
    resolver: zodResolver(RatingBody),
    defaultValues: {
      rating: 0,
      comment: "",
      eventClubId: eventId,
    },
  });
  useEffect(() => {
    async function fetchRating() {
      try {
        const res = await ratingApiRequest.getOwnRating(eventId); // API trả 1 rating
        const data = res.payload.data;
        setRating(data);

        if (data) {
          form.reset({
            rating: data.rating,
            comment: data.comment,
            eventClubId: eventId,
          });
        }
        console.log("Rating: ", res.payload.data);
      } catch (error) {
        console.error("Lỗi fetch rating:", error);
      }
    }
    fetchRating();
  }, [eventId, form, open]);

  async function onSubmit(values: RatingBodyType) {
    try {
      setLoading(true);
      await ratingApiRequest.postRating(values);
      toast.success("Đã thêm đánh giá!");
      setOpen(false);
      form.reset({ rating: 0, comment: "", eventClubId: eventId });
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Thêm đánh giá thất bại");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">+ Thêm đánh giá</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Thêm đánh giá</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Rating chọn sao */}
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chọn số sao</FormLabel>
                  <FormControl>
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-7 h-7 cursor-pointer transition ${
                            i < field.value
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300 dark:text-gray-600"
                          }`}
                          onClick={() => field.onChange(i + 1)}
                        />
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Comment */}
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nhận xét</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Viết cảm nhận của bạn..."
                      className="resize-none"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Đang gửi..." : "Gửi đánh giá"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

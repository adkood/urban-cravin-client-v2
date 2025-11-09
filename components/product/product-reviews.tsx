"use client"

import { useEffect, useState, useTransition } from "react"
import { Star, ThumbsUp, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  getProductReviews,
  addProductReview,
  toggleReviewLike,
  deleteProductReview,
  type Review,
} from "@/data/review"
import { Skeleton } from "@/components/ui/skeleton"
import { UserDetails } from "../cards/user-profile"
import { GET_USER_DETAILSURL } from "@/lib/urls"
import useSWR from "swr"
import { fetcher } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { redirect } from "next/navigation"

export default function ProductReviews({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [sortBy, setSortBy] = useState("recent")
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [formData, setFormData] = useState({ rating: 0, comment: "" })
  const { data, error : userError, isLoading : userLoading } = useSWR<UserDetails>(GET_USER_DETAILSURL, fetcher(),{
    revalidateOnFocus: false,
    shouldRetryOnError: false, 
  });
  const user = data?.user;


  useEffect(() => {
    async function fetchReviews() {
      setLoading(true)

      const res = await getProductReviews(productId, page)
      if (res.success) {
        setReviews(res.data.reviewsData.reviews)
        setTotalPages(res.data.totalPages)
      } else {
        console.error("Failed to fetch reviews:", res.error)
      }
      setLoading(false)
    }
    fetchReviews()
  }, [productId, page])

  const handleToggleLike = (reviewId: string) => {
    startTransition(async () => {
      // Optimistic UI
      setReviews((prev) =>
        prev.map((r) =>
          r.id === reviewId
            ? {
                ...r,
                hasLiked: !r.hasLiked,
                likeCount: r.hasLiked ? r.likeCount - 1 : r.likeCount + 1,
              }
            : r
        )
      )

      const res = await toggleReviewLike(reviewId)
      if (!res.success) {
        // Rollback if failed
        setReviews((prev) =>
          prev.map((r) =>
            r.id === reviewId
              ? {
                  ...r,
                  hasLiked: !r.hasLiked,
                  likeCount: r.hasLiked ? r.likeCount - 1 : r.likeCount + 1,
                }
              : r
          )
        )
        if(res.error.includes("401")) {
          redirect("/login")
        }
        console.error("Failed to toggle like:", res.error)
      }
    })
  }

  const handleDeleteReview = (reviewId: string) => {
    startTransition(async () => {
      const res = await deleteProductReview(reviewId)
      if (res.success) {
        setReviews((prev) => prev.filter((r) => r.id !== reviewId))
      } else {

        if(res.error.includes("401")) {
          redirect("/login")
        }
        console.error("Failed to delete review:", res.error)

      }
    })
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.rating || !formData.comment) return
    startTransition(async () => {
      const res = await addProductReview({
        productId,
        rating: formData.rating,
        comment: formData.comment,
      })
      if (res.success) {
        setReviews((prev) => [res.data.review,...prev])
        setFormData({ rating: 0, comment: "" })
        setShowReviewForm(false)
      } else {
        console.error("Error submitting review:", res.error)
      }
    })
  }

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(2)
      : "0.0"

  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortBy) {
      case "highest":
        return b.rating - a.rating
      case "lowest":
        return a.rating - b.rating
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
  })

  // 🔹 Shimmer Loading Skeleton
  if (loading) {
    return (
      <section className="border-t border-border py-8 sm:py-12">
        <div className="container mx-auto px-4 max-w-[90%] space-y-6 sm:space-y-8">
          <Skeleton className="h-8 sm:h-10 w-2/3 sm:w-1/3 mx-auto" />
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-3 border border-border rounded-lg p-4 sm:p-6">
              <Skeleton className="h-4 sm:h-5 w-1/4" />
              <Skeleton className="h-3 sm:h-4 w-full" />
              <Skeleton className="h-3 sm:h-4 w-3/4" />
            </div>
          ))}
        </div>
      </section>
    )
  }

  return (
    <section className="border-t border-border py-8 sm:py-12">
      <div className="container mx-auto px-4 max-w-[90%]">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Customer Reviews</h2>

        {/* Summary */}
        <div className="bg-muted/50 rounded-lg p-4 sm:p-6 md:p-8 mb-8 sm:mb-12 flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6">
          <div className="text-center md:text-left">
            <div className="flex items-center gap-2 sm:gap-3 justify-center md:justify-start mb-2">
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold">{averageRating}</div>
              <div className="flex flex-col">
                <div className="flex gap-0.5 sm:gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">out of 5</p>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Based on {reviews.length} reviews
            </p>
          </div>

          <Button
            onClick={() => setShowReviewForm(true)}
            className="bg-foreground text-background hover:bg-foreground/90 w-full md:w-auto px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base font-semibold"
          >
            Write a Review
          </Button>
        </div>

        {
          reviews.length > 0 &&
          <div className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
            <h3 className="text-base sm:text-lg font-semibold">All Reviews</h3>
            <Select value={sortBy} onValueChange={setSortBy} >
              <SelectTrigger className="w-full sm:w-[180px] border-border focus:ring-primary focus:ring-2">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="highest">Highest Rating</SelectItem>
                <SelectItem value="lowest">Lowest Rating</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {sortedReviews.map((review) => (
            <div
              key={review.id}
              className="border border-border rounded-lg p-4 sm:p-6 hover:bg-muted/30 transition"
            >
              <div className="flex flex-col sm:flex-row items-start justify-between mb-3 sm:mb-4 gap-2 sm:gap-0">
                <div className="w-full sm:w-auto">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex gap-0.5 sm:gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 sm:w-4 sm:h-4 ${
                            i < review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm sm:text-base text-muted-foreground mb-2 break-words">{review.comment}</p>
                  <span className="text-xs sm:text-sm text-muted-foreground">
                    by {review.userName}
                  </span>
                </div>
                <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center gap-3 sm:gap-4 justify-end">
                <button
                  disabled={isPending}
                  onClick={() => handleToggleLike(review.id)}
                  className={`flex items-center gap-1 text-xs sm:text-sm ${
                    review.hasLiked
                      ? "text-blue-600"
                      : "text-muted-foreground hover:text-foreground"
                  } transition`}
                >
                  <ThumbsUp className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>{review.likeCount}</span>
                </button>

                {
                  !userLoading && !userError && review.userName == user?.username && 
                  <button
                    disabled={isPending}
                    onClick={() => handleDeleteReview(review.id)}
                    className="text-muted-foreground hover:text-red-500 transition flex items-center gap-1 text-xs sm:text-sm"
                  >
                    <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Delete</span>
                  </button>
                }
              </div>
            </div>
          ))}

          {/* Pagination */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 mt-6 sm:mt-8">
            <Button
              variant="outline"
              disabled={page <= 0}
              onClick={() => setPage((p) => p - 1)}
              className="text-xs sm:text-sm px-3 sm:px-4"
            >
              Previous
            </Button>
            <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
              Page {page + 1} of {totalPages}
            </span>
            <Button
              variant="outline"
              disabled={page + 1 >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="text-xs sm:text-sm px-3 sm:px-4"
            >
              Next
            </Button>
          </div>
          </div>
        }
      </div>

      {/* Review Dialog */}
      <Dialog open={showReviewForm} onOpenChange={setShowReviewForm}>
        <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Share Your Experience</DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Help other customers by sharing your review
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitReview} className="space-y-4 sm:space-y-6 py-4">
            <div>
              <label className="block text-sm font-semibold mb-2 sm:mb-3">Rating</label>
              <div className="flex gap-1 sm:gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: star })}
                  >
                    <Star
                      className={`w-6 h-6 sm:w-8 sm:h-8 ${
                        star <= formData.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Review Content
              </label>
              <textarea
                value={formData.comment}
                onChange={(e) =>
                  setFormData({ ...formData, comment: e.target.value })
                }
                placeholder="Share your experience..."
                rows={5}
                className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4">
              <Button type="submit" disabled={isPending} className="flex-1 text-sm sm:text-base">
                Submit Review
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowReviewForm(false)}
                className="flex-1 text-sm sm:text-base"
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  )
}
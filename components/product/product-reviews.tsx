"use client"

import type React from "react"

import { useState } from "react"
import { Star, ThumbsUp, ThumbsDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface Review {
  id: string
  author: string
  rating: number
  title: string
  content: string
  date: string
  verified: boolean
  helpful: number
  unhelpful: number
  images?: string[]
}

const mockReviews: Review[] = [
  {
    id: "1",
    author: "Sarah M.",
    rating: 5,
    title: "Absolutely Love It!",
    content:
      "The quality is amazing! The fabric is so soft and comfortable. The design is exactly as shown in the pictures. Highly recommend!",
    date: "2025-10-20",
    verified: true,
    helpful: 24,
    unhelpful: 1,
  },
  {
    id: "2",
    author: "John D.",
    rating: 4,
    title: "Great Quality, Fast Delivery",
    content:
      "Fast delivery. Good quality fabric. Heavy weight. Nice fit. Only minor issue was the color was slightly different from the picture.",
    date: "2025-10-19",
    verified: true,
    helpful: 18,
    unhelpful: 0,
  },
  {
    id: "3",
    author: "Emma L.",
    rating: 5,
    title: "Perfect Fit and Design",
    content:
      "This is my third purchase from this brand. The consistency in quality is impressive. The design is unique and the fit is perfect.",
    date: "2025-10-18",
    verified: true,
    helpful: 32,
    unhelpful: 2,
  },
  {
    id: "4",
    author: "Alex K.",
    rating: 4,
    title: "Good Value for Money",
    content:
      "Good quality for the price. Comfortable to wear. The only thing is the sizing runs a bit small, so I'd recommend going up a size.",
    date: "2025-10-17",
    verified: true,
    helpful: 15,
    unhelpful: 1,
  },
  {
    id: "5",
    author: "Priya S.",
    rating: 5,
    title: "Exceeded Expectations",
    content:
      "I was skeptical about ordering online, but this product exceeded my expectations. The quality, fit, and design are all top-notch!",
    date: "2025-10-16",
    verified: true,
    helpful: 28,
    unhelpful: 0,
  },
]

export default function ProductReviews() {
  const [reviews, setReviews] = useState<Review[]>(mockReviews)
  const [sortBy, setSortBy] = useState("recent")
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [formData, setFormData] = useState({
    rating: 0,
    title: "",
    content: "",
    author: "",
    email: "",
  })

  const averageRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(2)
  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((r) => r.rating === rating).length,
    percentage: Math.round((reviews.filter((r) => r.rating === rating).length / reviews.length) * 100),
  }))

  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortBy) {
      case "highest":
        return b.rating - a.rating
      case "lowest":
        return a.rating - b.rating
      case "helpful":
        return b.helpful - a.helpful
      default:
        return new Date(b.date).getTime() - new Date(a.date).getTime()
    }
  })

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.rating && formData.title && formData.content && formData.author && formData.email) {
      const newReview: Review = {
        id: Date.now().toString(),
        author: formData.author,
        rating: formData.rating,
        title: formData.title,
        content: formData.content,
        date: new Date().toISOString().split("T")[0],
        verified: false,
        helpful: 0,
        unhelpful: 0,
      }
      setReviews([newReview, ...reviews])
      setFormData({ rating: 0, title: "", content: "", author: "", email: "" })
      setShowReviewForm(false)
    }
  }

  return (
    <section className="border-t border-border py-12">
      <div className="container mx-auto px-4 max-w-[90%]">
        <h2 className="text-3xl font-bold mb-8">Customer Reviews</h2>

        <div className="bg-muted/50 rounded-lg p-6 md:p-8 mb-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Left: Rating Summary */}
            <div className="text-center md:text-left flex-shrink-0">
              <div className="flex items-center gap-3 justify-center md:justify-start mb-2">
                <div className="text-4xl md:text-5xl font-bold">{averageRating}</div>
                <div className="flex flex-col">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">out of 5</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Based on {reviews.length} reviews</p>
            </div>

            {/* Middle: Rating Distribution */}
            <div className="flex-1 w-full md:w-auto">
              <div className="space-y-2">
                {ratingDistribution.map(({ rating, count, percentage }) => (
                  <div key={rating} className="flex items-center gap-3">
                    <div className="flex gap-0.5 w-16">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="flex-1 h-2 bg-border rounded-full overflow-hidden min-w-32">
                      <div className="h-full bg-gray-700 transition-all" style={{ width: `${percentage}%` }} />
                    </div>
                    <span className="text-xs text-muted-foreground w-10 text-right">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Write Review Button */}
            <Button
              onClick={() => setShowReviewForm(true)}
              className="w-full md:w-auto md:flex-shrink-0 bg-foreground text-background hover:bg-foreground/90 px-8 py-6 text-base font-semibold"
            >
              Write a Review
            </Button>
          </div>
        </div>

        {/* Sort and Reviews */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">All Reviews</h3>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="recent">Most Recent</option>
              <option value="highest">Highest Rating</option>
              <option value="lowest">Lowest Rating</option>
              <option value="helpful">Most Helpful</option>
            </select>
          </div>

          {/* Review Cards */}
          <div className="space-y-4">
            {sortedReviews.map((review) => (
              <div key={review.id} className="border border-border rounded-lg p-6 hover:bg-muted/30 transition">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                            }`}
                          />
                        ))}
                      </div>
                      {review.verified && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Verified Purchase</span>
                      )}
                    </div>
                    <h4 className="font-semibold text-base">{review.title}</h4>
                  </div>
                  <span className="text-sm text-muted-foreground">{review.date}</span>
                </div>

                <p className="text-muted-foreground mb-4">{review.content}</p>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">by {review.author}</span>
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition">
                      <ThumbsUp className="w-4 h-4" />
                      <span>{review.helpful}</span>
                    </button>
                    <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition">
                      <ThumbsDown className="w-4 h-4" />
                      <span>{review.unhelpful}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center pt-6">
            <Button variant="outline" className="w-full md:w-auto bg-transparent">
              Load More Reviews
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={showReviewForm} onOpenChange={setShowReviewForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Share Your Experience</DialogTitle>
            <DialogDescription>Help other customers by sharing your honest review about this product</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitReview} className="space-y-6 py-4">
            {/* Rating */}
            <div>
              <label className="block text-sm font-semibold mb-3">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: star })}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= formData.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-semibold mb-2">Review Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Give your review a title"
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-semibold mb-2">Review Content</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Share your experience with this product..."
                rows={5}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>

            {/* Author */}
            <div>
              <label className="block text-sm font-semibold mb-2">Display Name</label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                placeholder="Your name"
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold mb-2">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your@email.com"
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1">
                Submit Review
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowReviewForm(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  )
}

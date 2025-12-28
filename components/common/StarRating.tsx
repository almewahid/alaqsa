"use client"

import { Star } from "lucide-react"

interface StarRatingProps {
  rating: number
  size?: number
}

export default function StarRating({ rating, size = 16 }: StarRatingProps) {
  return (
    <div className="flex">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`w-${size/4} h-${size/4} ${
            i < Math.floor(rating)
              ? "fill-yellow-400 text-yellow-400"
              : i < rating
              ? "fill-yellow-200 text-yellow-400"
              : "text-gray-300"
          }`}
        />
      ))}
    </div>
  )
}

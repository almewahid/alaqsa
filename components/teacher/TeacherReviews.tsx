// components/teacher/TeacherReviews.tsx
import React from "react"
import { TeacherData } from "../types"
import StarRating from "../common/StarRating"

interface TeacherReviewsProps {
  teacher: TeacherData
}

export default function TeacherReviews({ teacher }: TeacherReviewsProps) {
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">
        آراء الطلاب ({teacher.totalReviews})
      </h2>

      <div className="mb-6">
        <StarRating rating={teacher.rating} />
        <p className="text-gray-600 text-sm">
          التقييم الكلي: {teacher.rating} من 5
        </p>
      </div>

      <div className="space-y-4">
        {teacher.reviews.map((rev, index) => (
          <div
            key={index}
            className="border rounded-lg p-3 shadow-sm bg-white"
          >
            <div className="flex justify-between items-center mb-2">
              <p className="font-medium">{rev.studentName}</p>
              <StarRating rating={rev.rating} />
            </div>
            <p className="text-gray-700">{rev.comment}</p>
            <p className="text-gray-400 text-sm mt-1">{rev.date}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

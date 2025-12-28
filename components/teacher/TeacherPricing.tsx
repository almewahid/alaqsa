// components/teacher/TeacherPricing.tsx
import React from "react"
import { TeacherData } from "../types"

interface TeacherPricingProps {
  teacher: TeacherData
}

export default function TeacherPricing({ teacher }: TeacherPricingProps) {
  const { pricing, discounts } = teacher

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">خطط الأسعار</h2>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="border rounded-lg p-4 shadow-sm bg-white">
          <h3 className="font-medium mb-2">حصة واحدة</h3>
          <p className="text-lg font-bold text-blue-700">
            {pricing.singleSession} جنيه
          </p>
        </div>

        <div className="border rounded-lg p-4 shadow-sm bg-white">
          <h3 className="font-medium mb-2">8 حصص</h3>
          <p className="text-lg font-bold text-blue-700">
            {pricing.eightSessions} جنيه
          </p>
        </div>

        <div className="border rounded-lg p-4 shadow-sm bg-white">
          <h3 className="font-medium mb-2">12 حصة</h3>
          <p className="text-lg font-bold text-blue-700">
            {pricing.twelveSessions} جنيه
          </p>
        </div>
      </div>

      {discounts?.enabled && (
        <div className="mt-6 p-3 bg-green-100 border border-green-300 rounded-lg text-green-700">
          <p className="font-medium">
            🎉 خصم {discounts.percentage}%{" "}
            {discounts.type === "all" ? "على جميع الباقات" : "على باقات محددة"}
          </p>
        </div>
      )}
    </div>
  )
}

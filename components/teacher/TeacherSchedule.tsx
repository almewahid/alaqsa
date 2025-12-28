// components/teacher/TeacherSchedule.tsx
import React from "react"
import { TeacherData } from "../types"

interface TeacherScheduleProps {
  teacher: TeacherData
}

export default function TeacherSchedule({ teacher }: TeacherScheduleProps) {
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">جدول المواعيد المتاحة</h2>
      <div className="space-y-3">
        {teacher.availableTimes.map((slot, index) => (
          <div
            key={index}
            className="border rounded-lg p-3 shadow-sm bg-white"
          >
            <h3 className="font-medium text-lg">{slot.day}</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {slot.times.map((time, tIndex) => (
                <span
                  key={tIndex}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                >
                  {time}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-medium">العطلات</h3>
        <ul className="list-disc list-inside text-gray-600">
          {teacher.holidays.map((holiday, index) => (
            <li key={index}>{holiday}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

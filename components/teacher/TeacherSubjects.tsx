// components/teacher/TeacherSubjects.tsx
import React from "react"
import { TeacherData } from "../types"

interface TeacherSubjectsProps {
  teacher: TeacherData
}

export default function TeacherSubjects({ teacher }: TeacherSubjectsProps) {
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">المواد والمناهج</h2>

      <div className="mb-4">
        <h3 className="font-medium">المواد</h3>
        <div className="flex flex-wrap gap-2 mt-2">
          {teacher.subjects.map((subj, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
            >
              {subj}
            </span>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h3 className="font-medium">الصفوف</h3>
        <div className="flex flex-wrap gap-2 mt-2">
          {teacher.grades.map((grade, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
            >
              {grade}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-medium">المناهج</h3>
        <div className="flex flex-wrap gap-2 mt-2">
          {teacher.curricula.map((curr, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm"
            >
              {curr}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

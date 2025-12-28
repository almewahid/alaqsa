// components/teacher/TeacherExperience.tsx
import React from "react"
import { TeacherData } from "../types"

interface TeacherExperienceProps {
  teacher: TeacherData
}

export default function TeacherExperience({ teacher }: TeacherExperienceProps) {
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">الخبرات والمؤهلات</h2>
      <ul className="space-y-3">
        {teacher.experiences.map((exp, index) => (
          <li
            key={index}
            className="border-b pb-2 last:border-0"
          >
            <p className="font-medium">{exp.title}</p>
            <p className="text-gray-600 text-sm">
              {exp.institution} - {exp.year}
            </p>
            <span className="text-xs px-2 py-1 bg-gray-200 rounded">
              {exp.type}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

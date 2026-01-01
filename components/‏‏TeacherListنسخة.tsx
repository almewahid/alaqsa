"use client"

import { useState } from "react"
import TeacherCardShort, { Teacher } from "./TeacherCardShort"

interface TeacherListProps {
  teachers: Teacher[]
  searchTerm?: string
  setFilterSubject?: (subject: string) => void
  uniqueSubjects?: string[]
}

// أيقونة القرآن SVG
const QuranIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H19C20.1046 22 21 21.1046 21 20V4C21 2.89543 20.1046 2 19 2Z" fill="#059669" stroke="#047857" strokeWidth="1.5"/>
    <path d="M8 6H17" stroke="#10B981" strokeWidth="1" strokeLinecap="round"/>
    <path d="M8 10H17" stroke="#10B981" strokeWidth="1" strokeLinecap="round"/>
    <path d="M8 14H17" stroke="#10B981" strokeWidth="1" strokeLinecap="round"/>
    <circle cx="12.5" cy="11" r="4" fill="#34D399" opacity="0.3"/>
    <path d="M12.5 8C13.3284 8 14 8.67157 14 9.5C14 10.3284 13.3284 11 12.5 11C11.6716 11 11 10.3284 11 9.5C11 8.67157 11.6716 8 12.5 8Z" fill="#FCD34D"/>
  </svg>
)

export default function TeacherList({ 
  teachers, 
  searchTerm = "", 
  setFilterSubject,
  uniqueSubjects = []
}: TeacherListProps) {
  const [showAllSubjects, setShowAllSubjects] = useState(false)
  const [localFilterSubject, setLocalFilterSubject] = useState<string>("")

  // أيقونات المواد
  const subjectIcons: Record<string, { icon: string, color: string }> = {
    "الرياضيات": { icon: "📐", color: "blue" },
    "رياضيات": { icon: "📐", color: "blue" },
    "الفيزياء": { icon: "⚛️", color: "green" },
    "فيزياء": { icon: "⚛️", color: "green" },
    "الكيمياء": { icon: "🧪", color: "purple" },
    "كيمياء": { icon: "🧪", color: "purple" },
    "اللغة الإنجليزية": { icon: "🌐", color: "yellow" },
    "لغة إنجليزية": { icon: "🌐", color: "yellow" },
    "اللغة العربية": { icon: "📖", color: "red" },
    "لغة عربية": { icon: "📖", color: "red" },
    "القرآن الكريم": { icon: "📗", color: "teal" },
    "قرآن كريم": { icon: "📗", color: "teal" },
    "SCIENCE": { icon: "🔬", color: "cyan" },
  }

  // استخدام uniqueSubjects أو استخراجها من المدرسين
  const displaySubjects = uniqueSubjects.length > 0 
    ? uniqueSubjects 
    : Array.from(new Set(teachers.map(t => t.subject))).sort()

  const handleSubjectClick = (subject: string) => {
    if (setFilterSubject) {
      // استخدام الفلتر من الـ parent
      setFilterSubject(localFilterSubject === subject ? "" : subject)
      setLocalFilterSubject(localFilterSubject === subject ? "" : subject)
    } else {
      // استخدام الفلتر المحلي
      setLocalFilterSubject(localFilterSubject === subject ? "" : subject)
    }
  }

  // تصفية المدرسين (محلياً إذا لم يوجد فلتر من الـ parent)
  const filteredTeachers = setFilterSubject 
    ? teachers  // الفلترة تتم في الـ parent
    : (localFilterSubject 
        ? teachers.filter((t) => t.subject === localFilterSubject)
        : teachers)

  return (
    <div className="space-y-6">
      {/* المواد الدراسية كفلتر */}
      <div className="bg-white rounded-xl shadow-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">المواد الدراسية</h2>
          {localFilterSubject && (
            <button
              onClick={() => {
                setLocalFilterSubject("")
                if (setFilterSubject) setFilterSubject("")
              }}
              className="text-sm bg-red-100 text-red-700 px-3 py-1 rounded-full hover:bg-red-200"
            >
              ✕ إعادة تعيين
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
          {(showAllSubjects ? displaySubjects : displaySubjects.slice(0, 7)).map((subject, idx) => {
            const subjectData = subjectIcons[subject] || { icon: "📘", color: "gray" }
            const isQuran = subject.includes("قرآن") || subject.includes("القرآن")
            
            return (
              <button
                key={idx}
                onClick={() => handleSubjectClick(subject)}
                className={`flex flex-col items-center justify-center rounded-lg p-3 border transition ${
                  localFilterSubject === subject
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200"
                }`}
              >
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 ${
                    localFilterSubject === subject ? "bg-white/20" : `bg-${subjectData.color}-100`
                  }`}
                >
                  {isQuran ? (
                    <QuranIcon className={localFilterSubject === subject ? "brightness-0 invert w-8 h-8" : "w-8 h-8"} />
                  ) : (
                    <span className={`text-2xl ${
                      localFilterSubject === subject ? "brightness-0 invert" : ""
                    }`}>
                      {subjectData.icon}
                    </span>
                  )}
                </div>
                <p className="text-sm font-medium text-center leading-tight">{subject}</p>
              </button>
            )
          })}
        </div>

        {displaySubjects.length > 7 && (
          <div className="text-center mt-3">
            <button
              onClick={() => setShowAllSubjects(!showAllSubjects)}
              className="text-blue-600 text-sm"
            >
              {showAllSubjects ? "عرض أقل ⬆️" : "عرض المزيد ⬇️"}
            </button>
          </div>
        )}
      </div>

      {/* عداد النتائج */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold">
          عرض {filteredTeachers.length} مدرس{filteredTeachers.length > 1 || filteredTeachers.length === 0 ? "ين" : ""}
        </h2>
      </div>

      {/* بطاقات المعلمين */}
      {filteredTeachers.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <p className="text-gray-600 text-lg">لا يوجد مدرسين لهذه المادة</p>
          <button
            onClick={() => {
              setLocalFilterSubject("")
              if (setFilterSubject) setFilterSubject("")
            }}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            عرض جميع المدرسين
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTeachers.map((teacher) => (
            <TeacherCardShort key={teacher.id} teacher={teacher} />
          ))}
        </div>
      )}
    </div>
  )
}
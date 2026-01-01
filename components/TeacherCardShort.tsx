"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export interface Teacher {
  id: string
  name: string
  subject: string
  curriculum: string
  stage: string
  rating: string  // ✅ تم التغيير من number إلى string
  reviews?: number
  price: string   // ✅ تم التغيير من number إلى string
  students: number
  lessons: number
  bio: string
  gradient?: string
  avatarColor?: string
  lessonType: "online" | "home" | "both"
  discount?: string | null
  featured?: boolean
}

interface TeacherCardShortProps {
  teacher: Teacher
}

export default function TeacherCardShort({ teacher }: TeacherCardShortProps) {
  const router = useRouter()
  const [isFavorite, setIsFavorite] = useState(false)

  const handleFavorite = () => setIsFavorite(!isFavorite)
  const handleViewProfile = () => router.push(`/teacher/${teacher.id}`)
  const handleBookNow = () => router.push(`/booking`)
  const handleShare = () => {
    navigator.clipboard.writeText(`${window.location.origin}/teacher/${teacher.id}`)
    alert(`تم نسخ رابط ملف المدرس ${teacher.name} ✅`)
  }

  // أيقونات المواد
  const subjectIcons: Record<string, string> = {
    الرياضيات: "📐",
    رياضيات: "📐",
    الفيزياء: "⚛️",
    فيزياء: "⚛️",
    الكيمياء: "🧪",
    كيمياء: "🧪",
    "اللغة العربية": "📖",
    "لغة عربية": "📖",
    "اللغة الإنجليزية": "🔤",
    "لغة إنجليزية": "🔤",
    "القرآن الكريم": "📕",
    "قرآن كريم": "📕",
    SCIENCE: "🔬",
    MATH: "📐",
  }
  const subjectIcon = subjectIcons[teacher.subject] || "📘"

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 flex flex-col transition hover:shadow-2xl">
      <div className="grid grid-cols-3 gap-4 items-start">
        {/* العمود ١: المستطيل الملون + المادة + الأيقونة + الشارات */}
        <div
          className={`relative flex flex-col items-center justify-between rounded-xl p-3 min-h-[180px] bg-gradient-to-r ${teacher.gradient} col-span-1`}
        >
          {/* شارات أونلاين/منازل + مميز - بجانب بعض أعلى يمين */}
          <div className="absolute top-1 right-1 flex gap-1">
            {(teacher.lessonType === "online" || teacher.lessonType === "both") && (
              <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 text-[10px] rounded font-semibold">أونلاين</span>
            )}
            {(teacher.lessonType === "home" || teacher.lessonType === "both") && (
              <span className="bg-green-100 text-green-700 px-1.5 py-0.5 text-[10px] rounded font-semibold">منزلي</span>
            )}
            {teacher.featured && (
              <span className="bg-yellow-400 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">⭐</span>
            )}
          </div>

          {/* اسم المعلم - متعدد الأسطر */}
          <h2 className="text-base font-bold text-white text-center w-full px-2 mt-7 leading-tight line-clamp-3">
            {teacher.name}
          </h2>

          {/* المادة + الأيقونة */}
          <div className="mt-auto flex items-center gap-1 bg-white/30 px-2 py-1 rounded-full shadow">
            <span className="text-lg">{subjectIcon}</span>
            <p className="text-black text-xs font-semibold">{teacher.subject}</p>
          </div>
        </div>

        {/* العمود ٢: النبذة + التعليقات */}
        <div className="flex flex-col justify-start">
          {/* النبذة */}
          <p className="text-gray-700 text-sm mb-2 line-clamp-3">{teacher.bio}</p>

          {/* تعليق الطلاب */}
          <div className="bg-gray-50 p-2 rounded-lg text-xs mb-3">
            <p className="text-yellow-500">⭐⭐⭐⭐⭐</p>
            <p className="text-gray-600 italic">"معلم ممتاز وشرح واضح"</p>
          </div>
        </div>

        {/* العمود ٣: التقييم + الأسعار + عدد الطلاب */}
        <div className="flex flex-col items-end gap-2 text-sm">

          {/* تقييم تفصيلي */}
          <div className="text-yellow-500 text-sm">
            ⭐ {teacher.rating}{" "}
            <span className="text-gray-500">({teacher.reviews || 0} تقييم)</span>
          </div>

          {/* الأسعار */}
          <p className="text-blue-700 font-bold">{teacher.price} د.ك / الحصة</p>
          <p className="text-gray-600">{(Number(teacher.price) * 4).toFixed(1)} د.ك / ٤ حصص</p>

          {/* الطلاب والحصص */}
          <p className="text-gray-700 text-sm">👥 {teacher.students} طالب</p>
          <p className="text-gray-700 text-sm">📅 {teacher.lessons} حصة</p>
        </div>
      </div>

      {/* الأزرار أسفل الأعمدة الثلاثة */}
      <div className="mt-4">
        {/* الصف الأول: المفضلة + مشاركة (رموز فقط) */}
        <div className="flex justify-end gap-3 mb-2">
          <button onClick={handleFavorite} className="text-xl">
            {isFavorite ? "❤️" : "🤍"}
          </button>
          <button onClick={handleShare} className="text-lg">
            🔗
          </button>
        </div>

        {/* الصف الثاني: الأزرار الثلاثة بجانب بعض */}
        <div className="flex gap-2">
          <button
            onClick={handleViewProfile}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-2 py-2 rounded-lg text-xs transition"
          >
            🔎 عرض الملف
          </button>
          <button
            onClick={() => router.push('/messages')}
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white px-2 py-2 rounded-lg text-xs transition"
          >
            💬 راسلني
          </button>
          <button
            onClick={handleBookNow}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white px-2 py-2 rounded-lg text-xs transition"
          >
            🗓️ احجز
          </button>
        </div>
      </div>
    </div>
  )
}
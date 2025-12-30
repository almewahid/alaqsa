"use client"

import { useState, useEffect } from "react"
import { Amiri } from "next/font/google"
import TeacherCard from "./TeacherCard"
import { getTeachers, Teacher } from "@/lib/api/teachers"

const amiri = Amiri({ subsets: ["arabic"], weight: ["400", "700"] })

export default function MyTeacher() {
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadTeachers() {
      try {
        setLoading(true)
        const data = await getTeachers()
        setTeachers(data)
      } catch (err) {
        console.error('Error loading teachers:', err)
        setError('حدث خطأ في تحميل المدرسين')
      } finally {
        setLoading(false)
      }
    }

    loadTeachers()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
          <p className="text-gray-600">جاري تحميل المدرسين...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-xl">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    )
  }

  if (teachers.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-xl">لا يوجد مدرسين متاحين حالياً</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <style jsx global>{`
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }
        .animate-gradient { background-size: 200% 200%; animation: gradientMove 6s linear infinite; }
        @keyframes waveMove {
          0% { transform: translateX(0); }
          100% { transform: translateX(-20px); }
        }
        .animate-wave { animation: waveMove 2s linear infinite alternate; }
        .perspective-sm { perspective: 500px; }
        .rotate-y-180 { transform: rotateY(180deg); }
        .backface-hidden { -webkit-backface-visibility: hidden; backface-visibility: hidden; }
        .transform-style-preserve-3d { transform-style: preserve-3d; }
      `}</style>

      <div className="max-w-6xl mx-auto">
        <h1 className={`${amiri.className} text-3xl font-bold text-center mb-8 text-gray-800`}>
          المدرسون المتاحون
        </h1>

        <div className="text-center mb-6 text-gray-600">
          <p>عدد المدرسين: {teachers.length}</p>
        </div>

        {/* grid مع مسافة إضافية بين الصفوف */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
          {teachers.map((teacher) => (
            <TeacherCard key={teacher.id} teacher={teacher} />
          ))}
        </div>
      </div>
    </div>
  )
}
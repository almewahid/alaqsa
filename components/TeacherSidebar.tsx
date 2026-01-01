"use client"

import { useState, useEffect } from "react"

export default function TeacherSidebar({
  filterStage,
  setFilterStage,
  filterCurriculum,
  setFilterCurriculum,
  filterSubject,
  setFilterSubject,
  uniqueSubjects = [],
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  experience,
  setExperience,
  lessonType,
  setLessonType,
  resetFilters,
}: any) {
  const [isOpen, setIsOpen] = useState(true)

  // حفظ الفلاتر في LocalStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(
        "teacherFilters",
        JSON.stringify({ filterStage, filterCurriculum, filterSubject, minPrice, maxPrice, experience, lessonType })
      )
    }
  }, [filterStage, filterCurriculum, filterSubject, minPrice, maxPrice, experience, lessonType])

  return (
    <aside
      className={`transition-all duration-300 ${
        isOpen ? "w-64" : "w-12"
      } bg-white shadow-md rounded-lg h-full flex flex-col`}
    >
      {/* زر الطي */}
      <button
        className="p-2 text-center bg-gray-100 hover:bg-gray-200 rounded-t-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? "⬅️" : "➡️"}
      </button>

      {/* محتوى الفلاتر */}
      {isOpen && (
        <div className="p-4 space-y-6 overflow-y-auto">
          {/* المرحلة */}
          <div>
            <label className="block text-sm font-medium mb-2">المرحلة</label>
            <select
              value={filterStage}
              onChange={(e) => setFilterStage(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="">الكل</option>
              <option value="المرحلة الابتدائية">المرحلة الابتدائية</option>
              <option value="المرحلة المتوسطة">المرحلة المتوسطة</option>
              <option value="المرحلة الثانوية">المرحلة الثانوية</option>
              <option value="المرحلة الجامعية">المرحلة الجامعية</option>
            </select>
          </div>

          {/* المنهج - ✅ جميع المناهج */}
          <div>
            <label className="block text-sm font-medium mb-2">المنهج</label>
            <select
              value={filterCurriculum}
              onChange={(e) => setFilterCurriculum(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="">الكل</option>
              <option value="المنهج السعودي">المنهج السعودي</option>
              <option value="المنهج المصري">المنهج المصري</option>
              <option value="المنهج الكويتي">المنهج الكويتي</option>
              <option value="المنهج الإماراتي">المنهج الإماراتي</option>
              <option value="المنهج الأمريكي">المنهج الأمريكي</option>
              <option value="المنهج البريطاني">المنهج البريطاني</option>
            </select>
          </div>

          {/* المواد - ✅ جديد */}
          <div>
            <label className="block text-sm font-medium mb-2">المادة</label>
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="">الكل</option>
              {(uniqueSubjects || []).map((subject: string) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>

          {/* أونلاين / منازل */}
          <div>
            <label className="block text-sm font-medium mb-2">طريقة الدرس</label>
            <select
              value={lessonType}
              onChange={(e) => setLessonType(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="">الكل</option>
              <option value="online">أونلاين</option>
              <option value="home">منزلي</option>
            </select>
          </div>

          {/* السعر */}
          <div>
            <label className="block text-sm font-medium mb-2">السعر (للحصة)</label>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(Number(e.target.value))}
                placeholder="من"
                className="w-20 border rounded px-2 py-1"
              />
              <span>-</span>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                placeholder="إلى"
                className="w-20 border rounded px-2 py-1"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">من {minPrice} إلى {maxPrice} د.ك</p>
          </div>

          {/* سنوات الخبرة */}
          <div>
            <label className="block text-sm font-medium mb-2">سنوات الخبرة</label>
            <input
              type="range"
              min="0"
              max="20"
              value={experience}
              onChange={(e) => setExperience(Number(e.target.value))}
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-1">{experience} سنوات فأكثر</p>
          </div>

          {/* زر إعادة تعيين */}
          <button
            onClick={resetFilters}
            className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
          >
            إعادة تعيين
          </button>
        </div>
      )}
    </aside>
  )
}
"use client"

import { useState, useEffect } from "react"

export default function TeacherSidebar({
  filterStage,
  setFilterStage,
  filterCurriculum,
  setFilterCurriculum,
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
    localStorage.setItem(
      "teacherFilters",
      JSON.stringify({ filterStage, filterCurriculum, minPrice, maxPrice, experience, lessonType })
    )
  }, [filterStage, filterCurriculum, minPrice, maxPrice, experience, lessonType])

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
            </select>
          </div>

          {/* المنهج */}
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
              <option value="home">منازل</option>
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
                className="w-20 border rounded px-2 py-1"
              />
              <span>-</span>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-20 border rounded px-2 py-1"
              />
            </div>
          </div>

          {/* الخبرة */}
          <div>
            <label className="block text-sm font-medium mb-2">الخبرة (سنوات)</label>
            <input
              type="range"
              min={0}
              max={20}
              value={experience}
              onChange={(e) => setExperience(Number(e.target.value))}
              className="w-full"
            />
            <p className="text-sm text-gray-600">{experience} سنة</p>
          </div>

          {/* زر إعادة تعيين */}
          <button
            onClick={resetFilters}
            className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg w-full transition"
          >
            إعادة تعيين
          </button>
        </div>
      )}
    </aside>
  )
}

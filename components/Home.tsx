"use client"

import { useState, useEffect } from "react"
import TeacherSidebar from "./TeacherSidebar"
import TeacherList from "./TeacherList"
import { Teacher } from "./TeacherCard"
import { getTeachers } from "@/lib/api/teachers"

export default function StudentHomeScreen() {
  // State للمدرسين
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // تعريف الفلاتر
  const [filterStage, setFilterStage] = useState("")
  const [filterCurriculum, setFilterCurriculum] = useState("")
  const [filterSubject, setFilterSubject] = useState("") // ✅ فلتر المواد
  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(300)
  const [experience, setExperience] = useState(0)
  const [lessonType, setLessonType] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<"rating" | "price" | "price4" | null>(null)
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)

  // جلب المدرسين من Supabase
  useEffect(() => {
    async function loadTeachers() {
      try {
        setLoading(true)
        setError(null)
        const data = await getTeachers()
console.log('Teachers data:', data) // للتأكد
        setTeachers(data)
      } catch (err: any) {
        console.error('Error loading teachers:', err)
        setError('حدث خطأ أثناء تحميل المدرسين')
        setTeachers([])
      } finally {
        setLoading(false)
      }
    }

    loadTeachers()
  }, [])

  // حفظ واسترجاع الفلاتر
  useEffect(() => {
    const saved = localStorage.getItem("teacherFilters")
    if (saved) {
      const parsed = JSON.parse(saved)
      setFilterStage(parsed.filterStage || "")
      setFilterCurriculum(parsed.filterCurriculum || "")
      setFilterSubject(parsed.filterSubject || "") // ✅
      setMinPrice(parsed.minPrice || 0)
      setMaxPrice(parsed.maxPrice || 300)
      setExperience(parsed.experience || 0)
      setLessonType(parsed.lessonType || "")
      setSearchTerm(parsed.searchTerm || "")
      setSortBy(parsed.sortBy || null)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(
      "teacherFilters",
      JSON.stringify({ filterStage, filterCurriculum, filterSubject, minPrice, maxPrice, experience, lessonType, searchTerm, sortBy })
    )
  }, [filterStage, filterCurriculum, filterSubject, minPrice, maxPrice, experience, lessonType, searchTerm, sortBy])

  // الفلترة
  let filteredTeachers = teachers.filter(
    (t) =>
      (filterStage ? t.stage === filterStage : true) &&
      (filterCurriculum ? t.curriculum === filterCurriculum : true) &&
      (filterSubject ? t.subject === filterSubject : true) && // ✅ فلتر المواد
      // ✅ إصلاح فلتر أونلاين/منزلي - يعرض "both" في كلا الحالتين
      (lessonType ? (t.lessonType === lessonType || t.lessonType === "both") : true) &&
      (minPrice ? Number(t.price) >= minPrice : true) &&
      (maxPrice ? Number(t.price) <= maxPrice : true) &&
      (searchTerm ? t.name.includes(searchTerm) || t.subject.includes(searchTerm) : true)
  )

  // الترتيب
  if (sortBy === "rating") {
    filteredTeachers = [...filteredTeachers].sort((a, b) => Number(b.rating) - Number(a.rating))
  } else if (sortBy === "price") {
    filteredTeachers = [...filteredTeachers].sort((a, b) => Number(a.price) - Number(b.price))
  } else if (sortBy === "price4") {
    filteredTeachers = [...filteredTeachers].sort((a, b) => Number(a.price) * 4 - Number(b.price) * 4)
  }

  // ✅ زر إعادة تعيين - يشمل المواد
  const resetFilters = () => {
    setFilterStage("")
    setFilterCurriculum("")
    setFilterSubject("") // ✅
    setMinPrice(0)
    setMaxPrice(300)
    setExperience(0)
    setLessonType("")
    setSearchTerm("")
    setSortBy(null)
  }

  // حساب عدد المعلمين لكل مرحلة
  const stageCounts = {
    "المرحلة الابتدائية": teachers.filter((t) => t.stage === "المرحلة الابتدائية").length,
    "المرحلة المتوسطة": teachers.filter((t) => t.stage === "المرحلة المتوسطة").length,
    "المرحلة الثانوية": teachers.filter((t) => t.stage === "المرحلة الثانوية").length,
    "المرحلة الجامعية": teachers.filter((t) => t.stage === "المرحلة الجامعية").length,
  }

  // ✅ استخراج جميع المواد الفريدة من المدرسين
  const uniqueSubjects = Array.from(new Set(teachers.map(t => t.subject))).sort()

  // Tags مع عداد
  const activeTags = [
    filterStage && { label: `${filterStage} (${teachers.filter((t) => t.stage === filterStage).length})`, action: () => setFilterStage("") },
    filterCurriculum && { label: filterCurriculum, action: () => setFilterCurriculum("") },
    filterSubject && { label: filterSubject, action: () => setFilterSubject("") }, // ✅
    lessonType && { label: lessonType === "online" ? "أونلاين" : "منزلي", action: () => setLessonType("") },
    searchTerm && { label: `بحث: ${searchTerm}`, action: () => setSearchTerm("") },
  ].filter(Boolean) as { label: string; action: () => void }[]

  return (
    <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6">
      {/* Sidebar لسطح المكتب */}
      <div className="hidden md:block">
        <TeacherSidebar
          filterStage={filterStage}
          setFilterStage={setFilterStage}
          filterCurriculum={filterCurriculum}
          setFilterCurriculum={setFilterCurriculum}
          filterSubject={filterSubject}
          setFilterSubject={setFilterSubject}
          uniqueSubjects={uniqueSubjects}
          minPrice={minPrice}
          setMinPrice={setMinPrice}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          experience={experience}
          setExperience={setExperience}
          lessonType={lessonType}
          setLessonType={setLessonType}
          resetFilters={resetFilters}
        />
      </div>

      {/* القسم الرئيسي */}
      <section className="px-4 md:px-10 w-full">
        {/* زر الفلاتر للموبايل */}
        <button
          className="md:hidden mb-4 bg-primary text-white px-4 py-2 rounded-lg shadow"
          onClick={() => setIsMobileFiltersOpen(true)}
        >
          📂 الفلاتر
        </button>

        {/* البحث + الفلاتر */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              {loading ? "جاري التحميل..." : `عرض ${filteredTeachers.length} مدرس${filteredTeachers.length !== 1 ? "ين" : ""}`}
            </p>

            <div className="flex flex-col md:flex-row gap-3 flex-grow">
              {/* البحث */}
              <div className="relative flex-grow">
                <span className="absolute right-3 top-3 text-gray-400">🔍</span>
                <input
                  type="text"
                  placeholder="ابحث عن مدرس أو مادة..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute left-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* الترتيب */}
              <select
                value={sortBy || ""}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              >
                <option value="">ترتيب</option>
                <option value="rating">الأعلى تقييماً</option>
                <option value="price">الأقل سعراً</option>
                <option value="price4">الأقل سعراً (4 حصص)</option>
              </select>
            </div>
          </div>

          {/* Tags الفلاتر النشطة */}
          {activeTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {activeTags.map((tag, idx) => (
                <button
                  key={idx}
                  onClick={tag.action}
                  className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-1 hover:bg-blue-200"
                >
                  {tag.label}
                  <span className="text-xs">✕</span>
                </button>
              ))}
              <button
                onClick={resetFilters}
                className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm hover:bg-red-200"
              >
                إعادة تعيين الكل
              </button>
            </div>
          )}
        </div>

        {/* قائمة المدرسين */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">جاري تحميل المدرسين...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-600">
            <p>{error}</p>
          </div>
        ) : (
          <TeacherList
            teachers={filteredTeachers}
            searchTerm={searchTerm}
            setFilterSubject={setFilterSubject}
            uniqueSubjects={uniqueSubjects}
          />
        )}
      </section>

      {/* Sidebar للموبايل */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden">
          <div className="absolute right-0 top-0 h-full w-64 bg-white shadow-lg">
            <button
              className="absolute top-4 left-4 text-2xl"
              onClick={() => setIsMobileFiltersOpen(false)}
            >
              ✕
            </button>
            <div className="pt-16">
              <TeacherSidebar
                filterStage={filterStage}
                setFilterStage={setFilterStage}
                filterCurriculum={filterCurriculum}
                setFilterCurriculum={setFilterCurriculum}
                filterSubject={filterSubject}
                setFilterSubject={setFilterSubject}
                uniqueSubjects={uniqueSubjects}
                minPrice={minPrice}
                setMinPrice={setMinPrice}
                maxPrice={maxPrice}
                setMaxPrice={setMaxPrice}
                experience={experience}
                setExperience={setExperience}
                lessonType={lessonType}
                setLessonType={setLessonType}
                resetFilters={resetFilters}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
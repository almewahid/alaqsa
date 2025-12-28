"use client"

import { useState, useEffect } from "react"
import TeacherSidebar from "./TeacherSidebar"
import TeacherList from "./TeacherList"
import { Teacher } from "./TeacherCard"

export default function StudentHomeScreen() {
  // ✅ تعريف الفلاتر
  const [filterStage, setFilterStage] = useState("")
  const [filterCurriculum, setFilterCurriculum] = useState("")
  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(300)
  const [experience, setExperience] = useState(0)
  const [lessonType, setLessonType] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<"rating" | "price" | "price4" | null>(null)
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)

  // ✅ حفظ واسترجاع الفلاتر
  useEffect(() => {
    const saved = localStorage.getItem("teacherFilters")
    if (saved) {
      const parsed = JSON.parse(saved)
      setFilterStage(parsed.filterStage || "")
      setFilterCurriculum(parsed.filterCurriculum || "")
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
      JSON.stringify({ filterStage, filterCurriculum, minPrice, maxPrice, experience, lessonType, searchTerm, sortBy })
    )
  }, [filterStage, filterCurriculum, minPrice, maxPrice, experience, lessonType, searchTerm, sortBy])

  // ✅ قائمة المدرسين (مثال)
  const teachers: Teacher[] = [
    {
      id: 1,
      name: "أ. محمد أحمد",
      subject: "الرياضيات",
      curriculum: "المنهج السعودي",
      stage: "المرحلة الثانوية",
      rating: "4.9",
      price: "120",
      students: 120,
      lessons: 45,
      discount: "20 ر.س",
      bio: "معلم مميز بخبرة طويلة",
      gradient: "from-blue-300 via-purple-300 to-pink-300",
      avatarColor: "bg-blue-400",
      lessonType: "online",
      featured: true,
    },
    {
      id: 2,
      name: "أ. سارة خالد",
      subject: "اللغة الإنجليزية",
      curriculum: "المنهج المصري",
      stage: "المرحلة الجامعية",
      rating: "4.7",
      price: "200",
      students: 85,
      lessons: 40,
      discount: null,
      bio: "أستاذة جامعية متخصصة",
      gradient: "from-orange-300 via-pink-300 to-red-300",
      avatarColor: "bg-orange-400",
      lessonType: "home",
      featured: false,
    },
  ]

  // ✅ فلترة
  let filteredTeachers = teachers.filter(
    (t) =>
      (filterStage ? t.stage === filterStage : true) &&
      (filterCurriculum ? t.curriculum === filterCurriculum : true) &&
      (lessonType ? t.lessonType === lessonType : true) &&
      (minPrice ? Number(t.price) >= minPrice : true) &&
      (maxPrice ? Number(t.price) <= maxPrice : true) &&
      (searchTerm ? t.name.includes(searchTerm) || t.subject.includes(searchTerm) : true)
  )

  // ✅ الترتيب
  if (sortBy === "rating") {
    filteredTeachers = [...filteredTeachers].sort((a, b) => Number(b.rating) - Number(a.rating))
  } else if (sortBy === "price") {
    filteredTeachers = [...filteredTeachers].sort((a, b) => Number(a.price) - Number(b.price))
  } else if (sortBy === "price4") {
    filteredTeachers = [...filteredTeachers].sort((a, b) => Number(a.price) * 4 - Number(b.price) * 4)
  }

  // ✅ زر إعادة تعيين
  const resetFilters = () => {
    setFilterStage("")
    setFilterCurriculum("")
    setMinPrice(0)
    setMaxPrice(300)
    setExperience(0)
    setLessonType("")
    setSearchTerm("")
    setSortBy(null)
  }

  // ✅ حساب عدد المعلمين لكل مرحلة
  const stageCounts = {
    "المرحلة الابتدائية": teachers.filter((t) => t.stage === "المرحلة الابتدائية").length,
    "المرحلة المتوسطة": teachers.filter((t) => t.stage === "المرحلة المتوسطة").length,
    "المرحلة الثانوية": teachers.filter((t) => t.stage === "المرحلة الثانوية").length,
    "المرحلة الجامعية": teachers.filter((t) => t.stage === "المرحلة الجامعية").length,
  }

  // ✅ Tags مع عداد
  const activeTags = [
    filterStage && { label: `${filterStage} (${teachers.filter((t) => t.stage === filterStage).length})`, action: () => setFilterStage("") },
    filterCurriculum && { label: filterCurriculum, action: () => setFilterCurriculum("") },
    lessonType && { label: lessonType === "online" ? "أونلاين" : "منزلي", action: () => setLessonType("") },
    searchTerm && { label: `بحث: ${searchTerm}`, action: () => setSearchTerm("") },
  ].filter(Boolean) as { label: string; action: () => void }[]

  return (
    <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6">
      {/* ✅ Sidebar لسطح المكتب */}
      <div className="hidden md:block">
        <TeacherSidebar
          filterStage={filterStage}
          setFilterStage={setFilterStage}
          filterCurriculum={filterCurriculum}
          setFilterCurriculum={setFilterCurriculum}
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

      {/* ✅ القسم الرئيسي */}
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
              {"عرض "}
              {filteredTeachers.length}
              {" مدرس"}
              {filteredTeachers.length !== 1 && "ين"}
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
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* المرحلة + عدد */}
              <select
                value={filterStage}
                onChange={(e) => setFilterStage(e.target.value)}
                className="px-4 py-2 border rounded-lg text-gray-700 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              >
                <option value="">اختر مرحلة</option>
                <option value="المرحلة الابتدائية">المرحلة الابتدائية ({stageCounts["المرحلة الابتدائية"]})</option>
                <option value="المرحلة المتوسطة">المرحلة المتوسطة ({stageCounts["المرحلة المتوسطة"]})</option>
                <option value="المرحلة الثانوية">المرحلة الثانوية ({stageCounts["المرحلة الثانوية"]})</option>
                <option value="المرحلة الجامعية">المرحلة الجامعية ({stageCounts["المرحلة الجامعية"]})</option>
              </select>

              {/* الترتيب */}
              <select
                value={sortBy ?? ""}
                onChange={(e) => setSortBy(e.target.value as "rating" | "price" | "price4" | null)}
                className="px-4 py-2 border rounded-lg text-gray-700 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              >
                <option value="">فرز حسب</option>
                <option value="rating">الأعلى تقييماً</option>
                <option value="price">الأقل سعراً (للحصة)</option>
                <option value="price4">الأقل سعراً (أربع حصص)</option>
              </select>

              {/* أونلاين / منزلي */}
              <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden text-sm">
                <button
                  onClick={() => setLessonType("online")}
                  className={`px-4 py-2 ${lessonType === "online" ? "bg-primary text-white" : ""}`}
                >
                  أونلاين
                </button>
                <button
                  onClick={() => setLessonType("home")}
                  className={`px-4 py-2 ${lessonType === "home" ? "bg-primary text-white" : ""}`}
                >
                  منزلي
                </button>
              </div>

              {/* زر إعادة تعيين */}
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg"
              >
                ✕ إعادة تعيين
              </button>
            </div>
          </div>

          {/* ✅ Tags للفلاتر النشطة */}
          {activeTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {activeTags.map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-gray-200 dark:bg-gray-600 text-sm px-3 py-1 rounded-full flex items-center gap-2 cursor-pointer"
                  onClick={tag.action}
                >
                  {tag.label} ✕
                </span>
              ))}
            </div>
          )}
        </div>

        {/* ✅ عرض المدرسين */}
        <TeacherList teachers={filteredTeachers} />
      </section>

      {/* ✅ Drawer للموبايل */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex">
          <div className="bg-white dark:bg-gray-800 w-72 h-full shadow-xl p-4 overflow-y-auto">
            <button
              className="mb-4 text-red-500"
              onClick={() => setIsMobileFiltersOpen(false)}
            >
              ✕ إغلاق
            </button>
            <TeacherSidebar
              filterStage={filterStage}
              setFilterStage={setFilterStage}
              filterCurriculum={filterCurriculum}
              setFilterCurriculum={setFilterCurriculum}
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
      )}
    </div>
  )
}

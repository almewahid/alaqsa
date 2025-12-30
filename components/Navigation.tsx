"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import Image from "next/image"
import { useAuth } from "@/contexts/AuthContext"
import {
  Home,
  BookOpen,
  LayoutDashboard,
  MessageCircle,
  User,
  Award,
  Calendar,
  ClipboardList,
  LogOut,
} from "lucide-react"

// 🟦 روابط الطالب
const navLinksStudent = [
  { href: "/home", label: "الرئيسية", icon: <Home className="w-4 h-4 text-blue-500" /> },
  { href: "/mylessons", label: "دروسي", icon: <BookOpen className="w-4 h-4 text-blue-500" /> },
  { href: "/studentdashboard", label: "لوحة التحكم", icon: <LayoutDashboard className="w-4 h-4 text-blue-500" /> },
  { href: "/messages", label: "الرسائل", icon: <MessageCircle className="w-4 h-4 text-blue-500" /> },
  { href: "/myteacher", label: "مدرسيني", icon: <BookOpen className="w-4 h-4 text-blue-500" /> },
]

// 🟩 روابط المدرس
const navLinksTeacher = [
  { href: "/home", label: "الرئيسية", icon: <Home className="w-4 h-4 text-green-500" /> },
  { href: "/teacherlessons", label: "دروسي", icon: <BookOpen className="w-4 h-4 text-green-500" /> },
  { href: "/teacherdashboard", label: "لوحة التحكم", icon: <LayoutDashboard className="w-4 h-4 text-green-500" /> },
  { href: "/messages", label: "الرسائل", icon: <MessageCircle className="w-4 h-4 text-green-500" /> },
]

// 🟥 روابط الإدارة
const navLinksAdmin = [
  { href: "/home", label: "الرئيسية", icon: <Home className="w-4 h-4 text-red-500" /> },
  { href: "/admindashboard", label: "لوحة التحكم", icon: <LayoutDashboard className="w-4 h-4 text-red-500" /> },
  { href: "/messages", label: "الرسائل", icon: <MessageCircle className="w-4 h-4 text-red-500" /> },
]

export default function Navigation() {
  const pathname = usePathname()
  const { user, profile, signOut } = useAuth()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  
  // للإدارة: إمكانية رؤية الواجهة كطالب أو معلم
  const [adminViewAs, setAdminViewAs] = useState<"student" | "teacher" | "admin">("admin")

  // تحديد الدور الفعلي للعرض
  const effectiveRole = profile?.role === 'admin' ? adminViewAs : (profile?.role || 'student')

  // إذا لم يكن هناك مستخدم مسجل، عرض navbar بسيط
  if (!user || !profile) {
    return (
      <nav className="shadow-md bg-white">
        <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
          <Link href="/home" className="font-bold text-xl text-blue-600">
            منصة الأقصى التعليمية
          </Link>
          <div className="flex gap-4">
            <Link href="/home" className="text-gray-600 hover:text-blue-600">
              الرئيسية
            </Link>
            <Link href="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
              تسجيل دخول
            </Link>
            <Link href="/signup" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              إنشاء حساب
            </Link>
          </div>
        </div>
      </nav>
    )
  }

  // 🔹 بيانات الدور الحالي
  let navLinks: { href: string; label: string; icon: JSX.Element }[] = []
  let roleColor = "text-gray-800"
  let roleIcon = ""
  let roleName = ""

  if (effectiveRole === "student") {
    navLinks = navLinksStudent
    roleColor = "text-blue-600"
    roleIcon = "/icons/student.png"
    roleName = "الطالب"
  } else if (effectiveRole === "teacher") {
    navLinks = navLinksTeacher
    roleColor = "text-green-600"
    roleIcon = "/icons/teacher.png"
    roleName = "المدرس"
  } else if (effectiveRole === "admin") {
    navLinks = navLinksAdmin
    roleColor = "text-red-600"
    roleIcon = "/icons/admin.png"
    roleName = "الإدارة"
  }

  return (
    <nav className="shadow-md bg-white">
      <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
        {/* شعار + أيقونة الدور */}
        <div className="flex flex-col items-start gap-2">
          <div className="flex items-center gap-2">
            <Image src={roleIcon} alt="Role Icon" width={40} height={40} />
            <div>
              <span className={`font-bold text-lg ${roleColor}`}>
                {roleName}
              </span>
              <p className="text-xs text-gray-500">{profile.full_name}</p>
            </div>
          </div>

          {/* 🔘 أزرار تبديل الدور (للإدارة فقط) */}
          {profile.role === 'admin' && (
            <div className="flex gap-2">
              <button
                onClick={() => setAdminViewAs("student")}
                className={`px-3 py-1 rounded-xl border text-xs ${
                  adminViewAs === "student"
                    ? "bg-blue-100 text-blue-600 border-blue-400"
                    : "bg-gray-100 text-gray-600"
                }`}
                title="عرض كطالب"
              >
                👨‍🎓 طالب
              </button>
              <button
                onClick={() => setAdminViewAs("teacher")}
                className={`px-3 py-1 rounded-xl border text-xs ${
                  adminViewAs === "teacher"
                    ? "bg-green-100 text-green-600 border-green-400"
                    : "bg-gray-100 text-gray-600"
                }`}
                title="عرض كمعلم"
              >
                👨‍🏫 معلم
              </button>
              <button
                onClick={() => setAdminViewAs("admin")}
                className={`px-3 py-1 rounded-xl border text-xs ${
                  adminViewAs === "admin"
                    ? "bg-red-100 text-red-600 border-red-400"
                    : "bg-gray-100 text-gray-600"
                }`}
                title="عرض كإدارة"
              >
                🏛️ إدارة
              </button>
            </div>
          )}
        </div>

        {/* القائمة الرئيسية */}
        <ul className="flex gap-6">
          {navLinks.map((link) => (
            <li key={link.href} className="flex items-center gap-1">
              {link.icon}
              <Link
                href={link.href}
                className={`hover:underline ${
                  pathname === link.href ? roleColor : "text-gray-600"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* أيقونة المستخدم مع القائمة المنسدلة */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className={`flex items-center gap-2 p-2 border rounded-full hover:bg-gray-100`}
          >
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-bold text-sm">
                {profile.full_name.charAt(0)}
              </span>
            </div>
          </button>

          {dropdownOpen && (
            <div className="absolute left-0 mt-2 w-56 bg-white border rounded-lg shadow-lg z-50">
              {/* الملف الشخصي */}
              <Link
                href={
                  profile.role === "student"
                    ? "/studentprofile/view"
                    : profile.role === "teacher"
                    ? "/teacherprofile/view"
                    : "/admin/users"
                }
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                onClick={() => setDropdownOpen(false)}
              >
                <User className="w-4 h-4 text-gray-600" /> الملف الشخصي
              </Link>

              {/* خاصة بالطالب */}
              {(effectiveRole === "student") && (
                <>
                  <Link
                    href="/achievements"
                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <Award className="w-4 h-4 text-yellow-500" /> شهاداتي / إنجازاتي
                  </Link>
                  <Link
                    href="/schedule"
                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <Calendar className="w-4 h-4 text-blue-500" /> جدولي
                  </Link>
                  <Link
                    href="/assignments"
                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <ClipboardList className="w-4 h-4 text-purple-500" /> واجباتي
                  </Link>
                </>
              )}

              {/* فاصل */}
              <div className="border-t my-2"></div>

              {/* تسجيل الخروج */}
              <button
                onClick={async () => {
                  await signOut()
                  setDropdownOpen(false)
                }}
                className="flex items-center gap-2 px-4 py-2 hover:bg-red-50 text-red-600 w-full text-right"
              >
                <LogOut className="w-4 h-4" /> تسجيل خروج
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
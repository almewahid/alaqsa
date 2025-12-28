"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import {
  Home,
  BookOpen,
  LayoutDashboard,
  MessageCircle,
  GraduationCap,
  User,
  Award,
  Calendar,
  ClipboardList,
} from "lucide-react";

// 🟦 روابط الطالب
const navLinksStudent = [
  { href: "/home", label: "الرئيسية", icon: <Home className="w-4 h-4 text-blue-500" /> },
  { href: "/mylessons", label: "دروسي", icon: <BookOpen className="w-4 h-4 text-blue-500" /> },
  { href: "/studentdashboard", label: "لوحة التحكم", icon: <LayoutDashboard className="w-4 h-4 text-blue-500" /> },
  { href: "/messages", label: "الرسائل", icon: <MessageCircle className="w-4 h-4 text-blue-500" /> },
  { href: "/myteacher", label: "مدرسيني", icon: <BookOpen className="w-4 h-4 text-blue-500" /> },
];

// 🟩 روابط المدرس
const navLinksTeacher = [
  { href: "/home", label: "الرئيسية", icon: <Home className="w-4 h-4 text-green-500" /> },
  { href: "/teacherlessons", label: "دروسي", icon: <BookOpen className="w-4 h-4 text-green-500" /> },
  { href: "/teacherdashboard", label: "لوحة التحكم", icon: <LayoutDashboard className="w-4 h-4 text-green-500" /> },
  { href: "/messages", label: "الرسائل", icon: <MessageCircle className="w-4 h-4 text-green-500" /> },
];

// 🟥 روابط الإدارة
const navLinksAdmin = [
  { href: "/home", label: "الرئيسية", icon: <Home className="w-4 h-4 text-red-500" /> },
  { href: "/admindashboard", label: "لوحة التحكم", icon: <LayoutDashboard className="w-4 h-4 text-red-500" /> },
  { href: "/messages", label: "الرسائل", icon: <MessageCircle className="w-4 h-4 text-red-500" /> },
];

export default function Navigation() {
  const pathname = usePathname();
  const [role, setRole] = useState<"student" | "teacher" | "admin">("student");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // 🔹 بيانات الدور الحالي
  let navLinks: { href: string; label: string; icon: JSX.Element }[] = [];
  let roleColor = "text-gray-800";
  let roleIcon = "";

  if (role === "student") {
    navLinks = navLinksStudent;
    roleColor = "text-blue-600";
    roleIcon = "/icons/student.png";
  } else if (role === "teacher") {
    navLinks = navLinksTeacher;
    roleColor = "text-green-600";
    roleIcon = "/icons/teacher.png";
  } else if (role === "admin") {
    navLinks = navLinksAdmin;
    roleColor = "text-red-600";
    roleIcon = "/icons/admin.png";
  }

  return (
    <nav className="shadow-md bg-white">
      <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
        {/* شعار + أيقونة الدور */}
        <div className="flex flex-col items-start gap-2">
          <div className="flex items-center gap-2">
            <Image src={roleIcon} alt="Role Icon" width={40} height={40} />
            <span className={`font-bold text-lg ${roleColor}`}>
              {role === "student" && "الطالب"}
              {role === "teacher" && "المدرس"}
              {role === "admin" && "الإدارة"}
            </span>
          </div>

          {/* 🔘 أزرار تبديل الدور */}
          <div className="flex gap-2">
            <button
              onClick={() => setRole("student")}
              className={`px-3 py-1 rounded-xl border ${
                role === "student"
                  ? "bg-blue-100 text-blue-600 border-blue-400"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              👨‍🎓
            </button>
            <button
              onClick={() => setRole("teacher")}
              className={`px-3 py-1 rounded-xl border ${
                role === "teacher"
                  ? "bg-green-100 text-green-600 border-green-400"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              👨‍🏫
            </button>
            <button
              onClick={() => setRole("admin")}
              className={`px-3 py-1 rounded-xl border ${
                role === "admin"
                  ? "bg-red-100 text-red-600 border-red-400"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              🏛️
            </button>
          </div>
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

        {/* أيقونة الدور مع القائمة المنسدلة */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-1 p-2 border rounded-full hover:bg-gray-100"
          >
            <GraduationCap className={`w-5 h-5 ${roleColor}`} />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border rounded-lg shadow-lg">
              {/* الملف الشخصي */}
              <Link
                href={
                  role === "student"
                    ? "/studentprofile/view"
                    : role === "teacher"
                    ? "/teacherprofile/view"
                    : "/admin/users"
                }
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
              >
                <User className="w-4 h-4 text-gray-600" /> الملف الشخصي
              </Link>

              {/* خاصة بالطالب */}
              {role === "student" && (
                <>
                  <Link
                    href="/achievements"
                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                  >
                    <Award className="w-4 h-4 text-yellow-500" /> شهاداتي / إنجازاتي
                  </Link>
                  <Link
                    href="/schedule"
                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                  >
                    <Calendar className="w-4 h-4 text-blue-500" /> جدولي
                  </Link>
                  <Link
                    href="/assignments"
                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                  >
                    <ClipboardList className="w-4 h-4 text-purple-500" /> واجباتي
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

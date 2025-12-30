"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { UserRole } from "@/lib/auth"

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAuth?: boolean
  allowedRoles?: UserRole[]
  redirectTo?: string
}

export default function ProtectedRoute({
  children,
  requireAuth = true,
  allowedRoles,
  redirectTo = "/login",
}: ProtectedRouteProps) {
  const { user, profile, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return

    // إذا كانت الصفحة تتطلب تسجيل دخول والمستخدم غير مسجل
    if (requireAuth && !user) {
      router.push(redirectTo)
      return
    }

    // إذا كان هناك قيود على الأدوار
    if (requireAuth && user && allowedRoles && profile) {
      if (!allowedRoles.includes(profile.role)) {
        // إعادة توجيه حسب الدور
        if (profile.role === 'student') {
          router.push('/home')
        } else if (profile.role === 'teacher') {
          router.push('/teacher-dashboard')
        } else {
          router.push('/admin-dashboard')
        }
      }
    }
  }, [user, profile, loading, requireAuth, allowedRoles, router, redirectTo])

  // عرض loading أثناء التحقق
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  // إذا كانت الصفحة تتطلب تسجيل دخول والمستخدم غير مسجل
  if (requireAuth && !user) {
    return (
      <p className="text-center mt-20 text-gray-600">
        جارٍ التوجيه لصفحة تسجيل الدخول...
      </p>
    )
  }

  // إذا كان هناك قيود على الأدوار ولا يملك الصلاحية
  if (requireAuth && user && allowedRoles && profile && !allowedRoles.includes(profile.role)) {
    return null // سيتم إعادة التوجيه
  }

  return <>{children}</>
}
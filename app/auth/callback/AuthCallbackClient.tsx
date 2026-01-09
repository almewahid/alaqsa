"use client"

import { useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function AuthCallbackClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const handledRef = useRef(false)

  useEffect(() => {
    if (handledRef.current) return
    handledRef.current = true

    const run = async () => {
      try {
        console.log("🟢 Starting auth callback")

        // الحصول على الجلسة
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error || !session) {
          console.error("❌ No session after callback", error)
          router.replace("/login?error=no_session")
          return
        }

        const user = session.user
        console.log("✅ User authenticated:", user.id)

        const role =
          searchParams.get("role") ||
          user.user_metadata?.role ||
          "student"

        // التحقق من وجود المستخدم
        const { data: existingUser, error: fetchError } =
          await supabase
            .from("users")
            .select("id, user_type")
            .eq("auth_id", user.id)
            .maybeSingle()

        if (fetchError) {
          console.error("❌ Fetch user error:", fetchError)
          router.replace("/login?error=user_fetch_failed")
          return
        }

        // مستخدم موجود - توجيه حسب نوعه
        if (existingUser) {
          console.log("✅ Existing user found")
          
          switch (existingUser.user_type) {
            case "student":
              router.replace("/studentdashboard")
              break
            case "teacher":
              router.replace("/teacherdashboard")
              break
            case "center":
              router.replace("/centerdashboard")
              break
            case "service":
              router.replace("/servicedashboard")
              break
            default:
              router.replace("/")
          }
          return
        }

        // مستخدم جديد - إنشاء حساب
        console.log("🆕 Creating new user")

        const { data: newUser, error: createError } =
          await supabase
            .from("users")
            .insert({
              auth_id: user.id,
              email: user.email!,
              full_name:
                user.user_metadata?.full_name ||
                user.email!.split("@")[0],
              user_type: role,
              is_active: true,
            })
            .select("id")
            .single()

        if (createError || !newUser) {
          console.error("❌ Create user error:", createError)
          router.replace("/login?error=user_creation_failed")
          return
        }

        console.log("✅ User created:", newUser.id)

        // إنشاء بيانات حسب الدور
        switch (role) {
          case "student":
            await supabase.from("students").insert({
              user_id: newUser.id,
            })
            router.replace("/student/onboarding")
            break

          case "teacher":
            await supabase.from("teachers").insert({
              user_id: newUser.id,
            })
            router.replace("/teacher/onboarding")
            break

          case "center":
            await supabase.from("educational_centers").insert({
              user_id: newUser.id,
            })
            router.replace("/center/onboarding")
            break

          case "service":
            await supabase.from("educational_services").insert({
              user_id: newUser.id,
            })
            router.replace("/service/onboarding")
            break

          default:
            router.replace("/")
        }
      } catch (err) {
        console.error("💥 Callback fatal error:", err)
        router.replace("/login?error=unknown")
      }
    }

    run()
  }, [router, searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center" dir="rtl">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-6"></div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          جاري إتمام تسجيل الدخول...
        </h2>
      </div>
    </div>
  )
}
"use client"

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export default function AuthCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log('🟢 Starting auth callback')

        const role = searchParams.get('role') || 'student'
        const code = searchParams.get('code')

        if (!code) {
          console.error('❌ No auth code found')
          router.push('/login?error=no_code')
          return
        }

        // 🔐 تبادل الكود مع session
        const { data, error: authError } =
          await supabase.auth.exchangeCodeForSession(code)

        if (authError || !data.session) {
          console.error('❌ Auth error:', authError)
          router.push('/login?error=auth_failed')
          return
        }

        const user = data.session.user
        console.log('✅ Authenticated user:', user.id)

        // 👤 البحث عن المستخدم (عدم وجوده ليس خطأ)
        const { data: existingUser, error: fetchError } = await supabase
          .from('users')
          .select('id, user_type')
          .eq('auth_id', user.id)
          .maybeSingle()

        if (fetchError) {
          console.error('❌ Fetch user error:', fetchError)
          router.push('/login?error=user_fetch_failed')
          return
        }

        // ✅ المستخدم موجود
        if (existingUser) {
          console.log('✅ User already exists')
          router.push('/')
          return
        }

        // 🆕 إنشاء مستخدم جديد
        console.log('🟡 Creating new user profile')

        const { data: newUser, error: createError } = await supabase
          .from('users')
          .insert({
            auth_id: user.id,
            email: user.email!,
            full_name:
              user.user_metadata?.full_name ||
              user.email!.split('@')[0],
            user_type: role,
            is_active: true,
          })
          .select('id')
          .single()

        if (createError || !newUser) {
          console.error('❌ User creation error:', createError)
          router.push('/login?error=user_creation_failed')
          return
        }

        console.log('✅ User created:', newUser.id)

        // 📦 إنشاء بيانات حسب الدور
        switch (role) {
          case 'student':
            await supabase.from('students').insert({
              user_id: newUser.id,
              total_sessions: 0,
              total_spent: 0,
            })
            router.push('/student/onboarding')
            break

          case 'teacher':
            await supabase.from('teachers').insert({
              user_id: newUser.id,
              teacher_type: 'both',
              rating: 0,
              total_reviews: 0,
              total_students: 0,
              total_sessions: 0,
              is_accepting_students: false,
              years_of_experience: 0,
            })
            router.push('/teacher/onboarding')
            break

          case 'center':
            await supabase.from('educational_centers').insert({
              user_id: newUser.id,
              center_name:
                user.user_metadata?.full_name || 'مركز تعليمي',
              rating: 0,
              is_active: true,
            })
            router.push('/center/onboarding')
            break

          case 'service':
            await supabase.from('educational_services').insert({
              user_id: newUser.id,
              provider_name:
                user.user_metadata?.full_name || 'مقدم خدمة',
              service_types: ['أبحاث علمية'],
              rating: 0,
            })
            router.push('/service/onboarding')
            break

          default:
            router.push('/')
        }
      } catch (err) {
        console.error('💥 Unexpected callback error:', err)
        router.push('/login?error=unknown')
      }
    }

    handleCallback()
  }, [router, searchParams])

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100
                 dark:from-gray-900 dark:to-gray-800
                 flex items-center justify-center p-4"
      dir="rtl"
    >
      <div className="text-center max-w-md mx-auto">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-6"></div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          جاري معالجة تسجيل الدخول...
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          الرجاء الانتظار قليلاً
        </p>
      </div>
    </div>
  )
}

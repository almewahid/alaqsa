// إجبار Next.js على عدم prerender صفحة الـ callback نهائياً
export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/auth'

export default function AuthCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleCallback = async () => {
      const supabase = createClient()
      
      const role = searchParams.get('role') || 'student'
      
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('Auth error:', error)
        router.push('/login?error=auth_failed')
        return
      }
      
      if (session) {
        const { data: existingUser } = await supabase
          .from('users')
          .select('id, user_type')
          .eq('auth_id', session.user.id)
          .single()
        
        if (existingUser) {
          router.push('/')
        } else {
          const { data: userData, error: userError } = await supabase
            .from('users')
            .insert({
              auth_id: session.user.id,
              email: session.user.email!,
              full_name: session.user.user_metadata?.full_name || session.user.email!.split('@')[0],
              user_type: role,
              is_active: true,
            })
            .select('id')
            .single()
          
          if (userError || !userData) {
            console.error('User creation error:', userError)
            router.push('/login?error=user_creation_failed')
            return
          }
          
          if (role === 'student') {
            await supabase.from('students').insert({
              user_id: userData.id,
              total_sessions: 0,
              total_spent: 0,
            })
            router.push('/student/onboarding')
          } else if (role === 'teacher') {
            await supabase.from('teachers').insert({
              user_id: userData.id,
              teacher_type: 'both',
              rating: 0,
              total_reviews: 0,
              total_students: 0,
              total_sessions: 0,
              is_accepting_students: false,
              years_of_experience: 0,
            })
            router.push('/teacher/onboarding')
          } else if (role === 'center') {
            await supabase.from('educational_centers').insert({
              user_id: userData.id,
              center_name: session.user.user_metadata?.full_name || 'مركز تعليمي',
              rating: 0,
              is_active: true,
            })
            router.push('/center/onboarding')
          } else if (role === 'service') {
            await supabase.from('educational_services').insert({
              user_id: userData.id,
              provider_name: session.user.user_metadata?.full_name || 'مقدم خدمة',
              service_types: ['أبحاث علمية'],
              rating: 0,
            })
            router.push('/service/onboarding')
          } else {
            router.push('/')
          }
        }
      } else {
        router.push('/login')
      }
    }
    
    handleCallback()
  }, [router, searchParams])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4" dir="rtl">
      <div className="text-center max-w-md mx-auto">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-6"></div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">جاري معالجة تسجيل الدخول...</h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">الرجاء الانتظار قليلاً</p>
      </div>
    </div>
  )
}

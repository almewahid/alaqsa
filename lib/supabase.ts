// ============================================
// Supabase Client للمنصة الأقصى
// ============================================
// استخدم هذا الملف في جميع الصفحات والمكونات
// ============================================

import { createClient } from '@supabase/supabase-js'

// التحقق من وجود المتغيرات
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// إنشاء Supabase Client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})

// ============================================
// Helper Functions
// ============================================

/**
 * الحصول على المستخدم الحالي
 */
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) throw error
  return user
}

/**
 * الحصول على Session الحالية
 */
export async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession()
  if (error) throw error
  return session
}

/**
 * تسجيل الخروج
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

/**
 * التحقق من نوع المستخدم
 */
export async function getUserType(): Promise<'student' | 'teacher' | 'admin' | null> {
  try {
    const user = await getCurrentUser()
    if (!user) return null

    const { data, error } = await supabase
      .from('users')
      .select('user_type')
      .eq('auth_id', user.id)
      .single()

    if (error) throw error
    return data?.user_type as any
  } catch (error) {
    console.error('Error getting user type:', error)
    return null
  }
}

/**
 * معالجة أخطاء Supabase
 */
export function handleSupabaseError(error: any): string {
  if (!error) return 'حدث خطأ غير معروف'
  
  // أخطاء المصادقة
  if (error.message?.includes('Invalid login credentials')) {
    return 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
  }
  
  if (error.message?.includes('Email not confirmed')) {
    return 'يرجى تأكيد بريدك الإلكتروني أولاً'
  }
  
  if (error.message?.includes('User already registered')) {
    return 'هذا البريد الإلكتروني مسجل بالفعل'
  }

  // أخطاء RLS
  if (error.message?.includes('row-level security')) {
    return 'ليس لديك صلاحية للوصول لهذه البيانات'
  }

  // الرسالة الافتراضية
  return error.message || 'حدث خطأ أثناء العملية'
}

export default supabase

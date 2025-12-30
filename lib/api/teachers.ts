// ============================================
// Teachers API - منصة الأقصى
// ============================================
// دوال جلب وإدارة بيانات المدرسين
// ============================================

import { supabase } from '@/lib/supabase'

// ============================================
// Types (متوافق مع المشروع الحالي)
// ============================================

export interface Teacher {
  id: string
  name: string
  subject: string
  curriculum: string
  stage: string
  rating: string
  price: string
  students: number
  lessons: number
  discount?: string | null
  bio: string
  gradient?: string
  avatarColor?: string
  lessonType: 'online' | 'home' | 'both'
  featured?: boolean
  // حقول إضافية من Supabase
  user_id?: string
  avatar_url?: string
  city?: string
  years_of_experience?: number
  is_verified?: boolean
}

// ألوان عشوائية للبطاقات
const gradients = [
  'from-blue-300 via-purple-300 to-pink-300',
  'from-green-300 via-blue-300 to-purple-300',
  'from-orange-300 via-pink-300 to-red-300',
  'from-purple-300 via-pink-300 to-red-300',
  'from-cyan-300 via-blue-300 to-indigo-300',
  'from-yellow-300 via-orange-300 to-red-300',
]

const avatarColors = [
  'bg-blue-400',
  'bg-green-400',
  'bg-orange-400',
  'bg-purple-400',
  'bg-pink-400',
  'bg-indigo-400',
]

// ============================================
// جلب جميع المدرسين
// ============================================

export async function getTeachers(filters?: {
  subject?: string
  curriculum?: string
  stage?: string
  minPrice?: number
  maxPrice?: number
  lessonType?: 'online' | 'home' | 'both'
}) {
  try {
    let query = supabase
      .from('teachers')
      .select(`
        id,
        teacher_type,
        title,
        specialization,
        years_of_experience,
        rating,
        total_reviews,
        total_students,
        total_sessions,
        is_verified,
        users!inner (
          id,
          full_name,
          avatar_url,
          bio,
          city
        ),
        teacher_subjects (
          subject_id,
          grade_ids,
          subjects (
            name_ar,
            code
          )
        ),
        teacher_pricing (
          online_price_per_hour,
          home_price_per_hour
        )
      `)
      .eq('is_verified', true)
      .eq('is_accepting_students', true)

    const { data, error } = await query

    if (error) throw error

    // تحويل البيانات للصيغة المتوافقة مع المكونات الحالية
    const teachers: Teacher[] = (data || []).map((t: any, index: number) => {
      // استخراج المنهج من grade_ids (إذا كان متاحاً)
      const curriculum = 'المنهج الكويتي' // يمكن تحسينه لاحقاً
      
      // استخراج المرحلة الدراسية
      let stage = 'المرحلة الثانوية'
      if (t.teacher_subjects && t.teacher_subjects.length > 0) {
        // يمكن استخدام grade_ids لتحديد المرحلة
        stage = 'المرحلة الثانوية'
      }

      // السعر (أونلاين أو منزلي)
      const pricing = Array.isArray(t.teacher_pricing) ? t.teacher_pricing[0] : t.teacher_pricing
      const price = pricing?.online_price_per_hour || 
                    pricing?.home_price_per_hour || 
                    0

      return {
        id: t.id,
        name: t.users?.full_name || 'مدرس',
        subject: t.teacher_subjects?.[0]?.subjects?.name_ar || t.specialization || 'غير محدد',
        curriculum: curriculum,
        stage: stage,
        rating: t.rating?.toFixed(1) || '0.0',
        price: price.toString(),
        students: t.total_students || 0,
        lessons: t.total_sessions || 0,
        discount: null,
        bio: t.users?.bio || '',
        gradient: gradients[index % gradients.length],
        avatarColor: avatarColors[index % avatarColors.length],
        lessonType: t.teacher_type === 'both' ? 'both' : 
                    t.teacher_type === 'home' ? 'home' : 'online',
        featured: t.rating >= 4.5,
        // بيانات إضافية
        user_id: t.users?.id,
        avatar_url: t.users?.avatar_url,
        city: t.users?.city,
        years_of_experience: t.years_of_experience,
        is_verified: t.is_verified,
      }
    })

    // تطبيق الفلاتر
    let filteredTeachers = teachers

    if (filters?.subject) {
      filteredTeachers = filteredTeachers.filter(t => 
        t.subject.includes(filters.subject!)
      )
    }

    if (filters?.lessonType) {
      filteredTeachers = filteredTeachers.filter(t => 
        t.lessonType === filters.lessonType || t.lessonType === 'both'
      )
    }

    if (filters?.minPrice !== undefined) {
      filteredTeachers = filteredTeachers.filter(t => 
        Number(t.price) >= filters.minPrice!
      )
    }

    if (filters?.maxPrice !== undefined) {
      filteredTeachers = filteredTeachers.filter(t => 
        Number(t.price) <= filters.maxPrice!
      )
    }

    return filteredTeachers
  } catch (error) {
    console.error('Error fetching teachers:', error)
    throw error
  }
}

// ============================================
// جلب مدرس واحد بالتفصيل
// ============================================

export async function getTeacherById(teacherId: string) {
  try {
    const { data, error } = await supabase
      .from('teachers')
      .select(`
        *,
        users (
          full_name,
          email,
          phone,
          avatar_url,
          bio,
          city,
          is_verified
        ),
        teacher_subjects (
          subject_id,
          grade_ids,
          curriculum_ids,
          years_teaching,
          proficiency_level,
          subjects (
            name_ar,
            name_en,
            code
          )
        ),
        teacher_pricing (
          online_price_per_hour,
          home_price_per_hour,
          package_4_sessions_price,
          package_8_sessions_price,
          has_free_trial
        ),
        teacher_availability (
          day_of_week,
          start_time,
          end_time,
          availability_type,
          is_available
        )
      `)
      .eq('id', teacherId)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching teacher:', error)
    throw error
  }
}

// ============================================
// البحث عن مدرسين
// ============================================

export async function searchTeachers(searchTerm: string) {
  try {
    const { data, error } = await supabase
      .from('teachers')
      .select(`
        id,
        specialization,
        users!inner (
          full_name,
          avatar_url,
          city
        ),
        teacher_subjects (
          subjects (
            name_ar
          )
        )
      `)
      .eq('is_verified', true)
      .or(`users.full_name.ilike.%${searchTerm}%,specialization.ilike.%${searchTerm}%`)
      .limit(20)

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error searching teachers:', error)
    throw error
  }
}

// ============================================
// جلب المدرسين المميزين
// ============================================

export async function getFeaturedTeachers(limit = 6) {
  try {
    const { data, error } = await supabase
      .from('teachers')
      .select(`
        id,
        rating,
        total_students,
        specialization,
        users (
          full_name,
          avatar_url,
          city
        )
      `)
      .eq('is_verified', true)
      .eq('is_accepting_students', true)
      .gte('rating', 4.5)
      .order('total_students', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching featured teachers:', error)
    throw error
  }
}

// ============================================
// جلب تقييمات المدرس
// ============================================

export async function getTeacherReviews(teacherId: string, limit = 10) {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        students (
          users (
            full_name,
            avatar_url
          )
        )
      `)
      .eq('teacher_id', teacherId)
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching reviews:', error)
    throw error
  }
}
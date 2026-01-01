import { supabase } from './supabase'

// جميع الأدوار المتاحة
export type UserRole = 'student' | 'teacher' | 'center' | 'service' | 'moderator' | 'admin'

// الأدوار العامة (للتسجيل العادي)
export type PublicRole = 'student' | 'teacher' | 'center' | 'service'

// أدوار الإدارة (تحتاج ضغطتين)
export type AdminRole = 'moderator' | 'admin'

export interface UserProfile {
  id: string
  email: string
  full_name: string
  role: UserRole
  phone?: string
  avatar_url?: string
  created_at: string
  profile_completed?: boolean
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  
  if (error) throw error
  return data
}

export async function signUp(
  email: string, 
  password: string, 
  fullName: string,
  role: UserRole = 'student',
  additionalData?: {
    centerName?: string
    providerName?: string
    serviceTypes?: string[]
    department?: string
    permissions?: any
  }
) {
  try {
    console.log('🔵 1. Starting signUp with:', { email, fullName, role })
    
    // 1. إنشاء المستخدم في Auth
    console.log('🔵 2. Calling supabase.auth.signUp...')
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: role,
        }
      }
    })
    
    console.log('🔵 3. Auth signup response:', {
      hasData: !!authData,
      hasUser: !!authData?.user,
      userId: authData?.user?.id,
      userEmail: authData?.user?.email,
      hasError: !!authError,
      errorMessage: authError?.message,
      errorStatus: authError?.status,
      userConfirmed: authData?.user?.confirmed_at,
      identitiesLength: authData?.user?.identities?.length
    })
    
    if (authError) {
      console.error('❌ 4. Auth error:', authError)
      throw authError
    }
    
    if (!authData.user) {
      console.error('❌ 5. No user returned from auth')
      throw new Error('فشل في إنشاء المستخدم')
    }

    console.log('✅ 6. Auth user created successfully:', authData.user.id)

    // 2. إنشاء سجل في جدول users
    console.log('🔵 7. Creating user record in users table...')
    const userInsertData = {
      auth_id: authData.user.id,
      email: email,
      full_name: fullName,
      user_type: role,
      is_active: true,
    }
    console.log('🔵 8. User insert data:', userInsertData)
    
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert(userInsertData)
      .select('id')
      .maybeSingle()
    
    console.log('🔵 9. Users table insert response:', {
      hasData: !!userData,
      userId: userData?.id,
      hasError: !!userError,
      errorMessage: userError?.message,
      errorCode: userError?.code,
      errorDetails: userError?.details,
      errorHint: userError?.hint
    })
    
    if (userError) {
      console.error('❌ 10. User table error:', userError)
      throw new Error(`فشل في إنشاء حساب المستخدم: ${userError.message}`)
    }
    
    if (!userData) {
      console.error('❌ 11. No user data returned from insert')
      throw new Error('فشل في إنشاء حساب المستخدم')
    }

    console.log('✅ 12. User record created successfully:', userData.id)

    // 3. إنشاء سجل في الجدول المخصص
    console.log(`🔵 13. Creating ${role} profile...`)
    try {
      if (role === 'student') {
        await createStudentProfile(userData.id)
      } else if (role === 'teacher') {
        await createTeacherProfile(userData.id)
      } else if (role === 'center') {
        await createCenterProfile(userData.id, additionalData?.centerName || fullName)
      } else if (role === 'service') {
        await createServiceProfile(userData.id, additionalData)
      } else if (role === 'moderator' || role === 'admin') {
        await createAdminProfile(userData.id, role, additionalData)
      }
      console.log(`✅ 14. ${role} profile created successfully`)
    } catch (error: any) {
      console.error(`❌ 15. Profile creation error for ${role}:`, error)
      throw new Error(`فشل في إنشاء ملف ${getRoleNameAr(role)}: ${error.message}`)
    }
    
    console.log('🎉 16. Signup completed successfully!')
    return authData
    
  } catch (error: any) {
    console.error('💥 17. Final signup error:', {
      message: error.message,
      error: error,
      stack: error.stack
    })
    throw error
  }
}

async function createStudentProfile(userId: string) {
  console.log('🔵 Creating student profile for user:', userId)
  const { error } = await supabase
    .from('students')
    .insert({
      user_id: userId,
      total_sessions: 0,
      total_spent: 0,
    })
  
  if (error) {
    console.error('❌ Student profile error:', error)
    throw error
  }
  console.log('✅ Student profile created')
}

async function createTeacherProfile(userId: string) {
  console.log('🔵 Creating teacher profile for user:', userId)
  const { error } = await supabase
    .from('teachers')
    .insert({
      user_id: userId,
      teacher_type: 'both',
      rating: 0,
      total_reviews: 0,
      total_students: 0,
      total_sessions: 0,
      is_accepting_students: false,
      years_of_experience: 0,
    })
  
  if (error) {
    console.error('❌ Teacher profile error:', error)
    throw error
  }
  console.log('✅ Teacher profile created')
}

async function createCenterProfile(userId: string, centerName: string) {
  console.log('🔵 Creating center profile for user:', userId)
  const { error } = await supabase
    .from('educational_centers')
    .insert({
      user_id: userId,
      center_name: centerName,
      rating: 0,
      total_reviews: 0,
      total_students: 0,
      total_courses: 0,
      is_verified: false,
      is_active: true,
    })
  
  if (error) {
    console.error('❌ Center profile error:', error)
    throw error
  }
  console.log('✅ Center profile created')
}

async function createServiceProfile(userId: string, additionalData?: any) {
  console.log('🔵 Creating service profile for user:', userId)
  const { error } = await supabase
    .from('educational_services')
    .insert({
      user_id: userId,
      provider_name: additionalData?.providerName || '',
      service_types: additionalData?.serviceTypes || ['أبحاث علمية'],
      rating: 0,
      total_reviews: 0,
      total_orders: 0,
      completed_orders: 0,
      is_verified: false,
      is_accepting_orders: false,
    })
  
  if (error) {
    console.error('❌ Service profile error:', error)
    throw error
  }
  console.log('✅ Service profile created')
}

async function createAdminProfile(userId: string, role: 'moderator' | 'admin', additionalData?: any) {
  console.log('🔵 Creating admin profile for user:', userId)
  const { error } = await supabase
    .from('admins')
    .insert({
      user_id: userId,
      role: role,
      department: additionalData?.department || '',
      permissions: additionalData?.permissions || {},
      is_active: true,
    })
  
  if (error) {
    console.error('❌ Admin profile error:', error)
    throw error
  }
  console.log('✅ Admin profile created')
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getUserProfile(authUserId: string): Promise<UserProfile | null> {
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('auth_id', authUserId)
    .maybeSingle() 
  
  if (userError || !userData) {
    console.error('User data fetch error:', userError)
    return null
  }

  const userRole = userData.user_type as UserRole

  let profileCompleted = false
  
  if (userRole === 'student') {
    profileCompleted = await checkStudentComplete(userData.id)
  } else if (userRole === 'teacher') {
    profileCompleted = await checkTeacherComplete(userData.id)
  } else if (userRole === 'center') {
    profileCompleted = await checkCenterComplete(userData.id)
  } else if (userRole === 'service') {
    profileCompleted = await checkServiceComplete(userData.id)
  } else if (userRole === 'moderator' || userRole === 'admin') {
    profileCompleted = true
  }
  
  return {
    id: userData.id,
    email: userData.email,
    full_name: userData.full_name,
    role: userRole,
    phone: userData.phone,
    avatar_url: userData.avatar_url,
    created_at: userData.created_at,
    profile_completed: profileCompleted,
  }
}

async function checkStudentComplete(userId: string): Promise<boolean> {
  const { data } = await supabase
    .from('students')
    .select('date_of_birth, education_level, gender')
    .eq('user_id', userId)
    .maybeSingle()
  
  return !!(data?.date_of_birth && data?.education_level && data?.gender)
}

async function checkTeacherComplete(userId: string): Promise<boolean> {
  const { data: teacherData } = await supabase
    .from('teachers')
    .select(`
      specialization,
      years_of_experience,
      teacher_subjects (count)
    `)
    .eq('user_id', userId)
    .maybeSingle()
  
  const hasSubjects = teacherData?.teacher_subjects?.[0]?.count > 0
  return !!(
    teacherData?.specialization &&
    teacherData?.years_of_experience > 0 &&
    hasSubjects
  )
}

async function checkCenterComplete(userId: string): Promise<boolean> {
  const { data } = await supabase
    .from('educational_centers')
    .select('center_name, center_type, contact_phone')
    .eq('user_id', userId)
    .maybeSingle()
  
  return !!(data?.center_name && data?.center_type && data?.contact_phone)
}

async function checkServiceComplete(userId: string): Promise<boolean> {
  const { data } = await supabase
    .from('educational_services')
    .select('provider_name, service_types')
    .eq('user_id', userId)
    .maybeSingle()
  
  return !!(data?.provider_name && data?.service_types && data.service_types.length > 0)
}

export async function updateProfile(userId: string, updates: Partial<UserProfile>) {
  const { error } = await supabase
    .from('users')
    .update({
      full_name: updates.full_name,
      phone: updates.phone,
      avatar_url: updates.avatar_url,
    })
    .eq('id', userId)
  
  if (error) throw error
}

export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  })
  
  if (error) throw error
}

export function getRoleNameAr(role: UserRole): string {
  const names: Record<UserRole, string> = {
    student: 'الطالب',
    teacher: 'المدرس',
    center: 'المركز التعليمي',
    service: 'مقدم الخدمة',
    moderator: 'المشرف',
    admin: 'المدير',
  }
  return names[role]
}

export function getRoleNameEn(role: UserRole): string {
  const names: Record<UserRole, string> = {
    student: 'Student',
    teacher: 'Teacher',
    center: 'Educational Center',
    service: 'Service Provider',
    moderator: 'Moderator',
    admin: 'Administrator',
  }
  return names[role]
}

export function isAdminRole(role: UserRole): boolean {
  return role === 'admin' || role === 'moderator'
}

export function hasPermission(userRole: UserRole, requiredRole: UserRole): boolean {
  const hierarchy: Record<UserRole, number> = {
    student: 0,
    teacher: 0,
    center: 0,
    service: 0,
    moderator: 1,
    admin: 2,
  }
  
  return hierarchy[userRole] >= hierarchy[requiredRole]
}
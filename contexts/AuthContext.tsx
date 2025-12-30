"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { getUserProfile, signOut as authSignOut, UserProfile, createClient } from '@/lib/auth'

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const loadProfile = async (userId: string) => {
    try {
      const userProfile = await getUserProfile(userId)
      setProfile(userProfile)
      
      // التحقق من اكتمال البيانات وإعادة التوجيه
      if (userProfile && !userProfile.profile_completed) {
        const onboardingRoutes: Record<string, string> = {
          student: '/student/onboarding',
          teacher: '/teacher/onboarding',
          center: '/center/onboarding',
          service: '/service/onboarding',
        }
        
        const route = onboardingRoutes[userProfile.role]
        if (route) {
          router.push(route)
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error)
      setProfile(null)
    }
  }

  const refreshProfile = async () => {
    if (user) {
      await loadProfile(user.id)
    }
  }

  useEffect(() => {
    const supabase = createClient()
    
    // الحصول على الجلسة الحالية
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        loadProfile(session.user.id)
      }
      setLoading(false)
    })

    // الاستماع لتغيرات المصادقة
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)
      
      if (session?.user) {
        await loadProfile(session.user.id)
      } else {
        setProfile(null)
      }
      
      setLoading(false)

      // إعادة التوجيه التلقائي
      if (event === 'SIGNED_OUT') {
        router.push('/')
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router])

  const handleSignOut = async () => {
    await authSignOut()
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signOut: handleSignOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react"
import { User } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"
import { getUserProfile, signOut as authSignOut, UserProfile } from "@/lib/auth"

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  initialized: boolean
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [initialized, setInitialized] = useState(false)

  const loadProfile = async (userId: string) => {
    try {
      const userProfile = await getUserProfile(userId)
      setProfile(userProfile)
    } catch (err) {
      console.error("Load profile error:", err)
      setProfile(null)
    }
  }

  const refreshProfile = async () => {
    if (user) await loadProfile(user.id)
  }

  useEffect(() => {
    let mounted = true

    const init = async () => {
      const { data } = await supabase.auth.getSession()
      if (!mounted) return

      const sessionUser = data.session?.user ?? null
      setUser(sessionUser)

      if (sessionUser) {
        await loadProfile(sessionUser.id)
      }

      setLoading(false)
      setInitialized(true)
    }

    init()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return

      const sessionUser = session?.user ?? null
      setUser(sessionUser)

      if (sessionUser) {
        await loadProfile(sessionUser.id)
      } else {
        setProfile(null)
      }

      setLoading(false)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const handleSignOut = async () => {
    await authSignOut()
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        initialized,
        signOut: handleSignOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return ctx
}

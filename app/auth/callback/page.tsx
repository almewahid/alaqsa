import { Suspense } from 'react'
import AuthCallbackClient from './AuthCallbackClient'

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            جاري تسجيل الدخول...
          </h2>
        </div>
      </div>
    }>
      <AuthCallbackClient />
    </Suspense>
  )
}
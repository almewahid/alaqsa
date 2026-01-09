"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Bell,
  BookOpen,
  Calendar,
  MessageSquare,
  Settings,
  User,
  Video,
  Clock,
  CheckCircle,
  XCircle,
  Menu,
  X,
} from "lucide-react"
import { supabase } from "@/lib/supabase"

// بيانات الجلسات القادمة
const upcomingSessions = [
  {
    id: 1,
    teacher: "د. سارة أحمد",
    subject: "الرياضيات",
    date: "2024-01-15",
    time: "14:00",
    status: "مجدولة" as const,
  },
  {
    id: 2,
    teacher: "أ. محمد علي",
    subject: "الفيزياء",
    date: "2024-01-16",
    time: "16:30",
    status: "مجدولة" as const,
  },
  {
    id: 3,
    teacher: "د. فاطمة حسن",
    subject: "الكيمياء",
    date: "2024-01-17",
    time: "10:00",
    status: "ملغاة" as const,
  },
]

// بيانات الإعلانات
const announcements = [
  {
    id: 1,
    title: "تحديث في جدول الحصص",
    message: "تم تعديل موعد حصة الرياضيات لتصبح يوم الثلاثاء بدلاً من الاثنين",
    date: "2024-01-10",
  },
  {
    id: 2,
    title: "صيانة النظام",
    message: "سيتم إجراء صيانة يوم الجمعة من الساعة 1 صباحاً حتى 3 صباحاً",
    date: "2024-01-12",
  },
]

// روابط القائمة الجانبية
const sidebarItems = [
  { icon: User, label: "الملف الشخصي", href: "/profile" },
  { icon: BookOpen, label: "جلساتي", href: "/sessions" },
  { icon: Calendar, label: "الحجوزات", href: "/bookings" },
  { icon: MessageSquare, label: "الرسائل", href: "/messages" },
  { icon: Settings, label: "الإعدادات", href: "/settings" },
]

// ألوان الحالات
const getStatusColor = (status: string) => {
  switch (status) {
    case "مجدولة":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
    case "مكتملة":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
    case "ملغاة":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 line-through"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
  }
}

// أيقونات الحالات
const getStatusIcon = (status: string) => {
  switch (status) {
    case "مجدولة":
      return <Clock className="h-3 w-3" />
    case "مكتملة":
      return <CheckCircle className="h-3 w-3" />
    case "ملغاة":
      return <XCircle className="h-3 w-3" />
    default:
      return null
  }
}

export default function StudentDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  
  // بيانات الطالب من قاعدة البيانات
  const [studentData, setStudentData] = useState({
    name: "...",
    completedSessions: 0,
    upcomingSessions: 0,
    overallProgress: 0,
  })

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // احصل على المستخدم الحالي
        const { data: { user } } = await supabase.auth.getUser()
        
        if (user) {
          // احصل على بيانات المستخدم
          const { data, error } = await supabase
            .from("users")
            .select("full_name")
            .eq("auth_id", user.id)
            .single()

          if (data && !error) {
            setStudentData(prev => ({
              ...prev,
              name: data.full_name,
              completedSessions: 24,
              upcomingSessions: 3,
              overallProgress: 78,
            }))
          }
        }
      } catch (error) {
        console.error("❌ Error fetching user:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex" dir="rtl">
      {/* خلفية القائمة الجانبية للجوال */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* الشريط الجانبي */}
      <aside
        className={`
          fixed top-0 right-0 z-50 h-full w-64 bg-sidebar border-l border-sidebar-border transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "translate-x-full"}
          lg:translate-x-0 lg:static lg:z-auto
        `}
      >
        <div className="flex h-full flex-col">
          {/* رأس القائمة */}
          <div className="flex items-center justify-between p-6 border-b border-sidebar-border">
            <h2 className="text-lg font-semibold text-sidebar-foreground">لوحة التحكم</h2>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* روابط القائمة */}
          <nav className="flex-1 p-4 space-y-2">
            {sidebarItems.map((item) => (
              <Button
                key={item.label}
                variant="ghost"
                className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                asChild
              >
                <a href={item.href}>
                  <item.icon className="ml-2 h-4 w-4" />
                  {item.label}
                </a>
              </Button>
            ))}
          </nav>
        </div>
      </aside>

      {/* المحتوى الرئيسي */}
      <div className="flex-1">
        {/* الشريط العلوي */}
        <header className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-4 w-4" />
              </Button>
              <h1 className="text-xl font-semibold">
                مرحباً، {studentData.name}
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -left-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </Button>
              <Avatar className="bg-primary text-white">
                <AvatarFallback>
                  {studentData.name.slice(0, 2)}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* محتوى اللوحة */}
        <main className="p-6 space-y-6">
          {/* بطاقة الترحيب والإحصائيات */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                👋 مرحباً بك، {studentData.name}!
              </CardTitle>
              <CardDescription>
                لديك {studentData.upcomingSessions} جلسة قادمة هذا الأسبوع
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-primary flex items-center justify-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    {studentData.completedSessions}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    جلسة مكتملة
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-600 flex items-center justify-center gap-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    {studentData.upcomingSessions}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    جلسة قادمة
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-600">
                    {studentData.overallProgress}%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    التقدم العام
                  </div>
                  <Progress value={studentData.overallProgress} className="mt-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* الجلسات القادمة */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  الجلسات القادمة
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingSessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg"
                  >
                    <div className="space-y-1">
                      <div className="font-medium">{session.subject}</div>
                      <div className="text-sm text-muted-foreground">
                        {session.teacher}
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {session.date} - {session.time}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(session.status)}>
                        {getStatusIcon(session.status)}
                        <span className="mr-1">{session.status}</span>
                      </Badge>
                      {session.status === "مجدولة" && (
                        <Button size="sm" className="gap-1">
                          <Video className="h-3 w-3" />
                          انضمام
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* الإعلانات والتنبيهات */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  الإعلانات والتنبيهات
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {announcements.map((announcement, index) => (
                  <div key={announcement.id}>
                    <div className="space-y-2">
                      <div className="font-medium">{announcement.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {announcement.message}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {announcement.date}
                      </div>
                    </div>
                    {index < announcements.length - 1 && (
                      <Separator className="mt-4" />
                    )}
                  </div>
                ))}
                <div className="flex justify-end">
                  <Button variant="link" className="text-sm text-primary">
                    عرض الكل
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
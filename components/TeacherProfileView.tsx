"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  User,
  BookOpen,
  Clock,
  DollarSign,
  Award,
  Star,
  Heart,
  ArrowRight,
  MapPin,
  Calendar,
  MessageCircle,
} from "lucide-react"

interface TeacherProfileViewProps {
  teacherId: string
  teacherData?: any
}

export default function TeacherProfileView({ teacherId, teacherData }: TeacherProfileViewProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [activeSection, setActiveSection] = useState("personal")
  const [loading, setLoading] = useState(!teacherData)

  useEffect(() => {
    if (!teacherData) {
      setLoading(false)
    }
  }, [teacherData])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">جاري تحميل بيانات المدرس...</p>
        </div>
      </div>
    )
  }

  if (!teacherData) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600">المدرس غير موجود</p>
          <Button className="mt-4" onClick={() => window.history.back()}>
            <ArrowRight className="w-4 h-4 ml-2" />
            العودة
          </Button>
        </div>
      </div>
    )
  }

  const teacher = teacherData
  const teacherName = teacher.users?.full_name || "مدرس"
  const teacherBio = teacher.users?.bio || "لا توجد نبذة تعريفية"
  const teacherCity = teacher.users?.city || "غير محدد"
  const teacherRating = teacher.rating || 0
  const totalReviews = teacher.total_reviews || 0
  const totalStudents = teacher.total_students || 0
  const totalSessions = teacher.total_sessions || 0
  const yearsExperience = teacher.years_of_experience || 0
  const isVerified = teacher.is_verified || false

  const sidebarItems = [
    { id: "personal", label: "البيانات الشخصية", icon: User, color: "text-blue-600" },
    { id: "bio", label: "النبذة التعريفية", icon: BookOpen, color: "text-purple-600" },
    { id: "schedule", label: "الأوقات المتاحة", icon: Clock, color: "text-orange-600" },
    { id: "subjects", label: "المناهج والمواد", icon: BookOpen, color: "text-teal-600" },
    { id: "pricing", label: "الأسعار", icon: DollarSign, color: "text-green-600" },
    { id: "experience", label: "الخبرات والشهادات", icon: Award, color: "text-indigo-600" },
    { id: "reviews", label: "التقييمات", icon: Star, color: "text-yellow-600" },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-4" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            className="mb-4"
          >
            <ArrowRight className="w-4 h-4 ml-2" />
            العودة
          </Button>

          {/* Teacher Card Header */}
          <Card className="rounded-xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-32"></div>
            <CardContent className="relative pt-0 pb-6">
              {/* Avatar */}
              <div className="flex flex-col md:flex-row items-center md:items-end gap-4 -mt-16">
                <div className="w-32 h-32 rounded-full bg-white border-4 border-white shadow-lg flex items-center justify-center text-4xl font-bold text-blue-600">
                  {teacherName.charAt(0)}
                </div>
                
                <div className="flex-1 text-center md:text-right mt-4 md:mt-0">
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                    <h1 className="text-3xl font-bold">{teacherName}</h1>
                    {isVerified && (
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        ✓ موثق
                      </span>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {teacherCity}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      {teacherRating.toFixed(1)} ({totalReviews} تقييم)
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {totalStudents} طالب
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      {totalSessions} حصة
                    </div>
                    <div className="flex items-center gap-1">
                      <Award className="w-4 h-4" />
                      {yearsExperience} سنة خبرة
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant={isFavorite ? "default" : "outline"}
                    onClick={() => setIsFavorite(!isFavorite)}
                    className="flex items-center gap-2"
                  >
                    <Heart className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
                    المفضلة
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Calendar className="w-4 h-4 ml-2" />
                    احجز الآن
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="rounded-xl sticky top-4">
              <CardContent className="p-4">
                <nav className="space-y-2">
                  {sidebarItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveSection(item.id)}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg text-right transition-colors ${
                          activeSection === item.id
                            ? "bg-blue-100 text-blue-600 font-medium"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        <span className="flex-1">{item.label}</span>
                        <Icon className={`w-4 h-4 ${item.color}`} />
                      </button>
                    )
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="rounded-xl">
              <CardContent className="p-6">
                {activeSection === "personal" && (
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold mb-4">البيانات الشخصية</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">الاسم الكامل</p>
                        <p className="font-semibold">{teacherName}</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">المدينة</p>
                        <p className="font-semibold">{teacherCity}</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">سنوات الخبرة</p>
                        <p className="font-semibold">{yearsExperience} سنة</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">نوع التدريس</p>
                        <p className="font-semibold">
                          {teacher.teacher_type === "online" ? "أونلاين" : 
                           teacher.teacher_type === "home" ? "منزلي" : "أونلاين ومنزلي"}
                        </p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">عدد الطلاب</p>
                        <p className="font-semibold">{totalStudents} طالب</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">عدد الحصص</p>
                        <p className="font-semibold">{totalSessions} حصة</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === "bio" && (
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold mb-4">النبذة التعريفية</h2>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{teacherBio}</p>
                  </div>
                )}

                {activeSection === "subjects" && (
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold mb-4">المواد الدراسية</h2>
                    {teacher.teacher_subjects && teacher.teacher_subjects.length > 0 ? (
                      <div className="grid md:grid-cols-2 gap-4">
                        {teacher.teacher_subjects.map((ts: any, idx: number) => (
                          <div key={idx} className="p-4 border rounded-lg hover:shadow-md transition">
                            <h3 className="font-semibold text-lg mb-2">
                              {ts.subjects?.name_ar || "مادة"}
                            </h3>
                            <p className="text-sm text-gray-600">
                              سنوات التدريس: {ts.years_teaching || 0} سنة
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              المستوى: {ts.proficiency_level === 'expert' ? 'خبير' : 
                                        ts.proficiency_level === 'advanced' ? 'متقدم' : 'جيد'}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">لا توجد مواد مضافة</p>
                    )}
                  </div>
                )}

                {activeSection === "pricing" && (
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold mb-4">الأسعار</h2>
                    {teacher.teacher_pricing && teacher.teacher_pricing.length > 0 ? (
                      <div className="grid md:grid-cols-2 gap-4">
                        {teacher.teacher_pricing[0].online_price_per_hour && (
                          <div className="p-6 border-2 border-blue-200 rounded-lg text-center hover:shadow-lg transition">
                            <p className="text-sm text-gray-600 mb-2">حصة أونلاين</p>
                            <p className="text-3xl font-bold text-blue-600">
                              {teacher.teacher_pricing[0].online_price_per_hour} د.ك
                            </p>
                            <p className="text-xs text-gray-500 mt-1">للساعة</p>
                          </div>
                        )}
                        {teacher.teacher_pricing[0].home_price_per_hour && (
                          <div className="p-6 border-2 border-green-200 rounded-lg text-center hover:shadow-lg transition">
                            <p className="text-sm text-gray-600 mb-2">حصة منزلية</p>
                            <p className="text-3xl font-bold text-green-600">
                              {teacher.teacher_pricing[0].home_price_per_hour} د.ك
                            </p>
                            <p className="text-xs text-gray-500 mt-1">للساعة</p>
                          </div>
                        )}
                        {teacher.teacher_pricing[0].package_4_sessions_price && (
                          <div className="p-6 border-2 border-purple-200 rounded-lg text-center hover:shadow-lg transition">
                            <p className="text-sm text-gray-600 mb-2">باقة 4 حصص</p>
                            <p className="text-3xl font-bold text-purple-600">
                              {teacher.teacher_pricing[0].package_4_sessions_price} د.ك
                            </p>
                            <p className="text-xs text-gray-500 mt-1">وفّر {
                              ((teacher.teacher_pricing[0].online_price_per_hour * 4 - teacher.teacher_pricing[0].package_4_sessions_price) / (teacher.teacher_pricing[0].online_price_per_hour * 4) * 100).toFixed(0)
                            }%</p>
                          </div>
                        )}
                        {teacher.teacher_pricing[0].package_8_sessions_price && (
                          <div className="p-6 border-2 border-orange-200 rounded-lg text-center hover:shadow-lg transition">
                            <p className="text-sm text-gray-600 mb-2">باقة 8 حصص</p>
                            <p className="text-3xl font-bold text-orange-600">
                              {teacher.teacher_pricing[0].package_8_sessions_price} د.ك
                            </p>
                            <p className="text-xs text-gray-500 mt-1">وفّر {
                              ((teacher.teacher_pricing[0].online_price_per_hour * 8 - teacher.teacher_pricing[0].package_8_sessions_price) / (teacher.teacher_pricing[0].online_price_per_hour * 8) * 100).toFixed(0)
                            }%</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-500">لم يتم تحديد الأسعار بعد</p>
                    )}
                  </div>
                )}

                {activeSection === "reviews" && (
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold mb-4">التقييمات</h2>
                    <div className="text-center py-12">
                      <Star className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                      <p className="text-gray-500">لا توجد تقييمات حالياً</p>
                      <p className="text-sm text-gray-400 mt-2">كن أول من يقيّم هذا المدرس</p>
                    </div>
                  </div>
                )}

                {activeSection === "schedule" && (
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold mb-4">الأوقات المتاحة</h2>
                    <div className="text-center py-12">
                      <Clock className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                      <p className="text-gray-500">هذا القسم قيد التطوير</p>
                    </div>
                  </div>
                )}

                {activeSection === "experience" && (
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold mb-4">الخبرات والشهادات</h2>
                    <div className="text-center py-12">
                      <Award className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                      <p className="text-gray-500">هذا القسم قيد التطوير</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="mt-8 flex gap-4 justify-center flex-wrap">
          <Button size="lg" className="flex items-center gap-2 px-8 bg-blue-600 hover:bg-blue-700">
            <Calendar className="w-5 h-5" />
            احجز الآن
          </Button>
          <Button variant="outline" size="lg" className="flex items-center gap-2 px-8">
            <MessageCircle className="w-5 h-5" />
            راسلني
          </Button>
        </div>
      </div>
    </div>
  )
}
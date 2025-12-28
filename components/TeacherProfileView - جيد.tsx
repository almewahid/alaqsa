"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Star,
  Heart,
  Calendar,
  MessageCircle,
  User,
  MapPin,
  Phone,
  Mail,
  BookOpen,
  Clock,
  DollarSign,
  Award,
  GraduationCap,
  Briefcase as Certificate,
  Users,
} from "lucide-react"

interface TeacherData {
  name: string
  address: string
  phone: string
  email: string
  shortBio: string
  detailedBio: string
  videoUrl: string
  availableTimes: {
    day: string
    times: string[]
  }[]
  holidays: string[]
  subjects: string[]
  grades: string[]
  curricula: string[]
  pricing: {
    singleSession: number
    eightSessions: number
    twelveSessions: number
  }
  discounts?: {
    enabled: boolean
    type: "all" | "specific"
    percentage: number
  }
  experiences: {
    type: "certificate" | "course" | "degree"
    title: string
    institution: string
    year: string
  }[]
  rating: number
  totalReviews: number
  reviews: {
    studentName: string
    rating: number
    comment: string
    date: string
  }[]
}

const mockTeacherData: TeacherData = {
  name: "أحمد محمد علي",
  address: "القاهرة، مصر",
  phone: "+20 123 456 7890",
  email: "ahmed.mohamed@example.com",
  shortBio: "مدرس رياضيات متخصص مع خبرة 10 سنوات في تدريس المناهج المصرية والدولية",
  detailedBio:
    "أستاذ رياضيات حاصل على ماجستير في الرياضيات التطبيقية من جامعة القاهرة. لدي خبرة واسعة في تدريس جميع المراحل التعليمية من الابتدائية حتى الثانوية العامة. أتميز بأسلوب تدريس مبسط وفعال يساعد الطلاب على فهم المفاهيم الرياضية بسهولة. حققت نتائج ممتازة مع طلابي في الامتحانات النهائية والدولية.",
  videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  availableTimes: [
    { day: "السبت", times: ["9:00 ص", "11:00 ص", "2:00 م", "4:00 م"] },
    { day: "الأحد", times: ["10:00 ص", "12:00 م", "3:00 م"] },
    { day: "الاثنين", times: ["9:00 ص", "11:00 ص", "2:00 م", "4:00 م"] },
    { day: "الثلاثاء", times: ["10:00 ص", "1:00 م", "3:00 م"] },
    { day: "الأربعاء", times: ["9:00 ص", "11:00 ص", "2:00 م"] },
    { day: "الخميس", times: ["10:00 ص", "12:00 م", "4:00 م"] },
  ],
  holidays: ["الجمعة", "العطل الرسمية"],
  subjects: ["الرياضيات", "الجبر", "الهندسة", "التفاضل والتكامل"],
  grades: ["الصف السادس", "الإعدادية", "الثانوية العامة"],
  curricula: ["المنهج المصري", "المنهج الأمريكي", "المنهج البريطاني"],
  pricing: {
    singleSession: 150,
    eightSessions: 1100,
    twelveSessions: 1500,
  },
  discounts: {
    enabled: true,
    type: "all",
    percentage: 10,
  },
  experiences: [
    {
      type: "degree",
      title: "ماجستير الرياضيات التطبيقية",
      institution: "جامعة القاهرة",
      year: "2018",
    },
    {
      type: "certificate",
      title: "شهادة تدريس المناهج الدولية",
      institution: "المجلس الثقافي البريطاني",
      year: "2020",
    },
    {
      type: "course",
      title: "دورة طرق التدريس الحديثة",
      institution: "أكاديمية التعليم المتطور",
      year: "2021",
    },
  ],
  rating: 4.8,
  totalReviews: 127,
  reviews: [
    {
      studentName: "سارة أحمد",
      rating: 5,
      comment: "أستاذ ممتاز، شرحه واضح ومبسط. ساعدني كثيراً في فهم الرياضيات",
      date: "2024-01-15",
    },
    {
      studentName: "محمد علي",
      rating: 5,
      comment: "طريقة تدريسه رائعة ومتميزة. أنصح به بشدة",
      date: "2024-01-10",
    },
    {
      studentName: "فاطمة حسن",
      rating: 4,
      comment: "مدرس محترف ومتفهم. الحصص مفيدة جداً",
      date: "2024-01-05",
    },
  ],
}

export default function TeacherProfileScreen() {
  const [isFavorite, setIsFavorite] = useState(false)
  const [activeSection, setActiveSection] = useState("personal")

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? "fill-yellow-400 text-yellow-400"
            : i < rating
              ? "fill-yellow-200 text-yellow-400"
              : "text-gray-300"
        }`}
      />
    ))
  }

  const getExperienceIcon = (type: string) => {
    switch (type) {
      case "degree":
        return <GraduationCap className="w-5 h-5 text-blue-600" />
      case "certificate":
        return <Certificate className="w-5 h-5 text-green-600" />
      case "course":
        return <Award className="w-5 h-5 text-purple-600" />
      default:
        return <Award className="w-5 h-5 text-gray-600" />
    }
  }

  const sidebarItems = [
    { id: "personal", label: "البيانات الشخصية", icon: User },
    { id: "bio", label: "النبذة التعريفية", icon: BookOpen },
    { id: "schedule", label: "الأوقات المتاحة", icon: Clock },
    { id: "subjects", label: "المناهج والمواد", icon: BookOpen },
    { id: "pricing", label: "الأسعار", icon: DollarSign },
    { id: "experience", label: "الخبرات والشهادات", icon: Award },
    { id: "reviews", label: "التقييمات", icon: Star },
  ]

  const renderContent = () => {
    switch (activeSection) {
      case "personal":
        return (
          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-right">
                <User className="w-5 h-5" />
                البيانات الشخصية
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="w-20 h-20">
                  <AvatarFallback className="text-2xl font-bold bg-blue-100 text-blue-600">
                    {mockTeacherData.name
                      .split(" ")
                      .slice(0, 2)
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="text-right">
                  <h2 className="text-2xl font-bold">{mockTeacherData.name}</h2>
                  <p className="text-muted-foreground">مدرس رياضيات</p>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="flex items-center gap-3 justify-end">
                  <span>{mockTeacherData.address}</span>
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex items-center gap-3 justify-end">
                  <span>{mockTeacherData.phone}</span>
                  <Phone className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex items-center gap-3 justify-end">
                  <span>{mockTeacherData.email}</span>
                  <Mail className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        )

      case "bio":
        return (
          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-right">
                <BookOpen className="w-5 h-5" />
                النبذة التعريفية
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-blue-50 rounded-lg text-right">
                <p className="text-blue-800 font-medium">{mockTeacherData.shortBio}</p>
              </div>

              <div className="text-right">
                <h3 className="font-semibold mb-3">التعريف التفصيلي</h3>
                <p className="text-muted-foreground leading-relaxed">{mockTeacherData.detailedBio}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-3 text-right">فيديو تعريفي</h3>
                <div className="aspect-video rounded-lg overflow-hidden">
                  <iframe
                    src={mockTeacherData.videoUrl}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )

      case "schedule":
        return (
          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-right">
                <Clock className="w-5 h-5" />
                الأوقات المتاحة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockTeacherData.availableTimes.map((schedule, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-2 text-right">{schedule.day}</h4>
                    <div className="flex flex-wrap gap-2 justify-end">
                      {schedule.times.map((time, timeIndex) => (
                        <Badge key={timeIndex} variant="secondary" className="text-sm">
                          {time}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="mt-6 p-4 bg-red-50 rounded-lg">
                  <h4 className="font-semibold text-red-800 mb-2 text-right">الأجازات</h4>
                  <div className="flex flex-wrap gap-2 justify-end">
                    {mockTeacherData.holidays.map((holiday, index) => (
                      <Badge key={index} variant="destructive" className="text-sm">
                        {holiday}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )

      case "subjects":
        return (
          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-right">
                <BookOpen className="w-5 h-5" />
                المناهج والمراحل والمواد
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3 text-right">المواد</h3>
                <div className="flex flex-wrap gap-2 justify-end">
                  {mockTeacherData.subjects.map((subject, index) => (
                    <Badge key={index} className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                      <BookOpen className="w-3 h-3 mr-1" />
                      {subject}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3 text-right">المراحل الدراسية</h3>
                <div className="flex flex-wrap gap-2 justify-end">
                  {mockTeacherData.grades.map((grade, index) => (
                    <Badge key={index} variant="secondary">
                      <Users className="w-3 h-3 mr-1" />
                      {grade}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3 text-right">المناهج</h3>
                <div className="flex flex-wrap gap-2 justify-end">
                  {mockTeacherData.curricula.map((curriculum, index) => (
                    <Badge key={index} className="bg-green-100 text-green-800 hover:bg-green-200">
                      <GraduationCap className="w-3 h-3 mr-1" />
                      {curriculum}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )

      case "pricing":
        return (
          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-right">
                <DollarSign className="w-5 h-5" />
                الأسعار
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <Card className="border-2 hover:border-blue-300 transition-colors">
                  <CardContent className="p-6 text-center">
                    <h3 className="font-bold text-lg mb-2">حصة واحدة</h3>
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {mockTeacherData.pricing.singleSession} جنيه
                    </div>
                    <p className="text-sm text-muted-foreground">للحصة الواحدة</p>
                  </CardContent>
                </Card>

                <Card className="border-2 border-blue-500 hover:border-blue-600 transition-colors relative">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-500">الأكثر شعبية</Badge>
                  </div>
                  <CardContent className="p-6 text-center">
                    <h3 className="font-bold text-lg mb-2">8 حصص</h3>
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {mockTeacherData.pricing.eightSessions} جنيه
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {Math.round(mockTeacherData.pricing.eightSessions / 8)} جنيه للحصة
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-2 hover:border-green-300 transition-colors">
                  <CardContent className="p-6 text-center">
                    <h3 className="font-bold text-lg mb-2">12 حصة</h3>
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {mockTeacherData.pricing.twelveSessions} جنيه
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {Math.round(mockTeacherData.pricing.twelveSessions / 12)} جنيه للحصة
                    </p>
                  </CardContent>
                </Card>
              </div>

              {mockTeacherData.discounts?.enabled && (
                <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                  <h3 className="font-semibold text-green-800 mb-2 text-right">خصومات متاحة</h3>
                  <p className="text-green-700 text-right">
                    خصم {mockTeacherData.discounts.percentage}%
                    {mockTeacherData.discounts.type === "all" ? " لجميع الطلاب" : " لطلاب محددين"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )

      case "experience":
        return (
          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-right">
                <Award className="w-5 h-5" />
                الخبرات والشهادات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockTeacherData.experiences.map((exp, index) => (
                  <Card key={index} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-1 text-right">
                          <h3 className="font-semibold">{exp.title}</h3>
                          <p className="text-muted-foreground">{exp.institution}</p>
                          <p className="text-sm text-muted-foreground">{exp.year}</p>
                        </div>
                        {getExperienceIcon(exp.type)}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )

      case "reviews":
        return (
          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-right">
                <Star className="w-5 h-5" />
                التقييمات وآراء الطلبة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6 p-4 bg-yellow-50 rounded-lg text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  {renderStars(mockTeacherData.rating)}
                  <span className="font-bold text-lg">{mockTeacherData.rating}</span>
                </div>
                <p className="text-muted-foreground">من أصل {mockTeacherData.totalReviews} تقييم</p>
              </div>

              <div className="space-y-4">
                {mockTeacherData.reviews.map((review, index) => (
                  <Card key={index} className="border">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="text-right flex-1">
                          <h4 className="font-semibold">{review.studentName}</h4>
                          <p className="text-sm text-muted-foreground">{review.date}</p>
                        </div>
                        <div className="flex items-center gap-1">{renderStars(review.rating)}</div>
                      </div>
                      <p className="text-muted-foreground text-right">{review.comment}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Header with Favorite Button */}
        <div className="mb-6 flex justify-between items-center">
          <Button
            variant={isFavorite ? "default" : "outline"}
            onClick={() => setIsFavorite(!isFavorite)}
            className="flex items-center gap-2"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
            إضافة للمفضلة
          </Button>
          <h1 className="text-3xl font-bold">ملف المدرس</h1>
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
                          activeSection === item.id ? "bg-blue-100 text-blue-700 font-medium" : "hover:bg-gray-100"
                        }`}
                      >
                        <span className="flex-1">{item.label}</span>
                        <Icon className="w-4 h-4" />
                      </button>
                    )
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">{renderContent()}</div>
        </div>

        {/* Bottom Action Buttons */}
        <div className="mt-8 flex gap-4 justify-center">
          <Button size="lg" className="flex items-center gap-2 px-8">
            <Calendar className="w-5 h-5" />
            احجز الآن
          </Button>
          <Button variant="outline" size="lg" className="flex items-center gap-2 px-8 bg-transparent">
            <MessageCircle className="w-5 h-5" />
            راسلني
          </Button>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  User,
  BookOpen,
  Clock,
  DollarSign,
  Award,
  Star,
  Calendar,
  MessageCircle,
  Heart,
  Users,
} from "lucide-react"

import TeacherPersonal from "./teacher/TeacherPersonal"
import TeacherBio from "./teacher/TeacherBio"
import TeacherSchedule from "./teacher/TeacherSchedule"
import TeacherSubjects from "./teacher/TeacherSubjects"
import TeacherPricing from "./teacher/TeacherPricing"
import TeacherExperience from "./teacher/TeacherExperience"
import TeacherReviews from "./teacher/TeacherReviews"
import { TeacherData, mockTeacherData } from "./types"

export default function TeacherProfileScreen({ teacherData }: { teacherData?: TeacherData }) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [activeSection, setActiveSection] = useState("personal")
  const [loading, setLoading] = useState(true)

  // ⏳ Simulate API loading
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500)
    return () => clearTimeout(timer)
  }, [])

  const teacher = teacherData || mockTeacherData

  const sidebarItems = [
    { id: "personal", label: "البيانات الشخصية", icon: User, color: "text-blue-600" },
    { id: "bio", label: "النبذة التعريفية", icon: BookOpen, color: "text-purple-600" },
    { id: "schedule", label: "الأوقات المتاحة", icon: Clock, color: "text-orange-600" },
    { id: "subjects", label: "المناهج والمواد", icon: BookOpen, color: "text-teal-600" },
    { id: "pricing", label: "الأسعار", icon: DollarSign, color: "text-green-600" },
    { id: "experience", label: "الخبرات والشهادات", icon: Award, color: "text-indigo-600" },
    { id: "reviews", label: "التقييمات", icon: Star, color: "text-yellow-600" },
  ]

  const sectionComponents: Record<string, JSX.Element> = {
    personal: <TeacherPersonal teacher={teacher} />,
    bio: <TeacherBio teacher={teacher} />,
    schedule: <TeacherSchedule teacher={teacher} />,
    subjects: <TeacherSubjects teacher={teacher} />,
    pricing: <TeacherPricing teacher={teacher} />,
    experience: <TeacherExperience teacher={teacher} />,
    reviews: <TeacherReviews teacher={teacher} />,
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
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
                          activeSection === item.id
                            ? `bg-${item.color.split("-")[1]}-100 ${item.color} font-medium`
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
            {loading ? (
              <Skeleton className="w-full h-[500px] rounded-lg" />
            ) : (
              sectionComponents[activeSection]
            )}
          </div>
        </div>

        {/* Bottom Actions */}
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

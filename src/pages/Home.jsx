import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { BookOpen, Users, Star, Award, Search, TrendingUp } from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: Users,
      title: "مدرسون متميزون",
      description: "نخبة من أفضل المدرسين المؤهلين",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Star,
      title: "تقييمات موثوقة",
      description: "تقييمات حقيقية من الطلاب",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: Award,
      title: "جودة عالية",
      description: "معايير تدريس عالية الجودة",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: TrendingUp,
      title: "نتائج مضمونة",
      description: "تحسين مستمر في الأداء",
      color: "from-green-500 to-emerald-500"
    }
  ];

  const subjects = [
    { name: "الرياضيات", icon: "➗", count: 45 },
    { name: "الفيزياء", icon: "⚛️", count: 32 },
    { name: "الكيمياء", icon: "🧪", count: 28 },
    { name: "اللغة الإنجليزية", icon: "🌐", count: 56 },
    { name: "اللغة العربية", icon: "📖", count: 41 },
    { name: "القرآن الكريم", icon: "📖", count: 38 },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-32">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm mb-4">
              <BookOpen className="w-4 h-4" />
              <span>منصة التعليم الأولى في المملكة</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              منصة الأقصى التعليمية
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
              اكتشف أفضل المدرسين المؤهلين واحجز حصصك التعليمية بكل سهولة
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
              <Link to={createPageUrl("Teachers")}>
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6 rounded-full shadow-xl">
                  <Search className="w-5 h-5 ml-2" />
                  ابحث عن مدرس الآن
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mt-12 pt-12 border-t border-white/20">
              <div>
                <div className="text-4xl font-bold">150+</div>
                <div className="text-white/80 text-sm mt-1">مدرس متميز</div>
              </div>
              <div>
                <div className="text-4xl font-bold">5000+</div>
                <div className="text-white/80 text-sm mt-1">طالب نشط</div>
              </div>
              <div>
                <div className="text-4xl font-bold">15000+</div>
                <div className="text-white/80 text-sm mt-1">حصة منجزة</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            لماذا منصة الأقصى؟
          </h2>
          <p className="text-gray-600 text-lg">نوفر لك تجربة تعليمية متميزة ومضمونة</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-2 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-6 text-center">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Subjects Section */}
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              المواد الدراسية
            </h2>
            <p className="text-gray-600 text-lg">اختر المادة التي تريد تعلمها</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {subjects.map((subject, index) => (
              <Link key={index} to={createPageUrl("Teachers")}>
                <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer border-2 hover:border-blue-400">
                  <CardContent className="p-6 text-center">
                    <div className="text-5xl mb-3">{subject.icon}</div>
                    <h3 className="font-bold text-gray-900 mb-1">{subject.name}</h3>
                    <p className="text-sm text-gray-500">{subject.count} مدرس</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            جاهز للبدء؟
          </h2>
          <p className="text-xl text-white/90 mb-8">
            ابحث عن المدرس المناسب لك واحجز حصتك الأولى اليوم
          </p>
          <Link to={createPageUrl("Teachers")}>
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6 rounded-full shadow-xl">
              <Search className="w-5 h-5 ml-2" />
              ابدأ الآن
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
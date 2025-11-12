import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Users, Calendar, Heart, Share2, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function TeacherCard({ teacher }) {
  const subjectIcons = {
    "الرياضيات": "➗",
    "الفيزياء": "⚛️",
    "الكيمياء": "🧪",
    "اللغة الإنجليزية": "🌐",
    "اللغة العربية": "📖",
    "القرآن الكريم": "📖",
    "SCIENCE": "🔬",
    "الأحياء": "🧬",
    "التاريخ": "📜",
    "الجغرافيا": "🗺️"
  };

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-300 group">
      {teacher.is_featured && (
        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold py-1 px-3 text-center">
          ⭐ مدرس مميز
        </div>
      )}
      
      <CardHeader className="p-4 pb-2">
        <div className="flex items-start gap-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              {teacher.image_url ? (
                <img src={teacher.image_url} alt={teacher.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                teacher.name.charAt(0)
              )}
            </div>
            {teacher.teaching_type === "أونلاين" && (
              <div className="absolute -bottom-1 -right-1 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full border-2 border-white">
                أونلاين
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-1">{teacher.name}</h3>
            <div className="flex items-center gap-2 mb-2">
              {teacher.subjects?.slice(0, 2).map((subject, idx) => (
                <span key={idx} className="text-2xl">{subjectIcons[subject] || "📚"}</span>
              ))}
              <span className="text-sm text-gray-600 font-medium">
                {teacher.subjects?.[0]}
              </span>
            </div>
            <p className="text-sm text-gray-600 line-clamp-2">{teacher.description}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-2 space-y-3">
        {/* التقييم والإحصائيات */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-bold">{teacher.rating || 5.0}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-600">
              <Users className="w-4 h-4" />
              <span>{teacher.total_students || 0} طالب</span>
            </div>
            <div className="flex items-center gap-1 text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>{teacher.total_sessions || 0} حصة</span>
            </div>
          </div>
        </div>

        {/* المراحل الدراسية */}
        <div className="flex gap-1 flex-wrap">
          {teacher.education_levels?.map((level, idx) => (
            <Badge key={idx} variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
              {level}
            </Badge>
          ))}
        </div>

        {/* الأسعار */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-bold text-green-700">
                {teacher.price_per_session} ر.س
              </div>
              <div className="text-xs text-gray-600">للحصة الواحدة</div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-green-700">
                {teacher.price_four_sessions} ر.س
              </div>
              <div className="text-xs text-gray-600">أربع حصص</div>
            </div>
          </div>
        </div>

        {/* الأزرار */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1">
            <MessageCircle className="w-4 h-4 ml-1" />
            راسلني
          </Button>
          <Link to={createPageUrl(`TeacherDetails?id=${teacher.id}`)} className="flex-1">
            <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" size="sm">
              احجز الآن
            </Button>
          </Link>
        </div>

        {/* أيقونات إضافية */}
        <div className="flex items-center justify-between pt-2 border-t">
          <Button variant="ghost" size="sm" className="text-gray-500 hover:text-red-500">
            <Heart className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-500 hover:text-blue-500">
            <Share2 className="w-4 h-4 ml-1" />
            مشاركة
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
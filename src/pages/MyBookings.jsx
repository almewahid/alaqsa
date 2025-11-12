import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, BookOpen, DollarSign, Clock } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

export default function MyBookings() {
  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['bookings'],
    queryFn: () => base44.entities.Booking.list('-created_date'),
    initialData: [],
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "مؤكد":
        return "bg-green-100 text-green-800 border-green-200";
      case "قيد الانتظار":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "ملغي":
        return "bg-red-100 text-red-800 border-red-200";
      case "مكتمل":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">حجوزاتي</h1>
          <p className="text-gray-600">عرض وإدارة جميع حجوزاتك التعليمية</p>
        </div>

        {bookings.length === 0 ? (
          <Card className="border-2">
            <CardContent className="p-12 text-center">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">لا توجد حجوزات بعد</h3>
              <p className="text-gray-600">ابدأ بحجز حصصك التعليمية الآن</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <Card key={booking.id} className="border-2 hover:shadow-lg transition-all">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <User className="w-5 h-5 text-blue-600" />
                      {booking.teacher_name}
                    </CardTitle>
                    <Badge className={`${getStatusColor(booking.status)} border`}>
                      {booking.status}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <BookOpen className="w-5 h-5 text-purple-600" />
                        <div>
                          <div className="text-sm text-gray-500">المادة</div>
                          <div className="font-medium">{booking.subject}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <User className="w-5 h-5 text-blue-600" />
                        <div>
                          <div className="text-sm text-gray-500">اسم الطالب</div>
                          <div className="font-medium">{booking.student_name}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-green-600" />
                        <div>
                          <div className="text-sm text-gray-500">تاريخ الحجز</div>
                          <div className="font-medium">
                            {format(new Date(booking.created_date), "d MMMM yyyy", { locale: ar })}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-orange-600" />
                        <div>
                          <div className="text-sm text-gray-500">عدد الحصص</div>
                          <div className="font-medium">{booking.total_sessions} حصة</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <DollarSign className="w-5 h-5 text-green-600" />
                        <div>
                          <div className="text-sm text-gray-500">السعر الإجمالي</div>
                          <div className="font-bold text-green-700 text-lg">{booking.total_price} ر.س</div>
                        </div>
                      </div>

                      {booking.education_level && (
                        <div>
                          <div className="text-sm text-gray-500 mb-1">المرحلة الدراسية</div>
                          <Badge variant="outline">{booking.education_level}</Badge>
                        </div>
                      )}
                    </div>
                  </div>

                  {booking.notes && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-500 mb-1">ملاحظات</div>
                      <p className="text-gray-700">{booking.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
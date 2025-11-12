import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Star, Users, Calendar, Award, ArrowRight, Phone, Mail, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function TeacherDetails() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const urlParams = new URLSearchParams(window.location.search);
  const teacherId = urlParams.get('id');

  const [bookingData, setBookingData] = useState({
    student_name: "",
    student_phone: "",
    student_email: "",
    subject: "",
    education_level: "",
    session_type: "حصة واحدة",
    notes: ""
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const { data: teacher, isLoading } = useQuery({
    queryKey: ['teacher', teacherId],
    queryFn: async () => {
      const teachers = await base44.entities.Teacher.list();
      return teachers.find(t => t.id === teacherId);
    },
    enabled: !!teacherId,
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ['reviews', teacherId],
    queryFn: () => base44.entities.Review.filter({ teacher_id: teacherId }),
    enabled: !!teacherId,
    initialData: [],
  });

  const createBookingMutation = useMutation({
    mutationFn: (data) => base44.entities.Booking.create(data),
    onSuccess: () => {
      setShowSuccess(true);
      setTimeout(() => {
        navigate(createPageUrl("MyBookings"));
      }, 2000);
    },
  });

  const handleBooking = () => {
    if (!bookingData.student_name || !bookingData.student_phone || !bookingData.subject) {
      alert("الرجاء ملء جميع الحقول المطلوبة");
      return;
    }

    const totalSessions = bookingData.session_type === "أربع حصص" ? 4 : 1;
    const totalPrice = bookingData.session_type === "أربع حصص" 
      ? teacher.price_four_sessions 
      : teacher.price_per_session;

    createBookingMutation.mutate({
      teacher_id: teacher.id,
      teacher_name: teacher.name,
      ...bookingData,
      total_sessions: totalSessions,
      total_price: totalPrice,
      booking_date: new Date().toISOString()
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-6xl mb-4">😢</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">المدرس غير موجود</h2>
        <Button onClick={() => navigate(createPageUrl("Teachers"))}>
          <ArrowRight className="w-4 h-4 ml-2" />
          العودة للمدرسين
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <Button
          variant="outline"
          onClick={() => navigate(createPageUrl("Teachers"))}
          className="mb-6"
        >
          <ArrowRight className="w-4 h-4 ml-2" />
          العودة للمدرسين
        </Button>

        {showSuccess && (
          <Card className="mb-6 border-green-500 bg-green-50">
            <CardContent className="p-6 flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div>
                <h3 className="font-bold text-green-900">تم الحجز بنجاح!</h3>
                <p className="text-green-700">سيتم تحويلك إلى صفحة الحجوزات...</p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Teacher Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-2">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <div className="flex items-start gap-4">
                  <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-blue-600 text-3xl font-bold shadow-lg">
                    {teacher.image_url ? (
                      <img src={teacher.image_url} alt={teacher.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      teacher.name.charAt(0)
                    )}
                  </div>
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold mb-2">{teacher.name}</h1>
                    <p className="text-white/90">{teacher.description}</p>
                    <div className="flex gap-2 mt-3 flex-wrap">
                      {teacher.subjects?.map((subject, idx) => (
                        <Badge key={idx} className="bg-white/20 text-white border-white/30">
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6 space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <Star className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">{teacher.rating || 5.0}</div>
                    <div className="text-sm text-gray-600">التقييم</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Users className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">{teacher.total_students || 0}</div>
                    <div className="text-sm text-gray-600">طالب</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Calendar className="w-6 h-6 text-green-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">{teacher.total_sessions || 0}</div>
                    <div className="text-sm text-gray-600">حصة</div>
                  </div>
                </div>

                {/* Bio */}
                {teacher.bio && (
                  <div>
                    <h3 className="text-lg font-bold mb-2">نبذة عني</h3>
                    <p className="text-gray-700 leading-relaxed">{teacher.bio}</p>
                  </div>
                )}

                {/* Experience */}
                {teacher.experience_years && (
                  <div className="flex items-center gap-2 p-4 bg-purple-50 rounded-lg">
                    <Award className="w-5 h-5 text-purple-600" />
                    <span className="font-medium">{teacher.experience_years} سنوات من الخبرة</span>
                  </div>
                )}

                {/* Education Levels */}
                <div>
                  <h3 className="text-lg font-bold mb-2">المراحل الدراسية</h3>
                  <div className="flex gap-2 flex-wrap">
                    {teacher.education_levels?.map((level, idx) => (
                      <Badge key={idx} variant="outline" className="text-sm">
                        {level}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle>التقييمات ({reviews.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {reviews.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">لا توجد تقييمات بعد</p>
                ) : (
                  reviews.map((review) => (
                    <div key={review.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold">{review.student_name}</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-bold">{review.rating}</span>
                        </div>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-1">
            <Card className="border-2 sticky top-4">
              <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
                <CardTitle>احجز الآن</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {/* Pricing */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700">حصة واحدة</span>
                    <span className="text-xl font-bold text-green-700">{teacher.price_per_session} ر.س</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">أربع حصص</span>
                    <span className="text-xl font-bold text-green-700">{teacher.price_four_sessions} ر.س</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <Label htmlFor="student_name">الاسم *</Label>
                    <Input
                      id="student_name"
                      value={bookingData.student_name}
                      onChange={(e) => setBookingData({...bookingData, student_name: e.target.value})}
                      placeholder="أدخل اسمك"
                    />
                  </div>

                  <div>
                    <Label htmlFor="student_phone">رقم الهاتف *</Label>
                    <Input
                      id="student_phone"
                      value={bookingData.student_phone}
                      onChange={(e) => setBookingData({...bookingData, student_phone: e.target.value})}
                      placeholder="05xxxxxxxx"
                    />
                  </div>

                  <div>
                    <Label htmlFor="student_email">البريد الإلكتروني</Label>
                    <Input
                      id="student_email"
                      type="email"
                      value={bookingData.student_email}
                      onChange={(e) => setBookingData({...bookingData, student_email: e.target.value})}
                      placeholder="email@example.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="subject">المادة *</Label>
                    <Select value={bookingData.subject} onValueChange={(value) => setBookingData({...bookingData, subject: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر المادة" />
                      </SelectTrigger>
                      <SelectContent>
                        {teacher.subjects?.map((subject) => (
                          <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="education_level">المرحلة الدراسية</Label>
                    <Select value={bookingData.education_level} onValueChange={(value) => setBookingData({...bookingData, education_level: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر المرحلة" />
                      </SelectTrigger>
                      <SelectContent>
                        {teacher.education_levels?.map((level) => (
                          <SelectItem key={level} value={level}>{level}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="session_type">نوع الحصة</Label>
                    <Select value={bookingData.session_type} onValueChange={(value) => setBookingData({...bookingData, session_type: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="حصة واحدة">حصة واحدة</SelectItem>
                        <SelectItem value="أربع حصص">أربع حصص</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="notes">ملاحظات إضافية</Label>
                    <Textarea
                      id="notes"
                      value={bookingData.notes}
                      onChange={(e) => setBookingData({...bookingData, notes: e.target.value})}
                      placeholder="أي ملاحظات خاصة..."
                      rows={3}
                    />
                  </div>

                  <Button
                    onClick={handleBooking}
                    disabled={createBookingMutation.isPending}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-lg py-6"
                  >
                    {createBookingMutation.isPending ? "جاري الحجز..." : "تأكيد الحجز"}
                  </Button>

                  {teacher.phone && (
                    <Button variant="outline" className="w-full" asChild>
                      <a href={`tel:${teacher.phone}`}>
                        <Phone className="w-4 h-4 ml-2" />
                        اتصل بالمدرس
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
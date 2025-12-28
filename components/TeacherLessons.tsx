"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  CheckCircle,
  BookOpen,
  XCircle,
  User,
  Search,
  Filter,
} from "lucide-react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/** تحويل وقت إلى مدة */
function calculateDuration(time: string) {
  try {
    const [start, end] = time.split(" - ");
    if (!start || !end) return "";

    const to24 = (t: string) => {
      const [h, rest] = t.split(":");
      let hour = parseInt(h.trim());
      const minute = parseInt((rest || "").split(" ")[0] || "0");
      const suffix = (rest || "").includes("مساء") ? "PM" : "AM";
      if (suffix === "PM" && hour < 12) hour += 12;
      if (suffix === "AM" && hour === 12) hour = 0;
      return hour * 60 + minute;
    };

    const duration = to24(end) - to24(start);
    return `${duration} دقيقة`;
  } catch {
    return "";
  }
}

/** عد تنازلي */
function Countdown({ iso }: { iso: string }) {
  const [label, setLabel] = useState("");

  useEffect(() => {
    if (!iso) return;
    const update = () => {
      const diff = new Date(iso).getTime() - Date.now();
      if (diff <= 0) {
        setLabel("⏳ بدأت الجلسة");
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      setLabel(
        `⏳ <span dir="ltr">${days}</span>ي <span dir="ltr">${hours}</span>س <span dir="ltr">${minutes}</span>د`
      );
    };
    update();
    const iv = setInterval(update, 1000);
    return () => clearInterval(iv);
  }, [iso]);

  return (
    <p
      className="text-sm text-red-500 flex items-center gap-1 justify-end"
      dangerouslySetInnerHTML={{ __html: label }}
    />
  );
}

export default function TeacherLessons() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("الكل");

  const [stats] = useState({
    total: 6,
    completed: 2,
    upcoming: 3,
    cancelled: 1,
  });

  // بيانات تجريبية باسم الطالب
  const upcomingLessons = [
    {
      id: 1,
      student: "أحمد محمد",
      subject: "رياضيات - ثانوي",
      date: "2025-09-12T17:00:00",
      displayDate: "الجمعة 12 سبتمبر 2025",
      time: "5:00 مساء - 6:00 مساء",
      status: "مؤكد",
    },
    {
      id: 2,
      student: "سارة خالد",
      subject: "لغة إنجليزية - متوسط",
      date: "2025-09-14T17:00:00",
      displayDate: "الأحد 14 سبتمبر 2025",
      time: "5:00 مساء - 6:00 مساء",
      status: "معلق",
    },
  ];

  const completedLessons = [
    {
      id: 3,
      student: "محمد علي",
      subject: "فيزياء - ثانوي",
      date: "2025-09-05T19:00:00",
      displayDate: "الجمعة 5 سبتمبر 2025",
      time: "7:00 مساء - 8:00 مساء",
    },
  ];

  const cancelledLessons = [
    {
      id: 4,
      student: "منى حسن",
      subject: "كيمياء - ثانوي",
      date: "2025-09-01T16:00:00",
      displayDate: "الاثنين 1 سبتمبر 2025",
      time: "4:00 مساء - 5:00 مساء",
    },
  ];

  // فلترة
  const filterLessons = (lessons: any[]) => {
    const q = search.trim().toLowerCase();
    const sub = filter === "الكل" ? "" : filter.toLowerCase();
    return lessons.filter((l) => {
      const student = (l.student || "").toLowerCase();
      const subject = (l.subject || "").toLowerCase();
      const matchesSearch = !q || student.includes(q) || subject.includes(q);
      const matchesSubject = !sub || subject.includes(sub);
      return matchesSearch && matchesSubject;
    });
  };

  return (
    <div dir="rtl" className="p-6 space-y-6">
      {/* العنوان */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">جلساتي مع الطلاب</h1>
        <p className="text-gray-500 text-lg">إدارة جلساتك التعليمية مع الطلاب</p>
      </div>

      {/* إحصائيات */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4 grid grid-cols-2 items-center shadow-md rounded-lg">
          <BookOpen className="h-14 w-14 text-blue-500 mx-auto" />
          <div className="text-right">
            <p className="text-base text-gray-500">إجمالي الجلسات</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
        </Card>

        <Card className="p-4 grid grid-cols-2 items-center shadow-md rounded-lg">
          <CheckCircle className="h-14 w-14 text-green-500 mx-auto" />
          <div className="text-right">
            <p className="text-base text-gray-500">الجلسات المكتملة</p>
            <p className="text-2xl font-bold">{stats.completed}</p>
          </div>
        </Card>

        <Card className="p-4 grid grid-cols-2 items-center shadow-md rounded-lg">
          <Calendar className="h-14 w-14 text-orange-500 mx-auto" />
          <div className="text-right">
            <p className="text-base text-gray-500">الجلسات القادمة</p>
            <p className="text-2xl font-bold">{stats.upcoming}</p>
          </div>
        </Card>

        <Card className="p-4 grid grid-cols-2 items-center shadow-md rounded-lg">
          <XCircle className="h-14 w-14 text-red-500 mx-auto" />
          <div className="text-right">
            <p className="text-base text-gray-500">الجلسات الملغاة</p>
            <p className="text-2xl font-bold">{stats.cancelled}</p>
          </div>
        </Card>
      </div>

      {/* الفلاتر */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-4">
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث باسم الطالب أو المادة..."
            className="w-full rounded-xl border border-gray-300 p-3 pr-10 text-right focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
          />
          <Search className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
        </div>

        <div className="flex items-center border rounded-xl px-3 py-2 w-full md:w-1/4">
          <Filter className="h-5 w-5 text-gray-500 ml-2" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full text-sm outline-none bg-transparent text-right"
          >
            <option>الكل</option>
            <option>رياضيات</option>
            <option>لغة إنجليزية</option>
            <option>فيزياء</option>
            <option>كيمياء</option>
          </select>
        </div>
      </div>

      {/* تبويبات */}
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="flex justify-center gap-4 rounded-xl p-2 w-fit mx-auto">
          <TabsTrigger value="upcoming">القادمة</TabsTrigger>
          <TabsTrigger value="completed">المكتملة</TabsTrigger>
          <TabsTrigger value="cancelled">الملغاة</TabsTrigger>
        </TabsList>

        {/* القادمة */}
        <TabsContent value="upcoming" className="mt-6">
          {filterLessons(upcomingLessons).length === 0 ? (
            <Card className="p-8 text-center shadow-md rounded-lg">
              <p className="mt-2 text-gray-500">لا توجد جلسات قادمة</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filterLessons(upcomingLessons).map((lesson, i) => (
                <motion.div
                  key={lesson.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Card className="p-4 shadow-md rounded-lg">
                    <div className="grid grid-cols-2 gap-4 items-center">
                      {/* أزرار التحكم */}
                      <div className="flex flex-col items-start gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            lesson.status === "مؤكد"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {lesson.status}
                        </span>
                        <Button className="w-28 h-10 bg-blue-500 text-white rounded-md">
                          بدء الجلسة
                        </Button>
                        <Button className="w-28 h-10 border border-gray-300 text-gray-600 bg-white rounded-md">
                          إعادة جدولة
                        </Button>
                      </div>

                      {/* بيانات الطالب */}
                      <div className="text-right space-y-1">
                        <h3 className="font-semibold text-lg flex items-center gap-2 justify-end">
                          <User className="h-5 w-5 text-gray-700" />
                          {lesson.student}
                        </h3>
                        <p className="text-base text-gray-800 flex items-center gap-2 justify-end">
                          <BookOpen className="h-5 w-5 text-blue-500" />
                          {lesson.subject}
                        </p>
                        <p className="text-sm flex items-center gap-2 justify-end">
                          <Calendar className="h-4 w-4 text-red-500" />
                          {lesson.displayDate}
                        </p>
                        <p className="text-sm text-gray-800 flex items-center gap-2 justify-end">
                          ⏰ {lesson.time}
                        </p>
                        <p className="text-sm text-gray-500 flex items-center gap-2 justify-end">
                          ({calculateDuration(lesson.time)})
                        </p>
                        <Countdown iso={lesson.date} />
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* المكتملة */}
        <TabsContent value="completed" className="mt-6">
          {filterLessons(completedLessons).length === 0 ? (
            <Card className="p-8 text-center shadow-md rounded-lg">
              <p className="mt-2 text-gray-500">لا توجد جلسات مكتملة</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filterLessons(completedLessons).map((lesson, i) => (
                <motion.div key={lesson.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <Card className="p-4 shadow-md rounded-lg">
                    <div className="grid grid-cols-2 gap-4 items-center">
                      <span className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700">
                        مكتملة
                      </span>
                      <div className="text-right space-y-1">
                        <h3 className="font-semibold text-lg flex items-center gap-2 justify-end">
                          <User className="h-5 w-5 text-gray-700" />
                          {lesson.student}
                        </h3>
                        <p className="text-base text-gray-800 flex items-center gap-2 justify-end">
                          <BookOpen className="h-5 w-5 text-blue-500" />
                          {lesson.subject}
                        </p>
                        <p className="text-sm flex items-center gap-2 justify-end">
                          <Calendar className="h-4 w-4 text-red-500" />
                          {lesson.displayDate}
                        </p>
                        <p className="text-sm text-gray-800 flex items-center gap-2 justify-end">
                          ⏰ {lesson.time}
                        </p>
                        <p className="text-sm text-gray-500 flex items-center gap-2 justify-end">
                          ({calculateDuration(lesson.time)})
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* الملغاة */}
        <TabsContent value="cancelled" className="mt-6">
          {filterLessons(cancelledLessons).length === 0 ? (
            <Card className="p-8 text-center shadow-md rounded-lg">
              <p className="mt-2 text-gray-500">لا توجد جلسات ملغاة</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filterLessons(cancelledLessons).map((lesson, i) => (
                <motion.div key={lesson.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <Card className="p-4 shadow-md rounded-lg">
                    <div className="grid grid-cols-2 gap-4 items-center">
                      <span className="px-3 py-1 rounded-full text-sm bg-red-100 text-red-700">
                        ملغاة
                      </span>
                      <div className="text-right space-y-1">
                        <h3 className="font-semibold text-lg flex items-center gap-2 justify-end">
                          <User className="h-5 w-5 text-gray-700" />
                          {lesson.student}
                        </h3>
                        <p className="text-base text-gray-800 flex items-center gap-2 justify-end">
                          <BookOpen className="h-5 w-5 text-blue-500" />
                          {lesson.subject}
                        </p>
                        <p className="text-sm flex items-center gap-2 justify-end">
                          <Calendar className="h-4 w-4 text-red-500" />
                          {lesson.displayDate}
                        </p>
                        <p className="text-sm text-gray-800 flex items-center gap-2 justify-end">
                          ⏰ {lesson.time}
                        </p>
                        <p className="text-sm text-gray-500 flex items-center gap-2 justify-end">
                          ({calculateDuration(lesson.time)})
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

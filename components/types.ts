// components/types.ts

// تعريف الواجهة الأساسية TeacherData
export interface TeacherData {
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

// بيانات تجريبية (mock) لاستخدامها افتراضياً في الـ Frontend
export const mockTeacherData: TeacherData = {
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

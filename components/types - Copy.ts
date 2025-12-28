export interface TeacherData {
  name: string
  address: string
  phone: string
  email: string
  bio: string
  subjects: string[]
  pricing: { type: string; price: string }[]
  experience: string[]
  reviews: { user: string; comment: string; rating: number }[]
  availableTimes: string[]
}

export const mockTeacherData: TeacherData = {
  name: "أحمد محمد",
  address: "القاهرة، مصر",
  phone: "01012345678",
  email: "ahmed@example.com",
  bio: "مدرس رياضيات بخبرة 10 سنوات في تدريس المرحلة الثانوية.",
  subjects: ["الجبر", "الهندسة", "الإحصاء"],
  pricing: [
    { type: "حصة فردية", price: "200 جنيه" },
    { type: "مجموعة صغيرة", price: "150 جنيه" },
  ],
  experience: ["بكالوريوس رياضيات - جامعة القاهرة", "10 سنوات خبرة تدريس"],
  reviews: [
    { user: "محمود", comment: "مدرس ممتاز وشرح رائع", rating: 5 },
    { user: "سارة", comment: "مفيد جدًا وصبور", rating: 4.5 },
  ],
  availableTimes: ["الأحد 5م", "الثلاثاء 7م", "الخميس 6م"],
}

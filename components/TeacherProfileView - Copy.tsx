"use client"

import { Star, PlayCircle, BookOpen, Calculator, Ruler, MapPin, Award, Briefcase, Quote } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface TeacherProfileScreenProps {
  onShowScreen: (screen: string) => void
}

export default function TeacherProfileScreen({ onShowScreen }: TeacherProfileScreenProps) {
  const handleBookNow = () => {
    onShowScreen("booking")
  }

  return (
    <Card className="max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden">
      <CardContent className="p-10 space-y-12">
        {/* العنوان */}
        <h1 className="text-4xl font-extrabold text-gray-900 border-b pb-6 text-center">
          الملف الشخصي للمدرس
        </h1>

        {/* بيانات المدرس */}
        <TeacherHeader />

        {/* نبذة */}
        <SectionDivider title="نبذة" />
        <TeacherBio />

        {/* التعريف التفصيلي */}
        <SectionDivider title="التعريف التفصيلي" />
        <TeacherDetailedBio />

        {/* الخبرات والشهادات */}
        <SectionDivider title="الخبرات والشهادات" />
        <TeacherExperience />

        {/* فيديو تعريفي */}
        <SectionDivider title="فيديو تعريفي" />
        <TeacherVideo />

        {/* المواد */}
        <SectionDivider title="المواد التي يدرسها" />
        <TeacherSubjects />

        {/* أسعار الحصص */}
        <SectionDivider title="أسعار الحصص" />
        <PricingPlans />

        {/* التقييمات */}
        <SectionDivider title="تقييمات الطلاب" />
        <TeacherReviews />

        {/* زر الحجز */}
        <div className="text-center pt-6">
          <Button
            onClick={handleBookNow}
            className="px-12 py-4 text-lg font-bold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:opacity-90 transition"
          >
            احجز الآن
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function TeacherHeader() {
  return (
    <div className="flex flex-col items-center space-y-4">
      <Avatar className="w-28 h-28 border-4 border-blue-600 shadow-lg">
        <AvatarFallback className="text-4xl">👨‍🏫</AvatarFallback>
      </Avatar>
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-gray-900">محمد أحمد</h2>
        <p className="text-gray-600 text-lg">مدرس رياضيات</p>
        <div className="flex items-center justify-center gap-2 text-gray-500">
          <MapPin className="w-4 h-4 text-red-500" />
          <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">🇸🇦 السعودية - الرياض</span>
        </div>
      </div>
    </div>
  )
}

function TeacherBio() {
  return (
    <p className="text-gray-700 leading-relaxed text-center text-lg max-w-2xl mx-auto">
      خبرة <span className="font-bold text-blue-600">10 سنوات</span> في تدريس الثانوية العامة،
      متخصص في التفاضل والتكامل. لديه طرق مبتكرة لتبسيط أصعب المفاهيم الرياضية ومساعدة الطلاب على
      بناء أساس قوي في الرياضيات.
    </p>
  )
}

function TeacherDetailedBio() {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl shadow-sm space-y-4">
      <p className="text-gray-700 leading-relaxed">
        أنا <span className="font-semibold">محمد أحمد</span>، مدرس رياضيات بخبرة تزيد عن
        <span className="font-bold text-blue-600"> 10 سنوات</span> في تدريس المرحلة الثانوية والجامعة.
        أركز على تبسيط المفاهيم المعقدة في التفاضل والتكامل والجبر والهندسة، وأعتمد على أمثلة عملية
        وتمارين تفاعلية لضمان ترسيخ المعلومات لدى الطلاب.
      </p>

      <div className="grid md:grid-cols-2 gap-4 mt-4">
        <BioCard icon="👨‍🎓" title="عدد الطلاب" text="أكثر من 500 طالب تم تدريسهم بنجاح" />
        <BioCard icon="📚" title="التخصصات" text="التفاضل، التكامل، الجبر، الإحصاء" />
        <BioCard icon="🎯" title="الهدف" text="تقديم تجربة تعليمية ممتعة وفعّالة" />
        <BioCard icon="💡" title="طريقة التدريس" text="استخدام طرق حديثة تفاعلية مع متابعة فردية" />
      </div>
    </div>
  )
}

function BioCard({ icon, title, text }: { icon: string; title: string; text: string }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex items-start gap-3 hover:shadow-md transition">
      <span className="text-2xl">{icon}</span>
      <div>
        <h4 className="font-bold text-gray-800">{title}</h4>
        <p className="text-gray-600 text-sm">{text}</p>
      </div>
    </div>
  )
}

function TeacherExperience() {
  const items = [
    { icon: <Briefcase className="w-5 h-5 text-blue-600" />, text: "خبرة 5 سنوات في تدريس الثانوية العامة" },
    { icon: <Briefcase className="w-5 h-5 text-blue-600" />, text: "مدرب رياضيات في منصات تعليمية أونلاين" },
    { icon: <Award className="w-5 h-5 text-green-600" />, text: "بكالوريوس رياضيات - جامعة الملك سعود" },
    { icon: <Award className="w-5 h-5 text-green-600" />, text: "دبلوم في طرق التدريس الحديثة" },
  ]

  return (
    <div className="grid md:grid-cols-2 gap-5">
      {items.map((item, i) => (
        <div
          key={i}
          className="flex items-center gap-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg shadow-sm p-4 hover:shadow-md transition"
        >
          {item.icon}
          <span className="text-gray-700">{item.text}</span>
        </div>
      ))}
    </div>
  )
}

function TeacherVideo() {
  return (
    <div className="relative w-full h-72 rounded-xl overflow-hidden shadow-xl">
      <iframe
        className="w-full h-full"
        src="https://www.youtube.com/embed/dQw4w9WgXcQ"
        title="Teacher Intro Video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  )
}

function TeacherSubjects() {
  return (
    <ul className="grid grid-cols-2 gap-4 text-gray-700">
      <li className="flex items-center gap-2 bg-white px-4 py-3 rounded-lg shadow hover:shadow-md transition">
        <Calculator className="w-5 h-5 text-blue-600" /> الرياضيات - ثانوي
      </li>
      <li className="flex items-center gap-2 bg-white px-4 py-3 rounded-lg shadow hover:shadow-md transition">
        <BookOpen className="w-5 h-5 text-green-600" /> الإحصاء
      </li>
      <li className="flex items-center gap-2 bg-white px-4 py-3 rounded-lg shadow hover:shadow-md transition">
        <Ruler className="w-5 h-5 text-purple-600" /> الجبر والهندسة
      </li>
    </ul>
  )
}

function PricingPlans() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <PlanCard title="حصة واحدة" price="75 ر.س" features={["مدة الحصة 60 دقيقة", "مواد تعليمية"]} />
      <PlanCard
        title="4 حصص"
        price="280 ر.س"
        popular
        features={["مدة الحصة 60 دقيقة", "مواد تعليمية", "خصم 6.6%"]}
      />
      <PlanCard
        title="8 حصص"
        price="520 ر.س"
        features={["مدة الحصة 60 دقيقة", "مواد تعليمية", "خصم 13.3%"]}
      />
    </div>
  )
}

function PlanCard({
  title,
  price,
  features,
  popular,
}: {
  title: string
  price: string
  features: string[]
  popular?: boolean
}) {
  return (
    <div
      className={`relative border rounded-2xl p-6 ${
        popular ? "border-2 border-blue-600" : "border-gray-200"
      } bg-white shadow hover:shadow-lg transition`}
    >
      {popular && (
        <span className="absolute -top-3 left-6 bg-blue-600 text-white px-3 py-1 rounded-full text-xs">
          الأكثر شيوعاً
        </span>
      )}
      <h3 className="font-bold text-center text-lg">{title}</h3>
      <p className="text-3xl font-bold text-blue-600 text-center my-4">{price}</p>
      <ul className="space-y-2 text-sm text-gray-600">
        {features.map((f, i) => (
          <li key={i} className="flex items-center">
            <span className="text-green-500 mr-2">✅</span> {f}
          </li>
        ))}
      </ul>
    </div>
  )
}

function TeacherReviews() {
  const reviews = [
    { name: "أحمد", text: "شرح ممتاز وصبر كبير، ساعدني في فهم التفاضل بسهولة.", rating: 5 },
    { name: "سارة", text: "مدرس رائع ومتابع جيد، الحصص كانت مفيدة جداً.", rating: 4 },
    { name: "خالد", text: "متمكن من المادة لكن أحياناً يسرع في الشرح.", rating: 4 },
  ]

  return (
    <div className="space-y-6">
      {/* معدل التقييم العام */}
      <div className="bg-gray-50 p-6 rounded-xl shadow-inner">
        <div className="flex items-center mb-4">
          {[1, 2, 3, 4].map((i) => (
            <Star key={i} className="w-6 h-6 text-yellow-400 fill-yellow-400" />
          ))}
          <Star className="w-6 h-6 text-gray-300" />
          <span className="ml-3 text-gray-700 font-medium text-lg">(4.5/5)</span>
        </div>
        <ReviewBar stars={5} percent={70} />
        <ReviewBar stars={4} percent={20} />
        <ReviewBar stars={3} percent={7} />
        <ReviewBar stars={2} percent={2} />
        <ReviewBar stars={1} percent={1} />
      </div>

      {/* قائمة المراجعات */}
      <div className="space-y-4">
        {reviews.map((review, i) => (
          <div
            key={i}
            className="bg-white p-5 rounded-xl shadow hover:shadow-md transition relative"
          >
            <Quote className="absolute top-3 left-3 w-6 h-6 text-gray-300" />
            <p className="text-gray-700 italic">"{review.text}"</p>
            <div className="flex items-center justify-between mt-3">
              <span className="font-bold text-gray-800">{review.name}</span>
              <div className="flex">
                {[...Array(review.rating)].map((_, j) => (
                  <Star key={j} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ReviewBar({ stars, percent }: { stars: number; percent: number }) {
  return (
    <div className="flex items-center gap-3 mb-2">
      <span className="w-10 text-sm text-gray-600">{stars}★</span>
      <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full bg-yellow-400" style={{ width: `${percent}%` }}></div>
      </div>
      <span className="w-8 text-sm text-gray-600">{percent}%</span>
    </div>
  )
}

function SectionDivider({ title }: { title: string }) {
  return (
    <h2 className="text-2xl font-bold text-gray-900 border-b pb-3 flex items-center gap-2">
      {title}
    </h2>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { createBooking } from '@/lib/api/bookings'
import { getTeacherById } from '@/lib/api/teachers'
import { getSubjectByName } from '@/lib/api/subjects'

const TEACHER_ID = '50be510e-c667-4eca-b79c-c10ac8f3746a'

export default function BookingScreen() {
  const { userId, loading: userLoading } = useCurrentUser()

  const [teacherData, setTeacherData] = useState<any>(null)
  const [subjectData, setSubjectData] = useState<any>(null)
  const [dataLoading, setDataLoading] = useState(true)

  const [selectedDay, setSelectedDay] = useState(8)
  const [selectedTime, setSelectedTime] = useState('6:00 م')
  const [bookingType, setBookingType] = useState<'online' | 'home'>('online')
  const [stage, setStage] = useState('')
  const [grade, setGrade] = useState('')
  const [curriculum, setCurriculum] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error' | 'loading' | ''>('')

  useEffect(() => {
    const loadData = async () => {
      try {
        const teacher = await getTeacherById(TEACHER_ID)
        setTeacherData(teacher)

        const subject = await getSubjectByName('رياضيات')
        setSubjectData(subject)

        setDataLoading(false)
      } catch (error) {
        console.error('Error loading data:', error)
        setDataLoading(false)
      }
    }

    loadData()
  }, [])

  const timeMap: Record<string, string> = {
    '3:00 م': '15:00',
    '4:00 م': '16:00',
    '5:00 م': '17:00',
    '6:00 م': '18:00',
    '7:00 م': '19:00',
    '8:00 م': '20:00',
  }

  const times = Object.keys(timeMap)

  const getPrice = () => {
    if (!teacherData?.teacher_pricing) return 0
    if (bookingType === 'online') {
      return teacherData.teacher_pricing[0]?.online_price_per_hour || 0
    } else {
      return teacherData.teacher_pricing[0]?.home_price_per_hour || 0
    }
  }

  const price = getPrice()
  const finalPrice = price
  const bookingDate = `2025-10-${String(selectedDay).padStart(2, '0')}`

  const handleConfirmBooking = async () => {
    if (!userId) {
      setMessage('❌ يجب تسجيل الدخول أولاً')
      setMessageType('error')
      return
    }

    if (!stage || !grade || !curriculum) {
      setMessage('❌ الرجاء ملء جميع الحقول المطلوبة')
      setMessageType('error')
      return
    }

    if (!subjectData) {
      setMessage('❌ لم يتم تحميل بيانات المادة')
      setMessageType('error')
      return
    }

    setIsLoading(true)
    setMessage('⏳ جاري حفظ الحجز...')
    setMessageType('loading')

    try {
      const result = await createBooking({
        student_id: userId,
        teacher_id: TEACHER_ID,
        scheduled_date: bookingDate,
        scheduled_time: timeMap[selectedTime],
        booking_type: bookingType,
        subject_id: subjectData.id,
        grade_id: grade,
        curriculum_id: curriculum,
        price,
        final_price: finalPrice,
      })

      if (result.success) {
        setMessage('✅ تم حفظ الحجز بنجاح!')
        setMessageType('success')

        setTimeout(() => {
          setSelectedDay(8)
          setSelectedTime('6:00 م')
          setBookingType('online')
          setStage('')
          setGrade('')
          setCurriculum('')
          setMessage('')
          setMessageType('')
        }, 2000)
      } else {
        setMessage(`❌ حدث خطأ: ${result.error?.message || 'لم يتم حفظ الحجز'}`)
        setMessageType('error')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'خطأ غير معروف'
      setMessage(`❌ خطأ: ${errorMessage}`)
      setMessageType('error')
    } finally {
      setIsLoading(false)
    }
  }

  if (userLoading || dataLoading) {
    return (
      <section className="bg-white rounded-xl shadow-lg p-6 text-center">
        <div className="py-8">
          <div className="inline-block mb-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
          <p className="text-gray-600">⏳ جاري تحميل البيانات...</p>
        </div>
      </section>
    )
  }

  if (!userId) {
    return (
      <section className="bg-white rounded-xl shadow-lg p-6 text-center">
        <div className="py-8">
          <p className="text-red-600 mb-4">❌ يجب تسجيل الدخول أولاً لحجز حصة</p>
          <a
            href="/auth/login"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            تسجيل الدخول
          </a>
        </div>
      </section>
    )
  }

  const messageClass =
    messageType === 'success'
      ? 'bg-green-100 text-green-800'
      : messageType === 'error'
        ? 'bg-red-100 text-red-800'
        : messageType === 'loading'
          ? 'bg-yellow-100 text-yellow-800'
          : ''

  return (
    <section className="bg-white rounded-xl shadow-lg p-6">
      <h1 className="text-2xl font-bold mb-2 text-right">
        حجز حصة مع {teacherData?.users?.full_name || 'مدرس'}
      </h1>
      <p className="text-gray-600 mb-6 text-right">📚 مادة: {subjectData?.name_ar || 'رياضيات'}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="font-bold text-lg mb-4 border-b-2 border-blue-600 pb-2">
            📋 تفاصيل الحجز
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">🎯 نوع الحجز</label>
              <select
                value={bookingType}
                onChange={(e) => setBookingType(e.target.value as 'online' | 'home')}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none transition"
              >
                <option value="online">
                  💻 أونلاين ({teacherData?.teacher_pricing?.[0]?.online_price_per_hour || 0} ر.س/ساعة)
                </option>
                <option value="home">
                  🏠 في المنزل ({teacherData?.teacher_pricing?.[0]?.home_price_per_hour || 0} ر.س/ساعة)
                </option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">🎓 المرحلة التعليمية</label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none transition"
              >
                <option value="">-- اختر المرحلة --</option>
                <option value="elementary">📚 الابتدائية</option>
                <option value="middle">📖 المتوسطة</option>
                <option value="high">✏️ الثانوية</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">🏫 الصف الدراسي</label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none transition"
              >
                <option value="">-- اختر الصف --</option>
                <option value="1">الأول ثانوي</option>
                <option value="2">الثاني ثانوي</option>
                <option value="3">الثالث ثانوي</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">📝 المنهج الدراسي</label>
              <select
                value={curriculum}
                onChange={(e) => setCurriculum(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none transition"
              >
                <option value="">-- اختر المنهج --</option>
                <option value="saudi">🇸🇦 المنهج السعودي</option>
                <option value="international">🌍 المنهج الدولي</option>
              </select>
            </div>
          </div>
        </div>

        <div>
          <h2 className="font-bold text-lg mb-4 border-b-2 border-blue-600 pb-2">📅 اختر الموعد</h2>

          <div className="bg-gray-50 rounded-lg p-4 mb-4 border-2 border-gray-200">
            <div className="text-center font-bold text-lg mb-4 text-blue-600">🗓️ أكتوبر 2025</div>

            <div className="grid grid-cols-7 gap-1 mb-3">
              {['أحد', 'اثن', 'ثلا', 'أرب', 'خمي', 'جمع', 'سبت'].map((day) => (
                <div key={day} className="text-center text-xs font-semibold text-gray-500 py-2">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {[...Array(31)].map((_, i) => {
                const day = i + 1
                const isSelected = selectedDay === day

                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`py-2 rounded text-sm font-semibold transition ${
                      isSelected ? 'bg-blue-600 text-white shadow-lg' : 'bg-white border border-gray-300 text-gray-700 hover:bg-blue-50'
                    }`}
                  >
                    {day}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="mb-4">
            <h3 className="font-bold text-gray-700 mb-3">⏰ الأوقات المتاحة:</h3>
            <div className="grid grid-cols-3 gap-2">
              {times.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`py-2 px-2 rounded font-semibold transition text-sm ${
                    selectedTime === time
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-blue-50'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 border-2 border-blue-200 p-4 rounded-lg mb-4">
            <h3 className="font-bold text-gray-700 mb-3">💰 السعر</h3>
            <div className="flex justify-between items-center text-lg">
              <span className="text-gray-700">الإجمالي:</span>
              <span className="font-bold text-blue-600">{finalPrice.toFixed(2)} ر.س</span>
            </div>
          </div>

          {message && (
            <div className={`p-4 rounded-lg mb-4 text-center ${messageClass}`}>
              {message}
            </div>
          )}

          <button
            onClick={handleConfirmBooking}
            disabled={isLoading}
            className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
          >
            {isLoading ? 'جاري الحفظ...' : 'تأكيد الحجز والدفع'}
          </button>
        </div>
      </div>
    </section>
  )
}

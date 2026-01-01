// lib/api/bookings.ts
import { supabase } from '@/lib/supabase'

// ============================================
// حفظ الحجز الجديد
// ============================================
export async function createBooking(bookingData: {
  student_id: string
  teacher_id: string
  scheduled_date: string
  scheduled_time: string
  booking_type: 'online' | 'home'
  subject_id: string
  grade_id?: string
  curriculum_id?: string
  price: number
  final_price: number
}) {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .insert({
        ...bookingData,
        status: 'pending',
        payment_status: 'unpaid',
      })
      .select()
      .single()

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    return { success: false, error }
  }
}

// ============================================
// جلب حجوزات الطالب
// ============================================
export async function getStudentBookings(studentId: string) {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        teachers (id, specialization),
        users:teacher_id (full_name)
      `)
      .eq('student_id', studentId)
      .order('scheduled_date', { ascending: false })

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    return { success: false, error }
  }
}

// ============================================
// إلغاء حجز
// ============================================
export async function cancelBooking(bookingId: string, reason: string) {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .update({
        status: 'cancelled',
        cancellation_reason: reason,
        cancelled_at: new Date().toISOString(),
      })
      .eq('id', bookingId)
      .select()
      .single()

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    return { success: false, error }
  }
}

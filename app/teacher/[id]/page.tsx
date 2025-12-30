import TeacherProfileView from "@/components/TeacherProfileView"
import { getTeacherById } from "@/lib/api/teachers"
import { notFound } from "next/navigation"

export default async function TeacherPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  try {
    // جلب بيانات المدرس من Supabase
    const teacher = await getTeacherById(id)
    
    if (!teacher) {
      notFound()
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <TeacherProfileView teacherId={id} teacherData={teacher} />
      </div>
    )
  } catch (error) {
    console.error('Error loading teacher:', error)
    notFound()
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  try {
    const teacher = await getTeacherById(id)
    
    if (!teacher) {
      return {
        title: 'المدرس غير موجود',
      }
    }

    const teacherName = teacher.users?.full_name || 'مدرس'
    
    return {
      title: `${teacherName} - منصة الأقصى`,
      description: teacher.users?.bio || `ملف المدرس ${teacherName}`,
    }
  } catch (error) {
    return {
      title: 'ملف المدرس - منصة الأقصى',
    }
  }
}
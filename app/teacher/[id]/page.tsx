
import TeacherProfileView from "@/components/TeacherProfileView";

export default function Page({ params }: { params: { id: string } }) {
  // حالياً الكومبوننت لا يقرأ id، لكن وجود الصفحة يمنع 404.
  // لاحقاً نمرّر id ونقرأ بيانات المعلم من API.
  return (
    <div className="container mx-auto px-4 py-8">
      <TeacherProfileView />
    </div>
  );
}

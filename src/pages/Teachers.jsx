import React, { useState, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import TeacherCard from "../components/teachers/TeacherCard";
import FilterSidebar from "../components/teachers/FilterSidebar";

export default function Teachers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    subjects: [],
    education_levels: [],
    teaching_type: null,
    sort_by: "rating"
  });

  const { data: teachers, isLoading } = useQuery({
    queryKey: ['teachers'],
    queryFn: () => base44.entities.Teacher.list(),
    initialData: [],
  });

  const filteredTeachers = useMemo(() => {
    let result = [...teachers];

    // البحث بالاسم
    if (searchQuery) {
      result = result.filter(teacher =>
        teacher.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teacher.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // فلترة المواد
    if (filters.subjects.length > 0) {
      result = result.filter(teacher =>
        teacher.subjects?.some(subject => filters.subjects.includes(subject))
      );
    }

    // فلترة المراحل
    if (filters.education_levels.length > 0) {
      result = result.filter(teacher =>
        teacher.education_levels?.some(level => filters.education_levels.includes(level))
      );
    }

    // فلترة نوع التدريس
    if (filters.teaching_type) {
      result = result.filter(teacher =>
        teacher.teaching_type === filters.teaching_type || teacher.teaching_type === "كلاهما"
      );
    }

    // الترتيب
    switch (filters.sort_by) {
      case "rating":
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "price_low":
        result.sort((a, b) => (a.price_per_session || 0) - (b.price_per_session || 0));
        break;
      case "price_high":
        result.sort((a, b) => (b.price_per_session || 0) - (a.price_per_session || 0));
        break;
      case "students":
        result.sort((a, b) => (b.total_students || 0) - (a.total_students || 0));
        break;
    }

    return result;
  }, [teachers, searchQuery, filters]);

  const handleResetFilters = () => {
    setFilters({
      subjects: [],
      education_levels: [],
      teaching_type: null,
      sort_by: "rating"
    });
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">المدرسون</h1>
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="ابحث عن مدرس..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10 py-6 text-lg border-2 focus:border-blue-400"
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filters */}
          <div className="lg:w-80 shrink-0">
            <FilterSidebar
              filters={filters}
              onFilterChange={setFilters}
              onReset={handleResetFilters}
            />
          </div>

          {/* Teachers Grid */}
          <div className="flex-1">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-gray-600">
                عرض <span className="font-bold text-blue-600">{filteredTeachers.length}</span> من المدرسين
              </p>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : filteredTeachers.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">لا توجد نتائج</h3>
                <p className="text-gray-600">جرب تغيير معايير البحث</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {filteredTeachers.map((teacher) => (
                  <TeacherCard key={teacher.id} teacher={teacher} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
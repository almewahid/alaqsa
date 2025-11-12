import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Filter } from "lucide-react";

const SUBJECTS = [
  { name: "الرياضيات", icon: "➗" },
  { name: "الفيزياء", icon: "⚛️" },
  { name: "الكيمياء", icon: "🧪" },
  { name: "اللغة الإنجليزية", icon: "🌐" },
  { name: "اللغة العربية", icon: "📖" },
  { name: "القرآن الكريم", icon: "📖" },
  { name: "SCIENCE", icon: "🔬" },
  { name: "الأحياء", icon: "🧬" },
];

const EDUCATION_LEVELS = ["ابتدائي", "متوسط", "ثانوي", "جامعي"];

export default function FilterSidebar({ filters, onFilterChange, onReset }) {
  const handleSubjectToggle = (subject) => {
    const currentSubjects = filters.subjects || [];
    const newSubjects = currentSubjects.includes(subject)
      ? currentSubjects.filter(s => s !== subject)
      : [...currentSubjects, subject];
    onFilterChange({ ...filters, subjects: newSubjects });
  };

  const handleLevelToggle = (level) => {
    const currentLevels = filters.education_levels || [];
    const newLevels = currentLevels.includes(level)
      ? currentLevels.filter(l => l !== level)
      : [...currentLevels, level];
    onFilterChange({ ...filters, education_levels: newLevels });
  };

  return (
    <Card className="sticky top-4 shadow-lg border-2">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            الفلاتر
          </CardTitle>
          {(filters.subjects?.length > 0 || filters.education_levels?.length > 0 || filters.teaching_type) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="text-white hover:bg-white/20"
            >
              <X className="w-4 h-4 ml-1" />
              إعادة تعيين
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-6">
        {/* نوع التدريس */}
        <div>
          <Label className="text-base font-bold mb-3 block">نوع التدريس</Label>
          <RadioGroup value={filters.teaching_type || ""} onValueChange={(value) => onFilterChange({ ...filters, teaching_type: value || null })}>
            <div className="flex items-center space-x-2 space-x-reverse mb-2">
              <RadioGroupItem value="" id="all" />
              <Label htmlFor="all" className="cursor-pointer">الكل</Label>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse mb-2">
              <RadioGroupItem value="أونلاين" id="online" />
              <Label htmlFor="online" className="cursor-pointer">أونلاين</Label>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse mb-2">
              <RadioGroupItem value="منازل" id="home" />
              <Label htmlFor="home" className="cursor-pointer">منازل</Label>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <RadioGroupItem value="كلاهما" id="both" />
              <Label htmlFor="both" className="cursor-pointer">كلاهما</Label>
            </div>
          </RadioGroup>
        </div>

        {/* الترتيب */}
        <div>
          <Label className="text-base font-bold mb-3 block">ترتيب حسب</Label>
          <Select value={filters.sort_by || "rating"} onValueChange={(value) => onFilterChange({ ...filters, sort_by: value })}>
            <SelectTrigger>
              <SelectValue placeholder="اختر الترتيب" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating">الأعلى تقييماً</SelectItem>
              <SelectItem value="price_low">الأقل سعراً</SelectItem>
              <SelectItem value="price_high">الأعلى سعراً</SelectItem>
              <SelectItem value="students">الأكثر طلاباً</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* المرحلة الدراسية */}
        <div>
          <Label className="text-base font-bold mb-3 block">المرحلة الدراسية</Label>
          <div className="space-y-2">
            {EDUCATION_LEVELS.map((level) => (
              <div key={level} className="flex items-center space-x-2 space-x-reverse">
                <Checkbox
                  id={level}
                  checked={filters.education_levels?.includes(level) || false}
                  onCheckedChange={() => handleLevelToggle(level)}
                />
                <Label htmlFor={level} className="cursor-pointer text-sm">
                  {level}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* المواد الدراسية */}
        <div>
          <Label className="text-base font-bold mb-3 block">المواد الدراسية</Label>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {SUBJECTS.map((subject) => (
              <div key={subject.name} className="flex items-center space-x-2 space-x-reverse">
                <Checkbox
                  id={subject.name}
                  checked={filters.subjects?.includes(subject.name) || false}
                  onCheckedChange={() => handleSubjectToggle(subject.name)}
                />
                <Label htmlFor={subject.name} className="cursor-pointer text-sm flex items-center gap-2">
                  <span>{subject.icon}</span>
                  <span>{subject.name}</span>
                </Label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
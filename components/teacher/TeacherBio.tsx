"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen } from "lucide-react"
import { TeacherData } from "./types"

export default function TeacherBio({ teacher }: { teacher: TeacherData }) {
  return (
    <Card className="rounded-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-right">
          <BookOpen className="w-5 h-5" />
          النبذة التعريفية
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-right leading-relaxed">{teacher.bio}</p>
      </CardContent>
    </Card>
  )
}

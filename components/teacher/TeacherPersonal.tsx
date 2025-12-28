"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MapPin, Phone, Mail, User } from "lucide-react"
import { TeacherData } from "./types"

export default function TeacherPersonal({ teacher }: { teacher: TeacherData }) {
  return (
    <Card className="rounded-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-right">
          <User className="w-5 h-5" />
          البيانات الشخصية
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <Avatar className="w-20 h-20">
            <AvatarFallback className="text-2xl font-bold bg-blue-100 text-blue-600">
              {teacher.name
                .split(" ")
                .slice(0, 2)
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="text-right">
            <h2 className="text-2xl font-bold">{teacher.name}</h2>
            <p className="text-muted-foreground">مدرس رياضيات</p>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="flex items-center gap-3 justify-end">
            <span>{teacher.address}</span>
            <MapPin className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="flex items-center gap-3 justify-end">
            <span>{teacher.phone}</span>
            <Phone className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="flex items-center gap-3 justify-end">
            <span>{teacher.email}</span>
            <Mail className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

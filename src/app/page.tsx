
"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { StatCard } from "@/components/dashboard/stat-card";
import { useStudentStore } from "@/lib/student-store";
import { LayoutDashboard, Users, GraduationCap, ClipboardCheck } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  const { students, isLoaded } = useStudentStore();

  if (!isLoaded) return null;

  const totalStudents = students.length;

  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <LayoutDashboard className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            title="Total Students"
            value={totalStudents}
            description="Active enrollment"
            icon={Users}
            variant="purple"
          />
          <StatCard
            title="Average Age"
            value="11.5 Yrs"
            description="Student demographics"
            icon={GraduationCap}
            variant="blue"
          />
          <StatCard
            title="TRIMASIK Pending"
            value="12"
            description="Reports to process"
            icon={ClipboardCheck}
            variant="orange"
          />
        </div>

        <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white">
          <CardHeader className="border-b px-8 py-6">
            <CardTitle className="text-xl font-bold text-slate-700">Recent Quarterly Records</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="px-8 font-bold text-slate-500">Name</TableHead>
                  <TableHead className="font-bold text-slate-500">Standard</TableHead>
                  <TableHead className="font-bold text-slate-500">Age</TableHead>
                  <TableHead className="font-bold text-slate-500">Joined</TableHead>
                  <TableHead className="px-8 font-bold text-slate-500 text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.slice(0, 5).map((student) => (
                  <TableRow key={student.id} className="hover:bg-slate-50 transition-colors">
                    <TableCell className="px-8 font-medium text-slate-700">{student.name}</TableCell>
                    <TableCell className="text-slate-500">{student.academicStandard}</TableCell>
                    <TableCell className="text-slate-500">{student.age}</TableCell>
                    <TableCell className="text-slate-500">Nov 2023</TableCell>
                    <TableCell className="px-8 text-right">
                      <Badge className="bg-green-500 hover:bg-green-600 border-none px-4 py-1 rounded-full font-bold">
                        Pending
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}

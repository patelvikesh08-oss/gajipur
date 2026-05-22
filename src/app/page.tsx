
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
import { AgeChart } from "@/components/dashboard/age-chart";
import { GenderChart } from "@/components/dashboard/gender-chart";
import { StandardChart } from "@/components/dashboard/standard-chart";
import { useMemo } from "react";

export default function Dashboard() {
  const { students, isLoaded } = useStudentStore();

  const stats = useMemo(() => {
    if (!students.length) return { total: 0, avgAge: "0", ageData: [], genderData: [], standardData: [] };

    const total = students.length;
    const sumAge = students.reduce((acc, s) => acc + s.age, 0);
    const avgAge = (sumAge / total).toFixed(1);

    // Age distribution
    const ageMap: Record<number, number> = {};
    students.forEach(s => {
      ageMap[s.age] = (ageMap[s.age] || 0) + 1;
    });
    const ageData = Object.entries(ageMap)
      .map(([age, count]) => ({ age: `${age} Yrs`, count }))
      .sort((a, b) => parseInt(a.age) - parseInt(b.age));

    // Gender distribution
    const genderMap: Record<string, number> = { Male: 0, Female: 0, Other: 0 };
    students.forEach(s => {
      genderMap[s.gender] = (genderMap[s.gender] || 0) + 1;
    });
    const genderData = Object.entries(genderMap).map(([name, value]) => ({ name, value }));

    // Standard distribution
    const stdMap: Record<string, number> = {};
    students.forEach(s => {
      stdMap[s.academicStandard] = (stdMap[s.academicStandard] || 0) + 1;
    });
    const standardData = Object.entries(stdMap).map(([name, students]) => ({ name, students }));

    return { total, avgAge, ageData, genderData, standardData };
  }, [students]);

  if (!isLoaded) return null;

  return (
    <MainLayout>
      <div className="space-y-8 pb-12">
        <div className="flex items-center gap-3">
          <LayoutDashboard className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            title="Total Students"
            value={stats.total}
            description="Active enrollment"
            icon={Users}
            variant="purple"
          />
          <StatCard
            title="Average Age"
            value={`${stats.avgAge} Yrs`}
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <GenderChart data={stats.genderData} />
          </div>
          <div className="lg:col-span-1">
            <AgeChart data={stats.ageData} />
          </div>
          <div className="lg:col-span-1">
            <StandardChart data={stats.standardData} />
          </div>
        </div>

        <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white">
          <CardHeader className="border-b px-8 py-6">
            <CardTitle className="text-xl font-bold text-slate-700">Recent Student Enrollment</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="px-8 font-bold text-slate-500">Name</TableHead>
                  <TableHead className="font-bold text-slate-500">Standard</TableHead>
                  <TableHead className="font-bold text-slate-500">Age</TableHead>
                  <TableHead className="font-bold text-slate-500">Gender</TableHead>
                  <TableHead className="px-8 font-bold text-slate-500 text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.slice(-5).reverse().map((student) => (
                  <TableRow key={student.id} className="hover:bg-slate-50 transition-colors">
                    <TableCell className="px-8 font-medium text-slate-700">{student.name}</TableCell>
                    <TableCell className="text-slate-500">{student.academicStandard}</TableCell>
                    <TableCell className="text-slate-500">{student.age}</TableCell>
                    <TableCell className="text-slate-500">
                      <Badge variant="outline" className="text-[10px] uppercase font-bold px-2 py-0 border-primary/30 text-primary">
                        {student.gender}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-8 text-right">
                      <Badge className="bg-green-500 hover:bg-green-600 border-none px-4 py-1 rounded-full font-bold">
                        Active
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

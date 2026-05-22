
"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { StatCard } from "@/components/dashboard/stat-card";
import { useStudentStore } from "@/lib/student-store";
import { useSessionStore } from "@/lib/session-store";
import { LayoutDashboard, Users, GraduationCap, ClipboardCheck, ListFilter, Calendar } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMemo } from "react";

export default function Dashboard() {
  const { students, isLoaded: studentsLoaded } = useStudentStore();
  const { academicYear, semester, updateYear, updateSemester, isLoaded: sessionLoaded } = useSessionStore();

  const stats = useMemo(() => {
    if (!students.length) return { total: 0, avgAge: "0", ageData: [], genderData: [], standardData: [] };

    const total = students.length;
    const sumAge = students.reduce((acc, s) => acc + s.age, 0);
    const avgAge = (sumAge / total).toFixed(1);

    const ageMap: Record<number, number> = {};
    students.forEach(s => {
      ageMap[s.age] = (ageMap[s.age] || 0) + 1;
    });
    const ageData = Object.entries(ageMap)
      .map(([age, count]) => ({ age: `${age} Yrs`, count }))
      .sort((a, b) => parseInt(a.age) - parseInt(b.age));

    const genderMap: Record<string, number> = { Male: 0, Female: 0, Other: 0 };
    students.forEach(s => {
      genderMap[s.gender] = (genderMap[s.gender] || 0) + 1;
    });
    const genderData = Object.entries(genderMap).map(([name, value]) => ({ name, value }));

    const stdMap: Record<string, { total: number, male: number, female: number, other: number }> = {};
    students.forEach(s => {
      if (!stdMap[s.academicStandard]) {
        stdMap[s.academicStandard] = { total: 0, male: 0, female: 0, other: 0 };
      }
      stdMap[s.academicStandard].total += 1;
      if (s.gender === 'Male') stdMap[s.academicStandard].male += 1;
      else if (s.gender === 'Female') stdMap[s.academicStandard].female += 1;
      else stdMap[s.academicStandard].other += 1;
    });
    
    const standardData = Object.entries(stdMap).map(([name, data]) => ({ 
      name, 
      ...data 
    })).sort((a, b) => a.name.localeCompare(b.name));

    return { total, avgAge, ageData, genderData, standardData };
  }, [students]);

  if (!studentsLoaded || !sessionLoaded) return null;

  return (
    <MainLayout>
      <div className="space-y-8 pb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border shadow-sm">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <Select value={academicYear} onValueChange={(val: any) => updateYear(val)}>
                <SelectTrigger className="w-[120px] border-none shadow-none focus:ring-0 h-7 text-xs font-bold">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2023-24">2023-24</SelectItem>
                  <SelectItem value="2024-25">2024-25</SelectItem>
                  <SelectItem value="2025-26">2025-26</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Select value={semester} onValueChange={(val: any) => updateSemester(val)}>
              <SelectTrigger className="w-[140px] bg-white font-bold text-xs h-10 shadow-sm">
                <SelectValue placeholder="Semester" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Semester 1">Semester 1</SelectItem>
                <SelectItem value="Semester 2">Semester 2</SelectItem>
                <SelectItem value="Annual">Annual</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            title="Total Students"
            value={stats.total}
            description={`${academicYear} Enrollment`}
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
            title="Active Semester"
            value={semester}
            description="Processing Period"
            icon={ClipboardCheck}
            variant="orange"
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-4 grid grid-cols-1 gap-6">
            <Card className="border-none shadow-sm overflow-hidden">
              <CardHeader className="bg-slate-50/50 border-b">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-600">Gender Summary</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="text-[10px] font-bold uppercase">Gender</TableHead>
                      <TableHead className="text-[10px] font-bold uppercase text-right">Count</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stats.genderData.map((row) => (
                      <TableRow key={row.name} className="h-10">
                        <TableCell className="font-medium">{row.name}</TableCell>
                        <TableCell className="text-right font-bold text-primary">{row.value}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm overflow-hidden">
              <CardHeader className="bg-slate-50/50 border-b">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-600">Age Distribution</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="text-[10px] font-bold uppercase">Age Group</TableHead>
                      <TableHead className="text-[10px] font-bold uppercase text-right">Count</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stats.ageData.map((row) => (
                      <TableRow key={row.age} className="h-10">
                        <TableCell className="font-medium">{row.age}</TableCell>
                        <TableCell className="text-right font-bold text-primary">{row.count}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          <Card className="xl:col-span-8 border-none shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-600">Grade Level Breakdown</CardTitle>
              <CardDescription>Detailed student count by gender per standard</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-[10px] font-bold uppercase">Standard</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase text-center">Male</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase text-center">Female</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase text-center">Other</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.standardData.map((row) => (
                    <TableRow key={row.name} className="h-10 hover:bg-slate-50/50 transition-colors">
                      <TableCell className="font-bold text-slate-700">{row.name}</TableCell>
                      <TableCell className="text-center text-blue-600 font-medium">{row.male}</TableCell>
                      <TableCell className="text-center text-pink-600 font-medium">{row.female}</TableCell>
                      <TableCell className="text-center text-slate-400 font-medium">{row.other}</TableCell>
                      <TableCell className="text-right font-black text-primary">{row.total}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}

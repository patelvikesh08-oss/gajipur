
"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { StatCard } from "@/components/dashboard/stat-card";
import { useStudentStore } from "@/lib/student-store";
import { LayoutDashboard, Users, GraduationCap, ClipboardCheck, ListFilter } from "lucide-react";
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

    // Standard distribution with Gender Breakdown
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

  if (!isLoaded) return null;

  return (
    <MainLayout>
      <div className="space-y-8 pb-12">
        <div className="flex items-center gap-3">
          <LayoutDashboard className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>
        </div>

        {/* Top Stat Cards */}
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

        {/* Demographic Summary Tables */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          
          <div className="xl:col-span-4 grid grid-cols-1 gap-6">
            {/* Gender Table */}
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

            {/* Age Table */}
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

          {/* Standard Table with Breakdown */}
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
                  {stats.standardData.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                        No standard data available.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Recent Enrollment Table */}
        <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white">
          <CardHeader className="border-b px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-slate-700">Recent Student Enrollment</CardTitle>
                <CardDescription>Latest 5 students added to the system</CardDescription>
              </div>
              <ListFilter className="w-5 h-5 text-slate-400" />
            </div>
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
                    <TableCell className="text-slate-500">
                      <Badge variant="secondary" className="font-medium">{student.academicStandard}</Badge>
                    </TableCell>
                    <TableCell className="text-slate-500">{student.age}</TableCell>
                    <TableCell className="text-slate-500">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        student.gender === 'Male' ? 'bg-blue-100 text-blue-700' : 
                        student.gender === 'Female' ? 'bg-pink-100 text-pink-700' : 
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {student.gender}
                      </span>
                    </TableCell>
                    <TableCell className="px-8 text-right">
                      <Badge className="bg-green-500 hover:bg-green-600 border-none px-4 py-1 rounded-full font-bold">
                        Active
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {students.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                      No student records found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}

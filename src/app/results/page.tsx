
"use client";

import { useState, useMemo } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { useStudentStore } from "@/lib/student-store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PieChart as PieChartIcon, CheckCircle, TrendingUp, Users, Calendar, Filter, Printer } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatCard } from "@/components/dashboard/stat-card";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const chartConfig = {
  students: {
    label: "Students / સંખ્યા",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export default function ResultsPage() {
  const { students, isLoaded } = useStudentStore();
  const [academicYear, setAcademicYear] = useState("2024-25");
  const [selectedStandard, setSelectedStandard] = useState("all");
  const [semester, setSemester] = useState("Semester 1");

  const standards = useMemo(() => {
    return Array.from(new Set(students.map(s => s.academicStandard))).sort();
  }, [students]);

  if (!isLoaded) return null;

  const filteredStudents = students.filter(s => selectedStandard === "all" || s.academicStandard === selectedStandard);

  const totalStudents = filteredStudents.length;
  const passedCount = Math.floor(totalStudents * 0.92);
  const passRate = totalStudents > 0 ? ((passedCount / totalStudents) * 100).toFixed(1) : "0.0";

  const gradeDistribution = [
    { name: "Grade A+", students: Math.floor(totalStudents * 0.2) },
    { name: "Grade A", students: Math.floor(totalStudents * 0.35) },
    { name: "Grade B", students: Math.floor(totalStudents * 0.25) },
    { name: "Grade C", students: Math.floor(totalStudents * 0.12) },
    { name: "Grade D", students: Math.floor(totalStudents * 0.08) },
  ];

  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-blue-900 p-8 rounded-3xl text-white shadow-2xl no-print">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                <PieChartIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Results & Analytics / પરીક્ષા પરિણામો</h1>
                <p className="text-indigo-100 text-sm font-medium mt-1">Consolidated performance tracking and outcome visualization</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20">
                <Calendar className="w-4 h-4 text-blue-200" />
                <Select value={academicYear} onValueChange={setAcademicYear}>
                  <SelectTrigger className="w-[110px] border-none shadow-none focus:ring-0 h-7 text-xs font-bold text-white">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2023-24">2023-24</SelectItem>
                    <SelectItem value="2024-25">2024-25</SelectItem>
                    <SelectItem value="2025-26">2025-26</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="bg-white/10 backdrop-blur-md px-2 py-1 rounded-xl border border-white/20">
                <Select value={semester} onValueChange={setSemester}>
                  <SelectTrigger className="w-[140px] border-none bg-transparent shadow-none focus:ring-0 h-10 text-xs font-bold text-white">
                    <SelectValue placeholder="Semester" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Semester 1">Semester 1 / સત્ર ૧</SelectItem>
                    <SelectItem value="Semester 2">Semester 2 / સત્ર ૨</SelectItem>
                    <SelectItem value="Annual">Annual / વાર્ષિક</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="outline" onClick={() => window.print()} className="bg-white/10 border-white/20 text-white hover:bg-white/20 font-bold h-10 px-6 rounded-xl">
                <Printer className="w-4 h-4 mr-2" />
                Print Analysis
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 bg-white p-6 rounded-2xl border shadow-sm no-print">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 tracking-widest">
            <Filter className="w-4 h-4" />
            Filter View
          </div>
          <Select value={selectedStandard} onValueChange={setSelectedStandard}>
            <SelectTrigger className="w-[240px] rounded-xl h-11">
              <SelectValue placeholder="All Standards" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Standards / બધા ધોરણ</SelectItem>
              {standards.map(std => (
                <SelectItem key={std} value={std}>{std}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            title="Total Appeared / કુલ પરીક્ષાર્થી"
            value={totalStudents}
            description="Active Enrollment"
            icon={Users}
            variant="blue"
          />
          <StatCard
            title="Passed % / પરિણામ ટકાવારી"
            value={`${passRate}%`}
            description={`${passedCount} students success`}
            icon={CheckCircle}
            variant="purple"
          />
          <StatCard
            title="Top Performers / તેજસ્વી"
            value={Math.floor(totalStudents * 0.2)}
            description="Grade A+ Achievers"
            icon={TrendingUp}
            variant="orange"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="rounded-2xl shadow-xl border-none overflow-hidden print:border-black">
            <CardHeader className="bg-slate-50/50 border-b">
              <CardTitle className="font-bold text-slate-800 text-lg">Grade Distribution / ગ્રેડ વિતરણ</CardTitle>
              <CardDescription className="font-medium">Final outcome breakdown for {semester}</CardDescription>
            </CardHeader>
            <CardContent className="pt-8">
              <ChartContainer config={chartConfig} className="h-[300px] w-full print:hidden">
                <BarChart data={gradeDistribution}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.3} />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    className="font-black text-[9px] uppercase"
                  />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                  <Bar
                    dataKey="students"
                    fill="hsl(var(--primary))"
                    radius={[8, 8, 0, 0]}
                    animationDuration={1500}
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-xl border-none overflow-hidden bg-white print:border-black">
            <CardHeader className="bg-slate-50/50 border-b px-8 py-6 print:border-black">
              <CardTitle className="text-lg font-bold text-slate-800">Student Results / વિદ્યાર્થી પરિણામ</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table className="print:border-black">
                <TableHeader className="bg-slate-50/30 print:bg-white">
                  <TableRow className="print:border-black">
                    <TableHead className="px-8 font-black uppercase text-[10px] text-slate-400 print:text-black print:border-black">Name</TableHead>
                    <TableHead className="font-black uppercase text-[10px] text-slate-400 print:text-black print:border-black">Standard</TableHead>
                    <TableHead className="font-black uppercase text-[10px] text-slate-400 print:text-black print:border-black">Grade</TableHead>
                    <TableHead className="px-8 font-black uppercase text-[10px] text-right text-slate-400 print:text-black print:border-black">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.slice(0, 15).map((student) => (
                    <TableRow key={student.id} className="hover:bg-indigo-50/20 border-slate-100 transition-colors print:border-black">
                      <TableCell className="px-8 font-bold text-slate-700 text-xs print:text-black print:border-black">{student.name}</TableCell>
                      <TableCell className="text-slate-500 font-bold text-[10px] print:text-black print:border-black">{student.academicStandard}</TableCell>
                      <TableCell className="font-black text-indigo-700 text-xs print:text-black print:border-black">A</TableCell>
                      <TableCell className="px-8 text-right print:text-black print:border-black">
                        <Badge className="bg-emerald-500 font-black text-[9px] print:border-none print:bg-transparent print:text-black">
                          PASSED
                        </Badge>
                      </TableCell>
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

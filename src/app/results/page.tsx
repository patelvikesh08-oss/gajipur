
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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <PieChartIcon className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">Results & Analytics / પરીક્ષા પરિણામો</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border shadow-sm">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <Select value={academicYear} onValueChange={setAcademicYear}>
                <SelectTrigger className="w-[110px] border-none shadow-none focus:ring-0 h-7 text-xs font-bold">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2023-24">2023-24</SelectItem>
                  <SelectItem value="2024-25">2024-25</SelectItem>
                  <SelectItem value="2025-26">2025-26</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Select value={semester} onValueChange={setSemester}>
              <SelectTrigger className="w-[130px] bg-white font-bold text-xs h-10">
                <SelectValue placeholder="Semester" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Semester 1">Semester 1 / સત્ર ૧</SelectItem>
                <SelectItem value="Semester 2">Semester 2 / સત્ર ૨</SelectItem>
                <SelectItem value="Annual">Annual / વાર્ષિક</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => window.print()} className="font-bold border-slate-200">
              <Printer className="w-4 h-4 mr-2" />
              Print / પ્રિન્ટ
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-xl border shadow-sm no-print">
          <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
            <Filter className="w-4 h-4" />
            Filter View / ફિલ્ટર:
          </div>
          <Select value={selectedStandard} onValueChange={setSelectedStandard}>
            <SelectTrigger className="w-[200px]">
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
            description="Filtered by standard"
            icon={Users}
            variant="blue"
          />
          <StatCard
            title="Passed % / પરિણામ ટકાવારી"
            value={`${passRate}%`}
            description={`${passedCount} students passed`}
            icon={CheckCircle}
            variant="purple"
          />
          <StatCard
            title="Top Performers / તેજસ્વી તારલા"
            value={Math.floor(totalStudents * 0.2)}
            description="Achieved Grade A+"
            icon={TrendingUp}
            variant="orange"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="print:border-black">
            <CardHeader>
              <CardTitle className="font-headline text-lg">Grade Distribution / ગ્રેડ વિતરણ</CardTitle>
              <CardDescription className="font-medium">Final outcome breakdown for {semester}</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px] w-full print:hidden">
                <BarChart data={gradeDistribution}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.3} />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                  />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                  <Bar
                    dataKey="students"
                    fill="var(--color-students)"
                    radius={[4, 4, 0, 0]}
                    animationDuration={1500}
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className="overflow-hidden bg-white print:border-black">
            <CardHeader className="border-b px-8 py-6 print:border-black">
              <CardTitle className="text-lg font-bold text-slate-700">Student Results / વિદ્યાર્થી પરિણામ</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table className="print:border-black">
                <TableHeader className="bg-slate-50/50 print:bg-white">
                  <TableRow className="print:border-black">
                    <TableHead className="px-8 font-bold text-slate-500 print:text-black print:border-black">Name / નામ</TableHead>
                    <TableHead className="font-bold text-slate-500 print:text-black print:border-black">Standard / ધોરણ</TableHead>
                    <TableHead className="font-bold text-slate-500 print:text-black print:border-black">Grade / ગ્રેડ</TableHead>
                    <TableHead className="px-8 font-bold text-slate-500 text-right print:text-black print:border-black">Status / સ્થિતિ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.slice(0, 15).map((student) => (
                    <TableRow key={student.id} className="hover:bg-slate-50 print:border-black">
                      <TableCell className="px-8 font-medium text-slate-700 print:text-black print:border-black">{student.name}</TableCell>
                      <TableCell className="text-slate-500 print:text-black print:border-black">{student.academicStandard}</TableCell>
                      <TableCell className="font-bold text-primary print:text-black print:border-black">A</TableCell>
                      <TableCell className="px-8 text-right print:text-black print:border-black">
                        <Badge className="bg-green-500 font-bold print:border-none print:bg-transparent print:text-black">
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

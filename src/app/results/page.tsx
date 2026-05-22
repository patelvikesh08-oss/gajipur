
"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { useStudentStore } from "@/lib/student-store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PieChart as PieChartIcon, CheckCircle, XCircle, TrendingUp, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatCard } from "@/components/dashboard/stat-card";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const chartConfig = {
  students: {
    label: "Students",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export default function ResultsPage() {
  const { students, isLoaded } = useStudentStore();

  if (!isLoaded) return null;

  // Mock results summary
  const totalStudents = students.length;
  const passedCount = Math.floor(totalStudents * 0.92);
  const passRate = ((passedCount / totalStudents) * 100).toFixed(1);

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
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <PieChartIcon className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Examination Results & Analytics</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            title="Total Appeared"
            value={totalStudents}
            description="Students across all standards"
            icon={Users}
            variant="blue"
          />
          <StatCard
            title="Passed Percentage"
            value={`${passRate}%`}
            description="Overall success rate"
            icon={CheckCircle}
            variant="purple"
          />
          <StatCard
            title="Top Performers"
            value="15"
            description="Achieved Grade A+"
            icon={TrendingUp}
            variant="orange"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-lg">Grade Distribution</CardTitle>
              <CardDescription className="font-medium">Summary of final outcomes</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
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

          <Card className="overflow-hidden bg-white">
            <CardHeader className="border-b px-8 py-6">
              <CardTitle className="text-lg font-bold text-slate-700">Detailed Student Results</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow>
                    <TableHead className="px-8 font-bold text-slate-500">Name</TableHead>
                    <TableHead className="font-bold text-slate-500">Standard</TableHead>
                    <TableHead className="font-bold text-slate-500">Grade</TableHead>
                    <TableHead className="px-8 font-bold text-slate-500 text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.slice(0, 8).map((student, idx) => (
                    <TableRow key={student.id} className="hover:bg-slate-50">
                      <TableCell className="px-8 font-medium text-slate-700">{student.name}</TableCell>
                      <TableCell className="text-slate-500">{student.academicStandard}</TableCell>
                      <TableCell className="font-bold text-primary">A</TableCell>
                      <TableCell className="px-8 text-right">
                        <Badge className="bg-green-500 hover:bg-green-600 border-none px-4 py-1 rounded-full font-bold">
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

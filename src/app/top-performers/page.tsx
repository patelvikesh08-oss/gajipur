
"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { useStudentStore } from "@/lib/student-store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Trophy, Star, Medal, ArrowUpRight, Printer } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

export default function TopPerformersPage() {
  const { students, isLoaded } = useStudentStore();

  if (!isLoaded) return null;

  const topStudents = students.slice(0, 10).map((s, index) => {
    const scores = [
      { subject: "Mathematics / ગણિત", score: 98 - index * 2 },
      { subject: "Science / વિજ્ઞાન", score: 95 - index * 3 },
      { subject: "English / અંગ્રેજી", score: 92 - index * 1 },
      { subject: "Social Studies / સા. વિજ્ઞાન", score: 96 - index * 2 },
    ];
    const overall = Math.round(scores.reduce((acc, curr) => acc + curr.score, 0) / scores.length);
    
    return {
      ...s,
      rank: index + 1,
      scores,
      overall
    };
  });

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="w-10 h-10 text-yellow-500" />;
      case 2: return <Medal className="w-10 h-10 text-slate-400" />;
      case 3: return <Medal className="w-10 h-10 text-amber-600" />;
      default: return null;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return "bg-gradient-to-br from-yellow-50 to-white border-yellow-200";
      case 2: return "bg-gradient-to-br from-slate-50 to-white border-slate-200";
      case 3: return "bg-gradient-to-br from-amber-50 to-white border-amber-100";
      default: return "bg-white";
    }
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-blue-900 p-8 rounded-3xl text-white shadow-2xl no-print">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                <Star className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Top Performers / તેજસ્વી વિદ્યાર્થીઓ</h1>
                <p className="text-indigo-100 text-sm font-medium mt-1">Honoring academic excellence across all standards</p>
              </div>
            </div>
            <Button variant="outline" onClick={() => window.print()} className="bg-white/10 border-white/20 text-white hover:bg-white/20 font-bold h-10 px-8 rounded-xl shadow-lg">
              <Printer className="w-4 h-4 mr-2" />
              Print Rankings
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 no-print">
          {topStudents.slice(0, 3).map((student) => (
            <Card key={student.id} className={`border-2 shadow-xl transition-all hover:scale-[1.02] rounded-3xl ${getRankColor(student.rank)} overflow-hidden`}>
              <CardHeader className="relative pb-2">
                <div className="absolute top-6 right-6 opacity-80">
                  {getRankIcon(student.rank)}
                </div>
                <div className="space-y-2">
                  <Badge className="font-black px-3 bg-indigo-600 border-none">
                    RANK #{student.rank}
                  </Badge>
                  <CardTitle className="text-2xl font-black text-slate-800 truncate pr-14 tracking-tight">{student.name}</CardTitle>
                  <CardDescription className="font-bold text-indigo-600 uppercase text-[10px] tracking-widest">{student.academicStandard}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-8 mt-4">
                <div className="space-y-4">
                  <div className="flex items-end justify-between">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Overall Proficiency</span>
                    <span className="text-4xl font-black text-indigo-700">{student.overall}%</span>
                  </div>
                  <Progress value={student.overall} className="h-3 bg-indigo-50" />
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    Subject Performance
                  </h4>
                  <div className="space-y-3">
                    {student.scores.map((score) => (
                      <div key={score.subject} className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-600">{score.subject}</span>
                        <div className="flex items-center gap-3">
                          <span className="font-black text-slate-800">{score.score}</span>
                          <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-none shadow-2xl rounded-3xl overflow-hidden bg-white print:border-black">
          <CardHeader className="bg-slate-50/50 border-b px-10 py-8 print:border-black">
            <CardTitle className="text-xl font-bold text-slate-800">Detailed Rankings / વિગતવાર ગુણક્રમ</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table className="print:border-black">
              <TableHeader className="bg-slate-50/30 print:bg-white">
                <TableRow className="print:border-black">
                  <TableHead className="px-10 font-black text-slate-400 uppercase text-[10px] tracking-wider print:text-black print:border-black h-14">Student / નામ</TableHead>
                  <TableHead className="font-black text-slate-400 uppercase text-[10px] tracking-wider print:text-black print:border-black h-14">Standard / ધોરણ</TableHead>
                  <TableHead className="px-10 font-black text-slate-400 uppercase text-[10px] tracking-wider text-right print:text-black print:border-black h-14">Aggregate / ટકા</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topStudents.map((student) => (
                  <TableRow key={student.id} className="hover:bg-indigo-50/20 transition-colors print:border-black border-slate-100 h-14">
                    <TableCell className="px-10 font-bold text-slate-700 text-sm print:text-black print:border-black">{student.name}</TableCell>
                    <TableCell className="font-bold text-slate-500 text-[11px] print:text-black print:border-black uppercase">{student.academicStandard}</TableCell>
                    <TableCell className="px-10 text-right print:border-black">
                      <Badge className="bg-indigo-600 font-black px-4 py-1.5 rounded-full text-xs print:border-none print:bg-transparent print:text-black print:font-black">
                        {student.overall}%
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

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

  const topStudents = students.slice(0, 5).map((s, index) => {
    const scores = [
      { subject: "Mathematics", score: 98 - index * 2 },
      { subject: "Science", score: 95 - index * 3 },
      { subject: "English", score: 92 - index * 1 },
      { subject: "Social Studies", score: 96 - index * 2 },
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
      case 1: return <Trophy className="w-8 h-8 text-yellow-500" />;
      case 2: return <Medal className="w-8 h-8 text-slate-400" />;
      case 3: return <Medal className="w-8 h-8 text-amber-600" />;
      default: return null;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return "bg-yellow-50 border-yellow-200";
      case 2: return "bg-slate-50 border-slate-200";
      case 3: return "bg-amber-50 border-amber-100";
      default: return "bg-white";
    }
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between no-print">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">Top Performers - Academic Excellence</h1>
          </div>
          <Button variant="outline" onClick={() => window.print()} className="font-bold border-slate-200">
            <Printer className="w-4 h-4 mr-2" />
            Print Rankings
          </Button>
        </div>

        {/* PRINT HEADER */}
        <div className="hidden print:block text-center space-y-2 border-b-2 border-slate-900 pb-4 mb-6">
          <h1 className="text-2xl font-black uppercase">EduPulse Global Academy</h1>
          <h2 className="text-lg font-bold uppercase">Hall of Fame - Top Performers</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 no-print">
          {topStudents.slice(0, 3).map((student) => (
            <Card key={student.id} className={`border-2 transition-all hover:shadow-lg ${getRankColor(student.rank)} overflow-hidden`}>
              <CardHeader className="relative pb-2">
                <div className="absolute top-4 right-4">
                  {getRankIcon(student.rank)}
                </div>
                <div className="space-y-1">
                  <Badge variant="outline" className="font-bold border-primary/20 text-primary">
                    Rank #{student.rank}
                  </Badge>
                  <CardTitle className="text-xl font-bold truncate pr-10">{student.name}</CardTitle>
                  <CardDescription className="font-medium">{student.academicStandard}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-end justify-between">
                    <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Overall Proficiency</span>
                    <span className="text-3xl font-black text-primary">{student.overall}%</span>
                  </div>
                  <Progress value={student.overall} className="h-2" />
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    Subject Performance
                  </h4>
                  <div className="space-y-2">
                    {student.scores.map((score) => (
                      <div key={score.subject} className="flex items-center justify-between text-sm">
                        <span className="font-medium text-slate-600">{score.subject}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-bold">{score.score}</span>
                          <ArrowUpRight className="w-3 h-3 text-green-500" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white print:border-black">
          <CardHeader className="border-b px-8 py-6 print:border-black">
            <CardTitle className="text-xl font-bold text-slate-700">Detailed Subject-wise Rankings</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table className="print:border-black">
              <TableHeader className="bg-slate-50/50 print:bg-white">
                <TableRow className="print:border-black">
                  <TableHead className="px-8 font-bold text-slate-500 uppercase text-xs tracking-wider print:text-black print:border-black">Student</TableHead>
                  <TableHead className="font-bold text-slate-500 uppercase text-xs tracking-wider print:text-black print:border-black">Mathematics</TableHead>
                  <TableHead className="font-bold text-slate-500 uppercase text-xs tracking-wider print:text-black print:border-black">Science</TableHead>
                  <TableHead className="font-bold text-slate-500 uppercase text-xs tracking-wider print:text-black print:border-black">English</TableHead>
                  <TableHead className="font-bold text-slate-500 uppercase text-xs tracking-wider print:text-black print:border-black">Social Studies</TableHead>
                  <TableHead className="px-8 font-bold text-slate-500 uppercase text-xs tracking-wider text-right print:text-black print:border-black">Aggregate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topStudents.map((student) => (
                  <TableRow key={student.id} className="hover:bg-slate-50 transition-colors print:border-black">
                    <TableCell className="px-8 font-bold text-slate-700 print:text-black print:border-black">{student.name}</TableCell>
                    {student.scores.map((s) => (
                      <TableCell key={s.subject} className="text-slate-600 font-medium print:text-black print:border-black">
                        {s.score}
                      </TableCell>
                    ))}
                    <TableCell className="px-8 text-right print:border-black">
                      <Badge className="bg-primary font-bold px-3 py-1 rounded-full print:border-none print:bg-transparent print:text-black print:font-black">
                        {student.overall}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="flex justify-end pt-6 no-print mb-12">
          <Button size="lg" variant="outline" onClick={() => window.print()} className="font-bold gap-2">
            <Printer className="w-4 h-4" />
            Print Merit List
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
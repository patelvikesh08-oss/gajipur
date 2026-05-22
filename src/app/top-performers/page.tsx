
"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { useStudentStore } from "@/lib/student-store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Trophy, Star, Medal, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";

export default function TopPerformersPage() {
  const { students, isLoaded } = useStudentStore();

  if (!isLoaded) return null;

  // Mock performance data for the first 3 students as placeholders
  const topStudents = students.slice(0, 3).map((s, index) => {
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
        <div className="flex items-center gap-3">
          <div className="p-2 bg-yellow-100 rounded-lg">
            <Star className="w-6 h-6 text-yellow-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Top Performers - Academic Excellence</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {topStudents.map((student) => (
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

        <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white">
          <CardHeader className="border-b px-8 py-6">
            <CardTitle className="text-xl font-bold text-slate-700">Detailed Subject-wise Rankings</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow>
                  <TableHead className="px-8 font-bold text-slate-500 uppercase text-xs tracking-wider">Student</TableHead>
                  <TableHead className="font-bold text-slate-500 uppercase text-xs tracking-wider">Mathematics</TableHead>
                  <TableHead className="font-bold text-slate-500 uppercase text-xs tracking-wider">Science</TableHead>
                  <TableHead className="font-bold text-slate-500 uppercase text-xs tracking-wider">English</TableHead>
                  <TableHead className="font-bold text-slate-500 uppercase text-xs tracking-wider">Social Studies</TableHead>
                  <TableHead className="px-8 font-bold text-slate-500 uppercase text-xs tracking-wider text-right">Aggregate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topStudents.map((student) => (
                  <TableRow key={student.id} className="hover:bg-slate-50 transition-colors">
                    <TableCell className="px-8 font-bold text-slate-700">{student.name}</TableCell>
                    {student.scores.map((s) => (
                      <TableCell key={s.subject} className="text-slate-600 font-medium">
                        {s.score}
                      </TableCell>
                    ))}
                    <TableCell className="px-8 text-right">
                      <Badge className="bg-primary hover:bg-primary font-bold px-3 py-1 rounded-full">
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

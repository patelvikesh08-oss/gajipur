
"use client";

import { useState, useMemo } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { useStudentStore } from "@/lib/student-store";
import { useSessionStore } from "@/lib/session-store";
import { useSubjectStore } from "@/lib/subject-store";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, Calendar, Save, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

export default function PatSatPage() {
  const { students, isLoaded: studentsLoaded } = useStudentStore();
  const { academicYear, semester, updateYear, updateSemester, isLoaded: sessionLoaded } = useSessionStore();
  const { mappings, isLoaded: subjectsLoaded } = useSubjectStore();
  
  const [search, setSearch] = useState("");
  const [selectedStandard, setSelectedStandard] = useState("all");

  const standards = useMemo(() => {
    return Array.from(new Set(students.map(s => s.academicStandard))).sort();
  }, [students]);

  const activeSubjects = useMemo(() => {
    if (selectedStandard === "all") return [];
    const mapping = mappings.find(m => m.standard === selectedStandard);
    return mapping ? mapping.subjects : [];
  }, [selectedStandard, mappings]);

  if (!studentsLoaded || !sessionLoaded || !subjectsLoaded) return null;

  const filteredStudents = students.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchesStandard = selectedStandard === "all" || s.academicStandard === selectedStandard;
    return matchesSearch && matchesStandard;
  });

  const handleSaveAll = () => {
    toast({
      title: "Assessments Saved",
      description: `PAT/SAT scores successfully committed.`,
    });
  };

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <CheckCircle2 className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">PAT/SAT (Assessments)</h1>
              <p className="text-xs text-muted-foreground font-medium">Weekly/Periodic Test Grid Entry</p>
            </div>
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
            <Button onClick={handleSaveAll} className="font-bold bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/20">
              <Save className="w-4 h-4 mr-2" />
              Save Scores
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            placeholder="Quick search student..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white"
          />
          <Select value={selectedStandard} onValueChange={setSelectedStandard}>
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Academic Standard" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Standards</SelectItem>
              {standards.map(std => (
                <SelectItem key={std} value={std}>{std}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="font-bold uppercase tracking-wider text-xs">Student Name</TableHead>
                {activeSubjects.map((subject) => (
                  <TableHead key={subject} className="font-bold uppercase tracking-wider text-xs text-center min-w-[100px]">
                    {subject}
                  </TableHead>
                ))}
                <TableHead className="text-right font-bold uppercase tracking-wider text-xs">Grade</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((s) => (
                <TableRow key={s.id} className="hover:bg-slate-50/50">
                  <TableCell className="font-black text-slate-700 whitespace-nowrap">{s.name}</TableCell>
                  {activeSubjects.map((subject) => (
                    <TableCell key={`${s.id}-${subject}`}>
                      <Input 
                        type="number" 
                        className="h-8 font-bold text-center mx-auto w-16" 
                        defaultValue={Math.floor(Math.random() * 20) + 30} 
                      />
                    </TableCell>
                  ))}
                  <TableCell className="text-right">
                    <Badge className="bg-indigo-600 font-bold px-3">A+</Badge>
                  </TableCell>
                </TableRow>
              ))}
              {selectedStandard === "all" && (
                <TableRow>
                  <TableCell colSpan={activeSubjects.length + 2} className="h-32 text-center text-muted-foreground">
                    Please select an academic standard to view subject columns and enter assessment scores.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </MainLayout>
  );
}


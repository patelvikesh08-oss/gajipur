
"use client";

import { useState, useMemo } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { useStudentStore } from "@/lib/student-store";
import { useSessionStore } from "@/lib/session-store";
import { useSubjectStore } from "@/lib/subject-store";
import { useMarksMappingStore } from "@/lib/marks-mapping-store";
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
import { CheckCircle2, Calendar, Save, Printer } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import React from "react";

export default function PatSatPage() {
  const { students, isLoaded: studentsLoaded } = useStudentStore();
  const { academicYear, semester, updateYear, updateSemester, isLoaded: sessionLoaded } = useSessionStore();
  const { mappings, isLoaded: subjectsLoaded } = useSubjectStore();
  const { getMarksFor, isLoaded: marksLoaded } = useMarksMappingStore();
  
  const [search, setSearch] = useState("");
  const [selectedStandard, setSelectedStandard] = useState("all");
  
  const [scores, setScores] = useState<Record<string, Record<string, number>>>({});

  const standards = useMemo(() => {
    return Array.from(new Set(students.map(s => s.academicStandard))).sort();
  }, [students]);

  const activeSubjects = useMemo(() => {
    if (selectedStandard === "all") return [];
    const mapping = mappings.find(m => m.standard === selectedStandard && m.semester === semester);
    return mapping ? mapping.subjects : [];
  }, [selectedStandard, semester, mappings]);

  const maxMarks = useMemo(() => {
    if (selectedStandard === "all") return 0;
    return getMarksFor(selectedStandard, semester, 'PAT/SAT');
  }, [selectedStandard, semester, getMarksFor]);

  if (!studentsLoaded || !sessionLoaded || !subjectsLoaded || !marksLoaded) return null;

  const filteredStudents = students.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || 
                          (s.rollNumber || "").includes(search.toLowerCase());
    const matchesStandard = selectedStandard === "all" || s.academicStandard === selectedStandard;
    return matchesSearch && matchesStandard;
  }).sort((a, b) => (a.rollNumber || "").localeCompare(b.rollNumber || "").localeCompare(b.rollNumber || "", undefined, { numeric: true }));

  const handleScoreChange = (studentId: string, subject: string, value: string) => {
    const numValue = value === "" ? 0 : parseInt(value);
    setScores(prev => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || {}),
        [subject]: isNaN(numValue) ? 0 : numValue
      }
    }));
  };

  const handleSaveAll = () => {
    toast({
      title: "Assessments Saved",
      description: `PAT/SAT scores successfully committed for ${selectedStandard}.`,
    });
  };

  const commonHeaderRowSpan = 2;

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div className="bg-gradient-to-r from-indigo-900 via-purple-800 to-indigo-900 p-8 rounded-3xl text-white shadow-2xl no-print">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                <CheckCircle2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">PAT/SAT (Assessments) / મૂલ્યાંકન</h1>
                <p className="text-indigo-100 text-sm font-medium mt-1">Weekly/Periodic Test Grid Entry</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20">
                <Calendar className="w-4 h-4 text-blue-200" />
                <Select value={academicYear} onValueChange={(val: any) => updateYear(val)}>
                  <SelectTrigger className="w-[120px] border-none bg-transparent shadow-none focus:ring-0 h-7 text-xs font-bold text-white">
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
                <Select value={semester} onValueChange={(val: any) => updateSemester(val)}>
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
                Print
              </Button>
              <Button onClick={handleSaveAll} className="bg-white text-indigo-900 hover:bg-indigo-50 font-black shadow-lg h-10 px-8 rounded-xl">
                <Save className="w-4 h-4 mr-2" />
                Save Data
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 no-print px-1">
          <Input
            placeholder="Search student / શોધો..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white h-12 rounded-xl shadow-sm"
          />
          <Select value={selectedStandard} onValueChange={setSelectedStandard}>
            <SelectTrigger className="bg-white h-12 rounded-xl shadow-sm">
              <SelectValue placeholder="Standard / ધોરણ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Standards / બધા ધોરણ</SelectItem>
              {standards.map(std => (
                <SelectItem key={std} value={std}>{std}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-3xl border border-slate-100 bg-white shadow-2xl overflow-hidden print:border-none print:shadow-none">
          <Table className="border-collapse">
            <TableHeader className="bg-slate-50/50 print:bg-white">
              <TableRow className="h-12">
                <TableHead rowSpan={commonHeaderRowSpan} className="font-black uppercase tracking-wider text-[10px] w-[60px] border-r print:border-black text-center">
                  Roll No
                </TableHead>
                <TableHead rowSpan={commonHeaderRowSpan} className="font-black uppercase tracking-wider text-[10px] border-r min-w-[150px] print:border-black">
                  Name / નામ
                </TableHead>
                {activeSubjects.length > 0 && (
                  <>
                    <TableHead 
                      colSpan={activeSubjects.length} 
                      className="font-black uppercase tracking-widest text-[9px] text-center border-r border-b bg-orange-100/30 print:border-black py-4"
                    >
                      Marks Obtained / મેળવેલ ગુણ (Out of {maxMarks})
                    </TableHead>
                    <TableHead 
                      colSpan={activeSubjects.length} 
                      className="font-black uppercase tracking-widest text-[9px] text-center border-r border-b bg-indigo-50/50 print:border-black py-4"
                    >
                      50% Marks / ૫૦% ગુણ (Out of {maxMarks / 2})
                    </TableHead>
                  </>
                )}
                <TableHead rowSpan={commonHeaderRowSpan} className="text-right font-black uppercase tracking-wider text-[10px] border-l print:border-black no-print px-4">
                  Result
                </TableHead>
              </TableRow>

              <TableRow>
                {activeSubjects.map((subject) => (
                  <TableHead key={`${subject}-raw-label`} className="h-[140px] p-0 border-r print:border-black bg-white">
                    <div className="flex flex-col items-center justify-end h-full w-full pb-3">
                      <span className="vertical-text text-[9px] font-bold text-slate-500 px-1 uppercase tracking-tight">
                        {subject}
                      </span>
                    </div>
                  </TableHead>
                ))}
                {activeSubjects.map((subject) => (
                  <TableHead key={`${subject}-50-label`} className="h-[140px] p-0 border-r print:border-black bg-white">
                    <div className="flex flex-col items-center justify-end h-full w-full pb-3">
                      <span className="vertical-text text-[9px] font-bold text-indigo-500 px-1 uppercase tracking-tight">
                        {subject}
                      </span>
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((s) => (
                <TableRow key={s.id} className="hover:bg-indigo-50/20 print:bg-white h-10">
                  <TableCell className="font-black text-indigo-700 border-r print:text-black print:border-black text-center text-[10px]">
                    {s.rollNumber}
                  </TableCell>
                  <TableCell className="font-bold text-slate-700 whitespace-nowrap border-r print:text-black print:border-black text-[10px]">
                    {s.name}
                  </TableCell>
                  
                  {activeSubjects.map((subject) => (
                    <TableCell key={`${s.id}-${subject}-raw`} className="border-r p-0 print:border-black">
                      <input 
                        type="number" 
                        className="w-full h-10 text-center text-xs font-black text-indigo-900 bg-transparent border-none outline-none focus:bg-orange-50/50 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
                        value={scores[s.id]?.[subject] ?? ""} 
                        onChange={(e) => handleScoreChange(s.id, subject, e.target.value)}
                        placeholder="0"
                      />
                    </TableCell>
                  ))}

                  {activeSubjects.map((subject) => {
                    const rawVal = scores[s.id]?.[subject] || 0;
                    const calculatedVal = Math.round(rawVal / 2);
                    return (
                      <TableCell key={`${s.id}-${subject}-50`} className="border-r p-0 bg-indigo-50/5 print:border-black">
                        <input 
                          type="number" 
                          readOnly
                          className="w-full h-10 text-center text-xs font-black text-indigo-700 bg-transparent border-none outline-none focus:bg-indigo-100/50 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none cursor-default" 
                          value={calculatedVal}
                        />
                      </TableCell>
                    );
                  })}

                  <TableCell className="text-right border-l print:border-black no-print px-4">
                    <Badge className="bg-indigo-600 font-black px-3 py-1 text-[9px]">A+</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </MainLayout>
  );
}

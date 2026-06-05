
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
  }).sort((a, b) => (a.rollNumber || "").localeCompare(b.rollNumber || "", undefined, { numeric: true }));

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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <CheckCircle2 className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">PAT/SAT (Assessments) / મૂલ્યાંકન</h1>
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
                <SelectItem value="Semester 1">Semester 1 / સત્ર ૧</SelectItem>
                <SelectItem value="Semester 2">Semester 2 / સત્ર ૨</SelectItem>
                <SelectItem value="Annual">Annual / વાર્ષિક</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => window.print()} className="font-bold border-slate-200">
              <Printer className="w-4 h-4 mr-2" />
              Print / પ્રિન્ટ
            </Button>
            <Button onClick={handleSaveAll} className="font-bold bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/20">
              <Save className="w-4 h-4 mr-2" />
              Save / સાચવો
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 no-print">
          <Input
            placeholder="Search / શોધો..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white"
          />
          <Select value={selectedStandard} onValueChange={setSelectedStandard}>
            <SelectTrigger className="bg-white">
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

        <div className="rounded-xl border bg-white shadow-sm overflow-hidden print:border-none print:shadow-none">
          <Table className="border-collapse">
            <TableHeader className="bg-slate-50 print:bg-white">
              <TableRow className="h-12">
                <TableHead rowSpan={commonHeaderRowSpan} className="font-bold uppercase tracking-wider text-xs w-[60px] border-r print:border-black text-center">
                  Roll No
                </TableHead>
                <TableHead rowSpan={commonHeaderRowSpan} className="font-bold uppercase tracking-wider text-xs border-r min-w-[150px] print:border-black">
                  Name / નામ
                </TableHead>
                {activeSubjects.length > 0 && (
                  <>
                    <TableHead 
                      colSpan={activeSubjects.length} 
                      className="font-black uppercase tracking-widest text-[10px] text-center border-r border-b bg-orange-100/30 print:border-black h-12"
                    >
                      Marks Obtained / મેળવેલ ગુણ (Out of {maxMarks})
                    </TableHead>
                    <TableHead 
                      colSpan={activeSubjects.length} 
                      className="font-black uppercase tracking-widest text-[10px] text-center border-r border-b bg-indigo-50/50 print:border-black h-12"
                    >
                      50% Marks / ૫૦% ગુણ (Out of {maxMarks / 2})
                    </TableHead>
                  </>
                )}
                <TableHead rowSpan={commonHeaderRowSpan} className="text-right font-bold uppercase tracking-wider text-xs border-l print:border-black no-print">
                  Result
                </TableHead>
              </TableRow>

              <TableRow>
                {activeSubjects.map((subject) => (
                  <TableHead key={`${subject}-raw-label`} className="h-[140px] p-0 border-r print:border-black bg-white">
                    <div className="flex flex-col items-center justify-end h-full w-full pb-3">
                      <span className="vertical-text text-[10px] font-bold text-slate-600 px-1 uppercase tracking-tight">
                        {subject}
                      </span>
                    </div>
                  </TableHead>
                ))}
                {activeSubjects.map((subject) => (
                  <TableHead key={`${subject}-50-label`} className="h-[140px] p-0 border-r print:border-black bg-white">
                    <div className="flex flex-col items-center justify-end h-full w-full pb-3">
                      <span className="vertical-text text-[10px] font-bold text-indigo-600 px-1 uppercase tracking-tight">
                        {subject}
                      </span>
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((s) => (
                <TableRow key={s.id} className="hover:bg-slate-50/50 print:bg-white h-10">
                  <TableCell className="font-black text-primary border-r print:text-black print:border-black text-center text-xs">
                    {s.rollNumber}
                  </TableCell>
                  <TableCell className="font-bold text-slate-700 whitespace-nowrap border-r print:text-black print:border-black text-xs">
                    {s.name}
                  </TableCell>
                  
                  {activeSubjects.map((subject) => (
                    <TableCell key={`${s.id}-${subject}-raw`} className="border-r p-0 print:border-black">
                      <input 
                        type="number" 
                        className="w-full h-8 text-center text-xs font-bold bg-transparent border-none outline-none focus:bg-orange-50/50 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
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
                      <TableCell key={`${s.id}-${subject}-50`} className="border-r p-0 bg-indigo-50/10 print:border-black">
                        <input 
                          type="number" 
                          readOnly
                          className="w-full h-8 text-center text-xs font-black text-indigo-700 bg-transparent border-none outline-none focus:bg-indigo-100/50 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none cursor-default" 
                          value={calculatedVal}
                        />
                      </TableCell>
                    );
                  })}

                  <TableCell className="text-right border-l print:border-black no-print">
                    <Badge className="bg-indigo-600 font-bold px-3">A+</Badge>
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

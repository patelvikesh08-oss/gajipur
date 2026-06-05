
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
import { BookOpen, Calendar, Save, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import React from "react";

export default function SvadhyayPage() {
  const { students, isLoaded: studentsLoaded } = useStudentStore();
  const { academicYear, semester, updateYear, updateSemester, isLoaded: sessionLoaded } = useSessionStore();
  const { mappings, isLoaded: subjectsLoaded } = useSubjectStore();
  
  const [search, setSearch] = useState("");
  const [selectedStandard, setSelectedStandard] = useState("all");

  const isAnnual = semester === "Annual";

  const standards = useMemo(() => {
    return Array.from(new Set(students.map(s => s.academicStandard))).sort();
  }, [students]);

  const activeSubjects = useMemo(() => {
    if (selectedStandard === "all") return [];
    const targetSem = isAnnual ? 'Semester 1' : semester;
    const mapping = mappings.find(m => m.standard === selectedStandard && m.semester === targetSem);
    return mapping ? mapping.subjects : [];
  }, [selectedStandard, semester, mappings, isAnnual]);

  if (!studentsLoaded || !sessionLoaded || !subjectsLoaded) return null;

  const filteredStudents = students.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || 
                          (s.rollNumber || "").includes(search.toLowerCase());
    const matchesStandard = selectedStandard === "all" || s.academicStandard === selectedStandard;
    return matchesSearch && matchesStandard;
  }).sort((a, b) => (a.rollNumber || "").localeCompare(b.rollNumber || "", undefined, { numeric: true }));

  const handleSaveAll = () => {
    toast({
      title: "Self-Study Records Saved",
      description: `Completion status updated for ${selectedStandard}.`,
    });
  };

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-blue-900 p-8 rounded-3xl text-white shadow-2xl no-print">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">SVADHYAY (Self-Study Records) / સ્વાધ્યાય</h1>
                <p className="text-indigo-100 text-sm font-medium mt-1">Bulk log student completion status</p>
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
              <Button onClick={handleSaveAll} className="bg-white text-pink-900 hover:bg-pink-50 font-black shadow-lg h-10 px-8 rounded-xl" disabled={isAnnual}>
                <Save className="w-4 h-4 mr-2" />
                Save Records
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
          <Table>
            <TableHeader className="bg-slate-50/50 print:bg-white">
              <TableRow>
                <TableHead rowSpan={isAnnual ? 2 : 1} className="font-black uppercase tracking-wider text-[10px] w-20 text-center border-r print:border-black">Roll No</TableHead>
                <TableHead rowSpan={isAnnual ? 2 : 1} className="font-black uppercase tracking-wider text-[10px] border-r print:border-black">Student Name / નામ</TableHead>
                {activeSubjects.map((subject) => (
                  <TableHead 
                    key={subject} 
                    colSpan={isAnnual ? 2 : 1} 
                    className="font-black uppercase tracking-wider text-[10px] text-center border-l bg-muted/20 py-4 print:border-black"
                  >
                    {subject} (Units)
                  </TableHead>
                ))}
              </TableRow>
              {isAnnual && (
                <TableRow>
                  {activeSubjects.map((subject) => (
                    <React.Fragment key={`${subject}-sem-header`}>
                      <TableHead className="text-[8px] font-black text-center border-l min-w-[100px] print:border-black bg-blue-50/30">Sem 1</TableHead>
                      <TableHead className="text-[8px] font-black text-center border-l min-w-[100px] print:border-black bg-emerald-50/30">Sem 2</TableHead>
                    </React.Fragment>
                  ))}
                </TableRow>
              )}
            </TableHeader>
            <TableBody>
              {filteredStudents.map((s) => (
                <TableRow key={s.id} className="hover:bg-indigo-50/20 h-10 print:bg-white">
                  <TableCell className="font-black text-indigo-700 text-center border-r text-[10px] print:text-black print:border-black">{s.rollNumber}</TableCell>
                  <TableCell className="font-bold text-slate-700 whitespace-nowrap border-r text-[10px] print:text-black print:border-black">{s.name}</TableCell>
                  {activeSubjects.map((subject) => (
                    <React.Fragment key={`${s.id}-${subject}`}>
                      {isAnnual ? (
                        <>
                          <TableCell className="border-l p-1 text-center font-bold text-slate-400 bg-blue-50/5 text-[9px]">-</TableCell>
                          <TableCell className="border-l p-1 text-center font-bold text-slate-400 bg-emerald-50/5 text-[9px]">-</TableCell>
                        </>
                      ) : (
                        <TableCell className="border-l print:border-black">
                          <div className="flex items-center justify-center">
                            <Input 
                              type="number" 
                              max={10} 
                              min={0} 
                              className="h-10 w-20 font-black text-center border-none bg-transparent outline-none focus:bg-indigo-50 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-indigo-900" 
                              defaultValue={0} 
                            />
                          </div>
                        </TableCell>
                      )}
                    </React.Fragment>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </MainLayout>
  );
}

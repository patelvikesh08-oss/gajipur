
"use client";

import { useState, useMemo } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { useStudentStore } from "@/lib/student-store";
import { useSessionStore } from "@/lib/session-store";
import { useSubjectStore } from "@/lib/subject-store";
import { usePatrakAStore } from "@/lib/patrak-a-store";
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
import { FileDigit, Calendar, Save, Printer, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import React from "react";

export default function PatrakAPage() {
  const { students, isLoaded: studentsLoaded } = useStudentStore();
  const { academicYear, semester, updateYear, updateSemester, isLoaded: sessionLoaded } = useSessionStore();
  const { mappings, isLoaded: subjectsLoaded } = useSubjectStore();
  
  // For Annual, we need to load both semesters. For simplicity in this prototype, 
  // we'll use the store for the current selection, but if Annual is selected, 
  // users would typically switch to S1 or S2 to enter data, or we'd load both.
  // Here we'll treat Annual as a view of S1+S2.
  const { saveEntry, getMarksForStudent, isLoaded: patrakALoaded } = usePatrakAStore(academicYear, semester === 'Annual' ? 'Semester 1' : semester);
  
  const [search, setSearch] = useState("");
  const [selectedStandard, setSelectedStandard] = useState("all");

  const isAnnual = semester === "Annual";

  const standards = useMemo(() => {
    return Array.from(new Set(students.map(s => s.academicStandard))).sort();
  }, [students]);

  const activeSubjects = useMemo(() => {
    if (selectedStandard === "all") return [];
    // For Annual mapping, we use S1 as the baseline
    const targetSem = isAnnual ? 'Semester 1' : semester;
    const mapping = mappings.find(m => m.standard === selectedStandard && m.semester === targetSem);
    return mapping ? mapping.subjects : [];
  }, [selectedStandard, semester, mappings, isAnnual]);

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || 
                            (s.rollNumber || "").includes(search.toLowerCase());
      const matchesStandard = selectedStandard === "all" || s.academicStandard === selectedStandard;
      return matchesSearch && matchesStandard;
    }).sort((a, b) => (a.rollNumber || "").localeCompare(b.rollNumber || "", undefined, { numeric: true }));
  }, [students, search, selectedStandard]);

  const handleMarkChange = (studentId: string, subject: string, value: string) => {
    if (isAnnual) return; // Entry disabled in Annual mode
    const numValue = value === "" ? 0 : parseInt(value);
    if (isNaN(numValue)) return;
    
    const currentMarks = getMarksForStudent(studentId);
    saveEntry(studentId, {
      ...currentMarks,
      [subject]: numValue
    });
  };

  const handleSaveAll = () => {
    toast({
      title: "Patrak-A Records Saved",
      description: `Formative assessment data for ${academicYear} has been committed.`,
    });
  };

  if (!studentsLoaded || !sessionLoaded || !subjectsLoaded || !patrakALoaded) return null;

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileDigit className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">PATRAK-A (Formative) / પત્રક-અ</h1>
              <p className="text-xs text-muted-foreground font-medium">Log subject-wise formative assessment records</p>
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
            <Button onClick={handleSaveAll} className="font-bold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20" disabled={isAnnual}>
              <Save className="w-4 h-4 mr-2" />
              Save / સાચવો
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 no-print">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search student / શોધો..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white pl-10"
            />
          </div>
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
          <ScrollArea className="w-full">
            <Table className="border-collapse">
              <TableHeader className="bg-slate-50 print:bg-white">
                <TableRow>
                  <TableHead rowSpan={isAnnual ? 2 : 1} className="font-bold uppercase tracking-wider text-xs w-[60px] border-r sticky left-0 bg-slate-50 z-20 text-center print:border-black">Roll No</TableHead>
                  <TableHead rowSpan={isAnnual ? 2 : 1} className="font-bold uppercase tracking-wider text-xs min-w-[180px] border-r sticky left-[60px] bg-slate-50 z-20 print:border-black">Student Name / નામ</TableHead>
                  
                  {activeSubjects.length > 0 ? (
                    activeSubjects.map(subject => (
                      <TableHead key={subject} colSpan={isAnnual ? 2 : 1} className="font-black uppercase tracking-wider text-[10px] text-center border-r bg-muted/30 py-4 min-w-[100px] print:border-black">
                        {subject}
                      </TableHead>
                    ))
                  ) : (
                    <TableHead className="text-center italic text-muted-foreground text-xs py-4">
                      No subjects mapped / વિષયો પસંદ કરો
                    </TableHead>
                  )}
                  
                  <TableHead rowSpan={isAnnual ? 2 : 1} className="font-bold uppercase tracking-wider text-[10px] text-center border-r min-w-[80px] bg-blue-50/50 print:border-black">Total</TableHead>
                </TableRow>
                {isAnnual && (
                  <TableRow>
                    {activeSubjects.map(subject => (
                      <React.Fragment key={`${subject}-sub`}>
                        <TableHead className="text-[8px] font-black text-center border-r bg-blue-50/30">SEM 1</TableHead>
                        <TableHead className="text-[8px] font-black text-center border-r bg-green-50/30">SEM 2</TableHead>
                      </React.Fragment>
                    ))}
                  </TableRow>
                )}
              </TableHeader>
              <TableBody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((s) => {
                    const studentMarks = getMarksForStudent(s.id);
                    const total = Object.values(studentMarks).reduce((a, b) => a + b, 0);

                    return (
                      <TableRow key={s.id} className="hover:bg-slate-50/50 h-10 print:h-auto print:bg-white">
                        <TableCell className="font-black text-primary border-r sticky left-0 bg-white z-10 text-center text-xs print:text-black print:border-black">
                          {s.rollNumber}
                        </TableCell>
                        <TableCell className="font-bold text-slate-700 border-r sticky left-[60px] bg-white z-10 text-xs print:text-black print:border-black">
                          {s.name}
                        </TableCell>
                        
                        {activeSubjects.map(subject => (
                          <React.Fragment key={`${s.id}-${subject}`}>
                            {isAnnual ? (
                              <>
                                <TableCell className="p-0 border-r text-center text-xs font-bold text-slate-500 bg-blue-50/5">
                                  {studentMarks[subject] ?? "-"}
                                </TableCell>
                                <TableCell className="p-0 border-r text-center text-xs font-bold text-slate-500 bg-green-50/5">
                                  -
                                </TableCell>
                              </>
                            ) : (
                              <TableCell key={`${s.id}-${subject}`} className="p-0 border-r print:border-black">
                                <input 
                                  type="number"
                                  className="w-full h-10 text-center text-xs font-bold bg-transparent border-none outline-none focus:bg-blue-50 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
                                  value={studentMarks[subject] ?? ""} 
                                  onChange={(e) => handleMarkChange(s.id, subject, e.target.value)}
                                  placeholder="-"
                                />
                              </TableCell>
                            )}
                          </React.Fragment>
                        ))}

                        <TableCell className="text-center font-black text-blue-600 bg-blue-50/10 border-r print:text-black print:border-black text-xs">
                          {total}
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={(activeSubjects.length * (isAnnual ? 2 : 1)) + 3} className="h-32 text-center text-muted-foreground italic">
                      No student records found. / કોઈ માહિતી મળી નથી.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <ScrollBar orientation="horizontal" className="no-print" />
          </ScrollArea>
        </div>
      </div>
    </MainLayout>
  );
}

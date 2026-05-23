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

  const isAnnual = semester === "Annual";

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

  const handleSaveAll = () => {
    toast({
      title: "Assessments Saved",
      description: `PAT/SAT scores successfully committed for ${selectedStandard}.`,
    });
  };

  // Header row span calculation: Max Marks + 50% Marks + Subject Name (+ Semesters if Annual)
  const baseHeaderRowSpan = isAnnual ? 4 : 3;

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
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
            <Button variant="outline" onClick={() => window.print()} className="font-bold border-slate-200">
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
            <Button onClick={handleSaveAll} className="font-bold bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/20">
              <Save className="w-4 h-4 mr-2" />
              Save Scores
            </Button>
          </div>
        </div>

        {/* PRINT HEADER */}
        <div className="hidden print:block text-center space-y-2 border-b-2 border-slate-900 pb-4 mb-6">
          <h1 className="text-2xl font-black uppercase">EduPulse Global Academy</h1>
          <h2 className="text-lg font-bold uppercase">PAT/SAT Assessment Records</h2>
          <div className="flex justify-center gap-8 font-bold text-xs">
            <span>Academic Year: {academicYear}</span>
            <span>Semester: {semester}</span>
            <span>Standard: {selectedStandard === 'all' ? 'All' : selectedStandard}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 no-print">
          <Input
            placeholder="Quick search student name or roll number..."
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

        <div className="rounded-xl border bg-white shadow-sm overflow-hidden print:border-none print:shadow-none">
          <Table>
            <TableHeader className="bg-slate-50 print:bg-white">
              {/* Row 1: Marks Out Of [Max] */}
              <TableRow>
                <TableHead rowSpan={baseHeaderRowSpan} className="font-bold uppercase tracking-wider text-xs w-[80px] print:border-black border-r">Roll No</TableHead>
                <TableHead rowSpan={baseHeaderRowSpan} className="font-bold uppercase tracking-wider text-xs print:border-black border-r">Student Name</TableHead>
                {activeSubjects.map((subject) => (
                  <TableHead 
                    key={`${subject}-max-header`} 
                    colSpan={isAnnual ? 2 : 1} 
                    className="font-black uppercase tracking-widest text-[10px] text-center border-r bg-indigo-50/50 print:border-black h-10"
                  >
                    Marks out of {maxMarks}
                  </TableHead>
                ))}
                <TableHead rowSpan={baseHeaderRowSpan} className="text-right font-bold uppercase tracking-wider text-xs border-l print:border-black no-print">Grade</TableHead>
              </TableRow>

              {/* Row 2: Marks Out Of 50% */}
              <TableRow>
                {activeSubjects.map((subject) => (
                  <TableHead 
                    key={`${subject}-50-header`} 
                    colSpan={isAnnual ? 2 : 1} 
                    className="font-bold uppercase tracking-wider text-[9px] text-center border-r bg-muted/20 print:border-black h-10"
                  >
                    Marks out of {maxMarks / 2} (50%)
                  </TableHead>
                ))}
              </TableRow>

              {/* Row 3: Subject Name */}
              <TableRow>
                {activeSubjects.map((subject) => (
                  <TableHead 
                    key={subject} 
                    colSpan={isAnnual ? 2 : 1} 
                    className="font-bold uppercase tracking-wider text-xs text-center border-r print:border-black h-10"
                  >
                    {subject}
                  </TableHead>
                ))}
              </TableRow>

              {/* Row 4: Semesters (Optional) */}
              {isAnnual && (
                <TableRow>
                  {activeSubjects.map((subject) => (
                    <React.Fragment key={`${subject}-sem-header`}>
                      <TableHead className="text-[10px] font-bold text-center border-r min-w-[80px] print:border-black h-8 bg-white">Sem 1</TableHead>
                      <TableHead className="text-[10px] font-bold text-center border-r min-w-[80px] print:border-black h-8 bg-white">Sem 2</TableHead>
                    </React.Fragment>
                  ))}
                </TableRow>
              )}
            </TableHeader>
            <TableBody>
              {filteredStudents.map((s) => (
                <TableRow key={s.id} className="hover:bg-slate-50/50 print:bg-white h-10">
                  <TableCell className="font-black text-primary border-r print:text-black print:border-black">{s.rollNumber}</TableCell>
                  <TableCell className="font-bold text-slate-700 whitespace-nowrap border-r print:text-black print:border-black">{s.name}</TableCell>
                  {activeSubjects.map((subject) => (
                    <React.Fragment key={`${s.id}-${subject}`}>
                      {isAnnual ? (
                        <>
                          <TableCell className="border-r p-1 print:border-black">
                            <Input 
                              type="number" 
                              className="h-8 text-center font-bold focus:ring-primary mx-auto w-14 print:border-none" 
                              defaultValue={0} 
                            />
                          </TableCell>
                          <TableCell className="border-r p-1 print:border-black">
                            <Input 
                              type="number" 
                              className="h-8 text-center font-bold focus:ring-primary mx-auto w-14 print:border-none" 
                              defaultValue={0} 
                            />
                          </TableCell>
                        </>
                      ) : (
                        <TableCell className="border-r print:border-black">
                          <Input 
                            type="number" 
                            className="h-8 text-center font-bold focus:ring-primary mx-auto w-16 print:border-none" 
                            defaultValue={0} 
                          />
                        </TableCell>
                      )}
                    </React.Fragment>
                  ))}
                  <TableCell className="text-right border-l print:border-black no-print">
                    <Badge className="bg-indigo-600 font-bold px-3">A+</Badge>
                  </TableCell>
                </TableRow>
              ))}
              {activeSubjects.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-40 text-center text-muted-foreground italic font-medium">
                    Please select a specific academic standard to load assessment columns.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-end gap-3 pt-6 mb-12 no-print">
          <Button variant="outline" size="lg" onClick={() => window.print()} className="font-bold gap-2">
            <Printer className="w-4 h-4" />
            Print Scores
          </Button>
          <Button onClick={handleSaveAll} size="lg" className="font-bold bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 px-8">
            <Save className="w-4 h-4 mr-2" />
            Commit Changes
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}

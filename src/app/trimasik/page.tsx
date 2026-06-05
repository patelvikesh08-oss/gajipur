
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
import { ClipboardList, Calendar, Save, CheckCircle, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import React from "react";

export default function TrimasikPage() {
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
    // For Annual view, we baseline on S1 subjects
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
      title: "Marks Saved Successfully",
      description: `Quarterly records for ${selectedStandard} updated.`,
    });
  };

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <ClipboardList className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">TRIMASIK / ત્રિમાસિક પત્રક</h1>
              <p className="text-xs text-muted-foreground font-medium">Direct marks entry grid / માર્કસ એન્ટ્રી ગ્રીડ</p>
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
            <Button onClick={handleSaveAll} className="font-bold bg-primary shadow-lg shadow-primary/20" disabled={isAnnual}>
              <Save className="w-4 h-4 mr-2" />
              Save All / સાચવો
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
              <SelectValue placeholder="Filter by Standard / ધોરણ મુજબ ફિલ્ટર" />
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
          <Table>
            <TableHeader className="bg-slate-50 print:bg-white">
              <TableRow>
                <TableHead rowSpan={isAnnual ? 2 : 1} className="font-bold uppercase tracking-wider text-xs w-12 text-center print:border-black">Roll No / રોલ</TableHead>
                <TableHead rowSpan={isAnnual ? 2 : 1} className="font-bold uppercase tracking-wider text-xs print:border-black">Student Name / નામ</TableHead>
                {activeSubjects.map((subject) => (
                  <TableHead 
                    key={subject} 
                    colSpan={isAnnual ? 2 : 1} 
                    className="font-bold uppercase tracking-wider text-xs text-center border-l print:border-black"
                  >
                    {subject}
                  </TableHead>
                ))}
                <TableHead rowSpan={isAnnual ? 2 : 1} className="font-bold uppercase tracking-wider text-xs text-center w-[80px] border-l print:border-black">Total / કુલ</TableHead>
                <TableHead rowSpan={isAnnual ? 2 : 1} className="text-right font-bold uppercase tracking-wider text-xs border-l print:border-black no-print">Status / સ્થિતિ</TableHead>
              </TableRow>
              {isAnnual && (
                <TableRow>
                  {activeSubjects.map((subject) => (
                    <React.Fragment key={`${subject}-sem-header`}>
                      <TableHead className="text-[10px] font-bold text-center border-l min-w-[60px] print:border-black">Sem 1</TableHead>
                      <TableHead className="text-[10px] font-bold text-center border-l min-w-[60px] print:border-black">Sem 2</TableHead>
                    </React.Fragment>
                  ))}
                </TableRow>
              )}
            </TableHeader>
            <TableBody>
              {filteredStudents.map((s) => (
                <TableRow key={s.id} className="hover:bg-slate-50/50 print:bg-white h-10">
                  <TableCell className="font-black text-primary text-center print:text-black print:border-black">{s.rollNumber}</TableCell>
                  <TableCell className="font-bold text-slate-700 whitespace-nowrap print:text-black print:border-black">{s.name}</TableCell>
                  {activeSubjects.map((subject) => (
                    <React.Fragment key={`${s.id}-${subject}`}>
                      {isAnnual ? (
                        <>
                          <TableCell className="border-l p-0 text-center text-xs font-bold text-slate-400 bg-blue-50/10">0</TableCell>
                          <TableCell className="border-l p-0 text-center text-xs font-bold text-slate-400 bg-green-50/10">0</TableCell>
                        </>
                      ) : (
                        <TableCell className="border-l p-0 print:border-black">
                          <input 
                            type="number" 
                            className="w-full h-8 text-center font-bold bg-transparent border-none outline-none focus:bg-primary/5 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
                            defaultValue={0} 
                          />
                        </TableCell>
                      )}
                    </React.Fragment>
                  ))}
                  <TableCell className="text-center border-l print:border-black">
                    <span className="font-black text-primary print:text-black">0</span>
                  </TableCell>
                  <TableCell className="text-right border-l print:border-black no-print">
                    <div className="flex items-center justify-end gap-2 text-green-600 font-bold text-[10px] uppercase">
                      <CheckCircle className="w-3 h-3" />
                      Ready
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {(selectedStandard === "all" || activeSubjects.length === 0) && (
                <TableRow>
                  <TableCell colSpan={(activeSubjects.length * (isAnnual ? 2 : 1)) + 4} className="h-32 text-center text-muted-foreground">
                    {selectedStandard === "all" 
                      ? "Please select a specific academic standard / કૃપા કરીને ધોરણ પસંદ કરો." 
                      : "No subjects mapped for this standard. Go to Subject Mapping to configure."}
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

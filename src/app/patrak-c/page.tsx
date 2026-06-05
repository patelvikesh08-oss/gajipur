
"use client";

import React, { useState, useMemo } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { useStudentStore, Student } from "@/lib/student-store";
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
import { FileSpreadsheet, Calendar, Save, Trophy, Printer } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export default function PatrakCPage() {
  const { students, isLoaded: studentsLoaded } = useStudentStore();
  const { academicYear, semester, updateYear, updateSemester, isLoaded: sessionLoaded } = useSessionStore();
  const { mappings, isLoaded: subjectsLoaded } = useSubjectStore();
  
  const [search, setSearch] = useState("");
  const [selectedStandard, setSelectedStandard] = useState("all");

  const isAnnual = semester === "Annual";
  const commonRowSpan = 3;

  const standards = useMemo(() => {
    return Array.from(new Set(students.map(s => s.academicStandard))).sort();
  }, [students]);

  const activeSubjects = useMemo(() => {
    if (selectedStandard === "all") return [];
    const mapping = mappings.find(m => m.standard === selectedStandard && m.semester === semester);
    return mapping ? mapping.subjects : [];
  }, [selectedStandard, semester, mappings]);

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || 
                            (s.rollNumber || "").includes(search.toLowerCase());
      const matchesStandard = selectedStandard === "all" || s.academicStandard === selectedStandard;
      return matchesSearch && matchesStandard;
    }).sort((a, b) => (a.rollNumber || "").localeCompare(b.rollNumber || "", undefined, { numeric: true }));
  }, [students, search, selectedStandard]);

  const handleSaveAll = () => {
    toast({
      title: "Cumulative Results Saved",
      description: `Final results for ${selectedStandard} updated.`,
    });
  };

  if (!studentsLoaded || !sessionLoaded || !subjectsLoaded) return null;

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div className="bg-gradient-to-r from-indigo-900 via-purple-800 to-indigo-900 p-8 rounded-3xl text-white shadow-2xl no-print">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                <FileSpreadsheet className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">PATRAK-C (Final Results) / પત્રક-સી</h1>
                <p className="text-indigo-100 text-sm font-medium mt-1">Cumulative marks grid with dynamic semester sub-columns</p>
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
              <Button onClick={handleSaveAll} className="bg-white text-orange-900 hover:bg-orange-50 font-black shadow-lg h-10 px-8 rounded-xl">
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
          <ScrollArea className="w-full">
            <div className="flex">
              <div className="flex-shrink-0">
                <Table className="border-collapse border-r-0">
                  <TableHeader className="bg-slate-50/50">
                    <TableRow className="h-12">
                      <TableHead rowSpan={commonRowSpan} className="font-black uppercase tracking-wider text-[10px] border-r sticky left-0 bg-slate-50 z-20 min-w-[60px] text-center">Roll No</TableHead>
                      <TableHead rowSpan={commonRowSpan} className="font-black uppercase tracking-wider text-[10px] border-r sticky left-[60px] bg-slate-50 z-20 min-w-[160px]">Name / નામ</TableHead>
                      <TableHead rowSpan={commonRowSpan} className="font-black uppercase tracking-wider text-[10px] border-r min-w-[80px] text-center">G.R. No.</TableHead>
                      <TableHead rowSpan={commonRowSpan} className="font-black uppercase tracking-wider text-[10px] border-r min-w-[100px] text-center">Birthdate</TableHead>
                    </TableRow>
                    <TableRow className="h-12" />
                    <TableRow className="h-12" />
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((s) => (
                      <TableRow key={s.id} className="hover:bg-indigo-50/20 h-10">
                        <TableCell className="font-black text-indigo-700 border-r sticky left-0 bg-white z-10 text-center text-[10px]">{s.rollNumber}</TableCell>
                        <TableCell className="font-bold text-slate-700 whitespace-nowrap border-r sticky left-[60px] bg-white z-10 text-[10px]">{s.name}</TableCell>
                        <TableCell className="text-slate-500 font-bold border-r text-center text-[9px]">{s.grNumber}</TableCell>
                        <TableCell className="text-slate-600 border-r text-center text-[9px]">{s.birthday}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex-1 min-w-0">
                <Table className="border-collapse">
                  <TableHeader className="bg-slate-50/50">
                    <TableRow className="h-12">
                      {activeSubjects.map((subject) => (
                        <TableHead key={subject} colSpan={isAnnual ? 8 : 5} className="font-black uppercase tracking-wider text-[10px] text-center border-r border-b bg-slate-100/50 py-4">
                          {subject}
                        </TableHead>
                      ))}
                      <TableHead rowSpan={commonRowSpan} className="text-center font-black uppercase tracking-wider text-[10px] min-w-[80px] border-l bg-indigo-50/50">Total Marks</TableHead>
                      <TableHead rowSpan={commonRowSpan} className="text-center font-black uppercase tracking-wider text-[10px] min-w-[80px] border-l bg-orange-50/50">Avg %</TableHead>
                      <TableHead rowSpan={commonRowSpan} className="text-right font-black uppercase tracking-wider text-[10px] sticky right-0 bg-slate-50 z-20 min-w-[100px] px-4">Outcome</TableHead>
                    </TableRow>

                    <TableRow className="h-12">
                      {activeSubjects.map((subject) => (
                        <React.Fragment key={`${subject}-row2`}>
                          {isAnnual ? (
                            <>
                              <TableHead colSpan={3} className="text-[8px] font-black text-center border-r border-b bg-blue-50/50">Semester 1</TableHead>
                              <TableHead colSpan={3} className="text-[8px] font-black text-center border-r border-b bg-green-50/50">Semester 2</TableHead>
                              <TableHead rowSpan={2} className="text-[8px] font-black text-center border-r border-b bg-orange-50">Total</TableHead>
                              <TableHead rowSpan={2} className="text-[8px] font-black text-center border-r border-b">Grade</TableHead>
                            </>
                          ) : (
                            <>
                              <TableHead className="text-[8px] font-black text-center px-1 border-r min-w-[50px]">Sva.</TableHead>
                              <TableHead className="text-[8px] font-black text-center px-1 border-r min-w-[50px]">Tri.</TableHead>
                              <TableHead className="text-[8px] font-black text-center px-1 border-r min-w-[50px]">{semester === "Semester 1" ? "PAT" : "SAT"}</TableHead>
                              <TableHead className="text-[8px] font-black text-center px-1 border-r min-w-[60px] bg-orange-50/50">Total</TableHead>
                              <TableHead className="text-[8px] font-black text-center px-1 border-r min-w-[50px]">Grd.</TableHead>
                            </>
                          )}
                        </React.Fragment>
                      ))}
                    </TableRow>

                    <TableRow className="h-12">
                      {activeSubjects.map((subject) => (
                        <React.Fragment key={`${subject}-row3`}>
                          {isAnnual ? (
                            <>
                              <TableHead className="text-[7px] font-black text-center px-1 border-r min-w-[40px]">Tri.</TableHead>
                              <TableHead className="text-[7px] font-black text-center px-1 border-r min-w-[40px]">Sva.</TableHead>
                              <TableHead className="text-[7px] font-black text-center px-1 border-r min-w-[40px]">PAT</TableHead>
                              <TableHead className="text-[7px] font-black text-center px-1 border-r min-w-[40px]">Tri.</TableHead>
                              <TableHead className="text-[7px] font-black text-center px-1 border-r min-w-[40px]">Sva.</TableHead>
                              <TableHead className="text-[7px] font-black text-center px-1 border-r min-w-[40px]">SAT</TableHead>
                            </>
                          ) : (
                            <TableHead colSpan={5} className="h-0 p-0 border-none" />
                          )}
                        </React.Fragment>
                      ))}
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {filteredStudents.map((s) => (
                      <TableRow key={s.id} className="hover:bg-indigo-50/20 h-10">
                        {activeSubjects.map((subject) => (
                          <React.Fragment key={`${s.id}-${subject}`}>
                            {isAnnual ? (
                              <>
                                <TableCell className="p-0 border-r bg-blue-50/5"><input type="number" className="h-10 w-full text-[9px] text-center px-1 font-black text-indigo-900 bg-transparent border-none outline-none" defaultValue={0} /></TableCell>
                                <TableCell className="p-0 border-r bg-blue-50/5"><input type="number" className="h-10 w-full text-[9px] text-center px-1 font-black text-indigo-900 bg-transparent border-none outline-none" defaultValue={0} /></TableCell>
                                <TableCell className="p-0 border-r bg-blue-50/5"><input type="number" className="h-10 w-full text-[9px] text-center px-1 font-black text-indigo-900 bg-transparent border-none outline-none" defaultValue={0} /></TableCell>
                                <TableCell className="p-0 border-r bg-green-50/5"><input type="number" className="h-10 w-full text-[9px] text-center px-1 font-black text-indigo-900 bg-transparent border-none outline-none" defaultValue={0} /></TableCell>
                                <TableCell className="p-0 border-r bg-green-50/5"><input type="number" className="h-10 w-full text-[9px] text-center px-1 font-black text-indigo-900 bg-transparent border-none outline-none" defaultValue={0} /></TableCell>
                                <TableCell className="p-0 border-r bg-green-50/5"><input type="number" className="h-10 w-full text-[9px] text-center px-1 font-black text-indigo-900 bg-transparent border-none outline-none" defaultValue={0} /></TableCell>
                                <TableCell className="p-0 border-r text-center font-black text-orange-700 text-[10px] bg-orange-50/20">0</TableCell>
                                <TableCell className="p-0 border-r text-center font-black text-indigo-700 text-[10px]">-</TableCell>
                              </>
                            ) : (
                              <>
                                <TableCell className="p-0 border-r"><input type="number" className="h-10 w-full text-[10px] text-center px-1 font-black text-indigo-900 bg-transparent border-none outline-none" defaultValue={0} /></TableCell>
                                <TableCell className="p-0 border-r"><input type="number" className="h-10 w-full text-[10px] text-center px-1 font-black text-indigo-900 bg-transparent border-none outline-none" defaultValue={0} /></TableCell>
                                <TableCell className="p-0 border-r"><input type="number" className="h-10 w-full text-[10px] text-center px-1 font-black text-indigo-900 bg-transparent border-none outline-none" defaultValue={0} /></TableCell>
                                <TableCell className="p-0 border-r bg-orange-50/20 text-center font-black text-orange-700 text-[10px]">0</TableCell>
                                <TableCell className="p-0 border-r text-center font-black text-indigo-700 text-[10px]">-</TableCell>
                              </>
                            )}
                          </React.Fragment>
                        ))}

                        <TableCell className="text-center font-black text-indigo-700 border-l text-[10px]">0</TableCell>
                        <TableCell className="text-center font-black text-orange-600 border-l text-[10px]">0%</TableCell>
                        <TableCell className="text-right sticky right-0 bg-white z-10 border-l px-4">
                          <Badge className="bg-emerald-600 font-black px-3 py-1 flex gap-1 items-center justify-center text-[9px]">
                            <Trophy className="w-2.5 h-2.5" /> PASS
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </div>
    </MainLayout>
  );
}

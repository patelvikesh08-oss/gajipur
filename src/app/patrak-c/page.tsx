
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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <FileSpreadsheet className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">PATRAK-C (Final Results) / પત્રક-સી</h1>
              <p className="text-xs text-muted-foreground font-medium">Cumulative marks grid with dynamic semester sub-columns</p>
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
            <Button onClick={handleSaveAll} className="font-bold bg-orange-600 hover:bg-orange-700 shadow-lg shadow-orange-600/20">
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

        <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
          <ScrollArea className="w-full">
            <div className="flex">
              <div className="flex-shrink-0">
                <Table className="border-collapse border-r-0">
                  <TableHeader className="bg-slate-50">
                    <TableRow className="h-12">
                      <TableHead rowSpan={commonRowSpan} className="font-bold uppercase tracking-wider text-xs border-r sticky left-0 bg-slate-50 z-20 min-w-[60px] text-center">Roll No</TableHead>
                      <TableHead rowSpan={commonRowSpan} className="font-bold uppercase tracking-wider text-xs border-r sticky left-[60px] bg-slate-50 z-20 min-w-[160px]">Name / નામ</TableHead>
                      <TableHead rowSpan={commonRowSpan} className="font-bold uppercase tracking-wider text-xs border-r min-w-[80px] text-center">G.R. No.</TableHead>
                      <TableHead rowSpan={commonRowSpan} className="font-bold uppercase tracking-wider text-xs border-r min-w-[100px] text-center">Birthdate</TableHead>
                    </TableRow>
                    <TableRow className="h-12" />
                    <TableRow className="h-12" />
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((s) => (
                      <TableRow key={s.id} className="hover:bg-slate-50/50 h-10">
                        <TableCell className="font-black text-primary border-r sticky left-0 bg-white z-10 text-center">{s.rollNumber}</TableCell>
                        <TableCell className="font-black text-slate-700 whitespace-nowrap border-r sticky left-[60px] bg-white z-10">{s.name}</TableCell>
                        <TableCell className="text-slate-500 font-medium border-r text-center">{s.grNumber}</TableCell>
                        <TableCell className="text-slate-600 border-r text-center text-xs">{s.birthday}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex-1 min-w-0">
                <Table className="border-collapse">
                  <TableHeader className="bg-slate-50">
                    <TableRow className="h-12">
                      {activeSubjects.map((subject) => (
                        <TableHead key={subject} colSpan={isAnnual ? 8 : 5} className="font-bold uppercase tracking-wider text-xs text-center border-r border-b bg-slate-100/50">
                          {subject}
                        </TableHead>
                      ))}
                      <TableHead rowSpan={commonRowSpan} className="text-center font-bold uppercase tracking-wider text-xs min-w-[80px] border-l">Total Marks</TableHead>
                      <TableHead rowSpan={commonRowSpan} className="text-center font-bold uppercase tracking-wider text-xs min-w-[80px] border-l">Avg %</TableHead>
                      <TableHead rowSpan={commonRowSpan} className="text-right font-bold uppercase tracking-wider text-xs sticky right-0 bg-slate-50 z-20 min-w-[100px]">Outcome</TableHead>
                    </TableRow>

                    <TableRow className="h-12">
                      {activeSubjects.map((subject) => (
                        <React.Fragment key={`${subject}-row2`}>
                          {isAnnual ? (
                            <>
                              <TableHead colSpan={3} className="text-[10px] font-black text-center border-r border-b bg-blue-50/50">Semester 1</TableHead>
                              <TableHead colSpan={3} className="text-[10px] font-black text-center border-r border-b bg-green-50/50">Semester 2</TableHead>
                              <TableHead rowSpan={2} className="text-[10px] font-black text-center border-r border-b bg-orange-50">Total</TableHead>
                              <TableHead rowSpan={2} className="text-[10px] font-black text-center border-r border-b">Grade</TableHead>
                            </>
                          ) : (
                            <>
                              <TableHead className="text-[10px] font-bold text-center px-1 border-r min-w-[50px]">Sva.</TableHead>
                              <TableHead className="text-[10px] font-bold text-center px-1 border-r min-w-[50px]">Tri.</TableHead>
                              <TableHead className="text-[10px] font-bold text-center px-1 border-r min-w-[50px]">{semester === "Semester 1" ? "PAT" : "SAT"}</TableHead>
                              <TableHead className="text-[10px] font-black text-center px-1 border-r min-w-[60px] bg-orange-50/50">Total</TableHead>
                              <TableHead className="text-[10px] font-bold text-center px-1 border-r min-w-[50px]">Grd.</TableHead>
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
                              <TableHead className="text-[9px] font-bold text-center px-1 border-r min-w-[40px]">Tri.</TableHead>
                              <TableHead className="text-[9px] font-bold text-center px-1 border-r min-w-[40px]">Sva.</TableHead>
                              <TableHead className="text-[9px] font-bold text-center px-1 border-r min-w-[40px]">PAT</TableHead>
                              <TableHead className="text-[9px] font-bold text-center px-1 border-r min-w-[40px]">Tri.</TableHead>
                              <TableHead className="text-[9px] font-bold text-center px-1 border-r min-w-[40px]">Sva.</TableHead>
                              <TableHead className="text-[9px] font-bold text-center px-1 border-r min-w-[40px]">SAT</TableHead>
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
                      <TableRow key={s.id} className="hover:bg-slate-50/50 h-10">
                        {activeSubjects.map((subject) => (
                          <React.Fragment key={`${s.id}-${subject}`}>
                            {isAnnual ? (
                              <>
                                <TableCell className="p-0 border-r bg-blue-50/10"><input type="number" className="h-7 w-full text-[10px] text-center px-1 font-medium bg-transparent border-none outline-none" defaultValue={0} /></TableCell>
                                <TableCell className="p-0 border-r bg-blue-50/10"><input type="number" className="h-7 w-full text-[10px] text-center px-1 font-medium bg-transparent border-none outline-none" defaultValue={0} /></TableCell>
                                <TableCell className="p-0 border-r bg-blue-50/10"><input type="number" className="h-7 w-full text-[10px] text-center px-1 font-medium bg-transparent border-none outline-none" defaultValue={0} /></TableCell>
                                <TableCell className="p-0 border-r bg-green-50/10"><input type="number" className="h-7 w-full text-[10px] text-center px-1 font-medium bg-transparent border-none outline-none" defaultValue={0} /></TableCell>
                                <TableCell className="p-0 border-r bg-green-50/10"><input type="number" className="h-7 w-full text-[10px] text-center px-1 font-medium bg-transparent border-none outline-none" defaultValue={0} /></TableCell>
                                <TableCell className="p-0 border-r bg-green-50/10"><input type="number" className="h-7 w-full text-[10px] text-center px-1 font-medium bg-transparent border-none outline-none" defaultValue={0} /></TableCell>
                                <TableCell className="p-0 border-r text-center font-bold text-orange-700 text-xs bg-orange-50/20">0</TableCell>
                                <TableCell className="p-0 border-r text-center font-black text-primary text-[10px]">-</TableCell>
                              </>
                            ) : (
                              <>
                                <TableCell className="p-0 border-r"><input type="number" className="h-7 w-full text-xs text-center px-1 font-medium bg-transparent border-none outline-none" defaultValue={0} /></TableCell>
                                <TableCell className="p-0 border-r"><input type="number" className="h-7 w-full text-xs text-center px-1 font-medium bg-transparent border-none outline-none" defaultValue={0} /></TableCell>
                                <TableCell className="p-0 border-r"><input type="number" className="h-7 w-full text-xs text-center px-1 font-medium bg-transparent border-none outline-none" defaultValue={0} /></TableCell>
                                <TableCell className="p-0 border-r bg-orange-50/20 text-center font-bold text-orange-700 text-xs">0</TableCell>
                                <TableCell className="p-0 border-r text-center font-black text-primary text-[10px]">-</TableCell>
                              </>
                            )}
                          </React.Fragment>
                        ))}

                        <TableCell className="text-center font-black text-indigo-700 border-l">0</TableCell>
                        <TableCell className="text-center font-black text-orange-600 border-l">0%</TableCell>
                        <TableCell className="text-right sticky right-0 bg-white z-10 border-l">
                          <Badge className="bg-green-600 font-bold px-3 py-1 flex gap-1 items-center justify-center">
                            <Trophy className="w-3 h-3" /> PASS
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

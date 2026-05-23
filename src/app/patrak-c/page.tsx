
"use client";

import React, { useState, useMemo } from "react";
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

  const standards = useMemo(() => {
    return Array.from(new Set(students.map(s => s.academicStandard))).sort();
  }, [students]);

  const activeSubjects = useMemo(() => {
    if (selectedStandard === "all") return [];
    const mapping = mappings.find(m => m.standard === selectedStandard && m.semester === semester);
    return mapping ? mapping.subjects : [];
  }, [selectedStandard, semester, mappings]);

  if (!studentsLoaded || !sessionLoaded || !subjectsLoaded) return null;

  const filteredStudents = students.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || 
                          (s.rollNumber || "").includes(search.toLowerCase());
    const matchesStandard = selectedStandard === "all" || s.academicStandard === selectedStandard;
    return matchesSearch && matchesStandard;
  }).sort((a, b) => (a.rollNumber || "").localeCompare(b.rollNumber || "", undefined, { numeric: true }));

  const handleSaveAll = () => {
    toast({
      title: "Cumulative Results Saved",
      description: `Final results for ${selectedStandard} updated.`,
    });
  };

  // Fixed row span for all headers to maintain height consistency
  const commonRowSpan = 3;

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <FileSpreadsheet className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">PATRAK-C (Final Results)</h1>
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
                <SelectItem value="Semester 1">Semester 1</SelectItem>
                <SelectItem value="Semester 2">Semester 2</SelectItem>
                <SelectItem value="Annual">Annual</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => window.print()} className="font-bold border-slate-200">
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
            <Button onClick={handleSaveAll} className="font-bold bg-orange-600 hover:bg-orange-700 shadow-lg shadow-orange-600/20">
              <Save className="w-4 h-4 mr-2" />
              Save Results
            </Button>
          </div>
        </div>

        {/* PRINT HEADER */}
        <div className="hidden print:block text-center space-y-2 border-b-2 border-slate-900 pb-4 mb-6">
          <h1 className="text-2xl font-black uppercase">EduPulse Global Academy</h1>
          <h2 className="text-lg font-bold uppercase">PATRAK-C (Final Results)</h2>
          <div className="flex justify-center gap-8 font-bold text-xs">
            <span>Academic Year: {academicYear}</span>
            <span>Semester: {semester}</span>
            <span>Standard: {selectedStandard === 'all' ? 'All' : selectedStandard}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 no-print">
          <Input
            placeholder="Search by student name or roll number..."
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

        <div className="rounded-xl border bg-white shadow-sm overflow-hidden print:overflow-visible print:border-none print:shadow-none">
          <ScrollArea className="w-full">
            <div className="flex print:block">
              {/* Biographical Section */}
              <div className="flex-shrink-0">
                <Table className="border-collapse border-r-0">
                  <TableHeader className="bg-slate-50 print:bg-white">
                    <TableRow className="h-12">
                      <TableHead rowSpan={commonRowSpan} className="font-bold uppercase tracking-wider text-xs border-r sticky left-0 bg-slate-50 z-20 min-w-[60px] print:static print:border-black text-center">
                        Roll No
                      </TableHead>
                      <TableHead rowSpan={commonRowSpan} className="font-bold uppercase tracking-wider text-xs border-r sticky left-[60px] bg-slate-50 z-20 min-w-[160px] print:static print:border-black">
                        Student Name
                      </TableHead>
                      <TableHead rowSpan={commonRowSpan} className="font-bold uppercase tracking-wider text-xs border-r min-w-[80px] print:border-black text-center">
                        G.R. No.
                      </TableHead>
                      <TableHead rowSpan={commonRowSpan} className="font-bold uppercase tracking-wider text-xs border-r min-w-[100px] print:border-black text-center">
                        Birthdate
                      </TableHead>
                      <TableHead rowSpan={commonRowSpan} className="font-bold uppercase tracking-wider text-xs border-r min-w-[60px] text-center print:border-black">
                        Atten.
                      </TableHead>
                      <TableHead rowSpan={commonRowSpan} className="font-bold uppercase tracking-wider text-xs border-r min-w-[100px] print:border-black text-center">
                        Caste
                      </TableHead>
                    </TableRow>
                    {/* Placeholder rows to maintain biographical header height relative to performance rows */}
                    <TableRow className="h-12" />
                    <TableRow className="h-12" />
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((s) => (
                      <TableRow key={s.id} className="hover:bg-slate-50/50 print:bg-white h-10">
                        <TableCell className="font-black text-primary border-r sticky left-0 bg-white z-10 print:text-black print:border-black text-center">
                          {s.rollNumber}
                        </TableCell>
                        <TableCell className="font-black text-slate-700 whitespace-nowrap border-r sticky left-[60px] bg-white z-10 print:text-black print:border-black">
                          {s.name}
                        </TableCell>
                        <TableCell className="text-slate-500 font-medium border-r print:text-black print:border-black text-center">{s.grNumber}</TableCell>
                        <TableCell className="text-slate-600 border-r print:text-black print:border-black text-center text-xs">{s.birthday}</TableCell>
                        <TableCell className="text-center font-bold text-primary border-r print:text-black print:border-black">{s.attendance}%</TableCell>
                        <TableCell className="text-slate-600 border-r print:text-black print:border-black text-center">{s.caste}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Page Breaker for Portrait Mode */}
              <div className="portrait-break" />

              {/* Performance Section */}
              <div className="flex-1 min-w-0">
                <Table className="border-collapse">
                  <TableHeader className="bg-slate-50 print:bg-white">
                    <TableRow className="h-12">
                      {activeSubjects.map((subject) => (
                        <TableHead key={subject} colSpan={isAnnual ? 8 : 5} className="font-bold uppercase tracking-wider text-xs text-center border-r border-b bg-slate-100/50 print:border-black print:bg-white">
                          {subject}
                        </TableHead>
                      ))}
                      <TableHead colSpan={1} className="font-bold uppercase tracking-wider text-xs text-center border-r border-b bg-indigo-50/50 print:border-black print:bg-white">
                        PATRAK-B
                      </TableHead>
                      <TableHead rowSpan={commonRowSpan} className="text-center font-bold uppercase tracking-wider text-xs min-w-[80px] border-l print:border-black">Total Marks</TableHead>
                      <TableHead rowSpan={commonRowSpan} className="text-center font-bold uppercase tracking-wider text-xs min-w-[80px] border-l print:border-black">Avg %</TableHead>
                      <TableHead rowSpan={commonRowSpan} className="text-right font-bold uppercase tracking-wider text-xs sticky right-0 bg-slate-50 z-20 min-w-[100px] print:static print:border-black">Outcome</TableHead>
                    </TableRow>

                    <TableRow className="h-12">
                      {activeSubjects.map((subject) => (
                        <React.Fragment key={`${subject}-sem-row`}>
                          {isAnnual ? (
                            <>
                              <TableHead colSpan={3} className="text-[10px] font-black text-center border-r border-b bg-blue-50/50 print:border-black print:bg-white">Semester 1</TableHead>
                              <TableHead colSpan={3} className="text-[10px] font-black text-center border-r border-b bg-green-50/50 print:border-black print:bg-white">Semester 2</TableHead>
                              <TableHead rowSpan={2} className="text-[10px] font-black text-center border-r border-b bg-orange-50 print:border-black print:bg-white">Total</TableHead>
                              <TableHead rowSpan={2} className="text-[10px] font-black text-center border-r border-b print:border-black">Grade</TableHead>
                            </>
                          ) : (
                            <>
                              <TableHead className="text-[10px] font-bold text-center px-1 border-r min-w-[50px] print:border-black">Sva.</TableHead>
                              <TableHead className="text-[10px] font-bold text-center px-1 border-r min-w-[50px] print:border-black">Tri.</TableHead>
                              <TableHead className="text-[10px] font-bold text-center px-1 border-r min-w-[50px] print:border-black">
                                {semester === "Semester 1" ? "PAT" : semester === "Semester 2" ? "SAT" : "PAT/SAT"}
                              </TableHead>
                              <TableHead className="text-[10px] font-black text-center px-1 border-r min-w-[60px] bg-orange-50/50 print:border-black print:bg-white">Total</TableHead>
                              <TableHead className="text-[10px] font-bold text-center px-1 border-r min-w-[50px] print:border-black">Grd.</TableHead>
                            </>
                          )}
                        </React.Fragment>
                      ))}
                      <TableHead rowSpan={isAnnual ? 2 : 1} className="text-[10px] font-black text-center border-r bg-indigo-50/50 print:border-black print:bg-white">
                        {isAnnual ? "Avg" : "Total"}
                      </TableHead>
                    </TableRow>

                    <TableRow className="h-12">
                      {activeSubjects.map((subject) => (
                        <React.Fragment key={`${subject}-annual-data-row`}>
                          {isAnnual ? (
                            <>
                              <TableHead className="text-[9px] font-bold text-center px-1 border-r min-w-[40px] print:border-black">Tri.</TableHead>
                              <TableHead className="text-[9px] font-bold text-center px-1 border-r min-w-[40px] print:border-black">Sva.</TableHead>
                              <TableHead className="text-[9px] font-bold text-center px-1 border-r min-w-[40px] print:border-black">PAT</TableHead>
                              <TableHead className="text-[9px] font-bold text-center px-1 border-r min-w-[40px] print:border-black">Tri.</TableHead>
                              <TableHead className="text-[9px] font-bold text-center px-1 border-r min-w-[40px] print:border-black">Sva.</TableHead>
                              <TableHead className="text-[9px] font-bold text-center px-1 border-r min-w-[40px] print:border-black">SAT</TableHead>
                            </>
                          ) : (
                            <React.Fragment key={`${subject}-empty-bottom`} />
                          )}
                        </React.Fragment>
                      ))}
                      {!isAnnual && <TableHead className="h-0 p-0 border-none" />}
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {filteredStudents.map((s) => (
                      <TableRow key={s.id} className="hover:bg-slate-50/50 print:bg-white h-10">
                        {activeSubjects.map((subject) => (
                          <React.Fragment key={`${s.id}-${subject}`}>
                            {isAnnual ? (
                              <>
                                <TableCell className="p-1 border-r bg-blue-50/10 print:border-black">
                                  <input type="number" className="h-7 w-full text-[10px] text-center px-1 font-medium bg-transparent border-none outline-none" defaultValue={15} />
                                </TableCell>
                                <TableCell className="p-1 border-r bg-blue-50/10 print:border-black">
                                  <input type="number" className="h-7 w-full text-[10px] text-center px-1 font-medium bg-transparent border-none outline-none" defaultValue={10} />
                                </TableCell>
                                <TableCell className="p-1 border-r bg-blue-50/10 print:border-black">
                                  <input type="number" className="h-7 w-full text-[10px] text-center px-1 font-medium bg-transparent border-none outline-none" defaultValue={25} />
                                </TableCell>
                                <TableCell className="p-1 border-r bg-green-50/10 print:border-black">
                                  <input type="number" className="h-7 w-full text-[10px] text-center px-1 font-medium bg-transparent border-none outline-none" defaultValue={18} />
                                </TableCell>
                                <TableCell className="p-1 border-r bg-green-50/10 print:border-black">
                                  <input type="number" className="h-7 w-full text-[10px] text-center px-1 font-medium bg-transparent border-none outline-none" defaultValue={12} />
                                </TableCell>
                                <TableCell className="p-1 border-r bg-green-50/10 print:border-black">
                                  <input type="number" className="h-7 w-full text-[10px] text-center px-1 font-medium bg-transparent border-none outline-none" defaultValue={22} />
                                </TableCell>
                                <TableCell className="p-1 border-r text-center font-bold text-orange-700 text-xs bg-orange-50/20 print:text-black print:border-black">
                                  102
                                </TableCell>
                                <TableCell className="p-1 border-r text-center font-black text-primary text-[10px] print:text-black print:border-black">
                                  A+
                                </TableCell>
                              </>
                            ) : (
                              <>
                                <TableCell className="p-1 border-r print:border-black">
                                  <input type="number" className="h-7 w-full text-xs text-center px-1 font-medium bg-transparent border-none outline-none" defaultValue={8} />
                                </TableCell>
                                <TableCell className="p-1 border-r print:border-black">
                                  <input type="number" className="h-7 w-full text-xs text-center px-1 font-medium bg-transparent border-none outline-none" defaultValue={72} />
                                </TableCell>
                                <TableCell className="p-1 border-r print:border-black">
                                  <input type="number" className="h-7 w-full text-xs text-center px-1 font-medium bg-transparent border-none outline-none" defaultValue={22} />
                                </TableCell>
                                <TableCell className="p-1 border-r bg-orange-50/20 text-center font-bold text-orange-700 text-xs print:text-black print:border-black">
                                  102
                                </TableCell>
                                <TableCell className="p-1 border-r text-center font-black text-primary text-[10px] print:text-black print:border-black">
                                  A+
                                </TableCell>
                              </>
                            )}
                          </React.Fragment>
                        ))}

                        <TableCell className={`p-1 border-r text-center font-bold text-xs print:border-black ${isAnnual ? 'bg-indigo-100/30 font-black text-indigo-700 print:text-black' : 'bg-indigo-50/20'}`}>
                          {isAnnual ? "86.5" : <input type="number" className="h-7 w-full text-xs text-center font-bold bg-transparent border-none outline-none" defaultValue={85} />}
                        </TableCell>

                        <TableCell className="text-center font-black text-indigo-700 border-l print:text-black print:border-black">425</TableCell>
                        <TableCell className="text-center font-black text-orange-600 border-l print:text-black print:border-black">84.5%</TableCell>
                        <TableCell className="text-right sticky right-0 bg-white z-10 border-l print:static print:border-black no-print">
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
            <ScrollBar orientation="horizontal" className="no-print" />
          </ScrollArea>
        </div>

        <div className="flex justify-end gap-3 pt-6 mb-12 no-print">
          <Button variant="outline" size="lg" onClick={() => window.print()} className="font-bold gap-2">
            <Printer className="w-4 h-4" />
            Print Results
          </Button>
          <Button onClick={handleSaveAll} size="lg" className="font-bold bg-orange-600 hover:bg-orange-700 shadow-lg shadow-orange-600/20 px-8">
            <Save className="w-4 h-4 mr-2" />
            Commit Changes
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}

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

  // Chunking logic for print
  const subjectChunks = useMemo(() => {
    const size = isAnnual ? 2 : 3;
    const chunks = [];
    for (let i = 0; i < activeSubjects.length; i += size) {
      chunks.push(activeSubjects.slice(i, i + size));
    }
    return chunks;
  }, [activeSubjects, isAnnual]);

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

        {/* BROWSER VIEW */}
        <div className="rounded-xl border bg-white shadow-sm overflow-hidden no-print">
          <ScrollArea className="w-full">
            <div className="flex">
              {/* Biographical Section */}
              <div className="flex-shrink-0">
                <Table className="border-collapse border-r-0">
                  <TableHeader className="bg-slate-50">
                    <TableRow className="h-12">
                      <TableHead rowSpan={commonRowSpan} className="font-bold uppercase tracking-wider text-xs border-r sticky left-0 bg-slate-50 z-20 min-w-[60px] text-center">Roll No</TableHead>
                      <TableHead rowSpan={commonRowSpan} className="font-bold uppercase tracking-wider text-xs border-r sticky left-[60px] bg-slate-50 z-20 min-w-[160px]">Student Name</TableHead>
                      <TableHead rowSpan={commonRowSpan} className="font-bold uppercase tracking-wider text-xs border-r min-w-[80px] text-center">G.R. No.</TableHead>
                      <TableHead rowSpan={commonRowSpan} className="font-bold uppercase tracking-wider text-xs border-r min-w-[100px] text-center">Birthdate</TableHead>
                      <TableHead rowSpan={commonRowSpan} className="font-bold uppercase tracking-wider text-xs border-r min-w-[60px] text-center">Atten.</TableHead>
                      <TableHead rowSpan={commonRowSpan} className="font-bold uppercase tracking-wider text-xs border-r min-w-[100px] text-center">Caste</TableHead>
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
                        <TableCell className="text-center font-bold text-primary border-r">{s.attendance}%</TableCell>
                        <TableCell className="text-slate-600 border-r text-center">{s.caste}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Performance Section */}
              <div className="flex-1 min-w-0">
                <Table className="border-collapse">
                  <TableHeader className="bg-slate-50">
                    <TableRow className="h-12">
                      {activeSubjects.map((subject) => (
                        <TableHead key={subject} colSpan={isAnnual ? 8 : 5} className="font-bold uppercase tracking-wider text-xs text-center border-r border-b bg-slate-100/50">
                          {subject}
                        </TableHead>
                      ))}
                      <TableHead colSpan={1} className="font-bold uppercase tracking-wider text-xs text-center border-r border-b bg-indigo-50/50">PATRAK-B</TableHead>
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
                      <TableHead rowSpan={isAnnual ? 2 : 1} className="text-[10px] font-black text-center border-r bg-indigo-50/50">
                        {isAnnual ? "Avg" : "Total"}
                      </TableHead>
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
                      {!isAnnual && <TableHead className="h-0 p-0 border-none" />}
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {filteredStudents.map((s) => (
                      <TableRow key={s.id} className="hover:bg-slate-50/50 h-10">
                        {activeSubjects.map((subject) => (
                          <React.Fragment key={`${s.id}-${subject}`}>
                            {isAnnual ? (
                              <>
                                <TableCell className="p-1 border-r bg-blue-50/10"><input type="number" className="h-7 w-full text-[10px] text-center px-1 font-medium bg-transparent border-none outline-none" defaultValue={15} /></TableCell>
                                <TableCell className="p-1 border-r bg-blue-50/10"><input type="number" className="h-7 w-full text-[10px] text-center px-1 font-medium bg-transparent border-none outline-none" defaultValue={10} /></TableCell>
                                <TableCell className="p-1 border-r bg-blue-50/10"><input type="number" className="h-7 w-full text-[10px] text-center px-1 font-medium bg-transparent border-none outline-none" defaultValue={25} /></TableCell>
                                <TableCell className="p-1 border-r bg-green-50/10"><input type="number" className="h-7 w-full text-[10px] text-center px-1 font-medium bg-transparent border-none outline-none" defaultValue={18} /></TableCell>
                                <TableCell className="p-1 border-r bg-green-50/10"><input type="number" className="h-7 w-full text-[10px] text-center px-1 font-medium bg-transparent border-none outline-none" defaultValue={12} /></TableCell>
                                <TableCell className="p-1 border-r bg-green-50/10"><input type="number" className="h-7 w-full text-[10px] text-center px-1 font-medium bg-transparent border-none outline-none" defaultValue={22} /></TableCell>
                                <TableCell className="p-1 border-r text-center font-bold text-orange-700 text-xs bg-orange-50/20">102</TableCell>
                                <TableCell className="p-1 border-r text-center font-black text-primary text-[10px]">A+</TableCell>
                              </>
                            ) : (
                              <>
                                <TableCell className="p-1 border-r"><input type="number" className="h-7 w-full text-xs text-center px-1 font-medium bg-transparent border-none outline-none" defaultValue={8} /></TableCell>
                                <TableCell className="p-1 border-r"><input type="number" className="h-7 w-full text-xs text-center px-1 font-medium bg-transparent border-none outline-none" defaultValue={72} /></TableCell>
                                <TableCell className="p-1 border-r"><input type="number" className="h-7 w-full text-xs text-center px-1 font-medium bg-transparent border-none outline-none" defaultValue={22} /></TableCell>
                                <TableCell className="p-1 border-r bg-orange-50/20 text-center font-bold text-orange-700 text-xs">102</TableCell>
                                <TableCell className="p-1 border-r text-center font-black text-primary text-[10px]">A+</TableCell>
                              </>
                            )}
                          </React.Fragment>
                        ))}

                        <TableCell className={`p-1 border-r text-center font-bold text-xs ${isAnnual ? 'bg-indigo-100/30 font-black text-indigo-700' : 'bg-indigo-50/20'}`}>
                          {isAnnual ? "86.5" : <input type="number" className="h-7 w-full text-xs text-center font-bold bg-transparent border-none outline-none" defaultValue={85} />}
                        </TableCell>

                        <TableCell className="text-center font-black text-indigo-700 border-l">425</TableCell>
                        <TableCell className="text-center font-black text-orange-600 border-l">84.5%</TableCell>
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

        {/* PRINT VIEW - Chunked Pages */}
        <div className="hidden print:block space-y-8">
          {/* Page 1: Student Details */}
          <div className="page-break-after-always">
            <h3 className="text-xs font-black uppercase mb-2 border-b-2 border-slate-900 inline-block">Section A: Biographical Data</h3>
            <Table className="border-collapse">
              <TableHeader className="print:bg-white">
                <TableRow className="h-12">
                  <TableHead rowSpan={commonRowSpan} className="font-bold uppercase tracking-wider text-[10px] border-r border-black text-center">Roll No</TableHead>
                  <TableHead rowSpan={commonRowSpan} className="font-bold uppercase tracking-wider text-[10px] border-r border-black">Student Name</TableHead>
                  <TableHead rowSpan={commonRowSpan} className="font-bold uppercase tracking-wider text-[10px] border-r border-black text-center">G.R. No.</TableHead>
                  <TableHead rowSpan={commonRowSpan} className="font-bold uppercase tracking-wider text-[10px] border-r border-black text-center">Birthdate</TableHead>
                  <TableHead rowSpan={commonRowSpan} className="font-bold uppercase tracking-wider text-[10px] border-r border-black text-center">Atten.</TableHead>
                  <TableHead rowSpan={commonRowSpan} className="font-bold uppercase tracking-wider text-[10px] border-r border-black text-center">Caste</TableHead>
                </TableRow>
                <TableRow className="h-12" />
                <TableRow className="h-12" />
              </TableHeader>
              <TableBody>
                {filteredStudents.map((s) => (
                  <TableRow key={s.id} className="h-10 print:bg-white border-black">
                    <TableCell className="font-black text-center border-black">{s.rollNumber}</TableCell>
                    <TableCell className="font-black border-black">{s.name}</TableCell>
                    <TableCell className="text-center border-black">{s.grNumber}</TableCell>
                    <TableCell className="text-center text-xs border-black">{s.birthday}</TableCell>
                    <TableCell className="text-center font-bold border-black">{s.attendance}%</TableCell>
                    <TableCell className="text-center border-black">{s.caste}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Performance Pages */}
          {subjectChunks.map((chunk, chunkIdx) => {
            const size = isAnnual ? 2 : 3;
            const isLastChunk = chunkIdx === subjectChunks.length - 1;
            const isLonely = chunk.length === 1;
            const includeSummary = (isAnnual && isLonely) || (!isAnnual && chunk.length < 3) || subjectChunks.length === 0;

            return (
              <div key={chunkIdx} className={isLastChunk && includeSummary ? "" : "page-break-after-always"}>
                <h3 className="text-xs font-black uppercase mb-2 border-b-2 border-slate-900 inline-block">
                  Section B: Performance Page {chunkIdx + 1}
                </h3>
                <Table className="border-collapse border-black">
                  <TableHeader className="print:bg-white">
                    <TableRow className="h-12 border-black">
                      <TableHead rowSpan={commonRowSpan} className="font-bold uppercase tracking-wider text-[10px] border-r border-black text-center min-w-[50px]">Roll No</TableHead>
                      {chunk.map(sub => (
                        <TableHead key={sub} colSpan={isAnnual ? 8 : 5} className="font-bold uppercase text-center border-r border-black">{sub}</TableHead>
                      ))}
                      {includeSummary && (
                        <>
                          <TableHead className="font-bold uppercase text-center border-r border-black">Patrak-B</TableHead>
                          <TableHead rowSpan={commonRowSpan} className="font-bold uppercase text-center border-r border-black">Total</TableHead>
                          <TableHead rowSpan={commonRowSpan} className="font-bold uppercase text-center border-r border-black">Avg %</TableHead>
                          <TableHead rowSpan={commonRowSpan} className="font-bold uppercase text-center border-black">Result</TableHead>
                        </>
                      )}
                    </TableRow>
                    <TableRow className="h-12 border-black">
                      {chunk.map(sub => (
                        <React.Fragment key={`${sub}-r2`}>
                          {isAnnual ? (
                            <>
                              <TableHead colSpan={3} className="text-[9px] font-black text-center border-r border-black">Sem 1</TableHead>
                              <TableHead colSpan={3} className="text-[9px] font-black text-center border-r border-black">Sem 2</TableHead>
                              <TableHead rowSpan={2} className="text-[9px] font-black text-center border-r border-black">Tot</TableHead>
                              <TableHead rowSpan={2} className="text-[9px] font-black text-center border-r border-black">Grd</TableHead>
                            </>
                          ) : (
                            <>
                              <TableHead className="text-[8px] font-bold text-center border-r border-black">Sva</TableHead>
                              <TableHead className="text-[8px] font-bold text-center border-r border-black">Tri</TableHead>
                              <TableHead className="text-[8px] font-bold text-center border-r border-black">Ass</TableHead>
                              <TableHead className="text-[8px] font-black text-center border-r border-black">Tot</TableHead>
                              <TableHead className="text-[8px] font-bold text-center border-r border-black">Grd</TableHead>
                            </>
                          )}
                        </React.Fragment>
                      ))}
                      {includeSummary && (
                         <TableHead rowSpan={isAnnual ? 2 : 1} className="text-[9px] font-black text-center border-r border-black">{isAnnual ? "Avg" : "Tot"}</TableHead>
                      )}
                    </TableRow>
                    <TableRow className="h-12 border-black">
                       {chunk.map(sub => (
                         <React.Fragment key={`${sub}-r3`}>
                            {isAnnual ? (
                              <>
                                <TableHead className="text-[7px] text-center border-r border-black">Tri</TableHead>
                                <TableHead className="text-[7px] text-center border-r border-black">Sva</TableHead>
                                <TableHead className="text-[7px] text-center border-r border-black">PAT</TableHead>
                                <TableHead className="text-[7px] text-center border-r border-black">Tri</TableHead>
                                <TableHead className="text-[7px] text-center border-r border-black">Sva</TableHead>
                                <TableHead className="text-[7px] text-center border-r border-black">SAT</TableHead>
                              </>
                            ) : null}
                         </React.Fragment>
                       ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map(s => (
                      <TableRow key={s.id} className="h-10 border-black">
                        <TableCell className="font-black text-center border-black">{s.rollNumber}</TableCell>
                        {chunk.map(sub => (
                           <React.Fragment key={`${s.id}-${sub}`}>
                             {isAnnual ? (
                                <>
                                  <TableCell className="text-center border-black">15</TableCell>
                                  <TableCell className="text-center border-black">10</TableCell>
                                  <TableCell className="text-center border-black">25</TableCell>
                                  <TableCell className="text-center border-black">18</TableCell>
                                  <TableCell className="text-center border-black">12</TableCell>
                                  <TableCell className="text-center border-black">22</TableCell>
                                  <TableCell className="text-center font-bold border-black">102</TableCell>
                                  <TableCell className="text-center font-black border-black">A+</TableCell>
                                </>
                             ) : (
                                <>
                                  <TableCell className="text-center border-black">8</TableCell>
                                  <TableCell className="text-center border-black">72</TableCell>
                                  <TableCell className="text-center border-black">22</TableCell>
                                  <TableCell className="text-center font-bold border-black">102</TableCell>
                                  <TableCell className="text-center font-black border-black">A+</TableCell>
                                </>
                             )}
                           </React.Fragment>
                        ))}
                        {includeSummary && (
                          <>
                            <TableCell className="text-center font-bold border-black">86</TableCell>
                            <TableCell className="text-center font-black border-black">425</TableCell>
                            <TableCell className="text-center font-black border-black">84.5%</TableCell>
                            <TableCell className="text-center font-black border-black">PASS</TableCell>
                          </>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            );
          })}

          {/* Standalone Summary Page if it didn't fit */}
          {(() => {
            const lastChunk = subjectChunks[subjectChunks.length - 1];
            const size = isAnnual ? 2 : 3;
            const summaryIncluded = lastChunk && lastChunk.length < size;
            
            if (!summaryIncluded && activeSubjects.length > 0) {
              return (
                <div className="page-break-after-always">
                  <h3 className="text-xs font-black uppercase mb-2 border-b-2 border-slate-900 inline-block">Section C: Final Outcome</h3>
                  <Table className="border-collapse border-black">
                    <TableHeader className="print:bg-white">
                      <TableRow className="h-12 border-black">
                        <TableHead className="font-bold border-black text-center">Roll No</TableHead>
                        <TableHead className="font-bold border-black text-center">Student Name</TableHead>
                        <TableHead className="font-bold border-black text-center">Patrak-B</TableHead>
                        <TableHead className="font-bold border-black text-center">Total Marks</TableHead>
                        <TableHead className="font-bold border-black text-center">Avg %</TableHead>
                        <TableHead className="font-bold border-black text-center">Outcome</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStudents.map(s => (
                        <TableRow key={s.id} className="h-10 border-black">
                          <TableCell className="font-black text-center border-black">{s.rollNumber}</TableCell>
                          <TableCell className="font-black border-black">{s.name}</TableCell>
                          <TableCell className="text-center font-bold border-black">85</TableCell>
                          <TableCell className="text-center font-black border-black">425</TableCell>
                          <TableCell className="text-center font-black border-black">84.5%</TableCell>
                          <TableCell className="text-center font-black border-black">PASS</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              );
            }
            return null;
          })()}
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

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
import { FileSpreadsheet, Calendar, Save, Trophy } from "lucide-react";
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

  const commonRowSpan = isAnnual ? 3 : 2;

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
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
            <Button onClick={handleSaveAll} className="font-bold bg-orange-600 hover:bg-orange-700 shadow-lg shadow-orange-600/20">
              <Save className="w-4 h-4 mr-2" />
              Save Results
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
          <ScrollArea className="w-full">
            <Table className="border-collapse">
              <TableHeader className="bg-slate-50">
                {/* Tier 1 Header */}
                <TableRow>
                  <TableHead rowSpan={commonRowSpan} className="font-bold uppercase tracking-wider text-xs border-r sticky left-0 bg-slate-50 z-20 min-w-[80px]">
                    Roll No
                  </TableHead>
                  <TableHead rowSpan={commonRowSpan} className="font-bold uppercase tracking-wider text-xs border-r sticky left-[80px] bg-slate-50 z-20 min-w-[180px]">
                    Student Name
                  </TableHead>
                  <TableHead rowSpan={commonRowSpan} className="font-bold uppercase tracking-wider text-xs border-r min-w-[100px]">
                    G.R. No.
                  </TableHead>
                  <TableHead rowSpan={commonRowSpan} className="font-bold uppercase tracking-wider text-xs border-r min-w-[120px]">
                    Birthdate
                  </TableHead>
                  <TableHead rowSpan={commonRowSpan} className="font-bold uppercase tracking-wider text-xs border-r min-w-[80px] text-center">
                    Atten.
                  </TableHead>
                  <TableHead rowSpan={commonRowSpan} className="font-bold uppercase tracking-wider text-xs border-r min-w-[100px]">
                    Caste
                  </TableHead>
                  
                  {activeSubjects.map((subject) => (
                    <TableHead key={subject} colSpan={isAnnual ? 8 : 5} className="font-bold uppercase tracking-wider text-xs text-center border-r border-b bg-slate-100/50">
                      {subject}
                    </TableHead>
                  ))}

                  {/* PATRAK B SECTION */}
                  <TableHead colSpan={1} className="font-bold uppercase tracking-wider text-xs text-center border-r border-b bg-indigo-50/50">
                    PATRAK-B
                  </TableHead>

                  <TableHead rowSpan={commonRowSpan} className="text-center font-bold uppercase tracking-wider text-xs min-w-[80px] border-l">Avg %</TableHead>
                  <TableHead rowSpan={commonRowSpan} className="text-right font-bold uppercase tracking-wider text-xs sticky right-0 bg-slate-50 z-20 min-w-[100px]">Outcome</TableHead>
                </TableRow>

                {/* Tier 2 Header (Conditional for Annual) */}
                {isAnnual ? (
                  <TableRow>
                    {activeSubjects.map((subject) => (
                      <React.Fragment key={`${subject}-sem-row`}>
                        <TableHead colSpan={3} className="text-[10px] font-black text-center border-r border-b bg-blue-50/50">Semester 1</TableHead>
                        <TableHead colSpan={3} className="text-[10px] font-black text-center border-r border-b bg-green-50/50">Semester 2</TableHead>
                        <TableHead rowSpan={2} className="text-[10px] font-black text-center border-r border-b bg-orange-50">Total</TableHead>
                        <TableHead rowSpan={2} className="text-[10px] font-black text-center border-r border-b">Grade</TableHead>
                      </React.Fragment>
                    ))}
                    {/* Patrak B Tier 2 for Annual - Only Avg */}
                    <TableHead rowSpan={2} className="text-[10px] font-black text-center border-r border-b bg-indigo-100">Avg</TableHead>
                  </TableRow>
                ) : (
                  <TableRow>
                    {activeSubjects.map((subject) => (
                      <React.Fragment key={`${subject}-sub`}>
                        <TableHead className="text-[10px] font-bold text-center px-1 border-r min-w-[60px]">Sva.</TableHead>
                        <TableHead className="text-[10px] font-bold text-center px-1 border-r min-w-[60px]">Tri.</TableHead>
                        <TableHead className="text-[10px] font-bold text-center px-1 border-r min-w-[60px]">
                          {semester === "Semester 1" ? "PAT" : semester === "Semester 2" ? "SAT" : "PAT/SAT"}
                        </TableHead>
                        <TableHead className="text-[10px] font-black text-center px-1 border-r min-w-[60px] bg-orange-50/50">Total</TableHead>
                        <TableHead className="text-[10px] font-bold text-center px-1 border-r min-w-[50px]">Grd.</TableHead>
                      </React.Fragment>
                    ))}
                    {/* Patrak B Tier 2 for Single Semester */}
                    <TableHead className="text-[10px] font-black text-center border-r bg-indigo-50/50">Total</TableHead>
                  </TableRow>
                )}

                {/* Tier 3 Header (Only for Annual) */}
                {isAnnual && (
                  <TableRow>
                    {activeSubjects.map((subject) => (
                      <React.Fragment key={`${subject}-annual-data-row`}>
                        {/* Sem 1 Columns */}
                        <TableHead className="text-[9px] font-bold text-center px-1 border-r min-w-[50px]">Trimasik</TableHead>
                        <TableHead className="text-[9px] font-bold text-center px-1 border-r min-w-[50px]">Svadhyay</TableHead>
                        <TableHead className="text-[9px] font-bold text-center px-1 border-r min-w-[50px]">PAT/SAT</TableHead>
                        {/* Sem 2 Columns */}
                        <TableHead className="text-[9px] font-bold text-center px-1 border-r min-w-[50px]">Trimasik</TableHead>
                        <TableHead className="text-[9px] font-bold text-center px-1 border-r min-w-[50px]">Svadhyay</TableHead>
                        <TableHead className="text-[9px] font-bold text-center px-1 border-r min-w-[50px]">PAT/SAT</TableHead>
                      </React.Fragment>
                    ))}
                  </TableRow>
                )}
              </TableHeader>

              <TableBody>
                {filteredStudents.map((s) => (
                  <TableRow key={s.id} className="hover:bg-slate-50/50">
                    <TableCell className="font-black text-primary border-r sticky left-0 bg-white z-10">
                      {s.rollNumber}
                    </TableCell>
                    <TableCell className="font-black text-slate-700 whitespace-nowrap border-r sticky left-[80px] bg-white z-10">
                      {s.name}
                    </TableCell>
                    <TableCell className="text-slate-500 font-medium border-r">{s.grNumber}</TableCell>
                    <TableCell className="text-slate-600 border-r">{s.birthday}</TableCell>
                    <TableCell className="text-center font-bold text-primary border-r">{s.attendance}%</TableCell>
                    <TableCell className="text-slate-600 border-r">{s.caste}</TableCell>
                    
                    {activeSubjects.map((subject) => (
                      <React.Fragment key={`${s.id}-${subject}`}>
                        {isAnnual ? (
                          <>
                            {/* Semester 1 Inputs */}
                            <TableCell className="p-1 border-r bg-blue-50/10">
                              <Input type="number" className="h-7 text-[10px] text-center px-1 font-medium" defaultValue={15} />
                            </TableCell>
                            <TableCell className="p-1 border-r bg-blue-50/10">
                              <Input type="number" className="h-7 text-[10px] text-center px-1 font-medium" defaultValue={10} />
                            </TableCell>
                            <TableCell className="p-1 border-r bg-blue-50/10">
                              <Input type="number" className="h-7 text-[10px] text-center px-1 font-medium" defaultValue={25} />
                            </TableCell>
                            {/* Semester 2 Inputs */}
                            <TableCell className="p-1 border-r bg-green-50/10">
                              <Input type="number" className="h-7 text-[10px] text-center px-1 font-medium" defaultValue={18} />
                            </TableCell>
                            <TableCell className="p-1 border-r bg-green-50/10">
                              <Input type="number" className="h-7 text-[10px] text-center px-1 font-medium" defaultValue={12} />
                            </TableCell>
                            <TableCell className="p-1 border-r bg-green-50/10">
                              <Input type="number" className="h-7 text-[10px] text-center px-1 font-medium" defaultValue={22} />
                            </TableCell>
                            {/* Summary Columns */}
                            <TableCell className="p-1 border-r text-center font-bold text-orange-700 text-xs bg-orange-50/20">
                              102
                            </TableCell>
                            <TableCell className="p-1 border-r text-center font-black text-primary text-[10px]">
                              A+
                            </TableCell>
                          </>
                        ) : (
                          <>
                            <TableCell className="p-1 border-r">
                              <Input type="number" className="h-7 text-xs text-center px-1 font-medium" defaultValue={8} />
                            </TableCell>
                            <TableCell className="p-1 border-r">
                              <Input type="number" className="h-7 text-xs text-center px-1 font-medium" defaultValue={72} />
                            </TableCell>
                            <TableCell className="p-1 border-r">
                              <Input type="number" className="h-7 text-xs text-center px-1 font-medium" defaultValue={22} />
                            </TableCell>
                            <TableCell className="p-1 border-r bg-orange-50/20 text-center font-bold text-orange-700 text-xs">
                              102
                            </TableCell>
                            <TableCell className="p-1 border-r text-center font-black text-primary text-[10px]">
                              A+
                            </TableCell>
                          </>
                        )}
                      </React.Fragment>
                    ))}

                    {/* PATRAK B DATA CELLS */}
                    <TableCell className={`p-1 border-r text-center font-bold text-xs ${isAnnual ? 'bg-indigo-100/30 font-black text-indigo-700' : 'bg-indigo-50/20'}`}>
                      {isAnnual ? "86.5" : <Input type="number" className="h-7 text-xs text-center font-bold" defaultValue={85} />}
                    </TableCell>

                    <TableCell className="text-center font-black text-orange-600 border-l">84.5%</TableCell>
                    <TableCell className="text-right sticky right-0 bg-white z-10 border-l">
                      <Badge className="bg-green-600 font-bold px-3 py-1 flex gap-1 items-center justify-center">
                        <Trophy className="w-3 h-3" /> PASS
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {(selectedStandard === "all" || (activeSubjects.length === 0)) && (
                  <TableRow>
                    <TableCell colSpan={activeSubjects.length * (isAnnual ? 8 : 5) + (isAnnual ? 9 : 9)} className="h-32 text-center text-muted-foreground">
                      {selectedStandard === "all" 
                        ? "Select a standard to begin direct results entry." 
                        : "No subjects mapped for this standard in " + semester + "."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </div>
    </MainLayout>
  );
}

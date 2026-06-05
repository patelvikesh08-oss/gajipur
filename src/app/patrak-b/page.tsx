
"use client";

import { useState, useMemo } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { useStudentStore } from "@/lib/student-store";
import { useSessionStore } from "@/lib/session-store";
import { usePatrakBStore } from "@/lib/patrak-b-store";
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
import { ScrollText, Calendar, Save, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import React from "react";

export default function PatrakBPage() {
  const { students, isLoaded: studentsLoaded } = useStudentStore();
  const { academicYear, semester, updateYear, updateSemester, isLoaded: sessionLoaded } = useSessionStore();
  const { config, isLoaded: configLoaded } = usePatrakBStore();
  
  const [search, setSearch] = useState("");
  const [selectedStandard, setSelectedStandard] = useState("all");

  const isAnnual = semester === "Annual";

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || 
                            (s.rollNumber || "").includes(search.toLowerCase());
      const matchesStandard = selectedStandard === "all" || s.academicStandard === selectedStandard;
      return matchesSearch && matchesStandard;
    }).sort((a, b) => (a.rollNumber || "").localeCompare(b.rollNumber || "", undefined, { numeric: true }));
  }, [students, search, selectedStandard]);

  const standards = useMemo(() => {
    return Array.from(new Set(students.map(s => s.academicStandard))).sort();
  }, [students]);

  if (!studentsLoaded || !sessionLoaded || !configLoaded) return null;

  const handleSaveAll = () => {
    toast({
      title: "Progress Records Saved",
      description: `Internal progress data for ${academicYear} has been committed.`,
    });
  };

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent/10 rounded-lg">
              <ScrollText className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">PATRAK-B (Internal Progress) / પત્રક-બ</h1>
              <p className="text-xs text-muted-foreground font-medium">Log behavioral and qualitative progress milestones</p>
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
            <Button onClick={handleSaveAll} className="font-bold bg-accent hover:bg-accent/90 shadow-lg shadow-accent/20">
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
          <ScrollArea className="w-full">
            <Table className="border-collapse print:table-fixed">
              <TableHeader className="bg-slate-50 print:bg-white">
                <TableRow>
                  <TableHead rowSpan={3} className="font-bold uppercase tracking-wider text-xs w-[60px] border-r sticky left-0 bg-slate-50 z-20 text-center print:border-black">Roll No</TableHead>
                  <TableHead rowSpan={3} className="font-bold uppercase tracking-wider text-xs min-w-[180px] border-r sticky left-[60px] bg-slate-50 z-20 print:border-black">Student Name / નામ</TableHead>
                  
                  {isAnnual && (
                    <TableHead rowSpan={3} className="font-bold uppercase tracking-wider text-[10px] text-center border-r min-w-[60px] bg-muted/20 print:border-black">Sem</TableHead>
                  )}

                  {config.fields.map(field => (
                    <TableHead key={field.id} colSpan={field.subColumnCount} className="font-black uppercase tracking-wider text-[10px] text-center border-r bg-muted/30 py-2 print:border-black">
                      {field.title}
                    </TableHead>
                  ))}

                  <TableHead rowSpan={3} className="font-bold uppercase tracking-wider text-[10px] text-center border-r min-w-[80px] bg-blue-50/50 print:border-black">Sem 1 Total</TableHead>
                  <TableHead rowSpan={3} className="font-bold uppercase tracking-wider text-[10px] text-center border-r min-w-[80px] bg-green-50/50 print:border-black">Sem 2 Total</TableHead>
                  <TableHead rowSpan={3} className="font-bold uppercase tracking-wider text-[10px] text-center border-r min-w-[80px] bg-orange-50/50 print:border-black">Avg Marks</TableHead>
                </TableRow>
                <TableRow>
                  {config.fields.map(field => (
                    Array.from({ length: field.subColumnCount }).map((_, i) => (
                      <TableHead key={`${field.id}-label-${i}`} className="text-[9px] font-bold border-r min-w-[45px] h-[140px] p-0 bg-white print:border-black print:h-auto print:py-1">
                        <div className="flex flex-col items-center justify-end h-full w-full pb-3 print:pb-1">
                          <span className="vertical-text text-slate-600 px-1 max-h-[120px] overflow-hidden print:writing-mode-horizontal-tb print:rotate-0 print:text-[8px]">
                            {field.subColumnLabels[i] || `M${i+1}`}
                          </span>
                        </div>
                      </TableHead>
                    ))
                  ))}
                </TableRow>
                <TableRow>
                  {(() => {
                    let subColIndex = 0;
                    return config.fields.map(field => (
                      Array.from({ length: field.subColumnCount }).map((_, i) => {
                        subColIndex++;
                        return (
                          <TableHead key={`${field.id}-num-${i}`} className="text-[10px] font-black text-center border-r bg-white print:border-black h-8 py-1">
                            <span className="text-primary font-black print:text-black">{subColIndex}</span>
                          </TableHead>
                        );
                      })
                    ));
                  })()}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((s) => (
                  <React.Fragment key={s.id}>
                    <TableRow className="hover:bg-slate-50/50 h-10 print:h-auto print:bg-white">
                      <TableCell rowSpan={isAnnual ? 2 : 1} className="font-black text-primary border-r sticky left-0 bg-white z-10 text-center text-xs print:text-black print:border-black">
                        {s.rollNumber}
                      </TableCell>
                      <TableCell rowSpan={isAnnual ? 2 : 1} className="font-bold text-slate-700 border-r sticky left-[60px] bg-white z-10 text-xs print:text-black print:border-black">
                        {s.name}
                      </TableCell>
                      
                      {isAnnual && (
                        <TableCell className="bg-blue-50/20 text-center text-[9px] font-black text-primary border-r print:text-black print:border-black">S1</TableCell>
                      )}

                      {config.fields.map(field => (
                        Array.from({ length: field.subColumnCount }).map((_, i) => (
                          <TableCell key={`${s.id}-${field.id}-${i}-s1`} className="p-0 border-r print:border-black">
                            <input className="w-full h-8 text-center text-xs bg-transparent border-none outline-none focus:bg-accent/5 transition-colors" defaultValue="" />
                          </TableCell>
                        ))
                      ))}

                      <TableCell rowSpan={isAnnual ? 2 : 1} className="p-0 border-r bg-blue-50/10 print:border-black">
                        <input type="number" className="w-full h-8 text-center font-bold text-xs bg-transparent border-none outline-none focus:bg-accent/5 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" defaultValue={0} />
                      </TableCell>
                      <TableCell rowSpan={isAnnual ? 2 : 1} className="p-0 border-r bg-green-50/10 print:border-black">
                        <input type="number" className="w-full h-8 text-center font-bold text-xs bg-transparent border-none outline-none focus:bg-accent/5 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" defaultValue={0} />
                      </TableCell>
                      <TableCell rowSpan={isAnnual ? 2 : 1} className="p-0 border-r bg-orange-50/10 print:border-black">
                        <input type="number" className="w-full h-8 text-center font-black text-orange-600 text-xs bg-transparent border-none outline-none focus:bg-accent/5 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" defaultValue={0} />
                      </TableCell>
                    </TableRow>
                    
                    {isAnnual && (
                      <TableRow className="hover:bg-slate-50/50 h-10 bg-slate-50/20 print:h-auto print:bg-white">
                        <TableCell className="bg-green-50/20 text-center text-[9px] font-black text-primary border-r print:text-black print:border-black">S2</TableCell>
                        {config.fields.map(field => (
                          Array.from({ length: field.subColumnCount }).map((_, i) => (
                            <TableCell key={`${s.id}-${field.id}-${i}-s2`} className="p-0 border-r print:border-black">
                              <input className="w-full h-8 text-center text-xs bg-transparent border-none outline-none focus:bg-accent/5 transition-colors" defaultValue="" />
                            </TableCell>
                          ))
                        ))}
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
            <ScrollBar orientation="horizontal" className="no-print" />
          </ScrollArea>
        </div>
      </div>
    </MainLayout>
  );
}

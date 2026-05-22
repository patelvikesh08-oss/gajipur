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
import { ScrollText, Calendar, Save } from "lucide-react";
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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent/10 rounded-lg">
              <ScrollText className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">PATRAK-B (Internal Progress)</h1>
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
                <SelectItem value="Semester 1">Semester 1</SelectItem>
                <SelectItem value="Semester 2">Semester 2</SelectItem>
                <SelectItem value="Annual">Annual</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleSaveAll} className="font-bold bg-accent hover:bg-accent/90 shadow-lg shadow-accent/20">
              <Save className="w-4 h-4 mr-2" />
              Save Progress
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            placeholder="Filter students by name or roll number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white"
          />
          <Select value={selectedStandard} onValueChange={setSelectedStandard}>
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Pick a Standard" />
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
                  <TableHead rowSpan={2} className="font-bold uppercase tracking-wider text-xs w-[60px] border-r sticky left-0 bg-slate-50 z-20 text-center">Roll No</TableHead>
                  <TableHead rowSpan={2} className="font-bold uppercase tracking-wider text-xs min-w-[180px] border-r sticky left-[60px] bg-slate-50 z-20">Student Name</TableHead>
                  
                  {config.fields.map(field => (
                    <TableHead key={field.id} colSpan={field.subColumnCount} className="font-bold uppercase tracking-wider text-[10px] text-center border-r bg-muted/30">
                      Field {field.id}
                    </TableHead>
                  ))}

                  <TableHead rowSpan={2} className="font-bold uppercase tracking-wider text-[10px] text-center border-r min-w-[80px] bg-blue-50/50">Sem 1</TableHead>
                  <TableHead rowSpan={2} className="font-bold uppercase tracking-wider text-[10px] text-center border-r min-w-[80px] bg-green-50/50">Sem 2</TableHead>
                  <TableHead rowSpan={2} className="font-bold uppercase tracking-wider text-[10px] text-center border-r min-w-[80px] bg-orange-50/50">Avg</TableHead>
                </TableRow>
                {/* Tier 2 Header (Sub-columns with Continuous Numbering) */}
                <TableRow>
                  {(() => {
                    let subColIndex = 0;
                    return config.fields.map(field => (
                      Array.from({ length: field.subColumnCount }).map((_, i) => {
                        subColIndex++;
                        return (
                          <TableHead key={`${field.id}-${i}`} className="text-[9px] font-bold text-center border-r min-w-[45px] bg-white">
                            {subColIndex}
                          </TableHead>
                        );
                      })
                    ));
                  })()}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((s) => (
                  <TableRow key={s.id} className="hover:bg-slate-50/50 h-10">
                    <TableCell className="font-black text-primary border-r sticky left-0 bg-white z-10 text-center text-xs">
                      {s.rollNumber}
                    </TableCell>
                    <TableCell className="font-bold text-slate-700 border-r sticky left-[60px] bg-white z-10 text-xs">
                      {s.name}
                    </TableCell>
                    
                    {config.fields.map(field => (
                      Array.from({ length: field.subColumnCount }).map((_, i) => (
                        <TableCell key={`${s.id}-${field.id}-${i}`} className="p-1 border-r">
                          <Input className="h-7 text-center text-xs" defaultValue="" />
                        </TableCell>
                      ))
                    ))}

                    <TableCell className="p-1 border-r bg-blue-50/10">
                      <Input type="number" className="h-7 text-center font-bold text-xs" defaultValue={0} />
                    </TableCell>
                    <TableCell className="p-1 border-r bg-green-50/10">
                      <Input type="number" className="h-7 text-center font-bold text-xs" defaultValue={0} />
                    </TableCell>
                    <TableCell className="p-1 border-r bg-orange-50/10">
                      <Input type="number" className="h-7 text-center font-black text-orange-600 text-xs" defaultValue={0} />
                    </TableCell>
                  </TableRow>
                ))}
                {filteredStudents.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={config.fields.reduce((acc, f) => acc + f.subColumnCount, 0) + 5} className="h-24 text-center text-muted-foreground font-medium italic text-xs">
                      No students matching criteria.
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

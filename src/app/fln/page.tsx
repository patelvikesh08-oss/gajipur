
"use client";

import { useState, useMemo } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { useStudentStore } from "@/lib/student-store";
import { useSessionStore } from "@/lib/session-store";
import { useFLNConfigStore, FLNCategory } from "@/lib/fln-config-store";
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
import { SpellCheck, Calendar, Save, Clock, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import React from "react";

const ACADEMIC_MONTHS = [
  "June", "July", "August", "September", "October", "November",
  "December", "January", "February", "March", "April", "May"
];

export default function FlnPage() {
  const { students, isLoaded: studentsLoaded } = useStudentStore();
  const { academicYear, updateYear, isLoaded: sessionLoaded } = useSessionStore();
  const { config, isLoaded: configLoaded } = useFLNConfigStore();
  
  const [search, setSearch] = useState("");
  const [selectedStandard, setSelectedStandard] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState("June");

  const [flnData, setFlnData] = useState<Record<string, Record<string, boolean[]>>>({});

  const flnCategories: { name: FLNCategory; color: string }[] = [
    { name: "FOUNDATION", color: "bg-blue-50/50" },
    { name: "LITERACY", color: "bg-emerald-50/50" },
    { name: "NUMERICY", color: "bg-amber-50/50" }
  ];

  const standards = useMemo(() => {
    return Array.from(new Set(students.map(s => s.academicStandard))).sort();
  }, [students]);

  if (!studentsLoaded || !sessionLoaded || !configLoaded) return null;

  const filteredStudents = students.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || 
                          (s.rollNumber || "").includes(search.toLowerCase());
    const matchesStandard = selectedStandard === "all" || s.academicStandard === selectedStandard;
    return matchesSearch && matchesStandard;
  }).sort((a, b) => (a.rollNumber || "").localeCompare(b.rollNumber || "", undefined, { numeric: true }));

  const handleCheck = (studentId: string, category: string, index: number, checked: boolean | 'indeterminate') => {
    setFlnData(prev => {
      const studentData = prev[studentId] || { 
        FOUNDATION: Array(10).fill(false), 
        LITERACY: Array(10).fill(false), 
        NUMERICY: Array(10).fill(false) 
      };
      
      const currentCategoryData = (studentData[category as keyof typeof studentData] as boolean[]) || Array(10).fill(false);
      const updatedCategoryData = [...currentCategoryData];
      updatedCategoryData[index] = !!checked;

      return {
        ...prev,
        [studentId]: {
          ...studentData,
          [category]: updatedCategoryData
        }
      };
    });
  };

  const getCategoryTotal = (studentId: string, category: string) => {
    return flnData[studentId]?.[category]?.filter(Boolean).length || 0;
  };

  const handleSaveAll = () => {
    toast({
      title: "FLN Data Saved",
      description: `Progress for ${selectedMonth} (${academicYear}) has been recorded.`,
    });
  };

  const subColumns = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <SpellCheck className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">FLN Milestone Entry</h1>
              <p className="text-xs text-muted-foreground font-medium">Foundational Reading, Writing and Math Tracking</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border shadow-sm">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <Select value={academicYear} onValueChange={(val: any) => updateYear(val)}>
                <SelectTrigger className="w-[100px] border-none shadow-none focus:ring-0 h-7 text-xs font-bold">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2023-24">2023-24</SelectItem>
                  <SelectItem value="2024-25">2024-25</SelectItem>
                  <SelectItem value="2025-26">2025-26</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border shadow-sm">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="w-[120px] border-none shadow-none focus:ring-0 h-7 text-xs font-bold">
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                  {ACADEMIC_MONTHS.map(month => (
                    <SelectItem key={month} value={month}>{month}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button variant="outline" onClick={() => window.print()} className="font-bold border-slate-200">
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
            <Button onClick={handleSaveAll} className="font-bold bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/20">
              <Save className="w-4 h-4 mr-2" />
              Save Milestones
            </Button>
          </div>
        </div>

        {/* PRINT HEADER */}
        <div className="hidden print:block text-center mb-6 space-y-2 border-b-2 border-slate-900 pb-4">
          <h1 className="text-2xl font-black uppercase">EduPulse Global Academy</h1>
          <h2 className="text-lg font-bold uppercase">FLN Milestone Progress Report</h2>
          <div className="flex justify-center gap-8 font-bold text-xs">
            <span>Academic Year: {academicYear}</span>
            <span>Month: {selectedMonth}</span>
            <span>Standard: {selectedStandard === 'all' ? 'All Classes' : selectedStandard}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 no-print">
          <Input
            placeholder="Search student by name or roll number..."
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
          <ScrollArea className="w-full">
            <Table className="border-collapse w-full">
              <TableHeader className="bg-slate-50 print:bg-white">
                <TableRow>
                  <TableHead rowSpan={2} className="font-bold uppercase tracking-wider text-[10px] w-[50px] border-r sticky left-0 bg-slate-50 z-20 print:static print:bg-white text-center">Roll No</TableHead>
                  <TableHead rowSpan={2} className="font-bold uppercase tracking-wider text-[10px] min-w-[120px] border-r sticky left-[50px] bg-slate-50 z-20 print:static print:bg-white">Student Name</TableHead>
                  {flnCategories.map((cat) => (
                    <TableHead 
                      key={cat.name} 
                      colSpan={11} 
                      className={`font-black uppercase tracking-widest text-[9px] text-center border-r border-b ${cat.color} print:bg-white print:border-black py-2`}
                    >
                      {cat.name}
                    </TableHead>
                  ))}
                </TableRow>
                <TableRow>
                  {flnCategories.map((cat) => (
                    <React.Fragment key={`${cat.name}-subs`}>
                      {subColumns.map(idx => (
                        <TableHead key={`${cat.name}-${idx}`} className="text-[8px] font-bold border-r min-w-[32px] h-[160px] p-0 bg-white print:border-black print:h-auto print:py-1">
                          <div className="flex flex-col items-center justify-end h-full w-full pb-3 gap-2 print:pb-1">
                            <span className="vertical-text text-slate-600 px-1 max-h-[120px] overflow-hidden print:writing-mode-horizontal-tb print:rotate-0 print:text-[7px]">
                              {config.categories[cat.name][idx] || `M${idx + 1}`}
                            </span>
                            <span className="text-primary font-black mt-auto print:text-black">{idx + 1}</span>
                          </div>
                        </TableHead>
                      ))}
                      <TableHead className="text-[8px] font-black text-center px-0.5 border-r min-w-[30px] bg-slate-100 text-primary print:bg-white print:text-black print:border-black">
                        TOT
                      </TableHead>
                    </React.Fragment>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((s) => (
                  <TableRow key={s.id} className="hover:bg-slate-50/50 h-10 print:h-8 print:bg-white">
                    <TableCell className="font-black text-primary border-r sticky left-0 bg-white z-10 text-[10px] text-center print:static print:text-black print:border-black">
                      {s.rollNumber}
                    </TableCell>
                    <TableCell className="font-bold text-slate-700 whitespace-nowrap border-r sticky left-[50px] bg-white z-10 text-[10px] print:static print:border-black">
                      {s.name}
                    </TableCell>
                    {flnCategories.map((cat) => (
                      <React.Fragment key={`${s.id}-${cat.name}`}>
                        {subColumns.map(idx => (
                          <TableCell key={`${s.id}-${cat.name}-${idx}`} className="p-0 border-r text-center print:border-black">
                            <div className="flex items-center justify-center h-10 print:h-8">
                              <Checkbox 
                                checked={flnData[s.id]?.[cat.name]?.[idx] || false}
                                onCheckedChange={(val) => handleCheck(s.id, cat.name, idx, val)}
                                className="h-4 w-4 border-slate-300"
                              />
                            </div>
                          </TableCell>
                        ))}
                        <TableCell className="bg-slate-100/30 border-r text-center font-black text-primary text-[10px] print:bg-white print:text-black print:border-black">
                          {getCategoryTotal(s.id, cat.name)}
                        </TableCell>
                      </React.Fragment>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <ScrollBar orientation="horizontal" className="no-print" />
          </ScrollArea>
        </div>

        <div className="flex justify-end pt-4 no-print mb-12 gap-3">
          <Button variant="outline" size="lg" onClick={() => window.print()} className="font-bold gap-2">
            <Printer className="w-4 h-4" />
            Print Milestone Records
          </Button>
          <Button onClick={handleSaveAll} size="lg" className="font-bold bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 px-8">
            <Save className="w-4 h-4 mr-2" />
            Commit Changes
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}

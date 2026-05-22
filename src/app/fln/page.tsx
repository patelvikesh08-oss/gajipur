
"use client";

import { useState, useMemo } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { useStudentStore } from "@/lib/student-store";
import { useSessionStore } from "@/lib/session-store";
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
import { SpellCheck, Calendar, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import React from "react";

export default function FlnPage() {
  const { students, isLoaded: studentsLoaded } = useStudentStore();
  const { academicYear, semester, updateYear, updateSemester, isLoaded: sessionLoaded } = useSessionStore();
  
  const [search, setSearch] = useState("");
  const [selectedStandard, setSelectedStandard] = useState("all");

  // State to track ticks: { [studentId]: { [category]: boolean[] } }
  const [flnData, setFlnData] = useState<Record<string, Record<string, boolean[]>>>({});

  const flnCategories = [
    { name: "FOUNDATION", color: "bg-blue-50/50" },
    { name: "LITERACY", color: "bg-emerald-50/50" },
    { name: "NUMERICY", color: "bg-amber-50/50" }
  ];

  const standards = useMemo(() => {
    return Array.from(new Set(students.map(s => s.academicStandard))).sort();
  }, [students]);

  if (!studentsLoaded || !sessionLoaded) return null;

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
      
      const currentCategoryData = studentData[category as keyof typeof studentData] || Array(10).fill(false);
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
      description: `Foundation, Literacy, and Numeracy records updated for ${filteredStudents.length} students.`,
    });
  };

  const subColumns = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <SpellCheck className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">FLN Milestone Entry</h1>
              <p className="text-xs text-muted-foreground font-medium">Foundational Reading, Writing and Math Skills Tracking</p>
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
            <Button onClick={handleSaveAll} className="font-bold bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/20">
              <Save className="w-4 h-4 mr-2" />
              Save Milestone Records
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
          <ScrollArea className="w-full">
            <Table className="border-collapse">
              <TableHeader className="bg-slate-50">
                {/* Tier 1 Header */}
                <TableRow>
                  <TableHead rowSpan={2} className="font-bold uppercase tracking-wider text-[10px] w-[60px] border-r sticky left-0 bg-slate-50 z-20">Roll No</TableHead>
                  <TableHead rowSpan={2} className="font-bold uppercase tracking-wider text-[10px] min-w-[180px] border-r sticky left-[60px] bg-slate-50 z-20">Student Name</TableHead>
                  {flnCategories.map((cat) => (
                    <TableHead 
                      key={cat.name} 
                      colSpan={11} 
                      className={`font-black uppercase tracking-widest text-xs text-center border-r border-b ${cat.color}`}
                    >
                      {cat.name}
                    </TableHead>
                  ))}
                </TableRow>
                {/* Tier 2 Header */}
                <TableRow>
                  {flnCategories.map((cat) => (
                    <React.Fragment key={`${cat.name}-subs`}>
                      {subColumns.map(num => (
                        <TableHead key={`${cat.name}-${num}`} className="text-[9px] font-bold text-center px-1 border-r min-w-[35px] bg-white">
                          {num}
                        </TableHead>
                      ))}
                      <TableHead className="text-[9px] font-black text-center px-1 border-r min-w-[45px] bg-slate-100 text-primary">
                        TOTAL
                      </TableHead>
                    </React.Fragment>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((s) => (
                  <TableRow key={s.id} className="hover:bg-slate-50/50 h-10">
                    <TableCell className="font-black text-primary border-r sticky left-0 bg-white z-10 text-xs text-center">
                      {s.rollNumber}
                    </TableCell>
                    <TableCell className="font-bold text-slate-700 whitespace-nowrap border-r sticky left-[60px] bg-white z-10 text-xs">
                      {s.name}
                    </TableCell>
                    {flnCategories.map((cat) => (
                      <React.Fragment key={`${s.id}-${cat.name}`}>
                        {subColumns.map(num => (
                          <TableCell key={`${s.id}-${cat.name}-${num}`} className="p-0 border-r text-center">
                            <div className="flex items-center justify-center h-10">
                              <Checkbox 
                                checked={flnData[s.id]?.[cat.name]?.[num-1] || false}
                                onCheckedChange={(val) => handleCheck(s.id, cat.name, num-1, val)}
                                className="h-4 w-4 border-slate-300 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                              />
                            </div>
                          </TableCell>
                        ))}
                        <TableCell className="bg-slate-100/30 border-r text-center font-black text-primary text-[11px]">
                          {getCategoryTotal(s.id, cat.name)}
                        </TableCell>
                      </React.Fragment>
                    ))}
                  </TableRow>
                ))}
                {filteredStudents.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={35} className="h-32 text-center text-muted-foreground italic">
                      No student records found matching your criteria.
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

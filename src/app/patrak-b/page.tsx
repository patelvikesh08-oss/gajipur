
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
import { ScrollText, Calendar, Save, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

export default function PatrakBPage() {
  const { students, isLoaded: studentsLoaded } = useStudentStore();
  const { academicYear, semester, updateYear, updateSemester, isLoaded: sessionLoaded } = useSessionStore();
  
  const [search, setSearch] = useState("");
  const [selectedStandard, setSelectedStandard] = useState("all");

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
              <p className="text-xs text-muted-foreground font-medium">Log behavioral and qualitative progress</p>
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
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="font-bold uppercase tracking-wider text-xs w-[80px]">Roll No</TableHead>
                <TableHead className="font-bold uppercase tracking-wider text-xs">Student</TableHead>
                <TableHead className="font-bold uppercase tracking-wider text-xs">Standard</TableHead>
                <TableHead className="font-bold uppercase tracking-wider text-xs">Qualitative Observation</TableHead>
                <TableHead className="font-bold uppercase tracking-wider text-xs text-center w-[120px]">Grade</TableHead>
                <TableHead className="text-right font-bold uppercase tracking-wider text-xs">Verification</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((s) => (
                <TableRow key={s.id} className="hover:bg-slate-50/50">
                  <TableCell className="font-black text-primary">{s.rollNumber}</TableCell>
                  <TableCell className="font-bold text-slate-700">{s.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-accent text-accent font-bold">{s.academicStandard}</Badge>
                  </TableCell>
                  <TableCell>
                    <Input placeholder="Enter observations..." className="h-8 text-sm" defaultValue="Demonstrates excellent social behavior and participation." />
                  </TableCell>
                  <TableCell className="text-center">
                    <Select defaultValue="A+">
                      <SelectTrigger className="h-8 font-bold">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A+">A+</SelectItem>
                        <SelectItem value="A">A</SelectItem>
                        <SelectItem value="B">B</SelectItem>
                        <SelectItem value="C">C</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge className="bg-blue-500 border-none px-3 font-bold">
                      <CheckCircle2 className="w-3 h-3 mr-1" /> Verified
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {filteredStudents.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    No students matching criteria.
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

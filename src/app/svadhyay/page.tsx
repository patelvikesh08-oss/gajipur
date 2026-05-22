
"use client";

import { useState, useMemo } from "react";
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
import { BookOpen, Calendar, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import React from "react";

export default function SvadhyayPage() {
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
    const mapping = mappings.find(m => m.standard === selectedStandard);
    return mapping ? mapping.subjects : [];
  }, [selectedStandard, mappings]);

  if (!studentsLoaded || !sessionLoaded || !subjectsLoaded) return null;

  const filteredStudents = students.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || 
                          (s.rollNumber || "").includes(search.toLowerCase());
    const matchesStandard = selectedStandard === "all" || s.academicStandard === selectedStandard;
    return matchesSearch && matchesStandard;
  }).sort((a, b) => (a.rollNumber || "").localeCompare(b.rollNumber || "", undefined, { numeric: true }));

  const handleSaveAll = () => {
    toast({
      title: "Self-Study Records Saved",
      description: `Completion status updated for ${selectedStandard}.`,
    });
  };

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-pink-100 rounded-lg">
              <BookOpen className="w-6 h-6 text-pink-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">SVADHYAY (Self-Study Records)</h1>
              <p className="text-xs text-muted-foreground font-medium">Bulk log student completion status</p>
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
            <Button onClick={handleSaveAll} className="font-bold bg-pink-600 hover:bg-pink-700 shadow-lg shadow-pink-600/20">
              <Save className="w-4 h-4 mr-2" />
              Save Study Logs
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            placeholder="Find students by name or roll number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white"
          />
          <Select value={selectedStandard} onValueChange={setSelectedStandard}>
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Grade Level" />
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
                <TableHead rowSpan={isAnnual ? 2 : 1} className="font-bold uppercase tracking-wider text-xs w-[80px]">Roll No</TableHead>
                <TableHead rowSpan={isAnnual ? 2 : 1} className="font-bold uppercase tracking-wider text-xs">Student Name</TableHead>
                {activeSubjects.map((subject) => (
                  <TableHead 
                    key={subject} 
                    colSpan={isAnnual ? 2 : 1} 
                    className="font-bold uppercase tracking-wider text-xs text-center border-l"
                  >
                    {subject} (Units)
                  </TableHead>
                ))}
              </TableRow>
              {isAnnual && (
                <TableRow>
                  {activeSubjects.map((subject) => (
                    <React.Fragment key={`${subject}-sem-header`}>
                      <TableHead className="text-[10px] font-bold text-center border-l min-w-[100px]">Sem 1</TableHead>
                      <TableHead className="text-[10px] font-bold text-center border-l min-w-[100px]">Sem 2</TableHead>
                    </React.Fragment>
                  ))}
                </TableRow>
              )}
            </TableHeader>
            <TableBody>
              {filteredStudents.map((s) => (
                <TableRow key={s.id} className="hover:bg-slate-50/50">
                  <TableCell className="font-black text-primary">{s.rollNumber}</TableCell>
                  <TableCell className="font-bold text-slate-700 whitespace-nowrap">{s.name}</TableCell>
                  {activeSubjects.map((subject) => (
                    <React.Fragment key={`${s.id}-${subject}`}>
                      {isAnnual ? (
                        <>
                          <TableCell className="border-l p-1">
                            <div className="flex items-center justify-center">
                              <Input type="number" className="h-8 w-14 text-center" defaultValue={8} />
                            </div>
                          </TableCell>
                          <TableCell className="border-l p-1">
                            <div className="flex items-center justify-center">
                              <Input type="number" className="h-8 w-14 text-center" defaultValue={9} />
                            </div>
                          </TableCell>
                        </>
                      ) : (
                        <TableCell className="border-l">
                          <div className="flex items-center justify-center">
                            <Input 
                              type="number" 
                              max={10} 
                              min={0} 
                              className="h-8 w-20 font-bold text-center" 
                              defaultValue={7} 
                            />
                          </div>
                        </TableCell>
                      )}
                    </React.Fragment>
                  ))}
                </TableRow>
              ))}
              {selectedStandard === "all" && (
                <TableRow>
                  <TableCell colSpan={activeSubjects.length * (isAnnual ? 2 : 1) + 2} className="h-32 text-center text-muted-foreground">
                    Select a standard to view subject-wise self-study columns.
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

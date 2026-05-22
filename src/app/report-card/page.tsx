"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { useStudentStore } from "@/lib/student-store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Printer, Download, CheckCircle2, GraduationCap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function ReportCardPage() {
  const { students, isLoaded } = useStudentStore();
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");

  if (!isLoaded) return null;

  const selectedStudent = students.find((s) => s.id === selectedStudentId);

  // Mock results for the report card
  const subjects = [
    { name: "Mathematics", marks: 92, total: 100, grade: "A+" },
    { name: "Science", marks: 88, total: 100, grade: "A" },
    { name: "English", marks: 95, total: 100, grade: "O" },
    { name: "Social Studies", marks: 84, total: 100, grade: "A" },
    { name: "Environmental Studies", marks: 90, total: 100, grade: "A+" },
  ];

  const totalMarks = subjects.reduce((acc, curr) => acc + curr.marks, 0);
  const percentage = (totalMarks / (subjects.length * 100)) * 100;

  const handlePrint = () => {
    window.print();
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <GraduationCap className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">Student Report Card</h1>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Generate Result</CardTitle>
            <CardDescription>Select a student to view and print their academic performance report</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1 space-y-2">
              <label className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Student Name</label>
              <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a student..." />
                </SelectTrigger>
                <SelectContent>
                  {students.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name} ({s.academicStandard})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button 
              disabled={!selectedStudentId} 
              onClick={handlePrint}
              className="bg-primary hover:bg-primary/90 font-bold gap-2 shadow-lg shadow-primary/20"
            >
              <Printer className="w-4 h-4" />
              Print Report Card
            </Button>
          </CardContent>
        </Card>

        {selectedStudent ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-headline font-bold flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Annual Performance Review
              </h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="font-bold gap-2">
                  <Download className="w-3.5 h-3.5" />
                  PDF
                </Button>
                <Badge className="bg-green-500 font-bold flex gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Validated
                </Badge>
              </div>
            </div>

            {/* Report Card Template */}
            <div className="bg-white p-8 border border-slate-200 shadow-2xl rounded-xl print:shadow-none print:border-none">
              <div className="text-center space-y-4 mb-8">
                <div className="flex items-center justify-center gap-3">
                   <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                     <GraduationCap className="text-white w-8 h-8" />
                   </div>
                   <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">EduPulse Global Academy</h1>
                </div>
                <div className="h-1 bg-slate-900 w-full" />
                <h2 className="text-xl font-bold uppercase tracking-widest text-slate-600">Annual Progress Report - 2023-24</h2>
              </div>

              <div className="grid grid-cols-2 gap-8 mb-8 bg-slate-50 p-6 rounded-lg border border-slate-100">
                <div className="space-y-3">
                  <div className="flex justify-between border-b pb-1 border-slate-200">
                    <span className="text-slate-500 text-sm font-bold uppercase">Student Name:</span>
                    <span className="font-bold text-slate-900">{selectedStudent.name}</span>
                  </div>
                  <div className="flex justify-between border-b pb-1 border-slate-200">
                    <span className="text-slate-500 text-sm font-bold uppercase">Age:</span>
                    <span className="font-bold text-slate-900">{selectedStudent.age} Years</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between border-b pb-1 border-slate-200">
                    <span className="text-slate-500 text-sm font-bold uppercase">Standard:</span>
                    <span className="font-bold text-slate-900">{selectedStudent.academicStandard}</span>
                  </div>
                  <div className="flex justify-between border-b pb-1 border-slate-200">
                    <span className="text-slate-500 text-sm font-bold uppercase">Roll Number:</span>
                    <span className="font-bold text-slate-900">EP-{selectedStudent.id.toUpperCase()}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 overflow-hidden mb-8">
                <Table>
                  <TableHeader className="bg-slate-900">
                    <TableRow className="hover:bg-slate-900 border-none">
                      <TableHead className="text-white font-bold uppercase text-xs">Subject</TableHead>
                      <TableHead className="text-white font-bold uppercase text-xs text-center">Marks Obtained</TableHead>
                      <TableHead className="text-white font-bold uppercase text-xs text-center">Total Marks</TableHead>
                      <TableHead className="text-white font-bold uppercase text-xs text-right">Grade</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subjects.map((sub) => (
                      <TableRow key={sub.name} className="border-slate-100">
                        <TableCell className="font-bold text-slate-700">{sub.name}</TableCell>
                        <TableCell className="text-center font-medium">{sub.marks}</TableCell>
                        <TableCell className="text-center text-slate-400">{sub.total}</TableCell>
                        <TableCell className="text-right">
                          <Badge variant="outline" className="font-black border-primary/40 text-primary">
                            {sub.grade}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-12">
                <div className="bg-primary/5 p-4 rounded-lg text-center border border-primary/10">
                  <p className="text-xs font-bold text-slate-500 uppercase mb-1">Total Marks</p>
                  <p className="text-2xl font-black text-primary">{totalMarks} / {subjects.length * 100}</p>
                </div>
                <div className="bg-primary/5 p-4 rounded-lg text-center border border-primary/10">
                  <p className="text-xs font-bold text-slate-500 uppercase mb-1">Percentage</p>
                  <p className="text-2xl font-black text-primary">{percentage.toFixed(1)}%</p>
                </div>
                <div className="bg-primary/5 p-4 rounded-lg text-center border border-primary/10">
                  <p className="text-xs font-bold text-slate-500 uppercase mb-1">Final Grade</p>
                  <p className="text-2xl font-black text-primary">A+</p>
                </div>
              </div>

              <div className="flex justify-between items-end px-4">
                <div className="text-center space-y-2">
                  <div className="w-40 h-px bg-slate-300" />
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Class Teacher</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="w-40 h-px bg-slate-300" />
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Parent Signature</p>
                </div>
                <div className="text-center space-y-2">
                   <div className="w-16 h-16 border-2 border-slate-200 rounded-full mx-auto flex items-center justify-center opacity-30 rotate-12 mb-2">
                     <span className="text-[10px] font-black uppercase">School Seal</span>
                   </div>
                  <div className="w-40 h-px bg-slate-300" />
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Principal</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-24 border-2 border-dashed rounded-2xl bg-white/50">
            <GraduationCap className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
            <p className="text-muted-foreground font-medium">Please select a student to preview the report card.</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

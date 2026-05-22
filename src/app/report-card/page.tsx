
"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { useStudentStore } from "@/lib/student-store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Printer, Download, CheckCircle2, GraduationCap, UserCircle, BookOpen, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <GraduationCap className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">Student Examination Documents</h1>
          </div>
        </div>

        <Card className="print:hidden">
          <CardHeader>
            <CardTitle className="text-lg">Generate Student Records</CardTitle>
            <CardDescription>Select a student to view and print their Patrak F and Marksheet</CardDescription>
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
              Print All Documents
            </Button>
          </CardContent>
        </Card>

        {selectedStudent ? (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Toolbar */}
            <div className="flex items-center justify-between print:hidden">
              <div className="flex gap-4">
                 <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary px-4 py-1 font-bold">
                    PATRAK-F Ready
                 </Badge>
                 <Badge variant="outline" className="border-green-500/20 bg-green-50 text-green-600 px-4 py-1 font-bold">
                    MARKSHEET Ready
                 </Badge>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="font-bold gap-2">
                  <Download className="w-3.5 h-3.5" />
                  Export PDF
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-12">
              {/* PAGE 1: PATRAK-F */}
              <section className="bg-white p-10 border border-slate-200 shadow-2xl rounded-sm print:shadow-none print:border-none print:p-0 page-break-after">
                <div className="text-center space-y-4 mb-8">
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase border-b-4 border-slate-900 pb-2 inline-block">PATRAK - F</h1>
                  <h2 className="text-lg font-bold uppercase text-slate-600">Student Progress & Personality Development Record</h2>
                </div>

                <div className="grid grid-cols-3 gap-6 mb-8 border-2 border-slate-900 p-6 rounded-sm">
                   <div className="space-y-1">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Student Name</p>
                      <p className="font-bold text-slate-900 text-lg">{selectedStudent.name}</p>
                   </div>
                   <div className="space-y-1">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Standard / Class</p>
                      <p className="font-bold text-slate-900 text-lg">{selectedStudent.academicStandard}</p>
                   </div>
                   <div className="space-y-1">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Roll / ID Number</p>
                      <p className="font-bold text-slate-900 text-lg">EP-{selectedStudent.id.toUpperCase()}</p>
                   </div>
                </div>

                <div className="space-y-8">
                   <div>
                      <h3 className="text-sm font-black bg-slate-900 text-white px-4 py-1 mb-4 uppercase tracking-widest flex items-center gap-2">
                         <UserCircle className="w-4 h-4" /> Personal Development (Qualities)
                      </h3>
                      <Table className="border">
                        <TableHeader>
                           <TableRow className="bg-slate-50">
                              <TableHead className="font-bold text-xs uppercase">Quality / Trait</TableHead>
                              <TableHead className="font-bold text-xs uppercase text-center">First Half</TableHead>
                              <TableHead className="font-bold text-xs uppercase text-center">Second Half</TableHead>
                           </TableRow>
                        </TableHeader>
                        <TableBody>
                           {["Punctuality", "Cleanliness", "Social Behavior", "Leadership", "Confidence"].map((trait) => (
                             <TableRow key={trait}>
                                <TableCell className="font-medium">{trait}</TableCell>
                                <TableCell className="text-center font-bold text-primary">A</TableCell>
                                <TableCell className="text-center font-bold text-primary">A+</TableCell>
                             </TableRow>
                           ))}
                        </TableBody>
                      </Table>
                   </div>

                   <div>
                      <h3 className="text-sm font-black bg-slate-900 text-white px-4 py-1 mb-4 uppercase tracking-widest flex items-center gap-2">
                         <Star className="w-4 h-4" /> Co-Curricular Activities
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                         <div className="border p-4 rounded-sm space-y-2">
                            <p className="font-bold text-xs uppercase text-slate-400">Sports & Games</p>
                            <p className="font-medium text-slate-700">Excellent participation in annual athletic meet. Shows great teamwork.</p>
                            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Grade: A</Badge>
                         </div>
                         <div className="border p-4 rounded-sm space-y-2">
                            <p className="font-bold text-xs uppercase text-slate-400">Arts & Culture</p>
                            <p className="font-medium text-slate-700">Demonstrates talent in drawing and folk dance performances.</p>
                            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Grade: A+</Badge>
                         </div>
                      </div>
                   </div>

                   <div className="pt-10 flex justify-between">
                      <div className="text-center">
                         <div className="w-32 h-px bg-slate-400 mb-2" />
                         <p className="text-[10px] font-bold uppercase">Class Teacher</p>
                      </div>
                      <div className="text-center">
                         <div className="w-32 h-px bg-slate-400 mb-2" />
                         <p className="text-[10px] font-bold uppercase">Principal</p>
                      </div>
                   </div>
                </div>
              </section>

              {/* PAGE 2: MARKSHEET */}
              <section className="bg-white p-10 border border-slate-200 shadow-2xl rounded-sm print:shadow-none print:border-none print:p-0">
                <div className="text-center space-y-4 mb-8">
                  <div className="flex items-center justify-center gap-3">
                     <GraduationCap className="text-primary w-10 h-10" />
                     <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">EduPulse Global Academy</h1>
                  </div>
                  <div className="h-1.5 bg-slate-900 w-full" />
                  <h2 className="text-xl font-bold uppercase tracking-widest text-slate-600">Annual Academic Marksheet - 2023-24</h2>
                </div>

                <div className="grid grid-cols-2 gap-8 mb-8 bg-slate-50 p-6 rounded-sm border-l-8 border-primary">
                  <div className="space-y-3">
                    <div className="flex justify-between border-b pb-1 border-slate-200">
                      <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Student Name:</span>
                      <span className="font-bold text-slate-900 uppercase">{selectedStudent.name}</span>
                    </div>
                    <div className="flex justify-between border-b pb-1 border-slate-200">
                      <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Date of Birth:</span>
                      <span className="font-bold text-slate-900">Oct 12, 2012</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between border-b pb-1 border-slate-200">
                      <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Standard / Section:</span>
                      <span className="font-bold text-slate-900">{selectedStudent.academicStandard} - A</span>
                    </div>
                    <div className="flex justify-between border-b pb-1 border-slate-200">
                      <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Student ID:</span>
                      <span className="font-bold text-slate-900">EP-00{selectedStudent.id}</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-sm border-2 border-slate-900 overflow-hidden mb-8">
                  <Table>
                    <TableHeader className="bg-slate-900">
                      <TableRow className="hover:bg-slate-900 border-none">
                        <TableHead className="text-white font-black uppercase text-[10px] tracking-widest">Subject</TableHead>
                        <TableHead className="text-white font-black uppercase text-[10px] tracking-widest text-center">Internal (20)</TableHead>
                        <TableHead className="text-white font-black uppercase text-[10px] tracking-widest text-center">Terminal (80)</TableHead>
                        <TableHead className="text-white font-black uppercase text-[10px] tracking-widest text-center">Total (100)</TableHead>
                        <TableHead className="text-white font-black uppercase text-[10px] tracking-widest text-right">Grade</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {subjects.map((sub) => (
                        <TableRow key={sub.name} className="border-slate-200 h-12">
                          <TableCell className="font-bold text-slate-800">{sub.name}</TableCell>
                          <TableCell className="text-center font-medium">18</TableCell>
                          <TableCell className="text-center font-medium">{sub.marks - 18}</TableCell>
                          <TableCell className="text-center font-black text-primary">{sub.marks}</TableCell>
                          <TableCell className="text-right">
                            <span className="font-black text-slate-900 border-2 border-slate-900 px-2 py-0.5 rounded-sm">
                              {sub.grade}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="grid grid-cols-4 gap-4 mb-12">
                  <div className="bg-slate-900 text-white p-4 rounded-sm text-center">
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-1">Grand Total</p>
                    <p className="text-2xl font-black">{totalMarks}</p>
                  </div>
                  <div className="bg-slate-100 p-4 rounded-sm text-center border border-slate-200">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Percentage</p>
                    <p className="text-2xl font-black text-slate-900">{percentage.toFixed(1)}%</p>
                  </div>
                  <div className="bg-slate-100 p-4 rounded-sm text-center border border-slate-200">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Result</p>
                    <p className="text-2xl font-black text-green-600 uppercase">Passed</p>
                  </div>
                  <div className="bg-primary p-4 rounded-sm text-center text-white">
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-1">Final Grade</p>
                    <p className="text-2xl font-black">A+</p>
                  </div>
                </div>

                <div className="flex justify-between items-end px-4 mt-16">
                  <div className="text-center space-y-2">
                    <div className="w-32 h-px bg-slate-300" />
                    <p className="text-[9px] font-bold text-slate-400 uppercase">Class Teacher</p>
                  </div>
                  <div className="text-center space-y-2">
                     <div className="w-20 h-20 border-4 border-slate-100 rounded-full flex items-center justify-center opacity-20 rotate-12 mb-4">
                        <span className="text-[10px] font-black uppercase">School Seal</span>
                     </div>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="w-32 h-px bg-slate-300" />
                    <p className="text-[9px] font-bold text-slate-400 uppercase">Principal</p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        ) : (
          <div className="text-center py-32 border-2 border-dashed rounded-2xl bg-white/50">
            <GraduationCap className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-10" />
            <h3 className="text-xl font-bold text-slate-400">Generate Report Card</h3>
            <p className="text-muted-foreground font-medium">Select a student from the dropdown to start the process.</p>
          </div>
        )}
      </div>

      <style jsx global>{`
        @media print {
          body {
            background: white !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .print\\:hidden {
            display: none !important;
          }
          .page-break-after {
            page-break-after: always !important;
            margin-bottom: 0 !important;
            border: none !important;
          }
          main {
            padding: 0 !important;
            margin: 0 !important;
          }
          .max-w-5xl {
            max-width: 100% !important;
          }
        }
      `}</style>
    </MainLayout>
  );
}

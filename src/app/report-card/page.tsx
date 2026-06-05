
"use client";

import { useState, useMemo } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { useStudentStore } from "@/lib/student-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, GraduationCap, Layers, Users, Calendar, Printer, School, UserCircle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

export default function ReportCardPage() {
  const { students, isLoaded } = useStudentStore();
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [academicYear, setAcademicYear] = useState("2024-25");
  const [selectedStandard, setSelectedStandard] = useState("all");
  const [semester, setSemester] = useState("Semester 1");

  const standards = useMemo(() => {
    return Array.from(new Set(students.map(s => s.academicStandard))).sort();
  }, [students]);

  const filteredStudentsForSelection = useMemo(() => {
    return students.filter(s => selectedStandard === "all" || s.academicStandard === selectedStandard);
  }, [students, selectedStandard]);

  if (!isLoaded) return null;

  const handleToggleStudent = (id: string) => {
    setSelectedStudentIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedStudentIds.length === filteredStudentsForSelection.length) {
      setSelectedStudentIds([]);
    } else {
      setSelectedStudentIds(filteredStudentsForSelection.map(s => s.id));
    }
  };

  const activeReports = isBulkMode 
    ? students.filter(s => selectedStudentIds.includes(s.id))
    : (selectedStudentIds[0] ? [students.find(s => s.id === selectedStudentIds[0])!] : []);

  const mockSubjects = [
    { name: "Mathematics / ગણિત", marks: 0, grade: "-" },
    { name: "Science / વિજ્ઞાન", marks: 0, grade: "-" },
    { name: "English / અંગ્રેજી", marks: 0, grade: "-" },
    { name: "Social Studies / સા. વિજ્ઞાન", marks: 0, grade: "-" },
  ];

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto space-y-8 pb-20">
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-blue-900 p-8 rounded-3xl text-white shadow-2xl no-print">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Advanced Report Generation / રિપોર્ટ કાર્ડ</h1>
                <p className="text-indigo-100 text-sm font-medium mt-1">Generate professional progress reports for students</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20">
                <Calendar className="w-4 h-4 text-blue-200" />
                <Select value={academicYear} onValueChange={setAcademicYear}>
                  <SelectTrigger className="w-[110px] border-none shadow-none focus:ring-0 h-7 text-xs font-bold text-white">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2023-24">2023-24</SelectItem>
                    <SelectItem value="2024-25">2024-25</SelectItem>
                    <SelectItem value="2025-26">2025-26</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="bg-white/10 backdrop-blur-md px-2 py-1 rounded-xl border border-white/20">
                <Select value={semester} onValueChange={setSemester}>
                  <SelectTrigger className="w-[140px] border-none bg-transparent shadow-none focus:ring-0 h-10 text-xs font-bold text-white">
                    <SelectValue placeholder="Semester" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Semester 1">Semester 1 / સત્ર ૧</SelectItem>
                    <SelectItem value="Semester 2">Semester 2 / સત્ર ૨</SelectItem>
                    <SelectItem value="Annual">Annual / વાર્ષિક</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="outline" onClick={() => window.print()} className="bg-white/10 border-white/20 text-white hover:bg-white/20 font-bold h-10 px-6 rounded-xl">
                <Printer className="w-4 h-4 mr-2" />
                Print Reports
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <Card className="lg:col-span-1 border-none shadow-xl h-fit sticky top-8 no-print rounded-2xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold flex items-center gap-2 text-indigo-900">
                <Users className="w-5 h-5" />
                Selection / પસંદગી
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Filter Standard / ધોરણ</Label>
                <Select value={selectedStandard} onValueChange={(val) => {
                  setSelectedStandard(val);
                  setSelectedStudentIds([]);
                }}>
                  <SelectTrigger className="rounded-xl h-11">
                    <SelectValue placeholder="All Standards" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Standards / બધા ધોરણ</SelectItem>
                    {standards.map(std => (
                      <SelectItem key={std} value={std}>{std}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <Switch id="bulk-mode" checked={isBulkMode} onCheckedChange={(val) => {
                  setIsBulkMode(val);
                  if (!val && selectedStudentIds.length > 1) setSelectedStudentIds([selectedStudentIds[0]]);
                }} />
                <Label htmlFor="bulk-mode" className="text-sm font-bold cursor-pointer text-indigo-900">Bulk Mode / જથ્થાબંધ</Label>
              </div>

              <div className="pt-4 border-t space-y-4">
                {isBulkMode ? (
                  <>
                    <Button variant="outline" size="sm" className="w-full font-black rounded-xl border-indigo-100 text-indigo-700 hover:bg-indigo-50" onClick={handleSelectAll}>
                      {selectedStudentIds.length === filteredStudentsForSelection.length ? "Deselect All" : "Select All"}
                    </Button>
                    <div className="space-y-1 max-h-[400px] overflow-auto pr-2 custom-scrollbar">
                      {filteredStudentsForSelection.map(student => (
                        <div key={student.id} className="flex items-center space-x-3 p-2 rounded-xl hover:bg-indigo-50 transition-colors">
                          <Checkbox 
                            id={`s-${student.id}`} 
                            checked={selectedStudentIds.includes(student.id)}
                            onCheckedChange={() => handleToggleStudent(student.id)}
                            className="rounded-md"
                          />
                          <label htmlFor={`s-${student.id}`} className="text-xs font-bold cursor-pointer truncate text-slate-700">
                            {student.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Select Student / વિદ્યાર્થી</Label>
                    <Select value={selectedStudentIds[0] || ""} onValueChange={(val) => setSelectedStudentIds([val])}>
                      <SelectTrigger className="rounded-xl h-11">
                        <SelectValue placeholder="Select student..." />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredStudentsForSelection.map(s => (
                          <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="lg:col-span-3 space-y-8">
            <div className="space-y-8">
              {activeReports.length > 0 ? (
                activeReports.map((student) => {
                  const parts = [
                    { id: 'patrakc', title: 'PATRAK-C PERFORMANCE RECORD / પત્રક-સી પ્રગતિ પત્રક', pageNum: 1 },
                    { id: 'marksheet', title: 'MARKSHEET / ગુણપત્રક', pageNum: 2 }
                  ];

                  return (
                    <div key={student.id} className="flex flex-col gap-8 print:gap-0">
                      {parts.map((part) => (
                        <div 
                          key={`${student.id}-${part.id}`} 
                          className="bg-white p-12 border border-slate-200 shadow-2xl rounded-sm flex flex-col justify-between min-h-[900px] print:shadow-none print:border-black print:mb-0 print:page-break-after-always"
                        >
                          <div className="report-content">
                            <div className="text-center mb-10 space-y-2">
                              <h2 className="text-sm font-black text-indigo-600 uppercase tracking-[0.3em] mb-1">PATRAK-C / પત્રક-સી</h2>
                              <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">EduPulse Global Academy</h1>
                              <div className="flex items-center justify-center gap-4 text-[10px] font-black text-slate-500 uppercase tracking-widest print:text-black">
                                <span>Academic Year: {academicYear}</span>
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-300 print:bg-black" />
                                <span>Semester: {semester}</span>
                              </div>
                              <div className="flex items-center justify-between border-y-2 border-slate-900 py-2.5 mt-6 print:border-black">
                                <span className="text-xs font-black px-4">{part.title}</span>
                                <span className="text-xs font-black px-4">PAGE NO: {part.pageNum}</span>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-10 mb-10">
                              <div className="space-y-4">
                                <h3 className="text-[10px] font-black bg-slate-900 text-white px-3 py-1.5 uppercase rounded-sm inline-flex items-center gap-2 print:bg-black">
                                  <School className="w-3.5 h-3.5" /> School Detail
                                </h3>
                                <div className="bg-slate-50 p-5 rounded-xl space-y-3 border-l-4 border-slate-300 print:bg-white print:border-black shadow-sm">
                                  <div className="space-y-0.5">
                                    <p className="text-[8px] font-black text-slate-400 uppercase">School Name</p>
                                    <p className="text-[11px] font-black text-slate-800">EDUPULSE GLOBAL ACADEMY</p>
                                  </div>
                                  <div className="space-y-0.5">
                                    <p className="text-[8px] font-black text-slate-400 uppercase">School Index Number</p>
                                    <p className="text-[11px] font-black text-slate-800">SCH-IDX-998877</p>
                                  </div>
                                  <div className="space-y-0.5">
                                    <p className="text-[8px] font-black text-slate-400 uppercase">District / Block</p>
                                    <p className="text-[11px] font-black text-slate-800 uppercase">SPRINGFIELD / CENTRAL</p>
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-4">
                                <h3 className="text-[10px] font-black bg-indigo-900 text-white px-3 py-1.5 uppercase rounded-sm inline-flex items-center gap-2 print:bg-black">
                                  <UserCircle className="w-3.5 h-3.5" /> Student Detail
                                </h3>
                                <div className="bg-indigo-50/50 p-5 rounded-xl space-y-3 border-l-4 border-indigo-600 print:bg-white print:border-black shadow-sm">
                                  <div className="flex justify-between gap-4">
                                    <div className="space-y-0.5">
                                      <p className="text-[8px] font-black text-slate-400 uppercase">Full Name / નામ</p>
                                      <p className="text-[11px] font-black text-indigo-900 uppercase">{student.name}</p>
                                    </div>
                                    <div className="space-y-0.5 text-right">
                                      <p className="text-[8px] font-black text-slate-400 uppercase">Roll No</p>
                                      <p className="text-[11px] font-black text-indigo-900">{student.rollNumber}</p>
                                    </div>
                                  </div>
                                  <div className="flex justify-between gap-4">
                                    <div className="space-y-0.5">
                                      <p className="text-[8px] font-black text-slate-400 uppercase">Standard / ધોરણ</p>
                                      <p className="text-[11px] font-black text-indigo-900 uppercase">{student.academicStandard}</p>
                                    </div>
                                    <div className="space-y-0.5 text-right">
                                      <p className="text-[8px] font-black text-slate-400 uppercase">G.R. No</p>
                                      <p className="text-[11px] font-black text-indigo-900">{student.grNumber}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {part.id === 'patrakc' ? (
                              <div className="space-y-10">
                                <div className="space-y-4">
                                  <h3 className="text-[10px] font-black border-b-2 border-slate-900 pb-1.5 uppercase inline-block print:border-black">Qualities & Conduct / ગુણ અને વર્તણૂક</h3>
                                  <Table className="border-2 border-slate-200 text-xs print:border-black">
                                    <TableBody>
                                      {["Punctuality / સમયપાલન", "Cleanliness / સ્વચ્છતા", "Social Behavior / સામાજિક વર્તન", "Leadership / નેતૃત્વ", "Discipline / શિસ્ત"].map(t => (
                                        <TableRow key={t} className="h-11 border-slate-200 print:border-black">
                                          <TableCell className="py-2.5 font-bold text-slate-700 print:text-black print:border-black">{t}</TableCell>
                                          <TableCell className="py-2.5 text-center font-black text-indigo-700 text-sm print:text-black">A+</TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-8">
                                <Table className="border-2 border-slate-900 text-xs print:border-black">
                                  <TableHeader className="bg-slate-900 print:bg-white">
                                    <TableRow className="hover:bg-slate-900 border-none print:border-black">
                                      <TableHead className="text-white h-11 print:text-black print:border-black font-black uppercase text-[10px]">Subject / વિષય</TableHead>
                                      <TableHead className="text-white h-11 text-center print:text-black print:border-black font-black uppercase text-[10px]">Marks Obtain / ગુણ</TableHead>
                                      <TableHead className="text-white h-11 text-right print:text-black print:border-black font-black uppercase text-[10px]">Grade / ગ્રેડ</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {mockSubjects.map(sub => (
                                      <TableRow key={sub.name} className="h-11 border-slate-200 print:border-black">
                                        <TableCell className="py-2.5 font-bold text-slate-700 print:text-black print:border-black">{sub.name}</TableCell>
                                        <TableCell className="py-2.5 text-center font-black print:text-black print:border-black">{sub.marks}</TableCell>
                                        <TableCell className="py-2.5 text-right font-black text-indigo-700 print:text-black print:border-black">{sub.grade}</TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
                            )}
                          </div>

                          <div className="mt-20 flex justify-between px-6">
                            <div className="text-center space-y-2.5">
                              <div className="w-40 h-px bg-slate-300 mx-auto print:bg-black" />
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest print:text-black">Class Teacher / વર્ગ શિક્ષક</p>
                            </div>
                            <div className="text-center space-y-2.5">
                              <div className="w-40 h-px bg-slate-300 mx-auto print:bg-black" />
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest print:text-black">Principal / આચાર્ય</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })
              ) : (
                <div className="bg-white border-2 border-dashed rounded-3xl p-32 text-center shadow-sm">
                  <FileText className="w-16 h-16 text-slate-200 mx-auto mb-6" />
                  <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Select a student from the sidebar to preview report card</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

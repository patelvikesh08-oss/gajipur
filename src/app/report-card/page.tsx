
"use client";

import { useState, useMemo } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { useStudentStore } from "@/lib/student-store";
import { useReportCardConfigStore } from "@/lib/report-card-config-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GraduationCap, Users, Calendar, Printer, School, UserCircle, Layout, CheckCircle2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

export default function ReportCardPage() {
  const { students, isLoaded: studentsLoaded } = useStudentStore();
  const { config, isLoaded: configLoaded } = useReportCardConfigStore();
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

  if (!studentsLoaded || !configLoaded) return null;

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

  const resolveField = (fieldName: string, student: any) => {
    // Generate some deterministic mock scores based on student ID for consistency
    const getScore = (seed: string, factor: number) => {
      const charCode = seed.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
      return (charCode % 30) + 70; // Range 70-99
    };

    const data: Record<string, string | number> = {
      "{{student_name}}": student.name,
      "{{roll_number}}": student.rollNumber,
      "{{gr_number}}": student.grNumber,
      "{{standard}}": student.academicStandard,
      "{{academic_year}}": academicYear,
      "{{math_marks}}": getScore(student.id, 1),
      "{{sci_marks}}": getScore(student.id, 2),
      "{{eng_marks}}": getScore(student.id, 3),
      "{{social_marks}}": getScore(student.id, 4),
      "{{env_marks}}": getScore(student.id, 5),
      "{{guj_marks}}": getScore(student.id, 6),
      "{{hindi_marks}}": getScore(student.id, 7),
      "{{sans_marks}}": getScore(student.id, 8),
      "{{comp_marks}}": getScore(student.id, 9),
      "{{pt_marks}}": getScore(student.id, 10),
      "{{art_marks}}": getScore(student.id, 11),
      "{{music_marks}}": getScore(student.id, 12),
      "{{gk_marks}}": getScore(student.id, 13),
      "{{moral_marks}}": getScore(student.id, 14),
      "{{total_marks}}": 345,
      "{{percentage}}": "86%",
      "{{grade}}": "A+",
      "{{attendance}}": (student.attendance || 0) + "%"
    };
    return data[fieldName] || "";
  };

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
                <h1 className="text-3xl font-bold tracking-tight">Report Card Generation</h1>
                <p className="text-indigo-100 text-sm font-medium mt-1">Generate official student performance reports</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20">
                <Calendar className="w-4 h-4 text-blue-200" />
                <Select value={academicYear} onValueChange={setAcademicYear}>
                  <SelectTrigger className="w-[110px] border-none bg-transparent shadow-none focus:ring-0 h-7 text-xs font-bold text-white">
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
                Selection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {(config.templateUrlPage1 || config.templateUrlPage2) && (
                <Badge className="w-full bg-emerald-100 text-emerald-700 border-none py-2 justify-center gap-2 rounded-xl mb-2">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {config.templateUrlPage1 && config.templateUrlPage2 ? "Two-Page Layout Active" : "One-Page Layout Active"}
                </Badge>
              )}

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Filter Standard</Label>
                <Select value={selectedStandard} onValueChange={(val) => {
                  setSelectedStandard(val);
                  setSelectedStudentIds([]);
                }}>
                  <SelectTrigger className="rounded-xl h-11">
                    <SelectValue placeholder="All Standards" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Standards</SelectItem>
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
                <Label htmlFor="bulk-mode" className="text-sm font-bold cursor-pointer text-indigo-900">Bulk Mode</Label>
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
                    <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Select Student</Label>
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
                  const hasCustomTemplates = config.templateUrlPage1 || config.templateUrlPage2;

                  if (hasCustomTemplates) {
                    return (
                      <div key={student.id} className="flex flex-col gap-12">
                        {config.templateUrlPage1 && (
                          <div className="relative bg-white shadow-2xl rounded-sm overflow-hidden print:shadow-none min-h-[1000px] flex flex-col items-center print:page-break-after-always">
                            <div className="relative w-full">
                              <img src={config.templateUrlPage1} alt="Report Page 1" className="w-full h-auto" />
                              {config.fieldMappingsPage1.map((m) => (
                                <div key={m.field} style={{ left: `${m.x}%`, top: `${m.y}%`, position: 'absolute' }} className="transform -translate-x-1/2 -translate-y-1/2">
                                  <span className="font-bold text-slate-900 text-[10pt] whitespace-nowrap bg-white/40 px-1 rounded print:bg-transparent">
                                    {resolveField(m.field, student)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {config.templateUrlPage2 && (
                          <div className="relative bg-white shadow-2xl rounded-sm overflow-hidden print:shadow-none min-h-[1000px] flex flex-col items-center print:page-break-after-always">
                            <div className="relative w-full">
                              <img src={config.templateUrlPage2} alt="Report Page 2" className="w-full h-auto" />
                              {config.fieldMappingsPage2.map((m) => (
                                <div key={m.field} style={{ left: `${m.x}%`, top: `${m.y}%`, position: 'absolute' }} className="transform -translate-x-1/2 -translate-y-1/2">
                                  <span className="font-bold text-slate-900 text-[10pt] whitespace-nowrap bg-white/40 px-1 rounded print:bg-transparent">
                                    {resolveField(m.field, student)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  }

                  return (
                    <div key={student.id} className="bg-white p-12 border border-slate-200 shadow-2xl rounded-sm flex flex-col justify-between min-h-[900px] print:shadow-none print:border-black">
                      <div className="text-center space-y-4">
                        <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">{config.schoolName}</h1>
                        <h2 className="text-sm font-black text-indigo-600 uppercase tracking-[0.3em]">Official Performance Report</h2>
                        <div className="grid grid-cols-2 gap-10 mt-12 text-left">
                          <div className="bg-indigo-50/50 p-6 rounded-2xl border-l-4 border-indigo-600">
                            <p className="text-[10px] font-black text-indigo-400 uppercase">Student Name</p>
                            <p className="text-lg font-black text-slate-800">{student.name}</p>
                          </div>
                          <div className="bg-slate-50 p-6 rounded-2xl border-l-4 border-slate-400">
                            <p className="text-[10px] font-black text-slate-400 uppercase">G.R. Number</p>
                            <p className="text-lg font-black text-slate-800">{student.grNumber || "N/A"}</p>
                          </div>
                        </div>
                        <div className="mt-12">
                          <Table className="border-2">
                            <TableHeader className="bg-slate-900">
                              <TableRow>
                                <TableHead className="text-white font-black uppercase text-xs">Subject / વિષય</TableHead>
                                <TableHead className="text-white font-black uppercase text-xs text-center">Marks Obtain</TableHead>
                                <TableHead className="text-white font-black uppercase text-xs text-right">Grade</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              <TableRow className="h-12">
                                <TableCell className="font-bold">Mathematics / ગણિત</TableCell>
                                <TableCell className="text-center font-black">85</TableCell>
                                <TableCell className="text-right font-black text-indigo-700">A</TableCell>
                              </TableRow>
                              <TableRow className="h-12">
                                <TableCell className="font-bold">Science / વિજ્ઞાન</TableCell>
                                <TableCell className="text-center font-black">78</TableCell>
                                <TableCell className="text-right font-black text-indigo-700">B+</TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="bg-white border-2 border-dashed rounded-3xl p-32 text-center shadow-sm">
                  <Layout className="w-16 h-16 text-slate-200 mx-auto mb-6" />
                  <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Select a student to generate report card</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

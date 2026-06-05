
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
      <div className="max-w-6xl mx-auto space-y-8 pb-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <GraduationCap className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">Advanced Report Generation / રિપોર્ટ કાર્ડ</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border shadow-sm">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <Select value={academicYear} onValueChange={setAcademicYear}>
                <SelectTrigger className="w-[110px] border-none shadow-none focus:ring-0 h-7 text-xs font-bold">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2023-24">2023-24</SelectItem>
                  <SelectItem value="2024-25">2024-25</SelectItem>
                  <SelectItem value="2025-26">2025-26</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Select value={semester} onValueChange={setSemester}>
              <SelectTrigger className="w-[130px] bg-white font-bold text-xs h-10">
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
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <Card className="lg:col-span-1 border-none shadow-md h-fit sticky top-8 no-print">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Config / સેટિંગ્સ
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase text-muted-foreground">Filter Standard / ધોરણ</Label>
                <Select value={selectedStandard} onValueChange={(val) => {
                  setSelectedStandard(val);
                  setSelectedStudentIds([]);
                }}>
                  <SelectTrigger>
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
                <Label htmlFor="bulk-mode" className="text-sm font-bold cursor-pointer">Bulk Mode / જથ્થાબંધ</Label>
              </div>

              <div className="pt-4 border-t space-y-4">
                {isBulkMode ? (
                  <>
                    <Button variant="outline" size="sm" className="w-full font-bold" onClick={handleSelectAll}>
                      {selectedStudentIds.length === filteredStudentsForSelection.length ? "Deselect All / કાઢી નાખો" : "Select All / બધા પસંદ કરો"}
                    </Button>
                    <div className="space-y-2 max-h-[400px] overflow-auto pr-2 custom-scrollbar">
                      {filteredStudentsForSelection.map(student => (
                        <div key={student.id} className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted/50 transition-colors">
                          <Checkbox 
                            id={`s-${student.id}`} 
                            checked={selectedStudentIds.includes(student.id)}
                            onCheckedChange={() => handleToggleStudent(student.id)}
                          />
                          <label htmlFor={`s-${student.id}`} className="text-sm font-medium cursor-pointer truncate">
                            {student.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase text-muted-foreground tracking-widest">Select Student / વિદ્યાર્થી</Label>
                    <Select value={selectedStudentIds[0] || ""} onValueChange={(val) => setSelectedStudentIds([val])}>
                      <SelectTrigger>
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
              {activeReports.map((student) => {
                const parts = [
                  { id: 'patrakc', title: 'PATRAK-C PERFORMANCE RECORD / પત્રક-સી પ્રગતિ પત્રક', pageNum: 1 },
                  { id: 'marksheet', title: 'MARKSHEET / ગુણપત્રક', pageNum: 2 }
                ];

                return (
                  <div key={student.id} className="flex flex-col gap-8 print:gap-0">
                    {parts.map((part) => (
                      <div 
                        key={`${student.id}-${part.id}`} 
                        className="bg-white p-10 border border-slate-200 shadow-xl rounded-sm flex flex-col justify-between min-h-[800px] print:shadow-none print:border-black print:mb-0 print:page-break-after-always"
                      >
                        <div className="report-content">
                          <div className="text-center mb-8 space-y-2">
                            <h2 className="text-sm font-black text-primary uppercase tracking-[0.3em] mb-1">PATRAK-C / પત્રક-સી</h2>
                            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">EduPulse Global Academy</h1>
                            <div className="flex items-center justify-center gap-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest print:text-black">
                              <span>Academic Year: {academicYear}</span>
                              <span className="w-1 h-1 rounded-full bg-slate-300 print:bg-black" />
                              <span>Semester: {semester}</span>
                            </div>
                            <div className="flex items-center justify-between border-y-2 border-slate-900 py-1.5 mt-4 print:border-black">
                              <span className="text-xs font-black px-2">{part.title}</span>
                              <span className="text-xs font-black px-2">PAGE NO: {part.pageNum}</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-8 mb-8">
                            <div className="space-y-4">
                              <h3 className="text-[10px] font-black bg-slate-900 text-white px-3 py-1 uppercase rounded-sm inline-flex items-center gap-2 print:bg-black">
                                <School className="w-3 h-3" /> School Detail / શાળાની વિગત
                              </h3>
                              <div className="bg-slate-50 p-4 rounded-lg space-y-2 border-l-4 border-slate-300 print:bg-white print:border-black">
                                <div className="space-y-0.5">
                                  <p className="text-[8px] font-bold text-slate-400 uppercase">School Name</p>
                                  <p className="text-xs font-black text-slate-800">EDUPULSE GLOBAL ACADEMY</p>
                                </div>
                                <div className="space-y-0.5">
                                  <p className="text-[8px] font-bold text-slate-400 uppercase">School Index Number</p>
                                  <p className="text-xs font-black text-slate-800">SCH-IDX-998877</p>
                                </div>
                                <div className="space-y-0.5">
                                  <p className="text-[8px] font-bold text-slate-400 uppercase">District / Block</p>
                                  <p className="text-xs font-black text-slate-800">SPRINGFIELD / CENTRAL</p>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-4">
                              <h3 className="text-[10px] font-black bg-slate-900 text-white px-3 py-1 uppercase rounded-sm inline-flex items-center gap-2 print:bg-black">
                                <UserCircle className="w-3 h-3" /> Student Detail / વિદ્યાર્થીની વિગત
                              </h3>
                              <div className="bg-primary/5 p-4 rounded-lg space-y-2 border-l-4 border-primary print:bg-white print:border-black">
                                <div className="flex justify-between gap-4">
                                  <div className="space-y-0.5">
                                    <p className="text-[8px] font-bold text-slate-400 uppercase">Full Name / નામ</p>
                                    <p className="text-xs font-black text-slate-900 uppercase">{student.name}</p>
                                  </div>
                                  <div className="space-y-0.5 text-right">
                                    <p className="text-[8px] font-bold text-slate-400 uppercase">Roll No</p>
                                    <p className="text-xs font-black text-slate-900">{student.rollNumber}</p>
                                  </div>
                                </div>
                                <div className="flex justify-between gap-4">
                                  <div className="space-y-0.5">
                                    <p className="text-[8px] font-bold text-slate-400 uppercase">Standard / ધોરણ</p>
                                    <p className="text-xs font-black text-slate-900 uppercase">{student.academicStandard}</p>
                                  </div>
                                  <div className="space-y-0.5 text-right">
                                    <p className="text-[8px] font-bold text-slate-400 uppercase">G.R. No</p>
                                    <p className="text-xs font-black text-slate-900">{student.grNumber}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {part.id === 'patrakc' ? (
                            <div className="space-y-8">
                              <div className="space-y-3">
                                <h3 className="text-[10px] font-black border-b-2 border-slate-900 pb-1 uppercase inline-block print:border-black">Qualities & Conduct / ગુણ અને વર્તણૂક</h3>
                                <Table className="border text-xs print:border-black">
                                  <TableBody>
                                    {["Punctuality / સમયપાલન", "Cleanliness / સ્વચ્છતા", "Social Behavior / સામાજિક વર્તન", "Leadership / નેતૃત્વ", "Discipline / શિસ્ત"].map(t => (
                                      <TableRow key={t} className="h-10 print:border-black">
                                        <TableCell className="py-2 font-bold text-slate-700 print:text-black print:border-black">{t}</TableCell>
                                        <TableCell className="py-2 text-center font-black text-primary text-sm print:text-black">A+</TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-6">
                              <Table className="border-2 border-slate-900 text-xs print:border-black">
                                <TableHeader className="bg-slate-900 print:bg-white">
                                  <TableRow className="hover:bg-slate-900 border-none print:border-black">
                                    <TableHead className="text-white h-10 print:text-black print:border-black">Subject / વિષય</TableHead>
                                    <TableHead className="text-white h-10 text-center print:text-black print:border-black">Marks Obtain / ગુણ</TableHead>
                                    <TableHead className="text-white h-10 text-right print:text-black print:border-black">Grade / ગ્રેડ</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {mockSubjects.map(sub => (
                                    <TableRow key={sub.name} className="h-10 border-slate-200 print:border-black">
                                      <TableCell className="py-2 font-bold text-slate-700 print:text-black print:border-black">{sub.name}</TableCell>
                                      <TableCell className="py-2 text-center font-black print:text-black print:border-black">{sub.marks}</TableCell>
                                      <TableCell className="py-2 text-right font-black text-primary print:text-black print:border-black">{sub.grade}</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          )}
                        </div>

                        <div className="mt-16 flex justify-between px-4">
                          <div className="text-center space-y-2">
                            <div className="w-32 h-px bg-slate-300 mx-auto print:bg-black" />
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest print:text-black">Class Teacher / વર્ગ શિક્ષક</p>
                          </div>
                          <div className="text-center space-y-2">
                            <div className="w-32 h-px bg-slate-300 mx-auto print:bg-black" />
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest print:text-black">Principal / આચાર્ય</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

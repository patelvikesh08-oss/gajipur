"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { useStudentStore } from "@/lib/student-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, GraduationCap, Layers, Users } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

export default function ReportCardPage() {
  const { students, isLoaded } = useStudentStore();
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [twoInOne, setTwoInOne] = useState(true);

  if (!isLoaded) return null;

  const handleToggleStudent = (id: string) => {
    setSelectedStudentIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedStudentIds.length === students.length) {
      setSelectedStudentIds([]);
    } else {
      setSelectedStudentIds(students.map(s => s.id));
    }
  };

  const activeReports = isBulkMode 
    ? students.filter(s => selectedStudentIds.includes(s.id))
    : (selectedStudentIds[0] ? [students.find(s => s.id === selectedStudentIds[0])!] : []);

  const mockSubjects = [
    { name: "Mathematics", marks: 92, grade: "A+" },
    { name: "Science", marks: 88, grade: "A" },
    { name: "English", marks: 95, grade: "O" },
    { name: "Social Studies", marks: 84, grade: "A" },
    { name: "Environmental Studies", marks: 90, grade: "A+" },
  ];

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto space-y-8 pb-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <GraduationCap className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">Advanced Report Generation</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Configuration Sidebar */}
          <Card className="lg:col-span-1 border-none shadow-md h-fit sticky top-8">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-2">
                <Switch id="bulk-mode" checked={isBulkMode} onCheckedChange={(val) => {
                  setIsBulkMode(val);
                  if (!val && selectedStudentIds.length > 1) setSelectedStudentIds([selectedStudentIds[0]]);
                }} />
                <Label htmlFor="bulk-mode" className="text-sm font-bold cursor-pointer">Bulk Mode</Label>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <Switch id="two-in-one" checked={twoInOne} onCheckedChange={setTwoInOne} />
                <Label htmlFor="two-in-one" className="text-sm font-bold flex items-center gap-2 cursor-pointer">
                  <Layers className="w-4 h-4 text-primary" />
                  2-in-1 Layout
                </Label>
              </div>

              <div className="pt-4 border-t space-y-4">
                {isBulkMode ? (
                  <>
                    <Button variant="outline" size="sm" className="w-full font-bold" onClick={handleSelectAll}>
                      {selectedStudentIds.length === students.length ? "Deselect All" : "Select All"}
                    </Button>
                    <div className="space-y-2 max-h-[400px] overflow-auto pr-2 custom-scrollbar">
                      {students.map(student => (
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
                    <Label className="text-xs font-black uppercase text-muted-foreground tracking-widest">Select Student</Label>
                    <Select value={selectedStudentIds[0] || ""} onValueChange={(val) => setSelectedStudentIds([val])}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select student..." />
                      </SelectTrigger>
                      <SelectContent>
                        {students.map(s => (
                          <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Preview and Report Content */}
          <div className="lg:col-span-3 space-y-8">
            <div className="space-y-8">
              {activeReports.map((student) => {
                const parts = [
                  { id: 'patrakf', title: 'PATRAK - F', pageNum: 1 },
                  { id: 'marksheet', title: 'MARKSHEET', pageNum: 2 }
                ];

                return (
                  <div key={student.id} className="flex flex-col gap-8">
                    {parts.map((part) => (
                      <div 
                        key={`${student.id}-${part.id}`} 
                        className="bg-white p-10 border border-slate-200 shadow-xl rounded-sm flex flex-col justify-between min-h-[800px]"
                      >
                        <div className="report-content">
                          <div className="text-center mb-8 space-y-2">
                            <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">EduPulse Global Academy</h1>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Quarterly Performance Evaluation Record</p>
                            <div className="flex items-center justify-between border-y-2 border-slate-900 py-1.5 mt-4">
                              <span className="text-xs font-black px-2">{part.title}</span>
                              <span className="text-xs font-black px-2">PAGE NO: {part.pageNum}</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-6 mb-8 bg-slate-50 p-6 border-l-4 border-primary rounded-r-lg">
                            <div className="space-y-1">
                              <p className="text-[9px] font-bold text-slate-400 uppercase">Student Full Name</p>
                              <p className="text-sm font-black text-slate-900 uppercase">{student.name}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-[9px] font-bold text-slate-400 uppercase">Academic Standard</p>
                              <p className="text-sm font-black text-slate-900 uppercase">{student.academicStandard}</p>
                            </div>
                          </div>

                          {part.id === 'patrakf' ? (
                            <div className="space-y-8">
                              <div className="space-y-3">
                                <h3 className="text-[10px] font-black bg-slate-900 text-white px-3 py-1 uppercase rounded-sm inline-block">Personal Qualities & Conduct</h3>
                                <Table className="border text-xs">
                                  <TableBody>
                                    {["Punctuality", "Cleanliness", "Social Behavior", "Leadership Skill", "Discipline"].map(t => (
                                      <TableRow key={t} className="h-10">
                                        <TableCell className="py-2 font-bold text-slate-700">{t}</TableCell>
                                        <TableCell className="py-2 text-center font-black text-primary text-sm">A+</TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
                              <div className="space-y-3">
                                <h3 className="text-[10px] font-black bg-slate-900 text-white px-3 py-1 uppercase rounded-sm inline-block">Co-Curricular Observations</h3>
                                <div className="border p-4 rounded-md italic text-xs bg-slate-50 leading-relaxed text-slate-600">
                                  Shows keen interest in artistic expression and demonstrates consistent leadership in group activities. Highly collaborative and follows school values diligently.
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-6">
                              <Table className="border-2 border-slate-900 text-xs">
                                <TableHeader className="bg-slate-900">
                                  <TableRow className="hover:bg-slate-900 border-none">
                                    <TableHead className="text-white h-10">Academic Subject</TableHead>
                                    <TableHead className="text-white h-10 text-center">Marks Obtain</TableHead>
                                    <TableHead className="text-white h-10 text-right">Grade</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {mockSubjects.map(sub => (
                                    <TableRow key={sub.name} className="h-10 border-slate-200">
                                      <TableCell className="py-2 font-bold text-slate-700">{sub.name}</TableCell>
                                      <TableCell className="py-2 text-center font-black">{sub.marks}</TableCell>
                                      <TableCell className="py-2 text-right font-black text-primary">{sub.grade}</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-900 text-white p-4 text-center rounded-lg shadow-inner">
                                  <p className="text-[9px] font-bold opacity-70 mb-1 uppercase tracking-widest">Aggregate Marks</p>
                                  <p className="text-xl font-black">449 / 500</p>
                                </div>
                                <div className="bg-primary text-white p-4 text-center rounded-lg shadow-inner">
                                  <p className="text-[9px] font-bold opacity-70 mb-1 uppercase tracking-widest">Final Assessment</p>
                                  <p className="text-xl font-black uppercase">PASSED (A+)</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="mt-16 flex justify-between px-4">
                          <div className="text-center space-y-2">
                            <div className="w-32 h-px bg-slate-300 mx-auto" />
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Class Teacher</p>
                          </div>
                          <div className="text-center space-y-2">
                            <div className="w-32 h-px bg-slate-300 mx-auto" />
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Principal</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}

              {activeReports.length === 0 && (
                <div className="text-center py-40 border-2 border-dashed rounded-2xl bg-white/50">
                  <FileText className="w-20 h-20 text-muted-foreground mx-auto mb-6 opacity-10" />
                  <h3 className="text-xl font-bold text-slate-400">Select Students to Preview</h3>
                  <p className="text-muted-foreground font-medium max-w-xs mx-auto">Use the sidebar to choose individual students or enable Bulk Mode for class reports.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
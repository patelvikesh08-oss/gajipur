"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { useStudentStore, Student } from "@/lib/student-store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Printer, GraduationCap, Layers, Users } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export default function ReportCardPage() {
  const { students, isLoaded } = useStudentStore();
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [twoInOne, setTwoInOne] = useState(false);

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

  const handlePrint = () => {
    window.print();
  };

  const getStudentReports = () => {
    if (!isBulkMode) {
      const singleId = selectedStudentIds[0];
      const single = students.find(s => s.id === singleId);
      return single ? [single] : [];
    }
    return students.filter(s => selectedStudentIds.includes(s.id));
  };

  const activeReports = getStudentReports();

  const mockSubjects = [
    { name: "Mathematics", marks: 92, grade: "A+" },
    { name: "Science", marks: 88, grade: "A" },
    { name: "English", marks: 95, grade: "O" },
    { name: "Social Studies", marks: 84, grade: "A" },
    { name: "Environmental Studies", marks: 90, grade: "A+" },
  ];

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto space-y-8 pb-20 print:p-0 print:m-0 print:max-w-none print:w-full">
        <div className="flex items-center justify-between print:hidden">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <GraduationCap className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">Advanced Report Generation</h1>
          </div>
          
          <Button 
            disabled={selectedStudentIds.length === 0} 
            onClick={handlePrint}
            className="bg-primary hover:bg-primary/90 font-bold gap-2 shadow-lg shadow-primary/20 h-11"
          >
            <Printer className="w-4 h-4" />
            Print Selected ({selectedStudentIds.length})
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 print:block print:w-full">
          {/* Controls Panel - Selection and Settings */}
          <Card className="lg:col-span-1 border-none shadow-md h-fit sticky top-8 print:hidden">
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
                      {selectedStudentIds.length === students.length ? "Deselect All" : "Select All Students"}
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

          {/* Preview Panel */}
          <div className="lg:col-span-3 space-y-8 print:w-full print:m-0 print:p-0 print:block">
            {activeReports.length > 0 ? (
              <div className={`grid gap-12 print:block ${twoInOne && !isBulkMode ? "print:grid-cols-2 print:gap-0" : "grid-cols-1"}`}>
                {activeReports.map((student, index) => {
                  const isEvenStudent = index % 2 !== 0;
                  // Alternating page logic for specific bulk printing requirements
                  const parts = isEvenStudent && isBulkMode
                    ? [
                        { id: 'marksheet', title: 'MARKSHEET', pageNum: 2 },
                        { id: 'patrakf', title: 'PATRAK - F', pageNum: 1 }
                      ]
                    : [
                        { id: 'patrakf', title: 'PATRAK - F', pageNum: 1 },
                        { id: 'marksheet', title: 'MARKSHEET', pageNum: 2 }
                      ];

                  return (
                    <div key={student.id} className="contents print:block">
                      {parts.map((part) => (
                        <div key={`${student.id}-${part.id}`} className={`print-page bg-white p-10 border border-slate-200 shadow-xl rounded-sm mb-8 print:shadow-none print:border-none print:m-0 print:p-8 ${twoInOne ? "print:w-[50vw] print:h-[100vh] print:inline-block print:border-r print:border-slate-300" : "print:w-full print:h-[100vh] page-break-after"}`}>
                          
                          <div className="text-center mb-6 space-y-2">
                            <h1 className="text-xl font-black text-slate-900 uppercase tracking-tighter">EduPulse Global Academy</h1>
                            <div className="flex items-center justify-between border-y-2 border-slate-900 py-1">
                              <span className="text-[10px] font-black">{part.title}</span>
                              <span className="text-[10px] font-black">PAGE: {part.pageNum}</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 mb-6 bg-slate-50 p-4 border-l-4 border-primary">
                            <div className="text-[10px] font-bold">NAME: <span className="text-slate-900 uppercase ml-2">{student.name}</span></div>
                            <div className="text-[10px] font-bold">STD: <span className="text-slate-900 uppercase ml-2">{student.academicStandard}</span></div>
                          </div>

                          {part.id === 'patrakf' ? (
                            <div className="space-y-6">
                              <div className="space-y-2">
                                <h3 className="text-[9px] font-black bg-slate-900 text-white px-2 py-0.5 uppercase">Personal Qualities</h3>
                                <Table className="border text-[10px]">
                                  <TableBody>
                                    {["Punctuality", "Cleanliness", "Behavior", "Leadership"].map(t => (
                                      <TableRow key={t} className="h-8">
                                        <TableCell className="py-1 font-bold">{t}</TableCell>
                                        <TableCell className="py-1 text-center font-black text-primary">A+</TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
                              <div className="space-y-2">
                                <h3 className="text-[9px] font-black bg-slate-900 text-white px-2 py-0.5 uppercase">Co-Curricular</h3>
                                <div className="border p-3 rounded-sm italic text-[10px]">
                                  Active participation in all school events. Demonstrates excellent sportsmanship.
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              <Table className="border-2 border-slate-900 text-[10px]">
                                <TableHeader className="bg-slate-900">
                                  <TableRow className="hover:bg-slate-900 border-none">
                                    <TableHead className="text-white h-8">Subject</TableHead>
                                    <TableHead className="text-white h-8 text-center">Marks</TableHead>
                                    <TableHead className="text-white h-8 text-right">Grade</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {mockSubjects.map(sub => (
                                    <TableRow key={sub.name} className="h-8 border-slate-200">
                                      <TableCell className="py-1 font-bold">{sub.name}</TableCell>
                                      <TableCell className="py-1 text-center font-black">{sub.marks}</TableCell>
                                      <TableCell className="py-1 text-right font-black">{sub.grade}</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                              <div className="grid grid-cols-2 gap-2">
                                <div className="bg-slate-900 text-white p-2 text-center rounded-sm">
                                  <p className="text-[8px] opacity-70">TOTAL</p>
                                  <p className="text-sm font-black">449 / 500</p>
                                </div>
                                <div className="bg-primary text-white p-2 text-center rounded-sm">
                                  <p className="text-[8px] opacity-70">RESULT</p>
                                  <p className="text-sm font-black uppercase">Passed (A+)</p>
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="mt-12 flex justify-between px-2">
                            <div className="text-center">
                              <div className="w-20 h-px bg-slate-300 mb-1" />
                              <p className="text-[8px] font-bold text-slate-400">CLASS TEACHER</p>
                            </div>
                            <div className="text-center">
                              <div className="w-20 h-px bg-slate-300 mb-1" />
                              <p className="text-[8px] font-bold text-slate-400">PRINCIPAL</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-32 border-2 border-dashed rounded-2xl bg-white/50 print:hidden">
                <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-10" />
                <h3 className="text-xl font-bold text-slate-400">No Selection</h3>
                <p className="text-muted-foreground font-medium">Configure selections from the left panel to preview reports.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          aside, 
          [data-sidebar],
          header, 
          nav,
          [data-sidebar="trigger"],
          .print\\:hidden,
          .lg\\:col-span-1 {
            display: none !important;
          }

          html, body {
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            height: 100% !important;
            background: white !important;
          }

          main, 
          .mx-auto,
          [class*="SidebarInset"] {
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            max-width: none !important;
          }

          .print-page {
            box-shadow: none !important;
            border: none !important;
            margin: 0 !important;
            page-break-after: always !important;
          }

          ${twoInOne ? `
            @page {
              size: landscape;
              margin: 0;
            }
            .print-page {
              width: 50vw !important;
              height: 100vh !important;
              display: inline-block !important;
              border-right: 1px solid #eee !important;
              box-sizing: border-box;
              page-break-after: auto !important;
              padding: 40px !important;
            }
            .print-page:nth-child(2n) {
              page-break-after: always !important;
              border-right: none !important;
            }
          ` : `
            @page {
              size: portrait;
              margin: 0;
            }
          `}
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
      `}</style>
    </MainLayout>
  );
}


"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { useStudentStore } from "@/lib/student-store";
import { useSessionStore } from "@/lib/session-store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IdCard, FileText, Download, CheckCircle2, Calendar, Printer } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function BonofidePage() {
  const { students, isLoaded: studentsLoaded } = useStudentStore();
  const { academicYear, updateYear, isLoaded: sessionLoaded } = useSessionStore();
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");

  if (!studentsLoaded || !sessionLoaded) return null;

  const selectedStudent = students.find((s) => s.id === selectedStudentId);

  const handleDownload = () => {
    window.print();
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <IdCard className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">Bonofide Certificate / બોનાફાઇડ સર્ટીફિકેટ</h1>
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
          </div>
        </div>

        <Card className="no-print">
          <CardHeader>
            <CardTitle className="text-lg">Select Student / વિદ્યાર્થી પસંદ કરો</CardTitle>
            <CardDescription>Choose a student to generate a formal bonofide certificate for {academicYear}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1 space-y-2">
              <label className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Student Name / વિદ્યાર્થીનું નામ</label>
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
          </CardContent>
        </Card>

        {selectedStudent ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between no-print">
              <h2 className="text-xl font-headline font-bold flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Certificate Preview / પ્રિવ્યુ
              </h2>
              <div className="flex gap-2">
                <Button onClick={handleDownload} variant="default" size="sm" className="font-bold gap-2">
                  <Printer className="w-3.5 h-3.5" />
                  Print & Download / ડાઉનલોડ
                </Button>
                <Badge className="bg-green-500 font-bold flex gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Ready
                </Badge>
              </div>
            </div>

            <div className="relative bg-white p-12 border-8 border-double border-slate-200 shadow-2xl rounded-sm font-serif min-h-[700px] flex flex-col justify-between print:shadow-none print:border-black print:p-8">
              <div className="text-center space-y-6">
                <div className="space-y-2">
                  <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase">EduPulse Global Academy</h1>
                  <p className="text-sm font-sans font-bold text-slate-500 uppercase tracking-widest print:text-black">Academic Year {academicYear}</p>
                </div>
                <div className="h-px bg-slate-200 w-full print:bg-black" />
                <div className="py-8">
                  <span className="inline-block border-b-2 border-slate-900 px-8 py-2 text-2xl font-bold uppercase italic tracking-widest">Bonofide Certificate</span>
                </div>
                <div className="text-xl leading-[3.5rem] text-slate-700 text-left px-4 print:text-black">
                  This is to certify that <span className="font-bold border-b border-slate-400 px-4 text-slate-900 print:border-black">{selectedStudent.name}</span>, 
                  G.R. No. <span className="font-bold border-b border-slate-400 px-4 text-slate-900 print:border-black">{selectedStudent.grNumber || "N/A"}</span>, 
                  is a bonofide student of this school studying in the 
                  <span className="font-bold border-b border-slate-400 px-4 text-slate-900 print:border-black">{selectedStudent.academicStandard}</span> 
                  during the academic session <span className="font-bold">{academicYear}</span>. 
                  His/Her general conduct has been found to be <span className="font-bold border-b border-slate-400 px-4 text-slate-900 print:border-black">Satisfactory</span>.
                </div>
              </div>

              <div className="flex justify-between items-end px-4 mt-20">
                <div className="text-center space-y-1">
                  <div className="w-40 h-px bg-slate-400 print:bg-black" />
                  <p className="text-sm font-bold text-slate-500 uppercase print:text-black">Date / તારીખ</p>
                </div>
                <div className="text-center space-y-1">
                  <div className="w-40 h-px bg-slate-400 print:bg-black" />
                  <p className="text-sm font-bold text-slate-500 uppercase print:text-black">Principal Signature / આચાર્યની સહી</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-24 border-2 border-dashed rounded-2xl no-print">
            <IdCard className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
            <p className="text-muted-foreground font-medium">Please select a student to preview the certificate. / સર્ટીફિકેટ માટે વિદ્યાર્થી પસંદ કરો.</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}


"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { useStudentStore } from "@/lib/student-store";
import { useSessionStore } from "@/lib/session-store";
import { useSchoolStore } from "@/lib/school-store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IdCard, FileText, Calendar, Printer, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function BonofidePage() {
  const { students, isLoaded: studentsLoaded } = useStudentStore();
  const { academicYear, updateYear, isLoaded: sessionLoaded } = useSessionStore();
  const { school, isLoaded: schoolLoaded } = useSchoolStore();
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");

  if (!studentsLoaded || !sessionLoaded || !schoolLoaded) return null;

  const selectedStudent = students.find((s) => s.id === selectedStudentId);

  const handlePrint = () => {
    window.print();
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-8 pb-12">
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-blue-900 p-8 rounded-3xl text-white shadow-2xl no-print">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                <IdCard className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Bonofide Certificate / બોનાફાઇડ</h1>
                <p className="text-indigo-100 text-sm font-medium mt-1">Generate official proof of enrollment documents</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
              <Calendar className="w-4 h-4 text-blue-200" />
              <Select value={academicYear} onValueChange={(val: any) => updateYear(val)}>
                <SelectTrigger className="w-[120px] border-none bg-transparent shadow-none focus:ring-0 h-7 text-xs font-bold text-white">
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

        <Card className="no-print border-none shadow-xl rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-slate-800">Select Student / વિદ્યાર્થી પસંદ કરો</CardTitle>
            <CardDescription className="font-medium">Choose a student to generate a formal bonofide certificate</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-4 items-end pb-8">
            <div className="flex-1 space-y-2">
              <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-1">Student Name / નામ</label>
              <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
                <SelectTrigger className="h-12 rounded-xl">
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
              <h2 className="text-xl font-headline font-bold flex items-center gap-2 text-slate-700">
                <FileText className="w-5 h-5 text-indigo-600" />
                Certificate Preview / પ્રિવ્યુ
              </h2>
              <div className="flex gap-2">
                <Button onClick={handlePrint} variant="default" size="sm" className="bg-indigo-600 hover:bg-indigo-700 font-bold gap-2 px-6 shadow-lg shadow-indigo-200">
                  <Printer className="w-3.5 h-3.5" />
                  Print Document / પ્રિન્ટ
                </Button>
                <Badge className="bg-emerald-500 font-bold flex gap-1 px-3">
                  <CheckCircle2 className="w-3 h-3" /> Ready
                </Badge>
              </div>
            </div>

            {/* Certificate Content */}
            <div className="bg-white p-12 md:p-16 border-none shadow-none rounded-none font-serif min-h-[297mm] flex flex-col print:p-0 print:shadow-none print:w-full">
              
              {/* Letterhead Header */}
              <div className="text-center space-y-2 pb-6 border-b-2 border-black">
                <h1 className="text-4xl font-black text-black tracking-tight uppercase leading-none">{school.name}</h1>
                <div className="text-sm font-bold text-black uppercase tracking-widest">
                  <p>School Index No: {school.indexNumber} | District: {school.district} | Block: {school.block}</p>
                  <p className="mt-1">{school.address}</p>
                  <p>Mobile: {school.mobile}</p>
                </div>
              </div>

              {/* Photo Field & Date */}
              <div className="flex justify-between items-start mt-10 px-4">
                <div className="space-y-1">
                  <p className="text-lg font-bold text-black">Date / તારીખ: <span className="border-b border-dotted border-black px-4">{new Date().toLocaleDateString()}</span></p>
                </div>
                <div className="w-[3.5cm] h-[4.5cm] border-2 border-dashed border-gray-400 flex items-center justify-center text-center p-2 text-[10px] text-gray-400 uppercase leading-tight">
                  Paste<br/>Passport<br/>Size<br/>Photo
                </div>
              </div>

              {/* Certificate Title */}
              <div className="text-center py-12">
                <span className="inline-block border-b-2 border-black pb-2 px-8 text-3xl font-bold uppercase tracking-[0.2em] decoration-double underline-offset-8">
                  Bonofide Certificate
                </span>
              </div>

              {/* Certificate Body */}
              <div className="text-xl leading-[3.5rem] text-black text-justify px-4">
                This is to certify that <span className="font-bold border-b border-black px-4 mx-1">{selectedStudent.name}</span>, 
                son/daughter of <span className="font-bold border-b border-black px-4 mx-1">{selectedStudent.fatherName || "____________________"}</span>,
                G.R. No. <span className="font-bold border-b border-black px-4 mx-1">{selectedStudent.grNumber || "N/A"}</span>, 
                is a bonofide student of this school studying in the 
                <span className="font-bold border-b border-black px-4 mx-1">{selectedStudent.academicStandard}</span> 
                during the academic session <span className="font-bold mx-1">{academicYear}</span>. 
                His/Her date of birth recorded in the school register is <span className="font-bold border-b border-black px-4 mx-1">{selectedStudent.birthday}</span>.
                His/Her general conduct has been found to be <span className="font-bold border-b border-black px-4 mx-1">Satisfactory</span>.
              </div>

              {/* Signatures */}
              <div className="flex justify-between items-end px-4 mt-auto mb-20">
                <div className="text-center space-y-2">
                  <div className="w-44 h-px bg-black" />
                  <p className="text-sm font-bold text-black uppercase tracking-widest">Office Clerk / કારકુન</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="w-44 h-px bg-black" />
                  <p className="text-sm font-bold text-black uppercase tracking-widest">Principal / આચાર્ય</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-24 border-2 border-dashed rounded-3xl no-print bg-slate-50/50 border-slate-200">
            <IdCard className="w-16 h-16 text-slate-300 mx-auto mb-4 opacity-50" />
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Please select a student to preview certificate.</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

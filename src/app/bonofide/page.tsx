"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { useStudentStore, Student } from "@/lib/student-store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IdCard, Printer, FileText, Download, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function BonofidePage() {
  const { students, isLoaded } = useStudentStore();
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");

  if (!isLoaded) return null;

  const selectedStudent = students.find((s) => s.id === selectedStudentId);

  const handlePrint = () => {
    window.print();
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <IdCard className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">Bonofide Certificate</h1>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Select Student</CardTitle>
            <CardDescription>Choose a student to generate a formal bonofide certificate</CardDescription>
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
              Print Certificate
            </Button>
          </CardContent>
        </Card>

        {selectedStudent ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-headline font-bold flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Certificate Preview
              </h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="font-bold gap-2">
                  <Download className="w-3.5 h-3.5" />
                  PDF
                </Button>
                <Badge className="bg-green-500 font-bold flex gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Ready
                </Badge>
              </div>
            </div>

            {/* Certificate Template */}
            <div className="relative bg-white p-12 border-8 border-double border-slate-200 shadow-2xl rounded-sm font-serif min-h-[600px] flex flex-col justify-between print:border-none print:shadow-none print:p-0">
              <div className="text-center space-y-6">
                <div className="space-y-2">
                  <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase">EduPulse Global Academy</h1>
                  <p className="text-sm font-sans font-bold text-slate-500 uppercase tracking-widest">Affiliated with District Educational Board</p>
                </div>
                
                <div className="h-px bg-slate-200 w-full" />
                
                <div className="py-8">
                  <span className="inline-block border-b-2 border-slate-900 px-8 py-2 text-2xl font-bold uppercase italic tracking-widest">Bonofide Certificate</span>
                </div>

                <div className="text-xl leading-[3rem] text-slate-700 text-left px-4">
                  This is to certify that <span className="font-bold border-b border-slate-400 px-4 text-slate-900">{selectedStudent.name}</span>, 
                  age <span className="font-bold border-b border-slate-400 px-4 text-slate-900">{selectedStudent.age}</span>, 
                  is a bonofide student of this school studying in the 
                  <span className="font-bold border-b border-slate-400 px-4 text-slate-900">{selectedStudent.academicStandard}</span>. 
                  His/Her general conduct during the academic period has been found to be <span className="font-bold border-b border-slate-400 px-4 text-slate-900">Satisfactory</span>.
                  <br /><br />
                  He/She bears a good moral character.
                </div>
              </div>

              <div className="flex justify-between items-end px-4 mt-20">
                <div className="text-center space-y-1">
                  <div className="w-40 h-px bg-slate-400" />
                  <p className="text-sm font-bold text-slate-500 uppercase">Date</p>
                </div>
                <div className="text-center space-y-1">
                  <div className="w-40 h-px bg-slate-400" />
                  <p className="text-sm font-bold text-slate-500 uppercase">Principal Signature</p>
                </div>
              </div>
              
              {/* Decorative Corner Elements */}
              <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-slate-300" />
              <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-slate-300" />
              <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-slate-300" />
              <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-slate-300" />
            </div>
          </div>
        ) : (
          <div className="text-center py-24 border-2 border-dashed rounded-2xl">
            <IdCard className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
            <p className="text-muted-foreground font-medium">Please select a student to preview the certificate.</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

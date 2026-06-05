
"use client";

import { useState, useEffect, useCallback } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { useMarksMappingStore, AssessmentType } from "@/lib/marks-mapping-store";
import { useStudentStore } from "@/lib/student-store";
import { useSessionStore } from "@/lib/session-store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, Calendar, Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const ACADEMIC_STANDARDS = [
  { id: "Balvatika", label: "Balvatika / બાલવાટિકા" },
  { id: "1st Standard", label: "1st Standard / ધોરણ ૧" },
  { id: "2nd Standard", label: "2nd Standard / ધોરણ ૨" },
  { id: "3rd Standard", label: "3rd Standard / ધોરણ ૩" },
  { id: "4th Standard", label: "4th Standard / ધોરણ ૪" },
  { id: "5th Standard", label: "5th Standard / ધોરણ ૫" },
  { id: "6th Standard", label: "6th Standard / ધોરણ ૬" },
  { id: "7th Standard", label: "7th Standard / ધોરણ ૭" },
  { id: "8th Standard", label: "8th Standard / ધોરણ ૮" },
];

export default function MarksMappingPage() {
  const { saveMarksMapping, getMarksFor, isLoaded: marksLoaded } = useMarksMappingStore();
  const { students, isLoaded: studentsLoaded } = useStudentStore();
  const { academicYear, semester, updateYear, updateSemester, isLoaded: sessionLoaded } = useSessionStore();
  
  const [selectedStandard, setSelectedStandard] = useState("");
  const [localMarks, setLocalMarks] = useState<Record<AssessmentType, string>>({
    'TRIMASIK': '',
    'SVADHYAY': '',
    'PAT/SAT': '',
    'PATRAK-B': ''
  });

  useEffect(() => {
    if (semester === 'Annual') {
      updateSemester('Semester 1');
    }
  }, [semester, updateSemester]);

  useEffect(() => {
    if (selectedStandard && marksLoaded && semester !== 'Annual') {
      setLocalMarks({
        'TRIMASIK': getMarksFor(selectedStandard, semester, 'TRIMASIK').toString(),
        'SVADHYAY': getMarksFor(selectedStandard, semester, 'SVADHYAY').toString(),
        'PAT/SAT': getMarksFor(selectedStandard, semester, 'PAT/SAT').toString(),
        'PATRAK-B': getMarksFor(selectedStandard, semester, 'PATRAK-B').toString()
      });
    }
  }, [selectedStandard, semester, marksLoaded, getMarksFor]);

  if (!marksLoaded || !studentsLoaded || !sessionLoaded) return null;

  const assessmentTypes: AssessmentType[] = ['TRIMASIK', 'SVADHYAY', 'PAT/SAT', 'PATRAK-B'];

  const handleSaveAll = () => {
    if (!selectedStandard) {
      toast({ title: "Please select a standard / કૃપા કરીને ધોરણ પસંદ કરો", variant: "destructive" });
      return;
    }

    let hasErrors = false;
    assessmentTypes.forEach(type => {
      const val = parseInt(localMarks[type]);
      if (!isNaN(val)) {
        saveMarksMapping(selectedStandard, semester, type, val);
      } else {
        hasErrors = true;
      }
    });

    if (!hasErrors) {
      toast({
        title: "Configuration Saved / ગોઠવણી સાચવવામાં આવી",
        description: `Assessment thresholds for ${selectedStandard} updated successfully.`,
      });
    } else {
      toast({
        title: "Partial Save / અધૂરું સેવ",
        description: "Some values were invalid and were not saved. Please check your inputs.",
        variant: "destructive"
      });
    }
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-gradient-to-r from-indigo-900 via-purple-800 to-indigo-900 p-8 rounded-3xl text-white shadow-2xl no-print">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                <Calculator className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Marks Mapping / ગુણ મેપિંગ</h1>
                <p className="text-indigo-100 text-sm font-medium mt-1">Define maximum marks for each assessment type</p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20">
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
              <div className="bg-white/10 backdrop-blur-md px-2 py-1 rounded-xl border border-white/20">
                <Select value={semester === 'Annual' ? 'Semester 1' : semester} onValueChange={(val: any) => updateSemester(val)}>
                  <SelectTrigger className="w-[140px] border-none bg-transparent shadow-none focus:ring-0 h-10 text-xs font-bold text-white">
                    <SelectValue placeholder="Semester" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Semester 1">Semester 1 / સત્ર ૧</SelectItem>
                    <SelectItem value="Semester 2">Semester 2 / સત્ર ૨</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <Card className="rounded-2xl shadow-xl border-none overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b">
            <CardTitle className="text-lg font-bold text-slate-800">Standard Configuration / ધોરણ ગોઠવણી</CardTitle>
            <CardDescription className="font-medium">Select a standard to configure its assessment thresholds.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-1">Academic Standard / શૈક્ષણિક ધોરણ</Label>
              <Select value={selectedStandard} onValueChange={setSelectedStandard}>
                <SelectTrigger className="h-12 rounded-xl">
                  <SelectValue placeholder="Select a standard... / ધોરણ પસંદ કરો..." />
                </SelectTrigger>
                <SelectContent>
                  {ACADEMIC_STANDARDS.map(std => (
                    <SelectItem key={std.id} value={std.id}>{std.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {selectedStandard ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {assessmentTypes.map((type) => (
                <Card key={type} className="border-none shadow-xl rounded-2xl overflow-hidden group hover:scale-[1.02] transition-all">
                  <CardHeader className="pb-2 bg-indigo-50/50 border-b">
                    <CardTitle className="text-xs font-black uppercase tracking-widest text-indigo-700">{type}</CardTitle>
                    <CardDescription className="text-[10px] font-bold">Max {type === 'SVADHYAY' ? 'Units' : 'Marks'}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-6">
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <Input 
                          type="number" 
                          placeholder="e.g. 100" 
                          value={localMarks[type]}
                          onChange={(e) => setLocalMarks({...localMarks, [type]: e.target.value})}
                          className="font-black text-xl h-14 rounded-xl border-slate-100 bg-slate-50/50 focus:bg-white transition-colors"
                        />
                      </div>
                      <div className="flex items-center px-6 bg-indigo-50 rounded-xl text-[10px] font-black uppercase tracking-widest text-indigo-400">
                        {type === 'SVADHYAY' ? 'Units' : 'Max'}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-end pt-4">
              <Button 
                onClick={handleSaveAll} 
                size="lg" 
                className="font-black px-12 h-14 rounded-xl bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-100"
              >
                <Check className="w-5 h-5 mr-2" />
                Save Mapping / ગોઠવણી સાચવો
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-32 border-2 border-dashed rounded-3xl bg-white/50 border-slate-200">
            <Calculator className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Please select an academic standard to edit mapping</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

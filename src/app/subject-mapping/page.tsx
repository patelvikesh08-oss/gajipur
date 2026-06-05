
"use client";

import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { useSubjectStore } from "@/lib/subject-store";
import { useStudentStore } from "@/lib/student-store";
import { useSessionStore } from "@/lib/session-store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Layers, Plus, Trash2, Check, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

const AVAILABLE_SUBJECTS = [
  "Mathematics / ગણિત", "Science / વિજ્ઞાન", "English / અંગ્રેજી", "Social Studies / સા. વિજ્ઞાન", "Environmental Studies / પર્યાવરણ",
  "Gujarati / ગુજરાતી", "Hindi / હિન્દી", "Sanskrit / સંસ્કૃત", "Computer Science / કમ્પ્યુટર", "Physical Education / પી.ટી.",
  "Art & Craft / ચિત્ર-કલા", "Music / સંગીત", "General Knowledge / સામાન્ય જ્ઞાન", "Moral Science / નીતિશિક્ષણ"
];

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

export default function SubjectMappingPage() {
  const { mappings, saveMapping, isLoaded: subjectsLoaded } = useSubjectStore();
  const { students, isLoaded: studentsLoaded } = useStudentStore();
  const { academicYear, semester, updateYear, updateSemester, isLoaded: sessionLoaded } = useSessionStore();
  
  const [selectedStandard, setSelectedStandard] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [currentSubjects, setCurrentSubjects] = useState<string[]>([]);

  useEffect(() => {
    if (semester === 'Annual') {
      updateSemester('Semester 1');
    }
  }, [semester, updateSemester]);

  useEffect(() => {
    if (selectedStandard && subjectsLoaded && semester !== 'Annual') {
      const existing = mappings.find(m => m.standard === selectedStandard && m.semester === semester);
      setCurrentSubjects(existing ? existing.subjects : []);
    }
  }, [selectedStandard, semester, mappings, subjectsLoaded]);

  if (!subjectsLoaded || !studentsLoaded || !sessionLoaded) return null;

  const addSubject = () => {
    if (!selectedSubject) return;
    if (currentSubjects.includes(selectedSubject)) {
      toast({ title: "Subject already added", variant: "destructive" });
      return;
    }
    setCurrentSubjects([...currentSubjects, selectedSubject]);
    setSelectedSubject("");
  };

  const removeSubject = (subject: string) => {
    setCurrentSubjects(currentSubjects.filter(s => s !== subject));
  };

  const handleSave = () => {
    if (!selectedStandard) {
      toast({ title: "Please select a standard", variant: "destructive" });
      return;
    }
    saveMapping(selectedStandard, semester, currentSubjects);
    toast({
      title: "Mapping Saved / મેપિંગ સાચવવામાં આવ્યું",
      description: `Subjects updated for ${selectedStandard} in ${semester}`,
    });
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-8 pb-12">
        <div className="bg-gradient-to-r from-indigo-900 via-purple-800 to-indigo-900 p-8 rounded-3xl text-white shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                <Layers className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Subject Mapping / વિષય મેપિંગ</h1>
                <p className="text-indigo-100 text-sm font-medium mt-1">Configure curriculum for standard and semester</p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
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

        <Card className="border-none shadow-xl rounded-2xl overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b">
            <CardTitle className="text-lg font-bold text-slate-800">Curriculum Configuration</CardTitle>
            <CardDescription className="font-medium">Map subjects for a specific standard and semester.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Academic Standard / ધોરણ</Label>
                <Select value={selectedStandard} onValueChange={setSelectedStandard}>
                  <SelectTrigger className="h-12 rounded-xl">
                    <SelectValue placeholder="Select a standard..." />
                  </SelectTrigger>
                  <SelectContent>
                    {ACADEMIC_STANDARDS.map(std => (
                      <SelectItem key={std.id} value={std.id}>{std.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Active Mapping Target</Label>
                <div className="w-full h-12 flex items-center justify-center bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-xl font-black text-sm uppercase">
                  {semester === 'Annual' ? 'Semester 1' : semester}
                </div>
              </div>
            </div>

            {selectedStandard && (
              <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300 pt-6 border-t">
                <div className="flex items-end gap-3">
                  <div className="flex-1 space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Add Subject / વિષય ઉમેરો</Label>
                    <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                      <SelectTrigger className="h-12 rounded-xl">
                        <SelectValue placeholder="Choose a subject..." />
                      </SelectTrigger>
                      <SelectContent>
                        {AVAILABLE_SUBJECTS.map(sub => (
                          <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={addSubject} disabled={!selectedSubject} size="icon" className="h-12 w-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 shadow-lg">
                    <Plus className="w-5 h-5" />
                  </Button>
                </div>

                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-1">
                    Mapped Subjects / મેપ કરેલ વિષયો
                  </Label>
                  <div className="flex flex-wrap gap-3 min-h-[160px] p-6 border-2 border-dashed rounded-2xl bg-slate-50/50 border-slate-200">
                    {currentSubjects.map(sub => (
                      <Badge key={sub} className="px-4 py-2 text-sm bg-white text-indigo-900 border border-indigo-100 flex items-center gap-3 group shadow-sm rounded-xl">
                        {sub}
                        <button onClick={() => removeSubject(sub)} className="text-slate-300 hover:text-rose-500 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </Badge>
                    ))}
                    {currentSubjects.length === 0 && (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 text-sm font-medium italic gap-2">
                        <Layers className="w-8 h-8 opacity-20" />
                        No subjects mapped yet for this selection.
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700 text-white font-black px-12 h-12 rounded-xl shadow-xl shadow-indigo-100">
                    <Check className="w-5 h-5 mr-2" />
                    Save Configuration
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}

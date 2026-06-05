
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

  // Update current subjects when standard or semester changes
  useEffect(() => {
    if (selectedStandard && subjectsLoaded) {
      const existing = mappings.find(m => m.standard === selectedStandard && m.semester === semester);
      setCurrentSubjects(existing ? existing.subjects : []);
    }
  }, [selectedStandard, semester, mappings, subjectsLoaded]);

  if (!subjectsLoaded || !studentsLoaded || !sessionLoaded) return null;

  const addSubject = () => {
    if (!selectedSubject) return;
    if (currentSubjects.includes(selectedSubject)) {
      toast({ title: "Subject already added / વિષય પહેલાથી જ ઉમેરાયેલ છે", variant: "destructive" });
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
      toast({ title: "Please select a standard / કૃપા કરીને ધોરણ પસંદ કરો", variant: "destructive" });
      return;
    }
    saveMapping(selectedStandard, semester, currentSubjects);
    toast({
      title: "Mapping Saved / મેપિંગ સાચવવામાં આવ્યું",
      description: `Subjects updated for ${selectedStandard} in ${semester} (${academicYear})`,
    });
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Layers className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">Subject Mapping / વિષય મેપિંગ</h1>
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
            <Select value={semester} onValueChange={(val: any) => updateSemester(val)}>
              <SelectTrigger className="w-[140px] bg-white font-bold text-xs h-10 shadow-sm">
                <SelectValue placeholder="Semester" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Semester 1">Semester 1 / સત્ર ૧</SelectItem>
                <SelectItem value="Semester 2">Semester 2 / સત્ર ૨</SelectItem>
                <SelectItem value="Annual">Annual / વાર્ષિક</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Curriculum Configuration / અભ્યાસક્રમ ગોઠવણી</CardTitle>
            <CardDescription>Map subjects for a specific standard and semester. / ચોક્કસ ધોરણ અને સત્ર માટે વિષયો સેટ કરો.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Academic Standard / શૈક્ષણિક ધોરણ</Label>
                <Select value={selectedStandard} onValueChange={setSelectedStandard}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a standard... / ધોરણ પસંદ કરો..." />
                  </SelectTrigger>
                  <SelectContent>
                    {ACADEMIC_STANDARDS.map(std => (
                      <SelectItem key={std.id} value={std.id}>{std.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Mapping for Semester / સત્ર માટે મેપિંગ</Label>
                <Badge className="w-full h-10 justify-center bg-muted text-foreground hover:bg-muted border-none font-bold">
                  {semester}
                </Badge>
              </div>
            </div>

            {selectedStandard && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300 pt-4 border-t">
                <div className="flex items-end gap-2">
                  <div className="flex-1 space-y-2">
                    <Label>Add Subject / વિષય ઉમેરો</Label>
                    <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a subject to add... / વિષય પસંદ કરો..." />
                      </SelectTrigger>
                      <SelectContent>
                        {AVAILABLE_SUBJECTS.map(sub => (
                          <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={addSubject} disabled={!selectedSubject} size="icon">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-3">
                  <Label className="text-xs font-bold uppercase text-muted-foreground tracking-widest">
                    Mapped Subjects / મેપ કરેલ વિષયો ({semester})
                  </Label>
                  <div className="flex flex-wrap gap-2 min-h-[120px] p-4 border-2 border-dashed rounded-xl bg-muted/20">
                    {currentSubjects.map(sub => (
                      <Badge key={sub} variant="secondary" className="px-3 py-1 text-sm flex items-center gap-2 group">
                        {sub}
                        <button onClick={() => removeSubject(sub)} className="text-muted-foreground hover:text-destructive">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </Badge>
                    ))}
                    {currentSubjects.length === 0 && (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm font-medium italic">
                        No subjects mapped yet for this selection. / આ પસંદગી માટે હજી સુધી કોઈ વિષયો મેપ થયા નથી.
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button onClick={handleSave} className="font-bold px-8 shadow-lg shadow-primary/20">
                    <Check className="w-4 h-4 mr-2" />
                    Save Configuration / ગોઠવણી સાચવો
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

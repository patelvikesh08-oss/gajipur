
"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { useSubjectStore } from "@/lib/subject-store";
import { useStudentStore } from "@/lib/student-store";
import { useSessionStore } from "@/lib/session-store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Layers, Plus, Trash2, Check, Book, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

const AVAILABLE_SUBJECTS = [
  "Mathematics", "Science", "English", "Social Studies", "Environmental Studies",
  "Gujarati", "Hindi", "Sanskrit", "Computer Science", "Physical Education",
  "Art & Craft", "Music", "General Knowledge", "Moral Science"
];

export default function SubjectMappingPage() {
  const { mappings, saveMapping, deleteMapping, isLoaded: subjectsLoaded } = useSubjectStore();
  const { students, isLoaded: studentsLoaded } = useStudentStore();
  const { academicYear, updateYear, isLoaded: sessionLoaded } = useSessionStore();
  
  const [selectedStandard, setSelectedStandard] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [currentSubjects, setCurrentSubjects] = useState<string[]>([]);

  if (!subjectsLoaded || !studentsLoaded || !sessionLoaded) return null;

  const standards = Array.from(new Set(students.map(s => s.academicStandard))).sort();

  const handleStandardChange = (val: string) => {
    setSelectedStandard(val);
    const existing = mappings.find(m => m.standard === val);
    setCurrentSubjects(existing ? existing.subjects : []);
    setSelectedSubject("");
  };

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
    saveMapping(selectedStandard, currentSubjects);
    toast({
      title: "Mapping Saved",
      description: `Subjects updated for ${selectedStandard} (${academicYear})`,
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
            <h1 className="text-2xl font-bold text-slate-800">Subject Mapping</h1>
          </div>
          
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Curriculum Configuration</CardTitle>
              <CardDescription>Mapping subjects for the session {academicYear}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Select Academic Standard</Label>
                <Select value={selectedStandard} onValueChange={handleStandardChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a standard..." />
                  </SelectTrigger>
                  <SelectContent>
                    {standards.map(std => (
                      <SelectItem key={std} value={std}>{std}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedStandard && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex items-end gap-2">
                    <div className="flex-1 space-y-2">
                      <Label>Add Subject</Label>
                      <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a subject..." />
                        </SelectTrigger>
                        <SelectContent>
                          {AVAILABLE_SUBJECTS.map(sub => (
                            <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={addSubject} disabled={!selectedSubject}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-xs font-bold uppercase text-muted-foreground">Active Subjects for {selectedStandard}</Label>
                    <div className="flex flex-wrap gap-2 min-h-[120px] p-4 border-2 border-dashed rounded-xl bg-muted/20">
                      {currentSubjects.map(sub => (
                        <Badge key={sub} variant="secondary" className="px-3 py-1 text-sm flex items-center gap-2 group">
                          {sub}
                          <button onClick={() => removeSubject(sub)} className="text-muted-foreground hover:text-destructive">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button onClick={handleSave} className="w-full font-bold shadow-lg shadow-primary/20">
                    <Check className="w-4 h-4 mr-2" />
                    Save Configuration
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}

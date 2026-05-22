
"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { useSubjectStore } from "@/lib/subject-store";
import { useStudentStore } from "@/lib/student-store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Layers, Plus, Trash2, Check, Book } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

export default function SubjectMappingPage() {
  const { mappings, saveMapping, deleteMapping, isLoaded: subjectsLoaded } = useSubjectStore();
  const { students, isLoaded: studentsLoaded } = useStudentStore();
  
  const [selectedStandard, setSelectedStandard] = useState("");
  const [newSubject, setNewSubject] = useState("");
  const [currentSubjects, setCurrentSubjects] = useState<string[]>([]);

  if (!subjectsLoaded || !studentsLoaded) return null;

  // Get unique standards from student data
  const standards = Array.from(new Set(students.map(s => s.academicStandard))).sort();

  const handleStandardChange = (val: string) => {
    setSelectedStandard(val);
    const existing = mappings.find(m => m.standard === val);
    setCurrentSubjects(existing ? existing.subjects : []);
  };

  const addSubject = () => {
    if (!newSubject.trim()) return;
    if (currentSubjects.includes(newSubject.trim())) {
      toast({ title: "Subject already exists", variant: "destructive" });
      return;
    }
    setCurrentSubjects([...currentSubjects, newSubject.trim()]);
    setNewSubject("");
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
      description: `Subjects updated for ${selectedStandard}`,
    });
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Layers className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Subject Mapping Configuration</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Configuration Card */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Standard to Subject Map</CardTitle>
              <CardDescription>Assign specific academic subjects to different grade levels</CardDescription>
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
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Label htmlFor="subject">Add Subject</Label>
                      <Input 
                        id="subject" 
                        value={newSubject} 
                        onChange={(e) => setNewSubject(e.target.value)}
                        placeholder="e.g. Mathematics"
                        onKeyDown={(e) => e.key === 'Enter' && addSubject()}
                      />
                    </div>
                    <Button onClick={addSubject} className="mt-6">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <Label>Active Subjects for {selectedStandard}</Label>
                    <div className="flex flex-wrap gap-2 min-h-[100px] p-4 border-2 border-dashed rounded-xl bg-muted/20">
                      {currentSubjects.map(sub => (
                        <Badge key={sub} variant="secondary" className="px-3 py-1 text-sm flex items-center gap-2 group">
                          {sub}
                          <button onClick={() => removeSubject(sub)} className="text-muted-foreground hover:text-destructive">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                      {currentSubjects.length === 0 && (
                        <p className="text-sm text-muted-foreground italic w-full text-center mt-8">No subjects mapped yet.</p>
                      )}
                    </div>
                  </div>

                  <Button onClick={handleSave} className="w-full font-bold">
                    <Check className="w-4 h-4 mr-2" />
                    Save Configuration
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* List of existing mappings */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Current Mappings</h3>
            {mappings.map(m => (
              <Card key={m.id} className="border-l-4 border-l-primary">
                <CardHeader className="p-4 pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-sm font-bold">{m.standard}</CardTitle>
                    <button onClick={() => deleteMapping(m.id)} className="text-muted-foreground hover:text-destructive">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="flex flex-wrap gap-1">
                    {m.subjects.slice(0, 3).map(s => (
                      <Badge key={s} variant="outline" className="text-[10px] py-0">{s}</Badge>
                    ))}
                    {m.subjects.length > 3 && (
                      <Badge variant="outline" className="text-[10px] py-0">+{m.subjects.length - 3} more</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
            {mappings.length === 0 && (
              <div className="text-center py-8 opacity-20">
                <Book className="w-8 h-8 mx-auto mb-2" />
                <p className="text-xs font-medium">No mappings configured</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

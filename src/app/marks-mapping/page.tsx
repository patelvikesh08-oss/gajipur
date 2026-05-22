
"use client";

import { useState, useMemo } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { useMarksMappingStore, AssessmentType } from "@/lib/marks-mapping-store";
import { useStudentStore } from "@/lib/student-store";
import { useSessionStore } from "@/lib/session-store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, Save, Calendar, CheckCircle2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function MarksMappingPage() {
  const { saveMarksMapping, getMarksFor, isLoaded: marksLoaded } = useMarksMappingStore();
  const { students, isLoaded: studentsLoaded } = useStudentStore();
  const { academicYear, semester, updateYear, updateSemester, isLoaded: sessionLoaded } = useSessionStore();
  
  const [selectedStandard, setSelectedStandard] = useState("");

  const standards = useMemo(() => {
    return Array.from(new Set(students.map(s => s.academicStandard))).sort();
  }, [students]);

  if (!marksLoaded || !studentsLoaded || !sessionLoaded) return null;

  const handleSaveMarks = (type: AssessmentType, value: string) => {
    const numValue = parseInt(value);
    if (isNaN(numValue)) return;
    
    if (!selectedStandard) {
      toast({ title: "Please select a standard first", variant: "destructive" });
      return;
    }

    saveMarksMapping(selectedStandard, semester, type, numValue);
    toast({
      title: "Marks Updated",
      description: `${type} max marks set to ${numValue} for ${selectedStandard}`,
    });
  };

  const assessmentTypes: AssessmentType[] = ['TRIMASIK', 'SVADHYAY', 'PAT/SAT', 'PATRAK-B'];

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Calculator className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Marks Mapping</h1>
              <p className="text-xs text-muted-foreground font-medium">Define maximum marks for each assessment type</p>
            </div>
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
                <SelectItem value="Semester 1">Semester 1</SelectItem>
                <SelectItem value="Semester 2">Semester 2</SelectItem>
                <SelectItem value="Annual">Annual</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Standard Configuration</CardTitle>
            <CardDescription>Select a standard to configure its assessment thresholds.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label>Academic Standard</Label>
              <Select value={selectedStandard} onValueChange={setSelectedStandard}>
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
          </CardContent>
        </Card>

        {selectedStandard ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
            {assessmentTypes.map((type) => (
              <Card key={type} className="border-l-4 border-l-primary">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-black uppercase tracking-widest text-primary">{type}</CardTitle>
                  <CardDescription>Maximum possible marks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Input 
                        type="number" 
                        placeholder="e.g. 100" 
                        defaultValue={getMarksFor(selectedStandard, semester, type)}
                        onBlur={(e) => handleSaveMarks(type, e.target.value)}
                        className="font-bold"
                      />
                    </div>
                    <div className="flex items-center px-3 bg-muted rounded-md text-xs font-bold text-muted-foreground">
                      / {type === 'SVADHYAY' ? 'Units' : 'Marks'}
                    </div>
                  </div>
                  <p className="text-[10px] text-muted-foreground italic">
                    All subjects in {selectedStandard} for {semester} will be assessed out of this value.
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border-2 border-dashed rounded-2xl">
            <Calculator className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
            <p className="text-muted-foreground font-medium">Please select an academic standard to view marks mapping.</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

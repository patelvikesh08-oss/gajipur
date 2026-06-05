
"use client";

import { useState, useMemo, useEffect } from "react";
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

  // Sync local marks when standard or semester changes
  useEffect(() => {
    if (selectedStandard && marksLoaded) {
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
        description: "Some values were invalid and were not saved. Please check your inputs. / કેટલીક કિંમતો અમાન્ય હતી અને સાચવવામાં આવી નથી. કૃપા કરીને તમારા ઇનપુટ્સ તપાસો.",
        variant: "destructive"
      });
    }
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Calculator className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Marks Mapping / ગુણ મેપિંગ</h1>
              <p className="text-xs text-muted-foreground font-medium">Define maximum marks for each assessment type / દરેક મૂલ્યાંકન પ્રકાર માટે મહત્તમ ગુણ નક્કી કરો</p>
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
                <SelectItem value="Semester 1">Semester 1 / સત્ર ૧</SelectItem>
                <SelectItem value="Semester 2">Semester 2 / સત્ર ૨</SelectItem>
                <SelectItem value="Annual">Annual / વાર્ષિક</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Standard Configuration / ધોરણ ગોઠવણી</CardTitle>
            <CardDescription>Select a standard to configure its assessment thresholds for the active session. / સક્રિય સત્ર માટે તેના મૂલ્યાંકન થ્રેશોલ્ડને ગોઠવવા માટે ધોરણ પસંદ કરો.</CardDescription>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>

        {selectedStandard ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {assessmentTypes.map((type) => (
                <Card key={type} className="border-l-4 border-l-primary shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-black uppercase tracking-widest text-primary">{type}</CardTitle>
                    <CardDescription>Maximum possible {type === 'SVADHYAY' ? 'Units' : 'Marks'} / મહત્તમ શક્ય {type === 'SVADHYAY' ? 'એકમો' : 'ગુણ'}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <Input 
                          type="number" 
                          placeholder="e.g. 100" 
                          value={localMarks[type]}
                          onChange={(e) => setLocalMarks({...localMarks, [type]: e.target.value})}
                          className="font-bold text-lg"
                        />
                      </div>
                      <div className="flex items-center px-4 bg-muted rounded-md text-xs font-bold text-muted-foreground">
                        / {type === 'SVADHYAY' ? 'Units' : 'Max'}
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
                className="font-headline font-bold px-12 shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform"
              >
                <Check className="w-5 h-5 mr-2" />
                Save Configuration / ગોઠવણી સાચવો
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 border-2 border-dashed rounded-2xl bg-white/50">
            <Calculator className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-10" />
            <p className="text-muted-foreground font-medium">Please select an academic standard to view and edit marks mapping. / ગુણ મેપિંગ જોવા અને સંપાદિત કરવા માટે કૃપા કરીને શૈક્ષણિક ધોરણ પસંદ કરો.</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

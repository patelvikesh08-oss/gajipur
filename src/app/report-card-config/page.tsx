
"use client";

import { useState, useRef } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Settings, Upload, Save, FileText, CheckCircle2, Image as ImageIcon, FileUp, X, ListChecks } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";

export default function ReportCardConfigPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [conductItems, setConductItems] = useState([
    { id: "punctuality", label: "Punctuality / સમયપાલન", checked: true },
    { id: "cleanliness", label: "Cleanliness / સ્વચ્છતા", checked: true },
    { id: "behavior", label: "Social Behavior / સામાજિક વર્તન", checked: true },
    { id: "leadership", label: "Leadership / નેતૃત્વ", checked: true },
    { id: "discipline", label: "Discipline / શિસ્ત", checked: true },
  ]);

  const handleSave = () => {
    setIsSaving(true);
    // Simulate a save process
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Configuration Saved / માહિતી સાચવવામાં આવી",
        description: "Report card template and grading settings have been updated.",
      });
    }, 800);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      toast({
        title: "File Selected / ફાઇલ પસંદ કરી",
        description: `Template: ${file.name}`,
      });
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const toggleConduct = (id: string) => {
    setConductItems(items => items.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-8 pb-12">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Settings className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Report Card Settings / રિપોર્ટ સેટિંગ્સ</h1>
            <p className="text-xs text-muted-foreground font-medium">Configure report card format, grading metrics, and templates</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Header Details / શાળાની વિગતો
                </CardTitle>
                <CardDescription>Primary information printed on student progress reports.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label>School Name / શાળાનું નામ</Label>
                  <Input defaultValue="EduPulse Global Academy" placeholder="Enter school name..." className="font-bold" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>School Index / ઇન્ડેક્સ નંબર</Label>
                    <Input defaultValue="SCH-IDX-998877" placeholder="e.g. 12.03.01" />
                  </div>
                  <div className="grid gap-2">
                    <Label>Block / District</Label>
                    <Input defaultValue="Springfield / Central" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <ListChecks className="w-5 h-5 text-primary" />
                  Qualities & Conduct / ગુણ અને વર્તણૂક
                </CardTitle>
                <CardDescription>Select which qualitative attributes appear on the report card.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {conductItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3 p-3 rounded-lg border bg-slate-50/50">
                      <Checkbox 
                        id={item.id} 
                        checked={item.checked} 
                        onCheckedChange={() => toggleConduct(item.id)}
                      />
                      <label htmlFor={item.id} className="text-sm font-medium leading-none cursor-pointer">
                        {item.label}
                      </label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Upload className="w-5 h-5 text-primary" />
                  Progress Report Template / નમૂનો
                </CardTitle>
                <CardDescription>Upload a background layout (JPG/PDF) for the progress report.</CardDescription>
              </CardHeader>
              <CardContent>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                  accept=".jpg,.jpeg,.png,.pdf"
                />
                
                {!selectedFile ? (
                  <div 
                    onClick={triggerFileInput}
                    className="border-2 border-dashed border-primary/30 rounded-xl p-10 flex flex-col items-center justify-center bg-white gap-4 transition-all hover:border-primary hover:bg-primary/5 cursor-pointer"
                  >
                    <div className="p-4 rounded-full bg-primary/10">
                      <ImageIcon className="w-10 h-10 text-primary" />
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-slate-700">Select Template File / ફાઇલ પસંદ કરો</p>
                      <p className="text-xs text-muted-foreground mt-1">Prefer high-resolution JPG or PDF</p>
                    </div>
                    <Button variant="outline" className="font-bold pointer-events-none">
                      Browse Files
                    </Button>
                  </div>
                ) : (
                  <div className="bg-white border rounded-xl p-6 flex items-center gap-4 relative group">
                    <div className="w-12 h-12 rounded bg-primary/10 flex items-center justify-center text-primary">
                      <FileUp className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate">{selectedFile.name}</p>
                      <p className="text-[10px] text-muted-foreground uppercase">{(selectedFile.size / 1024).toFixed(1)} KB • Template File</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={clearFile}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-500">Live Preview State</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="aspect-[3/4] bg-muted rounded-lg border-2 border-dashed flex items-center justify-center p-4">
                  <div className="text-center space-y-2 opacity-30">
                    <FileText className="w-12 h-12 mx-auto" />
                    <p className="text-[10px] font-bold uppercase">Template Mockup</p>
                  </div>
                </div>
                <div className="p-3 bg-muted rounded-lg flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold truncate">Academic_Report_V2.pdf</p>
                    <p className="text-[8px] text-muted-foreground uppercase">Active since July 2024</p>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                </div>
              </CardContent>
            </Card>

            <div className="pt-4">
              <Button onClick={handleSave} className="w-full font-bold shadow-lg" size="lg" disabled={isSaving}>
                {isSaving ? "Saving Configuration..." : <><Save className="w-4 h-4 mr-2" /> Commit All Changes</>}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

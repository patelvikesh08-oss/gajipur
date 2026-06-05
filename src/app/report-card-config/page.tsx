
"use client";

import { useState, useRef } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Save, FileText, CheckCircle2, Image as ImageIcon, FileUp, X, ListChecks, Settings2 } from "lucide-react";
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
        <div className="bg-gradient-to-r from-indigo-900 via-purple-800 to-indigo-900 p-8 rounded-3xl text-white shadow-2xl no-print">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
              <Settings2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Report Card Settings / રિપોર્ટ સેટિંગ્સ</h1>
              <p className="text-indigo-100 text-sm font-medium mt-1">Configure report card format, grading metrics, and templates</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <Card className="rounded-2xl border-none shadow-xl overflow-hidden">
              <CardHeader className="bg-slate-50/50 border-b">
                <CardTitle className="text-lg font-bold flex items-center gap-2 text-indigo-900">
                  <FileText className="w-5 h-5" />
                  Header Details / શાળાની વિગતો
                </CardTitle>
                <CardDescription className="font-medium">Primary information printed on student progress reports.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="grid gap-2">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-1">School Name / શાળાનું નામ</Label>
                  <Input defaultValue="EduPulse Global Academy" placeholder="Enter school name..." className="font-black h-12 rounded-xl bg-slate-50 border-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-1">School Index / ઇન્ડેક્સ નંબર</Label>
                    <Input defaultValue="SCH-IDX-998877" placeholder="e.g. 12.03.01" className="font-bold h-12 rounded-xl bg-slate-50 border-none" />
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-1">Block / District</Label>
                    <Input defaultValue="Springfield / Central" className="font-bold h-12 rounded-xl bg-slate-50 border-none" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-none shadow-xl overflow-hidden">
              <CardHeader className="bg-slate-50/50 border-b">
                <CardTitle className="text-lg font-bold flex items-center gap-2 text-indigo-900">
                  <ListChecks className="w-5 h-5" />
                  Qualities & Conduct / ગુણ અને વર્તણૂક
                </CardTitle>
                <CardDescription className="font-medium">Select which qualitative attributes appear on the report card.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {conductItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3 p-4 rounded-xl border-2 border-slate-50 hover:bg-indigo-50/50 transition-colors">
                      <Checkbox 
                        id={item.id} 
                        checked={item.checked} 
                        onCheckedChange={() => toggleConduct(item.id)}
                        className="rounded-md"
                      />
                      <label htmlFor={item.id} className="text-xs font-bold leading-none cursor-pointer text-slate-700">
                        {item.label}
                      </label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-none bg-indigo-50/50 shadow-xl rounded-2xl overflow-hidden">
              <CardHeader>
                <CardTitle className="text-lg font-bold flex items-center gap-2 text-indigo-900">
                  <Upload className="w-5 h-5" />
                  Progress Report Template / નમૂનો
                </CardTitle>
                <CardDescription className="font-medium">Upload a background layout (JPG/PDF) for the progress report.</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
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
                    className="border-2 border-dashed border-indigo-200 rounded-2xl p-12 flex flex-col items-center justify-center bg-white gap-4 transition-all hover:border-indigo-400 hover:bg-indigo-50/30 cursor-pointer group"
                  >
                    <div className="p-5 rounded-2xl bg-indigo-50 text-indigo-600 group-hover:scale-110 transition-transform">
                      <ImageIcon className="w-10 h-10" />
                    </div>
                    <div className="text-center">
                      <p className="font-black text-slate-700">Select Template File / ફાઇલ પસંદ કરો</p>
                      <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">Prefer high-resolution JPG or PDF</p>
                    </div>
                    <Button variant="outline" className="font-black h-11 rounded-xl px-8 border-indigo-100 text-indigo-700 mt-4 pointer-events-none">
                      Browse Files
                    </Button>
                  </div>
                ) : (
                  <div className="bg-white border-2 border-indigo-100 rounded-2xl p-8 flex items-center gap-6 relative group shadow-sm">
                    <div className="w-14 h-14 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                      <FileUp className="w-7 h-7" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-black text-slate-800 truncate">{selectedFile.name}</p>
                      <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{(selectedFile.size / 1024).toFixed(1)} KB • Template File</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={clearFile}
                      className="rounded-xl h-10 w-10 text-slate-400 hover:text-rose-500 hover:bg-rose-50"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="rounded-2xl border-none shadow-xl overflow-hidden">
              <CardHeader className="pb-3 bg-slate-50/50 border-b">
                <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Live Preview State</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="aspect-[3/4] bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center p-6">
                  <div className="text-center space-y-3 opacity-20 group hover:opacity-40 transition-opacity">
                    <FileText className="w-16 h-16 mx-auto text-indigo-900" />
                    <p className="text-[10px] font-black uppercase tracking-widest">Template Mockup</p>
                  </div>
                </div>
                <div className="p-4 bg-indigo-50/30 rounded-2xl flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-indigo-700" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-black text-slate-800 truncate">Academic_Report_V2.pdf</p>
                    <p className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Active Template</p>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                </div>
              </CardContent>
            </Card>

            <div className="pt-4">
              <Button onClick={handleSave} className="w-full font-black h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-100 text-sm uppercase tracking-widest" disabled={isSaving}>
                {isSaving ? "Saving..." : <><Save className="w-5 h-5 mr-2" /> Commit All Changes</>}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

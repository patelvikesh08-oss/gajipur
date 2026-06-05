
"use client";

import { useState, useRef } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Save, FileText, Image as ImageIcon, FileUp, X, Settings2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function BonofideConfigPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [templateName, setTemplateName] = useState("Standard Academic Template");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    setIsSaving(true);
    // Simulate a save process
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Configuration Saved / માહિતી સાચવવામાં આવી",
        description: "Bonafide template settings have been updated.",
      });
    }, 800);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      toast({
        title: "File Selected / ફાઇલ પસંદ કરી",
        description: `Selected: ${file.name}`,
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

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-8 pb-12">
        <div className="bg-gradient-to-r from-indigo-900 via-purple-800 to-indigo-900 p-8 rounded-3xl text-white shadow-2xl no-print">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
              <Settings2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Bonafide Certificate Settings / સેટિંગ્સ</h1>
              <p className="text-indigo-100 text-sm font-medium mt-1">Configure template details and upload blank formats</p>
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
                <CardDescription className="font-medium">This information will appear at the top of all generated certificates.</CardDescription>
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
                    <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-1">Trust Reg. No / રજી. નંબર</Label>
                    <Input defaultValue="TR-REG-4455" className="font-bold h-12 rounded-xl bg-slate-50 border-none" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-1">Address / સરનામું</Label>
                  <Textarea defaultValue="123 Education Hub, Springfield, Central District" rows={3} className="font-bold rounded-xl bg-slate-50 border-none" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-none bg-indigo-50/50 shadow-xl rounded-2xl overflow-hidden">
              <CardHeader>
                <CardTitle className="text-lg font-bold flex items-center gap-2 text-indigo-900">
                  <Upload className="w-5 h-5" />
                  Blank Template Upload / નમૂનો અપલોડ
                </CardTitle>
                <CardDescription className="font-medium">Upload a JPG/PNG or Word background template if you wish to use a custom printed letterhead.</CardDescription>
              </CardHeader>
              <CardContent>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                  accept=".jpg,.jpeg,.png,.doc,.docx,.pdf"
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
                      <p className="font-black text-slate-700">Click to select template / ફાઇલ પસંદ કરો</p>
                      <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">Images (JPG/PNG) or Documents (DOCX/PDF)</p>
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
                      <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{(selectedFile.size / 1024).toFixed(1)} KB • Ready for use</p>
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
                <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Active Template</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="p-4 bg-indigo-50/30 rounded-2xl flex items-center gap-4">
                  <div className="w-12 h-14 rounded-lg bg-white border border-indigo-100 flex items-center justify-center shrink-0 shadow-sm">
                    <FileText className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black text-slate-800 truncate">{selectedFile ? selectedFile.name : templateName}</p>
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> {selectedFile ? "Just selected" : "Active"}
                    </p>
                  </div>
                </div>
                <Button variant="outline" className="w-full text-[10px] font-black uppercase tracking-widest h-11 rounded-xl border-indigo-100 text-indigo-700">
                  Preview Template
                </Button>
              </CardContent>
            </Card>

            <div className="pt-4">
              <Button onClick={handleSave} className="w-full font-black h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-100 text-sm uppercase tracking-widest" disabled={isSaving}>
                {isSaving ? "Saving..." : <><Save className="w-5 h-5 mr-2" /> Save Configuration</>}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

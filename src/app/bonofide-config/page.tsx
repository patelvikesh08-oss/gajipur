
"use client";

import { useState, useRef } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Settings, Upload, Save, FileText, CheckCircle2, Image as ImageIcon, FileUp, X } from "lucide-react";
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
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Settings className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Bonafide Certificate Settings / સેટિંગ્સ</h1>
            <p className="text-xs text-muted-foreground font-medium">Configure template details and upload blank formats</p>
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
                <CardDescription>This information will appear at the top of all generated certificates.</CardDescription>
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
                    <Label>Trust Reg. No / રજી. નંબર</Label>
                    <Input defaultValue="TR-REG-4455" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Address / સરનામું</Label>
                  <Textarea defaultValue="123 Education Hub, Springfield, Central District" rows={3} />
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Upload className="w-5 h-5 text-primary" />
                  Blank Template Upload / નમૂનો અપલોડ
                </CardTitle>
                <CardDescription>Upload a JPG/PNG or Word background template if you wish to use a custom printed letterhead.</CardDescription>
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
                    className="border-2 border-dashed border-primary/30 rounded-xl p-10 flex flex-col items-center justify-center bg-white gap-4 transition-all hover:border-primary hover:bg-primary/5 cursor-pointer"
                  >
                    <div className="p-4 rounded-full bg-primary/10">
                      <ImageIcon className="w-10 h-10 text-primary" />
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-slate-700">Click to select template / ફાઇલ પસંદ કરવા ક્લિક કરો</p>
                      <p className="text-xs text-muted-foreground mt-1">Images (JPG/PNG) or Documents (DOCX/PDF)</p>
                    </div>
                    <Button variant="outline" className="font-bold pointer-events-none">
                      Select File / ફાઇલ પસંદ કરો
                    </Button>
                  </div>
                ) : (
                  <div className="bg-white border rounded-xl p-6 flex items-center gap-4 relative group">
                    <div className="w-12 h-12 rounded bg-primary/10 flex items-center justify-center text-primary">
                      <FileUp className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate">{selectedFile.name}</p>
                      <p className="text-xs text-muted-foreground">{(selectedFile.size / 1024).toFixed(1)} KB</p>
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
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-500">Active Template</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-muted rounded-lg flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-primary/20 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate">{selectedFile ? selectedFile.name : templateName}</p>
                    <p className="text-[10px] text-muted-foreground">{selectedFile ? "Just selected" : "Updated 2 days ago"}</p>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                </div>
                <Button variant="outline" className="w-full text-xs font-bold h-8">
                  View Full Size
                </Button>
              </CardContent>
            </Card>

            <div className="pt-4">
              <Button onClick={handleSave} className="w-full font-bold shadow-lg" size="lg" disabled={isSaving}>
                {isSaving ? "Saving..." : <><Save className="w-4 h-4 mr-2" /> Save Configuration</>}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

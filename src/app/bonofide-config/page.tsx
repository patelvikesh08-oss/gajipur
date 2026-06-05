
"use client";

import { useState, useRef, useEffect } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Save, FileText, X, Settings2, CheckCircle2, Info, Copy, Eye, ExternalLink, FileUp } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function BonofideConfigPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [templateName, setTemplateName] = useState("Standard Academic Template");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [certBody, setCertBody] = useState("This is to certify that {{name}}, G.R. No. {{grNumber}}, is a bonofide student of this school studying in the {{standard}} during the academic session {{year}}.");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (previewUrl && !previewUrl.startsWith('data:')) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Configuration Saved / માહિતી સાચવવામાં આવી",
        description: "Bonafide template and Word mapping settings have been updated.",
      });
    }, 800);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      toast({
        title: "File Loaded / ફાઇલ પસંદ કરી",
        description: `Selected: ${file.name}. View preview below.`,
      });
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const copyField = (field: string) => {
    navigator.clipboard.writeText(field);
    toast({
      title: "Field Copied",
      description: `${field} copied to clipboard.`,
    });
  };

  const mergeFields = [
    { field: "{{name}}", label: "Student Name" },
    { field: "{{grNumber}}", label: "G.R. Number" },
    { field: "{{standard}}", label: "Class/Grade" },
    { field: "{{year}}", label: "Academic Year" },
    { field: "{{rollNumber}}", label: "Roll Number" },
  ];

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto space-y-8 pb-12">
        <div className="bg-gradient-to-r from-indigo-600 via-purple-700 to-indigo-900 p-8 rounded-3xl text-white shadow-2xl no-print">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
              <Settings2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Bonafide Certificate Settings / સેટિંગ્સ</h1>
              <p className="text-indigo-100 text-sm font-medium mt-1">Configure Word templates, merge fields, and layout details</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <Card className="rounded-3xl border-none shadow-xl overflow-hidden">
              <CardHeader className="bg-slate-50/50 border-b px-8 py-6">
                <CardTitle className="text-lg font-bold flex items-center gap-2 text-indigo-900">
                  <FileText className="w-5 h-5" />
                  Certificate Body Editor / લખાણ સંપાદન
                </CardTitle>
                <CardDescription className="font-medium">Define the text that will be printed on the certificate or mapped to your Word file.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-8 px-8">
                <div className="grid gap-4">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-1">Body Template Text / પ્રમાણપત્રનું લખાણ</Label>
                  <Textarea 
                    value={certBody}
                    onChange={(e) => setCertBody(e.target.value)}
                    rows={6}
                    className="font-bold rounded-2xl bg-slate-50 border-none p-6 text-slate-700 leading-relaxed focus:bg-white transition-colors" 
                  />
                  <div className="flex items-start gap-3 p-4 bg-indigo-50/50 rounded-2xl">
                    <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <p className="text-[10px] font-bold text-indigo-700 leading-relaxed uppercase tracking-wider">
                      Use placeholders from the side panel. These will be replaced with student data in your Word document.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none bg-indigo-50/30 shadow-xl rounded-3xl overflow-hidden">
              <CardHeader className="px-8 py-6">
                <CardTitle className="text-lg font-bold flex items-center gap-2 text-indigo-900">
                  <Upload className="w-5 h-5" />
                  Official Template Upload & Preview
                </CardTitle>
                <CardDescription className="font-medium">Upload your school letterhead to see a live preview for field mapping.</CardDescription>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                  accept=".doc,.docx,.pdf,image/*"
                />
                
                {!selectedFile ? (
                  <div 
                    onClick={triggerFileInput}
                    className="border-2 border-dashed border-indigo-200 rounded-3xl p-12 flex flex-col items-center justify-center bg-white gap-4 transition-all hover:border-indigo-400 hover:bg-indigo-50/50 cursor-pointer group"
                  >
                    <div className="p-6 rounded-2xl bg-indigo-50 text-indigo-600 group-hover:scale-110 transition-transform">
                      <FileUp className="w-10 h-10" />
                    </div>
                    <div className="text-center">
                      <p className="font-black text-slate-700 text-lg">Upload Word or PDF Template</p>
                      <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">Drag and drop or click to browse</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="bg-white border-2 border-indigo-100 rounded-3xl p-6 flex items-center gap-6 relative group shadow-sm">
                      <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                        <FileUp className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-black text-slate-800 truncate">{selectedFile.name}</p>
                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{(selectedFile.size / 1024).toFixed(1)} KB • Template Loaded</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={clearFile}
                          className="rounded-xl h-10 w-10 text-slate-300 hover:text-rose-500 hover:bg-rose-50"
                        >
                          <X className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>

                    {previewUrl && (
                      <div className="rounded-3xl border-2 border-indigo-100 overflow-hidden bg-white shadow-2xl animate-in zoom-in-95 duration-500">
                        <div className="bg-indigo-900 p-4 border-b border-white/10 flex items-center justify-between text-white">
                          <div className="flex items-center gap-2">
                            <Eye className="w-4 h-4 text-indigo-300" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Live Template Preview / પ્રિવ્યુ</span>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-white hover:bg-white/10 h-8 font-bold text-xs gap-2"
                            onClick={() => window.open(previewUrl)}
                          >
                            <ExternalLink className="w-3.5 h-3.5" /> Full Screen
                          </Button>
                        </div>
                        <div className="bg-slate-100 flex items-center justify-center min-h-[500px] p-4">
                          {selectedFile.type === 'application/pdf' ? (
                            <iframe src={previewUrl} className="w-full h-[700px] border-none rounded-xl shadow-inner" />
                          ) : selectedFile.type.startsWith('image/') ? (
                            <img src={previewUrl} alt="Template Preview" className="max-w-full h-auto shadow-lg" />
                          ) : (
                            <div className="text-center p-12 max-w-sm">
                              <FileText className="w-16 h-16 text-indigo-300 mx-auto mb-6" />
                              <h4 className="text-lg font-black text-slate-800">Word Document Preview</h4>
                              <p className="text-xs font-bold text-slate-400 mt-2 leading-relaxed uppercase tracking-wider">
                                Direct preview for .docx is session-only. Verify mapping below.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-4 space-y-8">
            <Card className="rounded-3xl border-none shadow-xl overflow-hidden bg-white sticky top-8">
              <CardHeader className="pb-4 bg-slate-50/50 border-b px-6 py-5">
                <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Merge Fields / ડેટા ફિલ્ડ્સ</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-2">
                {mergeFields.map((item) => (
                  <div key={item.field} className="group flex items-center justify-between p-3 rounded-xl hover:bg-indigo-50 transition-all">
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{item.label}</p>
                      <code className="text-xs font-bold text-slate-800">{item.field}</code>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => copyField(item.field)}
                      className="h-8 w-8 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-white shadow-sm transition-all"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                ))}
              </CardContent>
              <CardHeader className="pb-3 bg-slate-50/50 border-y px-6 py-5">
                <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Active Template</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6 px-6">
                <div className="p-4 bg-indigo-50/50 rounded-2xl flex items-center gap-4 border border-indigo-100">
                  <div className="w-12 h-14 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm">
                    <FileText className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black text-slate-800 truncate">{selectedFile ? selectedFile.name : templateName}</p>
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> {selectedFile ? "Selected" : "Active"}
                    </p>
                  </div>
                </div>
                <div className="pt-2">
                  <Button onClick={handleSave} className="w-full font-black h-16 rounded-3xl bg-indigo-600 hover:bg-indigo-700 shadow-2xl shadow-indigo-200 text-sm uppercase tracking-widest" disabled={isSaving}>
                    {isSaving ? "Saving..." : <><Save className="w-5 h-5 mr-2" /> Save Configuration</>}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

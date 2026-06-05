"use client";

import { useState, useRef, useEffect } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { useReportCardConfigStore } from "@/lib/report-card-config-store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Upload, 
  Save, 
  FileText, 
  CheckCircle2, 
  FileUp, 
  X, 
  ListChecks, 
  Settings2, 
  Copy, 
  Info, 
  GraduationCap,
  Database,
  ExternalLink,
  Eye
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ReportCardConfigPage() {
  const { config, updateConfig, isLoaded } = useReportCardConfigStore();
  const [isSaving, setIsSaving] = useState(false);
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (config.templateUrl) {
      setLocalPreviewUrl(config.templateUrl);
    }
  }, [config.templateUrl]);

  if (!isLoaded) return null;

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Configuration Saved / માહિતી સાચવવામાં આવી",
        description: "Report card template and grading mappings have been updated and are now live.",
      });
    }, 800);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Immediate Session Preview
      const objectUrl = URL.createObjectURL(file);
      setLocalPreviewUrl(objectUrl);

      // Persistence via Store (FileReader)
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        updateConfig({
          templateUrl: url,
          templateType: file.type === 'application/pdf' ? 'pdf' : 'image'
        });

        toast({
          title: "Template Loaded / ફાઇલ લોડ કરી",
          description: `Active template: ${file.name}. Click 'Commit' to finalize.`,
        });
      };

      reader.readAsDataURL(file);
    }
  };

  const copyField = (field: string) => {
    navigator.clipboard.writeText(field);
    toast({
      title: "Field Copied",
      description: `${field} copied to clipboard.`,
    });
  };

  const studentFields = [
    { field: "{{student_name}}", label: "Full Name" },
    { field: "{{roll_number}}", label: "Roll No" },
    { field: "{{gr_number}}", label: "G.R. Number" },
    { field: "{{standard}}", label: "Academic Class" },
    { field: "{{academic_year}}", label: "Year" },
  ];

  const marksFields = [
    { field: "{{math_marks}}", label: "Maths Score" },
    { field: "{{sci_marks}}", label: "Science Score" },
    { field: "{{eng_marks}}", label: "English Score" },
    { field: "{{total_marks}}", label: "Grand Total" },
    { field: "{{percentage}}", label: "Total %" },
    { field: "{{grade}}", label: "Final Grade" },
    { field: "{{attendance}}", label: "Attendance %" },
  ];

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto space-y-8 pb-12">
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 p-8 rounded-3xl text-white shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20">
              <Settings2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Report Card Template Configuration</h1>
              <p className="text-indigo-100 text-sm font-medium mt-1">Map marks fields and configure layout placeholders</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <Tabs defaultValue="template" className="w-full">
              <TabsList className="bg-slate-100 p-1 rounded-2xl h-14 mb-6 w-full">
                <TabsTrigger value="template" className="flex-1 rounded-xl font-bold data-[state=active]:bg-white data-[state=active]:shadow-md">
                  Template Upload & Preview
                </TabsTrigger>
                <TabsTrigger value="general" className="flex-1 rounded-xl font-bold data-[state=active]:bg-white data-[state=active]:shadow-md">
                  General Info
                </TabsTrigger>
                <TabsTrigger value="conduct" className="flex-1 rounded-xl font-bold data-[state=active]:bg-white data-[state=active]:shadow-md">
                  Conduct Items
                </TabsTrigger>
              </TabsList>

              <TabsContent value="template" className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
                <Card className="border-none bg-indigo-50/30 shadow-xl rounded-3xl overflow-hidden">
                  <CardHeader className="px-8 py-6">
                    <CardTitle className="text-lg font-bold flex items-center gap-2 text-indigo-900">
                      <Upload className="w-5 h-5" />
                      Official Template Upload
                    </CardTitle>
                    <CardDescription className="font-medium">Upload your official layout to preview and map merge fields.</CardDescription>
                  </CardHeader>
                  <CardContent className="px-8 pb-8">
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileChange} 
                      className="hidden" 
                      accept=".pdf,image/*"
                    />
                    
                    {!localPreviewUrl ? (
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-indigo-200 rounded-3xl p-16 flex flex-col items-center justify-center bg-white gap-4 transition-all hover:border-indigo-400 hover:bg-indigo-50/50 cursor-pointer group"
                      >
                        <div className="p-6 rounded-2xl bg-indigo-50 text-indigo-600 group-hover:scale-110 transition-transform">
                          <FileUp className="w-12 h-12" />
                        </div>
                        <div className="text-center">
                          <p className="font-black text-slate-700 text-lg">Upload Report Card Template</p>
                          <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">Supports PDF or High-Res Images</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="bg-white border-2 border-indigo-100 rounded-3xl p-6 flex items-center gap-6 relative group shadow-sm">
                          <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                            <FileUp className="w-6 h-6" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-black text-slate-800 truncate">Template_Active_Preview</p>
                            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Ready for Mapping</p>
                          </div>
                          <div className="flex items-center gap-2">
                             <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => fileInputRef.current?.click()}
                              className="rounded-xl font-bold h-9 border-indigo-100"
                            >
                              Replace
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={(e) => { e.stopPropagation(); setLocalPreviewUrl(null); updateConfig({ templateUrl: null, templateType: 'default' }); }}
                              className="rounded-xl h-10 w-10 text-slate-300 hover:text-rose-500 hover:bg-rose-50"
                            >
                              <X className="w-5 h-5" />
                            </Button>
                          </div>
                        </div>

                        {localPreviewUrl && (
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
                                onClick={() => window.open(localPreviewUrl)}
                              >
                                <ExternalLink className="w-3.5 h-3.5" /> Full Screen
                              </Button>
                            </div>
                            <div className="bg-slate-100 flex items-center justify-center min-h-[600px] p-4">
                              {config.templateType === 'pdf' ? (
                                <iframe src={localPreviewUrl} className="w-full h-[800px] border-none rounded-xl shadow-inner" />
                              ) : (
                                <img src={localPreviewUrl} alt="Template Preview" className="max-w-full h-auto shadow-2xl rounded-sm" />
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="general" className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
                <Card className="rounded-3xl border-none shadow-xl overflow-hidden">
                  <CardHeader className="bg-slate-50/50 border-b px-8 py-6">
                    <CardTitle className="text-lg font-bold flex items-center gap-2 text-indigo-900">
                      <FileText className="w-5 h-5" />
                      School Header Details
                    </CardTitle>
                    <CardDescription className="font-medium">Information to be automatically populated in the template header.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-8 px-8 pb-8">
                    <div className="grid gap-3">
                      <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-1">School Name / શાળાનું નામ</Label>
                      <Input 
                        value={config.schoolName} 
                        onChange={(e) => updateConfig({ schoolName: e.target.value })}
                        className="font-black h-12 rounded-xl bg-slate-50 border-none focus:bg-white transition-all" 
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="grid gap-3">
                        <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-1">School Index</Label>
                        <Input 
                          value={config.schoolIndex} 
                          onChange={(e) => updateConfig({ schoolIndex: e.target.value })}
                          className="font-bold h-12 rounded-xl bg-slate-50 border-none focus:bg-white transition-all" 
                        />
                      </div>
                      <div className="grid gap-3">
                        <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-1">District/Block</Label>
                        <Input 
                          value={config.districtBlock} 
                          onChange={(e) => updateConfig({ districtBlock: e.target.value })}
                          className="font-bold h-12 rounded-xl bg-slate-50 border-none focus:bg-white transition-all" 
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="conduct" className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
                <Card className="rounded-3xl border-none shadow-xl overflow-hidden">
                  <CardHeader className="bg-slate-50/50 border-b px-8 py-6">
                    <CardTitle className="text-lg font-bold flex items-center gap-2 text-indigo-900">
                      <ListChecks className="w-5 h-5" />
                      Conduct & Qualities
                    </CardTitle>
                    <CardDescription className="font-medium">Enable attributes that appear on the behavioral assessment section.</CardDescription>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {config.conductItems.map((item) => (
                        <div key={item.id} className="flex items-center space-x-3 p-5 rounded-2xl border-2 border-slate-50 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all cursor-pointer">
                          <Checkbox 
                            id={item.id} 
                            checked={item.checked} 
                            onCheckedChange={() => {
                              const newItems = config.conductItems.map(i => i.id === item.id ? { ...i, checked: !i.checked } : i);
                              updateConfig({ conductItems: newItems });
                            }}
                            className="rounded-md h-5 w-5"
                          />
                          <label htmlFor={item.id} className="text-sm font-bold leading-none cursor-pointer text-slate-700">
                            {item.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="lg:col-span-4 space-y-8">
            <Card className="rounded-3xl border-none shadow-xl overflow-hidden bg-white sticky top-8">
              <CardHeader className="bg-slate-50/50 border-b px-6 py-5">
                <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Template Fields Mapping</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="p-6 space-y-8 max-h-[calc(100vh-350px)] overflow-auto custom-scrollbar">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-indigo-700">
                      <GraduationCap className="w-4 h-4" />
                      <span className="text-xs font-black uppercase tracking-widest">Student Info</span>
                    </div>
                    <div className="space-y-2">
                      {studentFields.map((item) => (
                        <div key={item.field} className="group flex items-center justify-between p-3 rounded-xl hover:bg-indigo-50 transition-all border border-transparent hover:border-indigo-100">
                          <div className="space-y-0.5">
                            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{item.label}</p>
                            <code className="text-[11px] font-bold text-slate-800">{item.field}</code>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => copyField(item.field)}
                            className="h-8 w-8 rounded-lg text-slate-300 hover:text-indigo-600 transition-all"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-rose-600">
                      <Database className="w-4 h-4" />
                      <span className="text-xs font-black uppercase tracking-widest">Marks & Result</span>
                    </div>
                    <div className="space-y-2">
                      {marksFields.map((item) => (
                        <div key={item.field} className="group flex items-center justify-between p-3 rounded-xl hover:bg-rose-50 transition-all border border-transparent hover:border-rose-100">
                          <div className="space-y-0.5">
                            <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest">{item.label}</p>
                            <code className="text-[11px] font-bold text-slate-800">{item.field}</code>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => copyField(item.field)}
                            className="h-8 w-8 rounded-lg text-slate-300 hover:text-rose-600 transition-all"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-indigo-50/50 border-t border-indigo-100">
                  <div className="flex items-start gap-3">
                    <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <p className="text-[10px] font-bold text-indigo-700 leading-relaxed uppercase tracking-wider">
                      Place these merge fields anywhere in your template (Word or HTML) to dynamically inject data.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-none shadow-xl overflow-hidden">
              <CardHeader className="bg-slate-50/50 border-b px-6 py-5">
                <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Active State</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6 px-6 pb-6">
                <div className="p-4 bg-emerald-50 rounded-2xl flex items-center gap-4 border border-emerald-100">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm text-emerald-600">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black text-slate-800 truncate">{config.templateUrl ? "Custom Loaded" : "System Default"}</p>
                    <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">
                      {config.templateUrl ? "Ready for generation" : "Default Mode Active"}
                    </p>
                  </div>
                </div>
                <Button onClick={handleSave} className="w-full font-black h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 shadow-2xl shadow-indigo-100 text-sm uppercase tracking-widest" disabled={isSaving}>
                  {isSaving ? "Syncing..." : <><Save className="w-5 h-5 mr-2" /> Commit All Changes</>}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

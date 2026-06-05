
"use client";

import { useState, useRef, useEffect } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { useReportCardConfigStore, FieldMapping } from "@/lib/report-card-config-store";
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
  Settings2, 
  Info, 
  GraduationCap,
  Database,
  Eye,
  PlusCircle,
  Layers,
  Loader2,
  BookOpen
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ReportCardConfigPage() {
  const { config, updateConfig, isLoaded } = useReportCardConfigStore();
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [activePage, setActivePage] = useState<"page1" | "page2">("page1");
  const [activeField, setActiveField] = useState<{field: string, label: string} | null>(null);
  const [draggingField, setDraggingField] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  if (!isLoaded) return null;

  const currentTemplateUrl = activePage === "page1" ? config.templateUrlPage1 : config.templateUrlPage2;
  const currentMappings = activePage === "page1" ? config.fieldMappingsPage1 : config.fieldMappingsPage2;

  const compressImage = (dataUrl: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1600;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
      img.src = dataUrl;
    });
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Configuration Saved / માહિતી સાચવવામાં આવી",
        description: "Report card templates and mappings have been synced with database.",
      });
    }, 800);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIsUploading(true);
      
      const reader = new FileReader();
      reader.onload = async (event) => {
        const rawUrl = event.target?.result as string;
        const compressedUrl = await compressImage(rawUrl);
        
        if (activePage === "page1") {
          updateConfig({
            templateUrlPage1: compressedUrl,
            templateType: 'image',
            fieldMappingsPage1: [] 
          });
        } else {
          updateConfig({
            templateUrlPage2: compressedUrl,
            fieldMappingsPage2: []
          });
        }
        setIsUploading(false);
        toast({ title: "Template Optimized & Uploaded", description: `Compressed template for ${activePage === "page1" ? "Page 1" : "Page 2"}.` });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = (e: React.MouseEvent) => {
    if (!activeField || !imageContainerRef.current || draggingField) return;

    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const newMapping: FieldMapping = {
      field: activeField.field,
      label: activeField.label,
      x,
      y
    };

    const filtered = currentMappings.filter(m => m.field !== activeField.field);
    const updated = [...filtered, newMapping];

    if (activePage === "page1") {
      updateConfig({ fieldMappingsPage1: updated });
    } else {
      updateConfig({ fieldMappingsPage2: updated });
    }
    
    setActiveField(null);
    toast({ title: "Field Placed", description: `${activeField.label} positioned.` });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingField || !imageContainerRef.current) return;

    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));

    const updatedMappings = currentMappings.map(m => 
      m.field === draggingField ? { ...m, x, y } : m
    );

    if (activePage === "page1") {
      updateConfig({ fieldMappingsPage1: updatedMappings });
    } else {
      updateConfig({ fieldMappingsPage2: updatedMappings });
    }
  };

  const handleMouseUp = () => {
    if (draggingField) setDraggingField(null);
  };

  const removeMapping = (field: string) => {
    const updated = currentMappings.filter(m => m.field !== field);
    if (activePage === "page1") {
      updateConfig({ fieldMappingsPage1: updated });
    } else {
      updateConfig({ fieldMappingsPage2: updated });
    }
  };

  const studentFields = [
    { field: "{{student_name}}", label: "Full Name" },
    { field: "{{roll_number}}", label: "Roll No" },
    { field: "{{gr_number}}", label: "G.R. Number" },
    { field: "{{standard}}", label: "Academic Class" },
    { field: "{{academic_year}}", label: "Year" },
  ];

  const curriculumSubjects = [
    { field: "{{math_marks}}", label: "Mathematics / ગણિત" },
    { field: "{{sci_marks}}", label: "Science / વિજ્ઞાન" },
    { field: "{{eng_marks}}", label: "English / અંગ્રેજી" },
    { field: "{{social_marks}}", label: "Social Studies / સા. વિજ્ઞાન" },
    { field: "{{env_marks}}", label: "Env. Studies / પર્યાવરણ" },
    { field: "{{guj_marks}}", label: "Gujarati / ગુજરાતી" },
    { field: "{{hindi_marks}}", label: "Hindi / હિન્દી" },
    { field: "{{sans_marks}}", label: "Sanskrit / સંસ્કૃત" },
    { field: "{{comp_marks}}", label: "Computer / કમ્પ્યુટર" },
    { field: "{{pt_marks}}", label: "P.T. / પી.ટી." },
    { field: "{{art_marks}}", label: "Art & Craft / ચિત્ર" },
    { field: "{{music_marks}}", label: "Music / સંગીત" },
    { field: "{{gk_marks}}", label: "G.K. / સામાન્ય જ્ઞાન" },
    { field: "{{moral_marks}}", label: "Moral Science / નીતિ" },
  ];

  const resultFields = [
    { field: "{{total_marks}}", label: "Grand Total" },
    { field: "{{percentage}}", label: "Total %" },
    { field: "{{grade}}", label: "Final Grade" },
    { field: "{{attendance}}", label: "Attendance %" },
  ];

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto space-y-8 pb-12" onMouseUp={handleMouseUp}>
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 p-8 rounded-3xl text-white shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20">
              <Settings2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Report Card Designer</h1>
              <p className="text-indigo-100 text-sm font-medium mt-1">Configure Page 1 and Page 2 templates independently</p>
            </div>
          </div>
        </div>

        <Tabs value={activePage} onValueChange={(val: any) => setActivePage(val)} className="w-full">
          <div className="flex items-center justify-between mb-4">
            <TabsList className="bg-white p-1 h-14 rounded-2xl shadow-sm border">
              <TabsTrigger value="page1" className="rounded-xl px-8 font-black data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
                <FileText className="w-4 h-4 mr-2" /> Page 1 / પ્રથમ પાનું
              </TabsTrigger>
              <TabsTrigger value="page2" className="rounded-xl px-8 font-black data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
                <Layers className="w-4 h-4 mr-2" /> Page 2 / બીજું પાનું
              </TabsTrigger>
            </TabsList>
            
            <Badge variant="outline" className="h-10 px-4 rounded-xl border-indigo-100 text-indigo-700 font-bold bg-indigo-50">
              Editing: {activePage === "page1" ? "Page 1" : "Page 2"}
            </Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-8">
              <Card className="border-none bg-white shadow-xl rounded-3xl overflow-hidden min-h-[600px]">
                <CardHeader className="px-8 py-6 border-b">
                  <CardTitle className="text-lg font-bold flex items-center gap-2 text-indigo-900">
                    <Eye className="w-5 h-5" />
                    Interactive Canvas
                  </CardTitle>
                  <CardDescription className="font-medium">
                    {currentTemplateUrl 
                      ? "Click to place a field, or drag to move." 
                      : `Upload a JPG/PNG for ${activePage === "page1" ? "Page 1" : "Page 2"}.`}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                  
                  {!currentTemplateUrl ? (
                    <div 
                      onClick={() => !isUploading && fileInputRef.current?.click()}
                      className={cn(
                        "border-2 border-dashed border-indigo-200 rounded-3xl p-32 flex flex-col items-center justify-center bg-slate-50 gap-4 transition-all hover:border-indigo-400 hover:bg-indigo-50/50 cursor-pointer group",
                        isUploading && "cursor-wait opacity-50"
                      )}
                    >
                      <div className="p-6 rounded-2xl bg-indigo-50 text-indigo-600 group-hover:scale-110 transition-transform">
                        {isUploading ? <Loader2 className="w-12 h-12 animate-spin" /> : <FileUp className="w-12 h-12" />}
                      </div>
                      <div className="text-center">
                        <p className="font-black text-slate-700 text-lg">
                          {isUploading ? "Optimizing Image..." : `Click to Upload ${activePage === "page1" ? "Page 1" : "Page 2"} Template`}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">Supports PNG, JPG, JPEG</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className={cn(
                        "relative rounded-xl border-4 overflow-hidden shadow-2xl transition-all select-none",
                        activeField ? "cursor-crosshair border-indigo-500 scale-[1.01]" : "border-slate-100"
                      )}
                      ref={imageContainerRef}
                      onClick={handleImageClick}
                      onMouseMove={handleMouseMove}
                      >
                        <img src={currentTemplateUrl} alt="Template Preview" className="w-full h-auto pointer-events-none" />
                        
                        {currentMappings.map((m) => (
                          <div 
                            key={m.field}
                            style={{ left: `${m.x}%`, top: `${m.y}%` }}
                            className={cn(
                              "absolute -translate-x-1/2 -translate-y-1/2 group z-30 touch-none",
                              draggingField === m.field ? "z-50" : "cursor-move"
                            )}
                            onMouseDown={(e) => { e.stopPropagation(); setDraggingField(m.field); }}
                          >
                            <div className="relative">
                              <Badge className={cn(
                                "font-bold whitespace-nowrap shadow-lg transition-transform text-[10px] px-2 py-1",
                                draggingField === m.field ? "bg-purple-600 scale-110 ring-4 ring-purple-100" : "bg-indigo-600"
                              )}>
                                {m.label}
                              </Badge>
                              {draggingField !== m.field && (
                                <button 
                                  onClick={(e) => { e.stopPropagation(); removeMapping(m.field); }}
                                  className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}

                        {activeField && !draggingField && (
                          <div className="absolute inset-0 bg-indigo-500/10 pointer-events-none flex items-center justify-center z-40">
                            <p className="bg-indigo-600 text-white px-4 py-2 rounded-full font-bold text-sm animate-pulse">
                              Click to place: {activeField.label}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                          {currentMappings.length} Fields Mapped • Drag to re-position
                        </p>
                        <Button 
                          variant="outline" size="sm" className="rounded-xl border-rose-200 text-rose-500 hover:bg-rose-50"
                          onClick={() => {
                            if (activePage === "page1") updateConfig({ templateUrlPage1: null, fieldMappingsPage1: [] });
                            else updateConfig({ templateUrlPage2: null, fieldMappingsPage2: [] });
                          }}
                        >
                          <X className="w-4 h-4 mr-2" /> Reset {activePage === "page1" ? "Page 1" : "Page 2"}
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-4 space-y-8">
              <Card className="rounded-3xl border-none shadow-xl overflow-hidden bg-white sticky top-8">
                <CardHeader className="bg-slate-50/50 border-b px-6 py-5">
                  <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Mapping Toolbox</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="p-6 space-y-8 max-h-[calc(100vh-300px)] overflow-auto custom-scrollbar no-scrollbar">
                    <div className="bg-indigo-50 p-4 rounded-2xl mb-6">
                      <div className="flex gap-3">
                        <Info className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                        <p className="text-[10px] font-bold text-indigo-700 leading-relaxed uppercase tracking-wider">
                          Select a field, then click on the canvas to place it. Drag placed fields to adjust.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-indigo-700">
                        <GraduationCap className="w-4 h-4" />
                        <span className="text-xs font-black uppercase tracking-widest">Student Info</span>
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        {studentFields.map((item) => {
                          const isMapped = currentMappings.some(m => m.field === item.field);
                          const isActive = activeField?.field === item.field;
                          return (
                            <Button 
                              key={item.field}
                              variant={isActive ? "default" : "outline"}
                              className={cn(
                                "justify-between h-12 rounded-xl border-slate-100 px-4",
                                isMapped && !isActive && "bg-emerald-50 border-emerald-100 text-emerald-700 hover:bg-emerald-100",
                                isActive && "bg-indigo-600 scale-[1.02] shadow-indigo-100"
                              )}
                              onClick={() => setActiveField(isActive ? null : item)}
                            >
                              <span className="text-xs font-bold">{item.label}</span>
                              {isMapped ? <CheckCircle2 className="w-4 h-4" /> : <PlusCircle className="w-4 h-4 opacity-30" />}
                            </Button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t">
                      <div className="flex items-center gap-2 text-rose-600">
                        <BookOpen className="w-4 h-4" />
                        <span className="text-xs font-black uppercase tracking-widest">Subject Scores</span>
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        {curriculumSubjects.map((item) => {
                          const isMapped = currentMappings.some(m => m.field === item.field);
                          const isActive = activeField?.field === item.field;
                          return (
                            <Button 
                              key={item.field}
                              variant={isActive ? "default" : "outline"}
                              className={cn(
                                "justify-between h-12 rounded-xl border-slate-100 px-4",
                                isMapped && !isActive && "bg-emerald-50 border-emerald-100 text-emerald-700 hover:bg-emerald-100",
                                isActive && "bg-indigo-600 scale-[1.02] shadow-indigo-100"
                              )}
                              onClick={() => setActiveField(isActive ? null : item)}
                            >
                              <span className="text-xs font-bold">{item.label}</span>
                              {isMapped ? <CheckCircle2 className="w-4 h-4" /> : <PlusCircle className="w-4 h-4 opacity-30" />}
                            </Button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t">
                      <div className="flex items-center gap-2 text-purple-600">
                        <Database className="w-4 h-4" />
                        <span className="text-xs font-black uppercase tracking-widest">Final Results</span>
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        {resultFields.map((item) => {
                          const isMapped = currentMappings.some(m => m.field === item.field);
                          const isActive = activeField?.field === item.field;
                          return (
                            <Button 
                              key={item.field}
                              variant={isActive ? "default" : "outline"}
                              className={cn(
                                "justify-between h-12 rounded-xl border-slate-100 px-4",
                                isMapped && !isActive && "bg-emerald-50 border-emerald-100 text-emerald-700 hover:bg-emerald-100",
                                isActive && "bg-indigo-600 scale-[1.02] shadow-indigo-100"
                              )}
                              onClick={() => setActiveField(isActive ? null : item)}
                            >
                              <span className="text-xs font-bold">{item.label}</span>
                              {isMapped ? <CheckCircle2 className="w-4 h-4" /> : <PlusCircle className="w-4 h-4 opacity-30" />}
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-slate-50 border-t">
                    <Button onClick={handleSave} className="w-full font-black h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 shadow-2xl shadow-indigo-100 text-sm uppercase tracking-widest" disabled={isSaving}>
                      {isSaving ? "Syncing..." : <><Save className="w-5 h-5 mr-2" /> Sync Configuration</>}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </Tabs>
      </div>
    </MainLayout>
  );
}

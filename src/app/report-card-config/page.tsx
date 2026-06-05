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
  ListChecks, 
  Settings2, 
  Copy, 
  Info, 
  GraduationCap,
  Database,
  ExternalLink,
  Eye,
  PlusCircle,
  Grip
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function ReportCardConfigPage() {
  const { config, updateConfig, isLoaded } = useReportCardConfigStore();
  const [isSaving, setIsSaving] = useState(false);
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);
  const [activeField, setActiveField] = useState<{field: string, label: string} | null>(null);
  const [draggingField, setDraggingField] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);

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
        description: "Report card template and data mappings have been updated.",
      });
    }, 800);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        setLocalPreviewUrl(url);
        updateConfig({
          templateUrl: url,
          templateType: file.type === 'application/pdf' ? 'pdf' : 'image',
          fieldMappings: [] // Reset mappings for new template
        });
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

    const filtered = config.fieldMappings.filter(m => m.field !== activeField.field);
    updateConfig({ fieldMappings: [...filtered, newMapping] });
    setActiveField(null);
    
    toast({
      title: "Field Placed",
      description: `${activeField.label} positioned on template.`,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingField || !imageContainerRef.current) return;

    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));

    const updatedMappings = config.fieldMappings.map(m => 
      m.field === draggingField ? { ...m, x, y } : m
    );
    updateConfig({ fieldMappings: updatedMappings });
  };

  const handleMouseUp = () => {
    if (draggingField) {
      setDraggingField(null);
    }
  };

  const removeMapping = (field: string) => {
    updateConfig({ fieldMappings: config.fieldMappings.filter(m => m.field !== field) });
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
      <div className="max-w-7xl mx-auto space-y-8 pb-12" onMouseUp={handleMouseUp}>
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 p-8 rounded-3xl text-white shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20">
              <Settings2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Template Design & Mapping</h1>
              <p className="text-indigo-100 text-sm font-medium mt-1">Upload your letterhead and place or drag dynamic fields interactively</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <Card className="border-none bg-white shadow-xl rounded-3xl overflow-hidden min-h-[600px]">
              <CardHeader className="px-8 py-6 border-b">
                <CardTitle className="text-lg font-bold flex items-center gap-2 text-indigo-900">
                  <Eye className="w-5 h-5" />
                  Template Layout Canvas
                </CardTitle>
                <CardDescription className="font-medium">
                  {localPreviewUrl 
                    ? "Click to place a field, or click and drag an existing field to move it." 
                    : "Upload a JPG/PNG to start interactive mapping."}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                  accept="image/*"
                />
                
                {!localPreviewUrl ? (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-indigo-200 rounded-3xl p-32 flex flex-col items-center justify-center bg-slate-50 gap-4 transition-all hover:border-indigo-400 hover:bg-indigo-50/50 cursor-pointer group"
                  >
                    <div className="p-6 rounded-2xl bg-indigo-50 text-indigo-600 group-hover:scale-110 transition-transform">
                      <FileUp className="w-12 h-12" />
                    </div>
                    <div className="text-center">
                      <p className="font-black text-slate-700 text-lg">Click to Upload Image Template</p>
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
                      <img 
                        src={localPreviewUrl} 
                        alt="Template Preview" 
                        className="w-full h-auto pointer-events-none" 
                      />
                      
                      {config.fieldMappings.map((m) => (
                        <div 
                          key={m.field}
                          style={{ left: `${m.x}%`, top: `${m.y}%` }}
                          className={cn(
                            "absolute -translate-x-1/2 -translate-y-1/2 group z-30 touch-none",
                            draggingField === m.field ? "z-50" : "cursor-move"
                          )}
                          onMouseDown={(e) => {
                            e.stopPropagation();
                            setDraggingField(m.field);
                          }}
                        >
                          <div className="relative">
                            <Badge className={cn(
                              "font-bold whitespace-nowrap shadow-lg transition-transform",
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
                        {config.fieldMappings.length} Fields Mapped • Drag fields to move
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="rounded-xl border-rose-200 text-rose-500 hover:bg-rose-50"
                        onClick={() => { setLocalPreviewUrl(null); updateConfig({ templateUrl: null, fieldMappings: [] }); }}
                      >
                        <X className="w-4 h-4 mr-2" /> Reset Template
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
                <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Interactive Field Tool</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="p-6 space-y-8 max-h-[calc(100vh-300px)] overflow-auto custom-scrollbar">
                  <div className="bg-indigo-50 p-4 rounded-2xl mb-6">
                    <div className="flex gap-3">
                      <Info className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                      <p className="text-[10px] font-bold text-indigo-700 leading-relaxed uppercase tracking-wider">
                        1. Click a field below<br />
                        2. Click position on template<br />
                        3. Drag placed fields to move them
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
                        const isMapped = config.fieldMappings.some(m => m.field === item.field);
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
                      <Database className="w-4 h-4" />
                      <span className="text-xs font-black uppercase tracking-widest">Marks & Results</span>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      {marksFields.map((item) => {
                        const isMapped = config.fieldMappings.some(m => m.field === item.field);
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
                    {isSaving ? "Saving..." : <><Save className="w-5 h-5 mr-2" /> Commit Mapping</>}
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

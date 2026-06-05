
"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { usePatrakBStore } from "@/lib/patrak-b-store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings2, Save, Layers, ShieldCheck } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

export default function PatrakBConfigPage() {
  const { config, setFieldCount, updateField, setMaxTotalSubColumns, isLoaded } = usePatrakBStore();
  const [localFieldCount, setLocalFieldCount] = useState<string>("4");
  const [localMaxSubCols, setLocalMaxSubCols] = useState<string>("40");

  useEffect(() => {
    if (isLoaded) {
      setLocalFieldCount(config.fields.length.toString());
      setLocalMaxSubCols(config.maxTotalSubColumns.toString());
    }
  }, [isLoaded, config.fields.length, config.maxTotalSubColumns]);

  if (!isLoaded) return null;

  const currentTotalSubCols = config.fields.reduce((sum, f) => sum + f.subColumnCount, 0);

  const handleUpdateMaxLimit = () => {
    const max = parseInt(localMaxSubCols);
    if (isNaN(max) || max < currentTotalSubCols) {
      toast({ 
        title: "Invalid Limit", 
        description: `Maximum sub-columns cannot be less than current total (${currentTotalSubCols}).`,
        variant: "destructive"
      });
      return;
    }
    setMaxTotalSubColumns(max);
    toast({
      title: "Capacity Updated",
      description: `Global limit set to ${max} sub-columns.`,
    });
  };

  const handleUpdateFieldCount = () => {
    const count = parseInt(localFieldCount);
    if (isNaN(count) || count < 1) {
      toast({ title: "Invalid Field Count", variant: "destructive" });
      return;
    }
    
    const currentFields = config.fields.length;
    if (count > currentFields) {
      const added = count - currentFields;
      if (currentTotalSubCols + added > config.maxTotalSubColumns) {
        toast({ 
          title: "Limit Exceeded", 
          description: "Adding these fields would exceed the global sub-column limit.",
          variant: "destructive"
        });
        return;
      }
    }

    setFieldCount(count);
    toast({
      title: "Fields Updated",
      description: `Layout now has ${count} main categories.`,
    });
  };

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Grid configuration successfully committed.",
    });
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-8 pb-20">
        <div className="bg-gradient-to-r from-indigo-600 via-purple-700 to-indigo-900 p-8 rounded-3xl text-white shadow-2xl no-print">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
              <Settings2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Patrak-B Grid Configuration</h1>
              <p className="text-indigo-100 text-sm font-medium mt-1">Customize behavior milestones and grid layout</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-none shadow-xl rounded-2xl overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b">
              <CardTitle className="text-lg font-bold flex items-center gap-2 text-indigo-900">
                <ShieldCheck className="w-5 h-5" />
                Capacity Limit
              </CardTitle>
              <CardDescription className="font-medium">Set the global maximum allowed sub-columns.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Max Total Sub-columns</Label>
                <div className="flex gap-2">
                  <Input 
                    type="number" 
                    value={localMaxSubCols} 
                    onChange={(e) => setLocalMaxSubCols(e.target.value)}
                    className="font-black h-12 rounded-xl bg-slate-50 border-none"
                  />
                  <Button onClick={handleUpdateMaxLimit} variant="outline" className="h-12 rounded-xl px-6 font-black border-indigo-100 text-indigo-700">Set</Button>
                </div>
                <p className="text-[10px] font-bold text-slate-400">Current total: {currentTotalSubCols} / {config.maxTotalSubColumns}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl rounded-2xl overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b">
              <CardTitle className="text-lg font-bold flex items-center gap-2 text-indigo-900">
                <Layers className="w-5 h-5" />
                Main Categories
              </CardTitle>
              <CardDescription className="font-medium">Number of primary progress fields.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Total Main Fields</Label>
                <div className="flex gap-2">
                  <Input 
                    type="number" 
                    value={localFieldCount} 
                    onChange={(e) => setLocalFieldCount(e.target.value)}
                    className="font-black h-12 rounded-xl bg-slate-50 border-none"
                  />
                  <Button onClick={handleUpdateFieldCount} variant="outline" className="h-12 rounded-xl px-6 font-black border-indigo-100 text-indigo-700">Update</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-black text-slate-800 px-1 uppercase tracking-tight">Field & Sub-column Setup</h2>
          <Accordion type="multiple" className="w-full space-y-4">
            {config.fields.map((field) => (
              <AccordionItem key={field.id} value={`field-${field.id}`} className="border-none rounded-2xl bg-white shadow-xl overflow-hidden">
                <AccordionTrigger className="px-8 py-6 hover:no-underline hover:bg-indigo-50/30">
                  <div className="flex flex-col items-start text-left gap-1">
                    <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Field {field.id}</span>
                    <span className="text-base font-bold text-slate-700">{field.title}</span>
                  </div>
                  <div className="ml-auto mr-4">
                    <Badge className="bg-indigo-100 text-indigo-700 font-black border-none px-3 py-1 rounded-full text-[10px]">
                      {field.subColumnCount} SUB-COLS
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-8 pb-8 pt-2 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-slate-100">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Field Name</Label>
                      <Input 
                        value={field.title}
                        onChange={(e) => updateField(field.id, { title: e.target.value })}
                        className="font-bold h-12 rounded-xl bg-slate-50 border-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Number of Sub-columns</Label>
                      <Input 
                        type="number"
                        min="1"
                        value={field.subColumnCount}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 1;
                          updateField(field.id, { subColumnCount: val });
                        }}
                        className="font-black h-12 rounded-xl bg-slate-50 border-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Sub-column Labels (Milestone Descriptions)</Label>
                    <div className="grid grid-cols-1 gap-4">
                      {Array.from({ length: field.subColumnCount }).map((_, idx) => (
                        <div key={idx} className="flex items-center gap-4 group">
                          <span className="text-[10px] font-black text-slate-300 w-8">{idx + 1}.</span>
                          <Input 
                            placeholder={`Enter milestone description for sub-column ${idx + 1}`}
                            value={field.subColumnLabels[idx] || ""}
                            onChange={(e) => {
                              const newLabels = [...field.subColumnLabels];
                              newLabels[idx] = e.target.value;
                              updateField(field.id, { subColumnLabels: newLabels });
                            }}
                            className="text-sm font-bold h-11 rounded-xl border-slate-100 focus:bg-indigo-50 transition-colors"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="flex justify-end pt-4 pb-12">
          <Button onClick={handleSave} className="font-black px-12 h-14 rounded-xl bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-100">
            <Save className="w-5 h-5 mr-2" />
            Commit Configuration
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}

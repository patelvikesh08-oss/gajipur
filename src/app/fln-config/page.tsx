
"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { useFLNConfigStore, FLNCategory } from "@/lib/fln-config-store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings2, Save, SpellCheck, BookOpen, Calculator } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function FlnConfigPage() {
  const { config, updateMilestone, isLoaded } = useFLNConfigStore();

  if (!isLoaded) return null;

  const categories: { key: FLNCategory; title: string; icon: any; color: string; bg: string }[] = [
    { key: 'FOUNDATION', title: 'Foundation Milestones', icon: SpellCheck, color: 'text-blue-600', bg: 'bg-blue-50' },
    { key: 'LITERACY', title: 'Literacy Milestones', icon: BookOpen, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { key: 'NUMERICY', title: 'Numeracy Milestones', icon: Calculator, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  const handleSave = () => {
    toast({
      title: "Configuration Saved",
      description: "FLN milestone descriptions updated successfully.",
    });
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-8 pb-20">
        <div className="bg-gradient-to-r from-indigo-900 via-purple-800 to-indigo-900 p-8 rounded-3xl text-white shadow-2xl no-print">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
              <Settings2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">FLN Milestone Configuration</h1>
              <p className="text-indigo-100 text-sm font-medium mt-1">Configure benchmarks for foundational literacy and numeracy</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Accordion type="multiple" className="w-full space-y-4">
            {categories.map((cat) => (
              <AccordionItem key={cat.key} value={cat.key} className="border-none rounded-2xl bg-white shadow-xl overflow-hidden">
                <AccordionTrigger className="px-8 py-6 hover:no-underline hover:bg-slate-50">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${cat.bg} ${cat.color}`}>
                      <cat.icon className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col items-start text-left">
                      <span className="text-[10px] font-black uppercase tracking-widest opacity-50">Category</span>
                      <span className="text-base font-bold text-slate-700">{cat.title}</span>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-8 pb-8 pt-2 space-y-6">
                  <div className="grid grid-cols-1 gap-4 pt-6 border-t border-slate-100">
                    {config.categories[cat.key].map((milestone, idx) => (
                      <div key={idx} className="flex items-center gap-4 group">
                        <span className="text-[10px] font-black text-slate-300 w-8 text-center">{idx + 1}</span>
                        <div className="flex-1">
                          <Input 
                            placeholder={`Describe milestone ${idx + 1}...`}
                            value={milestone}
                            onChange={(e) => updateMilestone(cat.key, idx, e.target.value)}
                            className="text-sm font-bold h-11 rounded-xl border-slate-100 focus:bg-indigo-50 transition-colors"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="flex justify-end pt-4 pb-12">
          <Button onClick={handleSave} size="lg" className="font-black px-12 h-14 rounded-xl bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-100">
            <Save className="w-5 h-5 mr-2" />
            Commit Configuration
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}


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

  const categories: { key: FLNCategory; title: string; icon: any; color: string }[] = [
    { key: 'FOUNDATION', title: 'Foundation Milestones', icon: SpellCheck, color: 'text-blue-600' },
    { key: 'LITERACY', title: 'Literacy Milestones', icon: BookOpen, color: 'text-emerald-600' },
    { key: 'NUMERICY', title: 'Numeracy Milestones', icon: Calculator, color: 'text-amber-600' },
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
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Settings2 className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">FLN Milestone Configuration</h1>
        </div>

        <div className="space-y-4">
          <Accordion type="multiple" className="w-full space-y-4">
            {categories.map((cat) => (
              <AccordionItem key={cat.key} value={cat.key} className="border rounded-xl bg-white shadow-sm overflow-hidden border-primary/10">
                <AccordionTrigger className="px-6 hover:no-underline hover:bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-slate-50 ${cat.color}`}>
                      <cat.icon className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col items-start text-left">
                      <span className="text-xs font-black uppercase tracking-widest opacity-50">Category</span>
                      <span className="text-sm font-bold text-slate-700">{cat.title}</span>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 pt-2 space-y-4">
                  <div className="grid grid-cols-1 gap-3 pt-4 border-t">
                    {config.categories[cat.key].map((milestone, idx) => (
                      <div key={idx} className="flex items-center gap-3 group">
                        <span className="text-xs font-black text-slate-400 w-6 text-center">{idx + 1}</span>
                        <div className="flex-1 space-y-1">
                          <Input 
                            placeholder={`Describe milestone ${idx + 1}...`}
                            value={milestone}
                            onChange={(e) => updateMilestone(cat.key, idx, e.target.value)}
                            className="text-sm font-medium border-slate-200 focus:border-primary/40 focus:ring-primary/10"
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

        <div className="flex justify-end pt-4">
          <Button onClick={handleSave} size="lg" className="font-bold px-12 shadow-lg shadow-primary/20">
            <Save className="w-5 h-5 mr-2" />
            Commit Configuration
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}

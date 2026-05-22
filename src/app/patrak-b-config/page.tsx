
"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { usePatrakBStore } from "@/lib/patrak-b-store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Settings2, Save, Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

export default function PatrakBConfigPage() {
  const { config, updateFieldCount, isLoaded } = usePatrakBStore();
  const [localCount, setLocalCount] = useState(4);

  useEffect(() => {
    if (isLoaded) {
      setLocalCount(config.fieldCount);
    }
  }, [isLoaded, config.fieldCount]);

  if (!isLoaded) return null;

  const handleSave = () => {
    updateFieldCount(localCount);
    toast({
      title: "Configuration Saved",
      description: `Patrak-B will now display ${localCount} field columns.`,
    });
  };

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Settings2 className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Patrak-B Configuration</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Column Grid Setup</CardTitle>
            <CardDescription>Define how many behavior/qualitative fields should be tracked in the Patrak-B assessment grid.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-10">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Number of Fields</span>
                <span className="text-3xl font-black text-primary">{localCount}</span>
              </div>
              <Slider 
                value={[localCount]} 
                min={1} 
                max={20} 
                step={1} 
                onValueChange={(val) => setLocalCount(val[0])}
              />
              <div className="flex justify-between text-[10px] font-bold text-slate-400">
                <span>1 COLUMN (MIN)</span>
                <span>20 COLUMNS (MAX)</span>
              </div>
            </div>

            <div className="p-4 bg-muted/30 rounded-xl border border-dashed text-sm font-medium text-muted-foreground italic">
              Note: This changes the entry interface for all academic standards. Summary columns (Sem 1, Sem 2, and Average) will always appear after these fields.
            </div>

            <div className="flex justify-end pt-4 border-t">
              <Button onClick={handleSave} className="font-bold px-8 shadow-lg shadow-primary/20">
                <Save className="w-4 h-4 mr-2" />
                Save Grid Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}

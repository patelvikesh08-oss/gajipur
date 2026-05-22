"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { usePatrakBStore } from "@/lib/patrak-b-store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings2, Save, Layers, ListPlus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

export default function PatrakBConfigPage() {
  const { config, setFieldCount, updateSubColumnCount, isLoaded } = usePatrakBStore();
  const [localFieldCount, setLocalFieldCount] = useState<string>("4");

  useEffect(() => {
    if (isLoaded) {
      setLocalFieldCount(config.fields.length.toString());
    }
  }, [isLoaded, config.fields.length]);

  if (!isLoaded) return null;

  const handleUpdateFieldCount = () => {
    const count = parseInt(localFieldCount);
    if (isNaN(count) || count < 1 || count > 30) {
      toast({ 
        title: "Invalid Field Count", 
        description: "Please enter a number between 1 and 30.",
        variant: "destructive"
      });
      return;
    }
    setFieldCount(count);
    toast({
      title: "Field Count Updated",
      description: `Patrak-B now has ${count} main fields. Configure sub-columns below.`,
    });
  };

  const handleSave = () => {
    toast({
      title: "Configuration Saved",
      description: "Patrak-B grid layout has been successfully updated.",
    });
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Settings2 className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Patrak-B Grid Configuration</h1>
        </div>

        <Card className="border-primary/20 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Layers className="w-5 h-5 text-primary" />
              General Setup
            </CardTitle>
            <CardDescription>Enter the total number of main categories/fields for the assessment.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-end gap-4">
              <div className="flex-1 space-y-2">
                <Label htmlFor="fieldCount">Number of Main Fields</Label>
                <Input 
                  id="fieldCount"
                  type="number" 
                  value={localFieldCount} 
                  onChange={(e) => setLocalFieldCount(e.target.value)}
                  className="font-bold text-lg"
                  min="1"
                  max="30"
                />
              </div>
              <Button onClick={handleUpdateFieldCount} variant="secondary" className="font-bold">
                Update Fields
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {config.fields.map((field) => (
            <Card key={field.id} className="border-l-4 border-l-primary shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-black text-primary uppercase tracking-widest">
                  Field {field.id}
                </CardTitle>
                <CardDescription>Configure sub-columns for this category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-muted-foreground uppercase">Sub-columns Count</Label>
                  <Input 
                    type="number" 
                    min="1"
                    max="10"
                    value={field.subColumnCount}
                    onChange={(e) => updateSubColumnCount(field.id, parseInt(e.target.value) || 1)}
                    className="font-bold"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={handleSave} size="lg" className="font-bold px-12 shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform">
            <Save className="w-5 h-5 mr-2" />
            Save All Settings
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}

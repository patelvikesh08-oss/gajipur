"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { usePatrakBStore } from "@/lib/patrak-b-store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings2, Save, Layers, ListPlus, ShieldCheck } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

export default function PatrakBConfigPage() {
  const { config, setFieldCount, updateSubColumnCount, setMaxTotalSubColumns, isLoaded } = usePatrakBStore();
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
    
    // Simple validation before calling store
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
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Settings2 className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Patrak-B Grid Configuration</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-primary/20 shadow-md">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary" />
                Capacity Limit
              </CardTitle>
              <CardDescription>Set the global maximum allowed sub-columns.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Max Total Sub-columns</Label>
                <div className="flex gap-2">
                  <Input 
                    type="number" 
                    value={localMaxSubCols} 
                    onChange={(e) => setLocalMaxSubCols(e.target.value)}
                    className="font-bold"
                  />
                  <Button onClick={handleUpdateMaxLimit} variant="outline" className="font-bold">Set</Button>
                </div>
                <p className="text-[10px] text-muted-foreground">Current total: {currentTotalSubCols} / {config.maxTotalSubColumns}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20 shadow-md">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Layers className="w-5 h-5 text-primary" />
                Main Categories
              </CardTitle>
              <CardDescription>Number of primary progress fields.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Total Main Fields</Label>
                <div className="flex gap-2">
                  <Input 
                    type="number" 
                    value={localFieldCount} 
                    onChange={(e) => setLocalFieldCount(e.target.value)}
                    className="font-bold"
                  />
                  <Button onClick={handleUpdateFieldCount} variant="outline" className="font-bold">Update</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {config.fields.map((field) => (
            <Card key={field.id} className="border-l-4 border-l-primary shadow-sm">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-xs font-black text-primary uppercase">
                  Field {field.id}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="space-y-1">
                  <Label className="text-[10px] font-bold text-muted-foreground uppercase">Sub-cols</Label>
                  <Input 
                    type="number" 
                    min="1"
                    value={field.subColumnCount}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 1;
                      updateSubColumnCount(field.id, val);
                    }}
                    className="h-8 font-bold"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
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


"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { useSchoolStore } from "@/lib/school-store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, Save, MapPin, Phone, User, Landmark, Info } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";

export default function SchoolDetailsPage() {
  const { school, updateSchool, isLoaded } = useSchoolStore();
  const [isSaving, setIsSaving] = useState(false);

  if (!isLoaded) return null;

  const handleSave = () => {
    setIsSaving(true);
    // Simulation of network lag for better UX feel
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Details Saved / માહિતી સાચવી",
        description: "School identity information has been updated successfully.",
      });
    }, 600);
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-8 pb-12">
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-blue-900 p-8 rounded-3xl text-white shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">School Details / શાળા વિગત</h1>
              <p className="text-indigo-100 text-sm font-medium mt-1">Configure global school identity and contact information</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <Card className="rounded-3xl border-none shadow-xl overflow-hidden">
              <CardHeader className="bg-slate-50/50 border-b px-8 py-6">
                <CardTitle className="text-lg font-bold flex items-center gap-2 text-indigo-900">
                  <Landmark className="w-5 h-5" />
                  General Information / સામાન્ય વિગત
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-8 px-8">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-1">School Name / શાળાનું નામ</Label>
                    <Input 
                      value={school.name}
                      onChange={(e) => updateSchool({ name: e.target.value })}
                      className="font-bold h-12 rounded-xl bg-slate-50 border-none focus:bg-white transition-colors" 
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-1">Index Number / ઈન્ડેક્ષ નંબર</Label>
                      <Input 
                        value={school.indexNumber}
                        onChange={(e) => updateSchool({ indexNumber: e.target.value })}
                        className="font-bold h-12 rounded-xl bg-slate-50 border-none focus:bg-white transition-colors" 
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-1">Principal Name / આચાર્યનું નામ</Label>
                      <Input 
                        value={school.principal}
                        onChange={(e) => updateSchool({ principal: e.target.value })}
                        className="font-bold h-12 rounded-xl bg-slate-50 border-none focus:bg-white transition-colors" 
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-none shadow-xl overflow-hidden">
              <CardHeader className="bg-slate-50/50 border-b px-8 py-6">
                <CardTitle className="text-lg font-bold flex items-center gap-2 text-indigo-900">
                  <MapPin className="w-5 h-5" />
                  Location & Contact / સંપર્ક વિગત
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-8 px-8">
                <div className="grid gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-1">District / જિલ્લો</Label>
                      <Input 
                        value={school.district}
                        onChange={(e) => updateSchool({ district: e.target.value })}
                        className="font-bold h-12 rounded-xl bg-slate-50 border-none focus:bg-white transition-colors" 
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-1">Block / તાલુકો</Label>
                      <Input 
                        value={school.block}
                        onChange={(e) => updateSchool({ block: e.target.value })}
                        className="font-bold h-12 rounded-xl bg-slate-50 border-none focus:bg-white transition-colors" 
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-1">Mobile Number / મોબાઈલ</Label>
                    <Input 
                      value={school.mobile}
                      onChange={(e) => updateSchool({ mobile: e.target.value })}
                      className="font-bold h-12 rounded-xl bg-slate-50 border-none focus:bg-white transition-colors" 
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-1">Full Address / પૂરું સરનામું</Label>
                    <Input 
                      value={school.address}
                      onChange={(e) => updateSchool({ address: e.target.value })}
                      className="font-bold h-12 rounded-xl bg-slate-50 border-none focus:bg-white transition-colors" 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="rounded-3xl border-none shadow-xl bg-indigo-900 text-white p-6 relative overflow-hidden h-fit">
              <div className="relative z-10 space-y-4">
                <div className="p-3 bg-white/20 rounded-xl w-fit">
                  <Info className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black">Information Accuracy</h3>
                <p className="text-indigo-100 text-sm font-medium leading-relaxed">
                  The details provided here are used as headers for official documents like Report Cards and Bonofide Certificates. Please ensure accuracy.
                </p>
                <div className="pt-4">
                  <Button 
                    onClick={handleSave} 
                    className="w-full h-14 bg-white text-indigo-900 hover:bg-indigo-50 font-black rounded-2xl shadow-2xl shadow-black/20"
                    disabled={isSaving}
                  >
                    {isSaving ? "Saving..." : <><Save className="w-5 h-5 mr-2" /> Save Details</>}
                  </Button>
                </div>
              </div>
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/5 rounded-full blur-3xl" />
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

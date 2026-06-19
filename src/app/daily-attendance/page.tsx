
"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarCheck } from "lucide-react";

export default function DailyAttendancePage() {
  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-blue-900 p-8 rounded-3xl text-white shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
              <CalendarCheck className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Daily Attendance / દૈનિક હાજરી</h1>
              <p className="text-indigo-100 text-sm font-medium mt-1">Manage and track daily student presence</p>
            </div>
          </div>
        </div>
        
        <Card className="border-none shadow-xl rounded-2xl overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b">
            <CardTitle className="text-lg font-bold">Attendance Log</CardTitle>
          </CardHeader>
          <CardContent className="p-12 text-center">
            <CalendarCheck className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Attendance module coming soon...</p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}

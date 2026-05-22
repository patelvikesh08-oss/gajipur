
"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { StatCard } from "@/components/dashboard/stat-card";
import { useStudentStore } from "@/lib/student-store";
import { Users, CreditCard, UserPlus, Monitor } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  const { students, isLoaded } = useStudentStore();

  if (!isLoaded) return null;

  const totalStudents = students.length;

  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-6">Dashboard</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard
              title="Stock Total"
              value="GH₵150,000"
              description="Increased by 50%"
              icon={Monitor}
              variant="purple"
            />
            <StatCard
              title="Total Profit"
              value="GH₵25,000"
              description="Increased by 50%"
              icon={CreditCard}
              variant="blue"
            />
            <StatCard
              title="Unique Visitors"
              value="250000"
              description="Increased by 30%"
              icon={UserPlus}
              variant="orange"
            />
          </div>
        </div>

        <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="bg-white px-8 py-6">
            <CardTitle className="text-xl font-bold text-slate-700">Standard Data Table</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="px-8 font-bold text-slate-500">Name</TableHead>
                  <TableHead className="font-bold text-slate-500">Email</TableHead>
                  <TableHead className="font-bold text-slate-500">Usertype</TableHead>
                  <TableHead className="font-bold text-slate-500">Joined</TableHead>
                  <TableHead className="px-8 font-bold text-slate-500 text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="bg-white">
                {students.slice(0, 5).map((student) => (
                  <TableRow key={student.id} className="hover:bg-slate-50 transition-colors">
                    <TableCell className="px-8 font-medium text-slate-700">{student.name}</TableCell>
                    <TableCell className="text-slate-500">{student.name.toLowerCase().replace(' ', '.')}@gmail.com</TableCell>
                    <TableCell className="text-slate-500">Admin</TableCell>
                    <TableCell className="text-slate-500">9th April, 2020</TableCell>
                    <TableCell className="px-8 text-right">
                      <Badge className="bg-green-500 hover:bg-green-600 border-none px-4 py-1 rounded-full font-bold">
                        Pending
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}

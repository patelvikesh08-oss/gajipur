
"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { useStudentStore, Student, Gender } from "@/lib/student-store";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Filter, Trash2, Edit, FileSpreadsheet, DownloadCloud } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function PatrakCPage() {
  const { students, addStudent, updateStudent, deleteStudent, isLoaded } = useStudentStore();
  const [search, setSearch] = useState("");
  const [filterGender, setFilterGender] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    age: 0,
    gender: "Male" as Gender,
    academicStandard: "",
  });

  if (!isLoaded) return null;

  const filteredStudents = students.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || 
                          s.academicStandard.toLowerCase().includes(search.toLowerCase());
    const matchesGender = filterGender === "all" || s.gender === filterGender;
    return matchesSearch && matchesGender;
  });

  const handleSave = () => {
    if (editingStudent) {
      updateStudent({ ...editingStudent, ...formData });
      setEditingStudent(null);
    } else {
      addStudent(formData);
    }
    setFormData({ name: "", age: 0, gender: "Male", academicStandard: "" });
    setIsAddDialogOpen(false);
  };

  const handleEdit = (s: Student) => {
    setEditingStudent(s);
    setFormData({ name: s.name, age: s.age, gender: s.gender, academicStandard: s.academicStandard });
    setIsAddDialogOpen(true);
  };

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <FileSpreadsheet className="w-6 h-6 text-orange-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">PATRAK-C (Cumulative Final Results)</h1>
          </div>
          <Button variant="outline" className="font-bold gap-2">
            <DownloadCloud className="w-4 h-4" />
            Export Annual Report
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search final result records..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Select value={filterGender} onValueChange={setFilterGender}>
              <SelectTrigger className="w-[150px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genders</SelectItem>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
              </SelectContent>
            </Select>
            <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
              setIsAddDialogOpen(open);
              if (!open) setEditingStudent(null);
            }}>
              <DialogTrigger asChild>
                <Button className="font-bold bg-orange-600 hover:bg-orange-700 shadow-lg shadow-orange-600/20">
                  <Plus className="w-4 h-4 mr-2" />
                  New Result Record
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="font-headline text-xl">{editingStudent ? "Edit Result Record" : "New PATRAK-C Entry"}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Student Name</Label>
                    <Input id="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="age">Age</Label>
                      <Input id="age" type="number" value={formData.age} onChange={(e) => setFormData({...formData, age: parseInt(e.target.value) || 0})} />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select value={formData.gender} onValueChange={(val: Gender) => setFormData({...formData, gender: val})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="std">Academic Standard</Label>
                    <Input id="std" value={formData.academicStandard} onChange={(e) => setFormData({...formData, academicStandard: e.target.value})} />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                  <Button className="bg-orange-600 hover:bg-orange-700" onClick={handleSave}>Save Record</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="font-bold uppercase tracking-wider text-xs">Student Name</TableHead>
                <TableHead className="font-bold uppercase tracking-wider text-xs">Standard</TableHead>
                <TableHead className="font-bold uppercase tracking-wider text-xs">Annual Average</TableHead>
                <TableHead className="font-bold uppercase tracking-wider text-xs">Final Grade</TableHead>
                <TableHead className="text-right font-bold uppercase tracking-wider text-xs">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((s) => (
                <TableRow key={s.id} className="hover:bg-slate-50/50">
                  <TableCell className="font-medium text-slate-700">{s.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-orange-500 text-orange-600 font-bold">{s.academicStandard}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">88.5%</TableCell>
                  <TableCell>
                    <Badge className="bg-orange-500 hover:bg-orange-600 border-none px-3 py-0.5 rounded-full font-bold">
                      Distinction
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(s)}>
                        <Edit className="h-4 w-4 text-slate-400" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteStudent(s.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredStudents.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                    No cumulative final results found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </MainLayout>
  );
}


"use client";

import { useState, useMemo } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { useStudentStore, Student, Gender } from "@/lib/student-store";
import { useSessionStore } from "@/lib/session-store";
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
import { Plus, Search, Filter, Trash2, Edit, CheckCircle2, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function PatSatPage() {
  const { students, addStudent, updateStudent, deleteStudent, isLoaded: studentsLoaded } = useStudentStore();
  const { academicYear, semester, updateYear, updateSemester, isLoaded: sessionLoaded } = useSessionStore();
  
  const [search, setSearch] = useState("");
  const [filterGender, setFilterGender] = useState<string>("all");
  const [selectedStandard, setSelectedStandard] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    age: 0,
    gender: "Male" as Gender,
    academicStandard: "",
  });

  const standards = useMemo(() => {
    return Array.from(new Set(students.map(s => s.academicStandard))).sort();
  }, [students]);

  if (!studentsLoaded || !sessionLoaded) return null;

  const filteredStudents = students.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchesGender = filterGender === "all" || s.gender === filterGender;
    const matchesStandard = selectedStandard === "all" || s.academicStandard === selectedStandard;
    return matchesSearch && matchesGender && matchesStandard;
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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <CheckCircle2 className="w-6 h-6 text-indigo-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">PAT/SAT (Assessments)</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border shadow-sm">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <Select value={academicYear} onValueChange={(val: any) => updateYear(val)}>
                <SelectTrigger className="w-[120px] border-none shadow-none focus:ring-0 h-7 text-xs font-bold">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2023-24">2023-24</SelectItem>
                  <SelectItem value="2024-25">2024-25</SelectItem>
                  <SelectItem value="2025-26">2025-26</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Select value={semester} onValueChange={(val: any) => updateSemester(val)}>
              <SelectTrigger className="w-[140px] bg-white font-bold text-xs h-10 shadow-sm">
                <SelectValue placeholder="Semester" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Semester 1">Semester 1</SelectItem>
                <SelectItem value="Semester 2">Semester 2</SelectItem>
                <SelectItem value="Annual">Annual</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search assessments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedStandard} onValueChange={setSelectedStandard}>
            <SelectTrigger>
              <SelectValue placeholder="Standard" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Standards</SelectItem>
              {standards.map(std => (
                <SelectItem key={std} value={std}>{std}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterGender} onValueChange={setFilterGender}>
            <SelectTrigger>
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
              <Button className="font-bold bg-indigo-600 hover:bg-indigo-700 w-full shadow-lg shadow-indigo-600/20">
                <Plus className="w-4 h-4 mr-2" />
                New Assessment
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="font-headline text-xl">{editingStudent ? "Edit Assessment Record" : "New PAT/SAT Entry"}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label>Student Profile</Label>
                  <Select 
                    value={formData.name} 
                    onValueChange={(val) => {
                      const student = students.find(s => s.name === val);
                      if (student) {
                        setFormData({
                          ...formData,
                          name: student.name,
                          age: student.age,
                          gender: student.gender,
                          academicStandard: student.academicStandard
                        });
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pick a student..." />
                    </SelectTrigger>
                    <SelectContent>
                      {students.map(s => (
                        <SelectItem key={s.id} value={s.name}>{s.name} ({s.academicStandard})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={handleSave}>Save Record</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="font-bold uppercase tracking-wider text-xs">Student Name</TableHead>
                <TableHead className="font-bold uppercase tracking-wider text-xs">Standard</TableHead>
                <TableHead className="font-bold uppercase tracking-wider text-xs text-center">Date</TableHead>
                <TableHead className="font-bold uppercase tracking-wider text-xs text-center">Grade</TableHead>
                <TableHead className="text-right font-bold uppercase tracking-wider text-xs">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((s) => (
                <TableRow key={s.id} className="hover:bg-slate-50/50">
                  <TableCell className="font-medium text-slate-700">{s.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-indigo-500 text-indigo-600 font-bold">{s.academicStandard}</Badge>
                  </TableCell>
                  <TableCell className="text-center text-muted-foreground text-sm">Nov 12, 2023</TableCell>
                  <TableCell className="text-center">
                    <Badge className="bg-indigo-500 hover:bg-indigo-600 border-none px-3 py-0.5 rounded-full font-bold">
                      A+
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
                    No assessment records found matching the filters.
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

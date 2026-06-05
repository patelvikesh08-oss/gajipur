
"use client";

import { useState } from "react";
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
import { Plus, Search, Filter, Trash2, Edit, User, CreditCard, Building2, Phone, Home, FileUp, FileDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Link from "next/link";

export default function StudentsPage() {
  const { students, addStudent, updateStudent, deleteStudent, isLoaded: studentsLoaded } = useStudentStore();
  const { academicYear, isLoaded: sessionLoaded } = useSessionStore();
  
  const [search, setSearch] = useState("");
  const [filterGender, setFilterGender] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const [formData, setFormData] = useState<Omit<Student, 'id'>>({
    rollNumber: "",
    name: "",
    birthday: "",
    gender: "Male" as Gender,
    academicStandard: "",
    attendance: 0,
    grNumber: "",
    caste: "",
    childUniqueId: "",
    aadharCard: "",
    fatherName: "",
    motherName: "",
    bankName: "",
    bankAccountNumber: "",
    ifscCode: "",
    address: "",
    mobileNumber: "",
  });

  if (!studentsLoaded || !sessionLoaded) return null;

  const filteredStudents = students.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || 
                          s.academicStandard.toLowerCase().includes(search.toLowerCase()) ||
                          s.grNumber.toLowerCase().includes(search.toLowerCase()) ||
                          s.rollNumber.toLowerCase().includes(search.toLowerCase());
    const matchesGender = filterGender === "all" || s.gender === filterGender;
    return matchesSearch && matchesGender;
  }).sort((a, b) => (a.rollNumber || "").localeCompare(b.rollNumber || "", undefined, { numeric: true }));

  const handleSave = () => {
    if (editingStudent) {
      updateStudent({ ...editingStudent, ...formData });
      setEditingStudent(null);
    } else {
      addStudent(formData);
    }
    resetForm();
    setIsAddDialogOpen(false);
  };

  const resetForm = () => {
    setFormData({
      rollNumber: "",
      name: "",
      birthday: "",
      gender: "Male",
      academicStandard: "",
      attendance: 0,
      grNumber: "",
      caste: "",
      childUniqueId: "",
      aadharCard: "",
      fatherName: "",
      motherName: "",
      bankName: "",
      bankAccountNumber: "",
      ifscCode: "",
      address: "",
      mobileNumber: "",
    });
  };

  const handleEdit = (s: Student) => {
    setEditingStudent(s);
    setFormData({
      rollNumber: s.rollNumber,
      name: s.name,
      birthday: s.birthday,
      gender: s.gender,
      academicStandard: s.academicStandard,
      attendance: s.attendance,
      grNumber: s.grNumber,
      caste: s.caste,
      childUniqueId: s.childUniqueId,
      aadharCard: s.aadharCard,
      fatherName: s.fatherName,
      motherName: s.motherName,
      bankName: s.bankName,
      bankAccountNumber: s.bankAccountNumber,
      ifscCode: s.ifscCode,
      address: s.address,
      mobileNumber: s.mobileNumber,
    });
    setIsAddDialogOpen(true);
  };

  const exportToCSV = () => {
    if (filteredStudents.length === 0) return;
    
    const headers = ["Roll No", "G.R. No", "Name", "Gender", "Standard", "Birthday", "Attendance (%)", "Caste", "Child UID", "Aadhar", "Father", "Mother", "Bank", "Account", "IFSC", "Mobile", "Address"];
    const rows = filteredStudents.map(s => [
      `"${s.rollNumber}"`,
      `"${s.grNumber}"`,
      `"${s.name}"`,
      `"${s.gender}"`,
      `"${s.academicStandard}"`,
      `"${s.birthday}"`,
      s.attendance,
      `"${s.caste}"`,
      `"${s.childUniqueId}"`,
      `"${s.aadharCard}"`,
      `"${s.fatherName}"`,
      `"${s.motherName}"`,
      `"${s.bankName}"`,
      `"${s.bankAccountNumber}"`,
      `"${s.ifscCode}"`,
      `"${s.mobileNumber}"`,
      `"${s.address.replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `student_list_${academicYear.replace('/', '-')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-slate-800">Student Information System</h1>
          <div className="flex flex-wrap items-center gap-3">
             <Badge variant="outline" className="px-4 py-2 bg-white font-bold text-primary border-primary/20">
                Session: {academicYear}
             </Badge>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by Roll No, Name, G.R., or Standard..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Select value={filterGender} onValueChange={setFilterGender}>
              <SelectTrigger className="w-[130px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="font-bold hidden md:flex" asChild>
              <Link href="/bulk-entry">
                <FileUp className="w-4 h-4 mr-2" />
                Import
              </Link>
            </Button>
            <Button variant="outline" className="font-bold hidden md:flex" onClick={exportToCSV}>
              <FileDown className="w-4 h-4 mr-2" />
              Export
            </Button>

            <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
              setIsAddDialogOpen(open);
              if (!open) {
                setEditingStudent(null);
                resetForm();
              }
            }}>
              <DialogTrigger asChild>
                <Button className="font-headline font-bold">
                  <Plus className="w-4 h-4 mr-2" />
                  Enroll Student
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] p-0">
                <DialogHeader className="p-6 pb-0">
                  <DialogTitle className="font-headline text-xl">{editingStudent ? "Update Student Profile" : "New Student Enrollment"}</DialogTitle>
                </DialogHeader>
                <ScrollArea className="h-full max-h-[70vh] px-6">
                  <div className="grid gap-6 py-4">
                    <div className="space-y-4">
                      <h3 className="text-sm font-bold text-primary flex items-center gap-2 border-b pb-2">
                        <User className="w-4 h-4" /> Personal Details
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="rollNo">Roll Number</Label>
                          <Input id="rollNo" value={formData.rollNumber} onChange={(e) => setFormData({...formData, rollNumber: e.target.value})} placeholder="e.g. 01" />
                        </div>
                        <div className="grid gap-2 md:col-span-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input id="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
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
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="birthday">Birthday</Label>
                          <Input id="birthday" type="date" value={formData.birthday} onChange={(e) => setFormData({...formData, birthday: e.target.value})} />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="fatherName">Father's Name</Label>
                          <Input id="fatherName" value={formData.fatherName} onChange={(e) => setFormData({...formData, fatherName: e.target.value})} />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="motherName">Mother's Name</Label>
                          <Input id="motherName" value={formData.motherName} onChange={(e) => setFormData({...formData, motherName: e.target.value})} />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-sm font-bold text-primary flex items-center gap-2 border-b pb-2">
                        <CreditCard className="w-4 h-4" /> Identification & Schooling
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="grNumber">G.R. Number</Label>
                          <Input id="grNumber" value={formData.grNumber} onChange={(e) => setFormData({...formData, grNumber: e.target.value})} />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="std">Academic Standard</Label>
                          <Input id="std" value={formData.academicStandard} onChange={(e) => setFormData({...formData, academicStandard: e.target.value})} />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="childUid">Child Unique ID</Label>
                          <Input id="childUid" value={formData.childUniqueId} onChange={(e) => setFormData({...formData, childUniqueId: e.target.value})} />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="aadhar">Aadhar Card Number</Label>
                          <Input id="aadhar" value={formData.aadharCard} onChange={(e) => setFormData({...formData, aadharCard: e.target.value})} />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="caste">Caste</Label>
                          <Input id="caste" value={formData.caste} onChange={(e) => setFormData({...formData, caste: e.target.value})} />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="attendance">Attendance (%)</Label>
                          <Input id="attendance" type="number" value={formData.attendance} onChange={(e) => setFormData({...formData, attendance: parseInt(e.target.value) || 0})} />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-sm font-bold text-primary flex items-center gap-2 border-b pb-2">
                        <Building2 className="w-4 h-4" /> Bank & Contact Info
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="bankName">Bank Name</Label>
                          <Input id="bankName" value={formData.bankName} onChange={(e) => setFormData({...formData, bankName: e.target.value})} />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="accNo">Account Number</Label>
                          <Input id="accNo" value={formData.bankAccountNumber} onChange={(e) => setFormData({...formData, bankAccountNumber: e.target.value})} />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="ifsc">IFSC Code</Label>
                          <Input id="ifsc" value={formData.ifscCode} onChange={(e) => setFormData({...formData, ifscCode: e.target.value})} />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="mobile"><Phone className="w-3 h-3 inline mr-1" /> Mobile Number</Label>
                          <Input id="mobile" value={formData.mobileNumber} onChange={(e) => setFormData({...formData, mobileNumber: e.target.value})} />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="address"><Home className="w-3 h-3 inline mr-1" /> Residential Address</Label>
                          <Input id="address" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
                <DialogFooter className="p-6 pt-0 border-t mt-4">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleSave} className="font-bold">Save Student Profile</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
          <ScrollArea className="w-full">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="font-bold uppercase tracking-wider text-xs whitespace-nowrap">Roll No</TableHead>
                  <TableHead className="font-bold uppercase tracking-wider text-xs whitespace-nowrap">G.R. No</TableHead>
                  <TableHead className="font-bold uppercase tracking-wider text-xs whitespace-nowrap">Full Name</TableHead>
                  <TableHead className="font-bold uppercase tracking-wider text-xs whitespace-nowrap">Gender</TableHead>
                  <TableHead className="font-bold uppercase tracking-wider text-xs whitespace-nowrap">Standard</TableHead>
                  <TableHead className="font-bold uppercase tracking-wider text-xs whitespace-nowrap">Birthday</TableHead>
                  <TableHead className="font-bold uppercase tracking-wider text-xs whitespace-nowrap">Attendance (%)</TableHead>
                  <TableHead className="font-bold uppercase tracking-wider text-xs whitespace-nowrap">Caste</TableHead>
                  <TableHead className="font-bold uppercase tracking-wider text-xs whitespace-nowrap">Child UID</TableHead>
                  <TableHead className="font-bold uppercase tracking-wider text-xs whitespace-nowrap">Aadhar Card</TableHead>
                  <TableHead className="font-bold uppercase tracking-wider text-xs whitespace-nowrap">Father Name</TableHead>
                  <TableHead className="font-bold uppercase tracking-wider text-xs whitespace-nowrap">Mother Name</TableHead>
                  <TableHead className="font-bold uppercase tracking-wider text-xs whitespace-nowrap">Bank Name</TableHead>
                  <TableHead className="font-bold uppercase tracking-wider text-xs whitespace-nowrap">Account Number</TableHead>
                  <TableHead className="font-bold uppercase tracking-wider text-xs whitespace-nowrap">IFSC Code</TableHead>
                  <TableHead className="font-bold uppercase tracking-wider text-xs whitespace-nowrap">Mobile</TableHead>
                  <TableHead className="font-bold uppercase tracking-wider text-xs whitespace-nowrap">Address</TableHead>
                  <TableHead className="text-right font-bold uppercase tracking-wider text-xs whitespace-nowrap">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((s) => (
                    <TableRow key={s.id} className="hover:bg-muted/20 transition-colors">
                      <TableCell className="font-black text-primary whitespace-nowrap">{s.rollNumber}</TableCell>
                      <TableCell className="font-bold text-slate-500 whitespace-nowrap">{s.grNumber}</TableCell>
                      <TableCell className="font-bold text-slate-900 whitespace-nowrap">{s.name}</TableCell>
                      <TableCell className="whitespace-nowrap">
                        <Badge variant="outline" className="text-[10px] uppercase">{s.gender}</Badge>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <Badge variant="secondary" className="font-bold">{s.academicStandard}</Badge>
                      </TableCell>
                      <TableCell className="whitespace-nowrap font-medium">{s.birthday}</TableCell>
                      <TableCell className="whitespace-nowrap text-center">
                        <span className={`font-bold ${s.attendance < 75 ? 'text-destructive' : 'text-primary'}`}>
                          {s.attendance}%
                        </span>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">{s.caste}</TableCell>
                      <TableCell className="whitespace-nowrap font-mono text-xs">{s.childUniqueId}</TableCell>
                      <TableCell className="whitespace-nowrap font-mono text-xs">{s.aadharCard}</TableCell>
                      <TableCell className="whitespace-nowrap font-medium">{s.fatherName}</TableCell>
                      <TableCell className="whitespace-nowrap font-medium">{s.motherName}</TableCell>
                      <TableCell className="whitespace-nowrap">{s.bankName}</TableCell>
                      <TableCell className="whitespace-nowrap font-mono text-xs">{s.bankAccountNumber}</TableCell>
                      <TableCell className="whitespace-nowrap font-mono text-xs">{s.ifscCode}</TableCell>
                      <TableCell className="whitespace-nowrap text-xs">{s.mobileNumber}</TableCell>
                      <TableCell className="whitespace-nowrap max-w-[200px] truncate text-xs">{s.address}</TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(s)}>
                            <Edit className="h-4 w-4 text-primary" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => deleteStudent(s.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={18} className="h-32 text-center text-muted-foreground font-medium italic">
                      No student records matching your criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </div>
    </MainLayout>
  );
}

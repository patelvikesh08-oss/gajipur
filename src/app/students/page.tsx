"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { useStudentStore, Student, Gender } from "@/lib/student-store";
import { useSessionStore } from "@/lib/session-store";
import { useFirestore } from "@/firebase";
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
import { Plus, Search, Filter, Trash2, Edit, User, CreditCard, Building2, Phone, Home, FileUp, FileDown, AlertCircle, Loader2, Database } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";

const ACADEMIC_STANDARDS = [
  { id: "Balvatika", label: "Balvatika / બાલવાટિકા" },
  { id: "1st Standard", label: "1st Standard / ધોરણ ૧" },
  { id: "2nd Standard", label: "2nd Standard / ધોરણ ૨" },
  { id: "3rd Standard", label: "3rd Standard / ધોરણ ૩" },
  { id: "4th Standard", label: "4th Standard / ધોરણ ૪" },
  { id: "5th Standard", label: "5th Standard / ધોરણ ૫" },
  { id: "6th Standard", label: "6th Standard / ધોરણ ૬" },
  { id: "7th Standard", label: "7th Standard / ધોરણ ૭" },
  { id: "8th Standard", label: "8th Standard / ધોરણ ૮" },
];

export default function StudentsPage() {
  const firestore = useFirestore();
  const { students, addStudent, updateStudent, deleteStudent, isLoaded: studentsLoaded, error: fetchError } = useStudentStore();
  const { academicYear, isLoaded: sessionLoaded } = useSessionStore();
  
  const [search, setSearch] = useState("");
  const [filterGender, setFilterGender] = useState<string>("all");
  const [filterStandard, setFilterStandard] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isSaving, setIsSaving] = useState(false);

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

  if (!sessionLoaded) return null;

  const filteredStudents = students.filter((s) => {
    const sName = s.name || "";
    const sStd = s.academicStandard || "";
    const sGR = s.grNumber || "";
    const sRoll = s.rollNumber || "";

    const matchesSearch = sName.toLowerCase().includes(search.toLowerCase()) || 
                          sStd.toLowerCase().includes(search.toLowerCase()) ||
                          sGR.toLowerCase().includes(search.toLowerCase()) ||
                          sRoll.toLowerCase().includes(search.toLowerCase());
    const matchesGender = filterGender === "all" || s.gender === filterGender;
    const matchesStandard = filterStandard === "all" || s.academicStandard === filterStandard;
    return matchesSearch && matchesGender && matchesStandard;
  }).sort((a, b) => (a.rollNumber || "").localeCompare(b.rollNumber || "", undefined, { numeric: true }));

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.academicStandard) {
      toast({
        title: "Validation Error / ભૂલ",
        description: "Please provide both name and standard. / કૃપા કરીને નામ અને ધોરણ આપો.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      if (editingStudent) {
        updateStudent({ ...editingStudent, ...formData });
        toast({ title: "Update Initiated / અપડેટ શરૂ", description: `${formData.name} is being updated...` });
        setEditingStudent(null);
      } else {
        addStudent(formData);
        toast({ title: "Enrollment Initiated / નોંધણી શરૂ", description: `${formData.name} is being added to the database...` });
      }
      resetForm();
      setIsAddDialogOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
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
      rollNumber: s.rollNumber || "",
      name: s.name || "",
      birthday: s.birthday || "",
      gender: s.gender || "Male",
      academicStandard: s.academicStandard || "",
      attendance: s.attendance || 0,
      grNumber: s.grNumber || "",
      caste: s.caste || "",
      childUniqueId: s.childUniqueId || "",
      aadharCard: s.aadharCard || "",
      fatherName: s.fatherName || "",
      motherName: s.motherName || "",
      bankName: s.bankName || "",
      bankAccountNumber: s.bankAccountNumber || "",
      ifscCode: s.ifscCode || "",
      address: s.address || "",
      mobileNumber: s.mobileNumber || "",
    });
    setIsAddDialogOpen(true);
  };

  const exportToCSV = () => {
    if (filteredStudents.length === 0) return;
    
    const headers = ["Roll No", "G.R. No", "Name", "Gender", "Standard", "Birthday", "Attendance (%)", "Caste", "Child UID", "Aadhar", "Father", "Mother", "Bank", "Account", "IFSC", "Mobile", "Address"];
    const rows = filteredStudents.map(s => [
      `"${s.rollNumber || ""}"`,
      `"${s.grNumber || ""}"`,
      `"${s.name || ""}"`,
      `"${s.gender || ""}"`,
      `"${s.academicStandard || ""}"`,
      `"${s.birthday || ""}"`,
      s.attendance || 0,
      `"${s.caste || ""}"`,
      `"${s.childUniqueId || ""}"`,
      `"${s.aadharCard || ""}"`,
      `"${s.fatherName || ""}"`,
      `"${s.motherName || ""}"`,
      `"${s.bankName || ""}"`,
      `"${s.bankAccountNumber || ""}"`,
      `"${s.ifscCode || ""}"`,
      `"${s.mobileNumber || ""}"`,
      `"${(s.address || "").replace(/"/g, '""')}"`
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
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-800">Student Information System / વિદ્યાર્થી માહિતી પ્રણાલી</h1>
            {!firestore ? (
              <Badge variant="destructive" className="animate-pulse">
                <Database className="w-3 h-3 mr-1" /> Disconnected
              </Badge>
            ) : (
              <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                <Database className="w-3 h-3 mr-1" /> Connected
              </Badge>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3">
             <Badge variant="outline" className="px-4 py-2 bg-white font-bold text-primary border-primary/20">
                Session / સત્ર: {academicYear}
             </Badge>
          </div>
        </div>

        {fetchError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Sync Error / ભૂલ</AlertTitle>
            <AlertDescription>
              Failed to load student data. This may be due to incomplete Firebase configuration.
            </AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto flex-1">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search / શોધો..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStandard} onValueChange={setFilterStandard}>
              <SelectTrigger className="w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Standard / ધોરણ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Standards / બધા ધોરણ</SelectItem>
                {ACADEMIC_STANDARDS.map(std => (
                  <SelectItem key={std.id} value={std.id}>{std.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterGender} onValueChange={setFilterGender}>
              <SelectTrigger className="w-[150px]">
                <User className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Gender / જાતિ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Gender / બધી જાતિ</SelectItem>
                <SelectItem value="Male">Male / પુરૂષ</SelectItem>
                <SelectItem value="Female">Female / સ્ત્રી</SelectItem>
                <SelectItem value="Other">Other / અન્ય</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button variant="outline" className="font-bold hidden md:flex" asChild>
              <Link href="/bulk-entry">
                <FileUp className="w-4 h-4 mr-2" />
                Import / આયાત
              </Link>
            </Button>
            <Button variant="outline" className="font-bold hidden md:flex" onClick={exportToCSV}>
              <FileDown className="w-4 h-4 mr-2" />
              Export / નિકાસ
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
                  Enroll Student / વિદ્યાર્થી ઉમેરો
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] p-0">
                <DialogHeader className="p-6 pb-0">
                  <DialogTitle className="font-headline text-xl">{editingStudent ? "Update Student Profile / પ્રોફાઇલ અપડેટ કરો" : "New Student Enrollment / નવી નોંધણી"}</DialogTitle>
                </DialogHeader>
                <ScrollArea className="h-full max-h-[70vh] px-6">
                  <div className="grid gap-6 py-4">
                    <div className="space-y-4">
                      <h3 className="text-sm font-bold text-primary flex items-center gap-2 border-b pb-2">
                        <User className="w-4 h-4" /> Personal Details / વ્યક્તિગત વિગતો
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="rollNo">Roll Number / રોલ નંબર</Label>
                          <Input id="rollNo" value={formData.rollNumber} onChange={(e) => setFormData({...formData, rollNumber: e.target.value})} placeholder="e.g. 01" />
                        </div>
                        <div className="grid gap-2 md:col-span-2">
                          <Label htmlFor="name">Full Name / પૂરું નામ</Label>
                          <Input id="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="gender">Gender / જાતિ</Label>
                          <Select value={formData.gender} onValueChange={(val: Gender) => setFormData({...formData, gender: val})}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Male">Male / પુરૂષ</SelectItem>
                              <SelectItem value="Female">Female / સ્ત્રી</SelectItem>
                              <SelectItem value="Other">Other / અન્ય</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="birthday">Birthday / જન્મ તારીખ</Label>
                          <Input id="birthday" type="date" value={formData.birthday} onChange={(e) => setFormData({...formData, birthday: e.target.value})} />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="fatherName">Father's Name / પિતાનું નામ</Label>
                          <Input id="fatherName" value={formData.fatherName} onChange={(e) => setFormData({...formData, fatherName: e.target.value})} />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="motherName">Mother's Name / માતાનું નામ</Label>
                          <Input id="motherName" value={formData.motherName} onChange={(e) => setFormData({...formData, motherName: e.target.value})} />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-sm font-bold text-primary flex items-center gap-2 border-b pb-2">
                        <CreditCard className="w-4 h-4" /> Identification & Schooling / શાળાકીય વિગતો
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="grNumber">G.R. Number / જી.આર. નંબર</Label>
                          <Input id="grNumber" value={formData.grNumber} onChange={(e) => setFormData({...formData, grNumber: e.target.value})} />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="std">Academic Standard / ધોરણ</Label>
                          <Select value={formData.academicStandard} onValueChange={(val) => setFormData({...formData, academicStandard: val})}>
                            <SelectTrigger id="std">
                              <SelectValue placeholder="Select standard" />
                            </SelectTrigger>
                            <SelectContent>
                              {ACADEMIC_STANDARDS.map(std => (
                                <SelectItem key={std.id} value={std.id}>{std.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="childUid">Child Unique ID / ચાઇલ્ડ આઈડી</Label>
                          <Input id="childUid" value={formData.childUniqueId} onChange={(e) => setFormData({...formData, childUniqueId: e.target.value})} />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="aadhar">Aadhar Number / આધાર કાર્ડ</Label>
                          <Input id="aadhar" value={formData.aadharCard} onChange={(e) => setFormData({...formData, aadharCard: e.target.value})} />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="caste">Caste / જાતિ (પેટા)</Label>
                          <Input id="caste" value={formData.caste} onChange={(e) => setFormData({...formData, caste: e.target.value})} />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="attendance">Attendance / હાજરી (%)</Label>
                          <Input id="attendance" type="number" value={formData.attendance} onChange={(e) => setFormData({...formData, attendance: parseInt(e.target.value) || 0})} />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-sm font-bold text-primary flex items-center gap-2 border-b pb-2">
                        <Building2 className="w-4 h-4" /> Bank & Contact / સંપર્ક અને બેંક વિગતો
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="bankName">Bank Name / બેંકનું નામ</Label>
                          <Input id="bankName" value={formData.bankName} onChange={(e) => setFormData({...formData, bankName: e.target.value})} />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="accNo">Account Number / ખાતા નંબર</Label>
                          <Input id="accNo" value={formData.bankAccountNumber} onChange={(e) => setFormData({...formData, bankAccountNumber: e.target.value})} />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="ifsc">IFSC Code / આઈએફએસસી</Label>
                          <Input id="ifsc" value={formData.ifscCode} onChange={(e) => setFormData({...formData, ifscCode: e.target.value})} />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="mobile"><Phone className="w-3 h-3 inline mr-1" /> Mobile Number / મોબાઈલ</Label>
                          <Input id="mobile" value={formData.mobileNumber} onChange={(e) => setFormData({...formData, mobileNumber: e.target.value})} />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="address"><Home className="w-3 h-3 inline mr-1" /> Residential Address / સરનામું</Label>
                          <Input id="address" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
                <DialogFooter className="p-6 pt-0 border-t mt-4">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} disabled={isSaving}>Cancel / રદ કરો</Button>
                  <Button onClick={handleSave} className="font-bold" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving... / સાચવી રહ્યાં છે...
                      </>
                    ) : (
                      "Save Student / વિદ્યાર્થી સાચવો"
                    )}
                  </Button>
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
                  <TableHead className="font-bold uppercase tracking-wider text-xs whitespace-nowrap w-auto text-center">Roll / રોલ</TableHead>
                  <TableHead className="font-bold uppercase tracking-wider text-xs whitespace-nowrap">G.R. No / જી.આર.</TableHead>
                  <TableHead className="font-bold uppercase tracking-wider text-xs whitespace-nowrap">Full Name / નામ</TableHead>
                  <TableHead className="font-bold uppercase tracking-wider text-xs whitespace-nowrap">Gender / જાતિ</TableHead>
                  <TableHead className="font-bold uppercase tracking-wider text-xs whitespace-nowrap">Standard / ધોરણ</TableHead>
                  <TableHead className="font-bold uppercase tracking-wider text-xs whitespace-nowrap">Birthday / જ.તા.</TableHead>
                  <TableHead className="font-bold uppercase tracking-wider text-xs whitespace-nowrap text-center">Att. / હાજરી</TableHead>
                  <TableHead className="font-bold uppercase tracking-wider text-xs whitespace-nowrap">Caste / જ્ઞાતિ</TableHead>
                  <TableHead className="font-bold uppercase tracking-wider text-xs whitespace-nowrap">Mobile / મોબાઈલ</TableHead>
                  <TableHead className="text-right font-bold uppercase tracking-wider text-xs whitespace-nowrap">Actions / ક્રિયા</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentsLoaded ? (
                  filteredStudents.length > 0 ? (
                    filteredStudents.map((s) => (
                      <TableRow key={s.id} className="hover:bg-muted/20 transition-colors">
                        <TableCell className="font-black text-primary whitespace-nowrap text-center">{s.rollNumber}</TableCell>
                        <TableCell className="font-bold text-slate-500 whitespace-nowrap">{s.grNumber}</TableCell>
                        <TableCell className="font-bold text-slate-900 whitespace-nowrap">{s.name}</TableCell>
                        <TableCell className="whitespace-nowrap">
                          <Badge variant="outline" className="text-[10px] uppercase">
                            {s.gender === 'Male' ? 'Male / પુરૂષ' : s.gender === 'Female' ? 'Female / સ્ત્રી' : 'Other / અન્ય'}
                          </Badge>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <Badge variant="secondary" className="font-bold">{s.academicStandard}</Badge>
                        </TableCell>
                        <TableCell className="whitespace-nowrap font-medium">{s.birthday}</TableCell>
                        <TableCell className="whitespace-nowrap text-center">
                          <span className={`font-bold ${(s.attendance || 0) < 75 ? 'text-destructive' : 'text-primary'}`}>
                            {s.attendance || 0}%
                          </span>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">{s.caste}</TableCell>
                        <TableCell className="whitespace-nowrap text-xs">{s.mobileNumber}</TableCell>
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
                      <TableCell colSpan={10} className="h-32 text-center text-muted-foreground font-medium italic">
                        No student records matching your criteria. / કોઈ માહિતી મળી નથી.
                      </TableCell>
                    </TableRow>
                  )
                ) : (
                  <TableRow>
                    <TableCell colSpan={10} className="h-32 text-center">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Loader2 className="w-6 h-6 animate-spin" />
                        <p>Syncing student database... / ડેટા સિંક્રનાઇઝ થઈ રહ્યો છે...</p>
                      </div>
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

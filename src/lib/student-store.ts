
"use client";

import { useState, useEffect } from 'react';

export type Gender = 'Male' | 'Female' | 'Other';

export interface Student {
  id: string;
  rollNumber: string;
  name: string;
  birthday: string;
  gender: Gender;
  academicStandard: string;
  attendance: number;
  grNumber: string;
  caste: string;
  childUniqueId: string;
  aadharCard: string;
  fatherName: string;
  motherName: string;
  bankName: string;
  bankAccountNumber: string;
  ifscCode: string;
  address: string;
  mobileNumber: string;
}

const DEFAULT_STUDENTS: Student[] = [
  { 
    id: '1', 
    rollNumber: '01',
    name: 'Alice Johnson', 
    birthday: '2014-05-15', 
    gender: 'Female', 
    academicStandard: '5th Grade',
    attendance: 92,
    grNumber: 'GR-1001',
    caste: 'General',
    childUniqueId: 'UID-88229911',
    aadharCard: '1234-5678-9012',
    fatherName: 'Robert Johnson',
    motherName: 'Mary Johnson',
    bankName: 'State Bank',
    bankAccountNumber: '9988776655',
    ifscCode: 'SBIN0001234',
    address: '123 Maple St, Springfield',
    mobileNumber: '9876543210'
  },
  { 
    id: '2', 
    rollNumber: '02',
    name: 'Bob Smith', 
    birthday: '2013-11-20', 
    gender: 'Male', 
    academicStandard: '5th Grade',
    attendance: 85,
    grNumber: 'GR-1002',
    caste: 'OBC',
    childUniqueId: 'UID-88229922',
    aadharCard: '2345-6789-0123',
    fatherName: 'John Smith',
    motherName: 'Sarah Smith',
    bankName: 'National Bank',
    bankAccountNumber: '8877665544',
    ifscCode: 'NBIN0005678',
    address: '456 Oak Ave, Springfield',
    mobileNumber: '8765432109'
  }
];

export function calculateAge(birthday: string): number {
  if (!birthday) return 0;
  const birthDate = new Date(birthday);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

export function useStudentStore() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('edupulse_students');
    if (saved) {
      setStudents(JSON.parse(saved));
    } else {
      setStudents(DEFAULT_STUDENTS);
      localStorage.setItem('edupulse_students', JSON.stringify(DEFAULT_STUDENTS));
    }
    setIsLoaded(true);
  }, []);

  const addStudent = (student: Omit<Student, 'id'>) => {
    const newStudent = { ...student, id: Math.random().toString(36).substr(2, 9) };
    const updated = [...students, newStudent];
    setStudents(updated);
    localStorage.setItem('edupulse_students', JSON.stringify(updated));
  };

  const updateStudent = (updatedStudent: Student) => {
    const updated = students.map(s => s.id === updatedStudent.id ? updatedStudent : s);
    setStudents(updated);
    localStorage.setItem('edupulse_students', JSON.stringify(updated));
  };

  const deleteStudent = (id: string) => {
    const updated = students.filter(s => s.id !== id);
    setStudents(updated);
    localStorage.setItem('edupulse_students', JSON.stringify(updated));
  };

  const bulkAddStudents = (newStudents: any[]) => {
    const added = newStudents.map(s => ({
      id: Math.random().toString(36).substr(2, 9),
      rollNumber: s.rollNumber || "",
      name: s.name || "Unknown Student",
      birthday: s.birthday || "2015-01-01",
      gender: s.gender || 'Male',
      academicStandard: s.academicStandard || "Unknown",
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
      mobileNumber: ""
    }));
    const updated = [...students, ...added];
    setStudents(updated);
    localStorage.setItem('edupulse_students', JSON.stringify(updated));
  };

  return { students, addStudent, updateStudent, deleteStudent, bulkAddStudents, isLoaded };
}

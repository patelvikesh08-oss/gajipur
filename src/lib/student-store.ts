'use client';

import { useFirestore, useCollection } from '@/firebase';
import { collection, doc, addDoc, updateDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import { useMemo } from 'react';

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
  const firestore = useFirestore();
  const studentsCollection = useMemo(() => firestore ? collection(firestore, 'students') : null, [firestore]);
  const { data: students, loading } = useCollection<Student>(studentsCollection);

  const addStudent = (student: Omit<Student, 'id'>) => {
    if (!firestore) return;
    addDoc(collection(firestore, 'students'), student);
  };

  const updateStudent = (updatedStudent: Student) => {
    if (!firestore) return;
    const { id, ...data } = updatedStudent;
    updateDoc(doc(firestore, 'students', id), data);
  };

  const deleteStudent = (id: string) => {
    if (!firestore) return;
    deleteDoc(doc(firestore, 'students', id));
  };

  const bulkAddStudents = async (newStudents: any[]) => {
    if (!firestore) return;
    const batch = writeBatch(firestore);
    newStudents.forEach(s => {
      const newDocRef = doc(collection(firestore, 'students'));
      batch.set(newDocRef, {
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
      });
    });
    await batch.commit();
  };

  return { 
    students: students || [], 
    addStudent, 
    updateStudent, 
    deleteStudent, 
    bulkAddStudents, 
    isLoaded: !loading 
  };
}
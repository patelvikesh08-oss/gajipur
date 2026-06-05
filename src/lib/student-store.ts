
'use client';

import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, doc, addDoc, updateDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors';

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
  try {
    const birthDate = new Date(birthday);
    if (isNaN(birthDate.getTime())) return 0;
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  } catch {
    return 0;
  }
}

export function useStudentStore() {
  const firestore = useFirestore();
  
  const studentsCollection = useMemoFirebase(() => 
    firestore ? collection(firestore, 'students') : null, 
  [firestore]);
  
  const { data: students, loading, error: fetchError } = useCollection<Student>(studentsCollection);

  const addStudent = (student: Omit<Student, 'id'>) => {
    if (!firestore) {
      const permissionError = new FirestorePermissionError({
        path: 'students',
        operation: 'create',
        requestResourceData: student,
      });
      errorEmitter.emit('permission-error', permissionError);
      return;
    }
    
    const colRef = collection(firestore, 'students');
    addDoc(colRef, student).catch(async (serverError) => {
      const permissionError = new FirestorePermissionError({
        path: colRef.path,
        operation: 'create',
        requestResourceData: student,
      } satisfies SecurityRuleContext);
      errorEmitter.emit('permission-error', permissionError);
    });
  };

  const updateStudent = (updatedStudent: Student) => {
    if (!firestore) return;
    const { id, ...data } = updatedStudent;
    const docRef = doc(firestore, 'students', id);
    
    updateDoc(docRef, data).catch(async (serverError) => {
      const permissionError = new FirestorePermissionError({
        path: docRef.path,
        operation: 'update',
        requestResourceData: data,
      } satisfies SecurityRuleContext);
      errorEmitter.emit('permission-error', permissionError);
    });
  };

  const deleteStudent = (id: string) => {
    if (!firestore) return;
    const docRef = doc(firestore, 'students', id);
    
    deleteDoc(docRef).catch(async (serverError) => {
      const permissionError = new FirestorePermissionError({
        path: docRef.path,
        operation: 'delete',
      } satisfies SecurityRuleContext);
      errorEmitter.emit('permission-error', permissionError);
    });
  };

  const bulkAddStudents = (newStudents: any[]) => {
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
    
    batch.commit().catch(async (error) => {
      const permissionError = new FirestorePermissionError({
        path: 'students (batch)',
        operation: 'write',
      } satisfies SecurityRuleContext);
      errorEmitter.emit('permission-error', permissionError);
    });
  };

  return { 
    students: students || [], 
    addStudent, 
    updateStudent, 
    deleteStudent, 
    bulkAddStudents, 
    isLoaded: !loading,
    error: fetchError
  };
}

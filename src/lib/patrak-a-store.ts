
'use client';

import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, doc, setDoc, query, where } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors';
import { useCallback } from 'react';

export interface PatrakAEntry {
  id: string;
  studentId: string;
  academicYear: string;
  semester: string;
  subjectMarks: Record<string, number>;
}

export function usePatrakAStore(academicYear: string, semester: string) {
  const firestore = useFirestore();
  
  const patrakAQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, 'patrakA'),
      where('academicYear', '==', academicYear),
      where('semester', '==', semester)
    );
  }, [firestore, academicYear, semester]);
  
  const { data: entries, loading, error: fetchError } = useCollection<PatrakAEntry>(patrakAQuery);

  const saveEntry = useCallback((studentId: string, subjectMarks: Record<string, number>) => {
    if (!firestore) return;
    
    const entryId = `${studentId}-${academicYear}-${semester}`.replace(/\s+/g, '-').toLowerCase();
    const docRef = doc(firestore, 'patrakA', entryId);
    
    const data = {
      id: entryId,
      studentId,
      academicYear,
      semester,
      subjectMarks
    };

    setDoc(docRef, data, { merge: true }).catch(async (err) => {
      const permissionError = new FirestorePermissionError({
        path: docRef.path,
        operation: 'write',
        requestResourceData: data,
      } satisfies SecurityRuleContext);
      errorEmitter.emit('permission-error', permissionError);
    });
  }, [firestore, academicYear, semester]);

  const getMarksForStudent = useCallback((studentId: string) => {
    const entry = entries?.find(e => e.studentId === studentId);
    return entry?.subjectMarks || {};
  }, [entries]);

  return { 
    entries: entries || [], 
    saveEntry, 
    getMarksForStudent,
    isLoaded: !loading,
    error: fetchError
  };
}

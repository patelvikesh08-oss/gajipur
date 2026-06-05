
'use client';

import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors';
import { useCallback } from 'react';

export interface SchoolDetail {
  name: string;
  indexNumber: string;
  district: string;
  block: string;
  address: string;
  mobile: string;
  principal: string;
}

const DEFAULT_SCHOOL: SchoolDetail = {
  name: 'EduPulse Global Academy',
  indexNumber: 'SCH-IDX-998877',
  district: 'Springfield',
  block: 'Central',
  address: '123 Education Lane, Knowledge Park',
  mobile: '+91 98765 43210',
  principal: 'Dr. Jane Smith',
};

export function useSchoolStore() {
  const firestore = useFirestore();
  
  const schoolDocRef = useMemoFirebase(() => 
    firestore ? doc(firestore, 'configs', 'school') : null, 
  [firestore]);
  
  const { data: schoolData, loading, error: fetchError } = useDoc<SchoolDetail>(schoolDocRef);

  const school = schoolData || DEFAULT_SCHOOL;

  const updateSchool = useCallback((updates: Partial<SchoolDetail>) => {
    if (!firestore) return;
    
    const newSchool = { ...school, ...updates };
    const docRef = doc(firestore, 'configs', 'school');

    setDoc(docRef, newSchool, { merge: true }).catch(async (err) => {
      const permissionError = new FirestorePermissionError({
        path: docRef.path,
        operation: 'write',
        requestResourceData: newSchool,
      } satisfies SecurityRuleContext);
      errorEmitter.emit('permission-error', permissionError);
    });
  }, [firestore, school]);

  return { school, updateSchool, isLoaded: !loading, error: fetchError };
}

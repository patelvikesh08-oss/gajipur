
'use client';

import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, doc, setDoc } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors';
import { useCallback } from 'react';

export type AssessmentType = 'TRIMASIK' | 'SVADHYAY' | 'PAT/SAT' | 'PATRAK-B';

export interface MarksMapping {
  id: string;
  standard: string;
  semester: string;
  assessmentType: AssessmentType;
  maxMarks: number;
}

export function useMarksMappingStore() {
  const firestore = useFirestore();
  
  const marksCollection = useMemoFirebase(() => 
    firestore ? collection(firestore, 'marksMappings') : null, 
  [firestore]);
  
  const { data: marks, loading, error: fetchError } = useCollection<MarksMapping>(marksCollection);

  const saveMarksMapping = (standard: string, semester: string, assessmentType: AssessmentType, maxMarks: number) => {
    if (!firestore) return;
    
    const mappingId = `${standard}-${semester}-${assessmentType}`.replace(/\s+/g, '-').toLowerCase();
    const docRef = doc(firestore, 'marksMappings', mappingId);
    
    const data = {
      id: mappingId,
      standard,
      semester,
      assessmentType,
      maxMarks
    };

    setDoc(docRef, data, { merge: true }).catch(async (err) => {
      const permissionError = new FirestorePermissionError({
        path: docRef.path,
        operation: 'write',
        requestResourceData: data,
      } satisfies SecurityRuleContext);
      errorEmitter.emit('permission-error', permissionError);
    });
  };

  const getMarksFor = useCallback((standard: string, semester: string, type: AssessmentType): number => {
    if (!marks) return 100;
    const mapping = marks.find(m => m.standard === standard && m.semester === semester && m.assessmentType === type);
    return mapping ? mapping.maxMarks : 100;
  }, [marks]);

  return { 
    marks: marks || [], 
    saveMarksMapping, 
    getMarksFor, 
    isLoaded: !loading,
    error: fetchError
  };
}

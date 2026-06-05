
'use client';

import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors';

export interface SubjectMapping {
  id: string;
  standard: string;
  semester: string;
  subjects: string[];
}

export function useSubjectStore() {
  const firestore = useFirestore();
  
  const mappingsCollection = useMemoFirebase(() => 
    firestore ? collection(firestore, 'subjectMappings') : null, 
  [firestore]);
  
  const { data: mappings, loading, error: fetchError } = useCollection<SubjectMapping>(mappingsCollection);

  const saveMapping = (standard: string, semester: string, subjects: string[]) => {
    if (!firestore) return;
    
    // Create a stable ID based on standard and semester to prevent duplicates
    const mappingId = `${standard}-${semester}`.replace(/\s+/g, '-').toLowerCase();
    const docRef = doc(firestore, 'subjectMappings', mappingId);
    
    const data = {
      id: mappingId,
      standard,
      semester,
      subjects
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

  const deleteMapping = (id: string) => {
    if (!firestore) return;
    const docRef = doc(firestore, 'subjectMappings', id);
    
    deleteDoc(docRef).catch(async (err) => {
      const permissionError = new FirestorePermissionError({
        path: docRef.path,
        operation: 'delete',
      } satisfies SecurityRuleContext);
      errorEmitter.emit('permission-error', permissionError);
    });
  };

  return { 
    mappings: mappings || [], 
    saveMapping, 
    deleteMapping, 
    isLoaded: !loading,
    error: fetchError
  };
}

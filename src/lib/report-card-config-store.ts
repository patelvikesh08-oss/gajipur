
'use client';

import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors';
import { useCallback } from 'react';

export interface FieldMapping {
  field: string;
  label: string;
  x: number; // percentage from left
  y: number; // percentage from top
}

export interface ReportCardConfig {
  templateUrlPage1: string | null;
  templateUrlPage2: string | null;
  fieldMappingsPage1: FieldMapping[];
  fieldMappingsPage2: FieldMapping[];
  templateType: 'pdf' | 'image' | 'default';
  schoolName: string;
  schoolIndex: string;
  districtBlock: string;
  conductItems: { id: string; label: string; checked: boolean }[];
}

const DEFAULT_CONFIG: ReportCardConfig = {
  templateUrlPage1: null,
  templateUrlPage2: null,
  fieldMappingsPage1: [],
  fieldMappingsPage2: [],
  templateType: 'default',
  schoolName: 'EduPulse Global Academy',
  schoolIndex: 'SCH-IDX-998877',
  districtBlock: 'Springfield / Central',
  conductItems: [
    { id: "punctuality", label: "Punctuality / સમયપાલન", checked: true },
    { id: "cleanliness", label: "Cleanliness / સ્વચ્છતા", checked: true },
    { id: "behavior", label: "Social Behavior / સામાજિક વર્તન", checked: true },
    { id: "leadership", label: "Leadership / નેતૃત્વ", checked: true },
    { id: "discipline", label: "Discipline / શિસ્ત", checked: true },
  ],
};

export function useReportCardConfigStore() {
  const firestore = useFirestore();
  
  const configDocRef = useMemoFirebase(() => 
    firestore ? doc(firestore, 'configs', 'reportcard') : null, 
  [firestore]);
  
  const { data: configData, loading, error: fetchError } = useDoc<ReportCardConfig>(configDocRef);

  const config = configData || DEFAULT_CONFIG;

  const updateConfig = useCallback((updates: Partial<ReportCardConfig>) => {
    if (!firestore) return;
    
    const newConfig = { ...config, ...updates };
    const docRef = doc(firestore, 'configs', 'reportcard');

    setDoc(docRef, newConfig, { merge: true }).catch(async (err) => {
      const permissionError = new FirestorePermissionError({
        path: docRef.path,
        operation: 'write',
        requestResourceData: newConfig,
      } satisfies SecurityRuleContext);
      errorEmitter.emit('permission-error', permissionError);
    });
  }, [firestore, config]);

  return { config, updateConfig, isLoaded: !loading, error: fetchError };
}

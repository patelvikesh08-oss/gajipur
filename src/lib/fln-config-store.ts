
'use client';

import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors';
import { useCallback } from 'react';

export type FLNCategory = 'FOUNDATION' | 'LITERACY' | 'NUMERICY';

export interface FLNConfig {
  categories: Record<FLNCategory, string[]>;
}

const DEFAULT_MILESTONES = [
  "Recognizes letters and sounds", "Blends simple CV words", "Reads 20+ sight words",
  "Understands basic word structures", "Reads simple sentences fluently", "Comprehends short stories",
  "Writes simple sentences", "Uses punctuation correctly", "Demonstrates active listening", "Expresses ideas verbally"
];

const DEFAULT_NUMERACY = [
  "Counts 1-50 correctly", "Identifies numbers up to 100", "Understands more/less concepts",
  "Simple addition within 10", "Simple subtraction within 10", "Identifies basic 2D shapes",
  "Understands place value (Tens/Ones)", "Continues simple patterns", "Tells time to the hour", "Measures length using non-standard units"
];

const INITIAL_CONFIG: FLNConfig = {
  categories: {
    FOUNDATION: [...DEFAULT_MILESTONES],
    LITERACY: [...DEFAULT_MILESTONES],
    NUMERICY: [...DEFAULT_NUMERACY]
  }
};

export function useFLNConfigStore() {
  const firestore = useFirestore();
  
  const configDocRef = useMemoFirebase(() => 
    firestore ? doc(firestore, 'configs', 'fln') : null, 
  [firestore]);
  
  const { data: configData, loading, error: fetchError } = useDoc<FLNConfig>(configDocRef);

  const config = configData || INITIAL_CONFIG;

  const updateMilestone = useCallback((category: FLNCategory, index: number, value: string) => {
    if (!firestore || !config) return;
    
    const updatedCategory = [...config.categories[category]];
    updatedCategory[index] = value;
    
    const newConfig = {
      ...config,
      categories: {
        ...config.categories,
        [category]: updatedCategory
      }
    };
    
    const docRef = doc(firestore, 'configs', 'fln');
    setDoc(docRef, newConfig, { merge: true }).catch(async (err) => {
      const permissionError = new FirestorePermissionError({
        path: docRef.path,
        operation: 'write',
        requestResourceData: newConfig,
      } satisfies SecurityRuleContext);
      errorEmitter.emit('permission-error', permissionError);
    });
  }, [firestore, config]);

  return { 
    config, 
    updateMilestone, 
    isLoaded: !loading,
    error: fetchError 
  };
}

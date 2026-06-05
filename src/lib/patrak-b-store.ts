
'use client';

import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors';
import { useCallback } from 'react';

export interface PatrakBField {
  id: number;
  title: string;
  subColumnCount: number;
  subColumnLabels: string[];
}

export interface PatrakBConfig {
  fields: PatrakBField[];
  maxTotalSubColumns: number;
}

const INITIAL_CONFIG: PatrakBConfig = {
  fields: [
    { id: 1, title: 'Field 1', subColumnCount: 1, subColumnLabels: ['Milestone 1'] },
    { id: 2, title: 'Field 2', subColumnCount: 1, subColumnLabels: ['Milestone 1'] },
    { id: 3, title: 'Field 3', subColumnCount: 1, subColumnLabels: ['Milestone 1'] },
    { id: 4, title: 'Field 4', subColumnCount: 1, subColumnLabels: ['Milestone 1'] }
  ],
  maxTotalSubColumns: 40
};

export function usePatrakBStore() {
  const firestore = useFirestore();
  
  const configDocRef = useMemoFirebase(() => 
    firestore ? doc(firestore, 'configs', 'patrakb') : null, 
  [firestore]);
  
  const { data: configData, loading, error: fetchError } = useDoc<PatrakBConfig>(configDocRef);

  const config = configData || INITIAL_CONFIG;

  const saveConfig = useCallback((newConfig: PatrakBConfig) => {
    if (!firestore) return;
    const docRef = doc(firestore, 'configs', 'patrakb');
    setDoc(docRef, newConfig, { merge: true }).catch(async (err) => {
      const permissionError = new FirestorePermissionError({
        path: docRef.path,
        operation: 'write',
        requestResourceData: newConfig,
      } satisfies SecurityRuleContext);
      errorEmitter.emit('permission-error', permissionError);
    });
  }, [firestore]);

  const setMaxTotalSubColumns = useCallback((max: number) => {
    if (!config) return;
    saveConfig({ ...config, maxTotalSubColumns: max });
  }, [config, saveConfig]);

  const setFieldCount = useCallback((count: number) => {
    if (!config) return;
    const currentFields = [...config.fields];
    let updatedFields;
    
    if (count > currentFields.length) {
      const additionalCount = count - currentFields.length;
      const currentTotalSubCols = currentFields.reduce((sum, f) => sum + f.subColumnCount, 0);
      if (currentTotalSubCols + additionalCount > config.maxTotalSubColumns) {
        return;
      }

      const additional = Array.from({ length: additionalCount }, (_, i) => ({
        id: currentFields.length + i + 1,
        title: `Field ${currentFields.length + i + 1}`,
        subColumnCount: 1,
        subColumnLabels: ['Milestone 1']
      }));
      updatedFields = [...currentFields, ...additional];
    } else {
      updatedFields = currentFields.slice(0, count);
    }
    
    saveConfig({ ...config, fields: updatedFields });
  }, [config, saveConfig]);

  const updateField = useCallback((fieldId: number, updates: Partial<PatrakBField>) => {
    if (!config) return;
    const updatedFields = config.fields.map(f => {
      if (f.id === fieldId) {
        const newField = { ...f, ...updates };
        
        if (updates.subColumnCount !== undefined) {
          const currentTotal = config.fields.reduce((sum, field) => sum + field.subColumnCount, 0);
          const diff = updates.subColumnCount - f.subColumnCount;
          if (currentTotal + diff > config.maxTotalSubColumns) {
            return f;
          }

          const newLabels = [...(newField.subColumnLabels || [])];
          if (updates.subColumnCount > newLabels.length) {
            for (let i = newLabels.length; i < updates.subColumnCount; i++) {
              newLabels.push(`Milestone ${i + 1}`);
            }
          }
          newField.subColumnLabels = newLabels.slice(0, updates.subColumnCount);
        }
        return newField;
      }
      return f;
    });
    saveConfig({ ...config, fields: updatedFields });
  }, [config, saveConfig]);

  return { 
    config, 
    setMaxTotalSubColumns, 
    setFieldCount, 
    updateField, 
    isLoaded: !loading,
    error: fetchError
  };
}

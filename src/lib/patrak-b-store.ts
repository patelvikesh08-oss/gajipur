"use client";

import { useState, useEffect, useCallback } from 'react';

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

export function usePatrakBStore() {
  const [config, setConfig] = useState<PatrakBConfig>({ 
    fields: [
      { id: 1, title: 'Field 1', subColumnCount: 1, subColumnLabels: ['Milestone 1'] },
      { id: 2, title: 'Field 2', subColumnCount: 1, subColumnLabels: ['Milestone 1'] },
      { id: 3, title: 'Field 3', subColumnCount: 1, subColumnLabels: ['Milestone 1'] },
      { id: 4, title: 'Field 4', subColumnCount: 1, subColumnLabels: ['Milestone 1'] }
    ],
    maxTotalSubColumns: 40
  });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('edupulse_patrak_b_config_v4');
    if (saved) {
      setConfig(JSON.parse(saved));
    }
    setIsLoaded(true);
  }, []);

  const setMaxTotalSubColumns = useCallback((max: number) => {
    setConfig(prev => {
      const newConfig = { ...prev, maxTotalSubColumns: max };
      localStorage.setItem('edupulse_patrak_b_config_v4', JSON.stringify(newConfig));
      return newConfig;
    });
  }, []);

  const setFieldCount = useCallback((count: number) => {
    setConfig(prev => {
      const currentFields = [...prev.fields];
      let updatedFields;
      
      if (count > currentFields.length) {
        const additionalCount = count - currentFields.length;
        const currentTotalSubCols = currentFields.reduce((sum, f) => sum + f.subColumnCount, 0);
        if (currentTotalSubCols + additionalCount > prev.maxTotalSubColumns) {
          return prev;
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
      
      const newConfig = { ...prev, fields: updatedFields };
      localStorage.setItem('edupulse_patrak_b_config_v4', JSON.stringify(newConfig));
      return newConfig;
    });
  }, []);

  const updateField = useCallback((fieldId: number, updates: Partial<PatrakBField>) => {
    setConfig(prev => {
      const updatedFields = prev.fields.map(f => {
        if (f.id === fieldId) {
          const newField = { ...f, ...updates };
          
          // Sync subColumnLabels array size if subColumnCount changed
          if (updates.subColumnCount !== undefined) {
            const currentTotal = prev.fields.reduce((sum, field) => sum + field.subColumnCount, 0);
            const diff = updates.subColumnCount - f.subColumnCount;
            if (currentTotal + diff > prev.maxTotalSubColumns) {
              return f; // Revert change if it exceeds total max
            }

            const newLabels = [...(newField.subColumnLabels || [])];
            if (updates.subColumnCount > newLabels.length) {
              for (let i = newLabels.length; i < updates.subColumnCount; i++) {
                newLabels.push(`Milestone ${i + 1}`);
              }
            } else {
              newField.subColumnLabels = newLabels.slice(0, updates.subColumnCount);
            }
            newField.subColumnLabels = newLabels.slice(0, updates.subColumnCount);
          }
          return newField;
        }
        return f;
      });
      const newConfig = { ...prev, fields: updatedFields };
      localStorage.setItem('edupulse_patrak_b_config_v4', JSON.stringify(newConfig));
      return newConfig;
    });
  }, []);

  return { config, setMaxTotalSubColumns, setFieldCount, updateField, isLoaded };
}
"use client";

import { useState, useEffect, useCallback } from 'react';

export interface PatrakBField {
  id: number;
  subColumnCount: number;
}

export interface PatrakBConfig {
  fields: PatrakBField[];
  maxTotalSubColumns: number;
}

export function usePatrakBStore() {
  const [config, setConfig] = useState<PatrakBConfig>({ 
    fields: [
      { id: 1, subColumnCount: 1 },
      { id: 2, subColumnCount: 1 },
      { id: 3, subColumnCount: 1 },
      { id: 4, subColumnCount: 1 }
    ],
    maxTotalSubColumns: 40
  });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('edupulse_patrak_b_config_v3');
    if (saved) {
      setConfig(JSON.parse(saved));
    }
    setIsLoaded(true);
  }, []);

  const saveToStorage = (newConfig: PatrakBConfig) => {
    setConfig(newConfig);
    localStorage.setItem('edupulse_patrak_b_config_v3', JSON.stringify(newConfig));
  };

  const setMaxTotalSubColumns = useCallback((max: number) => {
    setConfig(prev => {
      const newConfig = { ...prev, maxTotalSubColumns: max };
      localStorage.setItem('edupulse_patrak_b_config_v3', JSON.stringify(newConfig));
      return newConfig;
    });
  }, []);

  const setFieldCount = useCallback((count: number) => {
    setConfig(prev => {
      const currentFields = [...prev.fields];
      let updatedFields;
      
      if (count > currentFields.length) {
        const additionalCount = count - currentFields.length;
        // Check if adding 'additionalCount' (assuming at least 1 sub-col each) exceeds total max
        const currentTotalSubCols = currentFields.reduce((sum, f) => sum + f.subColumnCount, 0);
        if (currentTotalSubCols + additionalCount > prev.maxTotalSubColumns) {
          // Cannot add this many fields without exceeding global max
          return prev;
        }

        const additional = Array.from({ length: additionalCount }, (_, i) => ({
          id: currentFields.length + i + 1,
          subColumnCount: 1
        }));
        updatedFields = [...currentFields, ...additional];
      } else {
        updatedFields = currentFields.slice(0, count);
      }
      
      const newConfig = { ...prev, fields: updatedFields };
      localStorage.setItem('edupulse_patrak_b_config_v3', JSON.stringify(newConfig));
      return newConfig;
    });
  }, []);

  const updateSubColumnCount = useCallback((fieldId: number, subCount: number) => {
    setConfig(prev => {
      const field = prev.fields.find(f => f.id === fieldId);
      if (!field) return prev;

      const currentTotal = prev.fields.reduce((sum, f) => sum + f.subColumnCount, 0);
      const diff = subCount - field.subColumnCount;

      if (currentTotal + diff > prev.maxTotalSubColumns) {
        // Exceeds global limit
        return prev;
      }

      const updatedFields = prev.fields.map(f => 
        f.id === fieldId ? { ...f, subColumnCount: subCount } : f
      );
      const newConfig = { ...prev, fields: updatedFields };
      localStorage.setItem('edupulse_patrak_b_config_v3', JSON.stringify(newConfig));
      return newConfig;
    });
  }, []);

  return { config, setMaxTotalSubColumns, setFieldCount, updateSubColumnCount, isLoaded };
}

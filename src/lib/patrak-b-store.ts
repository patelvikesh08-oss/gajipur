"use client";

import { useState, useEffect, useCallback } from 'react';

export interface PatrakBField {
  id: number;
  subColumnCount: number;
}

export interface PatrakBConfig {
  fields: PatrakBField[];
}

export function usePatrakBStore() {
  const [config, setConfig] = useState<PatrakBConfig>({ 
    fields: [
      { id: 1, subColumnCount: 1 },
      { id: 2, subColumnCount: 1 },
      { id: 3, subColumnCount: 1 },
      { id: 4, subColumnCount: 1 }
    ] 
  });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('edupulse_patrak_b_config_v2');
    if (saved) {
      setConfig(JSON.parse(saved));
    }
    setIsLoaded(true);
  }, []);

  const updateConfig = useCallback((fields: PatrakBField[]) => {
    const newConfig = { fields };
    setConfig(newConfig);
    localStorage.setItem('edupulse_patrak_b_config_v2', JSON.stringify(newConfig));
  }, []);

  const setFieldCount = useCallback((count: number) => {
    setConfig(prev => {
      const currentFields = [...prev.fields];
      let updatedFields;
      
      if (count > currentFields.length) {
        // Add new fields
        const additional = Array.from({ length: count - currentFields.length }, (_, i) => ({
          id: currentFields.length + i + 1,
          subColumnCount: 1
        }));
        updatedFields = [...currentFields, ...additional];
      } else {
        // Truncate fields
        updatedFields = currentFields.slice(0, count);
      }
      
      localStorage.setItem('edupulse_patrak_b_config_v2', JSON.stringify({ fields: updatedFields }));
      return { fields: updatedFields };
    });
  }, []);

  const updateSubColumnCount = useCallback((fieldId: number, subCount: number) => {
    setConfig(prev => {
      const updatedFields = prev.fields.map(f => 
        f.id === fieldId ? { ...f, subColumnCount: subCount } : f
      );
      const newConfig = { fields: updatedFields };
      localStorage.setItem('edupulse_patrak_b_config_v2', JSON.stringify(newConfig));
      return newConfig;
    });
  }, []);

  return { config, updateConfig, setFieldCount, updateSubColumnCount, isLoaded };
}

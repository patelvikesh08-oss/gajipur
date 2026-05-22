
"use client";

import { useState, useEffect } from 'react';

export interface SubjectMapping {
  id: string;
  standard: string;
  subjects: string[];
}

const DEFAULT_MAPPINGS: SubjectMapping[] = [
  { id: '1', standard: '5th Grade', subjects: ['Mathematics', 'Science', 'English', 'Social Studies', 'Environmental Studies'] },
  { id: '2', standard: '6th Grade', subjects: ['Mathematics', 'Science', 'English', 'Social Studies', 'Gujarati'] },
];

export function useSubjectStore() {
  const [mappings, setMappings] = useState<SubjectMapping[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('edupulse_subject_mappings');
    if (saved) {
      setMappings(JSON.parse(saved));
    } else {
      setMappings(DEFAULT_MAPPINGS);
      localStorage.setItem('edupulse_subject_mappings', JSON.stringify(DEFAULT_MAPPINGS));
    }
    setIsLoaded(true);
  }, []);

  const saveMapping = (standard: string, subjects: string[]) => {
    const existingIndex = mappings.findIndex(m => m.standard === standard);
    let updated;
    if (existingIndex > -1) {
      updated = [...mappings];
      updated[existingIndex] = { ...updated[existingIndex], subjects };
    } else {
      updated = [...mappings, { id: Math.random().toString(36).substr(2, 9), standard, subjects }];
    }
    setMappings(updated);
    localStorage.setItem('edupulse_subject_mappings', JSON.stringify(updated));
  };

  const deleteMapping = (id: string) => {
    const updated = mappings.filter(m => m.id !== id);
    setMappings(updated);
    localStorage.setItem('edupulse_subject_mappings', JSON.stringify(updated));
  };

  return { mappings, saveMapping, deleteMapping, isLoaded };
}

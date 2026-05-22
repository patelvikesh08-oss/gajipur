
"use client";

import { useState, useEffect, useCallback } from 'react';

export interface SubjectMapping {
  id: string;
  standard: string;
  semester: string;
  subjects: string[];
}

const DEFAULT_MAPPINGS: SubjectMapping[] = [
  { id: '1', standard: '5th Grade', semester: 'Semester 1', subjects: ['Mathematics', 'Science', 'English', 'Social Studies', 'Environmental Studies'] },
  { id: '2', standard: '6th Grade', semester: 'Semester 1', subjects: ['Mathematics', 'Science', 'English', 'Social Studies', 'Gujarati'] },
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

  const saveMapping = useCallback((standard: string, semester: string, subjects: string[]) => {
    setMappings(prev => {
      const existingIndex = prev.findIndex(m => m.standard === standard && m.semester === semester);
      let updated;
      if (existingIndex > -1) {
        updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], subjects };
      } else {
        updated = [...prev, { id: Math.random().toString(36).substr(2, 9), standard, semester, subjects }];
      }
      localStorage.setItem('edupulse_subject_mappings', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const deleteMapping = useCallback((id: string) => {
    setMappings(prev => {
      const updated = prev.filter(m => m.id !== id);
      localStorage.setItem('edupulse_subject_mappings', JSON.stringify(updated));
      return updated;
    });
  }, []);

  return { mappings, saveMapping, deleteMapping, isLoaded };
}

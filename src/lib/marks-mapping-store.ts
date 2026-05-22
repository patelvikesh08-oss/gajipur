
"use client";

import { useState, useEffect, useCallback } from 'react';

export type AssessmentType = 'TRIMASIK' | 'SVADHYAY' | 'PAT/SAT' | 'PATRAK-B';

export interface MarksMapping {
  id: string;
  standard: string;
  semester: string;
  assessmentType: AssessmentType;
  maxMarks: number;
}

const DEFAULT_MARKS: MarksMapping[] = [
  { id: 'm1', standard: '5th Grade', semester: 'Semester 1', assessmentType: 'TRIMASIK', maxMarks: 80 },
  { id: 'm2', standard: '5th Grade', semester: 'Semester 1', assessmentType: 'SVADHYAY', maxMarks: 10 },
  { id: 'm3', standard: '5th Grade', semester: 'Semester 1', assessmentType: 'PAT/SAT', maxMarks: 25 },
  { id: 'm4', standard: '5th Grade', semester: 'Semester 1', assessmentType: 'PATRAK-B', maxMarks: 100 },
];

export function useMarksMappingStore() {
  const [marks, setMarks] = useState<MarksMapping[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('edupulse_marks_mappings');
    if (saved) {
      setMarks(JSON.parse(saved));
    } else {
      setMarks(DEFAULT_MARKS);
      localStorage.setItem('edupulse_marks_mappings', JSON.stringify(DEFAULT_MARKS));
    }
    setIsLoaded(true);
  }, []);

  const saveMarksMapping = useCallback((standard: string, semester: string, assessmentType: AssessmentType, maxMarks: number) => {
    setMarks(prev => {
      const existingIndex = prev.findIndex(m => 
        m.standard === standard && 
        m.semester === semester && 
        m.assessmentType === assessmentType
      );
      
      let updated;
      if (existingIndex > -1) {
        updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], maxMarks };
      } else {
        updated = [...prev, { 
          id: Math.random().toString(36).substr(2, 9), 
          standard, 
          semester, 
          assessmentType, 
          maxMarks 
        }];
      }
      localStorage.setItem('edupulse_marks_mappings', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const getMarksFor = useCallback((standard: string, semester: string, type: AssessmentType): number => {
    const mapping = marks.find(m => m.standard === standard && m.semester === semester && m.assessmentType === type);
    return mapping ? mapping.maxMarks : 100;
  }, [marks]);

  return { marks, saveMarksMapping, getMarksFor, isLoaded };
}

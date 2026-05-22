
"use client";

import { useState, useEffect, useCallback } from 'react';

export type AcademicYear = '2023-24' | '2024-25' | '2025-26';
export type Semester = 'Semester 1' | 'Semester 2' | 'Annual';

export function useSessionStore() {
  const [academicYear, setAcademicYear] = useState<AcademicYear>('2024-25');
  const [semester, setSemester] = useState<Semester>('Semester 1');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedYear = localStorage.getItem('edupulse_year') as AcademicYear;
    const savedSemester = localStorage.getItem('edupulse_semester') as Semester;
    
    if (savedYear) setAcademicYear(savedYear);
    if (savedSemester) setSemester(savedSemester);
    
    setIsLoaded(true);
  }, []);

  const updateYear = useCallback((year: AcademicYear) => {
    setAcademicYear(year);
    localStorage.setItem('edupulse_year', year);
  }, []);

  const updateSemester = useCallback((sem: Semester) => {
    setSemester(sem);
    localStorage.setItem('edupulse_semester', sem);
  }, []);

  return { academicYear, semester, updateYear, updateSemester, isLoaded };
}


"use client";

import { useState, useEffect } from 'react';

export type Gender = 'Male' | 'Female' | 'Other';

export interface Student {
  id: string;
  name: string;
  age: number;
  gender: Gender;
  academicStandard: string;
}

const DEFAULT_STUDENTS: Student[] = [
  { id: '1', name: 'Alice Johnson', age: 10, gender: 'Female', academicStandard: '5th Grade' },
  { id: '2', name: 'Bob Smith', age: 11, gender: 'Male', academicStandard: '5th Grade' },
  { id: '3', name: 'Charlie Davis', age: 12, gender: 'Male', academicStandard: '6th Grade' },
  { id: '4', name: 'Diana Ross', age: 10, gender: 'Female', academicStandard: '5th Grade' },
  { id: '5', name: 'Edward Norton', age: 13, gender: 'Male', academicStandard: '7th Grade' },
  { id: '6', name: 'Fiona Apple', age: 14, gender: 'Female', academicStandard: '8th Grade' },
  { id: '7', name: 'George Miller', age: 15, gender: 'Male', academicStandard: '9th Grade' },
  { id: '8', name: 'Hannah Brown', age: 10, gender: 'Female', academicStandard: '5th Grade' },
  { id: '9', name: 'Ian Wright', age: 12, gender: 'Male', academicStandard: '6th Grade' },
  { id: '10', name: 'Jenny Kim', age: 13, gender: 'Female', academicStandard: '7th Grade' },
];

export function useStudentStore() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('edupulse_students');
    if (saved) {
      setStudents(JSON.parse(saved));
    } else {
      setStudents(DEFAULT_STUDENTS);
      localStorage.setItem('edupulse_students', JSON.stringify(DEFAULT_STUDENTS));
    }
    setIsLoaded(true);
  }, []);

  const addStudent = (student: Omit<Student, 'id'>) => {
    const newStudent = { ...student, id: Math.random().toString(36).substr(2, 9) };
    const updated = [...students, newStudent];
    setStudents(updated);
    localStorage.setItem('edupulse_students', JSON.stringify(updated));
  };

  const updateStudent = (updatedStudent: Student) => {
    const updated = students.map(s => s.id === updatedStudent.id ? updatedStudent : s);
    setStudents(updated);
    localStorage.setItem('edupulse_students', JSON.stringify(updated));
  };

  const deleteStudent = (id: string) => {
    const updated = students.filter(s => s.id !== id);
    setStudents(updated);
    localStorage.setItem('edupulse_students', JSON.stringify(updated));
  };

  const bulkAddStudents = (newStudents: Omit<Student, 'id'>[]) => {
    const added = newStudents.map(s => ({ ...s, id: Math.random().toString(36).substr(2, 9) }));
    const updated = [...students, ...added];
    setStudents(updated);
    localStorage.setItem('edupulse_students', JSON.stringify(updated));
  };

  return { students, addStudent, updateStudent, deleteStudent, bulkAddStudents, isLoaded };
}

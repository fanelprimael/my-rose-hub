import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  class: string;
  parentName: string;
  parentPhone: string;
  address: string;
  status: 'active' | 'inactive' | 'graduated';
  createdAt: string;
}

interface StudentsContextType {
  students: Student[];
  addStudent: (student: Omit<Student, 'id' | 'createdAt'>) => void;
  updateStudent: (id: string, student: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  getStudent: (id: string) => Student | undefined;
}

const StudentsContext = createContext<StudentsContextType | undefined>(undefined);

export const StudentsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>([
    {
      id: '1',
      firstName: 'Amirah',
      lastName: 'Diallo',
      dateOfBirth: '2015-03-15',
      class: 'CP',
      parentName: 'Fatou Diallo',
      parentPhone: '+221 77 123 4567',
      address: 'Dakar, Sénégal',
      status: 'active',
      createdAt: '2024-01-15',
    },
    {
      id: '2',
      firstName: 'Ibrahim',
      lastName: 'Ba',
      dateOfBirth: '2014-07-22',
      class: 'CE1',
      parentName: 'Moussa Ba',
      parentPhone: '+221 76 987 6543',
      address: 'Thiès, Sénégal',
      status: 'active',
      createdAt: '2024-01-16',
    },
    {
      id: '3',
      firstName: 'Mariama',
      lastName: 'Sall',
      dateOfBirth: '2013-11-08',
      class: 'CE2',
      parentName: 'Aminata Sall',
      parentPhone: '+221 78 555 1234',
      address: 'Saint-Louis, Sénégal',
      status: 'active',
      createdAt: '2024-01-17',
    },
  ]);

  const addStudent = (studentData: Omit<Student, 'id' | 'createdAt'>) => {
    const newStudent: Student = {
      ...studentData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    setStudents(prev => [...prev, newStudent]);
  };

  const updateStudent = (id: string, studentData: Partial<Student>) => {
    setStudents(prev => 
      prev.map(student => 
        student.id === id ? { ...student, ...studentData } : student
      )
    );
  };

  const deleteStudent = (id: string) => {
    setStudents(prev => prev.filter(student => student.id !== id));
  };

  const getStudent = (id: string) => {
    return students.find(student => student.id === id);
  };

  return (
    <StudentsContext.Provider value={{
      students,
      addStudent,
      updateStudent,
      deleteStudent,
      getStudent
    }}>
      {children}
    </StudentsContext.Provider>
  );
};

export const useStudentsContext = () => {
  const context = useContext(StudentsContext);
  if (context === undefined) {
    throw new Error('useStudentsContext must be used within a StudentsProvider');
  }
  return context;
};
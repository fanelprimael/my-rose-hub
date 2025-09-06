import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subjects: string[];
  classes: string[];
  status: 'active' | 'inactive';
  hireDate: string;
  salary: number;
}

interface TeachersContextType {
  teachers: Teacher[];
  addTeacher: (teacher: Omit<Teacher, 'id'>) => void;
  updateTeacher: (id: string, teacher: Partial<Teacher>) => void;
  deleteTeacher: (id: string) => void;
  getTeacher: (id: string) => Teacher | undefined;
}

const TeachersContext = createContext<TeachersContextType | undefined>(undefined);

export const TeachersProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [teachers, setTeachers] = useState<Teacher[]>([
    {
      id: '1',
      firstName: 'Khadija',
      lastName: 'Ndiaye',
      email: 'k.ndiaye@laroseraie.sn',
      phone: '+221 77 111 2222',
      subjects: ['Français', 'Mathématiques'],
      classes: ['CP', 'CE1'],
      status: 'active',
      hireDate: '2020-09-01',
      salary: 150000,
    },
    {
      id: '2',
      firstName: 'Alioune',
      lastName: 'Sarr',
      email: 'a.sarr@laroseraie.sn',
      phone: '+221 76 333 4444',
      subjects: ['Sciences', 'Histoire-Géographie'],
      classes: ['CE2', 'CM1'],
      status: 'active',
      hireDate: '2019-08-15',
      salary: 175000,
    },
    {
      id: '3',
      firstName: 'Aïcha',
      lastName: 'Fall',
      email: 'a.fall@laroseraie.sn',
      phone: '+221 78 555 6666',
      subjects: ['Anglais', 'Éducation Physique'],
      classes: ['CM1', 'CM2'],
      status: 'active',
      hireDate: '2021-01-10',
      salary: 140000,
    },
  ]);

  const addTeacher = (teacherData: Omit<Teacher, 'id'>) => {
    const newTeacher: Teacher = {
      ...teacherData,
      id: Date.now().toString(),
    };
    setTeachers(prev => [...prev, newTeacher]);
  };

  const updateTeacher = (id: string, teacherData: Partial<Teacher>) => {
    setTeachers(prev => 
      prev.map(teacher => 
        teacher.id === id ? { ...teacher, ...teacherData } : teacher
      )
    );
  };

  const deleteTeacher = (id: string) => {
    setTeachers(prev => prev.filter(teacher => teacher.id !== id));
  };

  const getTeacher = (id: string) => {
    return teachers.find(teacher => teacher.id === id);
  };

  return (
    <TeachersContext.Provider value={{
      teachers,
      addTeacher,
      updateTeacher,
      deleteTeacher,
      getTeacher
    }}>
      {children}
    </TeachersContext.Provider>
  );
};

export const useTeachersContext = () => {
  const context = useContext(TeachersContext);
  if (context === undefined) {
    throw new Error('useTeachersContext must be used within a TeachersProvider');
  }
  return context;
};
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface SchoolClass {
  id: string;
  name: string;
  level: string;
  capacity: number;
  currentStudents: number;
  teacher: string;
  room: string;
  schedule: string;
  status: 'active' | 'inactive';
}

interface ClassesContextType {
  classes: SchoolClass[];
  addClass: (classData: Omit<SchoolClass, 'id'>) => void;
  updateClass: (id: string, classData: Partial<SchoolClass>) => void;
  deleteClass: (id: string) => void;
  getClass: (id: string) => SchoolClass | undefined;
}

const ClassesContext = createContext<ClassesContextType | undefined>(undefined);

export const ClassesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [classes, setClasses] = useState<SchoolClass[]>([
    {
      id: '1',
      name: 'CP A',
      level: 'CP',
      capacity: 25,
      currentStudents: 22,
      teacher: 'Khadija Ndiaye',
      room: 'Salle 101',
      schedule: '8h00 - 12h00',
      status: 'active',
    },
    {
      id: '2',
      name: 'CE1 A',
      level: 'CE1',
      capacity: 30,
      currentStudents: 28,
      teacher: 'Khadija Ndiaye',
      room: 'Salle 102',
      schedule: '8h00 - 12h30',
      status: 'active',
    },
    {
      id: '3',
      name: 'CE2 A',
      level: 'CE2',
      capacity: 30,
      currentStudents: 25,
      teacher: 'Alioune Sarr',
      room: 'Salle 201',
      schedule: '8h00 - 13h00',
      status: 'active',
    },
    {
      id: '4',
      name: 'CM1 A',
      level: 'CM1',
      capacity: 32,
      currentStudents: 30,
      teacher: 'Alioune Sarr',
      room: 'Salle 202',
      schedule: '8h00 - 13h30',
      status: 'active',
    },
    {
      id: '5',
      name: 'CM2 A',
      level: 'CM2',
      capacity: 32,
      currentStudents: 29,
      teacher: 'Aïcha Fall',
      room: 'Salle 301',
      schedule: '8h00 - 14h00',
      status: 'active',
    },
  ]);

  const addClass = (classData: Omit<SchoolClass, 'id'>) => {
    const newClass: SchoolClass = {
      ...classData,
      id: Date.now().toString(),
    };
    setClasses(prev => [...prev, newClass]);
  };

  const updateClass = (id: string, classData: Partial<SchoolClass>) => {
    setClasses(prev => 
      prev.map(schoolClass => 
        schoolClass.id === id ? { ...schoolClass, ...classData } : schoolClass
      )
    );
  };

  const deleteClass = (id: string) => {
    setClasses(prev => prev.filter(schoolClass => schoolClass.id !== id));
  };

  const getClass = (id: string) => {
    return classes.find(schoolClass => schoolClass.id === id);
  };

  return (
    <ClassesContext.Provider value={{
      classes,
      addClass,
      updateClass,
      deleteClass,
      getClass
    }}>
      {children}
    </ClassesContext.Provider>
  );
};

export const useClassesContext = () => {
  const context = useContext(ClassesContext);
  if (context === undefined) {
    throw new Error('useClassesContext must be used within a ClassesProvider');
  }
  return context;
};
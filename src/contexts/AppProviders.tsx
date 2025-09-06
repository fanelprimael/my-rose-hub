import React from 'react';
import { StudentsProvider } from './StudentsContext';
import { TeachersProvider } from './TeachersContext';
import { ClassesProvider } from './ClassesContext';

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <StudentsProvider>
      <TeachersProvider>
        <ClassesProvider>
          {children}
        </ClassesProvider>
      </TeachersProvider>
    </StudentsProvider>
  );
};
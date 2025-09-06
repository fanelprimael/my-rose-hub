import React from 'react';
import { StudentsProvider } from './StudentsContext';
import { TeachersProvider } from './TeachersContext';
import { ClassesProvider } from './ClassesContext';
import { GradesProvider } from './GradesContext';
import { PaymentsProvider } from './PaymentsContext';

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <StudentsProvider>
      <TeachersProvider>
        <ClassesProvider>
          <GradesProvider>
            <PaymentsProvider>
              {children}
            </PaymentsProvider>
          </GradesProvider>
        </ClassesProvider>
      </TeachersProvider>
    </StudentsProvider>
  );
};
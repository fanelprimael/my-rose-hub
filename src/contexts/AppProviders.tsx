import React from "react";
import { StudentsProvider } from "./StudentsContext";
import { TeachersProvider } from "./TeachersContext";
import { ClassesProvider } from "./ClassesContext";
import { PaymentsProvider } from "./PaymentsContext";
import { GradesProvider } from "./GradesContext";
import { SchoolYearsProvider } from "./SchoolYearsContext";
import { BackupProvider } from "./BackupContext";
import { AuthProvider } from "./AuthContext";

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AuthProvider>
      <BackupProvider>
        <SchoolYearsProvider>
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
        </SchoolYearsProvider>
      </BackupProvider>
    </AuthProvider>
  );
};
import { useStudentsContext } from "@/contexts/StudentsContext";

export const useStudents = () => {
  const context = useStudentsContext();
  return {
    students: context.students,
    addStudent: context.addStudent,
    updateStudent: context.updateStudent,
    deleteStudent: context.deleteStudent,
    getStudent: context.getStudent,
  };
};
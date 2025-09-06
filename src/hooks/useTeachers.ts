import { useTeachersContext } from "@/contexts/TeachersContext";

export const useTeachers = () => {
  const context = useTeachersContext();
  return {
    teachers: context.teachers,
    addTeacher: context.addTeacher,
    updateTeacher: context.updateTeacher,
    deleteTeacher: context.deleteTeacher,
    getTeacher: context.getTeacher,
  };
};
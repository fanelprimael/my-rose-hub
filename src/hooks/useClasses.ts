import { useClassesContext } from "@/contexts/ClassesContext";

export const useClasses = () => {
  const context = useClassesContext();
  return {
    classes: context.classes,
    addClass: context.addClass,
    updateClass: context.updateClass,
    deleteClass: context.deleteClass,
    getClass: context.getClass,
  };
};
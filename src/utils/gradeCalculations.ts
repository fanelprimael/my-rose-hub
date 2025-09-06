// Utility functions for grade calculations and annual results

export interface SubjectResult {
  subject_name: string;
  evaluations: { [key: string]: number };
  average: number;
  hasAllEvaluations: boolean;
}

export interface StudentAnnualResult {
  student_id: string;
  student_name: string;
  class_name: string;
  subjectResults: SubjectResult[];
  generalAverage: number;
  totalSubjects: number;
  subjectsWithAllEvaluations: number;
  mention: string;
  canPass: boolean;
}

export const calculateSubjectAverage = (grades: any[], subjectName: string): SubjectResult => {
  const subjectGrades = grades.filter(grade => grade.subject_name === subjectName);
  
  // Group by evaluation
  const evaluations: { [key: string]: number } = {};
  subjectGrades.forEach(grade => {
    evaluations[grade.evaluation] = grade.grade;
  });
  
  // Calculate average (sum of all evaluations / number of evaluations)
  const evaluationValues = Object.values(evaluations);
  const average = evaluationValues.length > 0 ? 
    evaluationValues.reduce((sum, grade) => sum + grade, 0) / evaluationValues.length : 0;
  
  // Check if student has all 5 evaluations
  const expectedEvaluations = ['Evaluation 1', 'Evaluation 2', 'Evaluation 3', 'Evaluation 4', 'Evaluation 5'];
  const hasAllEvaluations = expectedEvaluations.every(evaluation => evaluations.hasOwnProperty(evaluation));
  
  return {
    subject_name: subjectName,
    evaluations,
    average: parseFloat(average.toFixed(2)),
    hasAllEvaluations
  };
};

export const calculateStudentAnnualResult = (studentId: string, studentName: string, className: string, grades: any[]): StudentAnnualResult => {
  const studentGrades = grades.filter(grade => grade.student_id === studentId);
  
  // Get unique subjects for this student
  const subjects = [...new Set(studentGrades.map(grade => grade.subject_name))];
  
  // Calculate results for each subject
  const subjectResults = subjects.map(subject => 
    calculateSubjectAverage(studentGrades, subject)
  );
  
  // Calculate general average (sum of subject averages / number of subjects)
  const subjectsWithGrades = subjectResults.filter(result => result.average > 0);
  const generalAverage = subjectsWithGrades.length > 0 ? 
    subjectsWithGrades.reduce((sum, result) => sum + result.average, 0) / subjectsWithGrades.length : 0;
  
  // Determine mention based on general average
  const mention = generalAverage >= 16 ? 'Très Bien' : 
                  generalAverage >= 14 ? 'Bien' : 
                  generalAverage >= 12 ? 'Assez Bien' : 
                  generalAverage >= 10 ? 'Passable' : 'Insuffisant';
  
  // Determine if student can pass (generally >= 10/20)
  const canPass = generalAverage >= 10;
  
  return {
    student_id: studentId,
    student_name: studentName,
    class_name: className,
    subjectResults,
    generalAverage: parseFloat(generalAverage.toFixed(2)),
    totalSubjects: subjects.length,
    subjectsWithAllEvaluations: subjectResults.filter(r => r.hasAllEvaluations).length,
    mention,
    canPass
  };
};

export const calculateClassResults = (students: any[], grades: any[], className?: string): StudentAnnualResult[] => {
  const filteredStudents = className ? students.filter(s => s.class === className) : students;
  
  return filteredStudents.map(student => 
    calculateStudentAnnualResult(
      student.id, 
      `${student.first_name} ${student.last_name}`, 
      student.class, 
      grades
    )
  );
};

export const getClassStatistics = (classResults: StudentAnnualResult[]) => {
  const totalStudents = classResults.length;
  const studentsWithResults = classResults.filter(r => r.generalAverage > 0);
  
  if (studentsWithResults.length === 0) {
    return {
      totalStudents,
      studentsEvaluated: 0,
      classAverage: 0,
      passRate: 0,
      mentions: {
        'Très Bien': 0,
        'Bien': 0,
        'Assez Bien': 0,
        'Passable': 0,
        'Insuffisant': 0
      }
    };
  }
  
  const classAverage = studentsWithResults.reduce((sum, result) => sum + result.generalAverage, 0) / studentsWithResults.length;
  const passCount = studentsWithResults.filter(r => r.canPass).length;
  const passRate = (passCount / studentsWithResults.length) * 100;
  
  // Count mentions
  const mentions = studentsWithResults.reduce((acc, result) => {
    acc[result.mention] = (acc[result.mention] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });
  
  return {
    totalStudents,
    studentsEvaluated: studentsWithResults.length,
    classAverage: parseFloat(classAverage.toFixed(2)),
    passRate: parseFloat(passRate.toFixed(1)),
    mentions: {
      'Très Bien': mentions['Très Bien'] || 0,
      'Bien': mentions['Bien'] || 0,
      'Assez Bien': mentions['Assez Bien'] || 0,
      'Passable': mentions['Passable'] || 0,
      'Insuffisant': mentions['Insuffisant'] || 0
    }
  };
};
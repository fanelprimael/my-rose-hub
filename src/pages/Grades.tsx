import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BookOpen, TrendingUp, Users, FileText, Plus, Eye, Edit, UserPlus, FileDown, BarChart3 } from "lucide-react";
import { useState } from "react";
import { useGradesContext } from "@/contexts/GradesContext";
import { useStudentsContext } from "@/contexts/StudentsContext";
import { AddGradeForm } from "@/components/forms/AddGradeForm";
import { AddMultipleGradesForm } from "@/components/forms/AddMultipleGradesForm";
import { ViewStudentGradesModal } from "@/components/forms/ViewStudentGradesModal";
import { ViewAnnualResultsModal } from "@/components/forms/ViewAnnualResultsModal";
import { generateBulletin } from "@/utils/exportUtils";
import { calculateClassResults } from "@/utils/gradeCalculations";

const Grades = () => {
  const { grades, loading } = useGradesContext();
  const { students } = useStudentsContext();
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedEvaluation, setSelectedEvaluation] = useState<string>("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showMultipleGradesForm, setShowMultipleGradesForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showAnnualResultsModal, setShowAnnualResultsModal] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [editMode, setEditMode] = useState(false);

  const classes = ['Maternelle 1', 'Maternelle 2', 'CI', 'CP', 'CE1', 'CE2', 'CM1', 'CM2'];
  const subjects = ['LECTURE', 'EXPRESSION ECRITE', 'EA(DESSIN)', 'ES', 'EST', 'MATHEMATIQUES', 'POESIE/CHANT', 'ANGLAIS'];
  const evaluations = ['Evaluation 1', 'Evaluation 2', 'Evaluation 3', 'Evaluation 4', 'Evaluation 5'];

  // Group students with their grades
  const studentsWithGrades = students.map(student => {
    const studentGrades = grades.filter(grade => grade.student_id === student.id);
    const filteredStudentGrades = studentGrades.filter(grade => {
      return (!selectedClass || selectedClass === "all" || grade.class_name === selectedClass) &&
             (!selectedSubject || selectedSubject === "all" || grade.subject_name === selectedSubject) &&
             (!selectedEvaluation || selectedEvaluation === "all" || grade.evaluation === selectedEvaluation);
    });
    
    return {
      ...student,
      gradeCount: filteredStudentGrades.length,
      averageGrade: filteredStudentGrades.length > 0 
        ? filteredStudentGrades.reduce((sum, grade) => sum + grade.grade, 0) / filteredStudentGrades.length 
        : 0,
      hasGrades: studentGrades.length > 0
    };
  }).filter(student => {
    return (!selectedClass || selectedClass === "all" || student.class === selectedClass);
  });

  // Calculate statistics from all filtered grades
  const allFilteredGrades = grades.filter(grade => {
    return (!selectedClass || selectedClass === "all" || grade.class_name === selectedClass) &&
           (!selectedSubject || selectedSubject === "all" || grade.subject_name === selectedSubject) &&
           (!selectedEvaluation || selectedEvaluation === "all" || grade.evaluation === selectedEvaluation);
  });
  
  const totalGrades = allFilteredGrades.length;
  const averageGrade = totalGrades > 0 ? 
    allFilteredGrades.reduce((sum, grade) => sum + grade.grade, 0) / totalGrades : 0;
  const passRate = totalGrades > 0 ? 
    (allFilteredGrades.filter(grade => grade.grade >= 10).length / totalGrades) * 100 : 0;


  const getGradeColor = (grade: number) => {
    if (grade >= 16) return "text-education-success";
    if (grade >= 12) return "text-education-secondary";
    if (grade >= 10) return "text-education-warning";
    return "text-education-danger";
  };

  const handleViewStudent = (studentId: string) => {
    setSelectedStudentId(studentId);
    setShowViewModal(true);
    setEditMode(false);
  };

  const handleEditStudent = (studentId: string) => {
    setSelectedStudentId(studentId);
    setEditMode(true);
    setShowMultipleGradesForm(true);
  };

  const handleGenerateBulletin = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    const studentGrades = grades.filter(grade => grade.student_id === studentId);
    
    if (student && studentGrades.length > 0) {
      generateBulletin(student, studentGrades);
    }
  };

  const handleCloseModal = () => {
    setShowViewModal(false);
    setSelectedStudentId("");
  };

  const handleCloseEditForm = () => {
    setShowMultipleGradesForm(false);
    setSelectedStudentId("");
    setEditMode(false);
  };

  const selectedStudent = students.find(s => s.id === selectedStudentId);
  
  // Calculate annual results for the selected class
  const annualResults = calculateClassResults(students, grades, selectedClass === "all" ? undefined : selectedClass);

  if (loading) {
    return <Layout><div className="flex items-center justify-center h-64">Chargement...</div></Layout>;
  }

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gestion des Notes</h1>
            <p className="text-muted-foreground">
              Saisie et suivi des évaluations des élèves
            </p>
          </div>
            <div className="flex gap-2">
            <Button onClick={() => setShowAddForm(true)} variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Note Simple
            </Button>
            <Button onClick={() => { setEditMode(false); setShowMultipleGradesForm(true); }} className="bg-primary hover:bg-primary/90">
              <UserPlus className="mr-2 h-4 w-4" />
              Saisie par Élève
            </Button>
          </div>
        </div>

        {/* Class Selection */}
        <Card className="shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-64">
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une classe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les classes</SelectItem>
                    {classes.map((className) => (
                      <SelectItem key={className} value={className}>
                        {className}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Badge variant="outline" className="text-sm">
                {selectedClass === "all" ? "Toutes les classes" : selectedClass}
              </Badge>
              {selectedClass !== "all" && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowAnnualResultsModal(true)}
                >
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Résultats Annuels
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="shadow-soft">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{totalGrades}</p>
                  <p className="text-sm text-muted-foreground">Notes Saisies</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-soft">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-8 w-8 text-education-success" />
                <div>
                  <p className="text-2xl font-bold">{averageGrade.toFixed(1)}</p>
                  <p className="text-sm text-muted-foreground">Moyenne Générale</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-8 w-8 text-education-accent" />
                <div>
                  <p className="text-2xl font-bold">{Math.round(passRate)}%</p>
                  <p className="text-sm text-muted-foreground">Taux de Réussite</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <FileText className="h-8 w-8 text-education-secondary" />
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-muted-foreground">Bulletins Générés</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>


        {/* Students Table */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Liste des Élèves ({studentsWithGrades.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID Élève</TableHead>
                    <TableHead>Nom de l'élève</TableHead>
                    <TableHead>Classe</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {studentsWithGrades.map((student) => (
                    <TableRow key={student.id} className="hover:bg-muted/50">
                      <TableCell className="font-mono text-sm">{student.id.slice(0, 8)}</TableCell>
                      <TableCell className="font-medium">{student.first_name} {student.last_name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{student.class}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleViewStudent(student.id)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Voir
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleEditStudent(student.id)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Modifier
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleGenerateBulletin(student.id)}
                            className="text-primary hover:text-primary/80"
                          >
                            <FileDown className="mr-2 h-4 w-4" />
                            Bulletin
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {studentsWithGrades.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>Aucun élève trouvé.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Forms and Modals */}
        {showAddForm && (
          <AddGradeForm onClose={() => setShowAddForm(false)} />
        )}

        {showMultipleGradesForm && (
          <AddMultipleGradesForm 
            onClose={handleCloseEditForm} 
            studentId={editMode ? selectedStudentId : undefined}
            editMode={editMode}
          />
        )}

        {showViewModal && selectedStudent && (
          <ViewStudentGradesModal
            studentId={selectedStudentId}
            studentName={`${selectedStudent.first_name} ${selectedStudent.last_name}`}
            studentClass={selectedStudent.class}
            onClose={handleCloseModal}
            onEdit={() => {
              setShowViewModal(false);
              handleEditStudent(selectedStudentId);
            }}
          />
        )}

        {showAnnualResultsModal && selectedClass !== "all" && (
          <ViewAnnualResultsModal
            isOpen={showAnnualResultsModal}
            onClose={() => setShowAnnualResultsModal(false)}
            classResults={annualResults}
            className={selectedClass}
          />
        )}
      </div>
    </Layout>
  );
};

export default Grades;
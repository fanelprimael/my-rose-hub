import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BookOpen, TrendingUp, Users, FileText, Plus, Eye, Edit, Trash2, UserPlus } from "lucide-react";
import { useState } from "react";
import { useGradesContext } from "@/contexts/GradesContext";
import { AddGradeForm } from "@/components/forms/AddGradeForm";
import { AddMultipleGradesForm } from "@/components/forms/AddMultipleGradesForm";

const Grades = () => {
  const { grades, loading, deleteGrade } = useGradesContext();
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedEvaluation, setSelectedEvaluation] = useState<string>("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showMultipleGradesForm, setShowMultipleGradesForm] = useState(false);

  const classes = ['Maternelle 1', 'Maternelle 2', 'CI', 'CP', 'CE1', 'CE2', 'CM1', 'CM2'];
  const subjects = ['LECTURE', 'EXPRESSION ECRITE', 'EA(DESSIN)', 'ES', 'EST', 'MATHEMATIQUES', 'POESIE/CHANT', 'ANGLAIS'];
  const evaluations = ['Evaluation 1', 'Evaluation 2', 'Evaluation 3', 'Evaluation 4', 'Evaluation 5'];

  // Filter grades based on selections
  const filteredGrades = grades.filter(grade => {
    return (!selectedClass || selectedClass === "all" || grade.class_name === selectedClass) &&
           (!selectedSubject || selectedSubject === "all" || grade.subject_name === selectedSubject) &&
           (!selectedEvaluation || selectedEvaluation === "all" || grade.evaluation === selectedEvaluation);
  });

  // Calculate statistics
  const totalGrades = filteredGrades.length;
  const averageGrade = totalGrades > 0 ? 
    filteredGrades.reduce((sum, grade) => sum + grade.grade, 0) / totalGrades : 0;
  const passRate = totalGrades > 0 ? 
    (filteredGrades.filter(grade => grade.grade >= 10).length / totalGrades) * 100 : 0;

  // Calculate subject averages
  const subjectStats = subjects.map(subject => {
    const subjectGrades = filteredGrades.filter(grade => grade.subject_name === subject);
    const average = subjectGrades.length > 0 ?
      subjectGrades.reduce((sum, grade) => sum + grade.grade, 0) / subjectGrades.length : 0;
    return {
      subject,
      average: parseFloat(average.toFixed(1)),
      count: subjectGrades.length
    };
  }).filter(stat => stat.count > 0);

  const getGradeColor = (grade: number) => {
    if (grade >= 16) return "text-education-success";
    if (grade >= 12) return "text-education-secondary";
    if (grade >= 10) return "text-education-warning";
    return "text-education-danger";
  };

  const getGradeBadge = (grade: number) => {
    if (grade >= 16) return "bg-education-success/10 text-education-success hover:bg-education-success/20";
    if (grade >= 12) return "bg-education-secondary/10 text-education-secondary hover:bg-education-secondary/20";
    if (grade >= 10) return "bg-education-warning/10 text-education-warning hover:bg-education-warning/20";
    return "bg-education-danger/10 text-education-danger hover:bg-education-danger/20";
  };

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
            <Button onClick={() => setShowMultipleGradesForm(true)} className="bg-primary hover:bg-primary/90">
              <UserPlus className="mr-2 h-4 w-4" />
              Saisie par Élève
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="shadow-soft">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une classe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les classes</SelectItem>
                    {classes.map((cls) => (
                      <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une matière" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les matières</SelectItem>
                    {subjects.map((subject) => (
                      <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <Select value={selectedEvaluation} onValueChange={setSelectedEvaluation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une évaluation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les évaluations</SelectItem>
                    {evaluations.map((evaluation) => (
                      <SelectItem key={evaluation} value={evaluation}>{evaluation}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button 
                variant="outline" 
                onClick={() => {
                  const { generateEvaluationBulletin } = require('@/utils/exportUtils');
                  // This will need to be implemented with a student/evaluation selector
                  console.log('Generate bulletin for evaluation:', selectedEvaluation);
                }}
              >
                <FileText className="mr-2 h-4 w-4" />
                Générer Bulletin
              </Button>
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

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Subject Averages */}
          <Card className="shadow-soft lg:col-span-2">
            <CardHeader>
              <CardTitle>Moyennes par Matière</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {subjectStats.map((stat, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center space-x-3">
                      <BookOpen className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">{stat.subject}</p>
                        <p className="text-sm text-muted-foreground">{stat.count} notes</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold ${getGradeColor(stat.average)}`}>
                        {stat.average}/20
                      </p>
                    </div>
                  </div>
                ))}
                {subjectStats.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    Aucune note trouvée pour les filtres sélectionnés
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Grades */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Notes Récentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredGrades.slice(0, 10).map((grade, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                    <div>
                      <p className="font-medium text-sm">{grade.student_name}</p>
                      <p className="text-xs text-muted-foreground">{grade.subject_name}</p>
                    </div>
                    <div className="text-right">
                      <Badge className={getGradeBadge(grade.grade)}>
                        {grade.grade}/20
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(grade.date).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                ))}
                {filteredGrades.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    Aucune note récente
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Grades Table */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Liste des Notes ({filteredGrades.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Élève</TableHead>
                    <TableHead>Classe</TableHead>
                    <TableHead>Matière</TableHead>
                    <TableHead>Évaluation</TableHead>
                    <TableHead>Note</TableHead>
                    <TableHead>Coefficient</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredGrades.map((grade) => (
                    <TableRow key={grade.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{grade.student_name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{grade.class_name}</Badge>
                      </TableCell>
                      <TableCell>{grade.subject_name}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{grade.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getGradeBadge(grade.grade)}>
                          {grade.grade}/20
                        </Badge>
                      </TableCell>
                      <TableCell>{grade.coefficient}</TableCell>
                      <TableCell>{new Date(grade.date).toLocaleDateString('fr-FR')}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteGrade(grade.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredGrades.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>Aucune note trouvée.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Forms */}
        {showAddForm && (
          <AddGradeForm onClose={() => setShowAddForm(false)} />
        )}

        {showMultipleGradesForm && (
          <AddMultipleGradesForm onClose={() => setShowMultipleGradesForm(false)} />
        )}
      </div>
    </Layout>
  );
};

export default Grades;
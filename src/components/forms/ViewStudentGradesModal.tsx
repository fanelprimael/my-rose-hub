import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { X } from "lucide-react";
import { useGradesContext } from "@/contexts/GradesContext";

interface ViewStudentGradesModalProps {
  studentId: string;
  studentName: string;
  studentClass: string;
  onClose: () => void;
  onEdit: () => void;
}

export const ViewStudentGradesModal: React.FC<ViewStudentGradesModalProps> = ({
  studentId,
  studentName,
  studentClass,
  onClose,
  onEdit
}) => {
  const { getGradesByStudent } = useGradesContext();
  const studentGrades = getGradesByStudent(studentId);

  const getGradeBadge = (grade: number) => {
    if (grade >= 16) return "bg-education-success/10 text-education-success hover:bg-education-success/20";
    if (grade >= 12) return "bg-education-secondary/10 text-education-secondary hover:bg-education-secondary/20";
    if (grade >= 10) return "bg-education-warning/10 text-education-warning hover:bg-education-warning/20";
    return "bg-education-danger/10 text-education-danger hover:bg-education-danger/20";
  };

  // Calculate average
  const totalGrades = studentGrades.length;
  const averageGrade = totalGrades > 0 ? 
    studentGrades.reduce((sum, grade) => sum + grade.grade, 0) / totalGrades : 0;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Notes de {studentName}</CardTitle>
            <p className="text-sm text-muted-foreground">
              Classe: {studentClass} • {totalGrades} notes • Moyenne: {averageGrade.toFixed(1)}/20
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onEdit}>
              Modifier les Notes
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {studentGrades.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Aucune note saisie pour cet élève.</p>
              <Button variant="outline" className="mt-4" onClick={onEdit}>
                Ajouter des notes
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Matière</TableHead>
                    <TableHead>Type d'évaluation</TableHead>
                    <TableHead>Évaluation</TableHead>
                    <TableHead>Note</TableHead>
                    <TableHead>Coefficient</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {studentGrades.map((grade) => (
                    <TableRow key={grade.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{grade.subject_name}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{grade.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{grade.evaluation}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getGradeBadge(grade.grade)}>
                          {grade.grade}/20
                        </Badge>
                      </TableCell>
                      <TableCell>{grade.coefficient}</TableCell>
                      <TableCell>{new Date(grade.date).toLocaleDateString('fr-FR')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
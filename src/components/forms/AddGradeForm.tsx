import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGradesContext } from "@/contexts/GradesContext";
import { useStudentsContext } from "@/contexts/StudentsContext";
import { X } from "lucide-react";

interface AddGradeFormProps {
  onClose: () => void;
}

const SUBJECTS = ['LECTURE', 'EXPRESSION ECRITE', 'EA(DESSIN)', 'ES', 'EST', 'MATHEMATIQUES', 'POESIE/CHANT', 'ANGLAIS'];
const EVALUATIONS = ['Evaluation 1', 'Evaluation 2', 'Evaluation 3', 'Evaluation 4', 'Evaluation 5'];

export const AddGradeForm: React.FC<AddGradeFormProps> = ({ onClose }) => {
  const { addGrade } = useGradesContext();
  const { students } = useStudentsContext();
  const [formData, setFormData] = useState({
    student_id: '',
    subject_name: '',
    grade: '',
    coefficient: '1',
    type: 'DS',
    evaluation: 'Evaluation 1',
    date: new Date().toISOString().split('T')[0]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const selectedStudent = students.find(s => s.id === formData.student_id);
      if (!selectedStudent) return;

      await addGrade({
        student_id: formData.student_id,
        student_name: `${selectedStudent.first_name} ${selectedStudent.last_name}`,
        class_name: selectedStudent.class,
        subject_name: formData.subject_name,
        grade: parseFloat(formData.grade),
        coefficient: parseInt(formData.coefficient),
        type: formData.type,
        evaluation: formData.evaluation,
        date: formData.date
      });
      onClose();
    } catch (error) {
      console.error('Error adding grade:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-lg mx-4">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Ajouter une Note</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="student_id">Élève *</Label>
              <Select value={formData.student_id} onValueChange={(value) => handleInputChange('student_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un élève" />
                </SelectTrigger>
                <SelectContent>
                  {students.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.first_name} {student.last_name} - {student.class}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject_name">Matière *</Label>
              <Select value={formData.subject_name} onValueChange={(value) => handleInputChange('subject_name', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une matière" />
                </SelectTrigger>
                <SelectContent>
                  {SUBJECTS.map((subject) => (
                    <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="evaluation">Évaluation *</Label>
              <Select value={formData.evaluation} onValueChange={(value) => handleInputChange('evaluation', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une évaluation" />
                </SelectTrigger>
                <SelectContent>
                  {EVALUATIONS.map((evaluation) => (
                    <SelectItem key={evaluation} value={evaluation}>{evaluation}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type *</Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DS">Devoir Surveillé</SelectItem>
                  <SelectItem value="Interrogation">Interrogation</SelectItem>
                  <SelectItem value="Examen">Examen</SelectItem>
                  <SelectItem value="Devoir">Devoir</SelectItem>
                  <SelectItem value="Controle">Contrôle</SelectItem>
                  <SelectItem value="Evaluation">Évaluation</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="grade">Note (/20) *</Label>
                <Input
                  id="grade"
                  type="number"
                  step="0.1"
                  min="0"
                  max="20"
                  value={formData.grade}
                  onChange={(e) => handleInputChange('grade', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="coefficient">Coefficient *</Label>
                <Input
                  id="coefficient"
                  type="number"
                  min="1"
                  max="5"
                  value={formData.coefficient}
                  onChange={(e) => handleInputChange('coefficient', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                required
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Ajout...' : 'Ajouter la Note'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
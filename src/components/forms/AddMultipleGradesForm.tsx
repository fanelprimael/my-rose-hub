import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";
import { useGradesContext } from "@/contexts/GradesContext";
import { useStudents } from "@/hooks/useStudents";
import { supabase } from "@/integrations/supabase/client";

interface Subject {
  id: string;
  name: string;
  coefficient: number;
}

interface AddMultipleGradesFormProps {
  onClose: () => void;
}

export const AddMultipleGradesForm: React.FC<AddMultipleGradesFormProps> = ({ onClose }) => {
  const { students } = useStudents();
  const { addMultipleGrades } = useGradesContext();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [formData, setFormData] = useState({
    student_id: '',
    evaluation: 'Evaluation 1',
    type: 'DS',
    date: new Date().toISOString().split('T')[0]
  });
  const [grades, setGrades] = useState<{ [subjectId: string]: string }>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching subjects:', error);
        return;
      }

      setSubjects(data || []);
      // Initialize grades object with empty values
      const initialGrades: { [subjectId: string]: string } = {};
      data?.forEach(subject => {
        initialGrades[subject.id] = '';
      });
      setGrades(initialGrades);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleGradeChange = (subjectId: string, value: string) => {
    setGrades(prev => ({
      ...prev,
      [subjectId]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.student_id) {
      alert('Veuillez sélectionner un élève');
      return;
    }

    // Filter out empty grades
    const validGrades = Object.entries(grades).filter(([_, grade]) => grade.trim() !== '');
    
    if (validGrades.length === 0) {
      alert('Veuillez saisir au moins une note');
      return;
    }

    const selectedStudent = students.find(s => s.id === formData.student_id);
    if (!selectedStudent) return;

    setLoading(true);

    try {
      const gradesToAdd = validGrades.map(([subjectId, grade]) => {
        const subject = subjects.find(s => s.id === subjectId);
        if (!subject) return null;

        return {
          student_id: formData.student_id,
          student_name: `${selectedStudent.first_name} ${selectedStudent.last_name}`,
          class_name: selectedStudent.class,
          subject_id: subjectId,
          subject_name: subject.name,
          grade: parseFloat(grade),
          coefficient: subject.coefficient,
          type: formData.type,
          evaluation: formData.evaluation,
          date: formData.date
        };
      }).filter(Boolean);

      await addMultipleGrades(gradesToAdd as any[]);
      onClose();
    } catch (error) {
      console.error('Error adding grades:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Saisir les Notes par Élève</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="student">Élève</Label>
                <Select value={formData.student_id} onValueChange={(value) => setFormData(prev => ({ ...prev, student_id: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un élève" />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map(student => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.first_name} {student.last_name} - {student.class}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="evaluation">Évaluation</Label>
                <Select value={formData.evaluation} onValueChange={(value) => setFormData(prev => ({ ...prev, evaluation: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Evaluation 1">Évaluation 1</SelectItem>
                    <SelectItem value="Evaluation 2">Évaluation 2</SelectItem>
                    <SelectItem value="Evaluation 3">Évaluation 3</SelectItem>
                    <SelectItem value="Evaluation 4">Évaluation 4</SelectItem>
                    <SelectItem value="Evaluation 5">Évaluation 5</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="type">Type</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue />
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

              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Notes par Matière</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {subjects.map(subject => (
                  <div key={subject.id} className="space-y-2">
                    <Label htmlFor={`grade-${subject.id}`}>
                      {subject.name} 
                      <span className="text-sm text-muted-foreground ml-1">(Coef. {subject.coefficient})</span>
                    </Label>
                    <Input
                      id={`grade-${subject.id}`}
                      type="number"
                      step="0.25"
                      min="0"
                      max="20"
                      placeholder="Note /20"
                      value={grades[subject.id] || ''}
                      onChange={(e) => handleGradeChange(subject.id, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Ajout en cours...' : 'Ajouter les Notes'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
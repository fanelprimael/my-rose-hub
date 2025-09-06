import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useClassesContext } from "@/contexts/ClassesContext";
import { useTeachersContext } from "@/contexts/TeachersContext";
import { X } from "lucide-react";

interface AddClassFormProps {
  onClose: () => void;
}

const LEVELS = ['Maternelle 1', 'Maternelle 2', 'CI', 'CP', 'CE1', 'CE2', 'CM1', 'CM2'];

export const AddClassForm: React.FC<AddClassFormProps> = ({ onClose }) => {
  const { addClass } = useClassesContext();
  const { teachers } = useTeachersContext();
  const [formData, setFormData] = useState({
    name: '',
    level: '',
    capacity: '30',
    student_count: '0',
    teacher: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await addClass({
        name: formData.name,
        level: formData.level,
        capacity: parseInt(formData.capacity),
        student_count: parseInt(formData.student_count),
        teacher: formData.teacher
      });
      onClose();
    } catch (error) {
      console.error('Error adding class:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-lg mx-4">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Ajouter une Classe</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom de la Classe *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Ex: CP A, CE1 B..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="level">Niveau *</Label>
              <Select value={formData.level} onValueChange={(value) => handleInputChange('level', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un niveau" />
                </SelectTrigger>
                <SelectContent>
                  {LEVELS.map((level) => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="teacher">Enseignant *</Label>
              <Select value={formData.teacher} onValueChange={(value) => handleInputChange('teacher', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un enseignant" />
                </SelectTrigger>
                <SelectContent>
                  {teachers.map((teacher) => (
                    <SelectItem key={teacher.id} value={`${teacher.first_name} ${teacher.last_name}`}>
                      {teacher.first_name} {teacher.last_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacité *</Label>
                <Input
                  id="capacity"
                  type="number"
                  min="1"
                  max="50"
                  value={formData.capacity}
                  onChange={(e) => handleInputChange('capacity', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="student_count">Élèves Actuels</Label>
                <Input
                  id="student_count"
                  type="number"
                  min="0"
                  value={formData.student_count}
                  onChange={(e) => handleInputChange('student_count', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Ajout...' : 'Ajouter la Classe'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTeachersContext } from "@/contexts/TeachersContext";
import { X } from "lucide-react";
import { toast } from "sonner";

interface Teacher {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  subjects: string[];
  classes: string[];
  hire_date?: string;
  status: string;
}

interface EditTeacherFormProps {
  teacher: Teacher;
  onClose: () => void;
}

export const EditTeacherForm: React.FC<EditTeacherFormProps> = ({ teacher, onClose }) => {
  const { updateTeacher } = useTeachersContext();
  const [formData, setFormData] = useState({
    first_name: teacher.first_name,
    last_name: teacher.last_name,
    email: teacher.email,
    phone: teacher.phone,
    hire_date: teacher.hire_date || '',
    status: teacher.status
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await updateTeacher(teacher.id, {
        ...formData,
        subjects: teacher.subjects, // Keep existing subjects
        classes: teacher.classes   // Keep existing classes
      });
      toast.success("Enseignant modifié avec succès");
      onClose();
    } catch (error) {
      console.error('Error updating teacher:', error);
      toast.error("Erreur lors de la modification");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Modifier l'Enseignant</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">Prénom *</Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => handleInputChange('first_name', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Nom *</Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => handleInputChange('last_name', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hire_date">Date d'Embauche</Label>
              <Input
                id="hire_date"
                type="date"
                value={formData.hire_date}
                onChange={(e) => handleInputChange('hire_date', e.target.value)}
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Modification...' : 'Modifier'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
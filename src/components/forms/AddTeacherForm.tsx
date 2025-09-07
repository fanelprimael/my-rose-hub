import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useTeachersContext } from "@/contexts/TeachersContext";
import { useAuth } from "@/contexts/AuthContext";
import { X } from "lucide-react";

interface AddTeacherFormProps {
  onClose: () => void;
}

const SUBJECTS = ['ANGLAIS', 'ES', 'EST', 'EA', 'MATHÉMATIQUES', 'LECTURE', 'EXPRESSION ÉCRITE', 'POÉSIE/CHANT'];
const CLASSES = ['Maternelle 1', 'Maternelle 2', 'CI', 'CP', 'CE1', 'CE2', 'CM1', 'CM2'];

export const AddTeacherForm: React.FC<AddTeacherFormProps> = ({ onClose }) => {
  const { addTeacher } = useTeachersContext();
  const { profile } = useAuth();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    subjects: [] as string[],
    classes: [] as string[],
    status: 'active',
    hire_date: '',
    salary: 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'salary' ? parseInt(value) || 0 : value 
    }));
  };

  const handleArrayChange = (name: 'subjects' | 'classes', value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked 
        ? [...prev[name], value]
        : prev[name].filter(item => item !== value)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await addTeacher(formData);
      onClose();
    } catch (error) {
      console.error('Error adding teacher:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Ajouter un Enseignant</CardTitle>
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
              <Label htmlFor="hire_date">Date de Prise de Poste</Label>
              <Input
                id="hire_date"
                type="date"
                value={formData.hire_date}
                onChange={(e) => handleInputChange('hire_date', e.target.value)}
              />
            </div>

            {profile?.role === 'direction' && (
              <div className="space-y-2">
                <Label htmlFor="salary">Salaire (FCFA)</Label>
                <Input
                  id="salary"
                  type="number"
                  value={formData.salary}
                  onChange={(e) => handleInputChange('salary', e.target.value)}
                  min="0"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label>Classes Assignées</Label>
              <div className="grid grid-cols-2 gap-2">
                {CLASSES.map((cls) => (
                  <div key={cls} className="flex items-center space-x-2">
                    <Checkbox
                      id={`class-${cls}`}
                      checked={formData.classes.includes(cls)}
                      onCheckedChange={(checked) => 
                        handleArrayChange('classes', cls, checked as boolean)
                      }
                    />
                    <Label htmlFor={`class-${cls}`} className="text-sm">{cls}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Ajout...' : 'Ajouter l\'Enseignant'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
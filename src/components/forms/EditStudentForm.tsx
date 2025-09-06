import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStudentsContext, Student } from "@/contexts/StudentsContext";
import { X } from "lucide-react";

interface EditStudentFormProps {
  student: Student;
  onClose: () => void;
}

const CLASSES = ['Maternelle 1', 'Maternelle 2', 'CI', 'CP', 'CE1', 'CE2', 'CM1', 'CM2'];

export const EditStudentForm: React.FC<EditStudentFormProps> = ({ student, onClose }) => {
  const { updateStudent } = useStudentsContext();
  const [formData, setFormData] = useState({
    first_name: student.first_name,
    last_name: student.last_name,
    date_of_birth: student.date_of_birth,
    gender: student.gender || '',
    class: student.class,
    parent_name: student.parent_name,
    parent_phone: student.parent_phone,
    parent_email: student.parent_email,
    address: student.address,
    status: student.status
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const age = formData.date_of_birth ? calculateAge(formData.date_of_birth) : undefined;
      await updateStudent(student.id, {
        ...formData,
        age,
        gender: formData.gender as 'masculin' | 'feminin'
      });
      onClose();
    } catch (error) {
      console.error('Error updating student:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Modifier l'Élève</CardTitle>
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
                <Label htmlFor="date_of_birth">Date de Naissance *</Label>
                <Input
                  id="date_of_birth"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Genre *</Label>
                <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner le genre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="masculin">Masculin</SelectItem>
                    <SelectItem value="feminin">Féminin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="class">Classe *</Label>
              <Select value={formData.class} onValueChange={(value) => handleInputChange('class', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une classe" />
                </SelectTrigger>
                <SelectContent>
                  {CLASSES.map((cls) => (
                    <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="parent_name">Nom du Parent/Tuteur *</Label>
              <Input
                id="parent_name"
                value={formData.parent_name}
                onChange={(e) => handleInputChange('parent_name', e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="parent_phone">Téléphone Parent *</Label>
                <Input
                  id="parent_phone"
                  value={formData.parent_phone}
                  onChange={(e) => handleInputChange('parent_phone', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="parent_email">Email Parent *</Label>
                <Input
                  id="parent_email"
                  type="email"
                  value={formData.parent_email}
                  onChange={(e) => handleInputChange('parent_email', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Adresse *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="inactive">Inactif</SelectItem>
                  <SelectItem value="graduated">Diplômé</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Modification...' : 'Modifier l\'Élève'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
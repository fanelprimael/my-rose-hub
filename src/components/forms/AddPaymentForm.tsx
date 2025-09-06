import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePaymentsContext } from "@/contexts/PaymentsContext";
import { useStudentsContext } from "@/contexts/StudentsContext";
import { X } from "lucide-react";

interface AddPaymentFormProps {
  onClose: () => void;
}

const PAYMENT_TYPES = [
  'Frais de Scolarité',
  'Fournitures Scolaires',
  'Transport Scolaire',
  'Cantine',
  'Activités Extra-scolaires',
  'Frais d\'Examen',
  'Assurance Scolaire'
];

export const AddPaymentForm: React.FC<AddPaymentFormProps> = ({ onClose }) => {
  const { addPayment } = usePaymentsContext();
  const { students } = useStudentsContext();
  const [formData, setFormData] = useState({
    student_id: '',
    type: '',
    amount: '',
    amount_paid: '0',
    status: 'En attente',
    date: new Date().toISOString().split('T')[0],
    due_date: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const calculateStatus = (amount: number, amountPaid: number) => {
    if (amountPaid === 0) return 'En attente';
    if (amountPaid >= amount) return 'Payé';
    return 'Partiel';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const selectedStudent = students.find(s => s.id === formData.student_id);
      if (!selectedStudent) return;

      const amount = parseInt(formData.amount);
      const amountPaid = parseInt(formData.amount_paid);
      const status = calculateStatus(amount, amountPaid);

      await addPayment({
        student_id: formData.student_id,
        student_name: `${selectedStudent.first_name} ${selectedStudent.last_name}`,
        class_name: selectedStudent.class,
        type: formData.type,
        amount,
        amount_paid: amountPaid,
        status,
        date: formData.date,
        due_date: formData.due_date || undefined
      });
      onClose();
    } catch (error) {
      console.error('Error adding payment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Enregistrer un Paiement</CardTitle>
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
              <Label htmlFor="type">Type de Paiement *</Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le type" />
                </SelectTrigger>
                <SelectContent>
                  {PAYMENT_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Montant Total (FCFA) *</Label>
                <Input
                  id="amount"
                  type="number"
                  min="0"
                  value={formData.amount}
                  onChange={(e) => handleInputChange('amount', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount_paid">Montant Payé (FCFA) *</Label>
                <Input
                  id="amount_paid"
                  type="number"
                  min="0"
                  value={formData.amount_paid}
                  onChange={(e) => handleInputChange('amount_paid', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date de Paiement *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="due_date">Date d'Échéance</Label>
                <Input
                  id="due_date"
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => handleInputChange('due_date', e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Enregistrement...' : 'Enregistrer le Paiement'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
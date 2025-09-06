import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Plus, Trash2 } from "lucide-react";
import { usePaymentsContext } from "@/contexts/PaymentsContext";
import { useStudentsContext } from "@/contexts/StudentsContext";
import { toast } from "@/hooks/use-toast";

const PAYMENT_TYPES = [
  'Frais de Scolarité',
  'Fournitures Scolaires',
  'Transport Scolaire',
  'Cantine',
  'Activités Extra-scolaires',
  'Frais d\'Examen',
  'Assurance Scolaire'
];

interface PaymentFormData {
  type: string;
  amount: string;
  status: string;
  date: string;
  due_date: string;
}

interface EditStudentPaymentsFormProps {
  onClose: () => void;
  studentId: string;
}

export const EditStudentPaymentsForm: React.FC<EditStudentPaymentsFormProps> = ({ 
  onClose, 
  studentId 
}) => {
  const { students } = useStudentsContext();
  const { updateStudentPayments, getPaymentsByStudent } = usePaymentsContext();
  const [payments, setPayments] = useState<PaymentFormData[]>([]);
  const [loading, setLoading] = useState(false);

  const student = students.find(s => s.id === studentId);

  useEffect(() => {
    // Load existing payments
    const existingPayments = getPaymentsByStudent(studentId);
    if (existingPayments.length > 0) {
      const paymentData = existingPayments.map(payment => ({
        type: payment.type,
        amount: payment.amount.toString(),
        status: payment.status,
        date: payment.date,
        due_date: payment.due_date || ''
      }));
      setPayments(paymentData);
    } else {
      // Start with one empty payment
      addPaymentRow();
    }
  }, [studentId, getPaymentsByStudent]);

  const addPaymentRow = () => {
    setPayments(prev => [...prev, {
      type: '',
      amount: '',
      status: 'En attente',
      date: new Date().toISOString().split('T')[0],
      due_date: ''
    }]);
  };

  const removePaymentRow = (index: number) => {
    setPayments(prev => prev.filter((_, i) => i !== index));
  };

  const updatePaymentRow = (index: number, field: keyof PaymentFormData, value: string) => {
    setPayments(prev => prev.map((payment, i) => 
      i === index ? { ...payment, [field]: value } : payment
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!student) {
      toast({
        title: "Erreur",
        description: "Élève non trouvé",
        variant: "destructive"
      });
      return;
    }

    // Filter out empty payments
    const validPayments = payments.filter(payment => 
      payment.type && payment.amount && parseFloat(payment.amount) > 0
    );

    if (validPayments.length === 0) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir au moins un paiement valide",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const paymentData = validPayments.map(payment => {
        const amount = parseFloat(payment.amount);
        if (isNaN(amount) || amount <= 0) {
          throw new Error(`Montant invalide: ${payment.amount}`);
        }
        
        return {
          student_id: studentId,
          student_name: `${student.first_name} ${student.last_name}`,
          class_name: student.class,
          type: payment.type,
          amount: Math.round(amount),
          status: payment.status,
          date: payment.date,
          due_date: payment.due_date ? payment.due_date : null
        };
      });

      await updateStudentPayments(studentId, paymentData);
      
      toast({
        title: "Succès",
        description: "Paiements mis à jour avec succès"
      });
      
      onClose();
    } catch (error) {
      console.error('Error updating payments:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!student) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Modifier les Paiements - {student.first_name} {student.last_name}</CardTitle>
            <p className="text-sm text-muted-foreground">
              Classe: {student.class}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {payments.map((payment, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium">Paiement {index + 1}</h4>
                    {payments.length > 1 && (
                      <Button 
                        type="button"
                        variant="ghost" 
                        size="sm"
                        onClick={() => removePaymentRow(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor={`type-${index}`}>Type de paiement *</Label>
                      <Select 
                        value={payment.type} 
                        onValueChange={(value) => updatePaymentRow(index, 'type', value)}
                      >
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

                    <div>
                      <Label htmlFor={`amount-${index}`}>Montant (FCFA) *</Label>
                      <Input
                        id={`amount-${index}`}
                        type="number"
                        min="0"
                        value={payment.amount}
                        onChange={(e) => updatePaymentRow(index, 'amount', e.target.value)}
                        placeholder="0"
                      />
                    </div>

                    <div>
                      <Label htmlFor={`status-${index}`}>Statut *</Label>
                      <Select 
                        value={payment.status} 
                        onValueChange={(value) => updatePaymentRow(index, 'status', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="En attente">En attente</SelectItem>
                          <SelectItem value="Payé">Payé</SelectItem>
                          <SelectItem value="En retard">En retard</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor={`date-${index}`}>Date de paiement *</Label>
                      <Input
                        id={`date-${index}`}
                        type="date"
                        value={payment.date}
                        onChange={(e) => updatePaymentRow(index, 'date', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor={`due_date-${index}`}>Date d'échéance</Label>
                      <Input
                        id={`due_date-${index}`}
                        type="date"
                        value={payment.due_date}
                        onChange={(e) => updatePaymentRow(index, 'due_date', e.target.value)}
                      />
                    </div>
                  </div>
                </Card>
              ))}
              
              <Button
                type="button"
                variant="outline"
                onClick={addPaymentRow}
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un paiement
              </Button>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Mise à jour en cours...' : 'Mettre à jour les Paiements'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
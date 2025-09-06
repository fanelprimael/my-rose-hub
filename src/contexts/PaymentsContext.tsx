import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Payment {
  id: string;
  student_id: string;
  student_name: string;
  class_name: string;
  type: string;
  amount: number;
  amount_paid?: number;
  status: string;
  date: string;
  due_date?: string;
  created_at: string;
  updated_at: string;
}

interface PaymentsContextType {
  payments: Payment[];
  loading: boolean;
  addPayment: (payment: Omit<Payment, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updatePayment: (id: string, payment: Partial<Payment>) => Promise<void>;
  deletePayment: (id: string) => Promise<void>;
  getPayment: (id: string) => Payment | undefined;
  getPaymentsByStudent: (studentId: string) => Payment[];
  refreshPayments: () => Promise<void>;
}

const PaymentsContext = createContext<PaymentsContextType | undefined>(undefined);

export const PaymentsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const refreshPayments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching payments:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les paiements",
          variant: "destructive"
        });
        return;
      }

      // Calculate amount_paid if not stored (but it doesn't exist in DB)
      const paymentsWithCalculated = (data || []).map(payment => ({
        ...payment,
        amount_paid: 0 // Default value since it's not in the DB schema
      }));

      setPayments(paymentsWithCalculated);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshPayments();
  }, []);

  const addPayment = async (paymentData: Omit<Payment, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { error } = await supabase
        .from('payments')
        .insert([paymentData]);

      if (error) {
        console.error('Error adding payment:', error);
        toast({
          title: "Erreur",
          description: "Impossible d'ajouter le paiement",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Succès",
        description: "Paiement ajouté avec succès"
      });
      
      await refreshPayments();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive"
      });
    }
  };

  const updatePayment = async (id: string, paymentData: Partial<Payment>) => {
    try {
      const { error } = await supabase
        .from('payments')
        .update(paymentData)
        .eq('id', id);

      if (error) {
        console.error('Error updating payment:', error);
        toast({
          title: "Erreur",
          description: "Impossible de modifier le paiement",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Succès",
        description: "Paiement modifié avec succès"
      });
      
      await refreshPayments();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive"
      });
    }
  };

  const deletePayment = async (id: string) => {
    try {
      const { error } = await supabase
        .from('payments')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting payment:', error);
        toast({
          title: "Erreur",
          description: "Impossible de supprimer le paiement",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Succès",
        description: "Paiement supprimé avec succès"
      });
      
      await refreshPayments();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive"
      });
    }
  };

  const getPayment = (id: string) => {
    return payments.find(payment => payment.id === id);
  };

  const getPaymentsByStudent = (studentId: string) => {
    return payments.filter(payment => payment.student_id === studentId);
  };

  return (
    <PaymentsContext.Provider value={{
      payments,
      loading,
      addPayment,
      updatePayment,
      deletePayment,
      getPayment,
      getPaymentsByStudent,
      refreshPayments
    }}>
      {children}
    </PaymentsContext.Provider>
  );
};

export const usePaymentsContext = () => {
  const context = useContext(PaymentsContext);
  if (context === undefined) {
    throw new Error('usePaymentsContext must be used within a PaymentsProvider');
  }
  return context;
};
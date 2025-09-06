import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { X } from "lucide-react";
import { usePaymentsContext } from "@/contexts/PaymentsContext";

interface ViewStudentPaymentsModalProps {
  studentId: string;
  studentName: string;
  studentClass: string;
  onClose: () => void;
  onEdit: () => void;
}

export const ViewStudentPaymentsModal: React.FC<ViewStudentPaymentsModalProps> = ({
  studentId,
  studentName,
  studentClass,
  onClose,
  onEdit
}) => {
  const { getPaymentsByStudent } = usePaymentsContext();
  const studentPayments = getPaymentsByStudent(studentId);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Payé':
        return "bg-education-success/10 text-education-success hover:bg-education-success/20";
      case 'En attente':
        return "bg-education-danger/10 text-education-danger hover:bg-education-danger/20";
      case 'En retard':
        return "bg-destructive/10 text-destructive hover:bg-destructive/20";
      default:
        return "bg-muted/10 text-muted-foreground hover:bg-muted/20";
    }
  };

  // Calculate totals
  const totalAmount = studentPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const totalPaid = studentPayments.filter(p => p.status === 'Payé').reduce((sum, payment) => sum + payment.amount, 0);
  const totalPending = totalAmount - totalPaid;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Paiements de {studentName}</CardTitle>
            <p className="text-sm text-muted-foreground">
              Classe: {studentClass} • {studentPayments.length} paiements • Total: {totalAmount.toLocaleString()} FCFA
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onEdit}>
              Modifier les Paiements
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {studentPayments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Aucun paiement enregistré pour cet élève.</p>
              <Button variant="outline" className="mt-4" onClick={onEdit}>
                Ajouter des paiements
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">{totalAmount.toLocaleString()} FCFA</p>
                      <p className="text-sm text-muted-foreground">Total à payer</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-education-success">{totalPaid.toLocaleString()} FCFA</p>
                      <p className="text-sm text-muted-foreground">Payé</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-education-danger">{totalPending.toLocaleString()} FCFA</p>
                      <p className="text-sm text-muted-foreground">Reste à payer</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Payments Table */}
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type de paiement</TableHead>
                      <TableHead>Montant</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Échéance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {studentPayments.map((payment) => (
                      <TableRow key={payment.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">{payment.type}</TableCell>
                        <TableCell>
                          <span className="font-medium">{payment.amount.toLocaleString()} FCFA</span>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusBadge(payment.status)}>
                            {payment.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(payment.date).toLocaleDateString('fr-FR')}</TableCell>
                        <TableCell>
                          {payment.due_date ? new Date(payment.due_date).toLocaleDateString('fr-FR') : '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
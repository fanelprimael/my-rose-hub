import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign, CreditCard, TrendingUp, AlertCircle, Plus, Search, Filter, Eye, Edit, Trash2, Download } from "lucide-react";
import { usePaymentsContext } from "@/contexts/PaymentsContext";
import { AddPaymentForm } from "@/components/forms/AddPaymentForm";
import { useState } from "react";

const Finances = () => {
  const { payments, loading, deletePayment } = usePaymentsContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [showAddForm, setShowAddForm] = useState(false);

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !selectedStatus || payment.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  // Calculate statistics
  const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const totalPaid = payments.reduce((sum, payment) => sum + (payment.amount_paid || 0), 0);
  const totalPending = totalAmount - totalPaid;
  const paidPayments = payments.filter(p => p.status === 'Payé').length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Payé':
        return <Badge className="bg-education-success/10 text-education-success hover:bg-education-success/20">Payé</Badge>;
      case 'Partiel':
        return <Badge className="bg-education-warning/10 text-education-warning hover:bg-education-warning/20">Partiel</Badge>;
      case 'En attente':
        return <Badge className="bg-education-danger/10 text-education-danger hover:bg-education-danger/20">En attente</Badge>;
      case 'En retard':
        return <Badge variant="destructive">En retard</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return <Layout><div className="flex items-center justify-center h-64">Chargement...</div></Layout>;
  }

  return (
    <Layout>
      {showAddForm && <AddPaymentForm onClose={() => setShowAddForm(false)} />}
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gestion Financière</h1>
            <p className="text-muted-foreground">
              Suivi des paiements et finances de l'école
            </p>
          </div>
          <Button onClick={() => setShowAddForm(true)} className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            Nouveau Paiement
          </Button>
        </div>

        {/* Statistics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="shadow-soft">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{totalAmount.toLocaleString()} FCFA</p>
                  <p className="text-sm text-muted-foreground">Revenus Total</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-soft">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CreditCard className="h-8 w-8 text-education-success" />
                <div>
                  <p className="text-2xl font-bold">{totalPaid.toLocaleString()} FCFA</p>
                  <p className="text-sm text-muted-foreground">Encaissé</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-8 w-8 text-education-warning" />
                <div>
                  <p className="text-2xl font-bold">{totalPending.toLocaleString()} FCFA</p>
                  <p className="text-sm text-muted-foreground">En Attente</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-8 w-8 text-education-accent" />
                <div>
                  <p className="text-2xl font-bold">{paidPayments}</p>
                  <p className="text-sm text-muted-foreground">Paiements Réalisés</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="shadow-soft">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Rechercher un paiement..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="w-48">
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filtrer par statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tous les statuts</SelectItem>
                    <SelectItem value="Payé">Payé</SelectItem>
                    <SelectItem value="Partiel">Partiel</SelectItem>
                    <SelectItem value="En attente">En attente</SelectItem>
                    <SelectItem value="En retard">En retard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Exporter
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Payments Table */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Historique des Paiements ({filteredPayments.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Élève</TableHead>
                    <TableHead>Classe</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Payé</TableHead>
                    <TableHead>Reste</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map((payment) => {
                    const remaining = payment.amount - (payment.amount_paid || 0);
                    
                    return (
                      <TableRow key={payment.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">{payment.student_name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{payment.class_name}</Badge>
                        </TableCell>
                        <TableCell>{payment.type}</TableCell>
                        <TableCell className="font-medium">{payment.amount.toLocaleString()} FCFA</TableCell>
                        <TableCell className="text-education-success">
                          {(payment.amount_paid || 0).toLocaleString()} FCFA
                        </TableCell>
                        <TableCell className={remaining > 0 ? "text-education-danger" : "text-education-success"}>
                          {remaining.toLocaleString()} FCFA
                        </TableCell>
                        <TableCell>{getStatusBadge(payment.status)}</TableCell>
                        <TableCell>{new Date(payment.date).toLocaleDateString('fr-FR')}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deletePayment(payment.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {filteredPayments.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>Aucun paiement trouvé.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Finances;
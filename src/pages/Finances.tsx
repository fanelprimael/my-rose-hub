import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign, CreditCard, TrendingUp, AlertCircle, Plus, Search, Filter, Eye, Edit, Trash2, Download } from "lucide-react";
import { usePaymentsContext } from "@/contexts/PaymentsContext";
import { useStudentsContext } from "@/contexts/StudentsContext";
import { AddPaymentForm } from "@/components/forms/AddPaymentForm";
import { ViewStudentPaymentsModal } from "@/components/forms/ViewStudentPaymentsModal";
import { EditStudentPaymentsForm } from "@/components/forms/EditStudentPaymentsForm";
import { useState } from "react";

const Finances = () => {
  const { payments, loading } = usePaymentsContext();
  const { students } = useStudentsContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");

  // Group students with their payments
  const studentsWithPayments = students.map(student => {
    const studentPayments = payments.filter(payment => payment.student_id === student.id);
    const filteredPayments = studentPayments.filter(payment => {
      const matchesSearch = payment.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           payment.type.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = !selectedStatus || selectedStatus === "all" || payment.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });
    
    const totalAmount = studentPayments.reduce((sum, payment) => sum + payment.amount, 0);
    const totalPaid = studentPayments.filter(p => p.status === 'Payé').reduce((sum, payment) => sum + payment.amount, 0);
    
    return {
      ...student,
      paymentCount: filteredPayments.length,
      totalAmount,
      totalPaid,
      hasPayments: studentPayments.length > 0
    };
  }).filter(student => {
    if (searchTerm) {
      const studentPayments = payments.filter(p => p.student_id === student.id);
      return studentPayments.some(payment => 
        payment.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.type.toLowerCase().includes(searchTerm.toLowerCase())
      ) || student.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
         student.last_name.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return true;
  });

  // Calculate statistics from all payments
  const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const totalPaid = payments.filter(p => p.status === 'Payé').reduce((sum, payment) => sum + payment.amount, 0);
  const totalPending = totalAmount - totalPaid;
  const paidPayments = payments.filter(p => p.status === 'Payé').length;

  const handleViewStudent = (studentId: string) => {
    setSelectedStudentId(studentId);
    setShowViewModal(true);
  };

  const handleEditStudent = (studentId: string) => {
    setSelectedStudentId(studentId);
    setShowEditForm(true);
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setSelectedStudentId("");
  };

  const handleCloseEditForm = () => {
    setShowEditForm(false);
    setSelectedStudentId("");
  };

  const selectedStudent = students.find(s => s.id === selectedStudentId);

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
                    <SelectItem value="all">Tous les statuts</SelectItem>
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
            <CardTitle>Liste des Élèves ({studentsWithPayments.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID Élève</TableHead>
                    <TableHead>Nom de l'élève</TableHead>
                    <TableHead>Classe</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {studentsWithPayments.map((student) => (
                    <TableRow key={student.id} className="hover:bg-muted/50">
                      <TableCell className="font-mono text-sm">{student.id.slice(0, 8)}</TableCell>
                      <TableCell className="font-medium">{student.first_name} {student.last_name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{student.class}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleViewStudent(student.id)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Voir
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleEditStudent(student.id)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Modifier
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {studentsWithPayments.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>Aucun élève trouvé.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Forms and Modals */}
        {showAddForm && <AddPaymentForm onClose={() => setShowAddForm(false)} />}

        {showViewModal && selectedStudent && (
          <ViewStudentPaymentsModal
            studentId={selectedStudentId}
            studentName={`${selectedStudent.first_name} ${selectedStudent.last_name}`}
            studentClass={selectedStudent.class}
            onClose={handleCloseViewModal}
            onEdit={() => {
              setShowViewModal(false);
              handleEditStudent(selectedStudentId);
            }}
          />
        )}

        {showEditForm && selectedStudent && (
          <EditStudentPaymentsForm
            studentId={selectedStudentId}
            onClose={handleCloseEditForm}
          />
        )}
      </div>
    </Layout>
  );
};

export default Finances;
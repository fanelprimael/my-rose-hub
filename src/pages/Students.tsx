import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Eye, Edit, Trash2, UserPlus, Download } from "lucide-react";
import { useStudentsContext } from "@/contexts/StudentsContext";
import { AddStudentForm } from "@/components/forms/AddStudentForm";
import { EditStudentForm } from "@/components/forms/EditStudentForm";
import { ViewStudentModal } from "@/components/forms/ViewStudentModal";
import { exportToPDF, exportToCSV } from "@/utils/exportUtils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

const Students = () => {
  const { students, loading, deleteStudent } = useStudentsContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<any>(null);
  const [viewingStudent, setViewingStudent] = useState<any>(null);

  const classes = ['Maternelle 1', 'Maternelle 2', 'CI', 'CP', 'CE1', 'CE2', 'CM1', 'CM2'];

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.class.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesClass = selectedClass === "all" || student.class === selectedClass;
    
    return matchesSearch && matchesClass;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-education-success/10 text-education-success hover:bg-education-success/20">Actif</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inactif</Badge>;
      case 'graduated':
        return <Badge className="bg-education-accent/10 text-education-accent hover:bg-education-accent/20">Diplômé</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleExportPDF = () => {
    const headers = ['Nom Complet', 'Classe', 'Parent/Tuteur', 'Téléphone', 'Statut'];
    const data = filteredStudents.map(student => ({
      nom: `${student.first_name} ${student.last_name}`,
      classe: student.class,
      parent: student.parent_name,
      telephone: student.parent_phone,
      statut: student.status === 'active' ? 'Actif' : student.status === 'inactive' ? 'Inactif' : 'Diplômé'
    }));
    exportToPDF(data, 'Liste des Élèves', headers);
  };

  const handleExportCSV = () => {
    const headers = ['Prénom', 'Nom', 'Date de naissance', 'Genre', 'Classe', 'Parent/Tuteur', 'Téléphone Parent', 'Email Parent', 'Adresse', 'Statut'];
    const data = filteredStudents.map(student => ({
      prenom: student.first_name,
      nom: student.last_name,
      date_naissance: student.date_of_birth,
      genre: student.gender || '',
      classe: student.class,
      parent: student.parent_name,
      telephone: student.parent_phone,
      email: student.parent_email,
      adresse: student.address,
      statut: student.status
    }));
    exportToCSV(data, 'eleves', headers);
  };

  if (loading) {
    return <Layout><div className="flex items-center justify-center h-64">Chargement...</div></Layout>;
  }

  return (
    <Layout>
      {showAddForm && <AddStudentForm onClose={() => setShowAddForm(false)} defaultClass={selectedClass !== "all" ? selectedClass : undefined} />}
      {editingStudent && <EditStudentForm student={editingStudent} onClose={() => setEditingStudent(null)} />}
      {viewingStudent && <ViewStudentModal student={viewingStudent} onClose={() => setViewingStudent(null)} />}
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gestion des Élèves</h1>
            <p className="text-muted-foreground">
              Organisation par classe pour une meilleure gestion
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExportCSV}>
              <Download className="mr-2 h-4 w-4" />
              Exporter CSV
            </Button>
            <Button onClick={() => setShowAddForm(true)} className="bg-primary hover:bg-primary/90">
              <UserPlus className="mr-2 h-4 w-4" />
              Nouvel Élève
            </Button>
          </div>
        </div>

        {/* Class Selection */}
        <Card className="shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-64">
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une classe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les classes</SelectItem>
                    {classes.map((className) => (
                      <SelectItem key={className} value={className}>
                        {className}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Badge variant="outline" className="text-sm">
                {selectedClass === "all" ? "Toutes les classes" : selectedClass}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Search and Filter */}
        <Card className="shadow-soft">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Rechercher un élève..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" onClick={handleExportPDF}>
                <Download className="mr-2 h-4 w-4" />
                Exporter PDF
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Students Table */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Liste des Élèves ({filteredStudents.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nom Complet</TableHead>
                    <TableHead>Classe</TableHead>
                    <TableHead>Âge</TableHead>
                    <TableHead>Parent/Tuteur</TableHead>
                    <TableHead>Téléphone</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow key={student.id} className="hover:bg-muted/50">
                      <TableCell className="font-mono text-sm">
                        {student.id.substring(0, 8)}
                      </TableCell>
                      <TableCell className="font-medium">
                        {student.first_name} {student.last_name}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{student.class}</Badge>
                      </TableCell>
                      <TableCell>
                        {student.age || 'N/A'} ans
                      </TableCell>
                      <TableCell>{student.parent_name}</TableCell>
                      <TableCell>{student.parent_phone}</TableCell>
                      <TableCell>{getStatusBadge(student.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setViewingStudent(student)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setEditingStudent(student)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteStudent(student.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredStudents.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>Aucun élève trouvé.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Students;
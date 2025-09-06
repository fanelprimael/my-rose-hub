import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Download, BarChart3, PieChart, TrendingUp, Calendar } from "lucide-react";
import { useState } from "react";
import { useStudentsContext } from "@/contexts/StudentsContext";
import { useGradesContext } from "@/contexts/GradesContext";
import { usePaymentsContext } from "@/contexts/PaymentsContext";
import { useTeachersContext } from "@/contexts/TeachersContext";
import { exportToPDF, exportToCSV } from "@/utils/exportUtils";
import { useToast } from "@/hooks/use-toast";

const Reports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [showAllReports, setShowAllReports] = useState(false);

  const { students } = useStudentsContext();
  const { grades } = useGradesContext();
  const { payments } = usePaymentsContext();
  const { teachers } = useTeachersContext();
  const { toast } = useToast();

  const reportTypes = [
    { id: 'academic', name: 'Rapport Académique', icon: BarChart3 },
    { id: 'financial', name: 'Rapport Financier', icon: PieChart },
    { id: 'attendance', name: 'Rapport d\'Assiduité', icon: TrendingUp },
    { id: 'enrollment', name: 'Rapport d\'Inscriptions', icon: Calendar },
  ];

  const periods = ['Ce mois', 'Mois dernier', 'Ce trimestre', 'Trimestre dernier', 'Cette année'];

  const recentReports = [
    {
      id: '1',
      name: 'Bulletin Trimestriel - CE1',
      type: 'Académique',
      date: '2024-01-20',
      status: 'Généré',
    },
    {
      id: '2',
      name: 'Rapport Financier - Janvier',
      type: 'Financier',
      date: '2024-01-19',
      status: 'En cours',
    },
    {
      id: '3',
      name: 'Présences - Semaine 3',
      type: 'Assiduité',
      date: '2024-01-18',
      status: 'Généré',
    },
    {
      id: '4',
      name: 'Inscriptions - Janvier',
      type: 'Inscriptions',
      date: '2024-01-17',
      status: 'Généré',
    },
  ];

  // Generate Academic Report
  const generateAcademicReport = () => {
    try {
      const reportData = students.map(student => {
        const studentGrades = grades.filter(grade => grade.student_id === student.id);
        const average = studentGrades.length > 0 
          ? studentGrades.reduce((sum, grade) => sum + grade.grade, 0) / studentGrades.length 
          : 0;
        
        return {
          'Nom': `${student.first_name} ${student.last_name}`,
          'Classe': student.class,
          'Nombre de notes': studentGrades.length,
          'Moyenne générale': average.toFixed(2),
          'Statut': student.status
        };
      });

      const headers = ['Nom', 'Classe', 'Nombre de notes', 'Moyenne générale', 'Statut'];
      exportToPDF(reportData, `Rapport Académique - ${selectedPeriod || 'Général'}`, headers);
      
      toast({
        title: "Succès",
        description: "Rapport académique généré avec succès"
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la génération du rapport",
        variant: "destructive"
      });
    }
  };

  // Generate Financial Report
  const generateFinancialReport = () => {
    try {
      const reportData = payments.map(payment => ({
        'Élève': payment.student_name,
        'Classe': payment.class_name,
        'Type': payment.type,
        'Montant': `${payment.amount.toLocaleString()} FCFA`,
        'Statut': payment.status,
        'Date': new Date(payment.date).toLocaleDateString('fr-FR')
      }));

      const headers = ['Élève', 'Classe', 'Type', 'Montant', 'Statut', 'Date'];
      exportToPDF(reportData, `Rapport Financier - ${selectedPeriod || 'Général'}`, headers);
      
      toast({
        title: "Succès",
        description: "Rapport financier généré avec succès"
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la génération du rapport",
        variant: "destructive"
      });
    }
  };

  // Generate Attendance Report
  const generateAttendanceReport = () => {
    try {
      const reportData = students.map(student => ({
        'Nom': `${student.first_name} ${student.last_name}`,
        'Classe': student.class,
        'Statut': student.status,
        'Parent': student.parent_name,
        'Téléphone': student.parent_phone,
        'Email': student.parent_email
      }));

      const headers = ['Nom', 'Classe', 'Statut', 'Parent', 'Téléphone', 'Email'];
      exportToPDF(reportData, `Rapport d'Assiduité - ${selectedPeriod || 'Général'}`, headers);
      
      toast({
        title: "Succès",
        description: "Rapport d'assiduité généré avec succès"
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la génération du rapport",
        variant: "destructive"
      });
    }
  };

  // Generate Enrollment Report
  const generateEnrollmentReport = () => {
    try {
      const reportData = students.map(student => ({
        'Nom': `${student.first_name} ${student.last_name}`,
        'Classe': student.class,
        'Date de naissance': new Date(student.date_of_birth).toLocaleDateString('fr-FR'),
        'Genre': student.gender || 'Non spécifié',
        'Date d\'inscription': new Date(student.created_at).toLocaleDateString('fr-FR'),
        'Statut': student.status
      }));

      const headers = ['Nom', 'Classe', 'Date de naissance', 'Genre', 'Date d\'inscription', 'Statut'];
      exportToPDF(reportData, `Rapport d'Inscriptions - ${selectedPeriod || 'Général'}`, headers);
      
      toast({
        title: "Succès",
        description: "Rapport d'inscriptions généré avec succès"
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la génération du rapport",
        variant: "destructive"
      });
    }
  };

  // Handle report generation based on selected type
  const handleGenerateReport = () => {
    if (!selectedType) {
      toast({
        title: "Attention",
        description: "Veuillez sélectionner un type de rapport",
        variant: "destructive"
      });
      return;
    }

    switch (selectedType) {
      case 'academic':
        generateAcademicReport();
        break;
      case 'financial':
        generateFinancialReport();
        break;
      case 'attendance':
        generateAttendanceReport();
        break;
      case 'enrollment':
        generateEnrollmentReport();
        break;
      default:
        toast({
          title: "Erreur",
          description: "Type de rapport non reconnu",
          variant: "destructive"
        });
    }
  };

  // Handle report type card click
  const handleReportTypeClick = (reportType: string) => {
    setSelectedType(reportType);
    handleGenerateReport();
  };

  // Handle new report
  const handleNewReport = () => {
    toast({
      title: "Nouveau rapport",
      description: "Utilisez le générateur ci-dessous pour créer un nouveau rapport"
    });
  };

  // Handle download report
  const handleDownloadReport = (reportName: string) => {
    toast({
      title: "Téléchargement",
      description: `Téléchargement de ${reportName} en cours...`
    });
    // In a real application, this would download an actual saved report
  };

  // Calculate statistics
  const totalReports = recentReports.length;
  const totalDownloads = 156; // This would be calculated from actual data
  const successRate = students.length > 0 
    ? Math.round((students.filter(s => s.status === 'Actif').length / students.length) * 100)
    : 0;
  const growth = 15; // This would be calculated from actual data

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Généré':
        return <Badge className="bg-education-success/10 text-education-success hover:bg-education-success/20">Généré</Badge>;
      case 'En cours':
        return <Badge className="bg-education-warning/10 text-education-warning hover:bg-education-warning/20">En cours</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Rapports et Analyses</h1>
            <p className="text-muted-foreground">
              Générez et consultez les rapports de l'école
            </p>
          </div>
          <Button className="bg-primary hover:bg-primary/90" onClick={handleNewReport}>
            <FileText className="mr-2 h-4 w-4" />
            Nouveau Rapport
          </Button>
        </div>

        {/* Report Generator */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Générateur de Rapports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="text-sm font-medium mb-2 block">Type de Rapport</label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    {reportTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Période</label>
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une période" />
                  </SelectTrigger>
                  <SelectContent>
                    {periods.map((period) => (
                      <SelectItem key={period} value={period}>{period}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button className="w-full bg-primary hover:bg-primary/90" onClick={handleGenerateReport}>
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Générer Rapport
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Report Types */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {reportTypes.map((type) => {
            const Icon = type.icon;
            return (
              <Card key={type.id} className="shadow-soft hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleReportTypeClick(type.id)}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">{type.name}</h3>
                      <p className="text-sm text-muted-foreground">Créer un rapport</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="shadow-soft">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <FileText className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{totalReports}</p>
                  <p className="text-sm text-muted-foreground">Rapports ce Mois</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-soft">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Download className="h-8 w-8 text-education-accent" />
                <div>
                  <p className="text-2xl font-bold">{totalDownloads}</p>
                  <p className="text-sm text-muted-foreground">Téléchargements</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-8 w-8 text-education-success" />
                <div>
                  <p className="text-2xl font-bold">{successRate}%</p>
                  <p className="text-sm text-muted-foreground">Taux de Réussite</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-8 w-8 text-education-secondary" />
                <div>
                  <p className="text-2xl font-bold">+{growth}%</p>
                  <p className="text-sm text-muted-foreground">Croissance</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Reports */}
        <Card className="shadow-soft">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Rapports Récents</CardTitle>
              <Button variant="outline" size="sm" onClick={() => setShowAllReports(!showAllReports)}>
                {showAllReports ? 'Voir Moins' : 'Voir Tous'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentReports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">{report.name}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs">{report.type}</Badge>
                        <span className="text-sm text-muted-foreground">
                          {new Date(report.date).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(report.status)}
                    {report.status === 'Généré' && (
                      <Button variant="outline" size="sm" onClick={() => handleDownloadReport(report.name)}>
                        <Download className="h-4 w-4 mr-1" />
                        Télécharger
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {recentReports.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>Aucun rapport généré récemment.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Reports;
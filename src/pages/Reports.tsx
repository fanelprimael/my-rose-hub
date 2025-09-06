import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Download, BarChart3, PieChart, TrendingUp, Calendar } from "lucide-react";
import { useState } from "react";

const Reports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");

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
          <Button className="bg-primary hover:bg-primary/90">
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
                <Button className="w-full bg-primary hover:bg-primary/90">
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
              <Card key={type.id} className="shadow-soft hover:shadow-lg transition-shadow cursor-pointer">
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
                  <p className="text-2xl font-bold">24</p>
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
                  <p className="text-2xl font-bold">156</p>
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
                  <p className="text-2xl font-bold">92%</p>
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
                  <p className="text-2xl font-bold">+15%</p>
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
              <Button variant="outline" size="sm">
                Voir Tous
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
                      <Button variant="outline" size="sm">
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
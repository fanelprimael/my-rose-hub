import { Layout } from "@/components/layout/Layout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  School,
  GraduationCap,
  CreditCard,
  TrendingUp,
  UserPlus,
  BookOpen,
  AlertCircle
} from "lucide-react";
import { useStudents } from "@/hooks/useStudents";
import { useClasses } from "@/hooks/useClasses";
import { useTeachers } from "@/hooks/useTeachers";
import { useFinances } from "@/hooks/useFinances";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { students } = useStudents();
  const { classes } = useClasses();
  const { teachers } = useTeachers();
  const { stats } = useFinances();
  const navigate = useNavigate();

  // Stats - données connectées aux hooks
  const statsData = [
    {
      title: "Total Élèves",
      value: students.length,
      icon: <Users className="h-4 w-4" />,
      description: "Élèves inscrits cette année",
    },
    {
      title: "Classes Actives",
      value: classes.length,
      icon: <School className="h-4 w-4" />,
      description: "De la maternelle au CM2",
    },
    {
      title: "Enseignants",
      value: teachers.length,
      icon: <GraduationCap className="h-4 w-4" />,
      description: "Professeurs en poste",
    },
    {
      title: "Recettes Mensuelles",
      value: new Intl.NumberFormat('fr-FR').format(stats.monthly_income) + " FCFA",
      icon: <CreditCard className="h-4 w-4" />,
      description: "Revenus de ce mois",
    }
  ];

  const recentActivities: any[] = [];

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Tableau de Bord</h1>
            <p className="text-muted-foreground">
              Vue d'ensemble de l'école La Roseraie
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate('/students')}>
              <UserPlus className="mr-2 h-4 w-4" />
              Nouvel Élève
            </Button>
            <Button variant="outline" onClick={() => navigate('/grades')}>
              <BookOpen className="mr-2 h-4 w-4" />
              Saisir Notes
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statsData.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Quick Actions */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Actions Rapides
              </CardTitle>
              <CardDescription>
                Accès direct aux tâches courantes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/students')}>
                <Users className="mr-2 h-4 w-4" />
                Gérer les Élèves
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/finances')}>
                <CreditCard className="mr-2 h-4 w-4" />
                Enregistrer Paiement
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/grades')}>
                <BookOpen className="mr-2 h-4 w-4" />
                Notes & Bulletins
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/classes')}>
                <School className="mr-2 h-4 w-4" />
                Gestion Classes
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card className="shadow-soft lg:col-span-2">
            <CardHeader>
              <CardTitle>Activités Récentes</CardTitle>
              <CardDescription>
                Les dernières actions dans le système
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.length > 0 ? (
                  recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        activity.type === 'Nouveau' ? 'bg-secondary' :
                        activity.type === 'Paiement' ? 'bg-primary' :
                        activity.type === 'Note' ? 'bg-accent' : 'bg-destructive'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">
                          {activity.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Aucune activité récente</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts */}
        <Card className="shadow-soft border-l-4 border-l-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Alertes & Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-center py-4 text-muted-foreground">
                <p>Aucune alerte pour le moment</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Index;

import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { School, Users, MapPin, Clock, Plus } from "lucide-react";
import { useClassesContext } from "@/contexts/ClassesContext";

const Classes = () => {
  const { classes } = useClassesContext();

  const getCapacityColor = (current: number, capacity: number) => {
    const percentage = (current / capacity) * 100;
    if (percentage >= 90) return "text-education-danger";
    if (percentage >= 75) return "text-education-warning";
    return "text-education-success";
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gestion des Classes</h1>
            <p className="text-muted-foreground">
              Vue d'ensemble de toutes les classes de l'école
            </p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle Classe
          </Button>
        </div>

        {/* Statistics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="shadow-soft">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <School className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{classes.length}</p>
                  <p className="text-sm text-muted-foreground">Classes Actives</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-soft">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-8 w-8 text-education-accent" />
                <div>
                  <p className="text-2xl font-bold">
                    {classes.reduce((sum, cls) => sum + cls.student_count, 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Élèves</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <MapPin className="h-8 w-8 text-education-secondary" />
                <div>
                  <p className="text-2xl font-bold">
                    {classes.reduce((sum, cls) => sum + cls.capacity, 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Capacité Totale</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-8 w-8 text-education-success" />
                <div>
                  <p className="text-2xl font-bold">
                    {classes.length > 0 ? Math.round((classes.reduce((sum, cls) => sum + cls.student_count, 0) / 
                    classes.reduce((sum, cls) => sum + cls.capacity, 0)) * 100) : 0}%
                  </p>
                  <p className="text-sm text-muted-foreground">Taux d'Occupation</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Classes Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {classes.map((schoolClass) => {
            const occupancyPercentage = (schoolClass.student_count / schoolClass.capacity) * 100;
            
            return (
              <Card key={schoolClass.id} className="shadow-soft hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{schoolClass.name}</CardTitle>
                    <Badge variant="outline">{schoolClass.level}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className={getCapacityColor(schoolClass.student_count, schoolClass.capacity)}>
                      {schoolClass.student_count}/{schoolClass.capacity} élèves
                    </span>
                  </div>

                  <Progress value={occupancyPercentage} className="h-2" />

                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <School className="h-4 w-4" />
                      <span>{schoolClass.teacher}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <Badge className="bg-education-success/10 text-education-success hover:bg-education-success/20">
                      Active
                    </Badge>
                    <Button variant="outline" size="sm">
                      Voir Détails
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default Classes;
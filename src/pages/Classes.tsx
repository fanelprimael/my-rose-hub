import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { School, Users, MapPin, Clock, Plus, Eye, Edit, Trash2 } from "lucide-react";
import { useClassesContext } from "@/contexts/ClassesContext";
import { AddClassForm } from "@/components/forms/AddClassForm";
import { useState } from "react";

const Classes = () => {
  const { classes, loading, deleteClass } = useClassesContext();
  const [showAddForm, setShowAddForm] = useState(false);

  const getCapacityColor = (current: number, capacity: number) => {
    const percentage = (current / capacity) * 100;
    if (percentage >= 90) return "text-education-danger";
    if (percentage >= 75) return "text-education-warning";
    return "text-education-success";
  };

  if (loading) {
    return <Layout><div className="flex items-center justify-center h-64">Chargement...</div></Layout>;
  }

  return (
    <Layout>
      {showAddForm && <AddClassForm onClose={() => setShowAddForm(false)} />}
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gestion des Classes</h1>
            <p className="text-muted-foreground">
              Vue d'ensemble de toutes les classes de l'école
            </p>
          </div>
          <Button onClick={() => setShowAddForm(true)} className="bg-primary hover:bg-primary/90">
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

        {/* Classes Table */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Liste des Classes ({classes.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Niveau</TableHead>
                    <TableHead>Enseignant</TableHead>
                    <TableHead>Capacité</TableHead>
                    <TableHead>Élèves</TableHead>
                    <TableHead>Occupation</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {classes.map((schoolClass) => {
                    const occupancyPercentage = (schoolClass.student_count / schoolClass.capacity) * 100;
                    
                    return (
                      <TableRow key={schoolClass.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">{schoolClass.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{schoolClass.level}</Badge>
                        </TableCell>
                        <TableCell>{schoolClass.teacher}</TableCell>
                        <TableCell>{schoolClass.capacity}</TableCell>
                        <TableCell>{schoolClass.student_count}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Progress value={occupancyPercentage} className="h-2 w-16" />
                            <span className="text-sm">{Math.round(occupancyPercentage)}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-education-success/10 text-education-success hover:bg-education-success/20">
                            Active
                          </Badge>
                        </TableCell>
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
                              onClick={() => deleteClass(schoolClass.id)}
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

            {classes.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>Aucune classe trouvée.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Classes;
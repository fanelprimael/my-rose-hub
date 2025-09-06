import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Mail, Phone, Calendar, DollarSign, BookOpen, Users, UserPlus } from "lucide-react";
import { useTeachersContext } from "@/contexts/TeachersContext";

const Teachers = () => {
  const { teachers } = useTeachersContext();

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const formatSalary = (salary: number) => {
    return new Intl.NumberFormat('fr-FR').format(salary) + " FCFA";
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gestion des Enseignants</h1>
            <p className="text-muted-foreground">
              Gérez les informations du personnel enseignant
            </p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <UserPlus className="mr-2 h-4 w-4" />
            Nouvel Enseignant
          </Button>
        </div>

        {/* Statistics */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="shadow-soft">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{teachers.length}</p>
                  <p className="text-sm text-muted-foreground">Enseignants Actifs</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-soft">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-8 w-8 text-education-accent" />
                <div>
                  <p className="text-2xl font-bold">
                    {[...new Set(teachers.flatMap(t => t.subjects))].length}
                  </p>
                  <p className="text-sm text-muted-foreground">Matières Enseignées</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-8 w-8 text-education-success" />
                <div>
                  <p className="text-2xl font-bold">
                    {new Intl.NumberFormat('fr-FR').format(
                      teachers.reduce((sum, t) => sum + t.salary, 0)
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground">Masse Salariale (FCFA)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Teachers Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {teachers.map((teacher) => (
            <Card key={teacher.id} className="shadow-soft hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getInitials(teacher.firstName, teacher.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-lg">
                      {teacher.firstName} {teacher.lastName}
                    </CardTitle>
                    <Badge 
                      className={teacher.status === 'active' 
                        ? "bg-education-success/10 text-education-success hover:bg-education-success/20" 
                        : "bg-muted"
                      }
                    >
                      {teacher.status === 'active' ? 'Actif' : 'Inactif'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>{teacher.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{teacher.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Depuis {new Date(teacher.hireDate).getFullYear()}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <DollarSign className="h-4 w-4" />
                    <span>{formatSalary(teacher.salary)}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium mb-1">Matières:</p>
                    <div className="flex flex-wrap gap-1">
                      {teacher.subjects.map((subject, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-1">Classes:</p>
                    <div className="flex flex-wrap gap-1">
                      {teacher.classes.map((className, index) => (
                        <Badge key={index} className="text-xs bg-primary/10 text-primary hover:bg-primary/20">
                          {className}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-2">
                  <Button variant="outline" size="sm">
                    Voir Profil
                  </Button>
                  <Button variant="outline" size="sm">
                    Modifier
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Teachers;
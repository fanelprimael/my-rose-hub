import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, TrendingUp, Users, FileText, Plus } from "lucide-react";
import { useState } from "react";

const Grades = () => {
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");

  const classes = ['CP', 'CE1', 'CE2', 'CM1', 'CM2'];
  const subjects = ['Français', 'Mathématiques', 'Sciences', 'Histoire-Géographie', 'Anglais'];

  // Mock data for demonstration
  const gradeStats = [
    { subject: 'Français', average: 14.5, students: 28 },
    { subject: 'Mathématiques', average: 13.2, students: 28 },
    { subject: 'Sciences', average: 15.1, students: 28 },
    { subject: 'Histoire-Géo', average: 14.8, students: 28 },
  ];

  const recentGrades = [
    { student: 'Amirah Diallo', subject: 'Français', grade: 16, date: '2024-01-20' },
    { student: 'Ibrahim Ba', subject: 'Mathématiques', grade: 14, date: '2024-01-20' },
    { student: 'Mariama Sall', subject: 'Sciences', grade: 18, date: '2024-01-19' },
    { student: 'Amirah Diallo', subject: 'Histoire-Géo', grade: 15, date: '2024-01-19' },
  ];

  const getGradeColor = (grade: number) => {
    if (grade >= 16) return "text-education-success";
    if (grade >= 12) return "text-education-secondary";
    if (grade >= 10) return "text-education-warning";
    return "text-education-danger";
  };

  const getGradeBadge = (grade: number) => {
    if (grade >= 16) return "bg-education-success/10 text-education-success hover:bg-education-success/20";
    if (grade >= 12) return "bg-education-secondary/10 text-education-secondary hover:bg-education-secondary/20";
    if (grade >= 10) return "bg-education-warning/10 text-education-warning hover:bg-education-warning/20";
    return "bg-education-danger/10 text-education-danger hover:bg-education-danger/20";
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gestion des Notes</h1>
            <p className="text-muted-foreground">
              Saisie et suivi des évaluations des élèves
            </p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle Note
          </Button>
        </div>

        {/* Filters */}
        <Card className="shadow-soft">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une classe" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((cls) => (
                      <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une matière" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                Générer Bulletin
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="shadow-soft">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">147</p>
                  <p className="text-sm text-muted-foreground">Notes Saisies</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-soft">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-8 w-8 text-education-success" />
                <div>
                  <p className="text-2xl font-bold">14.3</p>
                  <p className="text-sm text-muted-foreground">Moyenne Générale</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-8 w-8 text-education-accent" />
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
                <FileText className="h-8 w-8 text-education-secondary" />
                <div>
                  <p className="text-2xl font-bold">28</p>
                  <p className="text-sm text-muted-foreground">Bulletins Générés</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Subject Averages */}
          <Card className="shadow-soft lg:col-span-2">
            <CardHeader>
              <CardTitle>Moyennes par Matière</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {gradeStats.map((stat, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center space-x-3">
                      <BookOpen className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">{stat.subject}</p>
                        <p className="text-sm text-muted-foreground">{stat.students} élèves</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold ${getGradeColor(stat.average)}`}>
                        {stat.average}/20
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Grades */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Notes Récentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentGrades.map((grade, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                    <div>
                      <p className="font-medium text-sm">{grade.student}</p>
                      <p className="text-xs text-muted-foreground">{grade.subject}</p>
                    </div>
                    <div className="text-right">
                      <Badge className={getGradeBadge(grade.grade)}>
                        {grade.grade}/20
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(grade.date).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Grades;
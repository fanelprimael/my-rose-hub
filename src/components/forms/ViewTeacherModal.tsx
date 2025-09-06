import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { X, User, Calendar, Phone, Mail, BookOpen, Users } from "lucide-react";

interface Teacher {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  subjects: string[];
  classes: string[];
  hire_date?: string;
  status: string;
}

interface ViewTeacherModalProps {
  teacher: Teacher;
  onClose: () => void;
}

export const ViewTeacherModal: React.FC<ViewTeacherModalProps> = ({ teacher, onClose }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-education-success/10 text-education-success hover:bg-education-success/20">Actif</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inactif</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Profil de l'Enseignant</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Teacher Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                  {teacher.first_name?.[0]}{teacher.last_name?.[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-2xl font-bold">{teacher.first_name} {teacher.last_name}</h3>
                <p className="text-muted-foreground">ID: {teacher.id.substring(0, 8)}</p>
                {getStatusBadge(teacher.status)}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-lg">Informations Personnelles</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span><strong>Email:</strong> {teacher.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span><strong>Téléphone:</strong> {teacher.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span><strong>Date d'embauche:</strong> {teacher.hire_date ? new Date(teacher.hire_date).toLocaleDateString('fr-FR') : 'N/A'}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-lg">Affectations</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Matières enseignées:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {teacher.subjects.map((subject, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Classes assignées:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {teacher.classes.map((className, index) => (
                        <Badge key={index} className="text-xs bg-primary/10 text-primary hover:bg-primary/20">
                          {className}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={onClose}>Fermer</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
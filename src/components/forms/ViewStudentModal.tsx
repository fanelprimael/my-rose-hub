import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, User, Calendar, MapPin, Phone, Mail } from "lucide-react";

interface Student {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  age?: number;
  gender?: string;
  class: string;
  parent_name: string;
  parent_phone: string;
  parent_email: string;
  address: string;
  status: string;
}

interface ViewStudentModalProps {
  student: Student;
  onClose: () => void;
}

export const ViewStudentModal: React.FC<ViewStudentModalProps> = ({ student, onClose }) => {
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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Profil de l'Élève</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Student Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">{student.first_name} {student.last_name}</h3>
                <p className="text-muted-foreground">ID: {student.id.substring(0, 8)}</p>
                {getStatusBadge(student.status)}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-lg">Informations Personnelles</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      <strong>Date de naissance:</strong> {new Date(student.date_of_birth).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span><strong>Âge:</strong> {student.age || 'N/A'} ans</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span><strong>Genre:</strong> {student.gender || 'N/A'}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span><strong>Classe:</strong> {student.class}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span><strong>Adresse:</strong> {student.address}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-lg">Contact Parent/Tuteur</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span><strong>Nom:</strong> {student.parent_name}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span><strong>Téléphone:</strong> {student.parent_phone}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span><strong>Email:</strong> {student.parent_email}</span>
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
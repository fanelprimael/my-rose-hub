import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { X, School, Users, MapPin, User, Calendar } from "lucide-react";

interface ClassType {
  id: string;
  name: string;
  level: string;
  teacher: string;
  capacity: number;
  student_count: number;
  created_at: string;
  updated_at: string;
}

interface ViewClassModalProps {
  classData: ClassType;
  onClose: () => void;
}

export const ViewClassModal: React.FC<ViewClassModalProps> = ({ classData, onClose }) => {
  const occupancyPercentage = (classData.student_count / classData.capacity) * 100;
  
  const getCapacityColor = (current: number, capacity: number) => {
    const percentage = (current / capacity) * 100;
    if (percentage >= 90) return "text-red-600";
    if (percentage >= 75) return "text-yellow-600";
    return "text-green-600";
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Détails de la Classe</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Class Header */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <School className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">{classData.name}</h3>
                <p className="text-muted-foreground">ID: {classData.id.substring(0, 8)}</p>
                <Badge variant="outline">{classData.level}</Badge>
              </div>
            </div>

            {/* Capacity Information */}
            <div className="bg-muted/30 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Capacité de la classe</span>
                <span className={`text-sm font-medium ${getCapacityColor(classData.student_count, classData.capacity)}`}>
                  {classData.student_count}/{classData.capacity} élèves
                </span>
              </div>
              <Progress value={occupancyPercentage} className="h-3" />
              <p className="text-xs text-muted-foreground mt-1">
                Taux d'occupation: {Math.round(occupancyPercentage)}%
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-lg">Informations Générales</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm">
                    <School className="h-4 w-4 text-muted-foreground" />
                    <span><strong>Nom de la classe:</strong> {classData.name}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span><strong>Niveau:</strong> {classData.level}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span><strong>Enseignant principal:</strong> {classData.teacher}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span><strong>Créée le:</strong> {new Date(classData.created_at).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-lg">Statistiques</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span><strong>Élèves inscrits:</strong> {classData.student_count}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span><strong>Capacité maximale:</strong> {classData.capacity}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span><strong>Places disponibles:</strong> {classData.capacity - classData.student_count}</span>
                  </div>
                </div>

                <div className="mt-4">
                  <Badge 
                    className={
                      occupancyPercentage >= 90 
                        ? "bg-red-100 text-red-800 hover:bg-red-200" 
                        : occupancyPercentage >= 75 
                        ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                        : "bg-green-100 text-green-800 hover:bg-green-200"
                    }
                  >
                    {occupancyPercentage >= 90 ? "Classe Pleine" : 
                     occupancyPercentage >= 75 ? "Presque Pleine" : "Places Disponibles"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>Fermer</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
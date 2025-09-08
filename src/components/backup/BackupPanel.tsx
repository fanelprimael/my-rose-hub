import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Download, 
  Upload, 
  Save, 
  RefreshCw, 
  Clock, 
  AlertCircle,
  CheckCircle,
  HardDrive,
  Cloud
} from "lucide-react";
import { useBackup } from "@/contexts/BackupContext";

export const BackupPanel: React.FC = () => {
  const {
    isAutoSaveEnabled,
    lastBackupTime,
    syncStatus,
    toggleAutoSave,
    performBackup,
    loadBackup,
    checkSyncStatus,
    performAutoSave
  } = useBackup();

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return 'Jamais';
    return new Date(dateString).toLocaleString('fr-FR');
  };

  const isElectron = typeof window !== 'undefined' && window.require;

  return (
    <div className="space-y-6">
      {/* Configuration de la sauvegarde automatique */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Save className="h-5 w-5 text-primary" />
            Sauvegarde Automatique
          </CardTitle>
          <CardDescription>
            Configuration de la sauvegarde automatique des données
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Sauvegarde automatique</Label>
              <p className="text-sm text-muted-foreground">
                Sauvegarde les données toutes les 5 minutes
              </p>
            </div>
            <Switch 
              checked={isAutoSaveEnabled}
              onCheckedChange={toggleAutoSave}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Dernière sauvegarde :</span>
            </div>
            <Badge variant={lastBackupTime ? "secondary" : "destructive"}>
              {formatDateTime(lastBackupTime)}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {syncStatus.hasChanges ? (
                <AlertCircle className="h-4 w-4 text-orange-500" />
              ) : (
                <CheckCircle className="h-4 w-4 text-green-500" />
              )}
              <span className="text-sm">Statut de synchronisation :</span>
            </div>
            <div className="text-right">
              <Badge variant={syncStatus.hasChanges ? "destructive" : "secondary"}>
                {syncStatus.hasChanges ? "Non synchronisé" : "Synchronisé"}
              </Badge>
              <p className="text-xs text-muted-foreground mt-1">
                {syncStatus.summary}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={performAutoSave}
              disabled={!isAutoSaveEnabled}
            >
              <Save className="mr-2 h-4 w-4" />
              Sauvegarder Maintenant
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={checkSyncStatus}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Vérifier Sync
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Sauvegarde manuelle */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="h-5 w-5 text-primary" />
            Sauvegarde Manuelle
          </CardTitle>
          <CardDescription>
            {isElectron 
              ? "Sauvegardez ou restaurez vos données depuis un fichier local" 
              : "Téléchargez ou importez vos données"
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button onClick={performBackup} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              {isElectron ? "Sauvegarder vers Fichier" : "Télécharger Sauvegarde"}
            </Button>
            
            <Button variant="outline" onClick={loadBackup} className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              {isElectron ? "Restaurer depuis Fichier" : "Importer Sauvegarde"}
            </Button>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Cloud className="h-4 w-4" />
              Sauvegarde Hybride
            </h4>
            <p className="text-sm text-muted-foreground">
              Cette application utilise une approche hybride : vos données principales sont stockées 
              dans Supabase (cloud) pour la synchronisation, et une copie locale est automatiquement 
              maintenue {isElectron ? "sur votre disque dur" : "dans votre navigateur"} en cas de 
              problème réseau.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Informations système */}
      <Card>
        <CardHeader>
          <CardTitle>Informations Système</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Mode d'exécution :</span>
            <Badge variant="outline">
              {isElectron ? "Application Desktop" : "Application Web"}
            </Badge>
          </div>
          <div className="flex justify-between text-sm">
            <span>Stockage local :</span>
            <Badge variant="outline">
              {isElectron ? "Fichier système" : "LocalStorage"}
            </Badge>
          </div>
          <div className="flex justify-between text-sm">
            <span>Stockage distant :</span>
            <Badge variant="outline">Supabase Cloud</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
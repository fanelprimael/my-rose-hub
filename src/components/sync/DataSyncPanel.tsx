import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useHybridSync } from '@/hooks/useHybridSync';
import { useToast } from '@/hooks/use-toast';
import { 
  Cloud, 
  HardDrive, 
  Download, 
  Upload, 
  Wifi, 
  WifiOff, 
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export const DataSyncPanel: React.FC = () => {
  const { syncStatus, isElectron, saveToLocal, loadFromLocal, exportData } = useHybridSync();
  const { toast } = useToast();

  const handleManualBackup = async () => {
    const result = await saveToLocal();
    
    if (result?.success) {
      toast({
        title: "Sauvegarde locale réussie",
        description: "Vos données ont été sauvegardées sur le disque dur",
      });
    } else {
      toast({
        title: "Erreur de sauvegarde",
        description: result?.error || "Impossible de sauvegarder",
        variant: "destructive"
      });
    }
  };

  const handleLoadLocal = async () => {
    const result = await loadFromLocal();
    
    if (result?.success) {
      toast({
        title: "Données locales chargées",
        description: `Sauvegarde du ${result.backupDate}`,
      });
    } else {
      toast({
        title: "Aucune sauvegarde locale",
        description: result?.error || "Aucune donnée locale trouvée",
        variant: "destructive"
      });
    }
  };

  const handleExport = async () => {
    const result = await exportData();
    
    if (result?.success) {
      toast({
        title: "Export réussi",
        description: `Données exportées vers ${result.path}`,
      });
    } else {
      toast({
        title: "Erreur d'export",
        description: result?.error || "Impossible d'exporter",
        variant: "destructive"
      });
    }
  };

  if (!isElectron) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="h-5 w-5" />
            Synchronisation en ligne
          </CardTitle>
          <CardDescription>
            Vos données sont automatiquement synchronisées avec Supabase
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Badge variant={syncStatus.isOnline ? "default" : "destructive"}>
              {syncStatus.isOnline ? (
                <>
                  <Wifi className="h-3 w-3 mr-1" />
                  En ligne
                </>
              ) : (
                <>
                  <WifiOff className="h-3 w-3 mr-1" />
                  Hors ligne
                </>
              )}
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="h-5 w-5" />
            Synchronisation Hybride
          </CardTitle>
          <CardDescription>
            Données synchronisées en ligne + sauvegarde locale automatique
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Status de connexion */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Connexion Internet</span>
            <Badge variant={syncStatus.isOnline ? "default" : "destructive"}>
              {syncStatus.isOnline ? (
                <>
                  <Wifi className="h-3 w-3 mr-1" />
                  En ligne
                </>
              ) : (
                <>
                  <WifiOff className="h-3 w-3 mr-1" />
                  Hors ligne
                </>
              )}
            </Badge>
          </div>

          {/* Dernière sauvegarde */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Dernière sauvegarde locale</span>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-3 w-3" />
              {syncStatus.lastBackup 
                ? syncStatus.lastBackup.toLocaleString()
                : "Jamais"
              }
            </div>
          </div>

          <Separator />

          {/* Actions de sauvegarde */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Sauvegarde manuelle</p>
                <p className="text-xs text-muted-foreground">
                  Sauvegarder immédiatement sur le disque dur
                </p>
              </div>
              <Button onClick={handleManualBackup} size="sm">
                <HardDrive className="h-4 w-4 mr-1" />
                Sauvegarder
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Charger sauvegarde locale</p>
                <p className="text-xs text-muted-foreground">
                  Voir les données de la dernière sauvegarde
                </p>
              </div>
              <Button onClick={handleLoadLocal} variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-1" />
                Charger
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Export des données</p>
                <p className="text-xs text-muted-foreground">
                  Exporter toutes les données vers un fichier
                </p>
              </div>
              <Button onClick={handleExport} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                Exporter
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informations automatiques */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <CheckCircle className="h-4 w-4" />
            Fonctionnalités automatiques
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <AlertCircle className="h-3 w-3 text-blue-500" />
            <span>Sauvegarde automatique toutes les 5 minutes</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <AlertCircle className="h-3 w-3 text-green-500" />
            <span>Sauvegarde après chaque modification</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <AlertCircle className="h-3 w-3 text-purple-500" />
            <span>Conservation des 30 dernières sauvegardes</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
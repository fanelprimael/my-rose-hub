import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Settings as SettingsIcon, 
  School, 
  Users, 
  Bell, 
  Shield, 
  Database,
  Mail,
  Save
} from "lucide-react";

const Settings = () => {
  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Paramètres</h1>
            <p className="text-muted-foreground">
              Configuration générale du système
            </p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Save className="mr-2 h-4 w-4" />
            Sauvegarder
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Settings Navigation */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="h-5 w-5" />
                Catégories
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="ghost" className="w-full justify-start">
                <School className="mr-2 h-4 w-4" />
                École
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                Utilisateurs
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Shield className="mr-2 h-4 w-4" />
                Sécurité
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Database className="mr-2 h-4 w-4" />
                Sauvegarde
              </Button>
            </CardContent>
          </Card>

          {/* Main Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* School Information */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <School className="h-5 w-5 text-primary" />
                  Informations de l'École
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="school-name">Nom de l'École</Label>
                    <Input id="school-name" defaultValue="La Roseraie" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="school-code">Code Établissement</Label>
                    <Input id="school-code" defaultValue="LR2024" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="school-address">Adresse</Label>
                  <Input id="school-address" defaultValue="123 Avenue de l'Éducation, Dakar, Sénégal" />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="school-phone">Téléphone</Label>
                    <Input id="school-phone" defaultValue="+221 33 123 4567" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="school-email">Email</Label>
                    <Input id="school-email" defaultValue="contact@laroseraie.sn" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Academic Settings */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Paramètres Académiques</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Année Scolaire</Label>
                    <p className="text-sm text-muted-foreground">
                      Année scolaire actuelle
                    </p>
                  </div>
                  <Input className="w-32" defaultValue="2023-2024" />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notation sur 20</Label>
                    <p className="text-sm text-muted-foreground">
                      Utiliser le système de notation français
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Bulletins Automatiques</Label>
                    <p className="text-sm text-muted-foreground">
                      Génération automatique des bulletins
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notifications Email</Label>
                    <p className="text-sm text-muted-foreground">
                      Recevoir des notifications par email
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Alertes Absence</Label>
                    <p className="text-sm text-muted-foreground">
                      Alertes automatiques pour les absences
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Rappels Paiement</Label>
                    <p className="text-sm text-muted-foreground">
                      Rappels automatiques de paiement
                    </p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Sécurité
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Authentification à 2 Facteurs</Label>
                    <p className="text-sm text-muted-foreground">
                      Sécurité renforcée pour les comptes
                    </p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Audit des Actions</Label>
                    <p className="text-sm text-muted-foreground">
                      Enregistrer toutes les actions utilisateurs
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Sauvegarde Automatique</Label>
                    <p className="text-sm text-muted-foreground">
                      Sauvegarde quotidienne des données
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
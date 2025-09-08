import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { useSchoolYearsContext } from "@/contexts/SchoolYearsContext";
import { BackupPanel } from "@/components/backup/BackupPanel";
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

interface SchoolSettings {
  id?: string;
  name: string;
  type: string;
  address: string;
  phone: string;
  email: string;
  school_year: string;
  currency: string;
  email_notifications: boolean;
  maintenance_mode: boolean;
}

const Settings = () => {
  const { toast } = useToast();
  const { currentSchoolYear } = useSchoolYearsContext();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('school');
  
  // États pour les paramètres
  const [schoolSettings, setSchoolSettings] = useState<SchoolSettings>({
    name: "La Roseraie",
    type: "École Privée",
    address: "123 Avenue de l'Éducation, Dakar, Sénégal",
    phone: "+221 33 123 4567",
    email: "contact@laroseraie.sn",
    school_year: "", // Ne sera pas utilisé, on prendra currentSchoolYear
    currency: "FCFA",
    email_notifications: true,
    maintenance_mode: false
  });

  // États pour les paramètres académiques
  const [academicSettings, setAcademicSettings] = useState({
    gradingScale: true,
    automaticReports: true,
    actionAudit: true,
    autoBackup: true
  });

  // États pour les notifications
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    absenceAlerts: true,
    paymentReminders: false
  });

  // Charger les paramètres depuis la base de données
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('school_settings')
        .select('*')
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading settings:', error);
        return;
      }

      if (data) {
        setSchoolSettings(prev => ({
          ...prev,
          id: data.id,
          name: data.name || prev.name,
          type: data.type || prev.type,
          address: data.address || prev.address,
          phone: data.phone || prev.phone,
          email: data.email || prev.email,
          school_year: data.school_year || currentSchoolYear?.name || prev.school_year,
          currency: data.currency || prev.currency,
          email_notifications: data.email_notifications,
          maintenance_mode: data.maintenance_mode
        }));
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setLoading(true);
      
      const settingsData = {
        name: schoolSettings.name,
        type: schoolSettings.type,
        address: schoolSettings.address,
        phone: schoolSettings.phone,
        email: schoolSettings.email,
        school_year: currentSchoolYear?.name || "Année non définie", // Automatiquement synchronisée
        currency: schoolSettings.currency,
        email_notifications: schoolSettings.email_notifications,
        maintenance_mode: schoolSettings.maintenance_mode
      };

      let error;
      
      if (schoolSettings.id) {
        // Mise à jour
        const result = await supabase
          .from('school_settings')
          .update(settingsData)
          .eq('id', schoolSettings.id);
        error = result.error;
      } else {
        // Insertion
        const result = await supabase
          .from('school_settings')
          .insert([settingsData]);
        error = result.error;
      }

      if (error) {
        console.error('Error saving settings:', error);
        toast({
          title: "Erreur",
          description: "Impossible de sauvegarder les paramètres",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Succès",
        description: "Paramètres sauvegardés avec succès"
      });
      
      // Recharger les paramètres pour obtenir l'ID si c'était une insertion
      await loadSettings();
      
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSchoolSetting = (field: keyof SchoolSettings, value: string | boolean) => {
    setSchoolSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

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
          <Button 
            onClick={saveSettings}
            disabled={loading}
            className="bg-primary hover:bg-primary/90"
          >
            <Save className="mr-2 h-4 w-4" />
            {loading ? 'Sauvegarde...' : 'Sauvegarder'}
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
              <Button 
                variant={activeTab === 'school' ? 'default' : 'ghost'} 
                className="w-full justify-start"
                onClick={() => setActiveTab('school')}
              >
                <School className="mr-2 h-4 w-4" />
                École
              </Button>
              <Button 
                variant={activeTab === 'users' ? 'default' : 'ghost'} 
                className="w-full justify-start"
                onClick={() => setActiveTab('users')}
              >
                <Users className="mr-2 h-4 w-4" />
                Utilisateurs
              </Button>
              <Button 
                variant={activeTab === 'notifications' ? 'default' : 'ghost'} 
                className="w-full justify-start"
                onClick={() => setActiveTab('notifications')}
              >
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </Button>
              <Button 
                variant={activeTab === 'security' ? 'default' : 'ghost'} 
                className="w-full justify-start"
                onClick={() => setActiveTab('security')}
              >
                <Shield className="mr-2 h-4 w-4" />
                Sécurité
              </Button>
              <Button 
                variant={activeTab === 'backup' ? 'default' : 'ghost'} 
                className="w-full justify-start"
                onClick={() => setActiveTab('backup')}
              >
                <Database className="mr-2 h-4 w-4" />
                Sauvegarde
              </Button>
            </CardContent>
          </Card>

          {/* Main Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* School Information */}
            {activeTab === 'school' && (
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
                      <Input 
                        id="school-name" 
                        value={schoolSettings.name}
                        onChange={(e) => updateSchoolSetting('name', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="school-type">Type d'Établissement</Label>
                      <Input 
                        id="school-type" 
                        value={schoolSettings.type}
                        onChange={(e) => updateSchoolSetting('type', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="school-address">Adresse</Label>
                    <Input 
                      id="school-address" 
                      value={schoolSettings.address}
                      onChange={(e) => updateSchoolSetting('address', e.target.value)}
                    />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="school-phone">Téléphone</Label>
                      <Input 
                        id="school-phone" 
                        value={schoolSettings.phone}
                        onChange={(e) => updateSchoolSetting('phone', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="school-email">Email</Label>
                      <Input 
                        id="school-email" 
                        value={schoolSettings.email}
                        onChange={(e) => updateSchoolSetting('email', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="school-year">Année Scolaire</Label>
                      <div className="flex items-center gap-2">
                        <Input 
                          id="school-year" 
                          value={currentSchoolYear?.name || "Aucune année définie"}
                          disabled
                          className="bg-muted"
                        />
                        <Button variant="outline" size="sm" onClick={() => window.location.href = '/school-years'}>
                          Modifier
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        L'année scolaire est automatiquement synchronisée avec l'année courante
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currency">Devise</Label>
                      <Input 
                        id="currency" 
                        value={schoolSettings.currency}
                        onChange={(e) => updateSchoolSetting('currency', e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Academic Settings */}
            {activeTab === 'school' && (
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle>Paramètres Académiques</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Année Scolaire Courante</Label>
                      <p className="text-sm text-muted-foreground">
                        {currentSchoolYear?.name || 'Aucune année définie'}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => window.location.href = '/school-years'}>
                      Gérer les Années
                    </Button>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Notation sur 20</Label>
                      <p className="text-sm text-muted-foreground">
                        Utiliser le système de notation français
                      </p>
                    </div>
                    <Switch 
                      checked={academicSettings.gradingScale}
                      onCheckedChange={(checked) => 
                        setAcademicSettings(prev => ({ ...prev, gradingScale: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Bulletins Automatiques</Label>
                      <p className="text-sm text-muted-foreground">
                        Génération automatique des bulletins
                      </p>
                    </div>
                    <Switch 
                      checked={academicSettings.automaticReports}
                      onCheckedChange={(checked) => 
                        setAcademicSettings(prev => ({ ...prev, automaticReports: checked }))
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Notification Settings */}
            {activeTab === 'notifications' && (
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
                    <Switch 
                      checked={schoolSettings.email_notifications}
                      onCheckedChange={(checked) => updateSchoolSetting('email_notifications', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Alertes Absence</Label>
                      <p className="text-sm text-muted-foreground">
                        Alertes automatiques pour les absences
                      </p>
                    </div>
                    <Switch 
                      checked={notificationSettings.absenceAlerts}
                      onCheckedChange={(checked) => 
                        setNotificationSettings(prev => ({ ...prev, absenceAlerts: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Rappels Paiement</Label>
                      <p className="text-sm text-muted-foreground">
                        Rappels automatiques de paiement
                      </p>
                    </div>
                    <Switch 
                      checked={notificationSettings.paymentReminders}
                      onCheckedChange={(checked) => 
                        setNotificationSettings(prev => ({ ...prev, paymentReminders: checked }))
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
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
                      <Label>Mode Maintenance</Label>
                      <p className="text-sm text-muted-foreground">
                        Désactiver l'accès au système temporairement
                      </p>
                    </div>
                    <Switch 
                      checked={schoolSettings.maintenance_mode}
                      onCheckedChange={(checked) => updateSchoolSetting('maintenance_mode', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Audit des Actions</Label>
                      <p className="text-sm text-muted-foreground">
                        Enregistrer toutes les actions utilisateurs
                      </p>
                    </div>
                    <Switch 
                      checked={academicSettings.actionAudit}
                      onCheckedChange={(checked) => 
                        setAcademicSettings(prev => ({ ...prev, actionAudit: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Sauvegarde Automatique</Label>
                      <p className="text-sm text-muted-foreground">
                        Sauvegarde quotidienne des données
                      </p>
                    </div>
                    <Switch 
                      checked={academicSettings.autoBackup}
                      onCheckedChange={(checked) => 
                        setAcademicSettings(prev => ({ ...prev, autoBackup: checked }))
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Gestion des Utilisateurs
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center py-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mb-4">
                      <Users className="h-8 w-8 text-blue-500" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Gestion des Utilisateurs</h3>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                      Cette fonctionnalité permettra de gérer les comptes utilisateurs, les rôles et les permissions d'accès au système.
                    </p>
                    <div className="space-y-3">
                      <div className="text-sm text-muted-foreground">
                        <div className="flex items-center justify-center gap-2 mb-1">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span>Création et gestion des comptes</span>
                        </div>
                        <div className="flex items-center justify-center gap-2 mb-1">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span>Attribution des rôles et permissions</span>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span>Historique des connexions</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="border-t pt-4">
                    <Button variant="outline" disabled className="w-full">
                      Fonctionnalité à venir
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Backup Tab */}
            {activeTab === 'backup' && (
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-primary" />
                    Sauvegarde et Restauration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <BackupPanel />
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
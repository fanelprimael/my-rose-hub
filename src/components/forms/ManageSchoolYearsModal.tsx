import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Plus, Calendar, Archive, CheckCircle, Clock, Zap, CalendarDays } from "lucide-react";
import { useState, useEffect } from "react";
import { useSchoolYearsContext } from "@/contexts/SchoolYearsContext";
import { useToast } from "@/hooks/use-toast";

interface ManageSchoolYearsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ManageSchoolYearsModal = ({ isOpen, onClose }: ManageSchoolYearsModalProps) => {
  const { schoolYears, addSchoolYear, setCurrentSchoolYear, archiveSchoolYear, loading } = useSchoolYearsContext();
  const { toast } = useToast();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newYear, setNewYear] = useState({
    name: '',
    start_date: '',
    end_date: ''
  });

  // Fonction pour générer automatiquement les dates d'année scolaire
  const generateSchoolYearDates = () => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // +1 car getMonth() retourne 0-11
    
    // Si on est avant septembre, l'année scolaire commence cette année
    // Si on est après septembre, l'année scolaire commence l'année prochaine
    const startYear = currentMonth < 9 ? currentYear : currentYear + 1;
    const endYear = startYear + 1;
    
    const yearName = `${startYear}-${endYear}`;
    const startDate = `${startYear}-09-15`; // 15 septembre
    const endDate = `${endYear}-06-30`; // 30 juin
    
    setNewYear({
      name: yearName,
      start_date: startDate,
      end_date: endDate
    });
  };

  // Fonction pour générer l'année scolaire spécifique 2025-2026
  const generate2025SchoolYear = () => {
    setNewYear({
      name: '2025-2026',
      start_date: '2025-09-15',
      end_date: '2026-06-30'
    });
  };

  // Initialiser avec l'année 2025-2026 par défaut
  useEffect(() => {
    if (showAddForm && !newYear.name) {
      generate2025SchoolYear();
    }
  }, [showAddForm]);

  const handleAddYear = async () => {
    if (!newYear.name || !newYear.start_date || !newYear.end_date) {
      toast({
        title: "Erreur",
        description: "Tous les champs sont requis",
        variant: "destructive"
      });
      return;
    }

    await addSchoolYear({
      ...newYear,
      is_current: false,
      is_active: true
    });

    setNewYear({ name: '', start_date: '', end_date: '' });
    setShowAddForm(false);
  };

  const handleSetCurrent = async (yearId: string) => {
    await setCurrentSchoolYear(yearId);
  };

  const handleArchive = async (yearId: string) => {
    await archiveSchoolYear(yearId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Gestion des Années Scolaires
            </span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        {/* Add New Year Form */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-lg">
              <span>Ajouter une Année Scolaire</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAddForm(!showAddForm)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle Année
              </Button>
            </CardTitle>
          </CardHeader>
          
          {showAddForm && (
            <CardContent>
              {/* Boutons de génération automatique */}
              <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Génération Automatique de Dates
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Button 
                    variant="outline" 
                    onClick={generate2025SchoolYear}
                    className="border-blue-300 hover:bg-blue-50 text-blue-700"
                  >
                    <CalendarDays className="h-4 w-4 mr-2" />
                    Année 2025-2026 (15/09/2025)
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={generateSchoolYearDates}
                    className="border-purple-300 hover:bg-purple-50 text-purple-700"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Prochaine Année Automatique
                  </Button>
                </div>
                <p className="text-xs text-blue-600 mt-2">
                  ⏰ Les dates sont générées automatiquement selon le calendrier scolaire français
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="year-name">Nom de l'année (ex: 2025-2026)</Label>
                  <Input
                    id="year-name"
                    value={newYear.name}
                    onChange={(e) => setNewYear({ ...newYear, name: e.target.value })}
                    placeholder="2025-2026"
                  />
                </div>
                <div>
                  <Label htmlFor="start-date">Date de début</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={newYear.start_date}
                    onChange={(e) => setNewYear({ ...newYear, start_date: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="end-date">Date de fin</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={newYear.end_date}
                    onChange={(e) => setNewYear({ ...newYear, end_date: e.target.value })}
                  />
                </div>
              </div>

              {/* Aperçu des dates */}
              {newYear.start_date && newYear.end_date && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 text-green-800">
                    <CheckCircle className="h-4 w-4" />
                    <span className="font-medium">Aperçu:</span>
                  </div>
                  <p className="text-sm text-green-700 mt-1">
                    L'année {newYear.name} durera du {formatDate(newYear.start_date)} au {formatDate(newYear.end_date)}
                  </p>
                </div>
              )}

              <div className="flex gap-2 mt-4">
                <Button onClick={handleAddYear} disabled={loading}>
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter l'Année
                </Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  Annuler
                </Button>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Existing Years Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Années Scolaires Existantes</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Année</TableHead>
                  <TableHead>Période</TableHead>
                  <TableHead className="text-center">Statut</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schoolYears.map((year) => (
                  <TableRow key={year.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {year.name}
                        {year.is_current && (
                          <Badge variant="default" className="text-xs">
                            Courante
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{formatDate(year.start_date)} - {formatDate(year.end_date)}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        {year.is_active ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                            <Archive className="h-3 w-3 mr-1" />
                            Archivée
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        {!year.is_current && year.is_active && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSetCurrent(year.id)}
                          >
                            <Clock className="h-3 w-3 mr-1" />
                            Activer
                          </Button>
                        )}
                        {year.is_active && !year.is_current && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleArchive(year.id)}
                          >
                            <Archive className="h-3 w-3 mr-1" />
                            Archiver
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {schoolYears.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>Aucune année scolaire trouvée.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">Information importante:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Une seule année scolaire peut être "Courante" à la fois</li>
            <li>• Les données (élèves, notes, paiements) sont liées à leur année scolaire</li>
            <li>• Archiver une année la rend en lecture seule mais conserve toutes les données</li>
            <li>• Vous pouvez consulter l'historique en sélectionnant une année différente</li>
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
};

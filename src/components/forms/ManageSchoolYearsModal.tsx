import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Plus, Calendar, Archive, CheckCircle, Clock } from "lucide-react";
import { useState } from "react";
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
              <div className="flex gap-2 mt-4">
                <Button onClick={handleAddYear} disabled={loading}>
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter
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

import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Archive, Clock, CheckCircle, Settings, History, BarChart3 } from "lucide-react";
import { useState } from "react";
import { useSchoolYearsContext } from "@/contexts/SchoolYearsContext";
import { ManageSchoolYearsModal } from "@/components/forms/ManageSchoolYearsModal";
import { SchoolYearSelector } from "@/components/forms/SchoolYearSelector";

const SchoolYearManagement = () => {
  const { schoolYears, currentSchoolYear, selectedSchoolYear } = useSchoolYearsContext();
  const [showManageModal, setShowManageModal] = useState(false);

  const activeYears = schoolYears.filter(year => year.is_active);
  const archivedYears = schoolYears.filter(year => !year.is_active);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gestion des Années Scolaires</h1>
            <p className="text-muted-foreground">
              Gérez les années scolaires et consultez l'historique des données
            </p>
          </div>
          <Button onClick={() => setShowManageModal(true)} className="bg-primary hover:bg-primary/90">
            <Settings className="mr-2 h-4 w-4" />
            Gérer les Années
          </Button>
        </div>

        {/* Year Selector */}
        <Card className="shadow-soft">
          <CardContent className="p-4">
            <SchoolYearSelector showCurrentBadge={true} />
          </CardContent>
        </Card>

        {/* Current Year Overview */}
        {currentSchoolYear && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="shadow-soft border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-xl font-bold">{currentSchoolYear.name}</p>
                    <p className="text-sm text-muted-foreground">Année Courante</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-soft">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-xl font-bold">{activeYears.length}</p>
                    <p className="text-sm text-muted-foreground">Années Actives</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-soft">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Archive className="h-8 w-8 text-orange-600" />
                  <div>
                    <p className="text-xl font-bold">{archivedYears.length}</p>
                    <p className="text-sm text-muted-foreground">Années Archivées</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-soft">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <History className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-xl font-bold">{schoolYears.length}</p>
                    <p className="text-sm text-muted-foreground">Total Années</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Active Years */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Années Scolaires Actives ({activeYears.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {activeYears.map((year) => (
                <Card key={year.id} className={`border ${year.is_current ? 'border-primary bg-primary/5' : 'border-border'}`}>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg">{year.name}</h3>
                        {year.is_current && (
                          <Badge variant="default" className="text-xs">
                            Courante
                          </Badge>
                        )}
                      </div>
                      
                      <div className="text-sm text-muted-foreground">
                        <div className="flex items-center gap-2 mb-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(year.start_date)} - {formatDate(year.end_date)}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3" />
                          Créée le {formatDate(year.created_at)}
                        </div>
                      </div>

                      {selectedSchoolYear?.id === year.id && (
                        <Badge variant="outline" className="text-xs w-full justify-center">
                          <BarChart3 className="h-3 w-3 mr-1" />
                          Année sélectionnée pour consultation
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {activeYears.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Aucune année scolaire active trouvée.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Archived Years */}
        {archivedYears.length > 0 && (
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Archive className="h-5 w-5 text-orange-600" />
                Années Scolaires Archivées ({archivedYears.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {archivedYears.map((year) => (
                  <Card key={year.id} className="border-border opacity-75">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-lg">{year.name}</h3>
                          <Badge variant="outline" className="text-xs bg-gray-50">
                            <Archive className="h-3 w-3 mr-1" />
                            Archivée
                          </Badge>
                        </div>
                        
                        <div className="text-sm text-muted-foreground">
                          <div className="flex items-center gap-2 mb-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(year.start_date)} - {formatDate(year.end_date)}
                          </div>
                        </div>

                        {selectedSchoolYear?.id === year.id && (
                          <Badge variant="outline" className="text-xs w-full justify-center">
                            <History className="h-3 w-3 mr-1" />
                            Consultation historique
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Information Card */}
        <Card className="shadow-soft bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <History className="h-5 w-5" />
              Fonctionnement du Système d'Années Scolaires
            </h3>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-2 text-sm text-blue-800">
                <p><strong>• Année Courante:</strong> Les nouvelles données sont automatiquement liées à l'année courante</p>
                <p><strong>• Consultation:</strong> Sélectionnez une année pour voir ses données spécifiques</p>
                <p><strong>• Archive:</strong> Les années archivées conservent toutes leurs données en lecture seule</p>
              </div>
              <div className="space-y-2 text-sm text-blue-800">
                <p><strong>• Historique:</strong> Toutes les notes, paiements et élèves restent accessibles par année</p>
                <p><strong>• Évolution:</strong> Comparez les performances entre différentes années</p>
                <p><strong>• Durabilité:</strong> L'application fonctionne année après année sans perte de données</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Manage Modal */}
        {showManageModal && (
          <ManageSchoolYearsModal
            isOpen={showManageModal}
            onClose={() => setShowManageModal(false)}
          />
        )}
      </div>
    </Layout>
  );
};

export default SchoolYearManagement;
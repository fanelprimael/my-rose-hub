import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, FileDown, TrendingUp, Users, Award } from "lucide-react";
import { StudentAnnualResult, getClassStatistics } from "@/utils/gradeCalculations";
import { generateAnnualBulletin } from "@/utils/exportUtils";

interface ViewAnnualResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  classResults: StudentAnnualResult[];
  className: string;
}

export const ViewAnnualResultsModal = ({ 
  isOpen, 
  onClose, 
  classResults, 
  className 
}: ViewAnnualResultsModalProps) => {
  const stats = getClassStatistics(classResults);
  
  const getMentionColor = (mention: string) => {
    switch (mention) {
      case 'Très Bien': return 'bg-green-100 text-green-800 border-green-200';
      case 'Bien': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Assez Bien': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Passable': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Insuffisant': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleGenerateClassReport = () => {
    generateAnnualBulletin(classResults, className, stats);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Résultats Annuels - Classe {className}</span>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleGenerateClassReport}
              >
                <FileDown className="h-4 w-4 mr-2" />
                Exporter PDF
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogTitle>
          <DialogDescription>
            Vue d'ensemble des résultats annuels pour la classe {className}
          </DialogDescription>
        </DialogHeader>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-6 w-6 text-primary" />
                <div>
                  <p className="text-xl font-bold">{stats.studentsEvaluated}/{stats.totalStudents}</p>
                  <p className="text-sm text-muted-foreground">Élèves Évalués</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-6 w-6 text-education-success" />
                <div>
                  <p className="text-xl font-bold">{stats.classAverage}/20</p>
                  <p className="text-sm text-muted-foreground">Moyenne Classe</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Award className="h-6 w-6 text-education-accent" />
                <div>
                  <p className="text-xl font-bold">{stats.passRate}%</p>
                  <p className="text-sm text-muted-foreground">Taux de Réussite</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Award className="h-6 w-6 text-primary" />
                <div>
                  <p className="text-xl font-bold">{stats.mentions['Très Bien'] + stats.mentions['Bien']}</p>
                  <p className="text-sm text-muted-foreground">Mentions B/TB</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mentions Distribution */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Répartition des Mentions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {Object.entries(stats.mentions).map(([mention, count]) => (
                <Badge 
                  key={mention} 
                  className={getMentionColor(mention)}
                  variant="outline"
                >
                  {mention}: {count} élève{count !== 1 ? 's' : ''}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Students Results Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Résultats par Élève</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Élève</TableHead>
                    <TableHead className="text-center">Matières</TableHead>
                    <TableHead className="text-center">Évaluations Complètes</TableHead>
                    <TableHead className="text-center">Moyenne Générale</TableHead>
                    <TableHead className="text-center">Mention</TableHead>
                    <TableHead className="text-center">Passage</TableHead>
                    <TableHead className="text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {classResults.map((result) => (
                    <TableRow key={result.student_id}>
                      <TableCell className="font-medium">
                        {result.student_name}
                      </TableCell>
                      <TableCell className="text-center">
                        {result.totalSubjects}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={result.subjectsWithAllEvaluations === result.totalSubjects ? "default" : "secondary"}>
                          {result.subjectsWithAllEvaluations}/{result.totalSubjects}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center font-bold">
                        <span className={
                          result.generalAverage >= 16 ? "text-green-600" :
                          result.generalAverage >= 12 ? "text-blue-600" :
                          result.generalAverage >= 10 ? "text-orange-600" : "text-red-600"
                        }>
                          {result.generalAverage}/20
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className={getMentionColor(result.mention)} variant="outline">
                          {result.mention}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={result.canPass ? "default" : "destructive"}>
                          {result.canPass ? "Admis" : "Redoublement"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => generateAnnualBulletin([result], className, stats)}
                        >
                          <FileDown className="h-4 w-4 mr-1" />
                          Bulletin
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {classResults.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>Aucun résultat disponible pour cette classe.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};
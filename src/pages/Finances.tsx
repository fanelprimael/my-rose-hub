import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrendingUp, TrendingDown, CreditCard, DollarSign, Plus, Download } from "lucide-react";
import { useFinances } from "@/hooks/useFinances";

const Finances = () => {
  const { records, stats } = useFinances();

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR').format(amount) + " FCFA";
  };

  const getTypeIcon = (type: string) => {
    return type === 'income' ? (
      <TrendingUp className="h-4 w-4 text-education-success" />
    ) : (
      <TrendingDown className="h-4 w-4 text-education-danger" />
    );
  };

  const getTypeBadge = (type: string) => {
    return type === 'income' ? (
      <Badge className="bg-education-success/10 text-education-success hover:bg-education-success/20">
        Recette
      </Badge>
    ) : (
      <Badge className="bg-education-danger/10 text-education-danger hover:bg-education-danger/20">
        Dépense
      </Badge>
    );
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gestion Financière</h1>
            <p className="text-muted-foreground">
              Suivi des revenus et dépenses de l'école
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Exporter
            </Button>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle Transaction
            </Button>
          </div>
        </div>

        {/* Financial Statistics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="shadow-soft">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-8 w-8 text-education-success" />
                <div>
                  <p className="text-lg font-bold text-education-success">
                    {formatAmount(stats.monthly_income)}
                  </p>
                  <p className="text-sm text-muted-foreground">Recettes du Mois</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-soft">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingDown className="h-8 w-8 text-education-danger" />
                <div>
                  <p className="text-lg font-bold text-education-danger">
                    {formatAmount(stats.monthly_expenses)}
                  </p>
                  <p className="text-sm text-muted-foreground">Dépenses du Mois</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-8 w-8 text-primary" />
                <div>
                  <p className={`text-lg font-bold ${
                    stats.monthly_profit >= 0 ? 'text-education-success' : 'text-education-danger'
                  }`}>
                    {formatAmount(stats.monthly_profit)}
                  </p>
                  <p className="text-sm text-muted-foreground">Résultat du Mois</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CreditCard className="h-8 w-8 text-education-accent" />
                <div>
                  <p className={`text-lg font-bold ${
                    stats.total_profit >= 0 ? 'text-education-success' : 'text-education-danger'
                  }`}>
                    {formatAmount(stats.total_profit)}
                  </p>
                  <p className="text-sm text-muted-foreground">Résultat Total</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card className="shadow-soft">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Transactions Récentes</CardTitle>
              <Button variant="outline" size="sm">
                Voir Tout
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Montant</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {records.slice(0, 10).map((record) => (
                    <TableRow key={record.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(record.type)}
                          {getTypeBadge(record.type)}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {record.description}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{record.category}</Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(record.date).toLocaleDateString('fr-FR')}
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={`font-bold ${
                          record.type === 'income' ? 'text-education-success' : 'text-education-danger'
                        }`}>
                          {record.type === 'income' ? '+' : '-'}{formatAmount(record.amount)}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {records.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>Aucune transaction enregistrée.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Financial Summary */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Répartition des Recettes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-education-success/5">
                  <span className="font-medium">Frais de Scolarité</span>
                  <span className="font-bold text-education-success">
                    {formatAmount(records.filter(r => r.type === 'income' && r.category === 'Scolarité')
                      .reduce((sum, r) => sum + r.amount, 0))}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-education-accent/5">
                  <span className="font-medium">Autres Revenus</span>
                  <span className="font-bold text-education-accent">
                    {formatAmount(records.filter(r => r.type === 'income' && r.category !== 'Scolarité')
                      .reduce((sum, r) => sum + r.amount, 0))}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Répartition des Dépenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-education-danger/5">
                  <span className="font-medium">Salaires</span>
                  <span className="font-bold text-education-danger">
                    {formatAmount(records.filter(r => r.type === 'expense' && r.category === 'Salaires')
                      .reduce((sum, r) => sum + r.amount, 0))}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-education-warning/5">
                  <span className="font-medium">Matériel & Fournitures</span>
                  <span className="font-bold text-education-warning">
                    {formatAmount(records.filter(r => r.type === 'expense' && r.category === 'Matériel')
                      .reduce((sum, r) => sum + r.amount, 0))}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Finances;
import React from "react";
import { useObtenirTableauBordRh, useObtenirEnseignantsEnDepassement } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Clock, CheckCircle2, AlertCircle, AlertTriangle, Wallet, Loader2, TrendingUp } from "lucide-react";

function fmt(n: number) {
  return n.toLocaleString("fr-FR", { maximumFractionDigits: 0 });
}

export default function RhDashboard() {
  const { data, isLoading, error } = useObtenirTableauBordRh();
  const { data: depassements, isLoading: loadingDep } = useObtenirEnseignantsEnDepassement();

  if (isLoading) {
    return <div className="flex h-[50vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  if (error || !data) {
    return <div className="text-center p-8 text-destructive">Erreur lors du chargement du tableau de bord.</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tableau de Bord RH</h1>
        <p className="text-muted-foreground mt-1">Aperçu de la saisie des heures et validations.</p>
      </div>

      {/* Cartes de synthèse */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Heures Saisies</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{data.totalHeuresSaisies}h</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Heures Validées</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold text-emerald-600">{data.totalHeuresValidees}h</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Attente</CardTitle>
            <AlertCircle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold text-amber-600">{data.totalHeuresEnAttente}h</div></CardContent>
        </Card>
        <Card className={data.nombreEnseignantsEnDepassement > 0 ? "border-red-300 bg-red-50" : ""}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={`text-sm font-medium ${data.nombreEnseignantsEnDepassement > 0 ? "text-red-700" : ""}`}>
              Dépassements
            </CardTitle>
            <AlertTriangle className={`h-4 w-4 ${data.nombreEnseignantsEnDepassement > 0 ? "text-red-500" : "text-muted-foreground"}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${data.nombreEnseignantsEnDepassement > 0 ? "text-red-700" : ""}`}>
              {data.nombreEnseignantsEnDepassement}
              <span className="text-sm font-normal text-muted-foreground ml-1">ens.</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Masse Salariale</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{fmt(data.masseSalariale)} FCFA</div></CardContent>
        </Card>
      </div>

      {/* Alertes dépassements */}
      {!loadingDep && depassements && depassements.length > 0 && (
        <Card className="border-red-200 bg-red-50/50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <CardTitle className="text-red-700">
                Alertes — Enseignants en dépassement du seuil ({depassements.length})
              </CardTitle>
            </div>
            <CardDescription className="text-red-600/80">
              Ces enseignants ont dépassé le seuil contractuel et perçoivent des heures complémentaires.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Enseignant</TableHead>
                  <TableHead>Département</TableHead>
                  <TableHead className="text-right">Total éq. TD</TableHead>
                  <TableHead className="text-right">H. normales</TableHead>
                  <TableHead className="text-right text-amber-700">H. complémentaires</TableHead>
                  <TableHead className="text-right text-emerald-700">Salaire normal</TableHead>
                  <TableHead className="text-right text-amber-700">Salaire surplus</TableHead>
                  <TableHead className="text-right font-semibold">Total annuel</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {depassements.map((d) => (
                  <TableRow key={d.enseignant.id} className="bg-white">
                    <TableCell>
                      <div className="font-medium">{d.enseignant.prenom} {d.enseignant.nom}</div>
                      <div className="text-xs text-muted-foreground">{d.enseignant.grade} · {d.enseignant.statut}</div>
                    </TableCell>
                    <TableCell>{d.enseignant.departement}</TableCell>
                    <TableCell className="text-right">{d.totalHeuresEquivalentTd.toFixed(1)} h</TableCell>
                    <TableCell className="text-right">{d.heuresContractuelles.toFixed(1)} h</TableCell>
                    <TableCell className="text-right">
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
                        <TrendingUp className="h-3 w-3" />
                        +{d.heuresComplementaires.toFixed(1)} h
                      </span>
                    </TableCell>
                    <TableCell className="text-right text-emerald-700">{fmt(d.montantNormal)} FCFA</TableCell>
                    <TableCell className="text-right text-amber-700 font-medium">{fmt(d.montantComplementaire)} FCFA</TableCell>
                    <TableCell className="text-right font-bold text-primary">{fmt(d.montantTotal)} FCFA</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Activité récente */}
      <Card>
        <CardHeader>
          <CardTitle>Dernière activité</CardTitle>
          <CardDescription>Les dernières heures saisies dans le système.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.derniereActivite.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucune activité récente.</p>
            ) : (
              data.derniereActivite.map((heure) => (
                <div key={heure.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div>
                    <p className="text-sm font-medium">{heure.nomEnseignant}</p>
                    <p className="text-xs text-muted-foreground">
                      {heure.intituleMatiere} — {heure.type} ({heure.duree}h) le {new Date(heure.date).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <div>
                    {heure.validee ? (
                      <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-emerald-100 text-emerald-700">Validée</span>
                    ) : (
                      <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-amber-100 text-amber-700">En attente</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

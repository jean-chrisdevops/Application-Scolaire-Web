import React from "react";
import { useObtenirTableauBordEnseignant, useListerHeures, useObtenirUtilisateurCourant } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2, Printer, CheckCircle2, Clock } from "lucide-react";

function fmt(n: number) {
  return n.toLocaleString("fr-FR", { maximumFractionDigits: 0 });
}

export default function EnseignantDashboard() {
  const { data: user } = useObtenirUtilisateurCourant();
  const { data: recap, isLoading: loadingRecap } = useObtenirTableauBordEnseignant();
  const { data: heures, isLoading: loadingHeures } = useListerHeures({ enseignantId: user?.enseignantId || undefined });

  if (loadingRecap || loadingHeures) {
    return <div className="flex h-[50vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  if (!recap) {
    return <div className="text-center p-8">Données introuvables. Vérifiez que votre compte est bien lié à un profil enseignant.</div>;
  }

  const handlePrint = () => window.print();

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center no-print">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mon Tableau de Bord</h1>
          <p className="text-muted-foreground mt-1">Année académique en cours</p>
        </div>
        <Button onClick={handlePrint}><Printer className="h-4 w-4 mr-2" /> Imprimer ma fiche</Button>
      </div>

      {/* Cartes récapitulatives annuelles */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="pb-2"><CardTitle className="text-sm">Total annuel à percevoir</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold text-primary">{fmt(recap.montantTotal)} FCFA</div></CardContent>
        </Card>
        <Card className="bg-emerald-50 border-emerald-200">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-emerald-700">Heures normales</CardTitle></CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-700">{fmt(recap.montantNormal)} FCFA</div>
            <p className="text-xs text-muted-foreground mt-1">{recap.heuresContractuelles.toFixed(1)} h éq. TD contractuelles</p>
          </CardContent>
        </Card>
        <Card className="bg-amber-50 border-amber-200">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-amber-700">Heures complémentaires</CardTitle></CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-700">{fmt(recap.montantComplementaire)} FCFA</div>
            <p className="text-xs text-muted-foreground mt-1">{recap.heuresComplementaires.toFixed(1)} h éq. TD en surplus</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Total réalisé (Éq. TD)</CardTitle></CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recap.totalHeuresEquivalentTd.toFixed(1)} h</div>
            <p className="text-xs text-muted-foreground mt-1">Seuil : {recap.heuresContractuelles.toFixed(0)} h</p>
          </CardContent>
        </Card>
      </div>

      {/* Volumes par type */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-center">Cours Magistraux (CM)</CardTitle></CardHeader><CardContent className="text-center text-xl font-semibold">{recap.totalHeuresCm} h</CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-center">Travaux Dirigés (TD)</CardTitle></CardHeader><CardContent className="text-center text-xl font-semibold">{recap.totalHeuresTd} h</CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-center">Travaux Pratiques (TP)</CardTitle></CardHeader><CardContent className="text-center text-xl font-semibold">{recap.totalHeuresTp} h</CardContent></Card>
      </div>

      {/* Tableau mensuel */}
      <Card>
        <CardHeader>
          <CardTitle>Récapitulatif mensuel</CardTitle>
        </CardHeader>
        <CardContent>
          {recap.recapMensuel.length === 0 ? (
            <p className="text-center py-6 text-muted-foreground">Aucune séance enregistrée.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mois</TableHead>
                  <TableHead className="text-right">CM (h)</TableHead>
                  <TableHead className="text-right">TD (h)</TableHead>
                  <TableHead className="text-right">TP (h)</TableHead>
                  <TableHead className="text-right">Éq. TD</TableHead>
                  <TableHead className="text-right text-emerald-700">Normales (h)</TableHead>
                  <TableHead className="text-right text-amber-700">Compl. (h)</TableHead>
                  <TableHead className="text-right text-emerald-700">Salaire normal</TableHead>
                  <TableHead className="text-right text-amber-700">Salaire surplus</TableHead>
                  <TableHead className="text-right font-bold">Total mois</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recap.recapMensuel.map((m) => (
                  <TableRow key={`${m.annee}-${m.mois}`}>
                    <TableCell className="font-medium">{m.label}</TableCell>
                    <TableCell className="text-right">{m.heuresCm > 0 ? `${m.heuresCm} h` : "—"}</TableCell>
                    <TableCell className="text-right">{m.heuresTd > 0 ? `${m.heuresTd} h` : "—"}</TableCell>
                    <TableCell className="text-right">{m.heuresTp > 0 ? `${m.heuresTp} h` : "—"}</TableCell>
                    <TableCell className="text-right">{m.heuresEquivalentTd.toFixed(1)} h</TableCell>
                    <TableCell className="text-right text-emerald-700">{m.heuresNormales.toFixed(1)} h</TableCell>
                    <TableCell className="text-right text-amber-700">{m.heuresComplementaires.toFixed(1)} h</TableCell>
                    <TableCell className="text-right text-emerald-700">{fmt(m.montantNormal)} FCFA</TableCell>
                    <TableCell className="text-right text-amber-700">{fmt(m.montantComplementaire)} FCFA</TableCell>
                    <TableCell className="text-right font-bold">{fmt(m.montantTotal)} FCFA</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Détail des séances */}
      <Card className="print-only:border-0 print-only:shadow-none">
        <CardHeader className="no-print">
          <CardTitle>Détail des séances</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Matière</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Durée</TableHead>
                <TableHead>Salle</TableHead>
                <TableHead className="text-right">Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {heures?.map((h) => (
                <TableRow key={h.id}>
                  <TableCell>{new Date(h.date).toLocaleDateString("fr-FR")}</TableCell>
                  <TableCell>{h.intituleMatiere}</TableCell>
                  <TableCell>{h.type}</TableCell>
                  <TableCell>{h.duree} h</TableCell>
                  <TableCell>{h.salle}</TableCell>
                  <TableCell className="text-right">
                    {h.validee ? (
                      <span className="inline-flex items-center text-emerald-600 font-medium"><CheckCircle2 className="h-4 w-4 mr-1" /> Validée</span>
                    ) : (
                      <span className="inline-flex items-center text-amber-600 font-medium"><Clock className="h-4 w-4 mr-1" /> En attente</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {(!heures || heures.length === 0) && (
                <TableRow><TableCell colSpan={6} className="text-center py-6 text-muted-foreground">Aucune séance enregistrée.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>

          <div className="hidden print-only:flex justify-between mt-24 px-12">
            <div className="text-center border-t border-black pt-2 w-48">Signature de l'enseignant</div>
            <div className="text-center border-t border-black pt-2 w-48">Validation RH</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

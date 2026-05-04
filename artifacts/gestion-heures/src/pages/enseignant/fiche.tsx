import React from "react";
import { useObtenirRecapitulatifEnseignant } from "@workspace/api-client-react";
import { useParams } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2, Printer } from "lucide-react";

function fmt(n: number) {
  return n.toLocaleString("fr-FR", { maximumFractionDigits: 0 });
}

export default function EnseignantFiche() {
  const params = useParams();
  const id = params.id ? parseInt(params.id) : 0;

  const { data: recap, isLoading } = useObtenirRecapitulatifEnseignant(id);

  const handlePrint = () => window.print();

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  if (!recap) {
    return <div className="text-center p-8">Fiche introuvable.</div>;
  }

  const totalNormal = recap.recapMensuel.reduce((s, m) => s + m.montantNormal, 0);
  const totalComp = recap.recapMensuel.reduce((s, m) => s + m.montantComplementaire, 0);

  return (
    <div className="space-y-8 bg-white min-h-screen print:bg-white">
      <div className="flex justify-between items-center no-print">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fiche de Synthèse</h1>
          <p className="text-muted-foreground mt-1">Pour export RH</p>
        </div>
        <Button onClick={handlePrint}><Printer className="h-4 w-4 mr-2" /> Imprimer / PDF</Button>
      </div>

      {/* En-tête de la fiche */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold uppercase mb-1">Université du Supérieur</h1>
        <h2 className="text-lg text-gray-700">Fiche Individuelle — Heures d'Enseignement</h2>
        <div className="mt-4 text-left border p-4 bg-gray-50 rounded-lg max-w-4xl mx-auto">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <p><strong>Enseignant :</strong> {recap.enseignant.prenom} {recap.enseignant.nom}</p>
            <p><strong>Email :</strong> {recap.enseignant.email}</p>
            <p><strong>Grade :</strong> {recap.enseignant.grade}</p>
            <p><strong>Statut :</strong> {recap.enseignant.statut}</p>
            <p><strong>Département :</strong> {recap.enseignant.departement}</p>
            <p><strong>Taux horaire :</strong> {fmt(recap.enseignant.tauxHoraire)} FCFA/h</p>
          </div>
        </div>
      </div>

      {/* Bilan annuel */}
      <div className="max-w-4xl mx-auto">
        <h3 className="text-base font-semibold mb-3 uppercase tracking-wide text-gray-600">Bilan annuel</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card>
            <CardHeader className="pb-1"><CardTitle className="text-xs text-muted-foreground">Total heures CM</CardTitle></CardHeader>
            <CardContent><div className="text-xl font-bold">{recap.totalHeuresCm} h</div></CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-1"><CardTitle className="text-xs text-muted-foreground">Total heures TD</CardTitle></CardHeader>
            <CardContent><div className="text-xl font-bold">{recap.totalHeuresTd} h</div></CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-1"><CardTitle className="text-xs text-muted-foreground">Total heures TP</CardTitle></CardHeader>
            <CardContent><div className="text-xl font-bold">{recap.totalHeuresTp} h</div></CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-1"><CardTitle className="text-xs text-muted-foreground">Total éq. TD</CardTitle></CardHeader>
            <CardContent><div className="text-xl font-bold">{recap.totalHeuresEquivalentTd.toFixed(1)} h</div></CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-3">
          <Card className="bg-emerald-50 border-emerald-200">
            <CardHeader className="pb-1"><CardTitle className="text-xs text-emerald-700">Salaire heures normales (annuel)</CardTitle></CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-emerald-700">{fmt(recap.montantNormal)} FCFA</div>
              <p className="text-xs text-muted-foreground">{recap.heuresContractuelles.toFixed(1)} h éq. TD contractuelles</p>
            </CardContent>
          </Card>
          <Card className="bg-amber-50 border-amber-200">
            <CardHeader className="pb-1"><CardTitle className="text-xs text-amber-700">Salaire heures complémentaires (annuel)</CardTitle></CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-amber-700">{fmt(recap.montantComplementaire)} FCFA</div>
              <p className="text-xs text-muted-foreground">{recap.heuresComplementaires.toFixed(1)} h éq. TD en surplus</p>
            </CardContent>
          </Card>
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader className="pb-1"><CardTitle className="text-xs text-primary">Total annuel à percevoir</CardTitle></CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-primary">{fmt(recap.montantTotal)} FCFA</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tableau mensuel */}
      <Card className="max-w-4xl mx-auto border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm uppercase tracking-wide text-gray-600">Détail mensuel</CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          {recap.recapMensuel.length === 0 ? (
            <p className="text-center py-6 text-muted-foreground px-6">Aucune séance enregistrée.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="text-xs">
                  <TableHead>Mois</TableHead>
                  <TableHead className="text-right">CM</TableHead>
                  <TableHead className="text-right">TD</TableHead>
                  <TableHead className="text-right">TP</TableHead>
                  <TableHead className="text-right">Éq. TD</TableHead>
                  <TableHead className="text-right text-emerald-700">H. normales</TableHead>
                  <TableHead className="text-right text-amber-700">H. compl.</TableHead>
                  <TableHead className="text-right text-emerald-700">Salaire normal</TableHead>
                  <TableHead className="text-right text-amber-700">Salaire surplus</TableHead>
                  <TableHead className="text-right font-semibold">Total mois</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recap.recapMensuel.map((m) => (
                  <TableRow key={`${m.annee}-${m.mois}`} className="text-sm">
                    <TableCell className="font-medium">{m.label}</TableCell>
                    <TableCell className="text-right">{m.heuresCm > 0 ? `${m.heuresCm} h` : "—"}</TableCell>
                    <TableCell className="text-right">{m.heuresTd > 0 ? `${m.heuresTd} h` : "—"}</TableCell>
                    <TableCell className="text-right">{m.heuresTp > 0 ? `${m.heuresTp} h` : "—"}</TableCell>
                    <TableCell className="text-right">{m.heuresEquivalentTd.toFixed(1)} h</TableCell>
                    <TableCell className="text-right text-emerald-700">{m.heuresNormales.toFixed(1)} h</TableCell>
                    <TableCell className="text-right text-amber-700">{m.heuresComplementaires.toFixed(1)} h</TableCell>
                    <TableCell className="text-right text-emerald-700">{fmt(m.montantNormal)} FCFA</TableCell>
                    <TableCell className="text-right text-amber-700">{fmt(m.montantComplementaire)} FCFA</TableCell>
                    <TableCell className="text-right font-semibold">{fmt(m.montantTotal)} FCFA</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <tfoot>
                <TableRow className="border-t-2 font-bold bg-gray-50 text-sm">
                  <TableCell>TOTAL ANNUEL</TableCell>
                  <TableCell className="text-right">{recap.totalHeuresCm} h</TableCell>
                  <TableCell className="text-right">{recap.totalHeuresTd} h</TableCell>
                  <TableCell className="text-right">{recap.totalHeuresTp} h</TableCell>
                  <TableCell className="text-right">{recap.totalHeuresEquivalentTd.toFixed(1)} h</TableCell>
                  <TableCell className="text-right text-emerald-700">{recap.heuresContractuelles.toFixed(1)} h</TableCell>
                  <TableCell className="text-right text-amber-700">{recap.heuresComplementaires.toFixed(1)} h</TableCell>
                  <TableCell className="text-right text-emerald-700">{fmt(totalNormal)} FCFA</TableCell>
                  <TableCell className="text-right text-amber-700">{fmt(totalComp)} FCFA</TableCell>
                  <TableCell className="text-right text-primary">{fmt(recap.montantTotal)} FCFA</TableCell>
                </TableRow>
              </tfoot>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Signatures */}
      <div className="flex justify-between mt-16 px-12 max-w-4xl mx-auto">
        <div className="text-center border-t border-black pt-2 w-48 text-sm">L'Enseignant</div>
        <div className="text-center border-t border-black pt-2 w-48 text-sm">Validation RH</div>
        <div className="text-center border-t border-black pt-2 w-48 text-sm">Direction</div>
      </div>
    </div>
  );
}

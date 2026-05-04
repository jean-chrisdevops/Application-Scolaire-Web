import React from "react";
import { 
  useObtenirStatistiquesDepartements,
  useObtenirStatistiquesFilieres,
  useObtenirStatistiquesMensuelles,
  useObtenirEnseignantsEnDepassement
} from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, CartesianGrid } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function RhStatistiques() {
  const { data: statsDepts, isLoading: loadingDepts } = useObtenirStatistiquesDepartements();
  const { data: statsFilieres, isLoading: loadingFilieres } = useObtenirStatistiquesFilieres();
  const { data: statsMensuelles, isLoading: loadingMensuel } = useObtenirStatistiquesMensuelles();
  const { data: depassements, isLoading: loadingDepassements } = useObtenirEnseignantsEnDepassement();

  const isLoading = loadingDepts || loadingFilieres || loadingMensuel || loadingDepassements;

  if (isLoading) {
    return <div className="flex h-[50vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Statistiques Globales</h1>
        <p className="text-muted-foreground mt-1">Analyse des heures et de la masse salariale</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Heures par département</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statsDepts} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <XAxis type="number" />
                <YAxis dataKey="departement" type="category" width={100} />
                <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} contentStyle={{ borderRadius: '8px' }} />
                <Bar dataKey="totalHeures" fill="hsl(var(--chart-1))" radius={[0, 4, 4, 0]} name="Heures totales" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Heures par filière</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statsFilieres}>
                <XAxis dataKey="filiere" />
                <YAxis />
                <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} contentStyle={{ borderRadius: '8px' }} />
                <Bar dataKey="totalHeures" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} name="Heures totales" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Tendance Mensuelle</CardTitle>
            <CardDescription>Évolution du volume horaire sur l'année</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={statsMensuelles} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorHeures" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="mois" />
                <YAxis />
                <Tooltip contentStyle={{ borderRadius: '8px' }} />
                <Area type="monotone" dataKey="totalHeures" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorHeures)" name="Heures effectuées" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Enseignants en dépassement</CardTitle>
            <CardDescription>Enseignants ayant dépassé leur seuil d'heures contractuelles</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Enseignant</TableHead>
                  <TableHead>Département</TableHead>
                  <TableHead className="text-right">Heures Contractuelles</TableHead>
                  <TableHead className="text-right">Total (éq. TD)</TableHead>
                  <TableHead className="text-right text-destructive">Dépassement</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {depassements?.map((d) => (
                  <TableRow key={d.enseignant.id}>
                    <TableCell className="font-medium">{d.enseignant.nom} {d.enseignant.prenom}</TableCell>
                    <TableCell>{d.enseignant.departement}</TableCell>
                    <TableCell className="text-right">{d.heuresContractuelles}h</TableCell>
                    <TableCell className="text-right">{d.totalHeuresEquivalentTd.toFixed(2)}h</TableCell>
                    <TableCell className="text-right font-bold text-destructive">+{d.heuresComplementaires.toFixed(2)}h</TableCell>
                  </TableRow>
                ))}
                {(!depassements || depassements.length === 0) && (
                  <TableRow><TableCell colSpan={5} className="text-center py-6 text-muted-foreground">Aucun enseignant en dépassement.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
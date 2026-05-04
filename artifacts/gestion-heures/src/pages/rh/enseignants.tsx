import React, { useState } from "react";
import { 
  useListerEnseignants, 
  useCreerEnseignant, 
  useModifierEnseignant, 
  useSupprimerEnseignant,
  useObtenirEnseignantsEnDepassement,
  getListerEnseignantsQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Edit2, Trash2, TrendingUp } from "lucide-react";
import { GradeEnseignant, StatutEnseignant } from "@workspace/api-client-react";

const enseignantSchema = z.object({
  nom: z.string().min(1, "Nom requis"),
  prenom: z.string().min(1, "Prénom requis"),
  email: z.string().email("Email invalide"),
  grade: z.enum(["Assistant", "MaitreAssistant", "Professeur", "Autre"]),
  statut: z.enum(["Permanent", "Vacataire"]),
  departement: z.string().min(1, "Département requis"),
  tauxHoraire: z.coerce.number().min(0, "Taux invalide"),
});

export default function RhEnseignants() {
  const { data: enseignants, isLoading } = useListerEnseignants();
  const { data: depassements } = useObtenirEnseignantsEnDepassement();
  const idsEnDepassement = new Set(depassements?.map((d) => d.enseignant.id) ?? []);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const creerEnseignant = useCreerEnseignant();
  const modifierEnseignant = useModifierEnseignant();
  const supprimerEnseignant = useSupprimerEnseignant();

  const form = useForm<z.infer<typeof enseignantSchema>>({
    resolver: zodResolver(enseignantSchema),
    defaultValues: { nom: "", prenom: "", email: "", grade: "Assistant", statut: "Permanent", departement: "", tauxHoraire: 0 },
  });

  const openCreate = () => {
    setEditingId(null);
    form.reset({ nom: "", prenom: "", email: "", grade: "Assistant", statut: "Permanent", departement: "", tauxHoraire: 0 });
    setIsOpen(true);
  };

  const openEdit = (e: any) => {
    setEditingId(e.id);
    form.reset({
      nom: e.nom, prenom: e.prenom, email: e.email, grade: e.grade, statut: e.statut, departement: e.departement, tauxHoraire: e.tauxHoraire
    });
    setIsOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Confirmer la suppression de cet enseignant ?")) {
      supprimerEnseignant.mutate({ id }, {
        onSuccess: () => {
          toast({ title: "Enseignant supprimé" });
          queryClient.invalidateQueries({ queryKey: getListerEnseignantsQueryKey() });
        }
      });
    }
  };

  const onSubmit = (values: z.infer<typeof enseignantSchema>) => {
    const payload = {
      ...values,
      grade: values.grade as GradeEnseignant,
      statut: values.statut as StatutEnseignant,
    };
    if (editingId) {
      modifierEnseignant.mutate({ id: editingId, data: payload }, {
        onSuccess: () => {
          toast({ title: "Enseignant modifié" });
          queryClient.invalidateQueries({ queryKey: getListerEnseignantsQueryKey() });
          setIsOpen(false);
        }
      });
    } else {
      creerEnseignant.mutate({ data: payload }, {
        onSuccess: () => {
          toast({ title: "Enseignant créé" });
          queryClient.invalidateQueries({ queryKey: getListerEnseignantsQueryKey() });
          setIsOpen(false);
        }
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Enseignants</h1>
          <p className="text-muted-foreground mt-1">Gestion du corps professoral</p>
        </div>
        <Button onClick={openCreate}><Plus className="h-4 w-4 mr-2" /> Nouvel enseignant</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
             <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Grade & Statut</TableHead>
                  <TableHead>Département</TableHead>
                  <TableHead>Statut heures</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {enseignants?.map((e) => {
                  const enDepassement = idsEnDepassement.has(e.id);
                  const dep = depassements?.find((d) => d.enseignant.id === e.id);
                  return (
                  <TableRow key={e.id} className={enDepassement ? "bg-red-50/40" : ""}>
                    <TableCell className="font-medium">{e.nom} {e.prenom}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{e.email}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{e.grade}</span>
                        <span className="text-xs text-muted-foreground">{e.statut}</span>
                      </div>
                    </TableCell>
                    <TableCell>{e.departement}</TableCell>
                    <TableCell>
                      {enDepassement ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-700">
                          <TrendingUp className="h-3 w-3" />
                          +{dep?.heuresComplementaires.toFixed(1)} h compl.
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700">
                          Dans le seuil
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(e)}><Edit2 className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(e.id)}><Trash2 className="h-4 w-4" /></Button>
                    </TableCell>
                  </TableRow>
                );})}
                {(!enseignants || enseignants.length === 0) && (
                  <TableRow><TableCell colSpan={6} className="text-center py-6 text-muted-foreground">Aucun enseignant trouvé.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingId ? "Modifier l'enseignant" : "Nouvel enseignant"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="nom" render={({ field }) => (
                  <FormItem><FormLabel>Nom</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="prenom" render={({ field }) => (
                  <FormItem><FormLabel>Prénom</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="grade" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Grade</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Sélectionnez" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="Assistant">Assistant</SelectItem>
                        <SelectItem value="MaitreAssistant">Maître Assistant</SelectItem>
                        <SelectItem value="Professeur">Professeur</SelectItem>
                        <SelectItem value="Autre">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="statut" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Statut</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Sélectionnez" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="Permanent">Permanent</SelectItem>
                        <SelectItem value="Vacataire">Vacataire</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="departement" render={({ field }) => (
                  <FormItem><FormLabel>Département</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="tauxHoraire" render={({ field }) => (
                  <FormItem><FormLabel>Taux Horaire (FCFA)</FormLabel><FormControl><Input type="number" step="1" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={creerEnseignant.isPending || modifierEnseignant.isPending}>Enregistrer</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
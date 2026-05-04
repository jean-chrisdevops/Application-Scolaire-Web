import React, { useState } from "react";
import { 
  useListerHeures, 
  useListerEnseignants,
  useListerMatieres,
  useCreerHeure, 
  useModifierHeure, 
  useSupprimerHeure,
  useValiderHeure,
  getListerHeuresQueryKey
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
import { Loader2, Plus, Edit2, Trash2, CheckCircle, XCircle } from "lucide-react";
import { TypeHeure } from "@workspace/api-client-react";

const heureSchema = z.object({
  enseignantId: z.string().min(1, "Enseignant requis"),
  matiereId: z.string().min(1, "Matière requise"),
  date: z.string().min(1, "Date requise"),
  type: z.enum(["CM", "TD", "TP"]),
  duree: z.coerce.number().min(0.5, "Durée invalide"),
  salle: z.string().min(1, "Salle requise"),
  observations: z.string().optional(),
});

export default function RhHeures() {
  const [filterEnseignantId, setFilterEnseignantId] = useState<string>("all");
  const { data: heures, isLoading } = useListerHeures(filterEnseignantId !== "all" ? { enseignantId: parseInt(filterEnseignantId) } : {});
  const { data: enseignants } = useListerEnseignants();
  const { data: matieres } = useListerMatieres();
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const creerHeure = useCreerHeure();
  const modifierHeure = useModifierHeure();
  const supprimerHeure = useSupprimerHeure();
  const validerHeure = useValiderHeure();

  const form = useForm<z.infer<typeof heureSchema>>({
    resolver: zodResolver(heureSchema),
    defaultValues: { enseignantId: "", matiereId: "", date: new Date().toISOString().split('T')[0], type: "TD", duree: 1.5, salle: "", observations: "" },
  });

  const openCreate = () => {
    setEditingId(null);
    form.reset({ enseignantId: filterEnseignantId !== "all" ? filterEnseignantId : "", matiereId: "", date: new Date().toISOString().split('T')[0], type: "TD", duree: 1.5, salle: "", observations: "" });
    setIsOpen(true);
  };

  const openEdit = (h: any) => {
    setEditingId(h.id);
    form.reset({
      enseignantId: h.enseignantId.toString(),
      matiereId: h.matiereId.toString(),
      date: h.date,
      type: h.type,
      duree: h.duree,
      salle: h.salle,
      observations: h.observations || "",
    });
    setIsOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Confirmer la suppression de cette séance ?")) {
      supprimerHeure.mutate({ id }, {
        onSuccess: () => {
          toast({ title: "Séance supprimée" });
          queryClient.invalidateQueries({ queryKey: getListerHeuresQueryKey() });
        }
      });
    }
  };

  const handleToggleValider = (id: number, current: boolean) => {
    validerHeure.mutate({ id, data: { validee: !current } }, {
      onSuccess: () => {
        toast({ title: current ? "Heure invalidée" : "Heure validée" });
        queryClient.invalidateQueries({ queryKey: getListerHeuresQueryKey() });
      }
    });
  };

  const onSubmit = (values: z.infer<typeof heureSchema>) => {
    const payload = {
      enseignantId: parseInt(values.enseignantId),
      matiereId: parseInt(values.matiereId),
      date: values.date,
      type: values.type as TypeHeure,
      duree: values.duree,
      salle: values.salle,
      observations: values.observations,
    };

    if (editingId) {
      modifierHeure.mutate({ id: editingId, data: payload }, {
        onSuccess: () => {
          toast({ title: "Séance modifiée" });
          queryClient.invalidateQueries({ queryKey: getListerHeuresQueryKey() });
          setIsOpen(false);
        }
      });
    } else {
      creerHeure.mutate({ data: payload }, {
        onSuccess: () => {
          toast({ title: "Séance ajoutée" });
          queryClient.invalidateQueries({ queryKey: getListerHeuresQueryKey() });
          setIsOpen(false);
        }
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Heures de cours</h1>
          <p className="text-muted-foreground mt-1">Saisie et validation des séances</p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select value={filterEnseignantId} onValueChange={setFilterEnseignantId}>
            <SelectTrigger className="w-full sm:w-[250px]">
              <SelectValue placeholder="Filtrer par enseignant" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les enseignants</SelectItem>
              {enseignants?.map(e => (
                <SelectItem key={e.id} value={e.id.toString()}>{e.nom} {e.prenom}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={openCreate}><Plus className="h-4 w-4 mr-2 hidden sm:block" /> Nouvelle séance</Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
             <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Enseignant</TableHead>
                  <TableHead>Matière</TableHead>
                  <TableHead>Type & Durée</TableHead>
                  <TableHead>Salle</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {heures?.map((h) => (
                  <TableRow key={h.id}>
                    <TableCell>{new Date(h.date).toLocaleDateString("fr-FR")}</TableCell>
                    <TableCell className="font-medium">{h.nomEnseignant}</TableCell>
                    <TableCell>{h.intituleMatiere}</TableCell>
                    <TableCell>{h.type} ({h.duree}h)</TableCell>
                    <TableCell>{h.salle}</TableCell>
                    <TableCell>
                      {h.validee ? (
                        <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-emerald-100 text-emerald-700">Validée</span>
                      ) : (
                        <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-amber-100 text-amber-700">En attente</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right whitespace-nowrap">
                      <Button variant="ghost" size="sm" onClick={() => handleToggleValider(h.id, h.validee)} className={h.validee ? "text-amber-600 hover:text-amber-700" : "text-emerald-600 hover:text-emerald-700"}>
                        {h.validee ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => openEdit(h)}><Edit2 className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(h.id)}><Trash2 className="h-4 w-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
                {(!heures || heures.length === 0) && (
                  <TableRow><TableCell colSpan={7} className="text-center py-6 text-muted-foreground">Aucune heure trouvée.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingId ? "Modifier la séance" : "Nouvelle séance"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="enseignantId" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enseignant</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!!editingId}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Sélectionnez" /></SelectTrigger></FormControl>
                      <SelectContent>
                        {enseignants?.map(e => <SelectItem key={e.id} value={e.id.toString()}>{e.nom} {e.prenom}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="matiereId" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Matière</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Sélectionnez" /></SelectTrigger></FormControl>
                      <SelectContent>
                        {matieres?.map(m => <SelectItem key={m.id} value={m.id.toString()}>{m.intitule}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="date" render={({ field }) => (
                  <FormItem><FormLabel>Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="type" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type de cours</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Sélectionnez" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="CM">CM</SelectItem>
                        <SelectItem value="TD">TD</SelectItem>
                        <SelectItem value="TP">TP</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="duree" render={({ field }) => (
                  <FormItem><FormLabel>Durée (h)</FormLabel><FormControl><Input type="number" step="0.5" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="salle" render={({ field }) => (
                  <FormItem><FormLabel>Salle</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <FormField control={form.control} name="observations" render={({ field }) => (
                <FormItem><FormLabel>Observations</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <DialogFooter>
                <Button type="submit" disabled={creerHeure.isPending || modifierHeure.isPending}>Enregistrer</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
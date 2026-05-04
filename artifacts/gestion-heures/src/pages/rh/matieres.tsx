import React, { useState } from "react";
import { 
  useListerMatieres, 
  useCreerMatiere, 
  useModifierMatiere, 
  useSupprimerMatiere,
  getListerMatieresQueryKey
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
import { Loader2, Plus, Edit2, Trash2 } from "lucide-react";
import { NiveauMatiere } from "@workspace/api-client-react";

const matiereSchema = z.object({
  intitule: z.string().min(1, "Intitulé requis"),
  filiere: z.string().min(1, "Filière requise"),
  niveau: z.enum(["L1", "L2", "L3", "M1", "M2"]),
  volumeHorairePrevu: z.coerce.number().min(1, "Volume horaire invalide"),
});

export default function RhMatieres() {
  const { data: matieres, isLoading } = useListerMatieres();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const creerMatiere = useCreerMatiere();
  const modifierMatiere = useModifierMatiere();
  const supprimerMatiere = useSupprimerMatiere();

  const form = useForm<z.infer<typeof matiereSchema>>({
    resolver: zodResolver(matiereSchema),
    defaultValues: { intitule: "", filiere: "", niveau: "L1", volumeHorairePrevu: 0 },
  });

  const openCreate = () => {
    setEditingId(null);
    form.reset({ intitule: "", filiere: "", niveau: "L1", volumeHorairePrevu: 0 });
    setIsOpen(true);
  };

  const openEdit = (m: any) => {
    setEditingId(m.id);
    form.reset({
      intitule: m.intitule, filiere: m.filiere, niveau: m.niveau, volumeHorairePrevu: m.volumeHorairePrevu
    });
    setIsOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Confirmer la suppression de cette matière ?")) {
      supprimerMatiere.mutate({ id }, {
        onSuccess: () => {
          toast({ title: "Matière supprimée" });
          queryClient.invalidateQueries({ queryKey: getListerMatieresQueryKey() });
        }
      });
    }
  };

  const onSubmit = (values: z.infer<typeof matiereSchema>) => {
    const payload = {
      ...values,
      niveau: values.niveau as NiveauMatiere,
    };
    if (editingId) {
      modifierMatiere.mutate({ id: editingId, data: payload }, {
        onSuccess: () => {
          toast({ title: "Matière modifiée" });
          queryClient.invalidateQueries({ queryKey: getListerMatieresQueryKey() });
          setIsOpen(false);
        }
      });
    } else {
      creerMatiere.mutate({ data: payload }, {
        onSuccess: () => {
          toast({ title: "Matière créée" });
          queryClient.invalidateQueries({ queryKey: getListerMatieresQueryKey() });
          setIsOpen(false);
        }
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Matières</h1>
          <p className="text-muted-foreground mt-1">Référentiel des cours</p>
        </div>
        <Button onClick={openCreate}><Plus className="h-4 w-4 mr-2" /> Nouvelle matière</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
             <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Intitulé</TableHead>
                  <TableHead>Filière</TableHead>
                  <TableHead>Niveau</TableHead>
                  <TableHead>Volume Prévu</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {matieres?.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell className="font-medium">{m.intitule}</TableCell>
                    <TableCell>{m.filiere}</TableCell>
                    <TableCell>{m.niveau}</TableCell>
                    <TableCell>{m.volumeHorairePrevu}h</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(m)}><Edit2 className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(m.id)}><Trash2 className="h-4 w-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
                {(!matieres || matieres.length === 0) && (
                  <TableRow><TableCell colSpan={5} className="text-center py-6 text-muted-foreground">Aucune matière trouvée.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "Modifier la matière" : "Nouvelle matière"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="intitule" render={({ field }) => (
                <FormItem><FormLabel>Intitulé</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="filiere" render={({ field }) => (
                <FormItem><FormLabel>Filière</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="niveau" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Niveau</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Sélectionnez" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="L1">L1</SelectItem>
                        <SelectItem value="L2">L2</SelectItem>
                        <SelectItem value="L3">L3</SelectItem>
                        <SelectItem value="M1">M1</SelectItem>
                        <SelectItem value="M2">M2</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="volumeHorairePrevu" render={({ field }) => (
                  <FormItem><FormLabel>Volume Horaire Prévu (h)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={creerMatiere.isPending || modifierMatiere.isPending}>Enregistrer</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
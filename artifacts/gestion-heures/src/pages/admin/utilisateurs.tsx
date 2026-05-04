import React, { useState } from "react";
import { 
  useListerUtilisateurs, 
  useListerEnseignants,
  useCreerUtilisateur, 
  useModifierUtilisateur, 
  useSupprimerUtilisateur,
  getListerUtilisateursQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { RoleUtilisateur } from "@workspace/api-client-react";

const userSchema = z.object({
  email: z.string().email("Email invalide"),
  nomComplet: z.string().min(2, "Nom requis"),
  motDePasse: z.string().min(6, "6 caractères min").optional().or(z.literal("")),
  role: z.enum(["admin", "rh", "enseignant"]),
  enseignantId: z.string().optional().nullable(),
});

export default function AdminUtilisateurs() {
  const { data: users, isLoading } = useListerUtilisateurs();
  const { data: enseignants } = useListerEnseignants();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const creerUtilisateur = useCreerUtilisateur();
  const modifierUtilisateur = useModifierUtilisateur();
  const supprimerUtilisateur = useSupprimerUtilisateur();

  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: { email: "", nomComplet: "", motDePasse: "", role: "enseignant", enseignantId: "" },
  });

  const watchRole = form.watch("role");

  const openCreate = () => {
    setEditingId(null);
    form.reset({ email: "", nomComplet: "", motDePasse: "", role: "enseignant", enseignantId: "" });
    setIsOpen(true);
  };

  const openEdit = (user: any) => {
    setEditingId(user.id);
    form.reset({
      email: user.email,
      nomComplet: user.nomComplet,
      motDePasse: "",
      role: user.role,
      enseignantId: user.enseignantId ? user.enseignantId.toString() : "",
    });
    setIsOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Confirmer la suppression ?")) {
      supprimerUtilisateur.mutate({ id }, {
        onSuccess: () => {
          toast({ title: "Utilisateur supprimé" });
          queryClient.invalidateQueries({ queryKey: getListerUtilisateursQueryKey() });
        }
      });
    }
  };

  const onSubmit = (values: z.infer<typeof userSchema>) => {
    const payload = {
      email: values.email,
      nomComplet: values.nomComplet,
      role: values.role as RoleUtilisateur,
      enseignantId: values.role === "enseignant" && values.enseignantId ? parseInt(values.enseignantId, 10) : null,
      ...(values.motDePasse ? { motDePasse: values.motDePasse } : {}),
    };

    if (editingId) {
      modifierUtilisateur.mutate({ id: editingId, data: payload }, {
        onSuccess: () => {
          toast({ title: "Utilisateur modifié" });
          queryClient.invalidateQueries({ queryKey: getListerUtilisateursQueryKey() });
          setIsOpen(false);
        }
      });
    } else {
      if (!payload.motDePasse) {
        toast({ title: "Erreur", description: "Le mot de passe est requis", variant: "destructive" });
        return;
      }
      creerUtilisateur.mutate({ data: payload as any }, {
        onSuccess: () => {
          toast({ title: "Utilisateur créé" });
          queryClient.invalidateQueries({ queryKey: getListerUtilisateursQueryKey() });
          setIsOpen(false);
        }
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Utilisateurs</h1>
        <Button onClick={openCreate}><Plus className="h-4 w-4 mr-2" /> Nouvel utilisateur</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
             <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom complet</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Créé le</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users?.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.nomComplet}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell className="capitalize">{u.role}</TableCell>
                    <TableCell>{new Date(u.creeLe).toLocaleDateString("fr-FR")}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(u)}><Edit2 className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(u.id)}><Trash2 className="h-4 w-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "Modifier l'utilisateur" : "Nouvel utilisateur"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="nomComplet" render={({ field }) => (
                <FormItem><FormLabel>Nom complet</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="motDePasse" render={({ field }) => (
                <FormItem><FormLabel>Mot de passe {editingId && "(Laisser vide pour ne pas modifier)"}</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="role" render={({ field }) => (
                <FormItem>
                  <FormLabel>Rôle</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Sélectionnez un rôle" /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="admin">Administrateur</SelectItem>
                      <SelectItem value="rh">Ressources Humaines</SelectItem>
                      <SelectItem value="enseignant">Enseignant</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              {watchRole === "enseignant" && enseignants && (
                <FormField control={form.control} name="enseignantId" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Associer à un profil enseignant</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Sélectionnez un enseignant" /></SelectTrigger></FormControl>
                      <SelectContent>
                        {enseignants.map(e => <SelectItem key={e.id} value={e.id.toString()}>{e.nom} {e.prenom}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
              )}
              <DialogFooter>
                <Button type="submit" disabled={creerUtilisateur.isPending || modifierUtilisateur.isPending}>Enregistrer</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
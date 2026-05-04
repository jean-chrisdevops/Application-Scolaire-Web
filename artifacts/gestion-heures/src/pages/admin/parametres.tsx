import React, { useEffect } from "react";
import { useObtenirParametres, useModifierParametres, getObtenirParametresQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save } from "lucide-react";

const paramsSchema = z.object({
  anneeAcademique: z.string().min(4),
  tauxHoraireCm: z.coerce.number().min(0),
  tauxHoraireTd: z.coerce.number().min(0),
  tauxHoraireTp: z.coerce.number().min(0),
  equivalenceCm: z.coerce.number().min(0),
  equivalenceTd: z.coerce.number().min(0),
  equivalenceTp: z.coerce.number().min(0),
  seuilHeuresContractuelles: z.coerce.number().min(0),
});

export default function AdminParametres() {
  const { data, isLoading } = useObtenirParametres();
  const modifierParametres = useModifierParametres();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof paramsSchema>>({
    resolver: zodResolver(paramsSchema),
    defaultValues: {
      anneeAcademique: "",
      tauxHoraireCm: 0,
      tauxHoraireTd: 0,
      tauxHoraireTp: 0,
      equivalenceCm: 1.5,
      equivalenceTd: 1,
      equivalenceTp: 1,
      seuilHeuresContractuelles: 192,
    },
  });

  useEffect(() => {
    if (data) {
      form.reset({
        anneeAcademique: data.anneeAcademique,
        tauxHoraireCm: data.tauxHoraireCm,
        tauxHoraireTd: data.tauxHoraireTd,
        tauxHoraireTp: data.tauxHoraireTp,
        equivalenceCm: data.equivalenceCm,
        equivalenceTd: data.equivalenceTd,
        equivalenceTp: data.equivalenceTp,
        seuilHeuresContractuelles: data.seuilHeuresContractuelles,
      });
    }
  }, [data, form]);

  const onSubmit = (values: z.infer<typeof paramsSchema>) => {
    modifierParametres.mutate({ data: values }, {
      onSuccess: () => {
        toast({ title: "Paramètres enregistrés avec succès" });
        queryClient.invalidateQueries({ queryKey: getObtenirParametresQueryKey() });
      }
    });
  };

  if (isLoading) {
    return <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Paramètres de l'établissement</h1>
        <p className="text-muted-foreground mt-1">Configurez les constantes utilisées pour le calcul des heures.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Général</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 sm:grid-cols-2">
              <FormField control={form.control} name="anneeAcademique" render={({ field }) => (
                <FormItem><FormLabel>Année académique</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="seuilHeuresContractuelles" render={({ field }) => (
                <FormItem><FormLabel>Seuil heures contractuelles (éq. TD)</FormLabel><FormControl><Input type="number" step="0.5" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Taux Horaires (FCFA)</CardTitle>
                <CardDescription>Montants appliqués pour la rémunération</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField control={form.control} name="tauxHoraireCm" render={({ field }) => (
                  <FormItem><FormLabel>Taux CM</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="tauxHoraireTd" render={({ field }) => (
                  <FormItem><FormLabel>Taux TD</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="tauxHoraireTp" render={({ field }) => (
                  <FormItem><FormLabel>Taux TP</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Équivalences TD</CardTitle>
                <CardDescription>Multiplicateurs pour convertir en équivalent TD</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField control={form.control} name="equivalenceCm" render={({ field }) => (
                  <FormItem><FormLabel>Équivalence CM → TD</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="equivalenceTd" render={({ field }) => (
                  <FormItem><FormLabel>Équivalence TD → TD</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="equivalenceTp" render={({ field }) => (
                  <FormItem><FormLabel>Équivalence TP → TD</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={modifierParametres.isPending} size="lg">
              {modifierParametres.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Enregistrer les modifications
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
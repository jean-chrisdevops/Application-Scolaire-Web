import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { getObtenirUtilisateurCourantQueryKey, useConnecter } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { BookOpen } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  motDePasse: z.string().min(1, "Le mot de passe est requis"),
});

export default function Connexion() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const connecter = useConnecter();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      motDePasse: "",
    },
  });

  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    connecter.mutate(
      { data: values },
      {
        onSuccess: (user) => {
          queryClient.invalidateQueries({ queryKey: getObtenirUtilisateurCourantQueryKey() });
          if (user.role === "admin") setLocation("/admin");
          else if (user.role === "rh") setLocation("/rh");
          else if (user.role === "enseignant") setLocation("/enseignant");
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: "Erreur de connexion",
            description: "Email ou mot de passe incorrect.",
          });
        },
      }
    );
  };

  const setDemoAccount = (email: string, mdp: string) => {
    form.setValue("email", email);
    form.setValue("motDePasse", mdp);
  };

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col justify-center items-center p-4">
      <div className="mb-8 flex items-center gap-3">
        <div className="h-12 w-12 bg-primary rounded-xl flex items-center justify-center shadow-lg">
          <BookOpen className="h-7 w-7 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">UnivSupérieur</h1>
          <p className="text-sm text-muted-foreground">Gestion des heures</p>
        </div>
      </div>

      <Card className="w-full max-w-md shadow-xl border-border/50">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-semibold text-center">Connexion</CardTitle>
          <CardDescription className="text-center">
            Connectez-vous pour accéder à votre espace
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="nom@univsuperieur.ci" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="motDePasse"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mot de passe</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={connecter.isPending}>
                {connecter.isPending ? "Connexion..." : "Se connecter"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="w-full max-w-md mt-8 border-border bg-card/50 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Comptes de démonstration
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 text-sm">
          <div className="flex items-center justify-between p-2 rounded-md hover:bg-muted transition-colors cursor-pointer" onClick={() => setDemoAccount("admin@univsuperieur.ci", "Admin123!")}>
            <div>
              <span className="font-semibold block">Administrateur</span>
              <span className="text-muted-foreground text-xs">admin@univsuperieur.ci</span>
            </div>
            <code className="text-xs bg-background px-2 py-1 rounded border">Admin123!</code>
          </div>
          <div className="flex items-center justify-between p-2 rounded-md hover:bg-muted transition-colors cursor-pointer" onClick={() => setDemoAccount("rh@univsuperieur.ci", "Rh123456!")}>
            <div>
              <span className="font-semibold block">Ressources Humaines</span>
              <span className="text-muted-foreground text-xs">rh@univsuperieur.ci</span>
            </div>
            <code className="text-xs bg-background px-2 py-1 rounded border">Rh123456!</code>
          </div>
          <div className="flex items-center justify-between p-2 rounded-md hover:bg-muted transition-colors cursor-pointer" onClick={() => setDemoAccount("enseignant@univsuperieur.ci", "Enseignant1!")}>
            <div>
              <span className="font-semibold block">Enseignant</span>
              <span className="text-muted-foreground text-xs">enseignant@univsuperieur.ci</span>
            </div>
            <code className="text-xs bg-background px-2 py-1 rounded border">Enseignant1!</code>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Pages
import NotFound from "@/pages/not-found";
import Connexion from "@/pages/connexion";
import Index from "@/pages/index";

// Admin pages
import AdminDashboard from "@/pages/admin/index";
import AdminUtilisateurs from "@/pages/admin/utilisateurs";
import AdminParametres from "@/pages/admin/parametres";

// RH pages
import RhDashboard from "@/pages/rh/index";
import RhEnseignants from "@/pages/rh/enseignants";
import RhMatieres from "@/pages/rh/matieres";
import RhHeures from "@/pages/rh/heures";
import RhStatistiques from "@/pages/rh/statistiques";
import RhExports from "@/pages/rh/exports";

// Enseignant pages
import EnseignantDashboard from "@/pages/enseignant/index";
import EnseignantFiche from "@/pages/enseignant/fiche";

// Guard
import { RoleGuard } from "@/components/RoleGuard";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        if (error?.status === 401 || error?.response?.status === 401) return false;
        return failureCount < 3;
      },
    },
  },
});

function Router() {
  return (
    <Switch>
      <Route path="/connexion" component={Connexion} />
      <Route path="/" component={Index} />
      
      {/* Admin Routes */}
      <Route path="/admin">
        <RoleGuard allowed={["admin"]}><AdminDashboard /></RoleGuard>
      </Route>
      <Route path="/admin/utilisateurs">
        <RoleGuard allowed={["admin"]}><AdminUtilisateurs /></RoleGuard>
      </Route>
      <Route path="/admin/parametres">
        <RoleGuard allowed={["admin"]}><AdminParametres /></RoleGuard>
      </Route>

      {/* RH Routes */}
      <Route path="/rh">
        <RoleGuard allowed={["rh"]}><RhDashboard /></RoleGuard>
      </Route>
      <Route path="/rh/enseignants">
        <RoleGuard allowed={["rh"]}><RhEnseignants /></RoleGuard>
      </Route>
      <Route path="/rh/matieres">
        <RoleGuard allowed={["rh"]}><RhMatieres /></RoleGuard>
      </Route>
      <Route path="/rh/heures">
        <RoleGuard allowed={["rh"]}><RhHeures /></RoleGuard>
      </Route>
      <Route path="/rh/statistiques">
        <RoleGuard allowed={["rh"]}><RhStatistiques /></RoleGuard>
      </Route>
      <Route path="/rh/exports">
        <RoleGuard allowed={["rh"]}><RhExports /></RoleGuard>
      </Route>

      {/* Enseignant Routes */}
      <Route path="/enseignant">
        <RoleGuard allowed={["enseignant"]}><EnseignantDashboard /></RoleGuard>
      </Route>
      <Route path="/enseignant/:id/fiche">
        <RoleGuard allowed={["rh", "enseignant"]}><EnseignantFiche /></RoleGuard>
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

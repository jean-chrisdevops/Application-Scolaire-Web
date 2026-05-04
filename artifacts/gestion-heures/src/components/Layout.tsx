import React from "react";
import { Link, useLocation } from "wouter";
import { useObtenirUtilisateurCourant, useDeconnecter } from "@workspace/api-client-react";
import { LogOut, Users, Settings, BookOpen, Clock, FileText, BarChart3, Menu, X, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [location, setLocation] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const { data: user, isLoading } = useObtenirUtilisateurCourant();
  const deconnecter = useDeconnecter();

  const handleLogout = () => {
    deconnecter.mutate(undefined, {
      onSuccess: () => {
        window.location.href = "/connexion";
      }
    });
  };

  if (isLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center" />;
  }

  if (!user) {
    setLocation("/connexion");
    return null;
  }

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2);
  };

  const navItems = {
    admin: [
      { label: "Vue d'ensemble", path: "/admin", icon: LayoutDashboard },
      { label: "Utilisateurs", path: "/admin/utilisateurs", icon: Users },
      { label: "Paramètres", path: "/admin/parametres", icon: Settings },
    ],
    rh: [
      { label: "Vue d'ensemble", path: "/rh", icon: LayoutDashboard },
      { label: "Enseignants", path: "/rh/enseignants", icon: Users },
      { label: "Matières", path: "/rh/matieres", icon: BookOpen },
      { label: "Heures", path: "/rh/heures", icon: Clock },
      { label: "Statistiques", path: "/rh/statistiques", icon: BarChart3 },
      { label: "Exports", path: "/rh/exports", icon: FileText },
    ],
    enseignant: [
      { label: "Mon Tableau de Bord", path: "/enseignant", icon: LayoutDashboard },
    ]
  };

  const currentNavItems = user.role ? navItems[user.role] : [];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-sidebar border-r border-sidebar-border no-print">
        <div className="p-6">
          <h1 className="text-xl font-bold text-sidebar-primary tracking-tight">UnivSupérieur</h1>
          <p className="text-xs text-muted-foreground mt-1">Gestion des heures</p>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          {currentNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.path;
            return (
              <Link key={item.path} href={item.path} className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-sidebar-primary text-sidebar-primary-foreground' : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'}`}>
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3 px-2 py-2 mb-2">
            <Avatar className="h-9 w-9 bg-primary/10 text-primary">
              <AvatarFallback>{getInitials(user.nomComplet)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-medium truncate">{user.nomComplet}</span>
              <span className="text-xs text-muted-foreground capitalize">{user.role}</span>
            </div>
          </div>
          <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Déconnexion
          </Button>
        </div>
      </aside>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:hidden no-print">
          <div className="fixed inset-y-0 left-0 w-64 bg-sidebar border-r border-sidebar-border shadow-lg flex flex-col">
            <div className="p-4 flex items-center justify-between">
              <h1 className="text-lg font-bold text-sidebar-primary">UnivSupérieur</h1>
              <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
              {currentNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = location === item.path;
                return (
                  <Link key={item.path} href={item.path} className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium ${isActive ? 'bg-sidebar-primary text-sidebar-primary-foreground' : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'}`} onClick={() => setIsMobileMenuOpen(false)}>
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="p-4 border-t border-sidebar-border">
              <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-destructive" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 flex items-center justify-between px-4 border-b bg-card md:hidden no-print">
          <h1 className="text-lg font-bold text-primary">UnivSupérieur</h1>
          <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
        </header>
        <main className="flex-1 overflow-y-auto bg-background p-4 md:p-8">
          <div className="max-w-6xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
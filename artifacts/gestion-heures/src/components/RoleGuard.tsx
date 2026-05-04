import React from "react";
import { useLocation } from "wouter";
import { useObtenirUtilisateurCourant } from "@workspace/api-client-react";
import { Spinner } from "@/components/ui/spinner";
import { Layout } from "./Layout";

interface RoleGuardProps {
  allowed: ("admin" | "rh" | "enseignant")[];
  children: React.ReactNode;
}

export function RoleGuard({ allowed, children }: RoleGuardProps) {
  const [location, setLocation] = useLocation();
  const { data: user, isLoading, error } = useObtenirUtilisateurCourant();

  React.useEffect(() => {
    if (!isLoading && (!user || error)) {
      setLocation("/connexion");
    } else if (user && !allowed.includes(user.role)) {
      setLocation("/");
    }
  }, [user, isLoading, error, setLocation, allowed]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Spinner className="h-8 w-8 text-primary" />
      </div>
    );
  }

  if (!user || !allowed.includes(user.role)) {
    return null;
  }

  return <Layout>{children}</Layout>;
}
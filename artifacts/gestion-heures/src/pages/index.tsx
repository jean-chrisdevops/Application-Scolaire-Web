import { useLocation } from "wouter";
import { useObtenirUtilisateurCourant } from "@workspace/api-client-react";
import { useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";

export default function Index() {
  const [location, setLocation] = useLocation();
  const { data: user, isLoading, error } = useObtenirUtilisateurCourant();

  useEffect(() => {
    if (!isLoading) {
      if (error || !user) {
        setLocation("/connexion");
      } else {
        if (user.role === "admin") setLocation("/admin");
        else if (user.role === "rh") setLocation("/rh");
        else if (user.role === "enseignant") setLocation("/enseignant");
        else setLocation("/connexion");
      }
    }
  }, [user, isLoading, error, setLocation]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Spinner className="h-8 w-8 text-primary" />
    </div>
  );
}
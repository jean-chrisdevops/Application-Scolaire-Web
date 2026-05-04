import type { Request, Response, NextFunction } from "express";
import { eq } from "drizzle-orm";
import { db, utilisateursTable, type Utilisateur } from "@workspace/db";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      utilisateur?: Utilisateur;
    }
  }
}

export async function chargerUtilisateur(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  const id = req.session.utilisateurId;
  if (id) {
    const [u] = await db
      .select()
      .from(utilisateursTable)
      .where(eq(utilisateursTable.id, id));
    if (u) req.utilisateur = u;
  }
  next();
}

export function exigeAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (!req.utilisateur) {
    res.status(401).json({ erreur: "Authentification requise" });
    return;
  }
  next();
}

export function exigeRole(...roles: Array<"admin" | "rh" | "enseignant">) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.utilisateur) {
      res.status(401).json({ erreur: "Authentification requise" });
      return;
    }
    if (!roles.includes(req.utilisateur.role as "admin" | "rh" | "enseignant")) {
      res.status(403).json({ erreur: "Accès refusé" });
      return;
    }
    next();
  };
}

export function serialiserUtilisateur(u: Utilisateur) {
  return {
    id: u.id,
    email: u.email,
    nomComplet: u.nomComplet,
    role: u.role,
    enseignantId: u.enseignantId,
    creeLe:
      u.creeLe instanceof Date ? u.creeLe.toISOString() : String(u.creeLe),
  };
}

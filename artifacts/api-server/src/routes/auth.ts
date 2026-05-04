import { Router, type IRouter } from "express";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db, utilisateursTable } from "@workspace/db";
import { ConnecterBody } from "@workspace/api-zod";
import { exigeAuth, serialiserUtilisateur } from "../middlewares/auth";

const router: IRouter = Router();

router.post("/auth/connexion", async (req, res): Promise<void> => {
  const parsed = ConnecterBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ erreur: "Identifiants invalides" });
    return;
  }
  const { email, motDePasse } = parsed.data;
  const [u] = await db
    .select()
    .from(utilisateursTable)
    .where(eq(utilisateursTable.email, email.toLowerCase().trim()));
  if (!u) {
    res.status(401).json({ erreur: "Identifiants invalides" });
    return;
  }
  const ok = await bcrypt.compare(motDePasse, u.motDePasseHash);
  if (!ok) {
    res.status(401).json({ erreur: "Identifiants invalides" });
    return;
  }
  req.session.utilisateurId = u.id;
  res.json(serialiserUtilisateur(u));
});

router.post("/auth/deconnexion", async (req, res): Promise<void> => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.status(204).end();
  });
});

router.get("/auth/moi", exigeAuth, async (req, res): Promise<void> => {
  res.json(serialiserUtilisateur(req.utilisateur!));
});

export default router;

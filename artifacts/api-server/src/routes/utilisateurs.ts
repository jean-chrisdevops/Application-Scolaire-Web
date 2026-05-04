import { Router, type IRouter } from "express";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db, utilisateursTable } from "@workspace/db";
import {
  CreerUtilisateurBody,
  ModifierUtilisateurBody,
  ModifierUtilisateurParams,
  SupprimerUtilisateurParams,
} from "@workspace/api-zod";
import { exigeRole, serialiserUtilisateur } from "../middlewares/auth";

const router: IRouter = Router();

router.get(
  "/utilisateurs",
  exigeRole("admin"),
  async (_req, res): Promise<void> => {
    const lignes = await db
      .select()
      .from(utilisateursTable)
      .orderBy(utilisateursTable.creeLe);
    res.json(lignes.map(serialiserUtilisateur));
  },
);

router.post(
  "/utilisateurs",
  exigeRole("admin"),
  async (req, res): Promise<void> => {
    const parsed = CreerUtilisateurBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ erreur: parsed.error.message });
      return;
    }
    const motDePasseHash = await bcrypt.hash(parsed.data.motDePasse, 10);
    try {
      const [u] = await db
        .insert(utilisateursTable)
        .values({
          email: parsed.data.email.toLowerCase().trim(),
          nomComplet: parsed.data.nomComplet,
          motDePasseHash,
          role: parsed.data.role,
          enseignantId: parsed.data.enseignantId ?? null,
        })
        .returning();
      res.status(201).json(serialiserUtilisateur(u!));
    } catch (e) {
      res.status(400).json({ erreur: "Email déjà utilisé" });
    }
  },
);

router.patch(
  "/utilisateurs/:id",
  exigeRole("admin"),
  async (req, res): Promise<void> => {
    const params = ModifierUtilisateurParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ erreur: params.error.message });
      return;
    }
    const parsed = ModifierUtilisateurBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ erreur: parsed.error.message });
      return;
    }
    const updates: Record<string, unknown> = {};
    if (parsed.data.email)
      updates.email = parsed.data.email.toLowerCase().trim();
    if (parsed.data.nomComplet) updates.nomComplet = parsed.data.nomComplet;
    if (parsed.data.role) updates.role = parsed.data.role;
    if (parsed.data.enseignantId !== undefined)
      updates.enseignantId = parsed.data.enseignantId;
    if (parsed.data.motDePasse)
      updates.motDePasseHash = await bcrypt.hash(parsed.data.motDePasse, 10);
    const [u] = await db
      .update(utilisateursTable)
      .set(updates)
      .where(eq(utilisateursTable.id, params.data.id))
      .returning();
    if (!u) {
      res.status(404).json({ erreur: "Utilisateur introuvable" });
      return;
    }
    res.json(serialiserUtilisateur(u));
  },
);

router.delete(
  "/utilisateurs/:id",
  exigeRole("admin"),
  async (req, res): Promise<void> => {
    const params = SupprimerUtilisateurParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ erreur: params.error.message });
      return;
    }
    await db
      .delete(utilisateursTable)
      .where(eq(utilisateursTable.id, params.data.id));
    res.status(204).end();
  },
);

export default router;

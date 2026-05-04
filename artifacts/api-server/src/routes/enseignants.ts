import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, enseignantsTable, type Enseignant } from "@workspace/db";
import {
  CreerEnseignantBody,
  ModifierEnseignantBody,
  ModifierEnseignantParams,
  ObtenirEnseignantParams,
  ObtenirRecapitulatifEnseignantParams,
  SupprimerEnseignantParams,
} from "@workspace/api-zod";
import { exigeAuth, exigeRole } from "../middlewares/auth";
import { calculerRecapitulatifEnseignant } from "../lib/calcul";

const router: IRouter = Router();

function serialiser(e: Enseignant) {
  return {
    ...e,
    creeLe: e.creeLe instanceof Date ? e.creeLe.toISOString() : String(e.creeLe),
  };
}

router.get("/enseignants", exigeAuth, async (_req, res): Promise<void> => {
  const lignes = await db
    .select()
    .from(enseignantsTable)
    .orderBy(enseignantsTable.nom);
  res.json(lignes.map(serialiser));
});

router.post(
  "/enseignants",
  exigeRole("admin", "rh"),
  async (req, res): Promise<void> => {
    const parsed = CreerEnseignantBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ erreur: parsed.error.message });
      return;
    }
    try {
      const [e] = await db
        .insert(enseignantsTable)
        .values({
          ...parsed.data,
          email: parsed.data.email.toLowerCase().trim(),
        })
        .returning();
      res.status(201).json(serialiser(e!));
    } catch (err) {
      res.status(400).json({ erreur: "Email déjà utilisé" });
    }
  },
);

router.get("/enseignants/:id", exigeAuth, async (req, res): Promise<void> => {
  const params = ObtenirEnseignantParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ erreur: params.error.message });
    return;
  }
  const [e] = await db
    .select()
    .from(enseignantsTable)
    .where(eq(enseignantsTable.id, params.data.id));
  if (!e) {
    res.status(404).json({ erreur: "Enseignant introuvable" });
    return;
  }
  res.json(serialiser(e));
});

router.patch(
  "/enseignants/:id",
  exigeRole("admin", "rh"),
  async (req, res): Promise<void> => {
    const params = ModifierEnseignantParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ erreur: params.error.message });
      return;
    }
    const parsed = ModifierEnseignantBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ erreur: parsed.error.message });
      return;
    }
    const updates: Record<string, unknown> = { ...parsed.data };
    if (parsed.data.email) updates.email = parsed.data.email.toLowerCase().trim();
    const [e] = await db
      .update(enseignantsTable)
      .set(updates)
      .where(eq(enseignantsTable.id, params.data.id))
      .returning();
    if (!e) {
      res.status(404).json({ erreur: "Enseignant introuvable" });
      return;
    }
    res.json(serialiser(e));
  },
);

router.delete(
  "/enseignants/:id",
  exigeRole("admin", "rh"),
  async (req, res): Promise<void> => {
    const params = SupprimerEnseignantParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ erreur: params.error.message });
      return;
    }
    await db
      .delete(enseignantsTable)
      .where(eq(enseignantsTable.id, params.data.id));
    res.status(204).end();
  },
);

router.get(
  "/enseignants/:id/recapitulatif",
  exigeAuth,
  async (req, res): Promise<void> => {
    const params = ObtenirRecapitulatifEnseignantParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ erreur: params.error.message });
      return;
    }
    if (
      req.utilisateur!.role === "enseignant" &&
      req.utilisateur!.enseignantId !== params.data.id
    ) {
      res.status(403).json({ erreur: "Accès refusé" });
      return;
    }
    const recap = await calculerRecapitulatifEnseignant(params.data.id);
    if (!recap) {
      res.status(404).json({ erreur: "Enseignant introuvable" });
      return;
    }
    res.json({
      ...recap,
      enseignant: serialiser(recap.enseignant),
    });
  },
);

export default router;

import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, matieresTable, type Matiere } from "@workspace/db";
import {
  CreerMatiereBody,
  ModifierMatiereBody,
  ModifierMatiereParams,
  SupprimerMatiereParams,
} from "@workspace/api-zod";
import { exigeAuth, exigeRole } from "../middlewares/auth";

const router: IRouter = Router();

function serialiser(m: Matiere) {
  return {
    ...m,
    creeLe: m.creeLe instanceof Date ? m.creeLe.toISOString() : String(m.creeLe),
  };
}

router.get("/matieres", exigeAuth, async (_req, res): Promise<void> => {
  const lignes = await db
    .select()
    .from(matieresTable)
    .orderBy(matieresTable.intitule);
  res.json(lignes.map(serialiser));
});

router.post(
  "/matieres",
  exigeRole("admin", "rh"),
  async (req, res): Promise<void> => {
    const parsed = CreerMatiereBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ erreur: parsed.error.message });
      return;
    }
    const [m] = await db
      .insert(matieresTable)
      .values(parsed.data)
      .returning();
    res.status(201).json(serialiser(m!));
  },
);

router.patch(
  "/matieres/:id",
  exigeRole("admin", "rh"),
  async (req, res): Promise<void> => {
    const params = ModifierMatiereParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ erreur: params.error.message });
      return;
    }
    const parsed = ModifierMatiereBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ erreur: parsed.error.message });
      return;
    }
    const [m] = await db
      .update(matieresTable)
      .set(parsed.data)
      .where(eq(matieresTable.id, params.data.id))
      .returning();
    if (!m) {
      res.status(404).json({ erreur: "Matière introuvable" });
      return;
    }
    res.json(serialiser(m));
  },
);

router.delete(
  "/matieres/:id",
  exigeRole("admin", "rh"),
  async (req, res): Promise<void> => {
    const params = SupprimerMatiereParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ erreur: params.error.message });
      return;
    }
    await db.delete(matieresTable).where(eq(matieresTable.id, params.data.id));
    res.status(204).end();
  },
);

export default router;

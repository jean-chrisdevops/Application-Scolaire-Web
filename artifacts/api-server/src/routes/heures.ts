import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import {
  db,
  heuresTable,
  enseignantsTable,
  matieresTable,
  type Heure,
  type Enseignant,
  type Matiere,
} from "@workspace/db";
import {
  CreerHeureBody,
  ModifierHeureBody,
  ModifierHeureParams,
  SupprimerHeureParams,
  ValiderHeureBody,
  ValiderHeureParams,
  ListerHeuresQueryParams,
} from "@workspace/api-zod";
import { exigeAuth, exigeRole } from "../middlewares/auth";

const router: IRouter = Router();

function serialiser(
  h: Heure,
  enseignant?: Enseignant,
  matiere?: Matiere,
): Record<string, unknown> {
  return {
    ...h,
    date: typeof h.date === "string" ? h.date : new Date(h.date).toISOString().slice(0, 10),
    creeLe:
      h.creeLe instanceof Date
        ? h.creeLe.toISOString()
        : new Date(h.creeLe as unknown as string).toISOString(),
    nomEnseignant: enseignant
      ? `${enseignant.prenom} ${enseignant.nom}`
      : "",
    intituleMatiere: matiere ? matiere.intitule : "",
  };
}

router.get("/heures", exigeAuth, async (req, res): Promise<void> => {
  const parsed = ListerHeuresQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ erreur: parsed.error.message });
    return;
  }
  const { enseignantId } = parsed.data;

  let filtreEnseignantId = enseignantId;
  if (req.utilisateur!.role === "enseignant") {
    if (!req.utilisateur!.enseignantId) {
      res.json([]);
      return;
    }
    filtreEnseignantId = req.utilisateur!.enseignantId;
  }

  const lignes = await db
    .select({
      heure: heuresTable,
      enseignant: enseignantsTable,
      matiere: matieresTable,
    })
    .from(heuresTable)
    .leftJoin(enseignantsTable, eq(enseignantsTable.id, heuresTable.enseignantId))
    .leftJoin(matieresTable, eq(matieresTable.id, heuresTable.matiereId))
    .orderBy(desc(heuresTable.date));

  const filtrees = filtreEnseignantId
    ? lignes.filter((l) => l.heure.enseignantId === filtreEnseignantId)
    : lignes;

  res.json(
    filtrees.map((l) =>
      serialiser(l.heure, l.enseignant ?? undefined, l.matiere ?? undefined),
    ),
  );
});

router.post(
  "/heures",
  exigeRole("admin", "rh"),
  async (req, res): Promise<void> => {
    const parsed = CreerHeureBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ erreur: parsed.error.message });
      return;
    }
    const dateIso =
      parsed.data.date instanceof Date
        ? parsed.data.date.toISOString().slice(0, 10)
        : String(parsed.data.date);
    const [h] = await db
      .insert(heuresTable)
      .values({
        enseignantId: parsed.data.enseignantId,
        matiereId: parsed.data.matiereId,
        date: dateIso,
        type: parsed.data.type,
        duree: parsed.data.duree,
        salle: parsed.data.salle ?? "",
        observations: parsed.data.observations ?? "",
      })
      .returning();
    const [enseignant] = await db
      .select()
      .from(enseignantsTable)
      .where(eq(enseignantsTable.id, h!.enseignantId));
    const [matiere] = await db
      .select()
      .from(matieresTable)
      .where(eq(matieresTable.id, h!.matiereId));
    res.status(201).json(serialiser(h!, enseignant, matiere));
  },
);

router.patch(
  "/heures/:id",
  exigeRole("admin", "rh"),
  async (req, res): Promise<void> => {
    const params = ModifierHeureParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ erreur: params.error.message });
      return;
    }
    const parsed = ModifierHeureBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ erreur: parsed.error.message });
      return;
    }
    const updates: Record<string, unknown> = { ...parsed.data };
    if (parsed.data.date !== undefined) {
      updates.date =
        parsed.data.date instanceof Date
          ? parsed.data.date.toISOString().slice(0, 10)
          : String(parsed.data.date);
    }
    const [h] = await db
      .update(heuresTable)
      .set(updates)
      .where(eq(heuresTable.id, params.data.id))
      .returning();
    if (!h) {
      res.status(404).json({ erreur: "Heure introuvable" });
      return;
    }
    const [enseignant] = await db
      .select()
      .from(enseignantsTable)
      .where(eq(enseignantsTable.id, h.enseignantId));
    const [matiere] = await db
      .select()
      .from(matieresTable)
      .where(eq(matieresTable.id, h.matiereId));
    res.json(serialiser(h, enseignant, matiere));
  },
);

router.delete(
  "/heures/:id",
  exigeRole("admin", "rh"),
  async (req, res): Promise<void> => {
    const params = SupprimerHeureParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ erreur: params.error.message });
      return;
    }
    await db.delete(heuresTable).where(eq(heuresTable.id, params.data.id));
    res.status(204).end();
  },
);

router.patch(
  "/heures/:id/valider",
  exigeRole("admin", "rh"),
  async (req, res): Promise<void> => {
    const params = ValiderHeureParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ erreur: params.error.message });
      return;
    }
    const parsed = ValiderHeureBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ erreur: parsed.error.message });
      return;
    }
    const [h] = await db
      .update(heuresTable)
      .set({ validee: parsed.data.validee })
      .where(eq(heuresTable.id, params.data.id))
      .returning();
    if (!h) {
      res.status(404).json({ erreur: "Heure introuvable" });
      return;
    }
    const [enseignant] = await db
      .select()
      .from(enseignantsTable)
      .where(eq(enseignantsTable.id, h.enseignantId));
    const [matiere] = await db
      .select()
      .from(matieresTable)
      .where(eq(matieresTable.id, h.matiereId));
    res.json(serialiser(h, enseignant, matiere));
  },
);

export default router;

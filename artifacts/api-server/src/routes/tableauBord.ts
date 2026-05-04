import { Router, type IRouter } from "express";
import { eq, desc, sql } from "drizzle-orm";
import {
  db,
  utilisateursTable,
  enseignantsTable,
  matieresTable,
  heuresTable,
  type Heure,
  type Enseignant,
  type Matiere,
} from "@workspace/db";
import { exigeAuth, exigeRole } from "../middlewares/auth";
import {
  calculerRecapitulatifEnseignant,
  obtenirParametresCourants,
} from "../lib/calcul";

const router: IRouter = Router();

function serialiserHeure(
  h: Heure,
  enseignant?: Enseignant,
  matiere?: Matiere,
) {
  return {
    ...h,
    date:
      typeof h.date === "string"
        ? h.date
        : new Date(h.date).toISOString().slice(0, 10),
    creeLe:
      h.creeLe instanceof Date
        ? h.creeLe.toISOString()
        : new Date(h.creeLe as unknown as string).toISOString(),
    nomEnseignant: enseignant ? `${enseignant.prenom} ${enseignant.nom}` : "",
    intituleMatiere: matiere ? matiere.intitule : "",
  };
}

function serialiserEnseignant(e: Enseignant) {
  return {
    ...e,
    creeLe: e.creeLe instanceof Date ? e.creeLe.toISOString() : String(e.creeLe),
  };
}

router.get(
  "/tableau-bord/admin",
  exigeRole("admin"),
  async (_req, res): Promise<void> => {
    const utilisateurs = await db.select().from(utilisateursTable);
    const enseignants = await db.select().from(enseignantsTable);
    const matieres = await db.select().from(matieresTable);
    const parametres = await obtenirParametresCourants();

    let masseSalarialeEstimee = 0;
    for (const e of enseignants) {
      const recap = await calculerRecapitulatifEnseignant(e.id);
      if (recap) masseSalarialeEstimee += recap.montantTotal;
    }

    const compteurRoles: Record<string, number> = {
      admin: 0,
      rh: 0,
      enseignant: 0,
    };
    for (const u of utilisateurs) {
      compteurRoles[u.role] = (compteurRoles[u.role] ?? 0) + 1;
    }

    res.json({
      nombreUtilisateurs: utilisateurs.length,
      nombreEnseignants: enseignants.length,
      nombreMatieres: matieres.length,
      anneeAcademique: parametres.anneeAcademique,
      masseSalarialeEstimee,
      repartitionRoles: Object.entries(compteurRoles).map(([role, nombre]) => ({
        role,
        nombre,
      })),
    });
  },
);

router.get(
  "/tableau-bord/rh",
  exigeRole("admin", "rh"),
  async (_req, res): Promise<void> => {
    const heures = await db.select().from(heuresTable);
    const enseignants = await db.select().from(enseignantsTable);

    const totalHeuresSaisies = heures.reduce((s, h) => s + Number(h.duree), 0);
    const totalHeuresValidees = heures
      .filter((h) => h.validee)
      .reduce((s, h) => s + Number(h.duree), 0);
    const totalHeuresEnAttente = totalHeuresSaisies - totalHeuresValidees;

    const enseignantsAvecHeures = new Set(heures.map((h) => h.enseignantId));
    let masseSalariale = 0;
    let nombreEnseignantsEnDepassement = 0;
    for (const e of enseignants) {
      const recap = await calculerRecapitulatifEnseignant(e.id);
      if (recap) {
        masseSalariale += recap.montantTotal;
        if (recap.heuresComplementaires > 0) nombreEnseignantsEnDepassement++;
      }
    }

    const dernieres = await db
      .select({
        heure: heuresTable,
        enseignant: enseignantsTable,
        matiere: matieresTable,
      })
      .from(heuresTable)
      .leftJoin(
        enseignantsTable,
        eq(enseignantsTable.id, heuresTable.enseignantId),
      )
      .leftJoin(matieresTable, eq(matieresTable.id, heuresTable.matiereId))
      .orderBy(desc(heuresTable.creeLe))
      .limit(8);

    res.json({
      totalHeuresSaisies,
      totalHeuresValidees,
      totalHeuresEnAttente,
      nombreEnseignantsActifs: enseignantsAvecHeures.size,
      nombreEnseignantsEnDepassement,
      masseSalariale,
      derniereActivite: dernieres.map((d) =>
        serialiserHeure(
          d.heure,
          d.enseignant ?? undefined,
          d.matiere ?? undefined,
        ),
      ),
    });
  },
);

router.get(
  "/tableau-bord/enseignant",
  exigeRole("enseignant", "admin", "rh"),
  async (req, res): Promise<void> => {
    const idEnseignant =
      req.utilisateur!.role === "enseignant"
        ? req.utilisateur!.enseignantId
        : null;
    if (!idEnseignant) {
      res.status(404).json({ erreur: "Aucun enseignant lié à ce compte" });
      return;
    }
    const recap = await calculerRecapitulatifEnseignant(idEnseignant);
    if (!recap) {
      res.status(404).json({ erreur: "Enseignant introuvable" });
      return;
    }
    res.json({
      ...recap,
      enseignant: serialiserEnseignant(recap.enseignant),
    });
  },
);

router.get(
  "/statistiques/departements",
  exigeRole("admin", "rh"),
  async (_req, res): Promise<void> => {
    const enseignants = await db.select().from(enseignantsTable);
    const parDepartement: Record<
      string,
      { totalHeures: number; nombreEnseignants: number; masseSalariale: number }
    > = {};
    for (const e of enseignants) {
      if (!parDepartement[e.departement]) {
        parDepartement[e.departement] = {
          totalHeures: 0,
          nombreEnseignants: 0,
          masseSalariale: 0,
        };
      }
      parDepartement[e.departement]!.nombreEnseignants++;
      const recap = await calculerRecapitulatifEnseignant(e.id);
      if (recap) {
        parDepartement[e.departement]!.totalHeures +=
          recap.totalHeuresEquivalentTd;
        parDepartement[e.departement]!.masseSalariale += recap.montantTotal;
      }
    }
    res.json(
      Object.entries(parDepartement).map(([departement, v]) => ({
        departement,
        ...v,
      })),
    );
  },
);

router.get(
  "/statistiques/depassements",
  exigeRole("admin", "rh"),
  async (_req, res): Promise<void> => {
    const enseignants = await db.select().from(enseignantsTable);
    const resultats = [];
    for (const e of enseignants) {
      const recap = await calculerRecapitulatifEnseignant(e.id);
      if (recap && recap.heuresComplementaires > 0) {
        resultats.push({
          ...recap,
          enseignant: serialiserEnseignant(recap.enseignant),
        });
      }
    }
    resultats.sort(
      (a, b) => b.heuresComplementaires - a.heuresComplementaires,
    );
    res.json(resultats);
  },
);

router.get(
  "/statistiques/filieres",
  exigeRole("admin", "rh"),
  async (_req, res): Promise<void> => {
    const matieres = await db.select().from(matieresTable);
    const heures = await db
      .select({
        matiereId: heuresTable.matiereId,
        duree: heuresTable.duree,
      })
      .from(heuresTable);
    const parFiliere: Record<
      string,
      { totalHeures: number; nombreMatieres: number }
    > = {};
    for (const m of matieres) {
      if (!parFiliere[m.filiere]) {
        parFiliere[m.filiere] = { totalHeures: 0, nombreMatieres: 0 };
      }
      parFiliere[m.filiere]!.nombreMatieres++;
    }
    for (const h of heures) {
      const m = matieres.find((mm) => mm.id === h.matiereId);
      if (m && parFiliere[m.filiere]) {
        parFiliere[m.filiere]!.totalHeures += Number(h.duree);
      }
    }
    res.json(
      Object.entries(parFiliere).map(([filiere, v]) => ({
        filiere,
        ...v,
      })),
    );
  },
);

router.get(
  "/statistiques/mensuel",
  exigeRole("admin", "rh"),
  async (_req, res): Promise<void> => {
    const lignes = await db
      .select({
        mois: sql<string>`to_char(${heuresTable.date}, 'YYYY-MM')`,
        totalHeures: sql<string>`sum(${heuresTable.duree})`,
        nombreSeances: sql<string>`count(*)`,
      })
      .from(heuresTable)
      .groupBy(sql`to_char(${heuresTable.date}, 'YYYY-MM')`)
      .orderBy(sql`to_char(${heuresTable.date}, 'YYYY-MM')`);
    res.json(
      lignes.map((l) => ({
        mois: l.mois,
        totalHeures: Number(l.totalHeures),
        nombreSeances: Number(l.nombreSeances),
      })),
    );
  },
);

export default router;

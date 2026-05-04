import { eq } from "drizzle-orm";
import {
  db,
  enseignantsTable,
  heuresTable,
  parametresTable,
  type Enseignant,
  type Parametres,
} from "@workspace/db";

export interface RecapMensuel {
  mois: number;
  annee: number;
  label: string;
  heuresCm: number;
  heuresTd: number;
  heuresTp: number;
  heuresEquivalentTd: number;
  heuresNormales: number;
  heuresComplementaires: number;
  montantNormal: number;
  montantComplementaire: number;
  montantTotal: number;
}

export interface RecapitulatifCalcule {
  enseignant: Enseignant;
  totalHeuresCm: number;
  totalHeuresTd: number;
  totalHeuresTp: number;
  totalHeuresEquivalentTd: number;
  heuresContractuelles: number;
  heuresComplementaires: number;
  montantNormal: number;
  montantComplementaire: number;
  montantTotal: number;
  nombreSeances: number;
  heuresValidees: number;
  heuresEnAttente: number;
  recapMensuel: RecapMensuel[];
}

const NOMS_MOIS = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];

function labelMois(mois: number, annee: number): string {
  return `${NOMS_MOIS[mois - 1]} ${annee}`;
}

function tauxPourType(
  type: string,
  parametres: Parametres,
): number {
  if (type === "CM") return parametres.tauxHoraireCm;
  if (type === "TD") return parametres.tauxHoraireTd;
  return parametres.tauxHoraireTp;
}

function equivPourType(type: string, parametres: Parametres): number {
  if (type === "CM") return parametres.equivalenceCm;
  if (type === "TD") return parametres.equivalenceTd;
  return parametres.equivalenceTp;
}

export async function obtenirParametresCourants(): Promise<Parametres> {
  const lignes = await db.select().from(parametresTable).limit(1);
  if (lignes[0]) return lignes[0];
  const [defaut] = await db
    .insert(parametresTable)
    .values({
      anneeAcademique: "2025-2026",
      tauxHoraireCm: 7871,
      tauxHoraireTd: 5248,
      tauxHoraireTp: 3936,
      equivalenceCm: 1.5,
      equivalenceTd: 1,
      equivalenceTp: 0.75,
      seuilHeuresContractuelles: 192,
    })
    .returning();
  if (!defaut) {
    throw new Error("Impossible d'initialiser les paramètres");
  }
  return defaut;
}

export async function calculerRecapitulatifEnseignant(
  enseignantId: number,
): Promise<RecapitulatifCalcule | null> {
  const [enseignant] = await db
    .select()
    .from(enseignantsTable)
    .where(eq(enseignantsTable.id, enseignantId));
  if (!enseignant) return null;

  const heures = await db
    .select()
    .from(heuresTable)
    .where(eq(heuresTable.enseignantId, enseignantId));

  const parametres = await obtenirParametresCourants();
  const seuil = parametres.seuilHeuresContractuelles;

  // --- Regroupement par mois (clé : "AAAA-MM") ---
  type EntreeMois = {
    mois: number;
    annee: number;
    heuresCm: number;
    heuresTd: number;
    heuresTp: number;
    heuresEquivalentTd: number;
    heuresNormales: number;
    heuresComplementaires: number;
    montantNormal: number;
    montantComplementaire: number;
  };
  const carte = new Map<string, EntreeMois>();

  // Trier les heures par date pour que le cumul soit chronologique
  const heuresTri = [...heures].sort((a, b) => {
    const da = typeof a.date === "string" ? a.date : String(a.date);
    const db_ = typeof b.date === "string" ? b.date : String(b.date);
    return da.localeCompare(db_);
  });

  let cumulEqTd = 0; // cumul eq TD validées depuis le début de l'année

  let totalHeuresCm = 0;
  let totalHeuresTd = 0;
  let totalHeuresTp = 0;
  let heuresValidees = 0;
  let heuresEnAttente = 0;

  for (const heure of heuresTri) {
    const duree = Number(heure.duree);
    const dateStr = typeof heure.date === "string" ? heure.date : String(heure.date);
    const date = new Date(dateStr);
    const mois = date.getMonth() + 1; // 1-12
    const annee = date.getFullYear();
    const cle = `${annee}-${String(mois).padStart(2, "0")}`;

    // Initialiser l'entrée mensuelle si nécessaire
    if (!carte.has(cle)) {
      carte.set(cle, {
        mois,
        annee,
        heuresCm: 0,
        heuresTd: 0,
        heuresTp: 0,
        heuresEquivalentTd: 0,
        heuresNormales: 0,
        heuresComplementaires: 0,
        montantNormal: 0,
        montantComplementaire: 0,
      });
    }
    const entree = carte.get(cle)!;

    // Comptage brut par type
    if (heure.type === "CM") { totalHeuresCm += duree; entree.heuresCm += duree; }
    else if (heure.type === "TD") { totalHeuresTd += duree; entree.heuresTd += duree; }
    else if (heure.type === "TP") { totalHeuresTp += duree; entree.heuresTp += duree; }

    if (!heure.validee) {
      heuresEnAttente += duree;
      continue;
    }

    heuresValidees += duree;

    const equiv = equivPourType(heure.type, parametres);
    const taux = tauxPourType(heure.type, parametres);
    const eqTdSession = duree * equiv;

    // Calculer la portion normale vs complémentaire de cette session
    const debutCumul = cumulEqTd;
    const finCumul = cumulEqTd + eqTdSession;

    let portionNormaleEqTd: number;
    let portionComplementaireEqTd: number;

    if (finCumul <= seuil) {
      // Entièrement dans le service normal
      portionNormaleEqTd = eqTdSession;
      portionComplementaireEqTd = 0;
    } else if (debutCumul >= seuil) {
      // Entièrement complémentaire
      portionNormaleEqTd = 0;
      portionComplementaireEqTd = eqTdSession;
    } else {
      // Mixte : chevauchement du seuil
      portionNormaleEqTd = seuil - debutCumul;
      portionComplementaireEqTd = finCumul - seuil;
    }

    cumulEqTd = finCumul;

    // Convertir les eq TD en heures réelles (même ratio)
    const fractionNormale = eqTdSession > 0 ? portionNormaleEqTd / eqTdSession : 0;
    const fractionComp = eqTdSession > 0 ? portionComplementaireEqTd / eqTdSession : 0;

    const heuresNormalesSess = duree * fractionNormale;
    const heuresCompSess = duree * fractionComp;

    const montantNormalSess = heuresNormalesSess * taux;
    const montantCompSess = heuresCompSess * taux;

    // Accumuler dans l'entrée mensuelle
    entree.heuresEquivalentTd += eqTdSession;
    entree.heuresNormales += heuresNormalesSess;
    entree.heuresComplementaires += heuresCompSess;
    entree.montantNormal += montantNormalSess;
    entree.montantComplementaire += montantCompSess;
  }

  // --- Construire la liste mensuelle triée ---
  const recapMensuel: RecapMensuel[] = [...carte.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, e]) => ({
      mois: e.mois,
      annee: e.annee,
      label: labelMois(e.mois, e.annee),
      heuresCm: Math.round(e.heuresCm * 100) / 100,
      heuresTd: Math.round(e.heuresTd * 100) / 100,
      heuresTp: Math.round(e.heuresTp * 100) / 100,
      heuresEquivalentTd: Math.round(e.heuresEquivalentTd * 100) / 100,
      heuresNormales: Math.round(e.heuresNormales * 100) / 100,
      heuresComplementaires: Math.round(e.heuresComplementaires * 100) / 100,
      montantNormal: Math.round(e.montantNormal),
      montantComplementaire: Math.round(e.montantComplementaire),
      montantTotal: Math.round(e.montantNormal + e.montantComplementaire),
    }));

  // --- Totaux annuels ---
  const totalHeuresEquivalentTd =
    totalHeuresCm * parametres.equivalenceCm +
    totalHeuresTd * parametres.equivalenceTd +
    totalHeuresTp * parametres.equivalenceTp;

  const heuresContractuelles = Math.min(totalHeuresEquivalentTd, seuil);
  const heuresComplementaires = Math.max(0, totalHeuresEquivalentTd - seuil);

  const montantNormal = Math.round(recapMensuel.reduce((s, m) => s + m.montantNormal, 0));
  const montantComplementaire = Math.round(recapMensuel.reduce((s, m) => s + m.montantComplementaire, 0));
  const montantTotal = montantNormal + montantComplementaire;

  return {
    enseignant,
    totalHeuresCm,
    totalHeuresTd,
    totalHeuresTp,
    totalHeuresEquivalentTd,
    heuresContractuelles,
    heuresComplementaires,
    montantNormal,
    montantComplementaire,
    montantTotal,
    nombreSeances: heures.length,
    heuresValidees,
    heuresEnAttente,
    recapMensuel,
  };
}

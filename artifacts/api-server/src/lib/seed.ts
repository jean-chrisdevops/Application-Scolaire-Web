import bcrypt from "bcryptjs";
import {
  db,
  utilisateursTable,
  enseignantsTable,
  matieresTable,
  heuresTable,
  parametresTable,
} from "@workspace/db";
import { logger } from "./logger";

export async function executerSeedSiVide(): Promise<void> {
  const existant = await db.select().from(utilisateursTable).limit(1);
  if (existant.length > 0) {
    logger.info("Seed ignoré (utilisateurs déjà présents)");
    return;
  }

  logger.info("Création des données de démonstration");

  await db.insert(parametresTable).values({
    anneeAcademique: "2025-2026",
    tauxHoraireCm: 7871,
    tauxHoraireTd: 5248,
    tauxHoraireTp: 3936,
    equivalenceCm: 1.5,
    equivalenceTd: 1,
    equivalenceTp: 0.75,
    seuilHeuresContractuelles: 192,
  });

  const enseignants = await db
    .insert(enseignantsTable)
    .values([
      {
        nom: "Diallo",
        prenom: "Awa",
        email: "awa.diallo@univsuperieur.ci",
        grade: "MaitreAssistant",
        statut: "Permanent",
        departement: "Informatique",
        tauxHoraire: 5576,
      },
      {
        nom: "Martin",
        prenom: "Pierre",
        email: "pierre.martin@univsuperieur.ci",
        grade: "Professeur",
        statut: "Permanent",
        departement: "Mathématiques",
        tauxHoraire: 7871,
      },
      {
        nom: "Ndiaye",
        prenom: "Fatou",
        email: "fatou.ndiaye@univsuperieur.ci",
        grade: "Assistant",
        statut: "Vacataire",
        departement: "Informatique",
        tauxHoraire: 4264,
      },
      {
        nom: "Bernard",
        prenom: "Julien",
        email: "julien.bernard@univsuperieur.ci",
        grade: "MaitreAssistant",
        statut: "Permanent",
        departement: "Physique",
        tauxHoraire: 5904,
      },
      {
        nom: "Sow",
        prenom: "Mamadou",
        email: "mamadou.sow@univsuperieur.ci",
        grade: "Professeur",
        statut: "Permanent",
        departement: "Économie",
        tauxHoraire: 7544,
      },
    ])
    .returning();

  const matieres = await db
    .insert(matieresTable)
    .values([
      {
        intitule: "Algorithmique avancée",
        filiere: "Génie Logiciel",
        niveau: "L3",
        volumeHorairePrevu: 60,
      },
      {
        intitule: "Bases de données",
        filiere: "Génie Logiciel",
        niveau: "L2",
        volumeHorairePrevu: 45,
      },
      {
        intitule: "Analyse mathématique",
        filiere: "Mathématiques Appliquées",
        niveau: "L1",
        volumeHorairePrevu: 75,
      },
      {
        intitule: "Algèbre linéaire",
        filiere: "Mathématiques Appliquées",
        niveau: "L2",
        volumeHorairePrevu: 60,
      },
      {
        intitule: "Réseaux informatiques",
        filiere: "Réseaux et Télécoms",
        niveau: "M1",
        volumeHorairePrevu: 50,
      },
      {
        intitule: "Mécanique quantique",
        filiere: "Physique Fondamentale",
        niveau: "M1",
        volumeHorairePrevu: 60,
      },
      {
        intitule: "Macroéconomie",
        filiere: "Sciences Économiques",
        niveau: "L3",
        volumeHorairePrevu: 50,
      },
      {
        intitule: "Intelligence artificielle",
        filiere: "Génie Logiciel",
        niveau: "M2",
        volumeHorairePrevu: 45,
      },
    ])
    .returning();

  const motDePasseAdmin = await bcrypt.hash("Admin123!", 10);
  const motDePasseRh = await bcrypt.hash("Rh123456!", 10);
  const motDePasseEnseignant = await bcrypt.hash("Enseignant1!", 10);

  await db.insert(utilisateursTable).values([
    {
      email: "admin@univsuperieur.ci",
      nomComplet: "Aïssatou Coulibaly",
      motDePasseHash: motDePasseAdmin,
      role: "admin",
      enseignantId: null,
    },
    {
      email: "rh@univsuperieur.ci",
      nomComplet: "Sophie Lemoine",
      motDePasseHash: motDePasseRh,
      role: "rh",
      enseignantId: null,
    },
    {
      email: "enseignant@univsuperieur.ci",
      nomComplet: `${enseignants[0]!.prenom} ${enseignants[0]!.nom}`,
      motDePasseHash: motDePasseEnseignant,
      role: "enseignant",
      enseignantId: enseignants[0]!.id,
    },
  ]);

  const aujourdhui = new Date();
  function dateRelative(jours: number): string {
    const d = new Date(aujourdhui);
    d.setDate(d.getDate() - jours);
    return d.toISOString().slice(0, 10);
  }

  await db.insert(heuresTable).values([
    {
      enseignantId: enseignants[0]!.id,
      matiereId: matieres[0]!.id,
      date: dateRelative(2),
      type: "CM",
      duree: 3,
      salle: "Amphi A",
      observations: "",
      validee: true,
    },
    {
      enseignantId: enseignants[0]!.id,
      matiereId: matieres[0]!.id,
      date: dateRelative(5),
      type: "TD",
      duree: 2,
      salle: "Salle 12",
      observations: "",
      validee: true,
    },
    {
      enseignantId: enseignants[0]!.id,
      matiereId: matieres[1]!.id,
      date: dateRelative(7),
      type: "TP",
      duree: 3,
      salle: "Lab Info 1",
      observations: "",
      validee: false,
    },
    {
      enseignantId: enseignants[1]!.id,
      matiereId: matieres[2]!.id,
      date: dateRelative(1),
      type: "CM",
      duree: 3,
      salle: "Amphi B",
      observations: "",
      validee: true,
    },
    {
      enseignantId: enseignants[1]!.id,
      matiereId: matieres[3]!.id,
      date: dateRelative(4),
      type: "TD",
      duree: 2,
      salle: "Salle 7",
      observations: "",
      validee: true,
    },
    {
      enseignantId: enseignants[2]!.id,
      matiereId: matieres[4]!.id,
      date: dateRelative(3),
      type: "CM",
      duree: 3,
      salle: "Amphi C",
      observations: "",
      validee: false,
    },
    {
      enseignantId: enseignants[3]!.id,
      matiereId: matieres[5]!.id,
      date: dateRelative(6),
      type: "CM",
      duree: 4,
      salle: "Amphi D",
      observations: "",
      validee: true,
    },
    {
      enseignantId: enseignants[4]!.id,
      matiereId: matieres[6]!.id,
      date: dateRelative(8),
      type: "CM",
      duree: 3,
      salle: "Amphi A",
      observations: "",
      validee: true,
    },
  ]);

  logger.info("Données de démonstration créées");
}

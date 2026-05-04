import {
  pgTable,
  serial,
  text,
  timestamp,
  doublePrecision,
} from "drizzle-orm/pg-core";

export const enseignantsTable = pgTable("enseignants", {
  id: serial("id").primaryKey(),
  nom: text("nom").notNull(),
  prenom: text("prenom").notNull(),
  email: text("email").notNull().unique(),
  grade: text("grade").notNull(),
  statut: text("statut").notNull(),
  departement: text("departement").notNull(),
  tauxHoraire: doublePrecision("taux_horaire").notNull(),
  creeLe: timestamp("cree_le", { withTimezone: true }).notNull().defaultNow(),
});

export type Enseignant = typeof enseignantsTable.$inferSelect;
export type InsertEnseignant = typeof enseignantsTable.$inferInsert;

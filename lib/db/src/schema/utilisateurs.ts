import { pgTable, serial, text, timestamp, integer } from "drizzle-orm/pg-core";

export const utilisateursTable = pgTable("utilisateurs", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  nomComplet: text("nom_complet").notNull(),
  motDePasseHash: text("mot_de_passe_hash").notNull(),
  role: text("role").notNull(),
  enseignantId: integer("enseignant_id"),
  creeLe: timestamp("cree_le", { withTimezone: true }).notNull().defaultNow(),
});

export type Utilisateur = typeof utilisateursTable.$inferSelect;
export type InsertUtilisateur = typeof utilisateursTable.$inferInsert;

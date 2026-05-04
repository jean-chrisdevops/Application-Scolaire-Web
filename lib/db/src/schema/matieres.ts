import {
  pgTable,
  serial,
  text,
  timestamp,
  doublePrecision,
} from "drizzle-orm/pg-core";

export const matieresTable = pgTable("matieres", {
  id: serial("id").primaryKey(),
  intitule: text("intitule").notNull(),
  filiere: text("filiere").notNull(),
  niveau: text("niveau").notNull(),
  volumeHorairePrevu: doublePrecision("volume_horaire_prevu").notNull(),
  creeLe: timestamp("cree_le", { withTimezone: true }).notNull().defaultNow(),
});

export type Matiere = typeof matieresTable.$inferSelect;
export type InsertMatiere = typeof matieresTable.$inferInsert;

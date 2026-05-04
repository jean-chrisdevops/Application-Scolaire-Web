import {
  pgTable,
  serial,
  text,
  timestamp,
  doublePrecision,
} from "drizzle-orm/pg-core";

export const parametresTable = pgTable("parametres", {
  id: serial("id").primaryKey(),
  anneeAcademique: text("annee_academique").notNull(),
  tauxHoraireCm: doublePrecision("taux_horaire_cm").notNull(),
  tauxHoraireTd: doublePrecision("taux_horaire_td").notNull(),
  tauxHoraireTp: doublePrecision("taux_horaire_tp").notNull(),
  equivalenceCm: doublePrecision("equivalence_cm").notNull(),
  equivalenceTd: doublePrecision("equivalence_td").notNull(),
  equivalenceTp: doublePrecision("equivalence_tp").notNull(),
  seuilHeuresContractuelles: doublePrecision(
    "seuil_heures_contractuelles",
  ).notNull(),
  misAJourLe: timestamp("mis_a_jour_le", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type Parametres = typeof parametresTable.$inferSelect;
export type InsertParametres = typeof parametresTable.$inferInsert;

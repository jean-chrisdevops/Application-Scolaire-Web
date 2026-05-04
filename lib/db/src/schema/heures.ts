import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  doublePrecision,
  boolean,
  date,
} from "drizzle-orm/pg-core";
import { enseignantsTable } from "./enseignants";
import { matieresTable } from "./matieres";

export const heuresTable = pgTable("heures", {
  id: serial("id").primaryKey(),
  enseignantId: integer("enseignant_id")
    .notNull()
    .references(() => enseignantsTable.id, { onDelete: "cascade" }),
  matiereId: integer("matiere_id")
    .notNull()
    .references(() => matieresTable.id, { onDelete: "cascade" }),
  date: date("date").notNull(),
  type: text("type").notNull(),
  duree: doublePrecision("duree").notNull(),
  salle: text("salle").notNull().default(""),
  observations: text("observations").notNull().default(""),
  validee: boolean("validee").notNull().default(false),
  creeLe: timestamp("cree_le", { withTimezone: true }).notNull().defaultNow(),
});

export type Heure = typeof heuresTable.$inferSelect;
export type InsertHeure = typeof heuresTable.$inferInsert;

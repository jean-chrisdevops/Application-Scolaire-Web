import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, parametresTable } from "@workspace/db";
import { ModifierParametresBody } from "@workspace/api-zod";
import { exigeAuth, exigeRole } from "../middlewares/auth";
import { obtenirParametresCourants } from "../lib/calcul";

const router: IRouter = Router();

router.get("/parametres", exigeAuth, async (_req, res): Promise<void> => {
  const p = await obtenirParametresCourants();
  res.json(serialiser(p));
});

router.patch(
  "/parametres",
  exigeRole("admin"),
  async (req, res): Promise<void> => {
    const parsed = ModifierParametresBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ erreur: parsed.error.message });
      return;
    }
    const courant = await obtenirParametresCourants();
    const [p] = await db
      .update(parametresTable)
      .set({ ...parsed.data })
      .where(eq(parametresTable.id, courant.id))
      .returning();
    res.json(serialiser(p!));
  },
);

function serialiser(p: typeof parametresTable.$inferSelect) {
  return {
    ...p,
    misAJourLe:
      p.misAJourLe instanceof Date
        ? p.misAJourLe.toISOString()
        : String(p.misAJourLe),
  };
}

export default router;

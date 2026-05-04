import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import utilisateursRouter from "./utilisateurs";
import parametresRouter from "./parametres";
import enseignantsRouter from "./enseignants";
import matieresRouter from "./matieres";
import heuresRouter from "./heures";
import tableauBordRouter from "./tableauBord";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(utilisateursRouter);
router.use(parametresRouter);
router.use(enseignantsRouter);
router.use(matieresRouter);
router.use(heuresRouter);
router.use(tableauBordRouter);

export default router;

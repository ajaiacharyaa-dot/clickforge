import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import thumbnailRouter from "./thumbnail.js";
import postsRouter from "./posts.js";
import dmsRouter from "./dms.js";
import statsRouter from "./stats.js";
import jarvisRouter from "./jarvis.js";
import contentRouter from "./content.js";
import researchRouter from "./research.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(thumbnailRouter);
router.use(postsRouter);
router.use(dmsRouter);
router.use(statsRouter);
router.use(jarvisRouter);
router.use(contentRouter);
router.use(researchRouter);

export default router;

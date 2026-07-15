import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import thumbnailRouter from "./thumbnail.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(thumbnailRouter);

export default router;

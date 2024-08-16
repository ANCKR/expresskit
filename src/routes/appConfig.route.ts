import { Router } from "express";
import {
  appVersionInsert,
  showAppVersion,
} from "../controllers/appConfig.controller";

const router = Router();

router.get("/versions", showAppVersion);
router.post("/versionDetails", appVersionInsert);

export default router;

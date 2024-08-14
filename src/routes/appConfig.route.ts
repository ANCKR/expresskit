import { Router } from "express";
import authenticateToken from "../middleware/authTokenCheck";
import {
  appVersionInsert,
  showAppVersion,
} from "../controllers/appConfig.controller";

const router = Router();

router.post("/versions", authenticateToken, showAppVersion);
router.post("/versionDetails", authenticateToken, appVersionInsert);

export default router;

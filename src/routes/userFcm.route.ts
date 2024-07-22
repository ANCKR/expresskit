import { Router } from "express";
import authenticateToken from "../middleware/authTokenCheck";
import { createUserFcm } from "controllers/userFcm.controller";

const router = Router();

router.post("/userFcm", authenticateToken, createUserFcm);

export default router;

import { Router } from "express";
import authenticateToken from "../middleware/authTokenCheck";
import { createUserFcm } from "../controllers/userFcm.controller";

const router = Router();
console.log(createUserFcm);

router.post("/userFcm", authenticateToken, createUserFcm);

export default router;

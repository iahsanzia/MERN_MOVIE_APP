import { Router } from "express";
import { AuthController } from "../controllers";

const router = Router();

router.post("/register", AuthController.register); // POST /api/auth/register
router.post("/login", AuthController.login); // POST /api/auth/login
router.post("/verify", AuthController.verifyToken); // POST /api/auth/verify

export default router;

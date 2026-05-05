import { Router } from "express";
import { AuthController } from "../controllers";
import { catchAsync } from "../utils";

const router = Router();

router.post("/register", catchAsync(AuthController.register)); // POST /api/auth/register
router.post("/login", catchAsync(AuthController.login)); // POST /api/auth/login
router.post("/verify", catchAsync(AuthController.verifyToken)); // POST /api/auth/verify

export default router;

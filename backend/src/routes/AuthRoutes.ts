import { Router } from "express";
import { AuthController } from "../controllers";
import { catchAsync } from "../utils";
import { auth } from "../middlewares";

const router = Router();

router.post("/register", catchAsync(AuthController.register)); // POST /api/auth/register
router.post("/login", catchAsync(AuthController.login)); // POST /api/auth/login
router.post("/verify", catchAsync(AuthController.verifyToken)); // POST /api/auth/verify (for Authorization header)
router.get("/verify", catchAsync(AuthController.verify)); // GET /api/auth/verify (for cookie verification)
router.post("/logout", auth, catchAsync(AuthController.logout)); // POST /api/auth/logout

export default router;

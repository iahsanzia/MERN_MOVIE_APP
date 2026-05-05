import { Router } from "express";
import { UserController } from "../controllers";
import { catchAsync } from "../utils";

const router = Router();

router.get("/:id", catchAsync(UserController.getProfile)); // GET /api/users/:id

router.put("/:id/profile", catchAsync(UserController.updateProfile)); // PUT /api/users/:id/profile

router.put("/:id/preferences", catchAsync(UserController.updatePreferences)); // PUT /api/users/:id/preferences

router.delete("/:id", catchAsync(UserController.deleteProfile)); // DELETE /api/users/:id

export default router;

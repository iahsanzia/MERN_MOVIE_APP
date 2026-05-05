import { Router } from "express";
import { UserController } from "../controllers";

const router = Router();

router.get("/:id", UserController.getProfile); // GET /api/users/:id

router.put("/:id/profile", UserController.updateProfile); // PUT /api/users/:id/profile

router.put("/:id/preferences", UserController.updatePreferences); // PUT /api/users/:id/preferences

router.delete("/:id", UserController.deleteProfile); // DELETE /api/users/:id

export default router;

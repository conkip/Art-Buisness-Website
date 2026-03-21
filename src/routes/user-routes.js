import express from "express";
import userController from "../controller/user-controller.js";
import guestController from "../controller/guest-controller.js";
import { authenticateToken } from "../utils/auth-utils.js";

const router = express.Router();

// Authenticated user routes
router.get("/me", authenticateToken, userController.getMe);
router.post("/me/likes/:name", authenticateToken, userController.addLike);
router.delete("/me/likes/:name", authenticateToken, userController.removeLike);

// Guest routes
router.get("/guest/likes", guestController.getGuestLikes);
router.post("/guest/likes/:name", guestController.addGuestLike);
router.delete("/guest/likes/:name", guestController.removeGuestLike);

export default router;

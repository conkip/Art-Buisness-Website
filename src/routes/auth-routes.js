import express from "express";
import authController from "../controller/auth-controller.js";
import { authenticateToken, requireAdmin } from "../utils/auth.js";

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/admin-status", requireAdmin, (req, res) =>
    res.json({ isAdmin: true }),
);
router.delete("/delete", authenticateToken, authController.deleteUser);

export default router;

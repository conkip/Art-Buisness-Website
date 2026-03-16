import express from "express";
import multer from "multer";
import adminController from "../controller/admin-controller.js";
import { requireAdmin } from "../utils/auth.js";

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post(
    "/paintings",
    requireAdmin,
    upload.single("image"),
    adminController.uploadPainting,
);

export default router;
